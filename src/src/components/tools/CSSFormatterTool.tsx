'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function CSSFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatCSS = (css: string, indent: number): string => {
    const indentStr = ' '.repeat(indent);
    let formatted = '';
    let indentLevel = 0;
    let inRule = false;
    
    // Remove extra whitespace and normalize
    css = css.replace(/\s+/g, ' ').trim();
    
    let i = 0;
    while (i < css.length) {
      const char = css[i];
      
      if (char === '{') {
        formatted += ' {\n';
        indentLevel++;
        inRule = true;
        i++;
      } else if (char === '}') {
        if (formatted.endsWith('\n')) {
          formatted = formatted.slice(0, -1);
        }
        formatted += '\n';
        indentLevel--;
        formatted += indentStr.repeat(Math.max(0, indentLevel)) + '}\n\n';
        inRule = false;
        i++;
      } else if (char === ';' && inRule) {
        formatted += ';\n';
        i++;
      } else if (char === ',' && !inRule) {
        formatted += ',\n' + indentStr.repeat(indentLevel);
        i++;
        // Skip whitespace after comma
        while (i < css.length && css[i] === ' ') i++;
        continue;
      } else {
        // Check if we're starting a new line after { or ;
        if ((formatted.endsWith('{\n') || formatted.endsWith(';\n')) && char !== ' ') {
          formatted += indentStr.repeat(indentLevel);
        }
        // Check if we're starting a selector
        if (!inRule && formatted.endsWith('\n\n') && char !== ' ') {
          formatted += indentStr.repeat(indentLevel);
        }
        
        formatted += char;
        i++;
      }
    }
    
    return formatted.trim();
  };

  const minifyCSS = (css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around {
      .replace(/\s*}\s*/g, '}') // Remove spaces around }
      .replace(/\s*;\s*/g, ';') // Remove spaces around ;
      .replace(/\s*:\s*/g, ':') // Remove spaces around :
      .replace(/\s*,\s*/g, ',') // Remove spaces around ,
      .replace(/;\s*}/g, '}') // Remove unnecessary semicolon before }
      .trim();
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      const formatted = formatCSS(input, indentSize);
      setOutput(formatted);
    } catch (err) {
      setOutput(`Error formatting CSS: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      const minified = minifyCSS(input);
      setOutput(minified);
    } catch (err) {
      setOutput(`Error minifying CSS: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

  const loadExample = () => {
    const example = `.navbar{background-color:#333;padding:10px;}.navbar ul{list-style:none;margin:0;padding:0;display:flex;}.navbar li{margin-right:20px;}.navbar a{color:white;text-decoration:none;padding:5px 10px;border-radius:3px;}.navbar a:hover{background-color:#555;}@media (max-width:768px){.navbar ul{flex-direction:column;}.navbar li{margin-bottom:10px;}}`;
    setInput(example);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          CSS Formatter
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Format, beautify, and minify CSS code with proper indentation and structure.
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
          CSS Input:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter CSS code to format..."
          className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleFormat}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Format CSS
        </button>
        <button
          onClick={handleMinify}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Minify CSS
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
              Formatted CSS:
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
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">CSS Formatting Features</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Properly indents CSS rules and properties for better readability</li>
          <li>• Supports custom indentation sizes (2, 4, or 8 spaces)</li>
          <li>• Formats selectors with proper line breaks and spacing</li>
          <li>• Minification option removes comments and unnecessary whitespace</li>
          <li>• Handles media queries and nested rules</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
