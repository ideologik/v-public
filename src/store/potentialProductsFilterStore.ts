import { create } from "zustand";
import { BestsellerProduct } from "../types/productFinder";

type SourcingPlatform = "all" | "aliexpress" | "cj";

interface PotentialProductsFilterState {
  sourcingPlatform: SourcingPlatform;
  categories: any[];
  subCategories: any[];
  categoryId: number | null;
  subCategoryId: number | null;
  priceRange: [number, number];
  priceRangeSelected: [number, number];
  sortOption: string;
  isDataLoaded: boolean;
  selectedProduct: BestsellerProduct | null;
  selectedProductImage: string | null;

  setSourcingPlatform: (platform: SourcingPlatform) => void;
  setCategories: (categories: any[]) => void;
  setSubCategories: (sub: any[]) => void;
  setCategoryId: (id: number | null) => void;
  setSubCategoryId: (id: number | null) => void;
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
    subCategories: [],
    categoryId: null,
    subCategoryId: null,
    priceRange: [0, 10000],
    priceRangeSelected: [0, 10000],
    sortOption: "0",
    isDataLoaded: false,
    selectedProduct: null,
    selectedProductImage: null,

    setSourcingPlatform: (platform) =>
      set((state) => ({
        sourcingPlatform: platform,
        categoryId: null,
        subCategoryId: null,
        categories: [],
        subCategories: [],
        isDataLoaded: false,
        // Price range y demás se resetearán luego de la carga de datos
      })),
    setCategories: (categories) => set({ categories }),
    setSubCategories: (sub) => set({ subCategories: sub }),
    setCategoryId: (id) => set({ categoryId: id, subCategoryId: null }),
    setSubCategoryId: (id) => set({ subCategoryId: id }),
    setPriceRange: (range) => set({ priceRange: range }),
    setPriceRangeSelected: (range) => set({ priceRangeSelected: range }),
    setSortOption: (option) => set({ sortOption: option }),
    setIsDataLoaded: (loaded) => set({ isDataLoaded: loaded }),
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setSelectedProductImage: (url) => set({ selectedProductImage: url }),
  }));
