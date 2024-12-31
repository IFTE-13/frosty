import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        const searchParams = req.nextUrl.searchParams;

        const lat = searchParams.get("lat");
        const lon = searchParams.get("lon");

        const dailyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const dailyRes = await fetch(dailyUrl, {
            next: { revalidate: 3600 },
        });

        const dailyData = await dailyRes.json();

        return NextResponse.json(dailyData);
    } catch (error) {
        console.log(error, "Error in getting daily data ");
        return new Response("Error in getting daily data ", { status: 500 });
    }
}