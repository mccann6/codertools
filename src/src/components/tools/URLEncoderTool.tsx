'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function URLEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copyStatus, setCopyStatus] = useState('');

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    setCopyStatus(success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const exampleUrls = {
    encode: 'https://example.com/search?q=hello world&category=web development',
    decode: 'https%3A//example.com/search%3Fq%3Dhello%20world%26category%3Dweb%20development'
  };

  const loadExample = () => {
    setInput(exampleUrls[mode]);
    if (mode === 'encode') {
      setOutput(encodeURIComponent(exampleUrls[mode]));
    } else {
      setOutput(decodeURIComponent(exampleUrls[mode]));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          URL Encoder/Decoder
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Encode and decode URLs, handle special characters, and format URLs properly for web development.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-4">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Decode
        </button>
        <button
          onClick={loadExample}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Load Example
        </button>
      </div>

      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Input URL to {mode}:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter URL to ${mode}...`}
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleProcess}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Clear
        </button>
      </div>

      {/* Output Section */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === 'encode' ? 'Encoded' : 'Decoded'} URL:
            </label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {copyStatus || 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
          />
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">About URL Encoding</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• URL encoding (percent encoding) converts special characters to % followed by hex values</li>
          <li>• Required for spaces, non-ASCII characters, and reserved characters in URLs</li>
          <li>• Space becomes %20, & becomes %26, ? becomes %3F, etc.</li>
          <li>• Essential for proper URL handling in web applications</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
