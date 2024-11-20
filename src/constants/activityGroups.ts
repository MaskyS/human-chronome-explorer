import { ActivityGroup } from "../types/activities";

export const ACTIVITY_GROUPS: ActivityGroup[] = [
    {
        id: "basic_needs",
        name: "Basic Needs",
        description: "Essential daily activities required for human survival and well-being",
        color: "#2E4057",
        activities: ["sleep", "meals", "hygiene_grooming"]
    },
    {
        id: "social_experience",
        name: "Social & Experience",
        description: "Activities focused on social interaction and experiences",
        color: "#7EA172",
        activities: ["interactive", "social", "passive", "active_rec"]
    },
    {
        id: "work_production",
        name: "Work & Production",
        description: "Activities related to economic and productive output",
        color: "#45B7D1",
        activities: ["allocation", "growth_collection", "artifacts", "processing"]
    },
    {
        id: "care",
        name: "Care",
        description: "Activities focused on caring for others",
        color: "#D4A5A5",
        activities: ["childcare", "adultcare"]
    },
    {
        id: "infrastructure",
        name: "Infrastructure",
        description: "Activities related to built environment and its maintenance",
        color: "#9FA8DA",
        activities: ["buildings", "infrastructure", "inhabited"]
    },
    {
        id: "movement",
        name: "Movement",
        description: "Activities involving transportation and logistics",
        color: "#64B5F6",
        activities: ["moving_people", "moving_artifacts"]
    },
    {
        id: "development",
        name: "Development",
        description: "Activities focused on learning and spiritual growth",
        color: "#FFB74D",
        activities: ["education_research", "religious"]
    },
    {
        id: "resources",
        name: "Resources",
        description: "Activities related to resource management and processing",
        color: "#81C784",
        activities: ["energy", "material", "waste", "preparation"]
    }
];

export const ACTIVITY_COLORS = {
    // Basic Needs
    sleep: "#2E4057",
    meals: "#3D5270",
    hygiene_grooming: "#4C6489",

    // Social & Experience
    interactive: "#7EA172",
    social: "#8FB485",
    passive: "#A0C798",
    active_rec: "#B1DAAB",

    // Work & Production
    allocation: "#45B7D1",
    growth_collection: "#59C3DA",
    artifacts: "#6DCFE3",
    processing: "#81DBEC",

    // Care
    childcare: "#D4A5A5",
    adultcare: "#E0B8B8",

    // Infrastructure
    buildings: "#9FA8DA",
    infrastructure: "#B2BAE3",
    inhabited: "#C5CCEC",

    // Movement
    moving_people: "#64B5F6",
    moving_artifacts: "#7BC2F8",

    // Development
    education_research: "#FFB74D",
    religious: "#FFC46A",

    // Resources
    energy: "#81C784",
    material: "#94D097",
    waste: "#A7D9AA",
    preparation: "#BAE2BD"
} as const;