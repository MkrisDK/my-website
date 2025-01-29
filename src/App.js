import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('English');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const analyzeText = (text) => {
    // Enhanced AI Detection Algorithm
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    
    // 1. Analyze word patterns and vocabulary sophistication
    const uniqueWords = new Set(words);
    const vocabularyRichness = (uniqueWords.size / words.length);
    const repetitionScore = vocabularyRichness * 100;

    // 2. Analyze sentence structure variation
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentences.length;
    const lengthVariation = Math.sqrt(
      sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / sentences.length
    );
    const structureScore = (lengthVariation / avgLength) * 100;

    // 3. Check for natural language patterns
    const contractions = (text.match(/\'[a-z]{1,2}\b/g) || []).length;
    const informalWords = (text.match(/\b(well|just|really|actually|basically|like)\b/gi) || []).length;
    const personalPronouns = (text.match(/\b(I|me|my|mine|we|us|our|ours)\b/gi) || []).length;
    const naturalScore = ((contractions + informalWords + personalPronouns) / words.length) * 150;

    // 4. Analyze structural coherence
    const transitionWords = (text.match(/\b(however|therefore|furthermore|moreover|consequently|because|thus)\b/gi) || []).length;
    const coherenceScore = (transitionWords / sentences.length) * 100;

    // 5. Calculate perplexity (measure of predictability)
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    const entropy = Object.values(wordFreq).reduce((acc, freq) => {
      const p = freq / words.length;
      return acc - (p * Math.log2(p));
    }, 0);
    const perplexityScore = Math.min(entropy * 15, 100);

    // Weighted scoring system
    const aiScore = Math.min(
      100,
      Math.round(
        (100 - repetitionScore) * 0.25 +
        (100 - naturalScore) * 0.25 +
        coherenceScore * 0.2 +
        structureScore * 0.15 +
        perplexityScore * 0.15
      )
    );

    return {
      aiProbability: aiScore,
      humanProbability: Math.max(0, 100 - aiScore),
      wordCount: words.length,
      details: {
        aiGenerated: aiScore,
        humanRefined: Math.round((100 - aiScore) * 0.7),
        humanWritten: Math.max(0, 100 - aiScore)
      },
      metrics: {
        vocabularyRichness: Math.round(repetitionScore),
        naturalness: Math.round(naturalScore),
        coherence: Math.round(coherenceScore),
        structure: Math.round(structureScore),
        perplexity: Math.round(perplexityScore)
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.length < 50) {
      setResult({ error: "Please enter at least 50 characters for accurate analysis" });
      return;
    }
    const analysis = analyzeText(text);
    setResult(analysis);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-12">
              <span className="text-2xl font-bold">AI Detector</span>
              <div className="hidden md:flex space-x-8">
                {['English', 'French', 'Spanish', 'German'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`${
                      language === lang
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    } transition-colors`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">
              More precision –<br />less guesswork
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We offer pragmatic AI text analysis without the marketing jargon.
              Real results based on your content.
            </p>
          </div>

          {/* Analysis Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <textarea
              className="w-full h-48 p-6 text-lg text-gray-900 border-b focus:outline-none resize-none"
              placeholder="Enter your text here... (minimum 50 characters)"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="p-4 flex justify-between items-center">
              <span className="text-gray-500">
                {text.split(/\s+/).filter(Boolean).length} Words
              </span>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Analyze Text
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && !result.error && (
            <div className="mt-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-2">{result.aiProbability}%</h2>
                    <p className="text-gray-600">AI Probability</p>
                    
                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">AI-generated</span>
                        <span className="font-medium">{result.details.aiGenerated}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Human-written</span>
                        <span className="font-medium">{result.details.humanWritten}%</span>
                      </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="mt-8">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Analysis Metrics</h3>
                      <div className="space-y-3">
                        {Object.entries(result.metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm font-medium">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-48 relative">
                    <div className="absolute inset-0 flex items-end">
                      <div
                        className="w-1/2 bg-blue-600"
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
