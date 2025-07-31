"use client";

import React from "react";
import { matches, venues } from "@/data/matches";
import { generateTimeSlots } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"


export default function TimelineCalendar() {
    const times = generateTimeSlots();

    return (
        <div className="overflow-auto text-gray-700">
            <table className="min-w-[800px] border border-gray-300 text-sm bg-white">
                <thead>
                    <tr>
                        <th className="sticky left-0 bg-white z-10">
                            Cancha / Hora
                        </th>
                        {times.map((time) => (
                            <th
                                key={time}
                                className="border px-2 py-1 text-center"
                            >
                                {time}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {venues.map((venue) => (
                        <tr key={venue.id}>
                            <td className="sticky left-0 bg-white font-bold px-2">
                                {venue.name}
                            </td>
                            {times.map((time) => {
                                const dateTime = `2025-07-15T${time}:00`; // Simulación de un día fijo
                                const match = matches.find(
                                    (m) =>
                                        m.venueId === venue.id &&
                                        m.start === dateTime
                                );

                                return (
                                    <td
                                        key={`${venue.id}-${time}`}
                                        className="border h-10 text-center"
                                    >
                                        {match ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="bg-green-100 text-green-700 font-semibold rounded px-1 py-0.5 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis">
                                                            Partido
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-white text-sm text-gray-800 shadow-md border p-2 rounded">
                                                        <div className="font-bold">
                                                            {match.title}
                                                        </div>
                                                        <div>
                                                            {new Date(
                                                                match.start
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}{" "}
                                                            -{" "}
                                                            {new Date(
                                                                match.end
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : null}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
