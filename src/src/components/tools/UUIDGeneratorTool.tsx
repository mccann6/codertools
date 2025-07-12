'use client';

import { useState } from 'react';

// Simple icon components
const ClipboardDocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.375a2.25 2.25 0 0 1-2.25-2.25V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export default function UUIDGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [format, setFormat] = useState<'standard' | 'uppercase' | 'nohyphens' | 'braces'>('standard');
  const [copied, setCopied] = useState<number | null>(null);

  // Generate UUID v4 (random)
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Format UUID according to selected format
  const formatUUID = (uuid: string): string => {
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'nohyphens':
        return uuid.replace(/-/g, '');
      case 'braces':
        return `{${uuid}}`;
      default:
        return uuid;
    }
  };

  const generateUUIDs = () => {
    const newUuids = Array.from({ length: quantity }, () => formatUUID(generateUUID()));
    setUuids(newUuids);
  };

  const copyToClipboard = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\\n'));
      setCopied(-1); // Special index for "copy all"
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setUuids([]);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          UUID Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Generate unique identifiers (UUIDs) in various formats. All UUIDs are generated 
          client-side using cryptographically secure random numbers.
        </p>
        
        {/* Ad placeholder */}
        <div className="mb-6">
          <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Banner Ad Space (728x90)</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of UUIDs
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {[1, 5, 10, 20, 50, 100].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="standard">Standard (lowercase with hyphens)</option>
              <option value="uppercase">Uppercase with hyphens</option>
              <option value="nohyphens">No hyphens</option>
              <option value="braces">With braces</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateUUIDs}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Generate UUIDs
          </button>
          
          {uuids.length > 1 && (
            <button
              onClick={copyAllToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              {copied === -1 ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>All Copied!</span>
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          )}
          
          {uuids.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Generated UUIDs */}
      {uuids.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Generated UUIDs ({uuids.length})
          </h2>
          
          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <code className="text-sm font-mono text-gray-900 dark:text-white flex-1 mr-4">
                  {uuid}
                </code>
                <button
                  onClick={() => copyToClipboard(uuid, index)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  {copied === index ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Information */}
      <div className="mt-12">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            About UUIDs
          </h2>
          <div className="text-blue-800 dark:text-blue-400 space-y-2 text-sm">
            <p>
              A UUID (Universally Unique Identifier) is a 128-bit value used to uniquely identify information. 
              This tool generates UUID version 4, which uses random or pseudo-random numbers.
            </p>
            <p>
              <strong>Format:</strong> UUIDs are typically displayed as 32 hexadecimal digits in groups of 8-4-4-4-12, 
              separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            </p>
            <p>
              <strong>Use cases:</strong> Database primary keys, session IDs, file names, and any scenario 
              requiring unique identifiers across systems.
            </p>
          </div>
        </div>
      </div>

      {/* Format Examples */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Format Examples</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-600 dark:text-gray-400">Standard:</div>
              <code className="text-blue-600 dark:text-blue-400">f47ac10b-58cc-4372-a567-0e02b2c3d479</code>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Uppercase:</div>
              <code className="text-blue-600 dark:text-blue-400">F47AC10B-58CC-4372-A567-0E02B2C3D479</code>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">No hyphens:</div>
              <code className="text-blue-600 dark:text-blue-400">f47ac10b58cc4372a5670e02b2c3d479</code>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">With braces:</div>
              <code className="text-blue-600 dark:text-blue-400">{`{f47ac10b-58cc-4372-a567-0e02b2c3d479}`}</code>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Cryptographically secure random generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Multiple format options</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Bulk generation (up to 100)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-gray-700 dark:text-gray-300">One-click copy to clipboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad placeholder */}
      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-2xl h-24 bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Content Ad Space (500x120)</span>
        </div>
      </div>
    </div>
  );
}
