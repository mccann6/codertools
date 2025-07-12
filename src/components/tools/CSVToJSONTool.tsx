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

const DocumentArrowDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.25a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25V11.25a2.25 2.25 0 0 0-2.25-2.25H15m-3 0-3-3m0 0-3 3m3-3v6" />
  </svg>
);

export default function CSVToJSONTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [separator, setSeparator] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [arrayOutput, setArrayOutput] = useState(true);

  const parseCSV = (csv: string, delimiter: string): string[][] => {
    const lines = csv.trim().split('\\n');
    const result: string[][] = [];
    
    for (const line of lines) {
      const row: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"' && inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      row.push(current.trim());
      result.push(row);
    }
    
    return result;
  };

  const convertCSVToJSON = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }

      const rows = parseCSV(input, separator);
      if (rows.length === 0) {
        setError('No data found in CSV');
        setOutput('');
        return;
      }

      let headers: string[];
      let dataRows: string[][];

      if (hasHeader) {
        headers = rows[0];
        dataRows = rows.slice(1);
      } else {
        // Generate column names like Column1, Column2, etc.
        headers = rows[0].map((_, index) => `Column${index + 1}`);
        dataRows = rows;
      }

      if (arrayOutput) {
        const jsonArray = dataRows.map(row => {
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        setOutput(JSON.stringify(jsonArray, null, 2));
      } else {
        const jsonObject = {
          headers,
          data: dataRows
        };
        setOutput(JSON.stringify(jsonObject, null, 2));
      }

      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse CSV');
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

  const downloadJSON = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    const sampleCSV = `Name,Age,City,Country
John Doe,30,New York,USA
Jane Smith,25,London,UK
Bob Johnson,35,Toronto,Canada
Alice Brown,28,Sydney,Australia`;
    setInput(sampleCSV);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          CSV to JSON Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Convert CSV data to JSON format with customizable options. 
          Supports custom delimiters, headers, and different output formats.
        </p>
        
        {/* Ad placeholder */}
        <div className="mb-6">
          <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Banner Ad Space (728x90)</span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 grid md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="separator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Separator
          </label>
          <select
            id="separator"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasHeader"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="hasHeader" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            First row is header
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="arrayOutput"
            checked={arrayOutput}
            onChange={(e) => setArrayOutput(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="arrayOutput" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Output as array
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex space-x-2">
          <button
            onClick={convertCSVToJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Convert to JSON
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
          <label htmlFor="csv-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CSV Data
          </label>
          <textarea
            id="csv-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSV data here..."
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Lines: {input.split('\\n').length} | Characters: {input.length}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="json-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON Output
            </label>
            {output && (
              <div className="flex space-x-2">
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
                <button
                  onClick={downloadJSON}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
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
                id="json-output"
                value={output}
                readOnly
                placeholder="JSON output will appear here..."
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
            Conversion Options
          </h2>
          <div className="text-blue-800 dark:text-blue-400 space-y-2 text-sm">
            <p>
              <strong>Separator:</strong> Choose the character that separates values in your CSV (comma, semicolon, tab, or pipe).
            </p>
            <p>
              <strong>First row is header:</strong> Check this if your CSV&apos;s first row contains column names.
            </p>
            <p>
              <strong>Output as array:</strong> When checked, outputs an array of objects. When unchecked, outputs an object with headers and data arrays.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">🔧</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Flexible Parsing</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Supports different separators and handles quoted values correctly
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">📋</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Multiple Formats</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Output as array of objects or structured data with headers
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-3">💾</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Download Results</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Copy to clipboard or download as JSON file
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
