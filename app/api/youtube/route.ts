export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "worship music";

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${q}&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch YouTube videos" },
      { status: 500 }
    );
  }
}
