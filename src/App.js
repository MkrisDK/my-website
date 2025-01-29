import React, { useState } from 'react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('English');

  const analyzeText = (text) => {
    // Enhanced AI Detection Algorithm
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    
    // More sophisticated analysis
    const uniqueWords = new Set(words);
    const repetitionScore = (uniqueWords.size / words.length) * 100;
    
    const contractions = (text.match(/\'[a-z]{1,2}\b/g) || []).length;
    const pronouns = (text.match(/\b(I|me|my|mine|we|us|our|ours)\b/gi) || []).length;
    const naturalScore = ((contractions + pronouns) / words.length) * 200;
    
    const transitionWords = (text.match(/\b(however|therefore|furthermore|moreover|consequently)\b/gi) || []).length;
    const consistencyScore = (transitionWords / sentences.length) * 100;
    
    // Calculate AI probability
    const aiScore = Math.min(
      100,
      Math.round((100 - repetitionScore) * 0.4 + (100 - naturalScore) * 0.3 + consistencyScore * 0.3)
    );

    return {
      aiProbability: aiScore,
      humanProbability: 100 - aiScore,
      wordCount: words.length,
      details: {
        aiGenerated: aiScore,
        humanRefined: Math.round((100 - aiScore) * 0.7),
        humanWritten: 100 - aiScore
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.length < 50) {
      setResult({ error: "Please enter at least 50 characters for accurate analysis" });
      return;
    }
    setResult(analyzeText(text));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">AI Detector</h1>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </header>

      {/* Language Selection */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            {['English', 'French', 'Spanish', 'German'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`text-sm ${
                  language === lang
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Input */}
          <div>
            <div className="bg-white rounded-lg">
              <textarea
                className="w-full h-64 p-4 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                  {text.split(/\s+/).filter(Boolean).length} Words
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setText('')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Analyze Text
              </button>
            </div>
          </div>

          {/* Results */}
          {result && !result.error && (
            <div className="bg-white rounded-lg p-6">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-gray-900">
                  {result.aiProbability}%
                </div>
                <div className="text-gray-600 mt-2">of text is likely AI</div>
              </div>

              <div className="space-y-6">
                {/* Bar Chart */}
                <div className="relative h-48">
                  <div className="absolute inset-0 flex items-end">
                    <div
                      className="w-1/2 bg-orange-300"
                      style={{ height: `${result.aiProbability}%` }}
                    />
                    <div
                      className="w-1/2 bg-gray-200"
                      style={{ height: `${result.humanProbability}%` }}
                    />
                  </div>
                  <div className="absolute bottom-0 w-full flex justify-around text-sm text-gray-600">
                    <span>AI</span>
                    <span>Human</span>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>AI-generated</span>
                    <span className="font-semibold">{result.details.aiGenerated}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Human-written & AI-refined</span>
                    <span className="font-semibold">{result.details.humanRefined}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Human-written</span>
                    <span className="font-semibold">{result.details.humanWritten}%</span>
                  </div>
                </div>

                {/* Enhance Writing Button */}
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-gray-700 mb-2">Enhance your writing in seconds</p>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Try Paraphraser
                  </button>
                </div>
              </div>
            </div>
          )}

          {result?.error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-700">
              {result.error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
