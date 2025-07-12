'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function SQLFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatSQL = (sql: string, indent: number): string => {
    const indentStr = ' '.repeat(indent);
    let formatted = '';
    let indentLevel = 0;
    
    // Clean up the input
    sql = sql.replace(/\s+/g, ' ').trim();
    
    // Split by SQL keywords and format
    let currentLine = '';
    const words = sql.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const upperWord = word.toUpperCase();
      
      // Check if this word is a major SQL keyword that should start a new line
      const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 
                            'GROUP', 'HAVING', 'ORDER', 'UNION', 'INSERT', 'UPDATE', 'DELETE', 
                            'CREATE', 'ALTER', 'DROP'];
      
      if (majorKeywords.includes(upperWord) || 
          (upperWord === 'JOIN' || upperWord.endsWith('JOIN')) ||
          (upperWord === 'BY' && (words[i-1]?.toUpperCase() === 'GROUP' || words[i-1]?.toUpperCase() === 'ORDER'))) {
        
        // Add current line if it has content
        if (currentLine.trim()) {
          formatted += indentStr.repeat(indentLevel) + currentLine.trim() + '\n';
          currentLine = '';
        }
        
        // Handle special cases for indent level
        if (upperWord === 'WHERE' || upperWord === 'GROUP' || upperWord === 'HAVING' || 
            upperWord === 'ORDER' || upperWord.includes('JOIN')) {
          // These keywords stay at the same level as SELECT/FROM
        } else if (upperWord === 'FROM') {
          // FROM stays at base level
        }
        
        currentLine = word + ' ';
      } else if (upperWord === '(' || word.includes('(')) {
        currentLine += word + ' ';
        if (word === '(' || word.endsWith('(')) {
          indentLevel++;
        }
      } else if (upperWord === ')' || word.includes(')')) {
        if (word === ')' || word.startsWith(')')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        currentLine += word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    
    // Add the last line
    if (currentLine.trim()) {
      formatted += indentStr.repeat(indentLevel) + currentLine.trim();
    }
    
    return formatted.trim();
  };

  const minifySQL = (sql: string): string => {
    return sql
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*([(),;])\s*/g, '$1') // Remove spaces around punctuation
      .trim();
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      const formatted = formatSQL(input, indentSize);
      setOutput(formatted);
    } catch (err) {
      setOutput(`Error formatting SQL: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      const minified = minifySQL(input);
      setOutput(minified);
    } catch (err) {
      setOutput(`Error minifying SQL: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    const example = `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2023-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC, u.name ASC;`;
    setInput(example);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          SQL Formatter
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Format, beautify, and organize SQL queries with proper indentation for better readability.
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
          SQL Input:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter SQL query to format..."
          className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleFormat}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Format SQL
        </button>
        <button
          onClick={handleMinify}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Minify SQL
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
              Formatted SQL:
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
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">SQL Formatting Features</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Properly indents SQL clauses (SELECT, FROM, WHERE, JOIN, etc.)</li>
          <li>• Supports custom indentation sizes (2, 4, or 8 spaces)</li>
          <li>• Handles complex queries with subqueries and multiple JOINs</li>
          <li>• Minification option removes unnecessary whitespace</li>
          <li>• Improves readability for debugging and code reviews</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
