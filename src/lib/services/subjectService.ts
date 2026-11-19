import { apiFetch } from "@/lib/api/api";

export type SubjectFetchType =
  | "absolute"
  | "distinct"
  | "relative";

export type SubjectQueryParams = Record<
  string,
  string | number | boolean | undefined
>;

async function fetchSubjects<T>(
  fetchtype: SubjectFetchType,
  params?: SubjectQueryParams,
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
    `/api/nexus/strata/learning/subject?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
}

export const subjectService = {
  absolute: <T>(params?: SubjectQueryParams) =>
    fetchSubjects<T>("absolute", params),

  distinct: <T>(params?: SubjectQueryParams) =>
    fetchSubjects<T>("distinct", params),

  relative: <T>(params?: SubjectQueryParams) =>
    fetchSubjects<T>("relative", params),
};
