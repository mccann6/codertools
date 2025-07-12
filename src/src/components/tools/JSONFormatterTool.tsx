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

export default function JSONFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON format');
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON format');
      setOutput('');
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

  const loadSample = () => {
    const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  },
  "isEmployed": true
}`;
    setInput(sampleJSON);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          JSON Formatter & Validator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Format, validate, and beautify JSON data with customizable indentation. 
          All processing happens in your browser for maximum privacy.
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
        <div className="flex items-center space-x-2">
          <label htmlFor="indent" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Indent Size:
          </label>
          <select
            id="indent"
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={formatJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Format
          </button>
          <button
            onClick={minifyJSON}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Minify
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
          <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Input JSON
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="json-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formatted JSON
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
            <textarea
              id="json-output"
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
            />
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Validation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Instantly validates your JSON and shows detailed error messages
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">🎨</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Formatting</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Beautiful formatting with customizable indentation
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">🔒</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All processing happens locally - your data never leaves your browser
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
