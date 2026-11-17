import {
  Calculator,
  Droplets,
  Clock3,
  Weight,
  Thermometer,
  Activity,
  type LucideIcon,
} from "lucide-react";

export type CalculatorId =
  | "dosage"
  | "iv-flow"
  | "iv-infusion"
  | "weight"
  | "temperature"
  | "fluid-balance";

export interface NursingCalculator {
  id: CalculatorId;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  accent: string;
  formula: string;
}

export const nursingCalculators: NursingCalculator[] = [
  {
    id: "dosage",
    title: "Dosage Calculator",
    description:
      "Calculate the amount of medication to administer from an ordered dose and available strength.",
    category: "Medication Safety",
    icon: Calculator,
    accent: "violet",
    formula: "Amount to administer = (Desired dose ÷ Available dose) × Quantity",
  },
  {
    id: "iv-flow",
    title: "IV Flow Rate",
    description:
      "Calculate the required gravity IV flow rate in drops per minute.",
    category: "IV Therapy",
    icon: Droplets,
    accent: "blue",
    formula: "Drops/min = (Volume × Drop factor) ÷ Time in minutes",
  },
  {
    id: "iv-infusion",
    title: "IV Infusion", 
    description:
      "Calculate an infusion rate in mL/hr or estimate how long an infusion will take.",
    category: "IV Therapy",
    icon: Clock3,
    accent: "cyan",
    formula: "mL/hr = Total volume ÷ Time in hours",
  },
  {
    id: "weight",
    title: "Weight Converter",
    description:
      "Convert between kilograms, grams, pounds and milligrams.",
    category: "Unit Conversion",
    icon: Weight,
    accent: "green",
    formula: "1 kg = 2.20462 lb = 1,000 g",
  },
  {
    id: "temperature",
    title: "Temperature Converter",
    description:
      "Convert body temperature measurements between Celsius and Fahrenheit.",
    category: "Unit Conversion",
    icon: Thermometer,
    accent: "orange",
    formula: "°F = (°C × 9/5) + 32",
  },
  {
    id: "fluid-balance",
    title: "Fluid Balance",
    description:
      "Calculate total fluid intake, output and net fluid balance.",
    category: "Patient Monitoring",
    icon: Activity,
    accent: "pink",
    formula: "Net fluid balance = Total intake − Total output",
  },
];

export const calculatorCategories = [
  "All Calculators",
  "Medication Safety",
  "IV Therapy",
  "Unit Conversion",
  "Patient Monitoring",
];