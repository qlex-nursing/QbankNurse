import {
  practiceQuestions,
  type PracticeQuestion,
  type PracticeAnswer,
} from "@/data/mock/dashboard/practice-questions";

export interface ExamFlashcard {
  id: string;
  subject: string;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
  rationale: string;
  questionType: string;
}

const formatAnswer = (
  question: PracticeQuestion,
  answer: PracticeAnswer,
): string => {
  const getOptionText = (value: string) => {
    return (
      question.options.find((option) => option.id === value)?.text ??
      value
    );
  };

  if (typeof answer === "string") {
    return getOptionText(answer);
  }

  if (typeof answer === "number") {
    return question.numericConfig?.unit
      ? `${answer} ${question.numericConfig.unit}`
      : String(answer);
  }

  if (Array.isArray(answer)) {
    return answer.map((item) => getOptionText(item)).join("\n");
  }

  if ("condition" in answer) {
    const bowTie = question.bowTieConfig;

    const getText = (
      items: { id: string; text: string }[] | undefined,
      value: string,
    ) => items?.find((item) => item.id === value)?.text ?? value;

    return [
      `Condition: ${getText(bowTie?.conditions, answer.condition)}`,
      "Actions:",
      ...(Array.isArray(answer.actions) ? answer.actions : [answer.actions]).map(
        (item) => `• ${getText(bowTie?.actions, item)}`,
      ),
      "Parameters to monitor:",
      ...(Array.isArray(answer.parameters)
        ? answer.parameters
        : [answer.parameters]
      ).map((item) => `• ${getText(bowTie?.parameters, item)}`),
    ].join("\n");
  }

  const matrix = question.matrixConfig;

  if (matrix) {
    return Object.entries(answer)
      .map(([rowId, columnId]) => {
        const row = matrix.rows.find((item) => item.id === rowId);
        const column = matrix.columns.find((item) => item.id === columnId);

        return `${row?.text ?? rowId}: ${column?.text ?? columnId}`;
      })
      .join("\n");
  }

  const cloze = question.clozeConfig;

  if (cloze) {
    return Object.entries(answer)
      .map(([blankId, value]) => {
        const blank = cloze.blanks.find((item) => item.id === blankId);
        const option = blank?.options.find((item) => item.id === value);

        return `${blank?.label ?? blankId}: ${option?.text ?? value}`;
      })
      .join("\n");
  }

  return Object.entries(answer)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};

const formatQuestionType = (type: PracticeQuestion["type"]) => {
  const labels: Record<PracticeQuestion["type"], string> = {
    "single-choice": "Single Choice",
    "multiple-response": "Multiple Response",
    "true-false": "True / False",
    "ordered-response": "Ordered Response",
    "numeric-entry": "Numeric Entry",
    matrix: "Matrix / Grid",
    "bow-tie": "Bow-Tie",
    cloze: "Cloze / Drop-Down",
  };

  return labels[type];
};

export const examFlashcards: ExamFlashcard[] = Object.entries(
  practiceQuestions,
).flatMap(([subjectSlug, questions]) =>
  questions.map((question) => ({
    id: `${subjectSlug}-${question.id}`,
    subject: question.subject,
    category: question.category,
    difficulty: question.difficulty,
    question: question.question,
    answer: formatAnswer(question, question.correctAnswer),
    rationale: question.rationale,
    questionType: formatQuestionType(question.type),
  })),
);

export const flashcardSubjects = [
  ...new Set(examFlashcards.map((card) => card.subject)),
];

export const getFlashcardsBySubject = (subject: string) =>
  examFlashcards.filter(
    (card) => card.subject === subject,
  );