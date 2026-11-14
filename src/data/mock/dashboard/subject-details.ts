export interface SubjectTopic {
  id: number;
  title: string;
  description: string;
}

export const subjectTopics: Record<string, SubjectTopic[]> = {
  "medical-surgical": [
    {
      id: 1,
      title: "Cardiovascular System",
      description: "Heart conditions, circulation and cardiovascular nursing care.",
    },
    {
      id: 2,
      title: "Respiratory System",
      description: "Respiratory disorders, oxygenation and airway management.",
    },
    {
      id: 3,
      title: "Gastrointestinal System",
      description: "Digestive disorders, nutrition and gastrointestinal care.",
    },
    {
      id: 4,
      title: "Neurological System",
      description: "Neurological conditions, assessments and interventions.",
    },
    {
      id: 5,
      title: "Endocrine System",
      description: "Hormonal disorders, diabetes and endocrine management.",
    },
    {
      id: 6,
      title: "Renal and Urinary System",
      description: "Kidney disorders, fluid balance and urinary care.",
    },
  ],

  "maternal-newborn": [
    {
      id: 1,
      title: "Antepartum Care",
      description: "Prenatal assessments, pregnancy changes and maternal health.",
    },
    {
      id: 2,
      title: "Intrapartum Care",
      description: "Labour, delivery and monitoring maternal and fetal wellbeing.",
    },
    {
      id: 3,
      title: "Postpartum Care",
      description: "Recovery after delivery and postpartum complications.",
    },
    {
      id: 4,
      title: "Newborn Care",
      description: "Newborn assessment, feeding and neonatal adaptation.",
    },
  ],

  fundamentals: [
    {
      id: 1,
      title: "Patient Safety",
      description: "Safety principles, fall prevention and risk reduction.",
    },
    {
      id: 2,
      title: "Infection Control",
      description: "Standard precautions, isolation and infection prevention.",
    },
    {
      id: 3,
      title: "Nursing Fundamentals",
      description: "Essential nursing skills and foundational clinical practices.",
    },
    {
      id: 4,
      title: "Patient Assessment",
      description: "Health histories, vital signs and physical assessment.",
    },
    {
      id: 5,
      title: "Basic Nursing Procedures",
      description: "Daily nursing procedures and patient care techniques.",
    },
  ],

  pharmacology: [
    {
      id: 1,
      title: "Medication Administration",
      description: "Safe medication practices and administration principles.",
    },
    {
      id: 2,
      title: "Pharmacological Principles",
      description: "Drug actions, interactions and pharmacokinetics.",
    },
    {
      id: 3,
      title: "Cardiovascular Medications",
      description: "Medications used to manage cardiovascular conditions.",
    },
    {
      id: 4,
      title: "Antibiotics and Anti-infectives",
      description: "Antimicrobial medications and nursing considerations.",
    },
    {
      id: 5,
      title: "Endocrine Medications",
      description: "Insulin, thyroid medications and hormonal therapies.",
    },
  ],

  "obstetrics-and-pediatrics": [
    {
      id: 1,
      title: "Pregnancy and Prenatal Care",
      description: "Maternal health and care throughout pregnancy.",
    },
    {
      id: 2,
      title: "Labour and Delivery",
      description: "Labour stages and nursing interventions.",
    },
    {
      id: 3,
      title: "Growth and Development",
      description: "Child development milestones and developmental assessment.",
    },
    {
      id: 4,
      title: "Pediatric Nursing",
      description: "Common childhood conditions and nursing care.",
    },
  ],

  "mental-health": [
    {
      id: 1,
      title: "Therapeutic Communication",
      description: "Communication techniques and therapeutic relationships.",
    },
    {
      id: 2,
      title: "Anxiety and Mood Disorders",
      description: "Assessment and care for common mood and anxiety disorders.",
    },
    {
      id: 3,
      title: "Psychotic Disorders",
      description: "Psychosis, schizophrenia and patient-centred interventions.",
    },
    {
      id: 4,
      title: "Crisis Intervention",
      description: "Crisis management and maintaining patient safety.",
    },
  ],

  "dosage-calculations": [
    {
      id: 1,
      title: "Basic Medication Calculations",
      description: "Calculating medication doses using standard formulas.",
    },
    {
      id: 2,
      title: "IV Flow Rates",
      description: "Calculating IV infusion rates and administration times.",
    },
    {
      id: 3,
      title: "Weight-Based Dosage",
      description: "Medication calculations based on patient weight.",
    },
    {
      id: 4,
      title: "Unit Conversions",
      description: "Converting common measurement and medication units.",
    },
  ],

  leadership: [
    {
      id: 1,
      title: "Delegation",
      description: "Safe delegation and assignment of nursing responsibilities.",
    },
    {
      id: 2,
      title: "Prioritization",
      description: "Determining patient care priorities and urgent interventions.",
    },
    {
      id: 3,
      title: "Management of Care",
      description: "Coordinating care and managing nursing responsibilities.",
    },
    {
      id: 4,
      title: "Ethics and Legal Issues",
      description: "Professional standards, patient rights and ethical practice.",
    },
  ],

  capstone: [
    {
      id: 1,
      title: "Comprehensive Nursing Review",
      description: "Reviewing essential concepts across nursing specialties.",
    },
    {
      id: 2,
      title: "Clinical Judgment",
      description: "Applying clinical reasoning to patient care situations.",
    },
    {
      id: 3,
      title: "Prioritization and Safety",
      description: "Making safe decisions in complex clinical situations.",
    },
  ],

  "community-health": [
    {
      id: 1,
      title: "Population Health",
      description: "Health promotion and care for diverse populations.",
    },
    {
      id: 2,
      title: "Epidemiology",
      description: "Disease patterns, prevention and population health data.",
    },
    {
      id: 3,
      title: "Community Assessment",
      description: "Assessing community needs and available health resources.",
    },
    {
      id: 4,
      title: "Health Promotion",
      description: "Preventive care, education and community interventions.",
    },
  ],

  "adult-health": [
    {
      id: 1,
      title: "Adult Patient Assessment",
      description: "Assessing adult patients and identifying health concerns.",
    },
    {
      id: 2,
      title: "Chronic Conditions",
      description: "Long-term disease management and patient education.",
    },
    {
      id: 3,
      title: "Acute Conditions",
      description: "Recognizing and responding to acute health problems.",
    },
    {
      id: 4,
      title: "Rehabilitation",
      description: "Supporting recovery and functional independence.",
    },
  ],

  nutrition: [
    {
      id: 1,
      title: "Nutrition Fundamentals",
      description: "Nutrients, dietary requirements and healthy eating.",
    },
    {
      id: 2,
      title: "Therapeutic Diets",
      description: "Dietary modifications for common health conditions.",
    },
    {
      id: 3,
      title: "Nutrition Assessment",
      description: "Assessing nutritional status and identifying deficiencies.",
    },
    {
      id: 4,
      title: "Patient Nutrition Education",
      description: "Teaching patients about nutrition and dietary management.",
    },
  ],
};