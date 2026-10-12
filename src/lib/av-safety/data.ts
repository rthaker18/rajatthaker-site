import data from "@/data/av-safety.json";
import type { AvSafetyData } from "./types";

export function getAvSafetyData(): AvSafetyData {
  return data satisfies AvSafetyData;
}
