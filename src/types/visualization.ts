export interface ChartData {
    id: string;               // Activity ID (e.g., "active_rec")
    name: string;             // Human readable name (e.g., "Active Recreation")
    value: number;            // Hours per day
    uncertainty: number;      // Uncertainty value
    description: string;      // Full MOOGAL description
    highLevelCategory: string;// High level category name
    group?: string;          // Optional group for visualization purposes
    color?: string;          // Optional color override
}

export interface ActivityGroup {
    id: string;
    name: string;
    description: string;
    color: string;
    activities: string[];
}