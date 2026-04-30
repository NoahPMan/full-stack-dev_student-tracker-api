import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export type Course = {
  id: string;          // UUID from DB
  code: string;        // user-entered (COMP-3020 etc.)
  name: string;
  credits: number | null;
  instructor: string | null;
  semester: string | null;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
};

async function jsonOrThrow(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}

export function useCourses() {
  const { isLoaded, isSignedIn, getToken } = useAuth(); // Clerk auth hook 

  const [list, setList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
    };
  }, [getToken]);

  const refresh = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setList([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/v1/courses`, {
        headers: await authHeaders(),
      });

      const payload = await jsonOrThrow(res);

      // Your backend returns { success, count, data }
      const courses = Array.isArray(payload?.data) ? payload.data : [];
      setList(courses);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, isLoaded, isSignedIn]);

  const createCourse = useCallback(
    async (input: { code: string; name: string; credits?: number | null }) => {
      const body = {
        code: input.code,
        name: input.name,
        credits: input.credits ?? null,
      };

      const res = await fetch(`${API}/api/v1/courses`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify(body),
      });

      await jsonOrThrow(res);
      await refresh();
    },
    [authHeaders, refresh],
  );

  const getSummary = useCallback(
    async (id: string) => {
      const res = await fetch(`${API}/api/v1/courses/${id}/summary`, {
        headers: await authHeaders(),
      });

      const payload = await jsonOrThrow(res);

      // backend returns { success, data: { assignmentsCount, notesCount } }
      return payload?.data as { assignmentsCount: number; notesCount: number };
    },
    [authHeaders],
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      const res = await fetch(`${API}/api/v1/courses/${id}`, {
        method: "DELETE",
        headers: await authHeaders(),
      });

      await jsonOrThrow(res);
      await refresh();
    },
    [authHeaders, refresh],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { list, loading, error, refresh, createCourse, getSummary, deleteCourse };
}
