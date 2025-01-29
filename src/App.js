import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('English');

  const detectLanguage = (text) => {
    // Simple language detection based on common words
    const danishWords = /\b(og|eller|jeg|det|at|en|den|til|er|som|på|de|med|han|af|for|ikke|der|var|kan|ville|skulle|havde|har|jeg|du|vi)\b/gi;
    const englishWords = /\b(the|be|to|of|and|a|in|that|have|i|it|for|not|on|with|he|as|you|do|at|this|but|his|by|from|they|we|say|her|she|or|an|will|my|one|all|would|there|their)\b/gi;
    
    const danishCount = (text.match(danishWords) || []).length;
    const englishCount = (text.match(englishWords) || []).length;
    
    return danishCount > englishCount ? 'Danish' : 'English';
  };

  const analyzeText = (text) => {
    const detectedLanguage = detectLanguage(text);
    
    // Split text into words and sentences based on detected language
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    
    // 1. Enhanced vocabulary analysis
    const uniqueWords = new Set(words);
    const vocabularyRichness = (uniqueWords.size / words.length);
    const repetitionScore = Math.min(vocabularyRichness * 100, 100);

    // 2. Improved sentence structure analysis
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentences.length;
    const lengthVariation = Math.sqrt(
      sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / sentences.length
    );
    const structureScore = Math.min((lengthVariation / avgLength) * 100, 100);

    // 3. Language-specific patterns
    const patterns = detectedLanguage === 'Danish' 
      ? {
          contractions: /\b(kan't|vil't|må't|skal't)\b/g,
          informalWords: /\b(altså|bare|lige|jo|vel|nok|sådan|faktisk)\b/gi,
          personalPronouns: /\b(jeg|du|han|hun|vi|i|de|mig|dig|os)\b/gi,
          transitionWords: /\b(derfor|således|dermed|hvorfor|eftersom|fordi|desuden)\b/gi
        }
      : {
          contractions: /\'[a-z]{1,2}\b/g,
          informalWords: /\b(well|just|really|actually|basically|like)\b/gi,
          personalPronouns: /\b(I|me|my|mine|we|us|our|ours)\b/gi,
          transitionWords: /\b(however|therefore|furthermore|moreover|consequently|because|thus)\b/gi
        };

    const contractions = (text.match(patterns.contractions) || []).length;
    const informalWords = (text.match(patterns.informalWords) || []).length;
    const personalPronouns = (text.match(patterns.personalPronouns) || []).length;
    const naturalScore = Math.min(((contractions + informalWords + personalPronouns) / words.length) * 200, 100);

    // 4. Coherence analysis
    const transitionWords = (text.match(patterns.transitionWords) || []).length;
    const coherenceScore = Math.min((transitionWords / sentences.length) * 100, 100);

    // 5. Enhanced perplexity calculation
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    const entropy = Object.values(wordFreq).reduce((acc, freq) => {
      const p = freq / words.length;
      return acc - (p * Math.log2(p));
    }, 0);
    const perplexityScore = Math.min(entropy * 20, 100);

    // 6. Format consistency check
    const formatPatterns = {
      bulletPoints: (text.match(/^[•*-]\s/gm) || []).length,
      numberedLists: (text.match(/^\d+\.\s/gm) || []).length,
      formatting: (text.match(/[*_~`]/) || []).length
    };
    const formatScore = Math.min(
      ((formatPatterns.bulletPoints + formatPatterns.numberedLists + formatPatterns.formatting) / sentences.length) * 100,
      100
    );

    // Weighted scoring system with adjusted weights
    const weights = {
      repetition: 0.2,
      natural: 0.25,
      coherence: 0.15,
      structure: 0.15,
      perplexity: 0.15,
      format: 0.1
    };

    const aiScore = Math.min(
      100,
      Math.round(
        (repetitionScore * weights.repetition) +
        ((100 - naturalScore) * weights.natural) +
        (coherenceScore * weights.coherence) +
        (structureScore * weights.structure) +
        (perplexityScore * weights.perplexity) +
        (formatScore * weights.format)
      )
    );

    return {
      aiProbability: aiScore,
      humanProbability: Math.max(0, 100 - aiScore),
      language: detectedLanguage,
      metrics: {
        vocabularyRichness: Math.round(repetitionScore),
        naturalness: Math.round(naturalScore),
        coherence: Math.round(coherenceScore),
        structure: Math.round(structureScore),
        perplexity: Math.round(perplexityScore),
        formatConsistency: Math.round(formatScore)
      }
    };
  };

  // Rest of the component remains the same...
  
  return (
    // Previous JSX remains the same...
  );
};

export default App;
