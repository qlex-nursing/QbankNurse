export type GuideBlock =
  | {
      type: "heading";
      title: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
      ordered?: boolean;
    }
  | {
      type: "table";
      title?: string;
      headers: string[];
      rows: string[][];
    }
  | {
      type: "callout";
      title?: string;
      text: string;
    };

export interface GuideSection {
  id: string;
  title: string;
  blocks: GuideBlock[];
}

export interface StudyLecture {
  id: number;
  title: string;
  duration: string;
  sections: GuideSection[];
}

export const studyGuideLectures: StudyLecture[] = [
  {
    id: 1,
    title: "Acid-Base Balance, Ventilators & Electrolytes",
    duration: "92 min",
    sections: [
      {
        id: "acid-base-balance",
        title: "Acid-Base Balance",
        blocks: [
          {
            type: "paragraph",
            text: "Understanding acid-base balance is an important part of interpreting laboratory results and recognizing changes in a patient's physiological condition. This demonstration section introduces common arterial blood gas (ABG) values.",
          },
          {
            type: "table",
            title: "Common ABG Reference Values",
            headers: ["Parameter", "Typical Reference Range"],
            rows: [
              ["pH", "7.35–7.45"],
              ["PaCO₂", "35–45 mmHg"],
              ["HCO₃⁻", "22–26 mEq/L"],
            ],
          },
          {
            type: "table",
            title: "Four Primary Acid-Base Disorders",
            headers: [
              "Disorder",
              "pH",
              "Primary Change",
              "Compensation",
            ],
            rows: [
              ["Metabolic Acidosis", "↓", "↓ HCO₃⁻", "↓ PaCO₂"],
              ["Metabolic Alkalosis", "↑", "↑ HCO₃⁻", "↑ PaCO₂"],
              ["Respiratory Acidosis", "↓", "↑ PaCO₂", "↑ HCO₃⁻"],
              ["Respiratory Alkalosis", "↑", "↓ PaCO₂", "↓ HCO₃⁻"],
            ],
          },
          {
            type: "heading",
            title: "A Simple ABG Interpretation Approach",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Check the pH to determine whether the patient is acidotic or alkalotic.",
              "Check PaCO₂ to evaluate the respiratory component.",
              "Check HCO₃⁻ to evaluate the metabolic component.",
              "Determine whether compensation is present.",
            ],
          },
          {
            type: "callout",
            title: "Study reminder",
            text: "A pH below 7.35 indicates acidemia, while a pH above 7.45 indicates alkalemia. Interpret all ABG values together rather than relying on a single result.",
          },
        ],
      },
      {
        id: "causes-of-imbalance",
        title: "Causes of Acid-Base Imbalance",
        blocks: [
          {
            type: "paragraph",
            text: "Acid-base disturbances may originate from respiratory or metabolic processes. Identifying the underlying process helps guide further assessment.",
          },
          {
            type: "heading",
            title: "Respiratory Causes",
          },
          {
            type: "list",
            items: [
              "Hypoventilation can increase carbon dioxide levels and contribute to respiratory acidosis.",
              "Hyperventilation can decrease carbon dioxide levels and contribute to respiratory alkalosis.",
              "Respiratory conditions and changes in ventilation can affect acid-base balance.",
            ],
          },
          {
            type: "heading",
            title: "Metabolic Causes",
          },
          {
            type: "list",
            items: [
              "Loss of gastric acid through prolonged vomiting may contribute to metabolic alkalosis.",
              "Diarrhea may contribute to metabolic acidosis through bicarbonate loss.",
              "Renal dysfunction can interfere with acid and bicarbonate regulation.",
            ],
          },
          {
            type: "callout",
            title: "Clinical thinking",
            text: "Always connect laboratory findings with the patient's history, symptoms, medications and overall clinical presentation.",
          },
        ],
      },
      {
        id: "acid-base-examples",
        title: "Practice Examples",
        blocks: [
          {
            type: "heading",
            title: "Example 1: Metabolic Acidosis",
          },
          {
            type: "paragraph",
            text: "A patient's ABG results show a pH of 7.30, PaCO₂ of 38 mmHg and HCO₃⁻ of 18 mEq/L.",
          },
          {
            type: "list",
            items: [
              "The pH is below the normal range.",
              "The bicarbonate is also below the normal range.",
              "The findings are consistent with metabolic acidosis.",
            ],
          },
          {
            type: "heading",
            title: "Example 2: Respiratory Alkalosis",
          },
          {
            type: "paragraph",
            text: "A patient's ABG results show a pH of 7.50, PaCO₂ of 30 mmHg and HCO₃⁻ of 24 mEq/L.",
          },
          {
            type: "list",
            items: [
              "The pH is above the normal range.",
              "The carbon dioxide level is below the normal range.",
              "The findings are consistent with respiratory alkalosis.",
            ],
          },
          {
            type: "callout",
            title: "Remember",
            text: "These are simplified educational examples. Real ABG interpretation requires assessment of the complete clinical picture and possible compensation.",
          },
        ],
      },
      {
        id: "ventilators",
        title: "Ventilators",
        blocks: [
          {
            type: "paragraph",
            text: "Mechanical ventilation supports breathing when a patient cannot maintain adequate ventilation independently. Nursing assessment includes monitoring respiratory status, oxygenation, equipment and patient response.",
          },
          {
            type: "heading",
            title: "Important Nursing Assessments",
          },
          {
            type: "list",
            items: [
              "Assess respiratory rate, effort and chest movement.",
              "Monitor oxygen saturation and ordered respiratory investigations.",
              "Check airway security and ventilator connections.",
              "Assess breath sounds and patient comfort.",
              "Observe for changes that require immediate clinical escalation.",
            ],
          },
          {
            type: "heading",
            title: "Ventilator Alarm Awareness",
          },
          {
            type: "table",
            headers: ["Alarm", "Possible Causes", "Nursing Considerations"],
            rows: [
              [
                "High pressure",
                "Obstruction, secretions or increased airway resistance",
                "Assess the patient and airway; follow the clinical escalation protocol.",
              ],
              [
                "Low pressure",
                "Disconnection or leak",
                "Assess the patient and circuit connections; escalate as required.",
              ],
            ],
          },
          {
            type: "callout",
            title: "Patient first",
            text: "When a ventilator alarm sounds, assess the patient before focusing on the equipment. Follow institutional protocols and seek assistance when necessary.",
          },
        ],
      },
      {
        id: "electrolytes",
        title: "Electrolytes",
        blocks: [
          {
            type: "paragraph",
            text: "Electrolytes are essential for fluid balance, nerve transmission, muscle contraction and cardiac function. Abnormal levels may affect several body systems.",
          },
          {
            type: "table",
            title: "Common Electrolytes",
            headers: ["Electrolyte", "Main Functions"],
            rows: [
              ["Sodium (Na⁺)", "Fluid balance and nerve function"],
              ["Potassium (K⁺)", "Cardiac rhythm and muscle function"],
              ["Calcium (Ca²⁺)", "Bone health, muscle contraction and nerve signalling"],
              ["Magnesium (Mg²⁺)", "Neuromuscular and cardiac function"],
            ],
          },
          {
            type: "heading",
            title: "Nursing Assessment",
          },
          {
            type: "list",
            items: [
              "Review laboratory results and trends.",
              "Assess for muscle weakness, cramps or altered sensation.",
              "Monitor cardiac rhythm when clinically indicated.",
              "Review intake, output and relevant medication history.",
              "Report significant abnormalities according to clinical protocols.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Alcoholism, Overdose/Withdrawal & Aminoglycosides",
    duration: "101 min",
    sections: [],
  },
  {
    id: 3,
    title: "CCBs, Cardiac Rhythms, Chest Tubes, Congenital Heart & Precautions",
    duration: "111 min",
    sections: [],
  },
  {
    id: 4,
    title: "Crutches, Canes, Walkers & Psychiatry",
    duration: "96 min",
    sections: [],
  },
  ...Array.from({ length: 8 }, (_, index) => ({
    id: index + 5,
    title: `Lecture ${index + 5}`,
    duration: "Coming soon",
    sections: [],
  })),
];