import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type QueryOptions = {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  single?: boolean;
  dependencies?: any[];
};

export function useSupabaseQuery<T>({
  table,
  select = "*",
  filters = {},
  order,
  limit,
  single = false,
  dependencies = [],
}: QueryOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase.from(table).select(select);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (order) {
        query = query.order(order.column, {
          ascending: order.ascending ?? true,
        });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      // Get single result if requested
      const { data: result, error: queryError } = single
        ? await query.single()
        : await query;

      if (queryError) {
        console.error(`Error fetching data from ${table}:`, queryError);
        throw queryError;
      }

      setData(result as T);
      setError(null);
    } catch (err) {
      console.error(`Error in useSupabaseQuery for ${table}:`, err);
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [
    table,
    select,
    JSON.stringify(filters),
    order?.column,
    order?.ascending,
    limit,
    single,
  ]);

  useEffect(() => {
    fetchData();
  }, [...dependencies]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch };
}
