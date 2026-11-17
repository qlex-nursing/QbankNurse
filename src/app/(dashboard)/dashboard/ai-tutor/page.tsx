"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Clock,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  User,
  X,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";

type MessageRole = "user" | "assistant";

interface TutorMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

interface TutorConversation {
  id: string;
  title: string;
  subject: string;
  messages: TutorMessage[];
  updatedAt: string;
}

const STORAGE_KEY = "qbanknurse-ai-tutor-conversations";

const suggestions = [
  {
    title: "Understand pharmacology",
    prompt: "Explain the difference between pharmacokinetics and pharmacodynamics.",
    icon: Stethoscope,
  },
  {
    title: "Patient safety",
    prompt: "What are the five rights of medication administration?",
    icon: ShieldCheck,
  },
  {
    title: "Clinical judgment",
    prompt: "Explain the nursing process and how to prioritize patient care.",
    icon: GraduationCap,
  },
  {
    title: "Exam preparation",
    prompt: "Give me a simple strategy for answering NCLEX-style questions.",
    icon: Lightbulb,
  },
];

const topicResponses: {
  keywords: string[];
  response: string;
}[] = [
  {
    keywords: ["pharmacokinetic", "pharmacodynamic"],
    response: `## Pharmacokinetics vs Pharmacodynamics

These are two important concepts in pharmacology.

**1. Pharmacokinetics — What the body does to the drug**

It describes how a medication moves through the body. Remember ADME:

- **Absorption:** How the drug enters the bloodstream.
- **Distribution:** How the drug travels throughout the body.
- **Metabolism:** How the body chemically changes the drug, commonly in the liver.
- **Excretion:** How the drug leaves the body, commonly through the kidneys.

**2. Pharmacodynamics — What the drug does to the body**

This describes how a medication produces its effects, including its interaction with receptors and its therapeutic effects.

**Easy way to remember:**

Pharmacokinetics = the body's handling of the drug.

Pharmacodynamics = the drug's effects on the body.

**Exam tip:** When a question asks about absorption, metabolism or elimination, think pharmacokinetics.`,
  },
  {
    keywords: ["five rights", "5 rights", "medication administration"],
    response: `## The Five Rights of Medication Administration

The traditional five rights are:

1. **Right patient** — Verify the patient's identity using approved identifiers.
2. **Right medication** — Confirm the medication against the prescription.
3. **Right dose** — Check the prescribed dose and calculate accurately.
4. **Right route** — Confirm the correct route of administration.
5. **Right time** — Administer at the prescribed time.

**Important:** Medication safety involves additional checks beyond these five rights, including documentation, assessment, patient education and evaluation.

**Exam tip:** If an order is unclear or appears unsafe, stop and clarify it before administering the medication.`,
  },
  {
    keywords: ["nursing process", "prioritize patient", "priority"],
    response: `## The Nursing Process

The nursing process provides a systematic approach to patient care.

Remember **ADPIE**:

1. **Assessment:** Collect subjective and objective patient information.
2. **Diagnosis:** Identify nursing problems based on assessment findings.
3. **Planning:** Establish measurable patient outcomes and interventions.
4. **Implementation:** Carry out the planned nursing interventions.
5. **Evaluation:** Determine whether the expected outcomes were achieved.

**Clinical judgment tip:**

When prioritizing care, assess the patient's condition and identify immediate threats. Airway, breathing and circulation are important considerations, but always interpret them in the context of the clinical scenario.

**Exam tip:** If a question asks what the nurse should do first, look carefully at the assessment findings before choosing an intervention.`,
  },
  {
    keywords: ["nclex", "exam strategy", "answering questions"],
    response: `## A Strategy for NCLEX-Style Questions

Try this approach:

**1. Read the final sentence first.**
Understand exactly what the question is asking.

**2. Identify the clinical problem.**
Look for important symptoms, vital signs and changes in patient condition.

**3. Determine the priority.**
Consider immediate safety risks and the patient's most urgent needs.

**4. Evaluate every option.**
Don't choose an answer simply because it sounds familiar. Ask whether it directly addresses the problem.

**5. Review your reasoning.**
After answering, understand why the correct answer is appropriate and why the alternatives are less appropriate.

**Remember:** The goal is not simply to memorize facts. It is to apply nursing knowledge to clinical situations.`,
  },
  {
    keywords: ["insulin", "blood glucose", "diabetes"],
    response: `## Understanding Insulin

Insulin is a hormone produced by pancreatic beta cells. Its main role is to help regulate blood glucose.

**Major insulin categories include:**

- Rapid-acting: Used around mealtimes.
- Short-acting: Regular insulin is a common example.
- Intermediate-acting: NPH insulin is a common example.
- Long-acting: Provides prolonged basal insulin coverage.

**Nursing considerations:**

- Check the blood glucose as indicated.
- Verify the prescribed insulin and dose.
- Understand the medication's onset, peak and duration.
- Monitor for hypoglycemia.
- Follow the prescribed administration and monitoring protocol.

**Exam tip:** Hypoglycemia can become an urgent safety issue. Recognize symptoms such as sweating, shakiness, confusion and weakness.

Always follow the patient's prescription and facility protocol.`,
  },
  {
    keywords: ["heart failure", "cardiac failure"],
    response: `## Understanding Heart Failure

Heart failure occurs when the heart cannot pump blood effectively enough to meet the body's needs.

**Common clinical findings include:**

- Shortness of breath.
- Fatigue and reduced exercise tolerance.
- Peripheral edema.
- Possible crackles on lung auscultation.
- Rapid weight gain from fluid retention.

**Important nursing assessments:**

- Respiratory status and oxygenation.
- Lung sounds.
- Daily weight trends.
- Intake and output.
- Peripheral edema.
- Response to prescribed treatment.

**Clinical judgment tip:** New or worsening respiratory distress requires prompt assessment and escalation according to the patient's condition and facility protocol.`,
  },
  {
    keywords: ["infection control", "hand hygiene", "precaution"],
    response: `## Infection Prevention and Control

Infection prevention reduces the transmission of microorganisms.

**Important principles:**

- Perform hand hygiene at appropriate moments.
- Use standard precautions with every patient.
- Select appropriate personal protective equipment.
- Apply transmission-based precautions when indicated.
- Handle sharps and contaminated materials safely.

**Transmission-based precautions include:**

- Contact precautions.
- Droplet precautions.
- Airborne precautions.

**Exam tip:** Read the clinical scenario carefully to identify the suspected route of transmission before selecting the appropriate precaution.`,
  },
  {
    keywords: ["maternal", "pregnancy", "postpartum", "newborn"],
    response: `## Maternal and Newborn Nursing

Maternal-newborn nursing focuses on care during pregnancy, childbirth and the postpartum period, as well as newborn health.

**Important assessment areas include:**

- Maternal vital signs.
- Uterine tone and location after delivery.
- Vaginal bleeding and lochia.
- Pain and recovery.
- Newborn temperature, breathing and feeding.
- Signs that require immediate clinical attention.

**Clinical judgment tip:** Postpartum heavy bleeding, maternal instability or newborn respiratory difficulty should never be dismissed. Assess promptly and follow emergency escalation procedures when indicated.`,
  },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createConversation(): TutorConversation {
  return {
    id: createId(),
    title: "New conversation",
    subject: "General Nursing",
    messages: [],
    updatedAt: new Date().toISOString(),
  };
}

function generateTutorResponse(
  question: string,
  subject: string,
): string {
  const normalized = question.toLowerCase();

  const match = topicResponses.find((item) =>
    item.keywords.some((keyword) =>
      normalized.includes(keyword),
    ),
  );

  if (match) {
    return match.response;
  }

  return `## Let's explore ${subject}

That's a good nursing question.

To approach this topic, start by identifying:

**1. The underlying concept**

What is happening physiologically or clinically?

**2. The nursing implications**

What should the nurse assess, monitor or consider?

**3. Patient safety**

Are there potential complications, warning signs or interventions that require priority attention?

**4. Clinical application**

How would this knowledge help you make a safe nursing decision in a patient scenario?

Try narrowing your question to a specific concept, medication, condition or nursing intervention, and we can explore it further.

*This is a demonstration response. The connected AI tutor service will provide generated, question-specific explanations once the API is integrated.*`;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AiTutorPage() {
  const [conversations, setConversations] = useState<
    TutorConversation[]
  >([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState("General Nursing");

  const [showSubjects, setShowSubjects] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation =
    conversations.find((item) => item.id === activeId) ?? null;

  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setConversations(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (conversations.length === 0) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversations),
    );
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  const startNewConversation = () => {
    const conversation = createConversation();

    setConversations((previous) => [
      conversation,
      ...previous,
    ]);

    setActiveId(conversation.id);
    setSelectedSubject("General Nursing");
    setInput("");
    setShowHistory(false);
  };

  const selectConversation = (conversation: TutorConversation) => {
    setActiveId(conversation.id);
    setSelectedSubject(conversation.subject);
    setShowHistory(false);
    setInput("");
  };

  const deleteConversation = (id: string) => {
    const remaining = conversations.filter(
      (item) => item.id !== id,
    );

    setConversations(remaining);

    if (activeId === id) {
      setActiveId(remaining[0]?.id ?? null);
      setSelectedSubject(
        remaining[0]?.subject ?? "General Nursing",
      );
    }
  };

  const updateSubject = (subject: string) => {
    setSelectedSubject(subject);
    setShowSubjects(false);

    if (activeConversation) {
      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === activeId
            ? { ...conversation, subject }
            : conversation,
        ),
      );
    }
  };

  const sendMessage = (message?: string) => {
    const text = (message ?? input).trim();

    if (!text || isTyping) return;

    let conversation = activeConversation;

    if (!conversation) {
      conversation = createConversation();
      setActiveId(conversation.id);
    }

    const userMessage: TutorMessage = {
      id: createId(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const conversationId = conversation.id;

    setConversations((previous) => {
      const existing = previous.find(
        (item) => item.id === conversationId,
      );

      if (existing) {
        return previous.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                title:
                  item.messages.length === 0
                    ? text.slice(0, 45) +
                      (text.length > 45 ? "..." : "")
                    : item.title,
                subject: selectedSubject,
                messages: [...item.messages, userMessage],
                updatedAt: new Date().toISOString(),
              }
            : item,
        );
      }

      return [
        {
          ...conversation!,
          title:
            text.slice(0, 45) +
            (text.length > 45 ? "..." : ""),
          subject: selectedSubject,
          messages: [userMessage],
          updatedAt: new Date().toISOString(),
        },
        ...previous,
      ];
    });

    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMessage: TutorMessage = {
        id: createId(),
        role: "assistant",
        content: generateTutorResponse(text, selectedSubject),
        createdAt: new Date().toISOString(),
      };

      setConversations((previous) =>
        previous.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                messages: [
                  ...item.messages,
                  assistantMessage,
                ],
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      setIsTyping(false);
    }, 900);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="dashboard-content mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">

      {/* PAGE HEADER */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#5B3DF5]">
            <Sparkles size={15} />
            YOUR PERSONAL STUDY ASSISTANT
          </div>

          <h1 className="dashboard-heading text-3xl font-extrabold tracking-tight">
            AI Nursing Tutor
          </h1>

          <p className="dashboard-muted mt-2 max-w-xl text-sm leading-6">
            Explore nursing concepts, understand difficult topics
            and strengthen your clinical knowledge.
          </p>
        </div>

        <button
          type="button"
          onClick={startNewConversation}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#4930D0]"
        >
          <Plus size={17} />
          New conversation
        </button>
      </section>

      {/* MAIN TUTOR AREA */}
      <section className="dashboard-card flex min-h-[650px] flex-col overflow-hidden rounded-2xl lg:min-h-[720px]">

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--dashboard-border)] px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
              <Bot size={22} />
            </div>

            <div>
              <h2 className="dashboard-heading text-sm font-bold">
                Nursing Study Assistant
              </h2>

              <p className="dashboard-muted mt-0.5 text-[11px]">
                Frontend demo · Local conversations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="dashboard-heading inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-3 text-xs font-semibold transition hover:border-[#5B3DF5]"
            >
              <Clock size={15} />
              History
            </button>

            <button
              type="button"
              onClick={startNewConversation}
              aria-label="Start a new conversation"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border)] text-[#5B3DF5] transition hover:bg-[#E8DEFF]"
            >
              <Plus size={19} />
            </button>
          </div>
        </div>

        {/* SUBJECT SELECTOR */}
        <div className="relative border-b border-[var(--dashboard-border)] px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setShowSubjects((previous) => !previous)}
            className="dashboard-heading inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--dash-surface-soft)] px-3 text-xs font-semibold transition hover:text-[#5B3DF5]"
          >
            <GraduationCap size={16} className="text-[#5B3DF5]" />
            {selectedSubject}
            <ChevronDown size={15} />
          </button>

          {showSubjects && (
            <div className="dashboard-card absolute left-4 top-full z-30 mt-2 max-h-72 w-[min(320px,calc(100vw-48px))] overflow-y-auto rounded-xl border border-[var(--dashboard-border)] p-2 shadow-xl sm:left-6">
              <button
                type="button"
                onClick={() => updateSubject("General Nursing")}
                className="dashboard-heading w-full rounded-lg px-3 py-2.5 text-left text-xs font-semibold hover:bg-[#E8DEFF]/50"
              >
                General Nursing
              </button>

              {studyCategories.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => updateSubject(subject.title)}
                  className="dashboard-heading flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-[#E8DEFF]/50"
                >
                  {subject.title}

                  {selectedSubject === subject.title && (
                    <Check size={15} className="text-[#5B3DF5]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CHAT CONTENT */}
        <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">

          {isEmpty ? (
            <div className="mx-auto flex min-h-[450px] max-w-3xl flex-col items-center justify-center py-8 text-center">

              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-3xl bg-[#5B3DF5]/15 blur-2xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E8DEFF] text-[#5B3DF5]">
                  <Bot size={39} />
                </div>

                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#5B3DF5] text-white">
                  <Sparkles size={14} />
                </span>
              </div>

              <span className="dashboard-section-label">
                LET'S LEARN TOGETHER
              </span>

              <h3 className="dashboard-heading mt-3 text-2xl font-extrabold sm:text-3xl">
                What would you like to learn?
              </h3>

              <p className="dashboard-muted mt-3 max-w-lg text-sm leading-7">
                Ask a nursing question, explore a difficult concept
                or choose one of the suggested topics below.
              </p>

              <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
                {suggestions.map((suggestion) => {
                  const Icon = suggestion.icon;

                  return (
                    <button
                      key={suggestion.title}
                      type="button"
                      onClick={() => sendMessage(suggestion.prompt)}
                      className="dashboard-card group flex min-h-[100px] items-start gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:border-[#5B3DF5]/50 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="dashboard-heading text-sm font-bold">
                          {suggestion.title}
                        </p>

                        <p className="dashboard-muted mt-1 text-xs leading-5">
                          {suggestion.prompt}
                        </p>
                      </div>

                      <ArrowRight
                        size={15}
                        className="dashboard-muted mt-1 shrink-0 transition group-hover:translate-x-1 group-hover:text-[#5B3DF5]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-7">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      message.role === "assistant"
                        ? "bg-[#E8DEFF] text-[#5B3DF5]"
                        : "bg-[#17263F] text-white"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot size={19} />
                    ) : (
                      <User size={18} />
                    )}
                  </div>

                  <div
                    className={`min-w-0 max-w-[88%] sm:max-w-[82%] ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div className="dashboard-muted mb-2 flex items-center gap-2 text-[10px]">
                      <span className="font-bold">
                        {message.role === "assistant"
                          ? "AI Tutor"
                          : "You"}
                      </span>
                      <span>·</span>
                      <span>{formatTime(message.createdAt)}</span>
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3.5 text-left text-sm leading-7 ${
                        message.role === "user"
                          ? "rounded-tr-sm bg-[#5B3DF5] text-white"
                          : "rounded-tl-sm bg-[var(--dash-surface-soft)] dashboard-heading"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <TutorMessageContent
                          content={message.content}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
                    <Bot size={19} />
                  </div>

                  <div className="rounded-2xl bg-[var(--dash-surface-soft)] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#5B3DF5]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#5B3DF5] [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#5B3DF5] [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* MESSAGE INPUT */}
        <div className="border-t border-[var(--dashboard-border)] bg-[var(--dash-surface)] px-4 py-4 sm:px-6 lg:px-10">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl"
          >
            <div className="dashboard-card flex items-end gap-2 rounded-2xl border border-[var(--dashboard-border)] p-2 shadow-sm transition focus-within:border-[#5B3DF5]/60 focus-within:shadow-[0_0_0_3px_rgba(91,61,245,0.08)]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask your nursing question..."
                rows={2}
                className="dashboard-heading max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:opacity-50"
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B3DF5] text-white transition hover:bg-[#4930D0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </div>

            <div className="mt-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <p className="dashboard-muted text-[10px]">
                Enter to send · Shift + Enter for a new line
              </p>

              <p className="dashboard-muted flex items-center gap-1.5 text-[10px]">
                <ShieldCheck size={12} />
                Educational support, not clinical advice
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* DEMO NOTICE */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-black-50 p-4 dark:border-red-900 dark:bg-black-950/30">
        <Lightbulb
          size={19}
          className="mt-0.5 shrink-0 text-black-600 dark:text-black-300"
        />

        <div>
          <p className="text-xs font-bold text-blue-900 dark:text-black-200">
            AI Tutor demonstration
          </p>

          <p className="mt-1 text-xs leading-6 text-blue-800 dark:text-black-300">
            This version uses predefined educational responses and
            stores conversations in your browser. It is not connected
            to a live AI model. Always verify clinical information
            against current nursing references and institutional
            protocols.
          </p>
        </div>
      </div>

      {/* CONVERSATION HISTORY DRAWER */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <button
            type="button"
            aria-label="Close history"
            onClick={() => setShowHistory(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <aside className="dashboard-card relative flex h-full w-full max-w-md flex-col border-l border-[var(--dashboard-border)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--dashboard-border)] p-5">
              <div>
                <h3 className="dashboard-heading text-lg font-bold">
                  Conversation history
                </h3>

                <p className="dashboard-muted mt-1 text-xs">
                  Your saved tutor discussions
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHistory(false)}
                aria-label="Close history"
                className="dashboard-muted rounded-lg p-2 hover:bg-[var(--dash-surface-soft)]"
              >
                <X size={19} />
              </button>
            </div>

            <button
              type="button"
              onClick={startNewConversation}
              className="mx-5 mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] text-sm font-bold text-white transition hover:bg-[#4930D0]"
            >
              <Plus size={17} />
              New conversation
            </button>

            <div className="flex-1 space-y-2 overflow-y-auto p-5">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group flex items-center gap-2 rounded-xl border p-3 transition ${
                      activeId === conversation.id
                        ? "border-[#5B3DF5]/40 bg-[#E8DEFF]/40"
                        : "border-[var(--dashboard-border)] hover:border-[#5B3DF5]/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        selectConversation(conversation)
                      }
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="dashboard-heading truncate text-sm font-bold">
                        {conversation.title}
                      </p>

                      <p className="dashboard-muted mt-1 text-[10px]">
                        {conversation.subject} ·{" "}
                        {conversation.messages.length} messages
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteConversation(conversation.id)
                      }
                      aria-label="Delete conversation"
                      className="dashboard-muted rounded-lg p-2 opacity-70 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center py-16 text-center">
                  <MessageCircle
                    size={30}
                    className="dashboard-muted"
                  />

                  <p className="dashboard-heading mt-4 text-sm font-bold">
                    No conversations yet
                  </p>

                  <p className="dashboard-muted mt-2 text-xs">
                    Your discussions will appear here.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function TutorMessageContent({
  content,
}: {
  content: string;
}) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={index} className="h-1" />;

        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={index}
              className="dashboard-heading mb-3 mt-1 text-base font-extrabold"
            >
              {trimmed.replace("## ", "")}
            </h3>
          );
        }

        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <p
              key={index}
              className="dashboard-heading mt-3 font-bold"
            >
              {trimmed.replaceAll("**", "")}
            </p>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="text-[#5B3DF5]">•</span>
              <p>{formatInlineText(trimmed.slice(2))}</p>
            </div>
          );
        }

        if (/^\d+\./.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="font-bold text-[#5B3DF5]">
                {trimmed.match(/^\d+\./)?.[0]}
              </span>
              <p>
                {formatInlineText(
                  trimmed.replace(/^\d+\.\s*/, ""),
                )}
              </p>
            </div>
          );
        }

        return (
          <p key={index}>
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function formatInlineText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={index}
          className="dashboard-heading font-bold"
        >
          {part.replaceAll("**", "")}
        </strong>
      );
    }

    return part;
  });
}