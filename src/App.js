import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('English');

  // Language patterns for detection and analysis
  const languagePatterns = {
    English: {
      commonWords: /\b(the|be|to|of|and|a|in|that|have|i|it|for|not|on|with|he|as|you|do|at|this|but|his|by|from|they|we|say|her|she|or|an|will|my|one|all|would|there|their)\b/gi,
      specialChars: /['"]/g,
      endings: /\b\w+(ing|ed|ly|tion|sion|ment|ness|ful|less|able|ible)\b/gi,
      pronouns: /\b(I|you|he|she|it|we|they|me|him|her|us|them|my|your|his|her|its|our|their)\b/g,
      contractions: /\'[a-z]{1,2}\b/g,
      informalWords: /\b(well|just|really|actually|basically|like|stuff|thing|maybe|probably|literally|honestly|basically|totally)\b/gi,
      transitionWords: /\b(however|therefore|furthermore|moreover|consequently|because|thus|hence|nevertheless|although|despite|yet|still)\b/gi
    },
    Danish: {
      commonWords: /\b(og|eller|jeg|det|at|en|den|til|er|som|på|de|med|han|af|for|ikke|der|var|kan|ville|skulle|havde|har|jeg|du|vi|hvor|hvad|hvordan|hvorfor|samt|mens|efter|før|under|over)\b/gi,
      specialChars: /[æøåÆØÅ]/g,
      endings: /\b\w+(et|en|ene|erne|ere|este|ede|ende|hed|dom|skab)\b/gi,
      pronouns: /\b(jeg|du|han|hun|den|det|vi|i|de|mig|dig|sig|ham|hende|os|jer|dem|min|din|sin|hans|hendes|vores|jeres|deres)\b/gi,
      contractions: /\b(ku'|ka'|sku'|ha'|vil'|bli'|gi')\b/g,
      informalWords: /\b(altså|bare|lige|jo|vel|nok|sådan|faktisk|sgu|sås|øh|åh|hmm|øhm|nemlig|simpelthen|okay|super|mega|vildt|helt|totalt|virkelig|bare|kun|ret)\b/gi,
      transitionWords: /\b(derfor|således|dermed|hvorfor|eftersom|fordi|desuden|derudover|endvidere|ydermere|hertil|hvorved|hvorefter|dernæst|endelig|følgelig|heraf|derved|hermed|derimod|trods|skønt)\b/gi
    },
    French: {
      commonWords: /\b(le|la|les|un|une|des|de|à|dans|sur|pour|avec|par|en|qui|que|quoi|où|dont|et|ou|mais|donc|car|si|quand|comment|pourquoi)\b/gi,
      specialChars: /[éèêëàâäôöûüùïîçœæ]/gi,
      endings: /\b\w+(ment|tion|sion|ance|ence|age|ure|oir|oire|ette|elle|eur|euse|iste|isme|ique|able|ible|er|ir|re)\b/gi,
      pronouns: /\b(je|tu|il|elle|on|nous|vous|ils|elles|me|te|se|lui|leur|moi|toi|soi|eux|celui|celle|ceux|celles)\b/gi,
      contractions: /\b(j'|t'|l'|c'|d'|n'|qu'|puisqu'|lorsqu'|jusqu')\b/gi,
      informalWords: /\b(ben|bah|euh|hein|mec|truc|machin|bidule|genre|grave|cool|super|hyper|vachement|carrément)\b/gi,
      transitionWords: /\b(donc|ainsi|pourtant|cependant|néanmoins|toutefois|puis|ensuite|enfin|bref|notamment|car|puisque|parce que|grâce à|malgré)\b/gi
    },
    Spanish: {
      commonWords: /\b(el|la|los|las|un|una|unos|unas|de|del|a|ante|con|en|para|por|sobre|entre|detrás|después|durante|hacia|hasta|desde|sin|sobre|tras)\b/gi,
      specialChars: /[áéíóúñ¿¡]/gi,
      endings: /\b\w+(ción|sión|dad|tad|idad|mente|miento|anza|ismo|ista|able|ible|ante|ente|ar|er|ir|or)\b/gi,
      pronouns: /\b(yo|tú|él|ella|usted|nosotros|vosotros|ellos|ellas|ustedes|me|te|se|nos|os|le|les|lo|la|los|las)\b/gi,
      contractions: /\b(al|del)\b/gi,
      informalWords: /\b(pues|bueno|vale|venga|tío|tía|guay|chulo|rollo|mogollón|chungo|cutre|pasta|pibe|chaval|majo)\b/gi,
      transitionWords: /\b(además|sin embargo|no obstante|por lo tanto|por consiguiente|en consecuencia|por ende|entonces|luego|pues|así que|porque|ya que|debido a|gracias a|a pesar de)\b/gi
    },
    German: {
      commonWords: /\b(der|die|das|den|dem|des|ein|eine|einer|eines|einem|einen|und|oder|aber|wenn|weil|dass|ob|seit|von|aus|nach|bei|mit|zu|zur)\b/gi,
      specialChars: /[äöüßÄÖÜ]/g,
      endings: /\b\w+(ung|heit|keit|schaft|lich|ig|isch|bar|sam|los|haft|tum|chen|lein|in)\b/gi,
      pronouns: /\b(ich|du|er|sie|es|wir|ihr|sie|Sie|mich|dich|sich|uns|euch|mir|dir|ihm|ihr|ihnen)\b/gi,
      contractions: /\b(gibt's|geht's|hab's|ist's|wie's|wo's|was's|wer's)\b/gi,
      informalWords: /\b(mal|halt|eben|doch|eigentlich|irgendwie|sozusagen|quasi|praktisch|quasi|sozusagen|gewissermaßen)\b/gi,
      transitionWords: /\b(deshalb|deswegen|daher|darum|demnach|folglich|somit|allerdings|jedoch|dennoch|trotzdem|wobei|währenddessen|anschließend|schließlich)\b/gi
    }
  };

  const detectLanguage = (text) => {
    const scores = {};
    
    // Calculate scores for each language
    Object.entries(languagePatterns).forEach(([lang, patterns]) => {
      scores[lang] = {
        commonWords: (text.match(patterns.commonWords) || []).length * 2,
        specialChars: (text.match(patterns.specialChars) || []).length * 3,
        endings: (text.match(patterns.endings) || []).length * 2,
        pronouns: (text.match(patterns.pronouns) || []).length
      };
    });

    // Calculate total scores
    const totalScores = Object.entries(scores).reduce((acc, [lang, score]) => {
      acc[lang] = Object.values(score).reduce((a, b) => a + b, 0);
      return acc;
    }, {});

    // Return the language with the highest score
    return Object.entries(totalScores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  };

  const analyzeText = (text) => {
    const detectedLanguage = detectLanguage(text);
    const patterns = languagePatterns[detectedLanguage];
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    
    // Calculate basic metrics
    const uniqueWords = new Set(words);
    const vocabularyRichness = (uniqueWords.size / words.length);
    const repetitionScore = Math.min(vocabularyRichness * 100, 100);

    // Analyze sentence structure
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentences.length;
    const lengthVariation = Math.sqrt(
      sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / sentences.length
    );
    const structureScore = Math.min((lengthVariation / avgLength) * 100, 100);

    // Language pattern analysis
    const contractions = (text.match(patterns.contractions) || []).length;
    const informalWords = (text.match(patterns.informalWords) || []).length;
    const personalPronouns = (text.match(patterns.pronouns) || []).length;
    const naturalScore = Math.min(((contractions + informalWords + personalPronouns) / words.length) * 200, 100);

    // Coherence analysis
    const transitionWords = (text.match(patterns.transitionWords) || []).length;
    const coherenceScore = Math.min((transitionWords / sentences.length) * 100, 100);

    // Entropy calculation
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    const entropy = Object.values(wordFreq).reduce((acc, freq) => {
      const p = freq / words.length;
      return acc - (p * Math.log2(p));
    }, 0);
    const perplexityScore = Math.min(entropy * 20, 100);

    // Final AI probability calculation with weighted factors
    const weights = {
      repetition: 0.25,
      natural: 0.25,
      coherence: 0.2,
      structure: 0.15,
      perplexity: 0.15
    };

    const aiScore = Math.min(
      100,
      Math.round(
        (100 - repetitionScore) * weights.repetition +
        (100 - naturalScore) * weights.natural +
        coherenceScore * weights.coherence +
        structureScore * weights.structure +
        perplexityScore * weights.perplexity
      )
    );

    return {
      aiProbability: aiScore,
      humanProbability: Math.max(0, 100 - aiScore),
      detectedLanguage,
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
    e?.preventDefault();
    if (text.length < 50) {
      setResult({ error: "Please enter at least 50 characters for accurate analysis" });
      return;
    }
    const analysis = analyzeText(text);
    setResult(analysis);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-bold">AI Detector</span>
            <div className="hidden md:flex space-x-8">
              {Object.keys(languagePatterns).map((lang) => (
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
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
                   <p className="text-sm text-gray-500 mt-1">
                      Detected Language: {result.detectedLanguage}
                    </p>
                    
                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">AI-generated</span>
                        <span className="font-medium">{result.aiProbability}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Human-written</span>
                        <span className="font-medium">{result.humanProbability}%</span>
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
