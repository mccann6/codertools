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

interface JWTPayload extends Record<string, unknown> {
  iat?: number;
  exp?: number;
  nbf?: number;
  sub?: string;
  iss?: string;
  aud?: string | string[];
}

interface JWTData {
  header: Record<string, unknown>;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
}

export default function JWTDecoderTool() {
  const [input, setInput] = useState('');
  const [jwtData, setJwtData] = useState<JWTData | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'header' | 'payload' | null>(null);

  const decodeJWT = () => {
    try {
      if (!input.trim()) {
        setJwtData(null);
        setError('');
        return;
      }

      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format. JWT must have exactly 3 parts separated by dots.');
        setJwtData(null);
        return;
      }

      const [headerPart, payloadPart, signaturePart] = parts;

      // Decode header
      const headerDecoded = JSON.parse(atob(headerPart.replace(/-/g, '+').replace(/_/g, '/')));
      
      // Decode payload
      const payloadDecoded = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));

      setJwtData({
        header: headerDecoded,
        payload: payloadDecoded,
        signature: signaturePart,
        isValid: true
      });
      setError('');
    } catch {
      setError('Invalid JWT format. Please check your token and try again.');
      setJwtData(null);
    }
  };

  const copyToClipboard = async (data: Record<string, unknown>, type: 'header' | 'payload') => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setJwtData(null);
    setError('');
  };

  const loadSample = () => {
    // Sample JWT token (this is a sample token, not a real one)
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2ODY4OTcwMDAsImF1ZCI6ImV4YW1wbGUuY29tIiwiaXNzIjoiZXhhbXBsZS1hcHAifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setInput(sampleJWT);
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  // Check if token is expired
  const isTokenExpired = (exp: number) => {
    return exp * 1000 < Date.now();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          JWT Decoder
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Decode and inspect JWT (JSON Web Token) headers and payloads. 
          All decoding happens in your browser for maximum security.
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
        <div className="flex space-x-2">
          <button
            onClick={decodeJWT}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Decode JWT
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

      {/* Input */}
      <div className="mb-8">
        <label htmlFor="jwt-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          JWT Token
        </label>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 border border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="text-red-600 dark:text-red-400 font-medium mb-2">Error:</div>
          <div className="text-red-700 dark:text-red-300 text-sm">{error}</div>
        </div>
      )}

      {/* Decoded JWT */}
      {jwtData && (
        <div className="space-y-6">
          {/* Token Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-green-800 dark:text-green-300 font-medium">✅ Valid JWT Format</div>
            </div>
            {jwtData.payload.exp && (
              <div className={`p-4 border rounded-lg ${
                isTokenExpired(jwtData.payload.exp)
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              }`}>
                <div className={`font-medium ${
                  isTokenExpired(jwtData.payload.exp)
                    ? 'text-red-800 dark:text-red-300'
                    : 'text-green-800 dark:text-green-300'
                }`}>
                  {isTokenExpired(jwtData.payload.exp) ? '❌ Token Expired' : '✅ Token Valid'}
                </div>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Header</h3>
              <button
                onClick={() => copyToClipboard(jwtData.header, 'header')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {copied === 'header' ? (
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
            </div>
            <div className="p-4">
              <pre className="text-sm text-gray-900 dark:text-white overflow-x-auto">
                {JSON.stringify(jwtData.header, null, 2)}
              </pre>
            </div>
          </div>

          {/* Payload */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payload</h3>
              <button
                onClick={() => copyToClipboard(jwtData.payload, 'payload')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {copied === 'payload' ? (
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
            </div>
            <div className="p-4">
              <pre className="text-sm text-gray-900 dark:text-white overflow-x-auto">
                {JSON.stringify(jwtData.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Common Claims */}
          {(jwtData.payload.iat || jwtData.payload.exp || jwtData.payload.nbf) && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Decoded Timestamps</h3>
              </div>
              <div className="p-4 space-y-3">
                {jwtData.payload.iat && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Issued At (iat):</span>
                    <span className="text-gray-900 dark:text-white font-mono">
                      {formatTimestamp(jwtData.payload.iat)}
                    </span>
                  </div>
                )}
                {jwtData.payload.exp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Expires At (exp):</span>
                    <span className={`font-mono ${
                      isTokenExpired(jwtData.payload.exp) 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatTimestamp(jwtData.payload.exp)}
                    </span>
                  </div>
                )}
                {jwtData.payload.nbf && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Not Before (nbf):</span>
                    <span className="text-gray-900 dark:text-white font-mono">
                      {formatTimestamp(jwtData.payload.nbf)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Signature */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Signature</h3>
            </div>
            <div className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                The signature is used to verify the token&apos;s authenticity. It cannot be decoded without the secret key.
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border font-mono text-sm break-all text-gray-900 dark:text-white">
                {jwtData.signature}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="mt-12">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            About JWT Tokens
          </h2>
          <div className="text-blue-800 dark:text-blue-400 space-y-2 text-sm">
            <p>
              JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims securely between two parties.
            </p>
            <p>
              <strong>Structure:</strong> A JWT consists of three parts separated by dots: Header.Payload.Signature
            </p>
            <p>
              <strong>Security Note:</strong> This tool only decodes the header and payload. 
              The signature verification requires the secret key and should be done server-side.
            </p>
          </div>
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
