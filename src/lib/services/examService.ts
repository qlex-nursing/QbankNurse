import { apiFetch } from "@/lib/api/api";

export type ExamFetchType =
  | "absolute"
  | "distinct"
  | "relative"
  | "nominal"
  | "live";

export type ExamQueryParams = Record<
  string,
  string | number | boolean | undefined
>;

async function fetchExams<T>(
  fetchtype: ExamFetchType,
  params?: ExamQueryParams,
): Promise<T> {
  const query = new URLSearchParams();

  query.set("fetchtype", fetchtype);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    }
  }

  return apiFetch<T>(
    `/api/nexus/strata/assessment/exam?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
}

export const examService = {
  absolute: <T>(params?: ExamQueryParams) =>
    fetchExams<T>("absolute", params),

  distinct: <T>(params?: ExamQueryParams) =>
    fetchExams<T>("distinct", params),

  relative: <T>(params?: ExamQueryParams) =>
    fetchExams<T>("relative", params),

  nominal: <T>(params?: ExamQueryParams) =>
    fetchExams<T>("nominal", params),

  live: <T>(params?: ExamQueryParams) =>
    fetchExams<T>("live", params),
};
