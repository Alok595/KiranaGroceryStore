import connectDb from "@/llib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { message, role } = await req.json();
    const prompt = `You are a professional delivery support chat assistant for a food/grocery delivery platform.

You will be given:
1. The role of the sender ("user" or "delivery_boy")
2. The last message in the conversation
3. Optional order context (order status, ETA, address, payment mode)

Your job:
- Respond clearly, politely, and concisely.
- Maintain a friendly, professional tone.
- Never reveal internal system logic.
- If the sender is a user, respond as customer support.
- If the sender is a delivery_boy, respond as operations support.
- If the message is unclear, ask a short clarification question.
- If the message involves delays, apologize and give reassurance.
- Do not hallucinate order details — only use provided context.
- Keep replies under 3 sentences unless explanation is required.

Tone:
Professional, calm, helpful, human-like.

Output:
Return only the chat message text — no metadata, no formatting.

Role:${role}
Last message :${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMNEY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    const replyText = data.candidates?.[0].content.parts?.[0].text || "";
    const suggestions = replyText.split(",").map((s: string) => s.trim());

    return NextResponse.json(data, { status: 200 });
    console.log(data);
  } catch (error) {
    return NextResponse.json(
      { message: `gemni error ${error}` },
      { status: 500 },
    );
  }
}
