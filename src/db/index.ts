import * as schema from "@/src/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

// This simple hook gives you the typed database instance
export const useDb = () => {
  const db = useSQLiteContext();

  // useMemo ensures the drizzle instance is created only once
  // and re-used on subsequent renders.
  const drizzleDb = useMemo(() => drizzle(db, { schema }), [db]);

  return drizzleDb;
};
