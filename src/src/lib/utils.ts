// Utility functions for DevToolChest tools

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const downloadAsFile = (content: string, filename: string, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Tool categories for navigation
export const toolCategories = [
  {
    name: 'Formatters & Validators',
    tools: [
      { name: 'JSON Formatter', path: '/tools/json-formatter', description: 'Format and validate JSON data' },
      { name: 'XML Formatter', path: '/tools/xml-formatter', description: 'Format and validate XML data' },
      { name: 'CSS Formatter', path: '/tools/css-formatter', description: 'Format and beautify CSS code' },
      { name: 'SQL Formatter', path: '/tools/sql-formatter', description: 'Format and beautify SQL queries' },
    ]
  },
  {
    name: 'Encoders & Decoders',
    tools: [
      { name: 'Base64 Encoder/Decoder', path: '/tools/base64', description: 'Encode and decode Base64 strings' },
      { name: 'URL Encoder/Decoder', path: '/tools/url-encoder', description: 'Encode and decode URLs' },
      { name: 'HTML Encoder/Decoder', path: '/tools/html-encoder', description: 'Encode and decode HTML entities' },
      { name: 'JWT Decoder', path: '/tools/jwt-decoder', description: 'Decode and inspect JWT tokens' },
    ]
  },
  {
    name: 'Generators',
    tools: [
      { name: 'UUID Generator', path: '/tools/uuid-generator', description: 'Generate unique identifiers' },
      { name: 'Password Generator', path: '/tools/password-generator', description: 'Generate secure passwords' },
      { name: 'QR Code Generator', path: '/tools/qr-generator', description: 'Generate QR codes' },
      { name: 'Lorem Ipsum Generator', path: '/tools/lorem-ipsum', description: 'Generate placeholder text' },
    ]
  },
  {
    name: 'Converters',
    tools: [
      { name: 'Unix Timestamp Converter', path: '/tools/timestamp-converter', description: 'Convert timestamps' },
      { name: 'CSV to JSON', path: '/tools/csv-to-json', description: 'Convert CSV data to JSON' },
      { name: 'JSON to CSV', path: '/tools/json-to-csv', description: 'Convert JSON data to CSV' },
      { name: 'Color Converter', path: '/tools/color-converter', description: 'Convert between color formats' },
    ]
  },
];

export type ToolCategory = typeof toolCategories[0];
