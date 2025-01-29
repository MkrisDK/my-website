// App.js
import React, { useState } from 'react';

const MAX_WORDS = 2500;
const API_URL = 'const API_URL = 'https://ai-checker-nine.vercel.app/api/analyze';'; // Opdater med dit domæne

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const wordCount = text.trim().split(/\s+/).length;

  const handleSubmit = async () => {
    if (wordCount > MAX_WORDS) {
      setResult({ error: `Please limit text to ${MAX_WORDS} words` });
      return;
    }

    if (wordCount < 50) {
      setResult({ error: "Please enter at least 50 words for accurate analysis" });
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('Sending request to:', API_URL); // Debug log
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const analysis = await response.json();
      console.log('Analysis result:', analysis); // Debug log
      setResult(analysis);
    } catch (error) {
      console.error('Error during analysis:', error); // Debug log
      setResult({ error: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-bold">AI Detector</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">
              More precision –<br />less guesswork
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered text analysis
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <textarea
              className="w-full h-48 p-6 text-lg text-gray-900 border-b focus:outline-none resize-none"
              placeholder={`Enter your text here... (50-${MAX_WORDS} words)`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="p-4 flex justify-between items-center">
              <span className={`text-gray-500 ${wordCount > MAX_WORDS ? 'text-red-500' : ''}`}>
                {wordCount} / {MAX_WORDS} Words
              </span>
              <button
                onClick={handleSubmit}
                disabled={isAnalyzing || wordCount > MAX_WORDS || wordCount < 50}
                className={`px-8 py-3 rounded-full text-white transition-colors ${
                  isAnalyzing || wordCount > MAX_WORDS || wordCount < 50
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
              </button>
            </div>
          </div>

          {result && !result.error && (
            <div className="mt-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-2">{result.aiProbability}%</h2>
                    <p className="text-gray-600">AI Probability</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Detected Language: {result.detectedLanguage}
                    </p>
                    <p className="text-sm text-gray-500">
                      Confidence: {result.confidence}
                    </p>

                    <div className="mt-8 space-y-4">
                      {result.segments.map((segment, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg ${
                            segment.aiProbability > 75
                              ? 'bg-red-50 border-l-4 border-red-400'
                              : segment.aiProbability > 40
                              ? 'bg-yellow-50 border-l-4 border-yellow-400'
                              : 'bg-green-50 border-l-4 border-green-400'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Segment {index + 1}</span>
                            <span>{segment.aiProbability}% AI</span>
                          </div>
                          <p className="text-sm text-gray-600">{segment.text}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            {segment.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="h-48 relative mb-8">
                      <div className="absolute inset-0 flex items-end">
                        <div
                          className="w-1/2 bg-blue-600"
                          style={{ height: `${result.aiProbability}%` }}
                        />
                        <div
                          className="w-1/2 bg-gray-200"
                          style={{ height: `${100 - result.aiProbability}%` }}
                        />
                      </div>
                      <div className="absolute bottom-0 w-full flex justify-around text-sm text-gray-600">
                        <span>AI</span>
                        <span>Human</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Analysis Details</h3>
                      {result.reasonings.map((reason, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result?.error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {result.error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
