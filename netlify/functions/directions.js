export default async (req, context) => {
  const url = new URL(req.url);
  const origin = url.searchParams.get("origin");
  const destination = url.searchParams.get("destination");
  const priority = url.searchParams.get("priority") || "RECOMMEND";
  const avoid = url.searchParams.get("avoid") || "";
  const full = url.searchParams.get("full") || ""; // full=1 이면 경로 좌표 포함

  if (!origin || !destination) {
    return new Response(JSON.stringify({ error: "origin, destination 필수" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const avoidParam = avoid ? `&avoid=${avoid}` : "";
  // full=1: summary=false 로 도로 좌표(vertexes)까지 받음
  const summaryParam = full ? "&summary=false" : "&summary=true";
  const apiUrl = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}&priority=${priority}${avoidParam}${summaryParam}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}`,
      },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/directions" };
