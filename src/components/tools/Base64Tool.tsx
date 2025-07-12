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

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch {
      setError('Failed to encode: Invalid characters detected');
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch {
      setError('Failed to decode: Invalid Base64 string');
      setOutput('');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const swapInputOutput = () => {
    if (output && !error) {
      setInput(output);
      setOutput('');
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('Hello, World! This is a sample text for Base64 encoding.');
    } else {
      setInput('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4=');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Base64 Encoder & Decoder
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Encode text to Base64 or decode Base64 strings back to readable text. 
          Perfect for encoding data for APIs, URLs, and data transmission.
        </p>
        
        {/* Ad placeholder */}
        <div className="mb-6">
          <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Banner Ad Space (728x90)</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Decode
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleProcess}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button
            onClick={swapInputOutput}
            disabled={!output || !!error}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Swap ⇄
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Load Sample
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <label htmlFor="base64-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            id="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' 
              ? 'Enter text to encode to Base64...' 
              : 'Enter Base64 string to decode...'
            }
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Characters: {input.length}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="base64-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === 'encode' ? 'Base64 Encoded' : 'Decoded Text'}
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {copied ? (
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
            )}
          </div>
          
          {error ? (
            <div className="w-full h-96 p-4 border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-red-600 dark:text-red-400 font-medium mb-2">Error:</div>
              <div className="text-red-700 dark:text-red-300 font-mono text-sm">{error}</div>
            </div>
          ) : (
            <>
              <textarea
                id="base64-output"
                value={output}
                readOnly
                placeholder={mode === 'encode' 
                  ? 'Base64 encoded text will appear here...' 
                  : 'Decoded text will appear here...'
                }
                className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
              {output && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Characters: {output.length}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="mt-12">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            About Base64 Encoding
          </h2>
          <div className="text-blue-800 dark:text-blue-400 space-y-2 text-sm">
            <p>
              Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format. 
              It&apos;s commonly used for encoding data in email systems, URLs, and web APIs.
            </p>
            <p>
              <strong>Common use cases:</strong> Email attachments, embedding images in HTML/CSS, 
              API authentication tokens, and data transmission over text-based protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Processing</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Instant encoding and decoding with real-time character count
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">🔄</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bidirectional</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Encode to Base64 or decode from Base64 with one click swap
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">🔒</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All processing happens locally - your data stays in your browser
          </p>
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
