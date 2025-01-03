"use client";
import React, { useEffect, useState } from "react";
import {
    clearSky,
    cloudy,
    drizzleIcon,
    navigation,
    rain,
    snow,
    thunderStrome
} from "@/utils/icons";
import { kelvinToCelsius } from "@/utils/misc";
import moment from "moment";
import { useGlobalContext } from "@/context/globalContext";
import { Skeleton } from "@/components/ui/skeleton";

function Temperature() {
    const { forecast } = useGlobalContext();

    
    // State
    const [localTime, setLocalTime] = useState<string>("");
    const [currentDay, setCurrentDay] = useState<string>("");

    // Live time update
    useEffect(() => {
        if (forecast && forecast.timezone) {
            // update time every second
            const interval = setInterval(() => {
                const localMoment = moment().utcOffset(forecast.timezone / 60);
                // custom format: 24 hour format
                const formatedTime = localMoment.format("HH:mm");
                // day of the week
                const day = localMoment.format("dddd");

                setLocalTime(formatedTime);
                setCurrentDay(day);
            }, 1000);

            // clear interval
            return () => clearInterval(interval);
        }
    }, [forecast]);

    const { main, name, weather } = forecast;

    if (!forecast || !weather) {
        return <Skeleton className="h-[12rem] w-full" />;
    }

    const temp = kelvinToCelsius(main?.temp);
    const minTemp = kelvinToCelsius(main?.temp_min);
    const maxTemp = kelvinToCelsius(main?.temp_max);

    const { main: weatherMain, description } = weather[0];

    const getIcon = () => {
        switch (weatherMain) {
            case "Drizzle":
                return drizzleIcon;
            case "Rain":
                return rain;
            case "Snow":
                return snow;
            case "Clear":
                return clearSky;
            case "Clouds":
                return cloudy;
            case "Thunderstorm":
                return thunderStrome;
            default:
                return clearSky;
        }
    };

    return (
        <div
            className="pt-6 pb-5 px-4 border rounded-lg flex flex-col 
        justify-between dark:bg-dark-grey shadow-sm dark:shadow-none"
        >
            <p className="flex justify-between items-center">
                <span className="font-medium">{currentDay}</span>
                <span className="font-medium">{localTime}</span>
            </p>
            <p className="pt-2 font-bold flex gap-1">
                <span>{name}</span>
                <span>{navigation}</span>
            </p>
            <p className="py-10 text-9xl font-bold self-center">{temp}°</p>

            <div>
                <div>
                    <span>{getIcon()}</span>
                    <p className="pt-2 capitalize text-lg font-medium">{description}</p>
                </div>
                <p className="flex items-center gap-2 pt-2">
                    <span>Low: {minTemp}°</span>
                    <span>High: {maxTemp}°</span>
                </p>
            </div>
        </div>
    );
}

export default Temperature;