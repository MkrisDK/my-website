import { Anthropic } from '@anthropic-ai/sdk';

const MAX_WORDS = 2500;
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    
    // Word count validation
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > MAX_WORDS) {
      return res.status(400).json({ 
        error: `Text exceeds maximum length. Please limit to ${MAX_WORDS} words. Current length: ${wordCount} words.` 
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.3,
      messages: [{
        role: "user",
        content: `Analyze this text and determine if it was written by AI or a human. Respond with ONLY a JSON object in this exact format (no other text):
        {
          "aiProbability": <number between 0-100>,
          "detectedLanguage": "<language name>",
          "confidence": "<Low|Medium|High>",
          "segments": [
            {
              "text": "<segment text>",
              "aiProbability": <number between 0-100>,
              "explanation": "<why this segment appears AI/human generated>"
            }
          ],
          "reasonings": ["<reason 1>", "<reason 2>", "<reason 3>"]
        }

        Text to analyze: ${text}`
      }]
    });

    // Log the raw response for debugging
    console.log('Raw API response:', response.content[0].text);

    let analysis;
    try {
      analysis = JSON.parse(response.content[0].text.trim());
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Failed to parse:', response.content[0].text);
      return res.status(500).json({ 
        error: 'Failed to parse analysis results',
        debug: response.content[0].text 
      });
    }

    if (!analysis || typeof analysis.aiProbability !== 'number') {
      return res.status(500).json({ 
        error: 'Invalid analysis format' 
      });
    }

    return res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed. Please try again.',
      details: error.message
    });
  }
}
