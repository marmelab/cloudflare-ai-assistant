import { Ai } from "@cloudflare/ai";

export default defineEventHandler(async (event) => {
  const cloudflareBindings = event.context?.cloudflare?.env;
  if (!cloudflareBindings) {
    throw new Error("No Cloudflare bindings found.");
  }

  setResponseHeaders(event, {
    "content-type": "application/json",
    "cache-control": "no-cache",
  });

  const body = await readRawBody(event, false);
  if (!body) {
    setResponseStatus(event, 400);
    return JSON.stringify({
      status: 400,
      errors: [
        {
          type: "required",
        },
      ],
    });
  }

  const ai = new Ai(cloudflareBindings.AI);

  const response = await ai.run("@cf/openai/whisper", {
    audio: [...body],
  });

  return {
    text: response.text,
  };
});
