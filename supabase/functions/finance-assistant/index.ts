
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, userContext } = await req.json();
    
    // Vérifier que les paramètres requis sont présents
    if (!prompt) {
      throw new Error('Le paramètre "prompt" est requis');
    }
    
    // Create system message with context about financial assistant
    const systemMessage = `Tu es un assistant financier intelligent pour l'application Masroufi. 
    Ton rôle est d'aider les utilisateurs à mieux comprendre leur situation financière, 
    fournir des conseils pour économiser de l'argent, expliquer les tendances de dépenses, et donner des conseils financiers personnalisés.
    Sois concis, pratique et amical. Concentre-toi toujours sur des conseils actionnables.
    Contexte sur l'utilisateur: ${userContext || 'Aucun contexte spécifique fourni'}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Erreur OpenAI:', data.error);
      throw new Error(data.error.message || 'Erreur lors de la génération de la réponse');
    }
    
    const generatedResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: generatedResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur dans la fonction finance-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
