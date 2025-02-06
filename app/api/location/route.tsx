import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://ipinfo.io/json?token=2ce6c8d7573b1b");
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json(error);
  }
}
