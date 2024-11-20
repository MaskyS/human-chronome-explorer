import { ActivityDefinition } from '../types/activities';

export const ACTIVITY_DEFINITIONS: ActivityDefinition[] = [
    // Food Provision
    {
        id: "growth_collection",
        name: "Food Growth and Collection",
        description: "All activities related to the growth of edible organic matter, and/or its collection and initial storage. Includes farming, fishing, aquaculture, gathering and hunting.",
        highLevelCategory: "food_provision"
    },
    {
        id: "processing",
        name: "Food Processing",
        description: "Processing of food after collection and initial storage, by physical and chemical transformation of edible components, to prevent spoilage, detoxify, and/or facilitate transport and later use.",
        highLevelCategory: "food_provision"
    },
    {
        id: "preparation",
        name: "Final Food Preparation",
        description: "Final preparation of food within days or hours of eating, including at home, restaurant, street food, catering etc. Includes cleanup of preparation surfaces, serving, and washing of dishes.",
        highLevelCategory: "food_provision"
    },
    // Non-food Provision
    {
        id: "material",
        name: "Extraction of Materials",
        description: "The extraction of substances to be used for the creation of artifacts, buildings and infrastructure. Includes short-range transportation and stockpiling, and initial, essential processing of raw materials.",
        highLevelCategory: "non_food_provision"
    },
    {
        id: "energy",
        name: "Energy Provision",
        description: "Extraction and transport of energy carriers, including construction and operation of energy transformation facilities and long-distance transportation infrastructure.",
        highLevelCategory: "non_food_provision"
    },
    // Transformation
    {
        id: "artifacts",
        name: "Artifact Creation and Maintenance",
        description: "All activities involved in creating and maintaining movable objects from raw materials (not buildings and infrastructure). Does not include minor transformation of objects during their use.",
        highLevelCategory: "transformation"
    },
    {
        id: "buildings",
        name: "Building Creation and Maintenance",
        description: "The making and integral maintenance of any kind of building or monument, including the initial design, construction and renovation.",
        highLevelCategory: "transformation"
    },
    {
        id: "infrastructure",
        name: "Infrastructure Creation and Maintenance",
        description: "The engineering, construction and maintenance of persistent infrastructure to transport people, materials, and information, but not energy. Includes communications infrastructure.",
        highLevelCategory: "transformation"
    },
    // Maintenance of Surroundings
    {
        id: "inhabited",
        name: "Inhabited Environment Maintenance",
        description: "Maintenance of living and nonliving features of inhabited space, including home and workspace interiors, grounds, decorative gardening and domestic animal care (not for eating), as well as laundry/clothes/textile washing and care.",
        highLevelCategory: "inhabited_environment"
    },
    {
        id: "waste",
        name: "External Waste Management",
        description: "Waste management that occurs outside of inhabited buildings and their immediate environment, including sewage systems and solid waste disposal/recycling.",
        highLevelCategory: "inhabited_environment"
    },
    // Neural Restructure
    {
        id: "education_research",
        name: "Teaching and Learning",
        description: "All deliberate education and research activities not incorporated as part of another activity, including going to classes, homework, teaching classes, tutoring, as well as informally educating children, purposeful story telling, and research in the academic or private sector.",
        highLevelCategory: "neural_restructure"
    },
    {
        id: "religious",
        name: "Religious Practice",
        description: "Religious practice and religious social/cultural events.",
        highLevelCategory: "neural_restructure"
    },
    // Somatic Maintenance
    {
        id: "sleep",
        name: "Sleep",
        description: "Sleep, naps, sleeplessness.",
        highLevelCategory: "somatic_maintenance"
    },
    {
        id: "hygiene_grooming",
        name: "Hygiene and Grooming",
        description: "Maintaining the cleanliness and appearance of the soma through activities such as washing, dressing, cutting hair/nails, and voiding wastes. Includes personal hygiene and grooming of oneself, grooming others, and being groomed.",
        highLevelCategory: "somatic_maintenance"
    },
    {
        id: "childcare",
        name: "Physical Childcare",
        description: "Physical and practical care of young people, including cleaning, feeding and minding young children to ensure safety. Not deliberate education/teaching or interactive play.",
        highLevelCategory: "somatic_maintenance"
    },
    {
        id: "adultcare",
        name: "Healthcare and Adult Care",
        description: "All deliberate health care, including physical and medical support (e.g. nursing, medicalized mental health care, senior care, residential care and health/medical care of self).",
        highLevelCategory: "somatic_maintenance"
    },
    // Organization
    {
        id: "moving_people",
        name: "Moving People",
        description: "Travel that is undertaken for the purpose of changing the location of a person. Includes the time of the traveler, as well as any vehicle operator.",
        highLevelCategory: "organization"
    },
    {
        id: "moving_artifacts",
        name: "Moving Non-people",
        description: "Moving artifacts, materials and food over distances of more than a few tens of metres. Includes stocking warehouses.",
        highLevelCategory: "organization"
    },
    {
        id: "allocation",
        name: "Allocation",
        description: "Altering the time allocation, and control of access to objects and spatial domains, for other humans. Includes diverse decision-making, task allocation, negotiation, discussion, and record-keeping activities.",
        highLevelCategory: "organization"
    },
    // Experience-oriented
    {
        id: "meals",
        name: "Meals",
        description: "Activities centered on eating and drinking, including associated socializing.",
        highLevelCategory: "experience_oriented"
    },
    {
        id: "active_rec",
        name: "Active Recreation",
        description: "Recreation that involves an elevated metabolic activity (including light physical activity), whether undertaken purely for neural activation or including a fitness motivation.",
        highLevelCategory: "experience_oriented"
    },
    {
        id: "social",
        name: "Social Interaction",
        description: "Socializing that is not part of another activity.",
        highLevelCategory: "experience_oriented"
    },
    {
        id: "interactive",
        name: "Interactive Stimulation",
        description: "Any other activities undertaken for the sake of experience that engage motor or linguistic output. Includes play with children.",
        highLevelCategory: "experience_oriented"
    },
    {
        id: "passive",
        name: "Passive Observation",
        description: "Looking/listening without engaging, i.e. neither involving interactive movement or generating written or spoken language. Can have a broad range of arousal levels, from quiet rest to watching an action movie.",
        highLevelCategory: "experience_oriented"
    }
];

export const ACTIVITY_DEFINITIONS_MAP = ACTIVITY_DEFINITIONS.reduce((acc, def) => {
    acc[def.id] = def;
    return acc;
}, {} as Record<string, ActivityDefinition>);