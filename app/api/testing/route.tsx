import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Parse the query parameters from the URL
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page"); // Get the 'page' parameter

  // Validate the 'page' parameter

  // Handle the response based on the page
  return NextResponse.json({
    message: `You requested page ${page}`,
  });
}
