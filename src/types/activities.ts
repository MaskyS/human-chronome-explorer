export interface ActivityDefinition {
    id: string;
    name: string;
    description: string;
    highLevelCategory: string;
}

export interface HighLevelCategory {
    id: string;
    name: string;
    description: string;
}

export interface ActivityGroup {
    id: string;
    name: string;
    description: string;
    color: string;
    activities: string[];
}