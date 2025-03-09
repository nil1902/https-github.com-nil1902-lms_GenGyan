import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type RealtimeOptions = {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  filterValue?: any;
  select?: string;
};

export function useRealtime<T>({
  table,
  event = "*",
  filter,
  filterValue,
  select = "*",
}: RealtimeOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase.from(table).select(select);

      if (filter && filterValue !== undefined) {
        query = query.eq(filter, filterValue);
      }

      const { data: initialData, error: initialError } = await query;

      if (initialError) {
        console.error(
          `Error fetching initial data from ${table}:`,
          initialError,
        );
        throw initialError;
      }

      setData(initialData as T[]);
      setError(null);
    } catch (err) {
      console.error(`Error in useRealtime initial fetch for ${table}:`, err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [table, select, filter, filterValue]);

  useEffect(() => {
    fetchData();

    // Set up realtime subscription
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table,
          filter: filter ? `${filter}=eq.${filterValue}` : undefined,
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          setData((currentData) => {
            switch (eventType) {
              case "INSERT":
                return [...currentData, newRecord as T];
              case "UPDATE":
                return currentData.map((item: any) =>
                  item.id === (newRecord as any).id ? (newRecord as T) : item,
                );
              case "DELETE":
                return currentData.filter(
                  (item: any) => item.id !== (oldRecord as any).id,
                );
              default:
                return currentData;
            }
          });
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`Realtime subscription to ${table} established`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, filter, filterValue, fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
