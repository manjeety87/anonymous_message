import { openAiApiKey } from "@/config/constant";
import { errorResponse, successResponse } from "@/helpers/apiResponse";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: openAiApiKey,
});

async function checkModeration(input: string, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}: Checking moderation...`);
      const moderation = await openai.moderations.create({
        model: "omni-moderation-latest",
        input,
      });
      return moderation;
    } catch (error: any) {
      if (error.response?.status === 429 && attempt < retries - 1) {
        console.warn("Rate limit hit. Retrying in", delay, "ms...");
        await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1))); // Exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed after multiple retries.");
}

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input) {
      return Response.json(
        errorResponse(404, "Please provide text to check for hate speech")
      );
    }

    console.log("Before moderation...");
    const moderation = await checkModeration(input);
    console.log("After moderation:", moderation);

    const flagged = moderation.results[0].flagged; // `true` if hate speech detected

    return Response.json(
      successResponse(`Moderation check successful`, { flagged })
    );
  } catch (error) {
    console.error("Moderation API Error:", error);
    return Response.json(errorResponse(500, "Internal Server Error"));
  }
}
