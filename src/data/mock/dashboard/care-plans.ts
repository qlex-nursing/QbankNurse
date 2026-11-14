export interface CarePlan {
  id: string;
  title: string;
  description: string;
  assessment: string[];
  diagnosis: string;
  goals: string[];
  interventions: {
    action: string;
    rationale: string;
  }[];
  evaluation: string;
}

export interface CarePlanCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  plans: CarePlan[];
}

export const carePlanGuides = [
  {
    id: "care-plan-guide",
    title: "Nursing Care Plan Guide",
    description:
      "Learn how to write a structured care plan, from assessment to evaluation.",
    content: [
      "Start with a complete patient assessment.",
      "Identify relevant patient problems and nursing diagnoses.",
      "Set measurable, patient-centred goals.",
      "Choose appropriate nursing interventions.",
      "Document the rationale for each intervention.",
      "Evaluate the patient's response and update the plan.",
    ],
  },
  {
    id: "diagnosis-guide",
    title: "Nursing Diagnosis Guide",
    description:
      "Understand nursing diagnoses, their components and how to formulate them.",
    content: [
      "Identify the patient's actual or potential health problem.",
      "Identify related factors and contributing conditions.",
      "Look for defining characteristics and supporting evidence.",
      "Write the diagnosis clearly and accurately.",
      "Prioritize diagnoses according to patient needs and safety.",
    ],
  },
  {
    id: "nursing-process-guide",
    title: "Nursing Process Guide",
    description:
      "Understand the ADPIE framework used to organize nursing care.",
    content: [
      "Assessment: collect subjective and objective patient data.",
      "Diagnosis: identify patient problems and nursing needs.",
      "Planning: establish measurable goals and expected outcomes.",
      "Implementation: carry out appropriate nursing interventions.",
      "Evaluation: determine whether expected outcomes were achieved.",
    ],
  },
];

export const carePlanWritingSteps = [
  {
    title: "Assess the patient",
    description:
      "Collect subjective and objective information through interviews, physical assessment, laboratory results and chart review.",
  },
  {
    title: "Analyze the assessment data",
    description:
      "Group related findings, recognize patterns and identify actual or potential patient problems.",
  },
  {
    title: "Formulate nursing diagnoses",
    description:
      "Develop an appropriate nursing diagnosis using the relevant problem, related factors and supporting evidence.",
  },
  {
    title: "Set priorities",
    description:
      "Prioritize patient needs using clinical judgment, urgency, safety and the patient's individual circumstances.",
  },
  {
    title: "Establish goals and outcomes",
    description:
      "Create realistic, measurable and time-specific outcomes that focus on the patient's needs.",
  },
  {
    title: "Select nursing interventions",
    description:
      "Choose appropriate independent, dependent and collaborative nursing actions.",
  },
  {
    title: "Provide rationales",
    description:
      "Explain the clinical reasoning behind each intervention and how it supports the expected outcome.",
  },
  {
    title: "Implement the plan",
    description:
      "Carry out the selected interventions safely and document the care provided.",
  },
  {
    title: "Evaluate the outcomes",
    description:
      "Compare the patient's response with the expected outcomes and revise the care plan when necessary.",
  },
];

export const carePlanCategories: CarePlanCategory[] = [
  {
    id: "basic-nursing",
    title: "Basic Nursing & General Care Plans",
    description: "Foundational plans used across many clinical settings.",
    icon: "stethoscope",
    count: 20,
    plans: [
      {
        id: "activity-intolerance",
        title: "Activity Intolerance",
        description:
          "Insufficient energy to perform required activities.",
        assessment: [
          "Assess fatigue and reported activity limitations.",
          "Monitor heart rate, respiratory rate and oxygen saturation during activity.",
          "Assess the patient's ability to perform activities of daily living.",
        ],
        diagnosis:
          "Activity Intolerance related to an imbalance between oxygen supply and demand, as evidenced by fatigue and difficulty performing usual activities.",
        goals: [
          "The patient will tolerate progressively increased activity.",
          "The patient will demonstrate appropriate energy-conservation techniques.",
        ],
        interventions: [
          {
            action: "Assess the patient's response to activity.",
            rationale:
              "Monitoring identifies activity limitations and helps guide safe progression.",
          },
          {
            action: "Schedule rest periods between activities.",
            rationale:
              "Rest periods help reduce fatigue and conserve energy.",
          },
          {
            action: "Assist with activities as needed.",
            rationale:
              "Appropriate assistance promotes safety while maintaining independence.",
          },
        ],
        evaluation:
          "Evaluate activity tolerance, fatigue levels and ability to complete daily activities.",
      },
      {
        id: "acute-confusion",
        title: "Acute Confusion",
        description:
          "Sudden changes in attention, cognition or awareness.",
        assessment: [
          "Assess orientation, attention and level of consciousness.",
          "Establish the patient's usual cognitive status.",
          "Review potential contributing factors such as infection, medications and metabolic changes.",
        ],
        diagnosis:
          "Acute Confusion related to an underlying physiological disturbance, as evidenced by an abrupt change in cognition and attention.",
        goals: [
          "The patient will maintain the highest possible level of orientation.",
          "The patient will remain safe during periods of confusion.",
        ],
        interventions: [
          {
            action: "Monitor neurological and cognitive status.",
            rationale:
              "Changes in cognition may indicate deterioration requiring further assessment.",
          },
          {
            action: "Provide frequent orientation and reassurance.",
            rationale:
              "Consistent orientation can reduce distress and support awareness.",
          },
          {
            action: "Maintain a safe, familiar environment.",
            rationale:
              "Environmental consistency can reduce confusion and injury risk.",
          },
        ],
        evaluation:
          "Evaluate changes in cognition, orientation and patient safety.",
      },
    ],
  },
  {
    id: "cardiac",
    title: "Cardiac",
    description: "Cardiovascular disorders and circulation.",
    icon: "heart",
    count: 12,
    plans: [
      {
        id: "heart-failure",
        title: "Heart Failure",
        description:
          "Care for patients experiencing impaired cardiac pumping function.",
        assessment: [
          "Assess respiratory status and oxygen saturation.",
          "Monitor peripheral edema and daily weight.",
          "Assess lung sounds and fluid balance.",
        ],
        diagnosis:
          "Excess Fluid Volume related to compromised regulatory mechanisms, as evidenced by edema and fluid retention.",
        goals: [
          "The patient will demonstrate improved fluid balance.",
          "The patient will maintain respiratory function within the prescribed target.",
        ],
        interventions: [
          {
            action: "Monitor daily weight and intake and output.",
            rationale:
              "Changes in weight and fluid balance can indicate fluid retention.",
          },
          {
            action: "Assess lung sounds and respiratory effort.",
            rationale:
              "Fluid accumulation may impair gas exchange and respiratory function.",
          },
          {
            action: "Reinforce prescribed dietary and medication instructions.",
            rationale:
              "Patient education supports adherence to the treatment plan.",
          },
        ],
        evaluation:
          "Review weight trends, edema, respiratory findings and fluid balance.",
      },
      {
        id: "hypertension",
        title: "Hypertension",
        description:
          "Long-term management of elevated blood pressure.",
        assessment: [
          "Measure blood pressure using appropriate technique.",
          "Assess medication adherence and lifestyle factors.",
          "Review symptoms and potential signs of complications.",
        ],
        diagnosis:
          "Ineffective Health Management related to challenges in managing a long-term treatment regimen.",
        goals: [
          "The patient will demonstrate understanding of the treatment plan.",
          "The patient will identify lifestyle measures that support blood pressure management.",
        ],
        interventions: [
          {
            action: "Monitor blood pressure as prescribed.",
            rationale:
              "Regular monitoring helps evaluate control and identify changes.",
          },
          {
            action: "Educate the patient about prescribed medication.",
            rationale:
              "Understanding treatment supports adherence and safer medication use.",
          },
          {
            action: "Discuss appropriate dietary and lifestyle changes.",
            rationale:
              "Lifestyle modifications can support blood pressure management.",
          },
        ],
        evaluation:
          "Evaluate blood pressure trends and the patient's understanding of self-management.",
      },
    ],
  },
  {
    id: "endocrine",
    title: "Endocrine & Metabolic",
    description: "Hormonal, metabolic and fluid-balance conditions.",
    icon: "flask",
    count: 21,
    plans: [
      {
        id: "diabetes",
        title: "Diabetes Mellitus",
        description:
          "Care focused on glucose management and complication prevention.",
        assessment: [
          "Monitor blood glucose according to the care plan.",
          "Assess signs and symptoms of hypo- and hyperglycemia.",
          "Review medication use, nutrition and foot condition.",
        ],
        diagnosis:
          "Risk for Unstable Blood Glucose Level related to changes in glucose regulation and treatment demands.",
        goals: [
          "The patient will demonstrate understanding of glucose monitoring.",
          "The patient will identify signs requiring prompt intervention.",
        ],
        interventions: [
          {
            action: "Monitor blood glucose as prescribed.",
            rationale:
              "Monitoring helps identify abnormal glucose levels and guide treatment.",
          },
          {
            action: "Teach the patient to recognize symptoms of hypoglycemia.",
            rationale:
              "Early recognition allows timely action to prevent complications.",
          },
          {
            action: "Provide education on nutrition and medication routines.",
            rationale:
              "Consistent self-management supports glycemic control.",
          },
        ],
        evaluation:
          "Review glucose trends and the patient's ability to explain self-management.",
      },
      {
        id: "dehydration",
        title: "Fluid Volume Deficit",
        description:
          "Care for patients experiencing reduced circulating fluid volume.",
        assessment: [
          "Monitor intake and output.",
          "Assess mucous membranes and skin condition.",
          "Monitor vital signs and relevant laboratory results.",
        ],
        diagnosis:
          "Deficient Fluid Volume related to fluid loss, as evidenced by clinical findings of dehydration.",
        goals: [
          "The patient will demonstrate improved hydration status.",
          "The patient will maintain appropriate fluid balance.",
        ],
        interventions: [
          {
            action: "Monitor intake, output and clinical hydration indicators.",
            rationale:
              "These findings help evaluate fluid status.",
          },
          {
            action: "Administer prescribed fluid replacement.",
            rationale:
              "Fluid replacement helps restore circulating volume.",
          },
          {
            action: "Monitor electrolyte and renal function results.",
            rationale:
              "Fluid disturbances may be associated with electrolyte and renal changes.",
          },
        ],
        evaluation:
          "Evaluate hydration indicators, vital signs, output and relevant laboratory findings.",
      },
    ],
  },
  {
    id: "gastrointestinal",
    title: "Gastrointestinal",
    description: "Digestive system, liver and elimination care.",
    icon: "activity",
    count: 15,
    plans: [
      {
        id: "constipation",
        title: "Constipation",
        description:
          "Care focused on difficult or infrequent bowel movements.",
        assessment: [
          "Assess bowel movement frequency and stool characteristics.",
          "Review fluid intake, diet and activity.",
          "Assess abdominal discomfort and distension.",
        ],
        diagnosis:
          "Constipation related to contributing dietary, activity or medication factors.",
        goals: [
          "The patient will establish a comfortable bowel routine.",
          "The patient will identify appropriate bowel-health practices.",
        ],
        interventions: [
          {
            action: "Assess bowel patterns and contributing factors.",
            rationale:
              "Identifying causes helps guide appropriate interventions.",
          },
          {
            action: "Encourage appropriate fluids and dietary fibre when suitable.",
            rationale:
              "Fluids and fibre can support normal bowel function.",
          },
          {
            action: "Encourage mobility as tolerated.",
            rationale:
              "Physical activity may support gastrointestinal motility.",
          },
        ],
        evaluation:
          "Evaluate bowel pattern, stool characteristics and patient comfort.",
      },
      {
        id: "diarrhea",
        title: "Diarrhea",
        description:
          "Frequent loose stools with a risk of fluid and electrolyte loss.",
        assessment: [
          "Assess stool frequency, amount and characteristics.",
          "Monitor hydration and electrolyte status.",
          "Assess abdominal discomfort and associated symptoms.",
        ],
        diagnosis:
          "Diarrhea related to gastrointestinal irritation or an underlying condition.",
        goals: [
          "The patient will demonstrate improved bowel pattern.",
          "The patient will maintain adequate hydration.",
        ],
        interventions: [
          {
            action: "Monitor stool pattern and fluid balance.",
            rationale:
              "Monitoring helps identify ongoing losses and deterioration.",
          },
          {
            action: "Provide appropriate skin care.",
            rationale:
              "Frequent stools can cause skin irritation and breakdown.",
          },
          {
            action: "Encourage prescribed oral or intravenous fluids.",
            rationale:
              "Fluid replacement helps prevent dehydration.",
          },
        ],
        evaluation:
          "Evaluate stool frequency, hydration and electrolyte status.",
      },
    ],
  },
  {
    id: "hematologic",
    title: "Hematologic & Lymphatic",
    description: "Blood disorders, clotting and immune-system care.",
    icon: "droplets",
    count: 12,
    plans: [
      {
        id: "anemia",
        title: "Anemia",
        description:
          "Care focused on reduced oxygen-carrying capacity of the blood.",
        assessment: [
          "Assess fatigue, weakness and activity tolerance.",
          "Review hemoglobin and hematocrit results.",
          "Assess skin colour and signs of reduced oxygenation.",
        ],
        diagnosis:
          "Activity Intolerance related to reduced oxygen-carrying capacity.",
        goals: [
          "The patient will report improved energy levels.",
          "The patient will tolerate appropriate daily activities.",
        ],
        interventions: [
          {
            action: "Monitor relevant blood results.",
            rationale:
              "Laboratory trends help evaluate the severity and response to treatment.",
          },
          {
            action: "Plan activities with adequate rest periods.",
            rationale:
              "Rest helps reduce excessive energy demands.",
          },
          {
            action: "Reinforce prescribed nutrition and treatment.",
            rationale:
              "Appropriate treatment addresses contributing causes.",
          },
        ],
        evaluation:
          "Review fatigue, activity tolerance and relevant laboratory trends.",
      },
      {
        id: "bleeding-risk",
        title: "Risk for Bleeding",
        description:
          "Care for patients with increased risk of bleeding.",
        assessment: [
          "Assess skin, gums and other potential bleeding sites.",
          "Review platelet count and coagulation results.",
          "Review medications that may increase bleeding risk.",
        ],
        diagnosis:
          "Risk for Bleeding related to impaired hemostasis or treatment factors.",
        goals: [
          "The patient will remain free from preventable bleeding.",
          "The patient will identify signs of bleeding that require reporting.",
        ],
        interventions: [
          {
            action: "Monitor for signs of bleeding.",
            rationale:
              "Early recognition supports timely clinical intervention.",
          },
          {
            action: "Use appropriate bleeding precautions.",
            rationale:
              "Precautions reduce avoidable tissue injury.",
          },
          {
            action: "Review relevant laboratory results.",
            rationale:
              "Laboratory findings help evaluate bleeding risk.",
          },
        ],
        evaluation:
          "Evaluate for bleeding signs and review relevant laboratory findings.",
      },
    ],
  },
  {
    id: "infectious",
    title: "Infectious Diseases",
    description: "Infection prevention, isolation and treatment support.",
    icon: "bug",
    count: 7,
    plans: [
      {
        id: "infection",
        title: "Risk for Infection",
        description:
          "Prevention of infection in patients with increased susceptibility.",
        assessment: [
          "Assess temperature and other signs of infection.",
          "Review wounds, devices and invasive procedures.",
          "Assess immune status and relevant laboratory findings.",
        ],
        diagnosis:
          "Risk for Infection related to impaired protective barriers or increased exposure.",
        goals: [
          "The patient will remain free from preventable infection.",
          "The patient will demonstrate appropriate infection-prevention practices.",
        ],
        interventions: [
          {
            action: "Perform hand hygiene and follow infection-control precautions.",
            rationale:
              "Hand hygiene and precautions reduce transmission of microorganisms.",
          },
          {
            action: "Assess wounds and invasive device sites.",
            rationale:
              "Early identification of local changes supports prompt intervention.",
          },
          {
            action: "Teach the patient appropriate infection-prevention practices.",
            rationale:
              "Patient participation supports safer care.",
          },
        ],
        evaluation:
          "Review clinical findings and adherence to infection-prevention measures.",
      },
      {
        id: "pneumonia",
        title: "Pneumonia",
        description:
          "Respiratory care for patients with pulmonary infection.",
        assessment: [
          "Assess respiratory rate, effort and oxygen saturation.",
          "Monitor temperature and lung sounds.",
          "Assess cough and sputum characteristics.",
        ],
        diagnosis:
          "Ineffective Airway Clearance related to increased respiratory secretions.",
        goals: [
          "The patient will demonstrate improved airway clearance.",
          "The patient will maintain oxygenation within the prescribed target.",
        ],
        interventions: [
          {
            action: "Monitor respiratory status and oxygenation.",
            rationale:
              "Monitoring helps identify respiratory deterioration.",
          },
          {
            action: "Encourage appropriate coughing and deep breathing.",
            rationale:
              "These techniques can support secretion clearance.",
          },
          {
            action: "Administer prescribed treatment.",
            rationale:
              "Treatment addresses the underlying condition and associated symptoms.",
          },
        ],
        evaluation:
          "Evaluate respiratory effort, oxygenation and secretion clearance.",
      },
    ],
  },
  {
    id: "integumentary",
    title: "Integumentary",
    description: "Skin integrity, wounds and burn care.",
    icon: "hand",
    count: 4,
    plans: [
      {
        id: "pressure-injury",
        title: "Pressure Injury",
        description:
          "Prevention and management of pressure-related tissue damage.",
        assessment: [
          "Assess skin condition and pressure areas.",
          "Evaluate mobility and nutritional status.",
          "Assess pressure-injury risk using an appropriate tool.",
        ],
        diagnosis:
          "Impaired Skin Integrity related to prolonged pressure and reduced mobility.",
        goals: [
          "The patient will maintain or improve skin integrity.",
          "The patient will demonstrate appropriate pressure-relief practices.",
        ],
        interventions: [
          {
            action: "Inspect skin regularly.",
            rationale:
              "Regular assessment supports early identification of skin changes.",
          },
          {
            action: "Reposition the patient according to the individualized care plan.",
            rationale:
              "Repositioning helps reduce prolonged pressure.",
          },
          {
            action: "Maintain appropriate skin hygiene and moisture balance.",
            rationale:
              "Skin care helps protect tissue integrity.",
          },
        ],
        evaluation:
          "Evaluate skin condition and response to pressure-relief measures.",
      },
      {
        id: "burn-injury",
        title: "Burn Injury",
        description:
          "Supportive care throughout burn assessment and recovery.",
        assessment: [
          "Assess burn location, extent and depth.",
          "Monitor airway and respiratory status when indicated.",
          "Assess pain, fluid balance and wound condition.",
        ],
        diagnosis:
          "Impaired Skin Integrity related to thermal tissue injury.",
        goals: [
          "The patient will demonstrate progressive wound healing.",
          "The patient will report pain at an acceptable level.",
        ],
        interventions: [
          {
            action: "Monitor airway and circulation according to clinical priorities.",
            rationale:
              "Burn injuries may be associated with serious airway and fluid complications.",
          },
          {
            action: "Provide prescribed wound care.",
            rationale:
              "Appropriate wound care supports healing and infection prevention.",
          },
          {
            action: "Assess and manage pain according to the treatment plan.",
            rationale:
              "Pain management improves comfort and supports recovery.",
          },
        ],
        evaluation:
          "Evaluate wound condition, pain and overall clinical stability.",
      },
    ],
  },
  {
    id: "maternal",
    title: "Maternal & Newborn",
    description: "Pregnancy, childbirth, postpartum and newborn care.",
    icon: "baby",
    count: 14,
    plans: [
      {
        id: "postpartum-hemorrhage",
        title: "Postpartum Hemorrhage",
        description:
          "Recognition and supportive care for excessive postpartum bleeding.",
        assessment: [
          "Assess the amount and character of vaginal bleeding.",
          "Monitor vital signs and level of consciousness.",
          "Assess uterine tone and relevant clinical findings.",
        ],
        diagnosis:
          "Deficient Fluid Volume related to excessive blood loss.",
        goals: [
          "The patient will maintain hemodynamic stability.",
          "Bleeding will be identified and managed promptly.",
        ],
        interventions: [
          {
            action: "Monitor bleeding and vital signs closely.",
            rationale:
              "Frequent assessment supports early recognition of deterioration.",
          },
          {
            action: "Assess uterine tone according to protocol.",
            rationale:
              "Uterine assessment helps identify possible uterine atony.",
          },
          {
            action: "Activate emergency response and prescribed interventions when indicated.",
            rationale:
              "Postpartum hemorrhage requires prompt coordinated management.",
          },
        ],
        evaluation:
          "Evaluate bleeding, vital signs and response to emergency management.",
      },
      {
        id: "breastfeeding",
        title: "Breastfeeding Support",
        description:
          "Support for effective infant feeding and maternal confidence.",
        assessment: [
          "Assess maternal comfort and feeding goals.",
          "Observe positioning and infant latch when appropriate.",
          "Assess infant feeding cues and output.",
        ],
        diagnosis:
          "Ineffective Breastfeeding related to difficulties with positioning or latch.",
        goals: [
          "The mother will demonstrate an effective feeding position.",
          "The infant will demonstrate signs of adequate feeding.",
        ],
        interventions: [
          {
            action: "Provide practical positioning and latch support.",
            rationale:
              "Appropriate positioning can improve feeding effectiveness.",
          },
          {
            action: "Encourage responsive feeding.",
            rationale:
              "Following infant feeding cues supports effective feeding.",
          },
          {
            action: "Refer for additional lactation support when needed.",
            rationale:
              "Specialist support can address persistent feeding difficulties.",
          },
        ],
        evaluation:
          "Evaluate maternal confidence, feeding effectiveness and infant output.",
      },
    ],
  },
  {
    id: "mental-health",
    title: "Mental Health & Psychiatric",
    description: "Psychiatric, emotional and behavioral health care.",
    icon: "brain",
    count: 10,
    plans: [
      {
        id: "anxiety",
        title: "Anxiety",
        description:
          "Care focused on emotional distress and anxiety management.",
        assessment: [
          "Assess anxiety level and reported triggers.",
          "Observe behavior and physical manifestations.",
          "Assess coping strategies and available support.",
        ],
        diagnosis:
          "Anxiety related to perceived stress or uncertainty.",
        goals: [
          "The patient will identify personal anxiety triggers.",
          "The patient will demonstrate appropriate coping strategies.",
        ],
        interventions: [
          {
            action: "Use calm, therapeutic communication.",
            rationale:
              "A supportive approach can help reduce distress.",
          },
          {
            action: "Encourage the patient to express concerns.",
            rationale:
              "Expression of concerns supports assessment and therapeutic engagement.",
          },
          {
            action: "Teach appropriate relaxation strategies.",
            rationale:
              "Relaxation techniques may help manage anxiety symptoms.",
          },
        ],
        evaluation:
          "Evaluate reported anxiety, coping and participation in care.",
      },
      {
        id: "sleep-disturbance",
        title: "Disturbed Sleep Pattern",
        description:
          "Care for patients experiencing difficulty maintaining sleep.",
        assessment: [
          "Assess sleep duration and quality.",
          "Identify environmental and psychological factors.",
          "Review medication and lifestyle factors.",
        ],
        diagnosis:
          "Disturbed Sleep Pattern related to environmental or physiological factors.",
        goals: [
          "The patient will report improved sleep quality.",
          "The patient will identify healthy sleep practices.",
        ],
        interventions: [
          {
            action: "Assess sleep patterns and contributing factors.",
            rationale:
              "Understanding contributing factors helps guide care.",
          },
          {
            action: "Promote a restful sleep environment.",
            rationale:
              "Reduced noise and light may improve sleep quality.",
          },
          {
            action: "Discuss consistent sleep routines.",
            rationale:
              "Regular routines can support healthy sleep habits.",
          },
        ],
        evaluation:
          "Evaluate reported sleep quality and daytime functioning.",
      },
    ],
  },
  {
    id: "musculoskeletal",
    title: "Musculoskeletal",
    description: "Bone, joint, muscle and mobility care.",
    icon: "bone",
    count: 7,
    plans: [
      {
        id: "impaired-mobility",
        title: "Impaired Physical Mobility",
        description:
          "Support for patients experiencing limitations in movement.",
        assessment: [
          "Assess range of motion and mobility limitations.",
          "Evaluate pain during movement.",
          "Assess fall risk and need for assistive devices.",
        ],
        diagnosis:
          "Impaired Physical Mobility related to pain or musculoskeletal limitations.",
        goals: [
          "The patient will demonstrate improved mobility within individual limits.",
          "The patient will use appropriate mobility assistance safely.",
        ],
        interventions: [
          {
            action: "Assess mobility and functional ability.",
            rationale:
              "Assessment identifies limitations and guides safe assistance.",
          },
          {
            action: "Encourage appropriate movement and exercises.",
            rationale:
              "Movement helps maintain function and reduce complications of immobility.",
          },
          {
            action: "Provide appropriate assistive devices.",
            rationale:
              "Assistive devices can improve safety and independence.",
          },
        ],
        evaluation:
          "Evaluate functional mobility, safety and progress toward activity goals.",
      },
      {
        id: "osteoarthritis",
        title: "Osteoarthritis",
        description:
          "Care for patients experiencing chronic joint degeneration.",
        assessment: [
          "Assess joint pain, stiffness and swelling.",
          "Evaluate mobility and functional limitations.",
          "Review the effect of symptoms on daily activities.",
        ],
        diagnosis:
          "Chronic Pain related to degenerative joint changes.",
        goals: [
          "The patient will report improved pain management.",
          "The patient will maintain appropriate functional activity.",
        ],
        interventions: [
          {
            action: "Assess pain and functional limitations.",
            rationale:
              "Assessment helps guide individualized pain and mobility management.",
          },
          {
            action: "Encourage appropriate low-impact activity.",
            rationale:
              "Suitable activity can support joint function and mobility.",
          },
          {
            action: "Reinforce prescribed pain-management strategies.",
            rationale:
              "Consistent management can improve comfort and function.",
          },
        ],
        evaluation:
          "Evaluate pain, joint function and ability to perform daily activities.",
      },
    ],
  },
  {
    id: "neurological",
    title: "Neurological",
    description: "Brain, spinal cord and nervous-system care.",
    icon: "activity",
    count: 10,
    plans: [
      {
        id: "stroke",
        title: "Stroke",
        description:
          "Care focused on neurological changes and rehabilitation.",
        assessment: [
          "Assess neurological status and changes from baseline.",
          "Evaluate swallowing and communication ability.",
          "Assess mobility and functional independence.",
        ],
        diagnosis:
          "Impaired Physical Mobility related to neuromuscular impairment.",
        goals: [
          "The patient will maintain safety during care.",
          "The patient will demonstrate progress toward appropriate functional goals.",
        ],
        interventions: [
          {
            action: "Monitor neurological status as prescribed.",
            rationale:
              "Changes may indicate neurological deterioration.",
          },
          {
            action: "Implement appropriate aspiration precautions.",
            rationale:
              "Swallowing impairment can increase aspiration risk.",
          },
          {
            action: "Coordinate rehabilitation support.",
            rationale:
              "Multidisciplinary rehabilitation supports functional recovery.",
          },
        ],
        evaluation:
          "Evaluate neurological findings, swallowing safety and functional progress.",
      },
      {
        id: "seizure",
        title: "Seizure Disorder",
        description:
          "Care focused on seizure safety and treatment adherence.",
        assessment: [
          "Assess seizure characteristics and frequency.",
          "Review potential triggers and medication adherence.",
          "Assess recovery and neurological status after an episode.",
        ],
        diagnosis:
          "Risk for Injury related to possible seizure activity.",
        goals: [
          "The patient will remain free from preventable seizure-related injury.",
          "The patient will describe appropriate seizure-safety measures.",
        ],
        interventions: [
          {
            action: "Maintain appropriate seizure precautions.",
            rationale:
              "Precautions help reduce injury during seizure activity.",
          },
          {
            action: "Document seizure characteristics and duration.",
            rationale:
              "Accurate documentation supports clinical assessment and treatment decisions.",
          },
          {
            action: "Reinforce prescribed medication adherence.",
            rationale:
              "Consistent treatment supports seizure management.",
          },
        ],
        evaluation:
          "Evaluate seizure frequency, safety and understanding of the treatment plan.",
      },
    ],
  },
  {
    id: "ophthalmic",
    title: "Ophthalmic & Sensory",
    description: "Eye, ear and sensory-perception care.",
    icon: "eye",
    count: 4,
    plans: [
      {
        id: "cataract",
        title: "Cataract",
        description:
          "Care for patients experiencing impaired vision from lens opacity.",
        assessment: [
          "Assess visual changes and functional limitations.",
          "Review environmental safety risks.",
          "Assess understanding of treatment and postoperative instructions.",
        ],
        diagnosis:
          "Disturbed Sensory Perception related to altered visual function.",
        goals: [
          "The patient will demonstrate appropriate safety strategies.",
          "The patient will describe measures to protect vision.",
        ],
        interventions: [
          {
            action: "Assess vision and its effect on daily activities.",
            rationale:
              "Assessment identifies functional and safety needs.",
          },
          {
            action: "Improve environmental lighting and remove hazards.",
            rationale:
              "Environmental changes reduce the risk of falls and injury.",
          },
          {
            action: "Reinforce prescribed eye-care instructions.",
            rationale:
              "Following instructions supports recovery and complication prevention.",
          },
        ],
        evaluation:
          "Evaluate safety, visual function and understanding of eye-care instructions.",
      },
      {
        id: "hearing-loss",
        title: "Hearing Loss",
        description:
          "Communication and safety support for impaired hearing.",
        assessment: [
          "Assess hearing limitations and communication preferences.",
          "Evaluate the effect on daily activities.",
          "Assess the patient's use of hearing devices.",
        ],
        diagnosis:
          "Impaired Verbal Communication related to reduced auditory perception.",
        goals: [
          "The patient will communicate needs effectively.",
          "The patient will demonstrate understanding of important instructions.",
        ],
        interventions: [
          {
            action: "Face the patient when communicating.",
            rationale:
              "Visual cues support communication.",
          },
          {
            action: "Reduce background noise.",
            rationale:
              "A quieter environment can improve communication.",
          },
          {
            action: "Confirm understanding of important instructions.",
            rationale:
              "Confirmation reduces misunderstandings and supports safety.",
          },
        ],
        evaluation:
          "Evaluate communication effectiveness and patient understanding.",
      },
    ],
  },
  {
    id: "pediatric",
    title: "Pediatric",
    description: "Infant, child and adolescent nursing care.",
    icon: "baby",
    count: 10,
    plans: [
      {
        id: "childhood-asthma",
        title: "Childhood Asthma",
        description:
          "Care for children experiencing recurrent airway inflammation.",
        assessment: [
          "Assess respiratory effort and oxygen saturation.",
          "Monitor wheezing, cough and symptom triggers.",
          "Assess inhaler technique when appropriate.",
        ],
        diagnosis:
          "Ineffective Airway Clearance related to airway inflammation and increased secretions.",
        goals: [
          "The child will demonstrate improved respiratory function.",
          "The caregiver will describe the prescribed asthma-management plan.",
        ],
        interventions: [
          {
            action: "Monitor respiratory status.",
            rationale:
              "Respiratory assessment helps identify deterioration.",
          },
          {
            action: "Administer prescribed respiratory treatment.",
            rationale:
              "Prescribed treatment helps manage airway symptoms.",
          },
          {
            action: "Educate caregivers about triggers and the action plan.",
            rationale:
              "Caregiver understanding supports ongoing symptom management.",
          },
        ],
        evaluation:
          "Evaluate respiratory function and caregiver understanding.",
      },
      {
        id: "dehydration-child",
        title: "Dehydration in Children",
        description:
          "Fluid-balance support for infants and children.",
        assessment: [
          "Assess mucous membranes and general appearance.",
          "Monitor intake, output and urine frequency.",
          "Assess weight and clinical signs of dehydration.",
        ],
        diagnosis:
          "Deficient Fluid Volume related to inadequate intake or increased fluid loss.",
        goals: [
          "The child will demonstrate improved hydration.",
          "The caregiver will identify signs requiring medical attention.",
        ],
        interventions: [
          {
            action: "Monitor hydration and output.",
            rationale:
              "Monitoring supports evaluation of fluid status.",
          },
          {
            action: "Provide prescribed oral or intravenous rehydration.",
            rationale:
              "Appropriate replacement supports restoration of fluid balance.",
          },
          {
            action: "Teach caregivers about hydration and warning signs.",
            rationale:
              "Education supports early recognition and appropriate action.",
          },
        ],
        evaluation:
          "Evaluate hydration indicators, output and clinical response.",
      },
    ],
  },
  {
    id: "reproductive",
    title: "Reproductive & Genitourinary",
    description: "Male and female reproductive-system care.",
    icon: "activity",
    count: 6,
    plans: [
      {
        id: "uti",
        title: "Urinary Tract Infection",
        description:
          "Care focused on urinary symptoms and infection management.",
        assessment: [
          "Assess urinary frequency, urgency and discomfort.",
          "Monitor temperature and relevant symptoms.",
          "Review urine test results when available.",
        ],
        diagnosis:
          "Impaired Urinary Elimination related to urinary tract irritation.",
        goals: [
          "The patient will report improved urinary comfort.",
          "The patient will demonstrate understanding of the treatment plan.",
        ],
        interventions: [
          {
            action: "Monitor urinary symptoms and output.",
            rationale:
              "Monitoring helps evaluate symptoms and response to treatment.",
          },
          {
            action: "Encourage appropriate fluid intake when not contraindicated.",
            rationale:
              "Adequate hydration supports normal urinary function.",
          },
          {
            action: "Reinforce prescribed treatment and follow-up.",
            rationale:
              "Treatment adherence supports resolution of infection.",
          },
        ],
        evaluation:
          "Evaluate urinary symptoms and response to treatment.",
      },
      {
        id: "urinary-retention",
        title: "Urinary Retention",
        description:
          "Care for patients experiencing incomplete bladder emptying.",
        assessment: [
          "Assess urinary pattern and reported discomfort.",
          "Monitor bladder distension.",
          "Review relevant medications and underlying conditions.",
        ],
        diagnosis:
          "Urinary Retention related to impaired bladder emptying.",
        goals: [
          "The patient will demonstrate improved bladder emptying.",
          "The patient will report reduced urinary discomfort.",
        ],
        interventions: [
          {
            action: "Monitor voiding pattern and output.",
            rationale:
              "Assessment helps identify ongoing retention.",
          },
          {
            action: "Assess bladder distension as appropriate.",
            rationale:
              "Bladder assessment helps evaluate retained urine.",
          },
          {
            action: "Implement prescribed bladder-management measures.",
            rationale:
              "Individualized measures support effective bladder emptying.",
          },
        ],
        evaluation:
          "Evaluate voiding pattern, residual urine when measured and patient comfort.",
      },
    ],
  },
  {
    id: "respiratory",
    title: "Respiratory",
    description: "Airway, breathing and pulmonary-system care.",
    icon: "wind",
    count: 9,
    plans: [
      {
        id: "copd",
        title: "Chronic Obstructive Pulmonary Disease",
        description:
          "Support for patients with chronic airflow limitation.",
        assessment: [
          "Assess respiratory rate, effort and oxygen saturation.",
          "Assess breath sounds and cough.",
          "Review activity tolerance and prescribed oxygen therapy.",
        ],
        diagnosis:
          "Ineffective Breathing Pattern related to airflow limitation.",
        goals: [
          "The patient will demonstrate improved breathing control.",
          "The patient will identify strategies to manage breathlessness.",
        ],
        interventions: [
          {
            action: "Monitor respiratory status and oxygenation.",
            rationale:
              "Monitoring helps identify changes in respiratory function.",
          },
          {
            action: "Teach appropriate breathing techniques.",
            rationale:
              "Controlled breathing can help manage breathlessness.",
          },
          {
            action: "Encourage activity pacing.",
            rationale:
              "Pacing helps balance activity and energy demands.",
          },
        ],
        evaluation:
          "Evaluate respiratory status, activity tolerance and symptom management.",
      },
      {
        id: "asthma",
        title: "Asthma",
        description:
          "Care focused on airway inflammation and bronchoconstriction.",
        assessment: [
          "Assess wheezing, cough and breathing difficulty.",
          "Monitor oxygen saturation and respiratory effort.",
          "Identify possible environmental or medication triggers.",
        ],
        diagnosis:
          "Ineffective Breathing Pattern related to airway narrowing.",
        goals: [
          "The patient will demonstrate improved respiratory function.",
          "The patient will identify personal triggers and management strategies.",
        ],
        interventions: [
          {
            action: "Monitor respiratory status.",
            rationale:
              "Assessment supports early recognition of worsening symptoms.",
          },
          {
            action: "Administer prescribed medications.",
            rationale:
              "Prescribed treatment helps manage airway inflammation and bronchoconstriction.",
          },
          {
            action: "Reinforce inhaler technique and the action plan.",
            rationale:
              "Correct technique supports effective medication delivery.",
          },
        ],
        evaluation:
          "Evaluate breathing, symptom control and understanding of the action plan.",
      },
    ],
  },
  {
    id: "surgery",
    title: "Surgery & Perioperative",
    description: "Preoperative and postoperative nursing care.",
    icon: "scissors",
    count: 13,
    plans: [
      {
        id: "postoperative-pain",
        title: "Postoperative Pain",
        description:
          "Pain assessment and comfort after surgical procedures.",
        assessment: [
          "Assess pain location, intensity and characteristics.",
          "Evaluate the effect of pain on breathing and mobility.",
          "Review the patient's response to pain-management measures.",
        ],
        diagnosis:
          "Acute Pain related to surgical tissue injury.",
        goals: [
          "The patient will report acceptable pain control.",
          "The patient will participate in appropriate recovery activities.",
        ],
        interventions: [
          {
            action: "Assess pain regularly.",
            rationale:
              "Assessment guides appropriate pain-management interventions.",
          },
          {
            action: "Provide prescribed analgesia.",
            rationale:
              "Analgesia supports comfort and participation in recovery.",
          },
          {
            action: "Teach appropriate non-pharmacological comfort measures.",
            rationale:
              "Additional strategies can support pain management.",
          },
        ],
        evaluation:
          "Evaluate pain level, comfort and participation in recovery.",
      },
      {
        id: "postoperative-infection",
        title: "Risk for Postoperative Infection",
        description:
          "Infection prevention following a surgical procedure.",
        assessment: [
          "Assess incision condition.",
          "Monitor temperature and other signs of infection.",
          "Review wound-care instructions and risk factors.",
        ],
        diagnosis:
          "Risk for Infection related to surgical incision and tissue disruption.",
        goals: [
          "The patient will demonstrate appropriate wound-care practices.",
          "The patient will remain free from signs of preventable infection.",
        ],
        interventions: [
          {
            action: "Use appropriate aseptic technique during wound care.",
            rationale:
              "Aseptic technique helps reduce contamination.",
          },
          {
            action: "Monitor incision appearance.",
            rationale:
              "Regular observation supports early recognition of complications.",
          },
          {
            action: "Teach the patient signs of wound infection.",
            rationale:
              "Education supports timely reporting and follow-up.",
          },
        ],
        evaluation:
          "Evaluate wound condition and patient understanding of wound care.",
      },
    ],
  },
  {
    id: "urinary",
    title: "Urinary & Renal",
    description: "Kidney function, urinary output and renal care.",
    icon: "droplets",
    count: 8,
    plans: [
      {
        id: "chronic-kidney-disease",
        title: "Chronic Kidney Disease",
        description:
          "Care focused on renal function and complication prevention.",
        assessment: [
          "Monitor intake and output.",
          "Review renal function and electrolyte results.",
          "Assess edema, blood pressure and symptoms of fluid imbalance.",
        ],
        diagnosis:
          "Risk for Electrolyte Imbalance related to impaired renal regulation.",
        goals: [
          "The patient will maintain electrolyte levels within prescribed targets.",
          "The patient will demonstrate understanding of the renal care plan.",
        ],
        interventions: [
          {
            action: "Monitor renal function and electrolyte results.",
            rationale:
              "Monitoring helps identify complications of impaired kidney function.",
          },
          {
            action: "Assess fluid balance.",
            rationale:
              "Fluid assessment helps identify retention or volume deficit.",
          },
          {
            action: "Reinforce prescribed dietary and medication instructions.",
            rationale:
              "Appropriate self-management supports renal care.",
          },
        ],
        evaluation:
          "Evaluate fluid status, laboratory findings and patient understanding.",
      },
      {
        id: "acute-kidney-injury",
        title: "Acute Kidney Injury",
        description:
          "Care for sudden changes in kidney function.",
        assessment: [
          "Monitor urine output.",
          "Review renal function and electrolyte results.",
          "Assess fluid status and possible contributing factors.",
        ],
        diagnosis:
          "Risk for Fluid and Electrolyte Imbalance related to altered renal function.",
        goals: [
          "The patient will maintain appropriate fluid balance.",
          "The patient will demonstrate stable or improving clinical indicators.",
        ],
        interventions: [
          {
            action: "Monitor urine output and fluid balance.",
            rationale:
              "Changes in output may indicate changes in renal function.",
          },
          {
            action: "Review relevant laboratory findings.",
            rationale:
              "Laboratory monitoring supports evaluation of renal and electrolyte status.",
          },
          {
            action: "Implement prescribed fluid-management measures.",
            rationale:
              "Individualized management helps reduce complications.",
          },
        ],
        evaluation:
          "Evaluate renal function trends, urine output and fluid balance.",
      },
    ],
  },
];

export const totalCarePlanCount = carePlanCategories.reduce(
  (total, category) => total + category.count,
  0,
);