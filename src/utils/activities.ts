import { ActivityDefinition } from "../types/activities";
import { ACTIVITY_DEFINITIONS_MAP } from "../constants/activityDefinitions";
import { HIGH_LEVEL_CATEGORIES } from "../constants/highLevelCategories";
import { ChartData } from "../types/visualization";

// Get full activity definition from ID
export function getActivityDefinition(id: string): ActivityDefinition | undefined {
    return ACTIVITY_DEFINITIONS_MAP[id];
}

// Get human-readable name for an activity
export function getActivityName(id: string): string {
    return ACTIVITY_DEFINITIONS_MAP[id]?.name || id;
}

// Get activity description
export function getActivityDescription(id: string): string {
    return ACTIVITY_DEFINITIONS_MAP[id]?.description || '';
}

// Get high level category name for an activity
export function getHighLevelCategoryName(id: string): string {
    const highLevelCategoryId = ACTIVITY_DEFINITIONS_MAP[id]?.highLevelCategory;
    return HIGH_LEVEL_CATEGORIES.find(cat => cat.id === highLevelCategoryId)?.name || '';
}

// Transform raw data to include activity definitions for charts
export function enrichChartData(data: Array<{
    subcategory: string;
    hoursPerDay: number;
    uncertainty?: number;
}>): ChartData[] {
    return data.map(item => ({
        id: item.subcategory,
        name: getActivityName(item.subcategory),
        value: item.hoursPerDay,
        uncertainty: item.uncertainty || 0,
        description: getActivityDescription(item.subcategory),
        highLevelCategory: getHighLevelCategoryName(item.subcategory),
        group: getHighLevelCategoryName(item.subcategory)
    }));
}

// Group chart data by high level category
export function groupByHighLevelCategory(data: ChartData[]): Record<string, ChartData[]> {
    return data.reduce((acc, item) => {
        const category = item.highLevelCategory || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, ChartData[]>);
}