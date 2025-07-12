'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function HTMLEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copyStatus, setCopyStatus] = useState('');

  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#96;',
    '=': '&#x3D;'
  };

  const decodeEntities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#39;': "'",
    '&#x2F;': '/',
    '&#47;': '/',
    '&#96;': '`',
    '&#x3D;': '=',
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™'
  };

  const encodeHTML = (str: string): string => {
    return str.replace(/[&<>"'`=\/]/g, (match) => htmlEntities[match] || match);
  };

  const decodeHTML = (str: string): string => {
    return str.replace(/&[#\w]+;/g, (match) => {
      if (match in decodeEntities) {
        return decodeEntities[match];
      }
      // Handle numeric entities like &#65; or &#x41;
      if (match.startsWith('&#x')) {
        const hex = match.slice(3, -1);
        const code = parseInt(hex, 16);
        return isNaN(code) ? match : String.fromCharCode(code);
      } else if (match.startsWith('&#')) {
        const dec = match.slice(2, -1);
        const code = parseInt(dec, 10);
        return isNaN(code) ? match : String.fromCharCode(code);
      }
      return match;
    });
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      setOutput(encodeHTML(input));
    } else {
      setOutput(decodeHTML(input));
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

  const exampleTexts = {
    encode: '<div class="example">Hello "World" & <span>friends</span>!</div>',
    decode: '&lt;div class=&quot;example&quot;&gt;Hello &quot;World&quot; &amp; &lt;span&gt;friends&lt;/span&gt;!&lt;/div&gt;'
  };

  const loadExample = () => {
    setInput(exampleTexts[mode]);
    if (mode === 'encode') {
      setOutput(encodeHTML(exampleTexts[mode]));
    } else {
      setOutput(decodeHTML(exampleTexts[mode]));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          HTML Encoder/Decoder
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Encode and decode HTML entities, escape special characters for safe HTML output.
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
          Input HTML to {mode}:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter HTML to ${mode}...`}
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleProcess}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {mode === 'encode' ? 'Encode HTML' : 'Decode HTML'}
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
              {mode === 'encode' ? 'Encoded' : 'Decoded'} HTML:
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
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
          />
        </div>
      )}

      {/* Common HTML Entities Reference */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Common HTML Entities</h3>
        <div className="text-sm text-blue-800 dark:text-blue-400 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>&lt; = &amp;lt;</div>
          <div>&gt; = &amp;gt;</div>
          <div>&amp; = &amp;amp;</div>
          <div>&quot; = &amp;quot;</div>
          <div>&#39; = &amp;#39;</div>
          <div>&nbsp; = &amp;nbsp;</div>
          <div>© = &amp;copy;</div>
          <div>® = &amp;reg;</div>
        </div>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
