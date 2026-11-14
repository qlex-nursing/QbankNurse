// ============================================================
// QNURSE PRACTICE QUESTION DATA MODEL
// Supports traditional nursing questions and NGN question types.
// ============================================================

export type PracticeQuestionType =
  | "single-choice"
  | "multiple-response"
  | "true-false"
  | "ordered-response"
  | "numeric-entry"
  | "matrix"
  | "bow-tie"
  | "cloze";

export interface PracticeOption {
  id: string;
  text: string;
}

export interface MatrixRow {
  id: string;
  text: string;
}

export interface MatrixColumn {
  id: string;
  text: string;
}

export interface MatrixAnswer {
  [rowId: string]: string;
}

export interface BowTieAnswer {
  condition: string;
  actions: string[];
  parameters: string[];
}

export interface ClozeBlank {
  id: string;
  label: string;
  options: PracticeOption[];
}

export interface ClinicalCaseReference {
  id: string;
  title: string;
  stage: number;
  totalStages: number;
  patientName: string;
  patientAge: number;
  patientDetails: string;
  clinicalNotes: string;
}

export type PracticeAnswer =
  | string
  | string[]
  | number
  | MatrixAnswer
  | BowTieAnswer
  | Record<string, string>;

export interface PracticeQuestion {
  id: number;
  subject: string;
  type: PracticeQuestionType;

  category: string;
  difficulty: "Easy" | "Medium" | "Hard";

  question: string;
  rationale: string;

  // Single choice, SATA, True/False, and Ordered Response
  options: PracticeOption[];

  // Different question types use different answer structures.
  correctAnswer: PracticeAnswer;

  // Numeric Entry
  numericConfig?: {
    unit: string;
    tolerance: number;
    placeholder: string;
  };

  // Matrix/Grid
  matrixConfig?: {
    rows: MatrixRow[];
    columns: MatrixColumn[];
  };

  // Bow-Tie
  bowTieConfig?: {
    conditions: PracticeOption[];
    actions: PracticeOption[];
    parameters: PracticeOption[];
  };

  // Cloze / Drop-Down
  clozeConfig?: {
    textBefore: string;
    blanks: ClozeBlank[];
    textAfter: string;
  };

  // Six-question NGN clinical case study
  clinicalCase?: ClinicalCaseReference;
}

// ============================================================
// PHARMACOLOGY QUESTION BANK
// ============================================================

export const practiceQuestions: Record<string, PracticeQuestion[]> = {
  pharmacology: [
    // --------------------------------------------------------
    // 1. SINGLE CHOICE
    // --------------------------------------------------------

    {
      id: 1,
      subject: "Pharmacology",
      type: "single-choice",
      category: "Medication Administration",
      difficulty: "Easy",
      question:
        "A nurse is preparing to administer a prescribed medication. Which action best demonstrates adherence to safe medication administration practices?",
      options: [
        {
          id: "A",
          text: "Administering the medication based on the patient's room number.",
        },
        {
          id: "B",
          text: "Verifying the patient's identity using two approved identifiers.",
        },
        {
          id: "C",
          text: "Asking another patient to confirm the patient's name.",
        },
        {
          id: "D",
          text: "Preparing medications for several patients before checking their identities.",
        },
      ],
      correctAnswer: "B",
      rationale:
        "Using two approved patient identifiers helps ensure that medication is administered to the correct patient. Room numbers should not be used as patient identifiers.",
    },

    // --------------------------------------------------------
    // 2. SINGLE CHOICE
    // --------------------------------------------------------

    {
      id: 2,
      subject: "Pharmacology",
      type: "single-choice",
      category: "Medication Safety",
      difficulty: "Medium",
      question:
        "A patient reports developing a rash shortly after taking a newly prescribed medication. What should the nurse do first?",
      options: [
        {
          id: "A",
          text: "Document the finding and continue administering the medication.",
        },
        {
          id: "B",
          text: "Assess the patient for additional signs of an allergic reaction.",
        },
        {
          id: "C",
          text: "Tell the patient that the rash is an expected effect.",
        },
        {
          id: "D",
          text: "Recommend that the patient double the next dose.",
        },
      ],
      correctAnswer: "B",
      rationale:
        "The nurse should assess the patient for additional manifestations of an allergic reaction, including potentially serious symptoms. Further medication decisions should follow the assessment and appropriate clinical orders or protocols.",
    },

    // --------------------------------------------------------
    // 3. SINGLE CHOICE
    // --------------------------------------------------------

    {
      id: 3,
      subject: "Pharmacology",
      type: "single-choice",
      category: "Medication Administration",
      difficulty: "Medium",
      question:
        "Which nursing action is most appropriate when a medication order is unclear?",
      options: [
        {
          id: "A",
          text: "Estimate the intended dose.",
        },
        {
          id: "B",
          text: "Ask another patient what the medication is usually used for.",
        },
        {
          id: "C",
          text: "Clarify the order with the prescribing healthcare professional.",
        },
        {
          id: "D",
          text: "Administer half of the prescribed dose.",
        },
      ],
      correctAnswer: "C",
      rationale:
        "An unclear medication order must be clarified with the prescribing healthcare professional before administration. Nurses should never guess or independently modify an unclear prescription.",
    },

    // --------------------------------------------------------
    // 4. SINGLE CHOICE
    // --------------------------------------------------------

    {
      id: 4,
      subject: "Pharmacology",
      type: "single-choice",
      category: "Pharmacological Principles",
      difficulty: "Easy",
      question:
        "Which statement best describes the term adverse drug reaction?",
      options: [
        {
          id: "A",
          text: "An unintended harmful response associated with the use of a medication.",
        },
        {
          id: "B",
          text: "The intended therapeutic effect of a medication.",
        },
        {
          id: "C",
          text: "The process by which a medication enters the bloodstream.",
        },
        {
          id: "D",
          text: "The time required for a medication to reach its peak concentration.",
        },
      ],
      correctAnswer: "A",
      rationale:
        "An adverse drug reaction is an unintended and harmful response associated with medication use. It differs from the intended therapeutic effect.",
    },

    // --------------------------------------------------------
    // 5. SINGLE CHOICE
    // --------------------------------------------------------

    {
      id: 5,
      subject: "Pharmacology",
      type: "single-choice",
      category: "Medication Safety",
      difficulty: "Hard",
      question:
        "A nurse discovers that a medication was administered to the wrong patient. Which action should the nurse take?",
      options: [
        {
          id: "A",
          text: "Wait until the end of the shift to report the incident.",
        },
        {
          id: "B",
          text: "Immediately assess the patient and follow the facility's medication incident reporting procedures.",
        },
        {
          id: "C",
          text: "Document that the medication was administered correctly.",
        },
        {
          id: "D",
          text: "Avoid informing the healthcare team unless symptoms develop.",
        },
      ],
      correctAnswer: "B",
      rationale:
        "Patient safety is the priority. The nurse should promptly assess the affected patient, notify the appropriate healthcare professionals and follow institutional reporting procedures.",
    },

    // --------------------------------------------------------
    // 6. MULTIPLE RESPONSE (SATA)
    // --------------------------------------------------------

    {
      id: 6,
      subject: "Pharmacology",
      type: "multiple-response",
      category: "Medication Safety",
      difficulty: "Medium",
      question:
        "A nurse is teaching a patient about safe medication administration at home. Which instructions should the nurse include? Select all that apply.",
      options: [
        {
          id: "A",
          text: "Keep medications in their original labelled containers.",
        },
        {
          id: "B",
          text: "Share prescribed medications with family members who have similar symptoms.",
        },
        {
          id: "C",
          text: "Check the medication label before each administration.",
        },
        {
          id: "D",
          text: "Store medications according to the manufacturer's instructions.",
        },
        {
          id: "E",
          text: "Stop taking prescribed medication whenever symptoms improve without consulting the prescriber.",
        },
      ],
      correctAnswer: ["A", "C", "D"],
      rationale:
        "Medications should remain in their labelled containers, labels should be checked before administration, and storage instructions should be followed. Patients should never share prescribed medications or independently discontinue treatment without appropriate medical guidance.",
    },

    // --------------------------------------------------------
    // 7. TRUE / FALSE
    // --------------------------------------------------------

    {
      id: 7,
      subject: "Pharmacology",
      type: "true-false",
      category: "Medication Safety",
      difficulty: "Easy",
      question:
        "A nurse should verify a patient's identity before administering medication. True or False?",
      options: [
        {
          id: "A",
          text: "True",
        },
        {
          id: "B",
          text: "False",
        },
      ],
      correctAnswer: "A",
      rationale:
        "Patient identification is an essential medication safety practice. Nurses should verify the patient's identity using approved identifiers before administering medication.",
    },

    // --------------------------------------------------------
    // 8. ORDERED RESPONSE
    // --------------------------------------------------------

    {
      id: 8,
      subject: "Pharmacology",
      type: "ordered-response",
      category: "Medication Administration",
      difficulty: "Medium",
      question:
        "Arrange the following steps for administering oral medication in the correct sequence.",
      options: [
        {
          id: "A",
          text: "Verify the patient's identity.",
        },
        {
          id: "B",
          text: "Perform hand hygiene.",
        },
        {
          id: "C",
          text: "Check the medication against the prescription.",
        },
        {
          id: "D",
          text: "Document medication administration.",
        },
      ],
      correctAnswer: ["B", "C", "A", "D"],
      rationale:
        "A safe medication administration process includes hand hygiene, checking the medication against the prescription, verifying the patient using approved identifiers, and documenting administration. Follow your facility's medication administration policy.",
    },

    // --------------------------------------------------------
    // 9. NUMERIC ENTRY / DOSAGE CALCULATION
    // --------------------------------------------------------

    {
      id: 9,
      subject: "Pharmacology",
      type: "numeric-entry",
      category: "Dosage Calculations",
      difficulty: "Medium",
      question:
        "A healthcare provider prescribes 500 mg of a medication. The available tablets contain 250 mg each. How many tablets should the nurse administer?",
      options: [],
      correctAnswer: 2,
      numericConfig: {
        unit: "tablets",
        tolerance: 0,
        placeholder: "Enter number of tablets",
      },
      rationale:
        "Using the dosage calculation formula: prescribed dose ÷ available dose = 500 mg ÷ 250 mg = 2 tablets.",
    },

    // --------------------------------------------------------
    // 10. MATRIX / GRID
    // --------------------------------------------------------

    {
      id: 10,
      subject: "Pharmacology",
      type: "matrix",
      category: "Pharmacological Principles",
      difficulty: "Medium",
      question:
        "For each medication-related finding, identify whether it represents a therapeutic effect or an adverse effect.",
      options: [],
      matrixConfig: {
        rows: [
          {
            id: "R1",
            text: "Reduction in blood pressure after an antihypertensive medication.",
          },
          {
            id: "R2",
            text: "Development of a medication-associated skin rash.",
          },
          {
            id: "R3",
            text: "Reduction in pain after prescribed analgesia.",
          },
        ],
        columns: [
          {
            id: "C1",
            text: "Therapeutic effect",
          },
          {
            id: "C2",
            text: "Adverse effect",
          },
        ],
      },
      correctAnswer: {
        R1: "C1",
        R2: "C2",
        R3: "C1",
      },
      rationale:
        "A therapeutic effect is the intended beneficial response to a medication. An adverse effect is an unintended or harmful response associated with its use.",
    },

    // --------------------------------------------------------
    // 11. BOW-TIE
    // --------------------------------------------------------

    {
      id: 11,
      subject: "Pharmacology",
      type: "bow-tie",
      category: "Medication Safety",
      difficulty: "Hard",
      question:
        "A patient develops facial swelling, difficulty breathing and widespread itching shortly after receiving a medication. Complete the Bow-Tie question by selecting the most likely condition, two appropriate nursing actions and two parameters to monitor.",
      options: [],
      bowTieConfig: {
        conditions: [
          {
            id: "C1",
            text: "Anaphylaxis",
          },
          {
            id: "C2",
            text: "Mild medication intolerance",
          },
          {
            id: "C3",
            text: "Expected therapeutic response",
          },
        ],
        actions: [
          {
            id: "A1",
            text: "Activate the emergency response system and obtain immediate assistance.",
          },
          {
            id: "A2",
            text: "Maintain airway support and prepare to administer prescribed emergency treatment.",
          },
          {
            id: "A3",
            text: "Continue administering the medication.",
          },
          {
            id: "A4",
            text: "Ask the patient to walk around to relieve the symptoms.",
          },
        ],
        parameters: [
          {
            id: "P1",
            text: "Respiratory status and oxygen saturation.",
          },
          {
            id: "P2",
            text: "Blood pressure and heart rate.",
          },
          {
            id: "P3",
            text: "Hair and nail growth.",
          },
          {
            id: "P4",
            text: "Daily calorie intake.",
          },
        ],
      },
      correctAnswer: {
        condition: "C1",
        actions: ["A1", "A2"],
        parameters: ["P1", "P2"],
      },
      rationale:
        "Facial swelling, respiratory difficulty and widespread itching following medication administration are concerning for anaphylaxis. Immediate emergency assistance, airway support and prescribed emergency treatment are priorities. Respiratory status, oxygen saturation, blood pressure and heart rate require close monitoring.",
    },

    // --------------------------------------------------------
    // 12. CLOZE / DROP-DOWN
    // --------------------------------------------------------

    {
      id: 12,
      subject: "Pharmacology",
      type: "cloze",
      category: "Pharmacological Principles",
      difficulty: "Medium",
      question:
        "Complete the following statement about medication safety.",
      options: [],
      clozeConfig: {
        textBefore:
          "Before administering medication, the nurse should verify the patient's ",
        blanks: [
          {
            id: "B1",
            label: "First blank",
            options: [
              {
                id: "A",
                text: "identity",
              },
              {
                id: "B",
                text: "room temperature",
              },
              {
                id: "C",
                text: "meal preference",
              },
            ],
          },
          {
            id: "B2",
            label: "Second blank",
            options: [
              {
                id: "A",
                text: "two approved identifiers",
              },
              {
                id: "B",
                text: "room number only",
              },
              {
                id: "C",
                text: "visitor's name",
              },
            ],
          },
        ],
        textAfter:
          " using the facility's approved identification procedure.",
      },
      correctAnswer: {
        B1: "A",
        B2: "A",
      },
      rationale:
        "Patient identity must be verified using two approved identifiers according to the facility's identification policy. A room number alone is not an acceptable patient identifier.",
    },

    // ========================================================
    // NGN CLINICAL CASE STUDY
    // Six connected questions based on one patient scenario.
    // ========================================================

    // Shared clinical case information is attached to all six
    // questions so the frontend can group them into one case.

    // --------------------------------------------------------
    // CASE STUDY - QUESTION 1
    // --------------------------------------------------------

    {
      id: 13,
      subject: "Pharmacology",
      type: "single-choice",
      category: "NGN Clinical Case Study",
      difficulty: "Medium",
      clinicalCase: {
        id: "CASE-001",
        title: "Postoperative Patient With Suspected Infection",
        stage: 1,
        totalStages: 6,
        patientName: "James Carter",
        patientAge: 68,
        patientDetails:
          "A 68-year-old patient admitted following abdominal surgery.",
        clinicalNotes:
          "The patient reports increasing abdominal discomfort and chills. Temperature is 38.6°C, heart rate is 112 beats/min, respiratory rate is 24 breaths/min and blood pressure is 104/66 mmHg.",
      },
      question:
        "Which assessment finding requires the nurse's most immediate attention?",
      options: [
        {
          id: "A",
          text: "Temperature of 38.6°C.",
        },
        {
          id: "B",
          text: "Heart rate of 112 beats/min.",
        },
        {
          id: "C",
          text: "Increasing abdominal discomfort.",
        },
        {
          id: "D",
          text: "History of abdominal surgery.",
        },
      ],
      correctAnswer: "B",
      rationale:
        "The elevated heart rate, together with fever and other abnormal findings, may indicate clinical deterioration. The nurse should promptly assess the patient and consider the complete clinical picture.",
    },

    // --------------------------------------------------------
    // CASE STUDY - QUESTION 2
    // --------------------------------------------------------

    {
      id: 14,
      subject: "Pharmacology",
      type: "multiple-response",
      category: "NGN Clinical Case Study",
      difficulty: "Hard",
      clinicalCase: {
        id: "CASE-001",
        title: "Postoperative Patient With Suspected Infection",
        stage: 2,
        totalStages: 6,
        patientName: "James Carter",
        patientAge: 68,
        patientDetails:
          "A 68-year-old patient admitted following abdominal surgery.",
        clinicalNotes:
          "The patient continues to experience chills and abdominal discomfort. The nurse is reviewing the patient's clinical condition.",
      },
      question:
        "Which additional assessment findings should the nurse investigate when evaluating possible clinical deterioration? Select all that apply.",
      options: [
        {
          id: "A",
          text: "Changes in mental status.",
        },
        {
          id: "B",
          text: "Urine output.",
        },
        {
          id: "C",
          text: "Blood pressure trends.",
        },
        {
          id: "D",
          text: "Hair colour.",
        },
        {
          id: "E",
          text: "Respiratory status.",
        },
      ],
      correctAnswer: ["A", "B", "C", "E"],
      rationale:
        "Mental status, urine output, blood pressure and respiratory status help evaluate perfusion and possible clinical deterioration. These findings should be interpreted alongside the patient's complete assessment.",
    },

    // --------------------------------------------------------
    // CASE STUDY - QUESTION 3
    // --------------------------------------------------------

    {
      id: 15,
      subject: "Pharmacology",
      type: "matrix",
      category: "NGN Clinical Case Study",
      difficulty: "Hard",
      clinicalCase: {
        id: "CASE-001",
        title: "Postoperative Patient With Suspected Infection",
        stage: 3,
        totalStages: 6,
        patientName: "James Carter",
        patientAge: 68,
        patientDetails:
          "A 68-year-old patient admitted following abdominal surgery.",
        clinicalNotes:
          "The nurse is reviewing the patient's assessment findings to identify signs requiring further investigation.",
      },
      question:
        "For each finding, identify whether it is within the expected range or requires further investigation in this patient's current condition.",
      options: [],
      matrixConfig: {
        rows: [
          {
            id: "R1",
            text: "Temperature of 38.6°C.",
          },
          {
            id: "R2",
            text: "Heart rate of 112 beats/min.",
          },
          {
            id: "R3",
            text: "Respiratory rate of 24 breaths/min.",
          },
          {
            id: "R4",
            text: "New confusion.",
          },
        ],
        columns: [
          {
            id: "C1",
            text: "Requires further investigation",
          },
          {
            id: "C2",
            text: "Within expected range",
          },
        ],
      },
      correctAnswer: {
        R1: "C1",
        R2: "C1",
        R3: "C1",
        R4: "C1",
      },
      rationale:
        "Fever, tachycardia, increased respiratory rate and new confusion are concerning findings that require further assessment and timely escalation based on the patient's condition.",
    },

    // --------------------------------------------------------
    // CASE STUDY - QUESTION 4
    // --------------------------------------------------------

    {
      id: 16,
      subject: "Pharmacology",
      type: "bow-tie",
      category: "NGN Clinical Case Study",
      difficulty: "Hard",
      clinicalCase: {
        id: "CASE-001",
        title: "Postoperative Patient With Suspected Infection",
        stage: 4,
        totalStages: 6,
        patientName: "James Carter",
        patientAge: 68,
        patientDetails:
          "A 68-year-old patient admitted following abdominal surgery.",
        clinicalNotes:
          "The patient has persistent fever, tachycardia and increasing abdominal discomfort.",
      },
      question:
        "Complete the Bow-Tie by identifying the most likely clinical concern, two appropriate nursing actions and two parameters to monitor.",
      options: [],
      bowTieConfig: {
        conditions: [
          {
            id: "C1",
            text: "Possible postoperative infection with clinical deterioration.",
          },
          {
            id: "C2",
            text: "Normal postoperative recovery.",
          },
          {
            id: "C3",
            text: "Mild dehydration without other concerns.",
          },
        ],
        actions: [
          {
            id: "A1",
            text: "Notify the appropriate healthcare professional promptly.",
          },
          {
            id: "A2",
            text: "Perform a focused reassessment and follow escalation protocols.",
          },
          {
            id: "A3",
            text: "Ignore the abnormal vital signs.",
          },
          {
            id: "A4",
            text: "Delay assessment until the next scheduled observation.",
          },
        ],
        parameters: [
          {
            id: "P1",
            text: "Blood pressure and heart rate.",
          },
          {
            id: "P2",
            text: "Respiratory status and oxygen saturation.",
          },
          {
            id: "P3",
            text: "Hair growth.",
          },
          {
            id: "P4",
            text: "Visual acuity.",
          },
        ],
      },
      correctAnswer: {
        condition: "C1",
        actions: ["A1", "A2"],
        parameters: ["P1", "P2"],
      },
      rationale:
        "The combination of fever, tachycardia and increasing abdominal discomfort after surgery raises concern for postoperative infection and possible deterioration. Prompt reassessment and escalation are necessary.",
    },

    // --------------------------------------------------------
    // CASE STUDY - QUESTION 5
    // --------------------------------------------------------

    {
      id: 17,
      subject: "Pharmacology",
      type: "cloze",
      category: "NGN Clinical Case Study",
      difficulty: "Medium",
      clinicalCase: {
        id: "CASE-001",
        title: "Postoperative Patient With Suspected Infection",
        stage: 5,
        totalStages: 6,
        patientName: "James Carter",
        patientAge: 68,
        patientDetails:
          "A 68-year-old patient admitted following abdominal surgery.",
        clinicalNotes:
          "The nurse is preparing to communicate the patient's deteriorating condition to the healthcare team.",
      },
      question:
        "Complete the clinical communication statement.",
      options: [],
      clozeConfig: {
        textBefore:
          "When escalating the patient's condition, the nurse should communicate the patient's ",
        blanks: [
          {
            id: "B1",
            label: "First blank",
            options: [
              {
                id: "A",
                text: "current abnormal assessment findings",
              },
              {
                id: "B",
                text: "favourite food",
              },
              {
                id: "C",
                text: "room decoration preferences",
              },
            ],
          },
          {
            id: "B2",
            label: "Second blank",
            options: [
              {
                id: "A",
                text: "recent clinical changes",
              },
              {
                id: "B",
                text: "unrelated historical details only",
              },
              {
                id: "C",
                text: "visitors' opinions",
              },
            ],
          },
        ],
        textAfter:
          " clearly so that the healthcare team can determine the next steps.",
      },
      correctAnswer: {
        B1: "A",
        B2: "A",
      },
      rationale:
        "Clear clinical communication should include relevant current assessment findings and recent changes in the patient's condition to support timely decision-making.",
    },

    // --------------------------------------------------------
    // CASE STUDY - QUESTION 6
    // --------------------------------------------------------

    {
      id: 18,
      subject: "Pharmacology",
      type: "ordered-response",
      category: "NGN Clinical Case Study",
      difficulty: "Hard",
      clinicalCase: {
        id: "CASE-001",
        title: "Postoperative Patient With Suspected Infection",
        stage: 6,
        totalStages: 6,
        patientName: "James Carter",
        patientAge: 68,
        patientDetails:
          "A 68-year-old patient admitted following abdominal surgery.",
        clinicalNotes:
          "The nurse has identified concerning findings and is preparing to escalate the patient's condition.",
      },
      question:
        "Arrange the following nursing actions in a reasonable priority sequence when responding to the patient's deterioration.",
      options: [
        {
          id: "A",
          text: "Notify the appropriate healthcare professional and activate escalation procedures as indicated.",
        },
        {
          id: "B",
          text: "Perform an immediate focused assessment of the patient's condition.",
        },
        {
          id: "C",
          text: "Continue monitoring and reassessing the patient's response to interventions.",
        },
        {
          id: "D",
          text: "Implement appropriate prescribed interventions and emergency protocols.",
        },
      ],
      correctAnswer: ["B", "A", "D", "C"],
      rationale:
        "The nurse should first assess the patient, promptly escalate concerning findings, implement appropriate prescribed interventions and continue monitoring the patient's response. Actual priorities may change depending on immediate airway, breathing and circulation threats.",
    },
  ],
};