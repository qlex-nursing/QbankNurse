"use client";

import { useEffect, useMemo, useState } from "react";
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
  Circle,
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
      return "bg-red-50 text-red-700 border-red-100";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-100";
    default:
      return "bg-blue-50 text-blue-700 border-blue-100";
  }
}

export default function StudyPlannerPage() {
  const today = new Date();

  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    getLocalDate(today),
  );
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Pharmacology");
  const [date, setDate] = useState(getLocalDate(today));
  const [duration, setDuration] = useState("30");
  const [priority, setPriority] = useState<Priority>("Medium");

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

  const completedTasks = selectedDayTasks.filter(
    (task) => task.completed,
  );

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

  const upcomingTasks = [...tasks]
    .filter((task) => !task.completed && task.date >= getLocalDate(today))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || Number(duration) <= 0) return;

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
    setWeekOffset(
      Math.round(
        (getMonday(new Date(`${date}T12:00:00`)).getTime() -
          getMonday(today).getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      ),
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

  return (
    <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1440px] space-y-7 px-4 py-5 sm:px-6 lg:px-8">

      {/* HEADER */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#5B3DF5]">
            <CalendarDays size={15} />
            PLAN YOUR PROGRESS
          </div>

          <h1 className="dashboard-heading text-3xl font-extrabold tracking-tight">
            Study Planner
          </h1>

          <p className="dashboard-muted mt-2 max-w-xl text-sm leading-6">
            Organize your nursing studies, set daily goals and
            stay consistent with your exam preparation.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewTask}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#4930D0]"
        >
          <Plus size={17} />
          Add study task
        </button>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          icon={<Target size={21} />}
          label="Today's tasks"
          value={String(
            tasks.filter(
              (task) => task.date === getLocalDate(today),
            ).length,
          )}
          detail="Scheduled for today"
          iconClass="bg-[#E8DEFF] text-[#5B3DF5]"
        />

        <SummaryCard
          icon={<CheckCircle2 size={21} />}
          label="Completed today"
          value={`${completedTasks.length}/${selectedDayTasks.length}`}
          detail="Selected day progress"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={<Clock3 size={21} />}
          label="Study time"
          value={`${Math.floor(completedMinutes / 60)}h ${completedMinutes % 60}m`}
          detail="Completed on selected day"
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={<Flame size={21} />}
          label="Weekly completion"
          value={`${weeklyTasks.length ? Math.round((weeklyCompleted / weeklyTasks.length) * 100) : 0}%`}
          detail={`${weeklyCompleted} of ${weeklyTasks.length} tasks completed`}
          iconClass="bg-orange-50 text-orange-600"
        />
      </section>

      {/* WEEKLY CALENDAR */}
      <section className="dashboard-card rounded-2xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="dashboard-heading text-lg font-bold">
              Weekly schedule
            </h2>

            <p className="dashboard-muted mt-1 text-xs">
              Select a day to view its study tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setWeekOffset(0);
                setSelectedDate(getLocalDate(today));
              }}
              className="dashboard-heading rounded-lg border border-[var(--dashboard-border)] px-3 py-2 text-xs font-semibold hover:border-[#5B3DF5]"
            >
              Today
            </button>

            <button
              type="button"
              aria-label="Previous week"
              onClick={() => setWeekOffset((value) => value - 1)}
              className="dashboard-heading flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--dashboard-border)] hover:border-[#5B3DF5]"
            >
              <ArrowLeft size={15} />
            </button>

            <button
              type="button"
              aria-label="Next week"
              onClick={() => setWeekOffset((value) => value + 1)}
              className="dashboard-heading flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--dashboard-border)] hover:border-[#5B3DF5]"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="mb-5 text-sm font-bold text-[#5B3DF5]">
          {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {weekDates.map((day, index) => {
            const dayKey = getLocalDate(day);
            const isSelected = selectedDate === dayKey;
            const isToday = dayKey === getLocalDate(today);

            const dayTasks = tasks.filter(
              (task) => task.date === dayKey,
            );

            const completed = dayTasks.filter(
              (task) => task.completed,
            ).length;

            return (
              <button
                key={dayKey}
                type="button"
                onClick={() => setSelectedDate(dayKey)}
                className={`flex min-w-0 flex-col items-center rounded-xl border px-1 py-3 transition sm:px-3 sm:py-4 ${
                  isSelected
                    ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-md shadow-[#5B3DF5]/15"
                    : "dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5]/50"
                }`}
              >
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
                  className={`mt-2 flex h-5 items-center justify-center rounded-full px-1.5 text-[9px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#E8DEFF] text-[#5B3DF5]"
                  }`}
                >
                  {dayTasks.length > 0
                    ? `${completed}/${dayTasks.length}`
                    : isToday
                      ? "Today"
                      : "—"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-[10px]">
          <span className="dashboard-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#5B3DF5]" />
            Selected day
          </span>

          <span className="dashboard-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Completed tasks
          </span>
        </div>
      </section>

      {/* DAILY PROGRESS AND TASKS */}
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">

        {/* TASK LIST */}
        <div className="dashboard-card rounded-2xl p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="dashboard-heading text-lg font-bold">
                Study tasks
              </h2>

              <p className="dashboard-muted mt-1 text-xs">
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  },
                )}
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
                  className={`group flex items-start gap-3 rounded-xl border p-4 transition ${
                    task.completed
                      ? "border-emerald-100 bg-emerald-50/40"
                      : "border-[var(--dashboard-border)] hover:border-[#5B3DF5]/30"
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
                        : "border-[var(--dashboard-border)] text-transparent hover:border-[#5B3DF5]"
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

                    <span
                      className={`mt-3 inline-flex rounded-lg border px-2 py-1 text-[9px] font-bold ${getPriorityStyles(task.priority)}`}
                    >
                      {task.priority} priority
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    className="dashboard-muted rounded-lg p-2 opacity-70 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-[var(--dashboard-border)] px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8DEFF] text-[#5B3DF5]">
                <CalendarDays size={25} />
              </div>

              <h3 className="dashboard-heading mt-4 text-sm font-bold">
                No study tasks planned
              </h3>

              <p className="dashboard-muted mt-2 max-w-xs text-xs leading-6">
                Your schedule is clear for this day. Add a task
                to start organizing your study time.
              </p>

              <button
                type="button"
                onClick={openNewTask}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4930D0]"
              >
                <Plus size={15} />
                Create study task
              </button>
            </div>
          )}
        </div>

        {/* DAILY GOAL */}
        <div className="space-y-5">
          <div className="dashboard-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="dashboard-heading text-base font-bold">
                Daily progress
              </h2>

              <Target size={19} className="text-[#5B3DF5]" />
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div
                className="relative flex h-40 w-40 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#5B3DF5 ${completionPercentage}%, var(--dashboard-border) ${completionPercentage}% 100%)`,
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
                    ? (completedTasks.length /
                        selectedDayTasks.length) *
                      100
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
              <Clock3 size={19} className="text-[#5B3DF5]" />

              <h2 className="dashboard-heading text-base font-bold">
                Weekly study time
              </h2>
            </div>

            <p className="dashboard-heading mt-5 text-3xl font-extrabold">
              {Math.floor(weeklyCompletedMinutes / 60)}
              <span className="dashboard-muted ml-1 text-sm font-semibold">
                hrs
              </span>
              {" "}
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
                className="h-full rounded-full bg-[#5B3DF5] transition-all"
                style={{
                  width: `${
                    weeklyMinutes
                      ? Math.min(
                          100,
                          (weeklyCompletedMinutes / weeklyMinutes) *
                            100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING TASKS */}
      <section className="dashboard-card rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="dashboard-heading text-lg font-bold">
              Upcoming study tasks
            </h2>

            <p className="dashboard-muted mt-1 text-xs">
              Your next scheduled study sessions.
            </p>
          </div>

          <CalendarDays size={20} className="text-[#5B3DF5]" />
        </div>

        {upcomingTasks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {upcomingTasks.map((task) => (
              <button
                type="button"
                key={task.id}
                onClick={() => {
                  setSelectedDate(task.date);

                  const taskDate = new Date(
                    `${task.date}T12:00:00`,
                  );

                  const difference =
                    getMonday(taskDate).getTime() -
                    getMonday(today).getTime();

                  setWeekOffset(
                    Math.round(
                      difference / (7 * 24 * 60 * 60 * 1000),
                    ),
                  );
                }}
                className="rounded-xl border border-[var(--dashboard-border)] p-4 text-left transition hover:border-[#5B3DF5]/50 hover:bg-[#E8DEFF]/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dashboard-muted text-[10px] font-semibold">
                    {formatDate(
                      new Date(`${task.date}T12:00:00`),
                    )}
                  </span>

                  <span
                    className={`rounded-md border px-2 py-1 text-[9px] font-bold ${getPriorityStyles(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="dashboard-heading mt-3 line-clamp-2 text-sm font-bold">
                  {task.title}
                </p>

                <p className="dashboard-muted mt-2 text-[10px]">
                  {task.subject} · {task.duration} min
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="dashboard-muted py-8 text-center text-xs">
            No upcoming tasks. Create a study task to plan your next session.
          </p>
        )}
      </section>

      {/* CREATE TASK MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="dashboard-card my-auto w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--dashboard-border)] p-5">
              <div>
                <h2 className="dashboard-heading text-lg font-bold">
                  Create study task
                </h2>

                <p className="dashboard-muted mt-1 text-xs">
                  Add a new session to your study schedule.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="dashboard-muted rounded-lg p-2 hover:bg-[var(--dash-surface-soft)]"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={addTask} className="space-y-4 p-5">
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
                    Duration (minutes)
                  </label>

                  <input
                    id="task-duration"
                    type="number"
                    min="5"
                    max="600"
                    step="5"
                    value={duration}
                    onChange={(event) =>
                      setDuration(event.target.value)
                    }
                    required
                    className="dashboard-input min-h-11 w-full rounded-xl px-3 text-sm outline-none focus:border-[#5B3DF5]"
                  />
                </div>
              </div>

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

              <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="dashboard-heading min-h-11 rounded-xl border border-[var(--dashboard-border)] px-5 text-sm font-semibold hover:bg-[var(--dash-surface-soft)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!title.trim() || Number(duration) < 5 || Number(duration) > 600}
                  className="min-h-11 rounded-xl bg-[#5B3DF5] px-5 text-sm font-bold text-white transition hover:bg-[#4930D0] disabled:cursor-not-allowed disabled:opacity-40"
                >
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
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  iconClass: string;
}) {
  return (
    <div className="dashboard-card rounded-2xl p-5">
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
          className="h-full rounded-full bg-[#5B3DF5] transition-all"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}