'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

export default function ColorConverterTool() {
  const [color, setColor] = useState<Color>({
    hex: '#ff0000',
    rgb: { r: 255, g: 0, b: 0 },
    hsl: { h: 0, s: 100, l: 50 },
    hsv: { h: 0, s: 100, v: 100 }
  });
  const [copyStatus, setCopyStatus] = useState('');

  // Helper functions for color conversion
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const updateColor = (newHex: string) => {
    const rgb = hexToRgb(newHex);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    setColor({
      hex: newHex,
      rgb,
      hsl,
      hsv
    });
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    const hsv = rgbToHsv(r, g, b);

    setColor({
      hex,
      rgb: { r, g, b },
      hsl,
      hsv
    });
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    setColor({
      hex,
      rgb,
      hsl: { h, s, l },
      hsv
    });
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    setCopyStatus(success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const predefinedColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#000000', '#ffffff', '#808080', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#c0c0c0', '#ffa500', '#a52a2a'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Color Converter
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Convert between different color formats: HEX, RGB, HSL, and HSV with live preview.
        </p>
      </div>

      {/* Color Preview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center mb-4">
          <div 
            className="w-48 h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg"
            style={{ backgroundColor: color.hex }}
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">{color.hex.toUpperCase()}</p>
        </div>
      </div>

      {/* Color Picker */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Color Picker</h3>
        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={color.hex}
            onChange={(e) => updateColor(e.target.value)}
            className="w-16 h-16 rounded border border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            value={color.hex}
            onChange={(e) => updateColor(e.target.value)}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Color Format Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HEX */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">HEX</h4>
            <button
              onClick={() => handleCopy(color.hex)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {copyStatus || 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={color.hex}
            onChange={(e) => updateColor(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
        </div>

        {/* RGB */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">RGB</h4>
            <button
              onClick={() => handleCopy(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              max="255"
              value={color.rgb.r}
              onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, color.rgb.g, color.rgb.b)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              placeholder="R"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={color.rgb.g}
              onChange={(e) => updateFromRgb(color.rgb.r, parseInt(e.target.value) || 0, color.rgb.b)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              placeholder="G"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={color.rgb.b}
              onChange={(e) => updateFromRgb(color.rgb.r, color.rgb.g, parseInt(e.target.value) || 0)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              placeholder="B"
            />
          </div>
        </div>

        {/* HSL */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">HSL</h4>
            <button
              onClick={() => handleCopy(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              max="360"
              value={color.hsl.h}
              onChange={(e) => updateFromHsl(parseInt(e.target.value) || 0, color.hsl.s, color.hsl.l)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              placeholder="H"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={color.hsl.s}
              onChange={(e) => updateFromHsl(color.hsl.h, parseInt(e.target.value) || 0, color.hsl.l)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              placeholder="S"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={color.hsl.l}
              onChange={(e) => updateFromHsl(color.hsl.h, color.hsl.s, parseInt(e.target.value) || 0)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
              placeholder="L"
            />
          </div>
        </div>

        {/* HSV */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">HSV</h4>
            <button
              onClick={() => handleCopy(`hsv(${color.hsv.h}, ${color.hsv.s}%, ${color.hsv.v}%)`)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            H: {color.hsv.h}° S: {color.hsv.s}% V: {color.hsv.v}%
          </div>
        </div>
      </div>

      {/* Predefined Colors */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Predefined Colors</h3>
        <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
          {predefinedColors.map((hexColor) => (
            <button
              key={hexColor}
              onClick={() => updateColor(hexColor)}
              className="w-12 h-12 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
              style={{ backgroundColor: hexColor }}
              title={hexColor}
            />
          ))}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Color Format Information</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• <strong>HEX:</strong> Hexadecimal color codes (e.g., #FF0000)</li>
          <li>• <strong>RGB:</strong> Red, Green, Blue values (0-255)</li>
          <li>• <strong>HSL:</strong> Hue (0-360°), Saturation (0-100%), Lightness (0-100%)</li>
          <li>• <strong>HSV:</strong> Hue (0-360°), Saturation (0-100%), Value/Brightness (0-100%)</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
