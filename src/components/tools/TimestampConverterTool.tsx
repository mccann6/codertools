'use client';

import { useState, useEffect } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function TimestampConverterTool() {
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [date, setDate] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  // Update current timestamp every second
  useEffect(() => {
    const updateCurrentTimestamp = () => {
      const now = Date.now();
      setCurrentTimestamp(unit === 'seconds' ? Math.floor(now / 1000).toString() : now.toString());
    };

    updateCurrentTimestamp();
    const interval = setInterval(updateCurrentTimestamp, 1000);
    return () => clearInterval(interval);
  }, [unit]);

  const convertTimestampToDate = (ts: string) => {
    if (!ts) return '';
    
    try {
      const num = parseInt(ts);
      if (isNaN(num)) return 'Invalid timestamp';
      
      // Convert to milliseconds if needed
      const milliseconds = unit === 'seconds' ? num * 1000 : num;
      const dateObj = new Date(milliseconds);
      
      if (isNaN(dateObj.getTime())) return 'Invalid timestamp';
      
      return dateObj.toISOString();
    } catch {
      return 'Invalid timestamp';
    }
  };

  const convertDateToTimestamp = (dateStr: string) => {
    if (!dateStr) return '';
    
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      const milliseconds = dateObj.getTime();
      return unit === 'seconds' ? Math.floor(milliseconds / 1000).toString() : milliseconds.toString();
    } catch {
      return 'Invalid date';
    }
  };

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    setDate(convertTimestampToDate(value));
  };

  const handleDateChange = (value: string) => {
    setDateInput(value);
    setTimestamp(convertDateToTimestamp(value));
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    setCopyStatus(success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleUseCurrentTimestamp = () => {
    setTimestamp(currentTimestamp);
    setDate(convertTimestampToDate(currentTimestamp));
  };

  const handleUseCurrentDate = () => {
    const now = new Date().toISOString().slice(0, 16); // Format for datetime-local input
    setDateInput(now);
    setTimestamp(convertDateToTimestamp(now));
  };

  const formatDate = (isoString: string): { iso: string; utc: string; local: string; localeString: string; } | null => {
    if (!isoString || isoString.startsWith('Invalid')) return null;
    
    try {
      const dateObj = new Date(isoString);
      if (isNaN(dateObj.getTime())) return null;
      
      return {
        iso: isoString,
        utc: dateObj.toUTCString(),
        local: dateObj.toString(),
        localeString: dateObj.toLocaleString(),
      };
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Unix Timestamp Converter
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Convert Unix timestamps to human-readable dates and vice versa with support for seconds and milliseconds.
        </p>
      </div>

      {/* Current Timestamp Display */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-300">Current Timestamp</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              {new Date().toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-mono text-blue-900 dark:text-blue-300">{currentTimestamp}</p>
            <button
              onClick={() => handleCopy(currentTimestamp)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {copyStatus || 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Unit Selection */}
      <div className="flex space-x-4">
        <button
          onClick={() => setUnit('seconds')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'seconds'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Seconds
        </button>
        <button
          onClick={() => setUnit('milliseconds')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'milliseconds'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Milliseconds
        </button>
      </div>

      {/* Timestamp to Date */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Timestamp to Date
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Unix Timestamp ({unit}):
              </label>
              <button
                onClick={handleUseCurrentTimestamp}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Use Current
              </button>
            </div>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => handleTimestampChange(e.target.value)}
              placeholder={`Enter timestamp in ${unit}...`}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
          </div>

          {formattedDate && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ISO 8601:
                </label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 rounded border font-mono text-sm">
                  {formattedDate.iso}
                  <button
                    onClick={() => handleCopy(formattedDate.iso)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  UTC:
                </label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 rounded border font-mono text-sm">
                  {formattedDate.utc}
                  <button
                    onClick={() => handleCopy(formattedDate.utc)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Local:
                </label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 rounded border font-mono text-sm">
                  {formattedDate.localeString}
                  <button
                    onClick={() => handleCopy(formattedDate.localeString)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date to Timestamp */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Date to Timestamp
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Date and Time:
              </label>
              <button
                onClick={handleUseCurrentDate}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Use Current
              </button>
            </div>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {timestamp && !timestamp.startsWith('Invalid') && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Unix Timestamp ({unit}):
              </label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 rounded border">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg text-gray-900 dark:text-white">{timestamp}</span>
                  <button
                    onClick={() => handleCopy(timestamp)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">About Unix Timestamps</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Unix timestamp represents seconds/milliseconds since January 1, 1970, 00:00:00 UTC</li>
          <li>• Commonly used in programming and databases for date/time storage</li>
          <li>• Always in UTC timezone, independent of local timezone settings</li>
          <li>• Seconds format is more common, milliseconds used in JavaScript and some APIs</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
