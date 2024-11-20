// src/utils/dataProcessor.ts
import {
  TimeActivity,
  CountryData,
  EconomicData,
  GlobalTimeData,
} from "../types/data";
// import { CountryData } from '../types/data';
import { ACTIVITY_GROUPS } from "../constants/activityGroups";
import countryRegionsCSV from "../data/country_regions.csv?raw";

export function processRawCSVData(csvText: string): CountryData[] {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  const { regionMapping, countryMapping } =
    readRegionMapping(countryRegionsCSV);

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const countryISO3 = values[1];
    const regionCode = values[2];
    const regionName = regionMapping[countryISO3] || "";
    const countryName = countryMapping[countryISO3] || "";

    return {
      subcategory: values[0],
      countryISO3,
      countryName,
      regionCode,
      regionName,
      population: Number(values[3]),
      hoursPerDayCombined: Number(values[4]),
      uncertaintyCombined: Number(values[5]),
      dataStatus: values[6] as "observed" | "interpolated",
      dataStatusEconomic: values[7] as "observed" | "interpolated",
    };
  });
}

function readRegionMapping(csvText: string): {
  regionMapping: Record<string, string>;
  countryMapping: Record<string, string>;
} {
  const lines = csvText.trim().split("\n");
  const regionMapping: Record<string, string> = {};
  const countryMapping: Record<string, string> = {};

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    regionMapping[values[5]] = values[1]; // country_iso3 -> region_name
    countryMapping[values[5]] = values[2]; // country_iso3 -> country_name
  }

  return { regionMapping, countryMapping };
}
export function processGlobalData(csvText: string): GlobalTimeData[] {
  const lines = csvText.trim().split("\n");
  return lines.slice(1).map((line) => {
    const [subcategory, hoursPerDay, uncertainty] = line.split(",");
    return {
      subcategory,
      hoursPerDay: Number(hoursPerDay),
      uncertainty: Number(uncertainty),
    };
  });
}

export function processEconomicData(csvText: string): EconomicData[] {
  const lines = csvText.trim().split("\n");
  return lines.slice(1).map((line) => {
    const [subcategory, hoursPerDay, uncertainty] = line.split(",");
    return {
      subcategory,
      hoursPerDay: Number(hoursPerDay),
      uncertainty: Number(uncertainty),
    };
  });
}

// Add data transformation utilities
export function groupByRegion(data: CountryData[]) {
  return data.reduce(
    (acc, item) => {
      if (!acc[item.regionCode]) {
        acc[item.regionCode] = [];
      }
      acc[item.regionCode].push(item);
      return acc;
    },
    {} as Record<string, CountryData[]>,
  );
}

export function calculateRegionalAverages(regionData: CountryData[]) {
  const subcategories = [...new Set(regionData.map((d) => d.subcategory))];

  return subcategories.map((subcategory) => {
    const activitiesInRegion = regionData.filter(
      (d) => d.subcategory === subcategory,
    );
    const totalPopulation = activitiesInRegion.reduce(
      (sum, d) => sum + d.population,
      0,
    );

    const weightedAverage =
      activitiesInRegion.reduce((sum, d) => {
        return sum + d.hoursPerDayCombined * d.population;
      }, 0) / totalPopulation;

    return {
      subcategory,
      hoursPerDay: weightedAverage,
      totalPopulation,
    };
  });
}

interface DataQualityFilter {
  includeObserved: boolean;
  includeInterpolated: boolean;
  includeEconomicObserved: boolean;
  includeEconomicInterpolated: boolean;
}

export function applyFilters(
  data: CountryData[],
  selectedRegions: string[],
  selectedCountries: string[],
  dataQualityFilter: DataQualityFilter,
  selectedActivityGroups: string[],
  selectedActivities: string[],
): CountryData[] {
  let filteredData = [...data];

  // Filter by region
  if (selectedRegions.length > 0) {
    filteredData = filteredData.filter((d) =>
      selectedRegions.includes(d.regionName),
    );
  }

  // Filter by country
  if (selectedCountries.length > 0) {
    filteredData = filteredData.filter((d) =>
      selectedCountries.includes(d.countryName),
    );
  }

  // Filter by data quality
  filteredData = filteredData.filter((d) => {
    if (d.dataStatus === "observed" && !dataQualityFilter.includeObserved)
      return false;
    if (
      d.dataStatus === "interpolated" &&
      !dataQualityFilter.includeInterpolated
    )
      return false;
    if (
      d.dataStatusEconomic === "observed" &&
      !dataQualityFilter.includeEconomicObserved
    )
      return false;
    if (
      d.dataStatusEconomic === "interpolated" &&
      !dataQualityFilter.includeEconomicInterpolated
    )
      return false;
    return true;
  });

  // Filter by activity group
  if (selectedActivityGroups.length > 0) {
    const selectedActivities = selectedActivityGroups.flatMap(
      (groupName) =>
        ACTIVITY_GROUPS.find((group) => group.name === groupName)?.activities ||
        [],
    );
    filteredData = filteredData.filter((d) =>
      selectedActivities.includes(d.subcategory),
    );
  }

  // Filter by individual activity
  if (selectedActivities.length > 0) {
    filteredData = filteredData.filter((d) =>
      selectedActivities.includes(d.subcategory),
    );
  }

  return filteredData;
}
