import axios from "axios";

export async function analyzeReport(text: string) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-4o-mini",
        input: `You are an expert misinformation detection system.

Analyze the news report below.

Return ONLY JSON:
{
  "score": number (0 to 1),
  "result": "Real" | "Suspicious" | "Fake",
  "reason": "short explanation"
}

Rules:
- Extremely vague or sensational → Fake
- No source / unclear → Suspicious
- Well-structured + realistic → Real

News:
${text}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data.output[0].content[0].text;

    try {
      const parsed = JSON.parse(output);

      if (
        typeof parsed.score !== "number" ||
        !parsed.result ||
        !parsed.reason
      ) {
        throw new Error("Invalid format");
      }

      return parsed;

    } catch {
      return {
        score: 0.5,
        result: "Suspicious",
        reason: "AI parsing failed"
      };
    }

  } catch (err) {
    console.log("AI ERROR:", (err as Error).message);

    return {
      score: 0.5,
      result: "Suspicious",
      reason: "AI request failed"
    };
  }
}