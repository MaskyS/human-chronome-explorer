// src/utils/dataValidator.ts
import { CountryData, GlobalTimeData, EconomicData } from '../types/data';

export interface FileValidationResult {
    filename: string;
    isValid: boolean;
    totalRows: {
        raw: number;
        processed: number;
    };
    missingSubcategories: string[];
    invalidValues: {
        field: string;
        count: number;
        examples: string[];
    }[];
    summary: string;
}

export interface ValidationSummary {
    filesChecked: string[];
    allValid: boolean;
    results: Record<string, FileValidationResult>;
}

export function validateAllData(
    rawFiles: Record<string, string>,
    processedData: {
        countries: CountryData[];
        global: GlobalTimeData[];
        economic: EconomicData[];
    }
): ValidationSummary {
    const results: Record<string, FileValidationResult> = {};
    
    // Validate each file
    if (rawFiles['all_countries.csv'] && processedData.countries) {
        results['all_countries.csv'] = validateProcessedData(
            'all_countries.csv',
            rawFiles['all_countries.csv'], 
            processedData.countries
        );
    }
    
    if (rawFiles['global_human_day.csv'] && processedData.global) {
        results['global_human_day.csv'] = validateProcessedData(
            'global_human_day.csv',
            rawFiles['global_human_day.csv'], 
            processedData.global
        );
    }
    
    if (rawFiles['global_economic_activity.csv'] && processedData.economic) {
        results['global_economic_activity.csv'] = validateProcessedData(
            'global_economic_activity.csv',
            rawFiles['global_economic_activity.csv'], 
            processedData.economic
        );
    }

    return {
        filesChecked: Object.keys(results),
        allValid: Object.values(results).every(r => r.isValid),
        results
    };
}

function validateProcessedData(
    filename: string,
    rawCsv: string, 
    processedData: CountryData[] | GlobalTimeData[] | EconomicData[]
): FileValidationResult {
    const lines = rawCsv.trim().split('\n');
    const headers = lines[0].split(',');
    const rawData = lines.slice(1);

    const totalRows = {
        raw: rawData.length,
        processed: processedData.length
    };

    const rawSubcategories = new Set(rawData.map(line => line.split(',')[0]));
    const processedSubcategories = new Set(processedData.map(d => d.subcategory));
    const missingSubcategories = [...rawSubcategories].filter(
        sub => !processedSubcategories.has(sub)
    );

    const invalidValues = [];
    
    // Check numeric fields based on file type
    const numericFields = filename === 'all_countries.csv' 
        ? ['population', 'hoursPerDayCombined', 'uncertaintyCombined']
        : ['hoursPerDay', 'uncertainty'];

    for (const field of numericFields) {
        const invalid = processedData.filter(d => {
            const value = d[field as keyof typeof d];
            return typeof value !== 'number' || isNaN(value);
        });
        if (invalid.length > 0) {
            invalidValues.push({
                field,
                count: invalid.length,
                examples: invalid.slice(0, 3).map(d => JSON.stringify(d))
            });
        }
    }

    return {
        filename,
        isValid: totalRows.raw === totalRows.processed && 
                missingSubcategories.length === 0 && 
                invalidValues.length === 0,
        totalRows,
        missingSubcategories,
        invalidValues,
        summary: `
            File: ${filename}
            Total rows: ${totalRows.raw} raw, ${totalRows.processed} processed
            Missing subcategories: ${missingSubcategories.length}
            Invalid values found: ${invalidValues.length} fields with issues
        `.trim()
    };
}