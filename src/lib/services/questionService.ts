import { apiFetch } from "@/lib/api/api";

export type QuestionFetchType =
  | "absolute"
  | "distinct"
  | "relative";

export type QuestionQueryParams = Record<
  string,
  string | number | boolean | undefined
>;

async function fetchQuestions<T>(
  fetchtype: QuestionFetchType,
  params?: QuestionQueryParams,
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
    `/api/nexus/strata/assessment/question?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
}

export const questionService = {
  absolute: <T>(params?: QuestionQueryParams) =>
    fetchQuestions<T>("absolute", params),

  distinct: <T>(params?: QuestionQueryParams) =>
    fetchQuestions<T>("distinct", params),

  relative: <T>(params?: QuestionQueryParams) =>
    fetchQuestions<T>("relative", params),
};
