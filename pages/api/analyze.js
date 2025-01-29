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
      system: `You are an expert at analyzing text to determine if it was written by AI or a human. 
               You excel at detecting mixed AI/human content and provide detailed segment analysis.
               Always return properly formatted JSON.`,
      messages: [{
        role: "user",
        content: `Analyze this text for AI authorship. Return a JSON object with exactly this structure:
        {
          "aiProbability": number,
          "detectedLanguage": string,
          "confidence": "Low" | "Medium" | "High",
          "segments": [{
            "text": string,
            "aiProbability": number,
            "explanation": string
          }],
          "reasonings": string[]
        }

        Provide specific explanations for why you think each segment is AI or human-written.
        Focus on writing patterns, style variations, and natural language indicators.
        
        Text to analyze: "${text}"`
      }]
    });

    try {
      const analysis = JSON.parse(response.content[0].text);
      return res.status(200).json(analysis);
    } catch (parseError) {
      console.error('Response parsing error:', parseError);
      return res.status(500).json({ error: 'Failed to parse analysis results' });
    }
    
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed. Please try again or contact support if the problem persists.' 
    });
  }
}
