"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { X, Camera, CameraOff, RefreshCw } from "lucide-react";

interface Props {
  onDetected: (barcode: string, productName?: string) => void;
  onClose: () => void;
}

/** Tries to look up the barcode on Open Food Facts (free, no key needed). */
async function lookupBarcode(barcode: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { signal: AbortSignal.timeout(4000) }
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

export default function BarcodeScanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<"idle" | "scanning" | "found" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [detectedBarcode, setDetectedBarcode] = useState("");
  const [productName, setProductName] = useState<string | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraIdx, setActiveCameraIdx] = useState(0);

  const stopScanner = useCallback(() => {
    try { readerRef.current?.reset(); } catch { /* ignore */ }
    // Also stop any lingering media stream tracks
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startScanner = useCallback(async (cameraDeviceId?: string) => {
    if (!videoRef.current) return;
    stopScanner();
    setStatus("scanning");
    setDetectedBarcode("");
    setProductName(null);

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromVideoDevice(
        cameraDeviceId ?? null,
        videoRef.current,
        async (result, err) => {
          if (result) {
            const barcodeValue = result.getText();
            setDetectedBarcode(barcodeValue);
            setStatus("found");
            stopScanner();

            // Try Open Food Facts lookup
            setIsLooking(true);
            const name = await lookupBarcode(barcodeValue);
            setProductName(name);
            setIsLooking(false);
          } else if (err && !(err instanceof NotFoundException)) {
            // Ignore NotFoundException — it's just "no barcode in this frame"
            console.debug("Scanner error:", err);
          }
        }
      );
      // (no controls ref — reader.reset() handles teardown)
    } catch (err) {
      setStatus("error");
      const msg = (err as Error).message ?? "";
      if (msg.includes("Permission") || msg.includes("permission") || msg.includes("NotAllowed")) {
        setErrorMsg("Camera access denied. Please allow camera permissions in your browser and try again.");
      } else {
        setErrorMsg("Could not start the camera. Make sure a camera is connected and no other app is using it.");
      }
    }
  }, [stopScanner]);

  // Enumerate cameras on mount
  useEffect(() => {
    (async () => {
      try {
        // Request permission first (needed to get real device labels)
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setCameras(videoDevices);
        // Prefer back camera on mobile
        const backIdx = videoDevices.findIndex((d) =>
          /back|rear|environment/i.test(d.label)
        );
        const idx = backIdx >= 0 ? backIdx : 0;
        setActiveCameraIdx(idx);
        await startScanner(videoDevices[idx]?.deviceId);
      } catch {
        await startScanner(); // fall back to default camera
      }
    })();

    return () => stopScanner();
  }, [startScanner, stopScanner]);

  const switchCamera = async () => {
    if (cameras.length < 2) return;
    const nextIdx = (activeCameraIdx + 1) % cameras.length;
    setActiveCameraIdx(nextIdx);
    await startScanner(cameras[nextIdx]?.deviceId);
  };

  const handleConfirm = () => {
    onDetected(detectedBarcode, productName ?? undefined);
  };

  const handleRetry = () => {
    startScanner(cameras[activeCameraIdx]?.deviceId);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Scan Barcode</h2>
            <p className="text-emerald-100 text-xs">Point your camera at a product barcode</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Camera view */}
        <div className="relative bg-black" style={{ aspectRatio: "4/3" }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />

          {/* Scanner overlay */}
          {status === "scanning" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Dim corners */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Scan window */}
              <div className="relative z-10 w-56 h-36">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                {/* Scan line */}
                <div className="absolute left-2 right-2 h-0.5 bg-emerald-400/80 animate-scan-line shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <p className="absolute bottom-4 text-white text-xs font-medium tracking-wide">
                Align barcode within the frame
              </p>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-4 p-6">
              <CameraOff className="w-12 h-12 text-gray-400" />
              <p className="text-gray-300 text-sm text-center">{errorMsg}</p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}

          {/* Idle */}
          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-3">
              <Camera className="w-10 h-10 text-gray-400 animate-pulse" />
              <p className="text-gray-400 text-sm">Starting camera…</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5">
          {status === "found" ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Barcode Detected</p>
                <p className="font-mono text-gray-800 font-semibold text-lg">{detectedBarcode}</p>
                {isLooking ? (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
                    Looking up product…
                  </p>
                ) : productName ? (
                  <p className="text-sm text-gray-600 mt-1">📦 {productName}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Product not found in database — will analyse by barcode</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Scanning…
              </div>
              {cameras.length > 1 && (
                <button
                  onClick={switchCamera}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 px-3 py-1.5 border border-emerald-200 rounded-full hover:bg-emerald-50 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Flip Camera
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
