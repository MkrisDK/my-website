import React, { useState } from 'react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const analyzeSegment = (segment) => {
    // Analysis metrics for individual segments
    const patterns = {
      aiIndicators: {
        perfectStructure: /^[A-Z][^.!?]+[.!?]\s*(?:[A-Z][^.!?]+[.!?]\s*)*$/,
        formalTransitions: /\b(however|moreover|furthermore|consequently|therefore)\b/gi,
        consistentFormatting: /^[-*]\s.*\n[-*]\s.*\n[-*]\s/gm,
        templatePhrases: /\b(as mentioned|in conclusion|to summarize)\b/gi
      },
      humanIndicators: {
        informalLanguage: /\b(like|sort of|kind of|you know|I mean|actually|basically)\b/gi,
        contractions: /\b(I'm|won't|can't|shouldn't|wouldn't|didn't|that's|it's)\b/gi,
        personalReferences: /\b(I think|I feel|I believe|in my opinion|to me)\b/gi,
        conversationalMarkers: /\b(well|anyway|so|oh|hmm|uh|right|okay)\b/gi
      }
    };

    const calculatePatternScore = (text, patternSet) => {
      return Object.values(patternSet).reduce((score, pattern) => {
        const matches = (text.match(pattern) || []).length;
        return score + matches;
      }, 0);
    };

    const aiScore = calculatePatternScore(segment, patterns.aiIndicators);
    const humanScore = calculatePatternScore(segment, patterns.humanIndicators);

    // Additional analysis for natural language variations
    const sentences = segment.split(/[.!?]+/).filter(Boolean);
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const lengthVariation = Math.sqrt(
      sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length
    );

    // More natural writing typically has higher variation
    const naturalityScore = Math.min(100, lengthVariation * 10);

    const totalScore = {
      aiProbability: Math.min(100, (aiScore * 20) + (100 - naturalityScore) * 0.5),
      confidence: sentences.length > 3 ? "High" : "Low",
      details: {
        aiMarkers: aiScore,
        humanMarkers: humanScore,
        sentenceVariation: Math.round(naturalityScore)
      }
    };

    return totalScore;
  };

  const analyzeText = (text) => {
    // Split text into segments (roughly paragraph-sized chunks)
    const segments = text
      .split(/(?:\n\s*\n|\. (?=[A-Z]))/)
      .filter(segment => segment.trim().length > 0)
      .map(segment => segment.trim());

    // Analyze each segment
    const segmentAnalysis = segments.map((segment, index) => ({
      text: segment,
      ...analyzeSegment(segment),
      index
    }));

    // Find transition points (significant changes in AI probability)
    const transitions = segmentAnalysis.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return acc;
      const probabilityChange = Math.abs(curr.aiProbability - arr[idx - 1].aiProbability);
      if (probabilityChange > 20) {
        acc.push(idx);
      }
      return acc;
    }, []);

    return {
      segments: segmentAnalysis,
      transitions,
      overallScore: {
        aiProbability: Math.round(
          segmentAnalysis.reduce((acc, seg) => acc + seg.aiProbability, 0) / segmentAnalysis.length
        )
      }
    };
  };

  const handleSubmit = () => {
    if (text.length < 50) {
      setResult({ error: "Please enter at least 50 characters for accurate analysis" });
      return;
    }
    const analysis = analyzeText(text);
    setResult(analysis);
  };

  const getSegmentColor = (probability) => {
    if (probability > 75) return 'bg-red-50 border-l-4 border-red-400';
    if (probability > 40) return 'bg-yellow-50 border-l-4 border-yellow-400';
    return 'bg-green-50 border-l-4 border-green-400';
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
              Segment-based AI detection for mixed content analysis.
            </p>
          </div>

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

          {result && !result.error && (
            <div className="mt-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Overall AI Probability: {result.overallScore.aiProbability}%</h3>
                  <p className="text-gray-600 mb-4">Detected {result.transitions.length} significant style transitions</p>
                </div>

                <div className="space-y-6">
                  {result.segments.map((segment, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${getSegmentColor(segment.aiProbability)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Segment {index + 1}</span>
                        <span className="text-sm font-bold">
                          {segment.aiProbability}% AI Probability
                        </span>
                      </div>
                      <p className="text-gray-800 mb-3">{segment.text}</p>
                      <div className="text-sm text-gray-500">
                        <span className="mr-4">AI Markers: {segment.details.aiMarkers}</span>
                        <span className="mr-4">Human Markers: {segment.details.humanMarkers}</span>
                        <span>Confidence: {segment.confidence}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {result.transitions.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Style Transitions Detected</h4>
                    <p className="text-sm text-gray-600">
                      Major writing style changes were detected between segments: {
                        result.transitions.map(t => `${t} → ${t + 1}`).join(', ')
                      }
                    </p>
                  </div>
                )}
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
