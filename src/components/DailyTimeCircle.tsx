import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useData } from "../context/DataContext";
import { ACTIVITY_COLORS } from "../constants/activityGroups";
import { formatHoursToHRM } from "../utils/time";
import { enrichChartData } from "../utils/activities";

export function DailyTimeCircle() {
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
            <h2 className="text-xl mb-4">Pie Chart Breakdown</h2>
            <div style={{ width: "100%", height: "calc(100% - 2rem)" }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={200}
                            fill="#8884d8"
                            label={(entry) => entry.name}
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={`cell-${entry.id}`}
                                    fill={ACTIVITY_COLORS[entry.id]}
                                />
                            ))}
                        </Pie>
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
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}