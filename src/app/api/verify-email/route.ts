import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Spin } from "@/lib/models";
import { isValidEmail, normalizeEmail } from "@/lib/creators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().min(3).max(320),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
  }

  const email = normalizeEmail(parsed.data.email);
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
  }

  try {
    await connectDB();
    const prior = await Spin.findOne({ email }).lean();
    return NextResponse.json({
      ok: true,
      email,
      alreadySpun: Boolean(prior),
    });
  } catch (err) {
    // Surfaces the real reason (e.g. missing MONGODB_URI, Atlas IP block,
    // auth failure) in Vercel's function logs without leaking to the client.
    console.error("[/api/verify-email] failed:", err);
    return NextResponse.json(
      { ok: false, error: "DB_UNAVAILABLE" },
      { status: 500 }
    );
  }
}
