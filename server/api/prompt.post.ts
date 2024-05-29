import { Ai } from "@cloudflare/ai";
import { z } from "zod";

const ROLE_ASSISTANT = "assistant";
const ROLE_USER = "user";
const ROLE_SYSTEM = "system";

const messageSchema = z.object({
  role: z.enum([ROLE_USER, ROLE_ASSISTANT]),
  content: z.string(),
});

const bodySchema = z.object({
  messages: z
    .array(messageSchema)
    .min(1)
    .superRefine(function (messages, ctx) {
      for (let i = 0; i < messages.length; i++) {
        const isEvenMessage = (i & 1) === 0;
        if (isEvenMessage && messages[i].role !== ROLE_USER) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_enum_value,
            path: [i, "role"],
            options: [ROLE_USER],
            received: messages[i].role,
          });
        } else if (!isEvenMessage && messages[i].role !== ROLE_ASSISTANT) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_enum_value,
            path: [i, "role"],
            options: [ROLE_ASSISTANT],
            received: messages[i].role,
          });
        }
      }
    }),
});

export default defineEventHandler(async (event) => {
  const cloudflareBindings = event.context?.cloudflare?.env;
  if (!cloudflareBindings) {
    throw new Error("No Cloudflare bindings found.");
  }

  const body = await readValidatedBody(event, bodySchema.safeParse);
  if (!body.success) {
    setResponseStatus(event, 400);
    setResponseHeaders(event, {
      "content-type": "application/json",
      "cache-control": "no-cache",
    });
    return JSON.stringify({
      status: 400,
      errors: body.error.errors,
    });
  }

  const ai = new Ai(cloudflareBindings.AI);

  const stream = await ai.run("@cf/meta/llama-3-8b-instruct", {
    messages: [
      {
        role: ROLE_SYSTEM,
        content:
          "You are an AI assistant that help users to take notes or write emails. You keep you notes and emails as simple as possible.",
      },
      ...body.data.messages,
    ],
    stream: true,
  });

  setResponseHeaders(event, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
  });
  return stream;
});
