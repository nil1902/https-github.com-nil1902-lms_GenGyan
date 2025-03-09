import { useState } from "react";
import { supabase } from "@/lib/supabase";

type MutationOptions = {
  table: string;
  type: "insert" | "update" | "delete" | "upsert";
};

export function useSupabaseMutation<T>({ table, type }: MutationOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data: any, matchColumn?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query;

      switch (type) {
        case "insert":
          query = supabase.from(table).insert(data);
          break;
        case "update":
          if (!matchColumn || !data[matchColumn]) {
            throw new Error("Match column and value required for update");
          }
          query = supabase
            .from(table)
            .update(data)
            .eq(matchColumn, data[matchColumn]);
          break;
        case "delete":
          if (!matchColumn || !data[matchColumn]) {
            throw new Error("Match column and value required for delete");
          }
          query = supabase
            .from(table)
            .delete()
            .eq(matchColumn, data[matchColumn]);
          break;
        case "upsert":
          query = supabase.from(table).upsert(data);
          break;
        default:
          throw new Error("Invalid mutation type");
      }

      const { data: result, error: mutationError } = await query.select();

      if (mutationError) {
        console.error(`Error in ${type} mutation for ${table}:`, mutationError);
        throw mutationError;
      }

      return result as T;
    } catch (err) {
      console.error(`Error in ${type} mutation for ${table}:`, err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
