import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, stressScore, anxietyScore, depressionScore } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Determine severity levels
    const getDepLevel = (score: number) => {
      if (score >= 28) return "extremely_severe";
      if (score >= 21) return "severe";
      if (score >= 14) return "moderate";
      if (score >= 10) return "mild";
      return "normal";
    };

    const getAnxLevel = (score: number) => {
      if (score >= 20) return "extremely_severe";
      if (score >= 15) return "severe";
      if (score >= 10) return "moderate";
      if (score >= 8) return "mild";
      return "normal";
    };

    const getStressLevel = (score: number) => {
      if (score >= 34) return "extremely_severe";
      if (score >= 26) return "severe";
      if (score >= 19) return "moderate";
      if (score >= 15) return "mild";
      return "normal";
    };

    const depLevel = getDepLevel(depressionScore);
    const anxLevel = getAnxLevel(anxietyScore);
    const stressLevel = getStressLevel(stressScore);

    // Determine overall severity (highest level among all three)
    const severityLevels = ["normal", "mild", "moderate", "severe", "extremely_severe"];
    const maxSeverity = Math.max(
      severityLevels.indexOf(depLevel),
      severityLevels.indexOf(anxLevel),
      severityLevels.indexOf(stressLevel)
    );
    const overallSeverity = severityLevels[maxSeverity];

    // Create context-aware system prompt
    let systemPrompt = `You are SERA (Student Emotional Resource Assistant), a warm, empathetic, and culturally-aware AI counselor designed for Indian students. You've just helped a student complete a mental health self-assessment game.

Assessment Results:
- Depression Score: ${depressionScore} (${depLevel})
- Anxiety Score: ${anxietyScore} (${anxLevel})
- Stress Score: ${stressScore} (${stressLevel})
- Overall Severity: ${overallSeverity}

`;

    // Adjust tone based on severity
    if (overallSeverity === "normal") {
      systemPrompt += `The student's scores are in the normal range. Maintain a casual, friendly, and encouraging tone. Celebrate their well-being while inviting them to share any thoughts about the experience. Use relatable Indian cultural references naturally.`;
    } else if (overallSeverity === "mild") {
      systemPrompt += `The student shows mild signs of distress. Be calm yet gently concerned. Show you care while maintaining a reassuring presence. Acknowledge what they might be experiencing without being alarming. Use comforting cultural references from Indian wisdom traditions.`;
    } else if (overallSeverity === "moderate") {
      systemPrompt += `The student shows moderate distress. Express genuine concern while remaining supportive and hopeful. Validate their experiences and gently explore coping strategies. Reference Indian philosophical concepts of resilience and balance when appropriate.`;
    } else if (overallSeverity === "severe") {
      systemPrompt += `The student shows severe distress. Express clear concern with empathy and care. Validate their struggle and emphasize that help is available. Gently encourage professional support while being a compassionate listener.`;
    } else if (overallSeverity === "extremely_severe") {
      systemPrompt += `The student shows extremely severe distress. Express deep concern with utmost empathy. This is serious and requires professional intervention. Strongly encourage them to seek professional help immediately. Offer to provide referrals to mental health professionals. Let them know they're not alone and that seeking help is a sign of strength.

If appropriate, mention resources like:
- NIMHANS (National Institute of Mental Health and Neurosciences)
- iCall - psychosocial helpline (9152987821)
- Vandrevala Foundation Helpline (1860-2662-345)
- AASRA Suicide Prevention (91-22-2754 6669)`;
    }

    systemPrompt += `

Key Guidelines:
- Be warm, empathetic, and non-judgmental
- Use "aap" (respectful you) when it feels natural in the conversation
- Reference Indian cultural contexts (festivals, food, family values, academic pressure, etc.) naturally
- Never diagnose - you're a supportive companion, not a therapist
- Encourage healthy coping mechanisms rooted in both modern psychology and Indian wellness traditions
- Keep responses conversational and human (2-4 sentences typically)
- If the student shares crisis signals, prioritize their safety and encourage professional help
- Use gentle Hindi/Hinglish words when contextually appropriate (like "tension mat lo", "sab theek ho jayega" for mild cases)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
