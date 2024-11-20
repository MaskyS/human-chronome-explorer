import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useData } from "../context/DataContext";
import { formatHoursToHRM } from "../utils/time";
import { enrichChartData, groupByHighLevelCategory } from "../utils/activities";
import { ACTIVITY_COLORS } from "../constants/activityGroups";

export function GlobalTimeDistribution() {
    const { filteredData, loading, error } = useData();

    const chartData = useMemo(() => {
        if (!filteredData) return [];

        const aggregatedData: Record<
            string,
            { totalHours: number; totalPopulation: number }
        > = {};

        filteredData.forEach((item) => {
            if (aggregatedData[item.subcategory]) {
                aggregatedData[item.subcategory].totalHours +=
                    item.hoursPerDayCombined * item.population;
                aggregatedData[item.subcategory].totalPopulation += item.population;
            } else {
                aggregatedData[item.subcategory] = {
                    totalHours: item.hoursPerDayCombined * item.population,
                    totalPopulation: item.population,
                };
            }
        });

        const rawData = Object.entries(aggregatedData).map(
            ([subcategory, { totalHours, totalPopulation }]) => ({
                subcategory,
                hoursPerDay: totalHours / totalPopulation,
            })
        );

        return enrichChartData(rawData);
    }, [filteredData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ width: "100%", height: "600px" }}>
            <h2 className="text-xl mb-4">Global Time Distribution (hours/day)</h2>
            <div style={{ width: "100%", height: "calc(100% - 2rem)" }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 60, bottom: 100 }}
                    >
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={100}
                        />
                        <YAxis
                            label={{
                                value: "Hours per Day",
                                angle: -90,
                                position: "insideLeft",
                                offset: -40,
                            }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload || payload.length === 0) {
                                    return null;
                                }
                                const data = payload[0].payload;
                                const formattedTime = formatHoursToHRM(
                                    parseFloat(data.value.toFixed(2))
                                );

                                return (
                                    <div className="bg-white p-4 rounded shadow-lg border max-w-md">
                                        <h3 className="font-bold">{data.name}</h3>
                                        <p className="text-sm text-gray-600">{data.description}</p>
                                        <p className="mt-2">
                                            <span className="font-semibold">Time:</span> {formattedTime}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="font-semibold">Category:</span> {data.highLevelCategory}
                                        </p>
                                    </div>
                                );
                            }}
                        />
                        <Bar
                            dataKey="value"
                            name="Hours per Day"
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={`cell-${entry.id}`}
                                    fill={ACTIVITY_COLORS[entry.id]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}