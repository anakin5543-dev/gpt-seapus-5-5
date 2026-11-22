
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = (
      process.env.AI_BASE_URL || "https://api.openai.com/v1"
    ).replace(/\/+$/, "");

    const model = process.env.AI_MODEL;

    if (!apiKey || !model) {
      return NextResponse.json(
        { error: "กรุณาตั้งค่า AI_API_KEY และ AI_MODEL ก่อน" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบข้อความ" },
        { status: 400 }
      );
    }

    const safeMessages = messages
      .filter((m: any) =>
        ["user", "assistant"].includes(m.role) &&
        typeof m.content === "string"
      )
      .map((m: any) => ({
        role: m.role,
        content: m.content
      }));

    const response = await fetch(
      `${baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "คุณคือ GPT SEAPUS 5.5 ผู้ช่วย AI ที่มีความสามารถด้านการเขียนโปรแกรม วิเคราะห์ และสร้างสรรค์ผลงาน ตอบอย่างชัดเจนและเป็นประโยชน์"
            },
            ...safeMessages
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "AI API Error" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "AI ไม่ได้ส่งคำตอบกลับ"
    });

  } catch {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
