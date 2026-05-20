import { NextResponse } from "next/server";

const USERNAME = "Abhijeetsingh2100";

export const runtime = "nodejs";

export async function GET() {
  try {
    const response = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: {
        Accept: "image/svg+xml,text/html;q=0.9,*/*;q=0.8",
        "User-Agent": "abhijeet-portfolio",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to load GitHub contribution graph." },
        { status: response.status },
      );
    }

    const svg = await response.text();
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while loading contribution graph." },
      { status: 500 },
    );
  }
}
