"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, RotateCw, Check, Loader2, Image as ImageIcon, Camera } from "lucide-react";

interface LogoEditorProps {
  image: string;
  onCancel: () => void;
  onSave: (croppedImage: Blob) => void;
}

export default function LogoEditor({ image, onCancel, onSave }: LogoEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const img = await createImage(image);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const maxSize = Math.max(img.width, img.height);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

      canvas.width = safeArea;
      canvas.height = safeArea;

      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeArea / 2, -safeArea / 2);

      ctx.drawImage(
        img,
        safeArea / 2 - img.width * 0.5,
        safeArea / 2 - img.height * 0.5
      );

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + img.width * 0.5 - croppedAreaPixels.x),
        Math.round(0 - safeArea / 2 + img.height * 0.5 - croppedAreaPixels.y)
      );

      return new Promise<Blob>((resolve) => {
        canvas.toBlob((file) => {
          if (file) resolve(file);
        }, "image/png");
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const blob = await getCroppedImg();
    if (blob) {
      onSave(blob);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0a0f1e] rounded-[40px] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-10 pb-6">
          <h3 className="text-3xl font-bold text-white mb-2 font-[var(--font-space)]">
            Crop & <span className="gradient-text">Resize Photo</span>
          </h3>
          <p className="text-[#64748b] text-sm tracking-tight">
            Drag to reposition <span className="mx-2 text-white/20">·</span> Scroll or use slider to zoom
          </p>
        </div>

        {/* Cropper Container */}
        <div className="relative h-[420px] mx-10 rounded-[32px] overflow-hidden bg-black/40 border border-white/5 group">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName: "bg-transparent",
              mediaClassName: "max-h-[380px]",
              cropAreaClassName: "border-2 border-white/30"
            }}
          />
        </div>

        {/* Controls Section */}
        <div className="p-10 pt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Zoom Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                <span className="flex items-center gap-2">ZOOM</span>
                <span className="text-white bg-white/5 px-2 py-0.5 rounded-md">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#a855f7] hover:accent-[#d946ef] transition-all"
              />
            </div>

            {/* Rotate Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                <span className="flex items-center gap-2">ROTATE</span>
                <span className="text-white bg-white/5 px-2 py-0.5 rounded-md">{rotation}°</span>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#a855f7] hover:accent-[#d946ef] transition-all"
              />
            </div>
          </div>

          {/* Info Badge */}
          <div className="flex items-center gap-5 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 group hover:border-purple-500/20 transition-all">
            <div className="w-14 h-14 rounded-full border border-white/10 p-0.5 overflow-hidden bg-black/50 shrink-0">
               <img src={image} alt="Preview" className="w-full h-full object-cover rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-white mb-0.5">Optimized High Quality Photo</p>
              <p className="text-xs text-[#64748b]">Round crop shown in sidebar & portfolio</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onCancel}
              className="w-full sm:flex-1 h-16 rounded-3xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#64748b] bg-[#1e293b]/20 hover:bg-[#1e293b]/40 transition-all border border-white/5 border-dashed"
            >
              <ImageIcon className="w-4 h-4" /> Choose different file
            </button>
            
            <div className="flex w-full sm:w-auto items-center gap-3">
              <button 
                onClick={onCancel}
                className="px-8 h-16 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 sm:flex-none px-10 h-16 rounded-full bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Apply Photo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
