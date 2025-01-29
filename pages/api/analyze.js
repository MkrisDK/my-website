import { Anthropic } from '@anthropic-ai/sdk';

const MAX_WORDS = 2500;
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log request details
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    console.log('Received text length:', text?.length);
    
    // Word count validation
    const wordCount = text.trim().split(/\s+/).length;
    console.log('Word count:', wordCount);

    if (wordCount > MAX_WORDS) {
      return res.status(400).json({ 
        error: `Text exceeds maximum length. Please limit to ${MAX_WORDS} words. Current length: ${wordCount} words.` 
      });
    }

    console.log('Calling Claude API...');
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
      console.log('Parsed analysis:', analysis);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Failed to parse:', response.content[0].text);
      return res.status(500).json({ 
        error: 'Failed to parse analysis results',
        debug: response.content[0].text 
      });
    }

    if (!analysis || typeof analysis.aiProbability !== 'number') {
      console.error('Invalid analysis format:', analysis);
      return res.status(500).json({ 
        error: 'Invalid analysis format' 
      });
    }

    console.log('Sending successful response');
    return res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed. Please try again.',
      details: error.message
    });
  }
}
