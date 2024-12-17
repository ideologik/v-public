// src/store/analyzeProductStore.ts
import { create } from "zustand";

export type DateRangeOption = "1week" | "1month" | "3months" | "1year" | "all";

interface DateFilterState {
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
}

export const useDateFilterStore = create<DateFilterState>((set) => ({
  dateRange: "1year",
  setDateRange: (range) => set({ dateRange: range }),
}));
