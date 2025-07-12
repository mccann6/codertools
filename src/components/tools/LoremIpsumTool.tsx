'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

export default function LoremIpsumTool() {
  const [output, setOutput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [options, setOptions] = useState({
    type: 'paragraphs' as 'words' | 'sentences' | 'paragraphs',
    count: 3,
    startWithLorem: true,
  });

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo', 'nemo',
    'voluptatem', 'quia', 'voluptas', 'aspernatur', 'odit', 'aut', 'fugit',
    'consequuntur', 'magni', 'dolores', 'ratione', 'sequi', 'nesciunt', 'neque',
    'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam', 'eius', 'modi',
    'tempora', 'incidunt', 'magnam', 'quaerat', 'voluptatibus'
  ];

  const generateWords = (count: number, startWithLorem = false): string => {
    const words: string[] = [];
    
    if (startWithLorem && count >= 2) {
      words.push('Lorem', 'ipsum');
      count -= 2;
    }
    
    for (let i = 0; i < count; i++) {
      const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)];
      words.push(randomWord);
    }
    
    return words.join(' ');
  };

  const generateSentence = (minWords = 4, maxWords = 18): string => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const sentence = generateWords(wordCount);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (minSentences = 3, maxSentences = 7): string => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  const generateLorem = () => {
    let result = '';
    
    switch (options.type) {
      case 'words':
        result = generateWords(options.count, options.startWithLorem);
        break;
        
      case 'sentences':
        const sentences: string[] = [];
        for (let i = 0; i < options.count; i++) {
          if (i === 0 && options.startWithLorem) {
            sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
          } else {
            sentences.push(generateSentence());
          }
        }
        result = sentences.join(' ');
        break;
        
      case 'paragraphs':
        const paragraphs: string[] = [];
        for (let i = 0; i < options.count; i++) {
          if (i === 0 && options.startWithLorem) {
            paragraphs.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
          } else {
            paragraphs.push(generateParagraph());
          }
        }
        result = paragraphs.join('\n\n');
        break;
    }
    
    setOutput(result);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    setCopyStatus(success ? 'Copied!' : 'Failed to copy');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lorem Ipsum Generator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate Lorem Ipsum placeholder text for your design and development projects.
        </p>
      </div>

      {/* Options */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Generation Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generate:
            </label>
            <select
              value={options.type}
              onChange={(e) => setOptions(prev => ({ ...prev, type: e.target.value as 'words' | 'sentences' | 'paragraphs' }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Count:
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={options.count}
              onChange={(e) => setOptions(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Start with Lorem */}
          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.startWithLorem}
                onChange={(e) => setOptions(prev => ({ ...prev, startWithLorem: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Start with &quot;Lorem ipsum&quot;
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={generateLorem}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Generate Lorem Ipsum
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
              Generated Text ({output.split(/\s+/).length} words):
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
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none leading-relaxed"
          />
        </div>
      )}

      {/* Quick Generate Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setOptions({ type: 'words', count: 50, startWithLorem: true });
            setTimeout(() => generateLorem(), 0);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          50 Words
        </button>
        <button
          onClick={() => {
            setOptions({ type: 'sentences', count: 5, startWithLorem: true });
            setTimeout(() => generateLorem(), 0);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          5 Sentences
        </button>
        <button
          onClick={() => {
            setOptions({ type: 'paragraphs', count: 3, startWithLorem: true });
            setTimeout(() => generateLorem(), 0);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          3 Paragraphs
        </button>
        <button
          onClick={() => {
            setOptions({ type: 'paragraphs', count: 5, startWithLorem: true });
            setTimeout(() => generateLorem(), 0);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          5 Paragraphs
        </button>
      </div>

      {/* Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">About Lorem Ipsum</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Lorem Ipsum is simply dummy text of the printing and typesetting industry</li>
          <li>• Used as placeholder text since the 1500s for layouts and designs</li>
          <li>• Helps focus on visual design without being distracted by readable content</li>
          <li>• Standard practice in web development, graphic design, and publishing</li>
        </ul>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
      </div>
    </div>
  );
}
