import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('English');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // AI detection function remains the same as before...
  const analyzeText = (text) => {
    // Previous AI detection logic
    const words = text.toLowerCase().split(/\s+/);
    // ... (keeping the same detection logic)
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
