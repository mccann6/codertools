'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function XMLFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatXML = (xml: string, indent: number): string => {
    let formatted = '';
    let indentLevel = 0;
    const indentStr = ' '.repeat(indent);
    
    // Remove extra whitespace and newlines
    xml = xml.replace(/>\s*</g, '><').trim();
    
    let i = 0;
    while (i < xml.length) {
      if (xml[i] === '<') {
        // Find the end of the tag
        const tagEnd = xml.indexOf('>', i);
        if (tagEnd === -1) break;
        
        const tag = xml.substring(i, tagEnd + 1);
        
        // Check if it's a closing tag
        if (tag.startsWith('</')) {
          indentLevel--;
          formatted += indentStr.repeat(Math.max(0, indentLevel)) + tag + '\n';
        }
        // Check if it's a self-closing tag
        else if (tag.endsWith('/>')) {
          formatted += indentStr.repeat(indentLevel) + tag + '\n';
        }
        // Opening tag
        else {
          formatted += indentStr.repeat(indentLevel) + tag + '\n';
          indentLevel++;
        }
        
        i = tagEnd + 1;
      } else {
        // Text content
        let nextTag = xml.indexOf('<', i);
        if (nextTag === -1) nextTag = xml.length;
        
        const content = xml.substring(i, nextTag).trim();
        if (content) {
          formatted += indentStr.repeat(indentLevel) + content + '\n';
        }
        
        i = nextTag;
      }
    }
    
    return formatted.trim();
  };

  const isValidXML = (xmlString: string): boolean => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const parseError = doc.querySelector('parsererror');
      return !parseError;
    } catch {
      return false;
    }
  };

  const handleFormat = () => {
    setError('');
    setOutput('');
    
    if (!input.trim()) {
      setError('Please enter XML data to format');
      return;
    }
    
    try {
      if (!isValidXML(input)) {
        setError('Invalid XML: Please check your XML syntax');
        return;
      }
      
      const formatted = formatXML(input, indentSize);
      setOutput(formatted);
    } catch (err) {
      setError(`Formatting error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleMinify = () => {
    setError('');
    setOutput('');
    
    if (!input.trim()) {
      setError('Please enter XML data to minify');
      return;
    }
    
    try {
      if (!isValidXML(input)) {
        setError('Invalid XML: Please check your XML syntax');
        return;
      }
      
      // Remove extra whitespace, newlines, and indentation
      const minified = input
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
      
      setOutput(minified);
    } catch (err) {
      setError(`Minifying error: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    setError('');
  };

  const loadExample = () => {
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
<book id="1">
<title>The Great Gatsby</title>
<author>F. Scott Fitzgerald</author>
<price currency="USD">12.99</price>
<category>Fiction</category>
</book>
<book id="2">
<title>To Kill a Mockingbird</title>
<author>Harper Lee</author>
<price currency="USD">14.99</price>
<category>Fiction</category>
</book>
</bookstore>`;
    setInput(example);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          XML Formatter
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Format, validate, and beautify XML data with proper indentation and structure.
        </p>
      </div>

      {/* Options */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Indent Size:
          </label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>
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
          XML Input:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter XML data to format..."
          className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleFormat}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Format XML
        </button>
        <button
          onClick={handleMinify}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Minify XML
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Clear
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formatted XML:
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
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
          />
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">XML Formatting Features</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Validates XML syntax before formatting</li>
          <li>• Properly indents nested elements for better readability</li>
          <li>• Supports custom indentation sizes (2, 4, or 8 spaces)</li>
          <li>• Minification option to remove unnecessary whitespace</li>
          <li>• Preserves XML declaration and attributes</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
