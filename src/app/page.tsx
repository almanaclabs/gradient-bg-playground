"use client";

import { useState } from "react";

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export default function Home() {
  const [pickedColor, setPickedColor] = useState<string>("#3b82f6");
  const [hueAdjustment, setHueAdjustment] = useState<number>(30);
  const [saturationAdjustment, setSaturationAdjustment] = useState<number>(10);
  const [lightnessAdjustment, setLightnessAdjustment] = useState<number>(15);

  // Convert hex to HSL
  const hexToHSL = (hex: string): HSLColor => {
    // Remove the # if present
    hex = hex.replace("#", "");

    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Get the modified color based on the picked color
  const getModifiedColor = (): string => {
    const hsl = hexToHSL(pickedColor);
    const modifiedHSL = {
      h: (hsl.h + hueAdjustment + 360) % 360, // Add hue adjustment, wrap around 360
      s: Math.max(0, Math.min(100, hsl.s + saturationAdjustment)), // Add saturation adjustment, clamp between 0-100
      l: Math.max(0, Math.min(100, hsl.l + lightnessAdjustment)), // Add lightness adjustment, clamp between 0-100
    };
    return hslToHex(modifiedHSL.h, modifiedHSL.s, modifiedHSL.l);
  };

  const modifiedColor = getModifiedColor();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Color Gradient Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Color Picker */}
            <div className="space-y-2">
              <label
                htmlFor="color-picker"
                className="block text-sm font-medium text-gray-700"
              >
                Pick a Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="color-picker"
                  type="color"
                  value={pickedColor}
                  onChange={(e) => setPickedColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600 font-mono">
                  {pickedColor}
                </span>
              </div>
            </div>

            {/* HSL Adjustments */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">HSL Adjustments</h3>

              {/* Hue Adjustment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">Hue (H)</label>
                  <span className="text-sm font-mono text-gray-800">
                    {hueAdjustment > 0 ? "+" : ""}
                    {hueAdjustment}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={hueAdjustment}
                  onChange={(e) => setHueAdjustment(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Saturation Adjustment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">
                    Saturation (S)
                  </label>
                  <span className="text-sm font-mono text-gray-800">
                    {saturationAdjustment > 0 ? "+" : ""}
                    {saturationAdjustment}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={saturationAdjustment}
                  onChange={(e) =>
                    setSaturationAdjustment(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Lightness Adjustment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">Lightness (L)</label>
                  <span className="text-sm font-mono text-gray-800">
                    {lightnessAdjustment > 0 ? "+" : ""}
                    {lightnessAdjustment}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={lightnessAdjustment}
                  onChange={(e) =>
                    setLightnessAdjustment(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Color Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Original Color</h3>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: pickedColor }}
                  />
                  <span className="font-mono">{pickedColor}</span>
                </div>
                <div className="text-xs text-gray-500">
                  HSL: ({hexToHSL(pickedColor).h}, {hexToHSL(pickedColor).s}%,{" "}
                  {hexToHSL(pickedColor).l}%)
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Modified Color</h3>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: modifiedColor }}
                  />
                  <span className="font-mono">{modifiedColor}</span>
                </div>
                <div className="text-xs text-gray-500">
                  HSL: ({hexToHSL(modifiedColor).h}, {hexToHSL(modifiedColor).s}
                  %, {hexToHSL(modifiedColor).l}%)
                </div>
              </div>
            </div>

            {/* CSS Code */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">CSS Code</h3>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-x-auto">
                {`background: linear-gradient(to top, ${pickedColor}, ${modifiedColor});`}
              </div>
              <div className="text-xs text-gray-500">
                HSL adjustments: H{hueAdjustment > 0 ? "+" : ""}
                {hueAdjustment}° S{saturationAdjustment > 0 ? "+" : ""}
                {saturationAdjustment}% L{lightnessAdjustment > 0 ? "+" : ""}
                {lightnessAdjustment}%
              </div>
            </div>
          </div>

          {/* Right Column - Gradient Display */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">
              Linear Gradient Preview
            </h3>
            <div
              className="w-full h-64 rounded-lg border border-gray-300 shadow-inner"
              style={{
                background: `linear-gradient(to top, ${pickedColor}, ${modifiedColor})`,
              }}
            />
            <div className="text-sm text-gray-600 text-center">
              From <span className="font-mono">{pickedColor}</span> to{" "}
              <span className="font-mono">{modifiedColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
