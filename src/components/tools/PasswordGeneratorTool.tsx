'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export default function PasswordGeneratorTool() {
  const [password, setPassword] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false,
  });

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similar = 'il1Lo0O';
    const ambiguous = '{}[]()/\\\'"`~,;.<>';

    let charset = '';
    
    if (options.includeUppercase) charset += uppercase;
    if (options.includeLowercase) charset += lowercase;
    if (options.includeNumbers) charset += numbers;
    if (options.includeSymbols) charset += symbols;

    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !similar.includes(char)).join('');
    }

    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
    }

    if (charset.length === 0) {
      setPassword('Error: No character sets selected');
      return;
    }

    let result = '';
    const array = new Uint8Array(options.length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < options.length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    setCopyStatus(success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const calculateStrength = (): { score: number; label: string; color: string } => {
    let score = 0;
    let possibleChars = 0;

    if (options.includeUppercase) possibleChars += 26;
    if (options.includeLowercase) possibleChars += 26;
    if (options.includeNumbers) possibleChars += 10;
    if (options.includeSymbols) possibleChars += 32;

    if (options.excludeSimilar) possibleChars -= 7;
    if (options.excludeAmbiguous) possibleChars -= 14;

    // Calculate entropy
    const entropy = Math.log2(Math.pow(possibleChars, options.length));
    
    if (entropy >= 60) score = 4;
    else if (entropy >= 50) score = 3;
    else if (entropy >= 40) score = 2;
    else if (entropy >= 30) score = 1;
    else score = 0;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['red', 'orange', 'yellow', 'blue', 'green'];

    return { score, label: labels[score], color: colors[score] };
  };

  const strength = calculateStrength();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Password Generator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate secure, random passwords with customizable options for better security.
        </p>
      </div>

      {/* Password Display */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Generated Password:
          </label>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              disabled={!password}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {copyStatus || 'Copy'}
            </button>
            <button
              onClick={generatePassword}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-600">
          <code className="text-lg font-mono break-all text-gray-900 dark:text-white">
            {password || 'Click "Generate" to create a password'}
          </code>
        </div>

        {password && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Strength:
              </span>
              <span className={`text-sm font-medium text-${strength.color}-600`}>
                {strength.label}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 ml-2">
                <div 
                  className={`bg-${strength.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(strength.score + 1) * 20}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Password Options
        </h3>

        {/* Length */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Length: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="100"
            value={options.length}
            onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>100</span>
          </div>
        </div>

        {/* Character Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Lowercase (a-z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Symbols (!@#$...)</span>
          </label>
        </div>

        {/* Exclusion Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Exclude similar (il1Lo0O)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => setOptions(prev => ({ ...prev, excludeAmbiguous: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Exclude ambiguous ({}[]()...)</span>
          </label>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Password Security Tips</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Use at least 12 characters for good security</li>
          <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
          <li>• Never reuse passwords across multiple accounts</li>
          <li>• Consider using a password manager</li>
          <li>• Enable two-factor authentication when available</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
