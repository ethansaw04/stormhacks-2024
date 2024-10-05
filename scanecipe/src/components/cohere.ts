import { CohereStream } from "ai";
import { COHERE_API_KEY } from "./secret";

const API_KEY = COHERE_API_KEY;

export async function POST(req: Request) {
    const { prompt } = await req.json();
    console.log(prompt);

    const prompt_data = `${prompt}: ${data}`;

    const body = JSON.stringify({
        prompt: prompt_data,
        model: "command-nightly",
        max_tokens: 300,
        stop_sequences: [],
        temperature: 0.9,
        return_likelihoods: "NONE",
        stream: true,
    });

    const response = await fetch("https://api.cohere.ai/v1/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
    body,
    });

  // Extract the text response from the Cohere stream
    const stream = CohereStream(response);

  // Respond with the stream
    return new Response(stream);
}