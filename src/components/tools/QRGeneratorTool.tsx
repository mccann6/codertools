'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { copyToClipboard } from '@/lib/utils';

export default function QRGeneratorTool() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [copyStatus, setCopyStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple QR Code generation using a public API
  const generateQRCode = async () => {
    if (!text.trim()) {
      setQrCode('');
      return;
    }

    try {
      // Using QR Server API for generating QR codes
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorLevel}`;
      setQrCode(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQRCodeURL = async () => {
    const success = await copyToClipboard(qrCode);
    setCopyStatus(success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleClear = () => {
    setText('');
    setQrCode('');
  };

  const presetTemplates = [
    { name: 'URL', value: 'https://example.com', description: 'Website URL' },
    { name: 'Email', value: 'mailto:contact@example.com', description: 'Email address' },
    { name: 'Phone', value: 'tel:+1234567890', description: 'Phone number' },
    { name: 'SMS', value: 'sms:+1234567890', description: 'SMS message' },
    { name: 'WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;', description: 'WiFi credentials' },
    { name: 'Location', value: 'geo:37.7749,-122.4194', description: 'GPS coordinates' },
  ];

  const loadTemplate = (template: string) => {
    setText(template);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          QR Code Generator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate QR codes for text, URLs, contact information, and more with customizable options.
        </p>
      </div>

      {/* Quick Templates */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Quick Templates</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {presetTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => loadTemplate(template.value)}
              className="p-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              title={template.description}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Text or URL to encode:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text, URL, email, phone number, or any data..."
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Options */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">QR Code Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Size: {size}x{size} pixels
            </label>
            <input
              type="range"
              min="128"
              max="512"
              step="64"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Correction Level:
            </label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={generateQRCode}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Generate QR Code
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Clear
        </button>
      </div>

      {/* QR Code Display */}
      {qrCode && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generated QR Code</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyQRCodeURL}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                {copyStatus || 'Copy URL'}
              </button>
              <button
                onClick={downloadQRCode}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <Image
                src={qrCode}
                alt="Generated QR Code"
                width={size}
                height={size}
                className="border border-gray-200"
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Size: {size}x{size}px • Error Level: {errorLevel}
            </p>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">QR Code Information</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• QR codes can store text, URLs, contact info, WiFi credentials, and more</li>
          <li>• Higher error correction allows codes to work even when partially damaged</li>
          <li>• Larger sizes are better for printing and scanning from distance</li>
          <li>• Most smartphones can scan QR codes with their camera app</li>
          <li>• Keep content concise for better readability and smaller code size</li>
        </ul>
      </div>

      {/* Example Uses */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">Example Uses</h3>
        <div className="text-sm text-green-800 dark:text-green-400 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>• Website URLs and landing pages</div>
          <div>• Contact information (vCard)</div>
          <div>• WiFi network credentials</div>
          <div>• Event tickets and confirmations</div>
          <div>• Product information and reviews</div>
          <div>• Social media profiles</div>
          <div>• App download links</div>
          <div>• Restaurant menus and ordering</div>
        </div>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>

      {/* Hidden canvas for potential future use */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
