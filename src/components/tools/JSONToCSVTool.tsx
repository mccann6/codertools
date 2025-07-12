'use client';

import { useState } from 'react';
import { copyToClipboard, downloadAsFile, isValidJSON } from '@/lib/utils';

export default function JSONToCSVTool() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [options, setOptions] = useState({
    includeHeaders: true,
    delimiter: ',',
    flattenNested: true,
  });

  const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
    const flattened: Record<string, unknown> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          if (options.flattenNested) {
            Object.assign(flattened, flattenObject(obj[key] as Record<string, unknown>, newKey));
          } else {
            flattened[newKey] = JSON.stringify(obj[key]);
          }
        } else if (Array.isArray(obj[key])) {
          flattened[newKey] = (obj[key] as unknown[]).join('; ');
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const escapeCSVField = (field: unknown): string => {
    if (field === null || field === undefined) return '';
    
    const str = String(field);
    if (str.includes(options.delimiter) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const convertJSONToCSV = () => {
    setError('');
    setCsvOutput('');
    
    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }
    
    if (!isValidJSON(jsonInput)) {
      setError('Invalid JSON format');
      return;
    }
    
    try {
      const data = JSON.parse(jsonInput);
      
      if (!Array.isArray(data)) {
        setError('JSON must be an array of objects for CSV conversion');
        return;
      }
      
      if (data.length === 0) {
        setError('JSON array is empty');
        return;
      }
      
      // Flatten objects if option is enabled
      const processedData = data.map(item => 
        typeof item === 'object' && item !== null ? flattenObject(item) : { value: item }
      );
      
      // Get all unique headers
      const headers = new Set<string>();
      processedData.forEach(item => {
        Object.keys(item).forEach(key => headers.add(key));
      });
      
      const headerArray = Array.from(headers);
      const csvRows: string[] = [];
      
      // Add headers if option is enabled
      if (options.includeHeaders) {
        csvRows.push(headerArray.map(header => escapeCSVField(header)).join(options.delimiter));
      }
      
      // Add data rows
      processedData.forEach(item => {
        const row = headerArray.map(header => escapeCSVField((item as Record<string, unknown>)[header] || ''));
        csvRows.push(row.join(options.delimiter));
      });
      
      setCsvOutput(csvRows.join('\n'));
      
    } catch (err) {
      setError(`Conversion error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(csvOutput);
    setCopyStatus(success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleDownload = () => {
    downloadAsFile(csvOutput, 'converted_data.csv', 'text/csv');
  };

  const handleClear = () => {
    setJsonInput('');
    setCsvOutput('');
    setError('');
  };

  const loadExample = () => {
    const example = JSON.stringify([
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30,
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "country": "USA"
        },
        "hobbies": ["reading", "swimming", "coding"]
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "age": 25,
        "address": {
          "street": "456 Oak Ave",
          "city": "Los Angeles",
          "country": "USA"
        },
        "hobbies": ["photography", "traveling"]
      }
    ], null, 2);
    
    setJsonInput(example);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          JSON to CSV Converter
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Convert JSON data to CSV format with options for handling nested objects and arrays.
        </p>
      </div>

      {/* Options */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Conversion Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeHeaders}
              onChange={(e) => setOptions(prev => ({ ...prev, includeHeaders: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Include headers</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.flattenNested}
              onChange={(e) => setOptions(prev => ({ ...prev, flattenNested: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Flatten nested objects</span>
          </label>
          
          <div className="flex items-center space-x-2">
            <label className="text-gray-700 dark:text-gray-300">Delimiter:</label>
            <select
              value={options.delimiter}
              onChange={(e) => setOptions(prev => ({ ...prev, delimiter: e.target.value }))}
              className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Input (Array of Objects):
          </label>
          <button
            onClick={loadExample}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Load Example
          </button>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter JSON array of objects..."
          className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={convertJSONToCSV}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Convert to CSV
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
      {csvOutput && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CSV Output ({csvOutput.split('\n').length} rows):
            </label>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                {copyStatus || 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
          <textarea
            value={csvOutput}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
          />
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Conversion Notes</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• JSON must be an array of objects for proper CSV conversion</li>
          <li>• Nested objects can be flattened using dot notation (e.g., address.city)</li>
          <li>• Arrays are joined with semicolons when flattening is disabled</li>
          <li>• Special characters and quotes are properly escaped in CSV output</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
