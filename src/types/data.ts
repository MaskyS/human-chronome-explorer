// src/types/data.ts
export interface TimeActivity {
    subcategory: string;
    hoursPerDay: number;
    uncertainty: number;
}

export interface CountryData {
    subcategory: string;
    countryISO3: string;
    countryName: string;
    regionCode: string;
    regionName: string;
    population: number;
    hoursPerDayCombined: number;
    uncertaintyCombined: number;
    dataStatus: 'observed' | 'interpolated';
    dataStatusEconomic: 'observed' | 'interpolated';
}

export interface GlobalTimeData {
    subcategory: string;
    hoursPerDay: number;
    uncertainty: number;
}

export interface EconomicData {
    subcategory: string;
    hoursPerDay: number;
    uncertainty: number;
}

export interface ProcessedData {
    global: GlobalTimeData[];
    economic: EconomicData[];
    countries: CountryData[];
}
