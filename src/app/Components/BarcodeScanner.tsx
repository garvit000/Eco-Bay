"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, CameraOff, RefreshCw } from "lucide-react";

interface Props {
  onDetected: (barcode: string, productName?: string) => void;
  onClose: () => void;
}

/** Tries to look up the barcode on Open Food Facts (free, no key needed). */
async function lookupBarcode(barcode: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json() as {
      status: number;
      product?: { product_name?: string; brands?: string };
    };
    if (data.status !== 1 || !data.product) return null;
    const name = data.product.product_name?.trim();
    const brand = data.product.brands?.trim();
    if (name && brand) return `${brand} – ${name}`;
    return name || brand || null;
  } catch {
    return null;
  }
}

const SCANNER_ID = "eco-bay-barcode-scanner";

export default function BarcodeScanner({ onDetected, onClose }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);

  const [status, setStatus] = useState<"scanning" | "found" | "error">("scanning");
  const [errorMsg, setErrorMsg] = useState("");
  const [detectedBarcode, setDetectedBarcode] = useState("");
  const [productName, setProductName] = useState<string | null>(null);
  const [isLooking, setIsLooking] = useState(false);

  const stopScanner = async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch { /* already stopped */ }
      isScanningRef.current = false;
    }
  };

  const startScanner = async () => {
    await stopScanner();
    setStatus("scanning");
    setDetectedBarcode("");
    setProductName(null);

    try {
      const scanner = new Html5Qrcode(SCANNER_ID, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
        ],
        verbose: false,
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 140 }, aspectRatio: 1.4 },
        async (decodedText) => {
          // Success — stop scanning and look up product
          await stopScanner();
          setDetectedBarcode(decodedText);
          setStatus("found");

          setIsLooking(true);
          const name = await lookupBarcode(decodedText);
          setProductName(name);
          setIsLooking(false);
        },
        () => { /* frame error — ignore, happens every frame without a barcode */ }
      );
      isScanningRef.current = true;
    } catch (err) {
      setStatus("error");
      const msg = String(err);
      if (/permission|notallowed/i.test(msg)) {
        setErrorMsg("Camera access denied. Please allow camera permissions in your browser and try again.");
      } else if (/notfound|nodevice/i.test(msg)) {
        setErrorMsg("No camera found. Please connect a camera and try again.");
      } else {
        setErrorMsg("Could not start the camera. Please check your browser settings.");
      }
    }
  };

  useEffect(() => {
    // Small delay to ensure the DOM element is mounted
    const timer = setTimeout(() => { startScanner(); }, 100);
    return () => {
      clearTimeout(timer);
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    onDetected(detectedBarcode, productName ?? undefined);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Scan Barcode</h2>
            <p className="text-emerald-100 text-xs mt-0.5">Point your camera at a product barcode or QR code</p>
          </div>
          <button
            onClick={() => { stopScanner(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Close scanner"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scanner area — html5-qrcode renders the video here */}
        <div className="relative bg-black">
          {/* This div is where html5-qrcode mounts the video element */}
          <div
            id={SCANNER_ID}
            className="w-full"
            style={{ minHeight: "260px" }}
          />

          {/* Error overlay */}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-4 p-6">
              <CameraOff className="w-12 h-12 text-gray-400" />
              <p className="text-gray-300 text-sm text-center leading-relaxed">{errorMsg}</p>
              <button
                onClick={startScanner}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5">
          {status === "found" ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Barcode Detected ✓</p>
                <p className="font-mono text-gray-800 font-semibold text-lg break-all">{detectedBarcode}</p>
                {isLooking ? (
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
                    <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
                    Looking up product…
                  </p>
                ) : productName ? (
                  <p className="text-sm text-gray-600 mt-1.5">📦 {productName}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1.5">Product not in database — will analyse by barcode number</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={startScanner}
                  className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Scan Again
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLooking}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60 shadow-md"
                >
                  Analyse Sustainability →
                </button>
              </div>
            </div>
          ) : status === "scanning" ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Scanning for barcodes…
              <span className="ml-auto text-xs text-gray-400">EAN · UPC · QR · Code128</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
