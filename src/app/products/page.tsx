"use client";
import { useState } from "react";
import Navbar from "../Components/navbar";
import { FaLeaf, FaStar, FaShoppingCart, FaLightbulb, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

/** Products below this eco rating get "See Alternative" instead of Add to Cart */
const ECO_THRESHOLD = 3;

const categories = ["All", "Clothing", "Home", "Beauty", "Food", "Accessories"] as const;
type Category = (typeof categories)[number];

interface Product {
  id: number;
  name: string;
  price: number;
  category: Exclude<Category, "All">;
  ecoRating: number;
  badge: string;
  badgeColor: string;
  description: string;
  image: string;
}

const products: Product[] = [
  // ── Eco-friendly products (rating ≥ 3) ─────────────────────────────────────
  {
    id: 1,
    name: "Organic Cotton Tee",
    price: 29.99,
    category: "Clothing",
    ecoRating: 5,
    badge: "Organic",
    badgeColor: "bg-green-100 text-green-700",
    description: "100% GOTS-certified organic cotton, fair-wage-made.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  },
  {
    id: 2,
    name: "Bamboo Toothbrush Set",
    price: 12.99,
    category: "Beauty",
    ecoRating: 5,
    badge: "Zero Waste",
    badgeColor: "bg-teal-100 text-teal-700",
    description: "Biodegradable handles, plant-based bristles. Pack of 4.",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80",
  },
  {
    id: 3,
    name: "Beeswax Food Wraps",
    price: 18.50,
    category: "Home",
    ecoRating: 5,
    badge: "Reusable",
    badgeColor: "bg-yellow-100 text-yellow-700",
    description: "Replace single-use plastic wrap. Washable & reusable 200+ times.",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&q=80",
  },
  {
    id: 4,
    name: "Recycled Denim Tote",
    price: 34.00,
    category: "Accessories",
    ecoRating: 4,
    badge: "Upcycled",
    badgeColor: "bg-blue-100 text-blue-700",
    description: "Crafted from post-consumer recycled denim. Extra sturdy.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80",
  },
  {
    id: 5,
    name: "Organic Acai Powder",
    price: 22.00,
    category: "Food",
    ecoRating: 5,
    badge: "Organic",
    badgeColor: "bg-green-100 text-green-700",
    description: "Raw, freeze-dried, sustainably harvested from the Amazon.",
    image: "https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=400&q=80",
  },
  {
    id: 6,
    name: "Hemp Moisturiser",
    price: 27.99,
    category: "Beauty",
    ecoRating: 4,
    badge: "Vegan",
    badgeColor: "bg-emerald-100 text-emerald-700",
    description: "Cold-pressed hemp seed oil. Cruelty-free, glass packaging.",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&q=80",
  },
  {
    id: 7,
    name: "Solar-Powered Lantern",
    price: 45.00,
    category: "Home",
    ecoRating: 5,
    badge: "Solar",
    badgeColor: "bg-amber-100 text-amber-700",
    description: "Charges in 6 hrs of sunlight. Lasts 12 hrs on a full charge.",
    image: "https://images.unsplash.com/photo-1524725407048-1117e2d45e64?w=400&q=80",
  },
  {
    id: 8,
    name: "Plant-Based Sneakers",
    price: 89.99,
    category: "Clothing",
    ecoRating: 4,
    badge: "Vegan",
    badgeColor: "bg-emerald-100 text-emerald-700",
    description: "Corn leather upper, natural rubber sole. Carbon-neutral shipping.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    id: 9,
    name: "Compostable Bin Liners",
    price: 9.99,
    category: "Home",
    ecoRating: 5,
    badge: "Compostable",
    badgeColor: "bg-lime-100 text-lime-700",
    description: "Certified EN13432 compostable. Pack of 30, 10L size.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    id: 10,
    name: "Reusable Coffee Cup",
    price: 19.99,
    category: "Accessories",
    ecoRating: 5,
    badge: "Zero Waste",
    badgeColor: "bg-teal-100 text-teal-700",
    description: "12oz glass & silicone. Leak-proof lid, dishwasher-safe.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  },
  {
    id: 11,
    name: "Whole-Grain Granola",
    price: 14.50,
    category: "Food",
    ecoRating: 4,
    badge: "Organic",
    badgeColor: "bg-green-100 text-green-700",
    description: "Oats, seeds & dried fruit. Plastic-free kraft paper bag.",
    image: "https://images.unsplash.com/photo-1517093728267-0b8ea7430b44?w=400&q=80",
  },
  {
    id: 12,
    name: "Linen Throw Blanket",
    price: 59.00,
    category: "Home",
    ecoRating: 4,
    badge: "Natural",
    badgeColor: "bg-stone-100 text-stone-700",
    description: "100% European flax linen. Free of dyes or chemical finishes.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
  },
  // ── Below-threshold products (ecoRating < 3) — will show "See Alternative" ─
  {
    id: 13,
    name: "Synthetic Polyester Jacket",
    price: 49.99,
    category: "Clothing",
    ecoRating: 2,
    badge: "Conventional",
    badgeColor: "bg-red-100 text-red-600",
    description: "Standard polyester blend. High microplastic shedding in wash.",
    image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&q=80",
  },
  {
    id: 14,
    name: "Plastic Cling Wrap (100m)",
    price: 5.99,
    category: "Home",
    ecoRating: 1,
    badge: "Single-Use",
    badgeColor: "bg-red-100 text-red-600",
    description: "Conventional single-use PVC food wrap. Non-recyclable.",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80",
  },
  {
    id: 15,
    name: "Chemical Sunscreen SPF50",
    price: 12.50,
    category: "Beauty",
    ecoRating: 2,
    badge: "Conventional",
    badgeColor: "bg-orange-100 text-orange-600",
    description: "Oxybenzone-based UV filter. Harmful to coral reefs.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
  },
];

// ── AI recommendation result type ─────────────────────────────────────────────
interface Recommendation {
  name: string;
  desc: string;
  why: string;
  rating: number;
}

async function fetchRecommendations(productName: string, category: string): Promise<Recommendation[]> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `I want eco-friendly alternatives to: "${productName}" in the ${category} category.`,
      mode: "recommend",
    }),
  });
  if (!res.ok) throw new Error("Failed to get recommendations");
  const data = await res.json() as { text?: string };
  const text = data.text ?? "";

  const get = (prefix: string) =>
    text.match(new RegExp(`${prefix}:\\s*(.+)`, "i"))?.[1]?.trim() ?? "";

  return [1, 2, 3].map((n) => ({
    name: get(`REC${n}_NAME`),
    desc: get(`REC${n}_DESC`),
    why: get(`REC${n}_WHY`),
    rating: parseFloat(get(`REC${n}_RATING`)) || 4.0,
  })).filter((r) => r.name);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          style={{ fontSize: size }}
          className={s <= rating ? "text-yellow-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

function EcoRatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 4 ? "bg-green-50 text-green-700 border-green-200" :
    rating >= 3 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
    "bg-red-50 text-red-600 border-red-200";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${color}`}>
      Eco {rating}/5
    </span>
  );
}

// ── Alternative suggestion modal ──────────────────────────────────────────────
function AlternativeModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [recs, setRecs] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch on mount
  useState(() => {
    fetchRecommendations(product.name, product.category)
      .then((r) => { setRecs(r); setLoading(false); })
      .catch(() => { setError("Could not load recommendations."); setLoading(false); });
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-5 flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide mb-1">Eco-Friendly Alternatives</p>
            <h2 className="text-white font-bold text-lg leading-tight">
              Better options than &quot;{product.name}&quot;
            </h2>
            <p className="text-emerald-100 text-xs mt-1">
              This product scored {product.ecoRating}/5 — here&apos;s what our AI recommends instead
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0 ml-3"
          >
            <FaTimes className="text-white text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">EcoBay AI is finding alternatives…</p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center py-8">{error}</p>
          )}

          {recs && recs.length > 0 && (
            <div className="space-y-4">
              {recs.map((rec, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{rec.name}</h3>
                    <div className="shrink-0">
                      <StarRating rating={Math.round(rec.rating)} size={11} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 leading-relaxed">{rec.desc}</p>
                  <div className="flex items-start gap-1.5">
                    <FaLeaf className="text-emerald-500 mt-0.5 shrink-0" size={10} />
                    <p className="text-xs text-emerald-700 leading-relaxed">{rec.why}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recs && recs.length === 0 && !loading && (
            <p className="text-gray-500 text-sm text-center py-8">
              No alternatives found. Try searching the products page!
            </p>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400">Powered by EcoBay AI</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-full transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ product, onDone }: { product: Product; onDone: () => void }) {
  useState(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  });
  return (
    <div className="fixed bottom-24 right-6 z-[300] animate-slide-up">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-xs">
        <span className="text-emerald-400 text-lg">✓</span>
        <div>
          <p className="font-medium text-sm">{product.name}</p>
          <p className="text-gray-400 text-xs">Added to cart</p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { addItem, items } = useCart();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [alternativeProduct, setAlternativeProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<Product | null>(null);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      ecoRating: product.ecoRating,
    });
    setToast(product);
  };

  const getCartQty = (id: number) =>
    items.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <>
      <Navbar />

      {/* Alternative modal */}
      {alternativeProduct && (
        <AlternativeModal
          product={alternativeProduct}
          onClose={() => setAlternativeProduct(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast product={toast} onDone={() => setToast(null)} />
      )}

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 py-14 px-6 text-center text-white">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Eco-Friendly Products
          </h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-lg">
            Every item is vetted for sustainability. Low-rated products show greener alternatives powered by our AI.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Eco rating ≥ {ECO_THRESHOLD} — Add to cart
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-400" />
              Eco rating &lt; {ECO_THRESHOLD} — AI suggests better options
            </span>
          </div>

          <p className="text-sm text-gray-400 mb-6 text-center">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const belowThreshold = product.ecoRating < ECO_THRESHOLD;
              const cartQty = getCartQty(product.id);

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-lg ${
                    belowThreshold ? "border-orange-100" : "border-gray-100"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover ${belowThreshold ? "opacity-80" : ""}`}
                    />
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${product.badgeColor}`}
                    >
                      {product.badge}
                    </span>
                    {belowThreshold && (
                      <div className="absolute inset-0 bg-orange-900/10 flex items-end">
                        <div className="w-full bg-orange-500/90 text-white text-xs font-semibold py-1 text-center">
                          ⚠️ Low eco score
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</h3>
                      <span className="text-emerald-600 font-bold text-sm ml-auto whitespace-nowrap">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <StarRating rating={product.ecoRating} />
                      <EcoRatingBadge rating={product.ecoRating} />
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed flex-grow">{product.description}</p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <FaLeaf size={10} />
                        {product.category}
                      </span>

                      {belowThreshold ? (
                        <button
                          onClick={() => setAlternativeProduct(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-sm"
                        >
                          <FaLightbulb size={10} />
                          See Alternative
                        </button>
                      ) : cartQty > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-emerald-600 font-semibold">
                            In cart ({cartQty})
                          </span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                            title="Add another"
                          >
                            <FaShoppingCart size={10} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 shadow-sm"
                        >
                          <FaShoppingCart size={10} />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
