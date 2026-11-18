"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Plus,
  Target,
  Trash2,
  X,
  BookOpen,
  Flame,
  Sparkles,
  CalendarCheck2,
  Circle,
  TrendingUp,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";

type Priority = "Low" | "Medium" | "High";

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = "qbanknurse-study-planner";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));

  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getPriorityStyles(priority: Priority) {
  switch (priority) {
    case "High":
      return "border-red-200 bg-red-50 text-red-700";
    case "Medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-blue-200 bg-blue-50 text-blue-700";
  }
}

function getPriorityDot(priority: Priority) {
  switch (priority) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-amber-500";
    default:
      return "bg-blue-500";
  }
}

export default function StudyPlannerPage() {
  const today = new Date();

  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [selectedDate, setSelectedDate] = useState(getLocalDate(today));
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Pharmacology");
  const [date, setDate] = useState(getLocalDate(today));
  const [duration, setDuration] = useState("30");
  const [priority, setPriority] = useState<Priority>("Medium");

  // Load saved tasks
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch {
      setTasks([]);
    }

    setStorageReady(true);
  }, []);

  // Persist tasks
  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, storageReady]);

  const weekStart = useMemo(() => {
    return addDays(getMonday(today), weekOffset * 7);
  }, [weekOffset]);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const selectedDayTasks = useMemo(
    () => tasks.filter((task) => task.date === selectedDate),
    [tasks, selectedDate],
  );

  const completedTasks = selectedDayTasks.filter((task) => task.completed);

  const plannedMinutes = selectedDayTasks.reduce(
    (total, task) => total + task.duration,
    0,
  );

  const completedMinutes = completedTasks.reduce(
    (total, task) => total + task.duration,
    0,
  );

  const completionPercentage =
    plannedMinutes > 0
      ? Math.round((completedMinutes / plannedMinutes) * 100)
      : 0;

  const weeklyTasks = tasks.filter((task) =>
    weekDates.some((day) => getLocalDate(day) === task.date),
  );

  const weeklyCompleted = weeklyTasks.filter(
    (task) => task.completed,
  ).length;

  const weeklyMinutes = weeklyTasks.reduce(
    (total, task) => total + task.duration,
    0,
  );

  const weeklyCompletedMinutes = weeklyTasks
    .filter((task) => task.completed)
    .reduce((total, task) => total + task.duration, 0);

  const weeklyCompletionPercentage = weeklyTasks.length
    ? Math.round((weeklyCompleted / weeklyTasks.length) * 100)
    : 0;

  const upcomingTasks = [...tasks]
    .filter((task) => !task.completed && task.date >= getLocalDate(today))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const selectedDateObject = new Date(`${selectedDate}T12:00:00`);

  const selectedDateLabel = selectedDateObject.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || Number(duration) < 5 || Number(duration) > 600) {
      return;
    }

    const newTask: StudyTask = {
      id: createId(),
      title: title.trim(),
      subject,
      date,
      duration: Number(duration),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((previous) => [...previous, newTask]);
    setSelectedDate(date);

    const taskDate = new Date(`${date}T12:00:00`);

    const difference =
      getMonday(taskDate).getTime() - getMonday(today).getTime();

    setWeekOffset(
      Math.round(difference / (7 * 24 * 60 * 60 * 1000)),
    );

    setTitle("");
    setDuration("30");
    setPriority("Medium");
    setShowForm(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== taskId),
    );
  };

  const openNewTask = () => {
    setDate(selectedDate);
    setShowForm(true);
  };

  const goToToday = () => {
    setWeekOffset(0);
    setSelectedDate(getLocalDate(today));
  };

  const navigateToTaskDate = (taskDate: string) => {
    setSelectedDate(taskDate);

    const targetDate = new Date(`${taskDate}T12:00:00`);

    const difference =
      getMonday(targetDate).getTime() - getMonday(today).getTime();

    setWeekOffset(
      Math.round(difference / (7 * 24 * 60 * 60 * 1000)),
    );
  };

  return (
    <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1500px] space-y-6 px-5 pb-8 pt-6 sm:px-7 lg:px-9">

      {/* HERO */}
      <section className="relative isolate min-h-[165px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/[0.06]" />
          <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-white/[0.08]" />
          <div className="absolute right-16 top-10 h-32 w-32 rounded-full bg-[#8B5CF6]/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#5B3DF5]/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B9A9FF]">
              <CalendarDays size={15} />
              Plan your progress
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Study Planner
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
              Build a consistent study routine, organize your sessions,
              and keep moving toward your nursing exam goals.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewTask}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#30245F] shadow-lg transition hover:bg-[#F5F1FF] hover:shadow-xl"
          >
            <Plus size={17} />
            Add study task
          </button>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<CalendarCheck2 size={20} />}
          label="Today's tasks"
          value={String(
            tasks.filter((task) => task.date === getLocalDate(today)).length,
          )}
          detail="Scheduled for today"
          iconClass="bg-[#E8DEFF] text-[#5B3DF5]"
        />

        <SummaryCard
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          value={`${completedTasks.length}/${selectedDayTasks.length}`}
          detail="Selected day progress"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={<Clock3 size={20} />}
          label="Study time"
          value={`${Math.floor(completedMinutes / 60)}h ${completedMinutes % 60}m`}
          detail="Completed on selected day"
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={<Flame size={20} />}
          label="Weekly completion"
          value={`${weeklyCompletionPercentage}%`}
          detail={`${weeklyCompleted} of ${weeklyTasks.length} tasks completed`}
          iconClass="bg-orange-50 text-orange-600"
        />
      </section>

      {/* WEEKLY CALENDAR */}
      <section className="dashboard-card rounded-2xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="dashboard-accent-icon flex h-9 w-9 items-center justify-center rounded-xl">
                <CalendarDays size={17} />
              </div>

              <h2 className="dashboard-heading text-lg font-bold">
                Weekly schedule
              </h2>
            </div>

            <p className="dashboard-muted mt-2 text-xs">
              Select a day to view and manage your study tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="dashboard-heading rounded-lg border border-[var(--dash-border)] px-3 py-2 text-xs font-semibold transition hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
            >
              Today
            </button>

            <button
              type="button"
              aria-label="Previous week"
              onClick={() => setWeekOffset((value) => value - 1)}
              className="dashboard-heading flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--dash-border)] transition hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
            >
              <ArrowLeft size={15} />
            </button>

            <button
              type="button"
              aria-label="Next week"
              onClick={() => setWeekOffset((value) => value + 1)}
              className="dashboard-heading flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--dash-border)] transition hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-[#5B3DF5]" />
          <p className="text-sm font-bold text-[#5B3DF5]">
            {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {weekDates.map((day, index) => {
            const dayKey = getLocalDate(day);
            const isSelected = selectedDate === dayKey;
            const isToday = dayKey === getLocalDate(today);

            const dayTasks = tasks.filter((task) => task.date === dayKey);

            const completed = dayTasks.filter(
              (task) => task.completed,
            ).length;

            const hasTasks = dayTasks.length > 0;

            return (
              <button
                key={dayKey}
                type="button"
                onClick={() => setSelectedDate(dayKey)}
                className={`relative flex min-w-0 flex-col items-center rounded-xl border px-1.5 py-3 transition-all sm:px-3 sm:py-4 ${
                  isSelected
                    ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-lg shadow-[#5B3DF5]/15"
                    : "dashboard-heading border-[var(--dash-border)] hover:border-[#5B3DF5]/50 hover:bg-[#E8DEFF]/20"
                }`}
              >
                {isToday && !isSelected && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#5B3DF5] sm:right-2 sm:top-2" />
                )}

                <span
                  className={`text-[10px] font-semibold sm:text-xs ${
                    isSelected ? "text-white/75" : "dashboard-muted"
                  }`}
                >
                  {WEEK_DAYS[index]}
                </span>

                <span className="mt-2 text-lg font-extrabold sm:text-2xl">
                  {day.getDate()}
                </span>

                <span
                  className={`mt-2 flex h-5 min-w-6 items-center justify-center rounded-full px-1.5 text-[9px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : hasTasks
                        ? "bg-[#E8DEFF] text-[#5B3DF5]"
                        : "bg-[var(--dash-surface-soft)] dashboard-muted"
                  }`}
                >
                  {hasTasks
                    ? `${completed}/${dayTasks.length}`
                    : isToday
                      ? "Today"
                      : "—"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[var(--dash-border)] pt-4 text-[10px]">
          <span className="dashboard-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#5B3DF5]" />
            Selected day
          </span>

          <span className="dashboard-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Completed tasks
          </span>

          <span className="dashboard-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#5B3DF5]" />
            Today
          </span>
        </div>
      </section>

      {/* DAILY TASKS AND PROGRESS */}
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">

        {/* TASK LIST */}
        <div className="dashboard-card rounded-2xl p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="dashboard-heading text-lg font-bold">
                  Study tasks
                </h2>

                <span className="dashboard-count-badge">
                  {selectedDayTasks.length}
                </span>
              </div>

              <p className="dashboard-muted mt-1 text-xs">
                {selectedDateLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={openNewTask}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8DEFF] px-3 py-2 text-xs font-bold text-[#5B3DF5] transition hover:bg-[#dcd0ff]"
            >
              <Plus size={14} />
              Add task
            </button>
          </div>

          {selectedDayTasks.length > 0 ? (
            <div className="space-y-3">
              {selectedDayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-start gap-3 rounded-xl border p-4 transition-all ${
                    task.completed
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-[var(--dash-border)] hover:border-[#5B3DF5]/30 hover:shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? "Mark task incomplete"
                        : "Mark task completed"
                    }
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      task.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-[var(--dash-border)] text-transparent hover:border-[#5B3DF5] hover:bg-[#E8DEFF]/40"
                    }`}
                  >
                    <Check size={14} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold ${
                        task.completed
                          ? "dashboard-muted line-through"
                          : "dashboard-heading"
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="dashboard-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px]">
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {task.subject}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={12} />
                        {task.duration} min
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[9px] font-bold ${getPriorityStyles(task.priority)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getPriorityDot(task.priority)}`}
                        />
                        {task.priority} priority
                      </span>

                      {task.completed && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700">
                          <CheckCircle2 size={11} />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    className="dashboard-muted rounded-lg p-2 opacity-60 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-[var(--dash-border)] px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8DEFF] text-[#5B3DF5]">
                <CalendarDays size={25} />
              </div>

              <h3 className="dashboard-heading mt-4 text-sm font-bold">
                No study tasks planned
              </h3>

              <p className="dashboard-muted mt-2 max-w-xs text-xs leading-6">
                Your schedule is clear for this day. Add a study task
                to start organizing your study time.
              </p>

              <button
                type="button"
                onClick={openNewTask}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#4930D0]"
              >
                <Plus size={15} />
                Create study task
              </button>
            </div>
          )}
        </div>

        {/* PROGRESS SIDEBAR */}
        <div className="space-y-5">

          {/* DAILY PROGRESS */}
          <div className="dashboard-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="dashboard-heading text-base font-bold">
                  Daily progress
                </h2>

                <p className="dashboard-muted mt-1 text-xs">
                  Your selected day
                </p>
              </div>

              <div className="dashboard-accent-icon flex h-9 w-9 items-center justify-center rounded-xl">
                <Target size={18} />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div
                className="relative flex h-40 w-40 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#5B3DF5 ${completionPercentage}%, var(--dash-border) ${completionPercentage}% 100%)`,
                }}
              >
                <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-[var(--dash-surface)]">
                  <span className="dashboard-heading text-3xl font-extrabold">
                    {completionPercentage}%
                  </span>

                  <span className="dashboard-muted mt-1 text-[10px]">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <ProgressRow
                label="Completed tasks"
                value={`${completedTasks.length}/${selectedDayTasks.length}`}
                percentage={
                  selectedDayTasks.length
                    ? (completedTasks.length / selectedDayTasks.length) * 100
                    : 0
                }
              />

              <ProgressRow
                label="Study time"
                value={`${completedMinutes}/${plannedMinutes} min`}
                percentage={completionPercentage}
              />
            </div>
          </div>

          {/* WEEKLY STUDY TIME */}
          <div className="dashboard-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <div className="dashboard-accent-icon flex h-9 w-9 items-center justify-center rounded-xl">
                <Clock3 size={18} />
              </div>

              <h2 className="dashboard-heading text-base font-bold">
                Weekly study time
              </h2>
            </div>

            <p className="dashboard-heading mt-5 text-3xl font-extrabold">
              {Math.floor(weeklyCompletedMinutes / 60)}
              <span className="dashboard-muted ml-1 text-sm font-semibold">
                hrs
              </span>{" "}
              {weeklyCompletedMinutes % 60}
              <span className="dashboard-muted ml-1 text-sm font-semibold">
                min
              </span>
            </p>

            <p className="dashboard-muted mt-2 text-xs">
              Completed out of {weeklyMinutes} planned minutes.
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--dash-surface-soft)]">
              <div
                className="h-full rounded-full bg-[#5B3DF5] transition-all duration-500"
                style={{
                  width: `${
                    weeklyMinutes
                      ? Math.min(
                          100,
                          (weeklyCompletedMinutes / weeklyMinutes) * 100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="dashboard-muted text-[10px]">
                Weekly goal progress
              </span>

              <span className="text-[10px] font-bold text-[#5B3DF5]">
                {weeklyMinutes
                  ? Math.round(
                      (weeklyCompletedMinutes / weeklyMinutes) * 100,
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* QUICK INSIGHT */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5B3DF5] to-[#38218E] p-5 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/10" />

            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Sparkles size={17} />
              </div>

              <h3 className="mt-4 text-sm font-bold">
                Keep your momentum
              </h3>

              <p className="mt-2 text-xs leading-6 text-white/70">
                Small, consistent study sessions can make your preparation
                more manageable. Focus on completing one task at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING TASKS */}
      <section className="dashboard-card rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="dashboard-heading text-lg font-bold">
                Upcoming study tasks
              </h2>

              {upcomingTasks.length > 0 && (
                <span className="dashboard-count-badge">
                  {upcomingTasks.length}
                </span>
              )}
            </div>

            <p className="dashboard-muted mt-1 text-xs">
              Your next scheduled study sessions.
            </p>
          </div>

          <div className="dashboard-accent-icon flex h-10 w-10 items-center justify-center rounded-xl">
            <CalendarDays size={19} />
          </div>
        </div>

        {upcomingTasks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {upcomingTasks.map((task) => (
              <button
                type="button"
                key={task.id}
                onClick={() => navigateToTaskDate(task.date)}
                className="group rounded-xl border border-[var(--dash-border)] p-4 text-left transition hover:border-[#5B3DF5]/50 hover:bg-[#E8DEFF]/20 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dashboard-muted text-[10px] font-semibold">
                    {formatDate(new Date(`${task.date}T12:00:00`))}
                  </span>

                  <span
                    className={`rounded-md border px-2 py-1 text-[9px] font-bold ${getPriorityStyles(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="dashboard-heading mt-3 line-clamp-2 text-sm font-bold transition group-hover:text-[#5B3DF5]">
                  {task.title}
                </p>

                <p className="dashboard-muted mt-2 text-[10px]">
                  {task.subject} · {task.duration} min
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#5B3DF5]">
                  View schedule
                  <ArrowRight size={12} className="transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-[var(--dash-border)] px-5 py-10 text-center">
            <div className="dashboard-accent-icon flex h-12 w-12 items-center justify-center rounded-xl">
              <CalendarCheck2 size={21} />
            </div>

            <p className="dashboard-heading mt-3 text-sm font-bold">
              No upcoming tasks
            </p>

            <p className="dashboard-muted mt-1 max-w-sm text-xs leading-5">
              Create a study task to plan your next session and keep
              your preparation organized.
            </p>

            <button
              type="button"
              onClick={openNewTask}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#4930D0]"
            >
              <Plus size={14} />
              Plan a study session
            </button>
          </div>
        )}
      </section>

      {/* CREATE TASK MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div className="dashboard-card my-auto w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl">
            {/* Modal header */}
            <div className="relative overflow-hidden border-b border-[var(--dash-border)] bg-gradient-to-br from-[#17263F] via-[#202C50] to-[#30245F] p-5">
              <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full border border-white/10" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B9A9FF]">
                    <Plus size={14} />
                    New study session
                  </div>

                  <h2 className="mt-2 text-lg font-bold text-white">
                    Create study task
                  </h2>

                  <p className="mt-1 text-xs text-white/60">
                    Add a new session to your study schedule.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                  className="rounded-lg bg-white/10 p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={addTask} className="space-y-4 p-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="task-title"
                  className="dashboard-heading mb-2 block text-xs font-bold"
                >
                  Task title
                </label>

                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Review cardiovascular medications"
                  required
                  maxLength={100}
                  className="dashboard-input min-h-11 w-full rounded-xl px-3 text-sm outline-none focus:border-[#5B3DF5]"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="task-subject"
                  className="dashboard-heading mb-2 block text-xs font-bold"
                >
                  Subject
                </label>

                <select
                  id="task-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="dashboard-input min-h-11 w-full rounded-xl px-3 text-sm outline-none focus:border-[#5B3DF5]"
                >
                  {studyCategories.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date + duration */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="task-date"
                    className="dashboard-heading mb-2 block text-xs font-bold"
                  >
                    Study date
                  </label>

                  <input
                    id="task-date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                    className="dashboard-input min-h-11 w-full rounded-xl px-3 text-sm outline-none focus:border-[#5B3DF5]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-duration"
                    className="dashboard-heading mb-2 block text-xs font-bold"
                  >
                    Duration
                  </label>

                  <div className="relative">
                    <input
                      id="task-duration"
                      type="number"
                      min="5"
                      max="600"
                      step="5"
                      value={duration}
                      onChange={(event) => setDuration(event.target.value)}
                      required
                      className="dashboard-input min-h-11 w-full rounded-xl px-3 pr-16 text-sm outline-none focus:border-[#5B3DF5]"
                    />

                    <span className="dashboard-muted absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                      minutes
                    </span>
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="task-priority"
                  className="dashboard-heading mb-2 block text-xs font-bold"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as Priority)
                  }
                  className="dashboard-input min-h-11 w-full rounded-xl px-3 text-sm outline-none focus:border-[#5B3DF5]"
                >
                  <option value="Low">Low priority</option>
                  <option value="Medium">Medium priority</option>
                  <option value="High">High priority</option>
                </select>
              </div>

              {/* Form actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-[var(--dash-border)] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="dashboard-heading min-h-11 rounded-xl border border-[var(--dash-border)] px-5 text-sm font-semibold transition hover:bg-[var(--dash-surface-soft)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !title.trim() ||
                    Number(duration) < 5 ||
                    Number(duration) > 600
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-5 text-sm font-bold text-white transition hover:bg-[#4930D0] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={16} />
                  Save study task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  iconClass,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  iconClass: string;
}) {
  return (
    <div className="dashboard-card rounded-2xl p-5 transition hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="dashboard-muted text-xs font-medium">
            {label}
          </p>

          <p className="dashboard-heading mt-1 text-xl font-extrabold">
            {value}
          </p>
        </div>
      </div>

      <p className="dashboard-muted mt-4 text-[10px]">
        {detail}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: number;
}) {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="dashboard-muted text-xs">
          {label}
        </span>

        <span className="dashboard-heading text-xs font-bold">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--dash-surface-soft)]">
        <div
          className="h-full rounded-full bg-[#5B3DF5] transition-all duration-500"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}