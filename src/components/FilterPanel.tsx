// src/components/FilterPanel.tsx
import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import Flag from "react-world-flags";
import { ACTIVITY_GROUPS } from "../constants/activityGroups";
import { getActivityDefinition } from "../utils/activities";
import { ACTIVITY_DEFINITIONS_MAP } from "../constants/activityDefinitions";
import { HIGH_LEVEL_CATEGORIES } from "../constants/highLevelCategories";
import { applyFilters } from "../utils/dataProcessor";
import { 
    Tooltip,
    TooltipContent, 
    TooltipProvider,
    TooltipTrigger, ActivityTooltipProps
} from '@/components/ui/tooltip';


interface DataQualityFilter {
    includeObserved: boolean;
    includeInterpolated: boolean;
    includeEconomicObserved: boolean;
    includeEconomicInterpolated: boolean;
}

export const FilterPanel: React.FC = () => {
    const { data, updateFilteredData } = useData();

    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [dataQualityFilter, setDataQualityFilter] = useState<DataQualityFilter>(
        {
            includeObserved: true,
            includeInterpolated: true,
            includeEconomicObserved: true,
            includeEconomicInterpolated: true,
        },
    );
    const [selectedActivityGroups, setSelectedActivityGroups] = useState<
        string[]
    >([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

    useEffect(() => {
        if (data) {
            const filteredData = applyFilters(
                data.countries,
                selectedRegions,
                selectedCountries,
                dataQualityFilter,
                selectedActivityGroups,
                selectedActivities,
            );
            updateFilteredData(filteredData);
        }
    }, [
        data,
        selectedRegions,
        selectedCountries,
        dataQualityFilter,
        selectedActivityGroups,
        selectedActivities,
    ]);

    const handleRegionChange = (region: string) => {
        setSelectedRegions((prevRegions) => {
            if (prevRegions.includes(region)) {
                return prevRegions.filter((r) => r !== region);
            } else {
                return [...prevRegions, region];
            }
        });
    };

    const handleCountryChange = (country: string) => {
        setSelectedCountries((prevCountries) => {
            if (prevCountries.includes(country)) {
                return prevCountries.filter((c) => c !== country);
            } else {
                return [...prevCountries, country];
            }
        });
    };

    const handleDataQualityChange = (key: keyof DataQualityFilter) => {
        setDataQualityFilter((prevFilter) => ({
            ...prevFilter,
            [key]: !prevFilter[key],
        }));
    };

    const handleActivityGroupChange = (groupName: string) => {
        setSelectedActivityGroups((prevGroups) => {
            if (prevGroups.includes(groupName)) {
                return prevGroups.filter((g) => g !== groupName);
            } else {
                return [...prevGroups, groupName];
            }
        });
    };

    const handleActivityChange = (activity: string) => {
        setSelectedActivities((prevActivities) => {
            if (prevActivities.includes(activity)) {
                return prevActivities.filter((a) => a !== activity);
            } else {
                return [...prevActivities, activity];
            }
        });
    };

    const regions = Array.from(
        new Set(data?.countries.map((d) => d.regionName) || []),
    )
        .filter(Boolean)
        .sort();
    // Adjust this part to get a sorted, unique list of countries
    // Use a Map to ensure unique countries
    const countryMap = new Map<
        string,
        { countryName: string; countryISO3: string }
    >();

    data?.countries.forEach(({ countryName, countryISO3 }) => {
        if (countryName && !countryMap.has(countryName)) {
            countryMap.set(countryName, { countryName, countryISO3 });
        }
    });

    const countries = Array.from(countryMap.values()).sort((a, b) =>
        a.countryName.localeCompare(b.countryName),
    );

    const ActivityTooltip: React.FC<ActivityTooltipProps> = ({ trigger, content }) => (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {trigger}
                </TooltipTrigger>
                <TooltipContent 
                    className="z-50 rounded-md bg-white p-4 text-sm shadow-md border max-w-sm"
                    sideOffset={5}
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );    


    return (
        <div className="p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Geographic filter */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Regions</h3>
                <div style={{ maxHeight: "200px", overflow: "auto" }}>
                    {regions.map((region, i) => (
                        <label key={region + i} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                checked={selectedRegions.includes(region)}
                                onChange={() => handleRegionChange(region)}
                                className="mr-2"
                            />
                            {region}
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Countries</h3>
                <div style={{ maxHeight: "200px", overflow: "auto" }}>
                    {countries.map(({ countryName, countryISO3 }) => (
                        <label key={countryName} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                checked={selectedCountries.includes(countryName)}
                                onChange={() => handleCountryChange(countryName)}
                                className="mr-2"
                            />
                            <Flag
                                code={countryISO3}
                                className="mr-2"
                                style={{ width: "20px", height: "15px" }}
                            />
                            {countryName}
                        </label>
                    ))}
                </div>
            </div>



            {/* Activity Groups filter */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Activity Groups</h3>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
                    {ACTIVITY_GROUPS.map((group) => (
                        <ActivityTooltip
                            key={group.id}
                            trigger={
                                <label className="flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedActivityGroups.includes(group.name)}
                                        onChange={() => handleActivityGroupChange(group.name)}
                                        className="mr-2"
                                    />
                                    <span className="truncate">{group.name}</span>
                                </label>
                            }
                            content={
                                <div>
                                    <h4 className="font-bold">{group.name}</h4>
                                    <p className="text-sm text-gray-600">{group.description}</p>
                                    <div className="mt-2">
                                        <span className="text-xs font-semibold">Activities:</span>
                                        <ul className="text-xs list-disc list-inside">
                                            {group.activities.map(activityId => (
                                                <li key={activityId}>
                                                    {ACTIVITY_DEFINITIONS_MAP[activityId]?.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            }
                        />
                    ))}
                </div>
            </div>
            {/* Individual Activities filter */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Individual Activities</h3>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
                    {data?.countries
                        .flatMap((d) => d.subcategory)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .sort()
                        .map((activityId) => {
                            const activity = ACTIVITY_DEFINITIONS_MAP[activityId];
                            if (!activity) return null;

                            return (
                                <ActivityTooltip
                                    key={activityId}
                                    trigger={
                                        <label className="flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedActivities.includes(activityId)}
                                                onChange={() => handleActivityChange(activityId)}
                                                className="mr-2"
                                            />
                                            <span className="truncate">{activity.name}</span>
                                        </label>
                                    }
                                    content={
                                        <div>
                                            <h4 className="font-bold">{activity.name}</h4>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                <span className="font-semibold">Category:</span>{" "}
                                                {HIGH_LEVEL_CATEGORIES.find(
                                                    cat => cat.id === activity.highLevelCategory
                                                )?.name}
                                            </p>
                                        </div>
                                    }
                                />
                            );
                        })}
                </div>
            </div>
            {/* Data quality filter */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Data Quality</h3>
                <label className="flex items-center mb-1">
                    <input
                        type="checkbox"
                        checked={dataQualityFilter.includeObserved}
                        onChange={() => handleDataQualityChange("includeObserved")}
                        className="mr-2"
                    />
                    Include observed data
                </label>
                <label className="flex items-center mb-1">
                    <input
                        type="checkbox"
                        checked={dataQualityFilter.includeInterpolated}
                        onChange={() => handleDataQualityChange("includeInterpolated")}
                        className="mr-2"
                    />
                    Include interpolated data
                </label>
                <label className="flex items-center mb-1">
                    <input
                        type="checkbox"
                        checked={dataQualityFilter.includeEconomicObserved}
                        onChange={() => handleDataQualityChange("includeEconomicObserved")}
                        className="mr-2"
                    />
                    Include observed economic data
                </label>
                <label className="flex items-center mb-1">
                    <input
                        type="checkbox"
                        checked={dataQualityFilter.includeEconomicInterpolated}
                        onChange={() =>
                            handleDataQualityChange("includeEconomicInterpolated")
                        }
                        className="mr-2"
                    />
                    Include interpolated economic data
                </label>
            </div>
            {/* Filter summary */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Active Filters</h3>
                <div>
                    <strong>Regions:</strong> {selectedRegions.join(", ") || "All"}
                </div>
                <div>
                    <strong>Countries:</strong> {selectedCountries.join(", ") || "All"}
                </div>
                <div>
                    <strong>Data Quality:</strong>
                    <ul>
                        <li>
                            Observed data:{" "}
                            {dataQualityFilter.includeObserved ? "Included" : "Excluded"}
                        </li>
                        <li>
                            Interpolated data:{" "}
                            {dataQualityFilter.includeInterpolated ? "Included" : "Excluded"}
                        </li>
                        <li>
                            Observed economic data:{" "}
                            {dataQualityFilter.includeEconomicObserved
                                ? "Included"
                                : "Excluded"}
                        </li>
                        <li>
                            Interpolated economic data:{" "}
                            {dataQualityFilter.includeEconomicInterpolated
                                ? "Included"
                                : "Excluded"}
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>Activity Groups:</strong>{" "}
                    {selectedActivityGroups.join(", ") || "All"}
                </div>
                <div>
                    <strong>Individual Activities:</strong>{" "}
                    {selectedActivities.map(id => ACTIVITY_DEFINITIONS_MAP[id]?.name).join(", ") || "All"}
                </div>
            </div>
        </div>
    );
};
