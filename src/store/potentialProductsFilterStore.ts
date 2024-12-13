import { create } from "zustand";
import { BestsellerProduct } from "../types/productFinder";

type SourcingPlatform = "all" | "aliexpress" | "cj";

interface PotentialProductsFilterState {
  sourcingPlatform: SourcingPlatform;
  categories: any[];
  priceRange: [number, number];
  categorySelected: string | null;
  priceRangeSelected: [number, number];
  sortOption: string;
  isDataLoaded: boolean;
  selectedProduct: BestsellerProduct | null;
  selectedProductImage: string | null;

  setSourcingPlatform: (platform: SourcingPlatform) => void;
  setCategories: (categories: any[]) => void;
  setCategorySelected: (name: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setPriceRangeSelected: (range: [number, number]) => void;
  setSortOption: (option: string) => void;
  setIsDataLoaded: (loaded: boolean) => void;
  setSelectedProduct: (product: BestsellerProduct | null) => void;
  setSelectedProductImage: (url: string | null) => void;
}

export const usePotentialProductsFilterStore =
  create<PotentialProductsFilterState>((set) => ({
    sourcingPlatform: "aliexpress",
    categories: [],
    categorySelected: null,
    priceRange: [0, 10000],
    priceRangeSelected: [0, 10000],
    sortOption: "0",
    isDataLoaded: false,
    selectedProduct: null,
    selectedProductImage: null,

    setSourcingPlatform: (platform) =>
      set({
        sourcingPlatform: platform,
        categorySelected: null,
        categories: [],
        isDataLoaded: false,
        // Price range y demás se resetearán luego de la carga de datos
      }),
    setCategories: (categories) => set({ categories }),
    setCategorySelected: (name) => set({ categorySelected: name }),
    setPriceRange: (range) => set({ priceRange: range }),
    setPriceRangeSelected: (range) => set({ priceRangeSelected: range }),
    setSortOption: (option) => set({ sortOption: option }),
    setIsDataLoaded: (loaded) => set({ isDataLoaded: loaded }),
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setSelectedProductImage: (url) => set({ selectedProductImage: url }),
  }));
