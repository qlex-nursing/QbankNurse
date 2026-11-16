"use client";

import { useState } from "react";
import {
  BookOpen,
  Activity,
  Image as ImageIcon,
  BarChart3,
  Table2,
  X,
  ZoomIn,
  FileText,
} from "lucide-react";

import type {
  ClinicalCaseReference,
  ClinicalExhibit,
} from "@/data/mock/dashboard/practice-questions";

interface ClinicalExhibitsProps {
  clinicalCase: ClinicalCaseReference;
}

export default function ClinicalExhibits({
  clinicalCase,
}: ClinicalExhibitsProps) {
  const exhibits = clinicalCase.exhibits ?? [];

  const [activeTab, setActiveTab] = useState(exhibits[0]?.id ?? "");
  const [selectedImage, setSelectedImage] =
    useState<Extract<ClinicalExhibit, { type: "image" | "diagram" }> | null>(
      null,
    );

  if (exhibits.length === 0) return null;

  const activeExhibit =
    exhibits.find((exhibit) => exhibit.id === activeTab) ?? exhibits[0];

  const getIcon = (type: ClinicalExhibit["type"]) => {
    switch (type) {
      case "notes":
        return <FileText size={16} />;
      case "table":
        return <Table2 size={16} />;
      case "image":
      case "diagram":
        return <ImageIcon size={16} />;
      case "chart":
        return <BarChart3 size={16} />;
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-[#E8DEFF] bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-[#E8DEFF] bg-gradient-to-r from-[#F8F6FF] to-white p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3DF5]">
            <Activity size={16} />
            Clinical exhibits
          </div>

          <h3 className="mt-2 text-lg font-extrabold text-[#17263F]">
            {clinicalCase.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span>
              <strong>Patient:</strong> {clinicalCase.patientName}
            </span>

            <span>
              <strong>Age:</strong> {clinicalCase.patientAge} years
            </span>

            <span>
              <strong>Stage:</strong> {clinicalCase.stage} of{" "}
              {clinicalCase.totalStages}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {clinicalCase.patientDetails}
          </p>
        </div>

        {/* Exhibit tabs */}
        <div className="border-b border-[var(--dashboard-border)] px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {exhibits.map((exhibit) => (
              <button
                key={exhibit.id}
                type="button"
                onClick={() => setActiveTab(exhibit.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  activeTab === exhibit.id
                    ? "bg-[#5B3DF5] text-white shadow-sm"
                    : "bg-[#F5F3FA] text-slate-600 hover:bg-[#EDE8FF]"
                }`}
              >
                {getIcon(exhibit.type)}
                {exhibit.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active exhibit */}
        <div className="p-5 sm:p-6">
          {activeExhibit.description && (
            <p className="mb-4 text-sm leading-6 text-slate-500">
              {activeExhibit.description}
            </p>
          )}

          {activeExhibit.type === "notes" && (
            <div className="rounded-2xl border border-[#E8DEFF] bg-[#F8F6FF] p-5">
              <div className="mb-3 flex items-center gap-2 text-[#5B3DF5]">
                <BookOpen size={18} />
                <span className="text-sm font-bold">
                  Clinical documentation
                </span>
              </div>

              <p className="text-sm leading-7 text-slate-700">
                {activeExhibit.content}
              </p>
            </div>
          )}

          {activeExhibit.type === "table" && (
            <div className="overflow-x-auto rounded-2xl border border-[var(--dashboard-border)]">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="bg-[#F8F6FF]">
                  <tr>
                    {activeExhibit.columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-3 font-bold text-[#17263F]"
                      >
                        {column.label}
                        {column.unit ? ` (${column.unit})` : ""}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {activeExhibit.rows.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-[var(--dashboard-border)]"
                    >
                      {activeExhibit.columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-4 py-4 text-slate-700"
                        >
                          {row[column.key] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeExhibit.type === "image" ||
            activeExhibit.type === "diagram") && (
            <button
              type="button"
              onClick={() => setSelectedImage(activeExhibit)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-slate-50 text-left"
            >
              <img
                src={activeExhibit.src}
                alt={activeExhibit.alt}
                className="max-h-[420px] w-full object-contain"
              />

              <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-[#17263F]/90 px-3 py-2 text-xs font-semibold text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                <ZoomIn size={15} />
                Enlarge image
              </span>

              {activeExhibit.caption && (
                <span className="block border-t border-[var(--dashboard-border)] bg-white p-3 text-xs text-slate-500">
                  {activeExhibit.caption}
                </span>
              )}
            </button>
          )}

          {activeExhibit.type === "chart" && (
            <div className="space-y-4 rounded-2xl border border-[var(--dashboard-border)] p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {activeExhibit.yAxisLabel}
                </span>

                <span className="text-xs font-semibold text-slate-500">
                  {activeExhibit.xAxisLabel}
                </span>
              </div>

              {activeExhibit.data.map((point, index) => {
                const maxValue = Math.max(
                  ...activeExhibit.data.map((item) => item.value),
                  1,
                );

                const width = Math.max(
                  (point.value / maxValue) * 100,
                  2,
                );

                return (
                  <div key={index}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="font-semibold text-slate-600">
                        {point.label}
                      </span>

                      <span className="font-bold text-[#17263F]">
                        {point.value}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#EEEAF7]">
                      <div
                        className="h-full rounded-full bg-[#5B3DF5] transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Enlarged image viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101828]/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl bg-white p-3 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-bold text-[#17263F]">
                {selectedImage.title}
              </h3>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image viewer"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />

            {selectedImage.caption && (
              <p className="mt-3 text-sm text-slate-500">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}