"use client";
import Link from "next/link";
import { FaLeaf, FaShoppingBag, FaRecycle, FaLink, FaBarcode, FaEnvelope, FaStar, FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(() => import("./BarcodeScanner"), { ssr: false });

interface SustainabilityResult {
  rating: number;
  reason: string;
  tip: string;
  ingredients?: string;
  alternatives?: string;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 12;

type CachedSustainability = {
  value: SustainabilityResult;
  savedAt: number;
};

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseField(text: string, labels: string[]): string | undefined {
  const labelPattern = labels.map(escapeRegex).join("|");
  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:${labelPattern})\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Z /_-]{2,}\\s*:|$)`,
    "i"
  );
  const value = text.match(regex)?.[1]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function cacheKey(input: string): string {
  return `ecobay:sustainability:${normalizeInput(input)}`;
}

function isWeakReason(value?: string): boolean {
  if (!value) return true;
  const clean = value.trim();
  return clean.length < 35 || clean.split(/\s+/).length < 8;
}

function isUnknownIngredients(value?: string): boolean {
  if (!value) return true;
  const text = value.toLowerCase();
  return [
    "not available",
    "unknown",
    "not enough data",
    "information unavailable",
    "n/a",
    "none",
  ].some((term) => text.includes(term));
}

function inferIngredientsFromInput(input: string): string {
  const source = input.toLowerCase();
  const picks: string[] = [];

  if (source.includes("rice")) picks.push("rice water extract/ferment");
  if (source.includes("niacinamide")) picks.push("niacinamide (vitamin B3)");
  if (source.includes("soap") || source.includes("cleanser") || source.includes("face wash")) {
    picks.push("plant-derived surfactants", "glycerin");
  }
  if (source.includes("shampoo")) picks.push("mild cleansing surfactants", "conditioning polymers");
  if (source.includes("cream") || source.includes("moistur")) picks.push("emollients", "humectants");
  if (source.includes("bamboo")) picks.push("bamboo fiber/cellulose");
  if (source.includes("plastic")) picks.push("polyethylene/polypropylene");

  const base = ["water", "botanical extracts", "preservatives"];
  const merged = [...picks, ...base].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 5);
  return merged.join(", ");
}

function buildReasonFallback(rating: number, input: string): string {
  const topic = input.length > 80 ? "this product" : input;
  if (rating >= 4.0) {
    return `${topic} appears to score well due to likely lower-impact materials, better sustainability positioning, and comparatively stronger eco alternatives than conventional options.`;
  }
  if (rating >= 2.5) {
    return `${topic} seems moderately sustainable: there are some positive material or brand signals, but trade-offs remain around sourcing transparency, packaging, and lifecycle impact.`;
  }
  return `${topic} likely has weaker sustainability performance due to higher-impact materials or limited transparency, so greener alternatives with certified sourcing are usually a better choice.`;
}

async function analyseSustainability(input: string): Promise<SustainabilityResult> {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(cacheKey(input));
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CachedSustainability;
        if (Date.now() - parsed.savedAt < CACHE_TTL_MS) {
          return parsed.value;
        }
      } catch {
        // ignore malformed cache and continue with live call
      }
    }
  }

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `Analyse the sustainability of this product: ${input}`,
      mode: "sustainability",
    }),
  });

  // Always read the body so we can extract the real error message
  const data = await response.json() as { text?: string; error?: string };

  if (!response.ok) {
    const msg = data.error ?? `AI returned ${response.status}`;
    throw new Error(msg);
  }

  const text = data.text ?? "";
  if (!text.trim()) throw new Error("AI returned an empty response. Please try again.");

  const ratingMatch = text.match(/RATING:\s*([0-5](?:\.\d+)?)/i);
  const reason = parseField(text, ["REASON", "WHY", "JUSTIFICATION"]);
  const tip = parseField(text, ["TIP", "ECO TIP"]);
  const ingredients = parseField(text, [
    "INGREDIENTS",
    "MATERIALS",
    "INGREDIENTS / MATERIALS",
    "INGREDIENTS/MATERIALS",
  ]);
  const alternatives = parseField(text, ["ALTERNATIVES", "GREENER ALTERNATIVES"]);

  if (!ratingMatch) throw new Error("AI could not parse a rating from this product. Try a product name or brand instead of a URL.");

  const result: SustainabilityResult = {
    rating: Math.min(5, Math.max(0, parseFloat(ratingMatch[1]))),
    reason: isWeakReason(reason)
      ? buildReasonFallback(Math.min(5, Math.max(0, parseFloat(ratingMatch[1]))), input)
      : (reason ?? "Based on general sustainability assessment."),
    tip: tip ?? "Look for certified organic or fair-trade alternatives.",
    ingredients: isUnknownIngredients(ingredients)
      ? inferIngredientsFromInput(input)
      : ingredients,
    alternatives: alternatives ?? "No alternatives suggested.",
  };

  if (typeof window !== "undefined") {
    const payload: CachedSustainability = { value: result, savedAt: Date.now() };
    localStorage.setItem(cacheKey(input), JSON.stringify(payload));
  }

  return result;
}

export default function Home() {
  const [productUrl, setProductUrl] = useState("");
  const [result, setResult] = useState<SustainabilityResult | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analyseError, setAnalyseError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheck = async () => {
    if (!productUrl.trim()) return;
    setIsAnalysing(true);
    setAnalyseError("");
    setResult(null);

    try {
      const res = await analyseSustainability(productUrl.trim());
      setResult(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not analyse this product.";
      // Friendly quota message
      if (msg.toLowerCase().includes("busy") || msg.toLowerCase().includes("quota") || msg.includes("429")) {
        setAnalyseError("EcoBay AI is temporarily busy — please wait a few seconds and try again.");
      } else {
        setAnalyseError(msg);
      }
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleScan = () => setShowScanner(true);

  const handleBarcodeDetected = async (barcode: string, productName?: string) => {
    setShowScanner(false);
    const query = productName ? `${productName} (barcode: ${barcode})` : `product with barcode ${barcode}`;
    setProductUrl(query);
    // Auto-trigger analysis
    setIsAnalysing(true);
    setAnalyseError("");
    setResult(null);
    try {
      const res = await analyseSustainability(query);
      setResult(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not analyse this product.";
      if (msg.toLowerCase().includes("busy") || msg.toLowerCase().includes("quota") || msg.includes("429")) {
        setAnalyseError("EcoBay AI is temporarily busy — please wait a few seconds and try again.");
      } else {
        setAnalyseError(msg);
      }
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const getRatingColor = (r: number) =>
    r < 2 ? "from-red-400 to-red-500" : r < 3.5 ? "from-yellow-400 to-yellow-500" : "from-green-400 to-green-600";

  const getRatingLabel = (r: number) =>
    r < 2 ? "Poor Environmental Impact" : r < 3.5 ? "Average Sustainability" : "Excellent Eco-Friendly Choice!";

  const getRatingDesc = (r: number) =>
    r < 2
      ? "This product has significant environmental concerns. Consider exploring greener alternatives."
      : r < 3.5
      ? "This product meets basic sustainability standards but there's room for improvement."
      : "This product exceeds our sustainability standards — great choice for eco-conscious consumers!";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white overflow-hidden">
      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
        />
      )}
      {/* Hero */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-emerald-900 opacity-90 z-0" />
        <div className="absolute inset-0 z-0">
          {mounted && Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-green-400/20 animate-pulse"
              style={{
                width: `${(i * 37 % 80) + 40}px`,
                height: `${(i * 37 % 80) + 40}px`,
                top: `${(i * 53) % 100}%`,
                left: `${(i * 67) % 100}%`,
                animationDuration: `${(i % 5) + 8}s`,
                animationDelay: `${(i % 4)}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-xl tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">EcoBay</span>
          </h1>
          <p className="text-xl md:text-2xl mt-8 max-w-3xl mx-auto text-green-50 font-light leading-relaxed">
            Your premium marketplace for eco-friendly and sustainable products that make a difference for our planet
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/products">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full hover:from-green-600 hover:to-emerald-700 transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-green-500/30 flex items-center gap-3 font-semibold text-lg group">
                <FaShoppingBag className="text-xl" />
                Shop Now
                <FaArrowRight className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-white/10 backdrop-blur-md text-white border-2 border-green-300/50 px-10 py-4 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg font-semibold text-lg group">
                Learn More
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-2">→</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
            <path fill="#f8fafc" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,181.3C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
      </div>

      {/* Sustainability Checker */}
      <div id="eco-checker" className="max-w-5xl mx-auto py-24 px-6 relative">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold tracking-wide mb-4">ECO CHECKER</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Check Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">Sustainability</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter a product URL and let our AI instantly analyse its environmental impact and give you a real sustainability rating.
          </p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex flex-col md:flex-row gap-5 mb-8">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLink className="text-green-500" />
              </div>
              <input
                type="text"
                placeholder="Enter product URL, name, or brand"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-gray-700"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCheck(); }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCheck}
                disabled={isAnalysing || !productUrl.trim()}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAnalysing ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing…</>
                ) : "Check Now"}
              </button>
              <button
                onClick={handleScan}
                disabled={isAnalysing}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-60"
              >
                <FaBarcode className={isAnalysing ? "animate-pulse" : ""} />
                {isAnalysing ? "Scanning…" : "Scan Barcode"}
              </button>
            </div>
          </div>

          {analyseError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {analyseError}
            </div>
          )}

          {result && (
            <div className="mt-10 p-8 border border-green-100 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-inner">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <FaLeaf className="mr-3 text-green-500" /> AI Sustainability Analysis
              </h3>
              <div className="flex flex-col gap-5">
                {/* Rating bar */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner">
                    <div
                      className={`h-8 rounded-full bg-gradient-to-r ${getRatingColor(result.rating)} transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                      style={{ width: `${(result.rating / 5) * 100}%` }}
                    >
                      {result.rating >= 3.5 && <span className="text-white text-xs font-bold">Excellent!</span>}
                    </div>
                  </div>
                  <div className="flex items-baseline bg-white py-2 px-4 rounded-full shadow-md">
                    <span className="font-bold text-xl text-gray-800">{result.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-medium">/5.0</span>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <FaStar key={s} className={s <= Math.round(result.rating) ? "text-yellow-400 text-xl" : "text-gray-200 text-xl"} />
                  ))}
                  <span className="ml-2 text-sm text-gray-500 font-medium">{getRatingLabel(result.rating)}</span>
                </div>
                {/* Details */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Assessment</p>
                    <p className="text-gray-700">{getRatingDesc(result.rating)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Why</p>
                    <p className="text-gray-700">{result.reason}</p>
                  </div>
                  {result.ingredients && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ingredients / Materials</p>
                      <p className="text-gray-700">{result.ingredients}</p>
                    </div>
                  )}
                  {result.alternatives && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Greener Alternatives</p>
                      <p className="text-gray-700">{result.alternatives}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">💡 Eco Tip</p>
                    <p className="text-gray-700">{result.tip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold tracking-wide mb-4">WHY CHOOSE US</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">EcoBay</span> Difference</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">We&apos;re committed to making sustainable shopping accessible, transparent, and impactful</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
          {[
            { icon: FaLeaf, color: "from-green-400 to-green-600", title: "Sustainable Products", desc: "All products are rigorously vetted to meet the highest sustainability standards, ensuring minimal environmental impact." },
            { icon: FaRecycle, color: "from-emerald-400 to-emerald-600", title: "Eco-Friendly Packaging", desc: "We eliminate waste with innovative, minimal, and fully recyclable packaging solutions for all deliveries.", offset: true },
            { icon: FaShoppingBag, color: "from-green-400 to-green-600", title: "Ethical Marketplace", desc: "We partner exclusively with businesses committed to ethical practices, fair trade, and sustainable development." },
          ].map((item) => (
            <div key={item.title} className={`bg-gradient-to-br from-white to-green-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-3 border border-gray-100 ${item.offset ? "md:mt-10" : ""}`}>
              <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                <item.icon className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-emerald-900 skew-y-3 transform origin-top-right -z-10 h-[120%]" />
        <div className="max-w-5xl mx-auto py-28 px-6 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Our Eco-Friendly Community</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get sustainable living tips, early access to new products, and exclusive offers.</p>
            </div>

            {subscribed ? (
              <div className="max-w-lg mx-auto text-center py-4">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-medium">
                  <FaLeaf /> Thanks for subscribing! 🌿
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <FaEnvelope className="text-green-500" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      className="pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">You can unsubscribe at any time. No spam, ever.</p>
              </form>
            )}

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {[{ icon: FaLeaf, label: "Eco Tips" }, { icon: FaShoppingBag, label: "New Products" }, { icon: FaStar, label: "Exclusive Offers" }].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <item.icon className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
