import React, { useState } from 'react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const analyzeText = (text) => {
    // AI Detection Metrics
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    
    // Calculate various indicators
    const uniqueWords = new Set(words);
    const repetitionScore = (uniqueWords.size / words.length) * 100;
    
    const contractions = (text.match(/\'[a-z]{1,2}\b/g) || []).length;
    const pronouns = (text.match(/\b(I|me|my|mine|we|us|our|ours)\b/gi) || []).length;
    const naturalScore = ((contractions + pronouns) / words.length) * 100;
    
    const avgLength = words.length / sentences.length;
    const complexityScore = avgLength > 10 && avgLength < 25 ? 100 : 50;
    
    // Calculate final score
    const score = (repetitionScore * 0.4 + naturalScore * 0.3 + complexityScore * 0.3);
    
    return {
      score: Math.min(Math.round(score), 100),
      details: {
        repetition: Math.round(repetitionScore),
        naturalness: Math.round(naturalScore),
        complexity: Math.round(complexityScore)
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.length < 50) {
      setResult({ error: "Please enter at least 50 characters for a more accurate analysis" });
      return;
    }
    const analysis = analyzeText(text);
    setResult(analysis);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Text Detector</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                Paste your text here
              </label>
              <textarea
                id="text-input"
                rows={8}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter at least 50 characters..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Analyze Text
            </button>
          </form>

          {/* Results Section */}
          {result && !result.error && (
            <div className="mt-8 space-y-6">
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">AI Probability Score</h2>
                  <span className="text-3xl font-bold text-blue-600">{result.score}%</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {result.score > 70 
                    ? "This text shows strong indicators of AI generation."
                    : result.score > 40
                    ? "This text shows mixed indicators of human and AI writing."
                    : "This text shows strong indicators of human writing."}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Analysis Breakdown</h3>
                <div className="grid gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Word Repetition</span>
                      <span>{result.details.repetition}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Natural Language</span>
                      <span>{result.details.naturalness}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Text Complexity</span>
                      <span>{result.details.complexity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result?.error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {result.error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
