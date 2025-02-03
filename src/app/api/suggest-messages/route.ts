// import OpenAI from "openai";

import { openAiApiKey } from "@/config/constant";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = createOpenAI({
  apiKey: openAiApiKey,
});

export const runtime = "edge";

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    console.log("before stream text");
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      maxTokens: 400,
      prompt,
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API error:", error);
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}

export function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}
