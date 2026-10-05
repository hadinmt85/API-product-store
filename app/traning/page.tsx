'use client'
import { useEffect, useState } from "react"

const Page = () => {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [windSpeed, setWindSpeed] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lastUpdated, setLastUpdated] = useState("");

    const loadWeather = () => {
        setLoading(true);
        fetch("https://api.open-meteo.com/v1/forecast?latitude=35.69&longitude=51.39&current=temperature_2m,wind_speed_10m").then(
            async (res) => {
                if (!res.ok) {
                    throw new Error("Request failed");
                }
                const body = await res.json();
                setTemperature(body.current.temperature_2m);
                setWindSpeed(body.current.wind_speed_10m);
                setLastUpdated(new Date().toLocaleTimeString("en-GB"));
                setLoading(false);
                setError(false);
            }
        ).catch(() => {
            setError(true);
            setLoading(false);
        })
    }

    useEffect(() => {
        loadWeather();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-5 mx-auto my-auto border-2 border-blue-500 p-10">
            {loading && <h2 className="mx-auto">...Loading</h2>}
            {error && !loading && <p className="mx-auto text-red-600 font-bold">Failed to load weather</p>}
            {!loading && !error && (
                <div>
                    <p>Temperature: {temperature} °C</p>
                    <p>Wind speed: {windSpeed} km/h</p>
                </div>
            )}
            <p>Last Updated: {lastUpdated}</p>
            <button className="border-2 border-blue-900 rounded-2xl p-1 bg-blue-500 text-white cursor-pointer" onClick={loadWeather} disabled={loading}>
                Refresh Weather
            </button>
        </div>
    )
}

export default Page;