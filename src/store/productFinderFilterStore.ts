import { create } from "zustand";

interface ProductFinderFilterState {
  categories: any[];
  subCategories: any[];
  thirdLevelCategories: any[];
  categoryId: number | null;
  subCategoryId: number | null;
  thirdLevelCategoryId: number | null;
  priceRange: [number, number];
  priceRangeSelected: [number, number];
  searchText: string;
  sortOption: string;
  isCategoriesLoaded: boolean;

  setCategories: (categories: any[]) => void;
  setSubCategories: (sub: any[]) => void;
  setThirdLevelCategories: (third: any[]) => void;
  setCategoryId: (id: number | null) => void;
  setSubCategoryId: (id: number | null) => void;
  setThirdLevelCategoryId: (id: number | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setPriceRangeSelected: (range: [number, number]) => void;
  setSearchText: (text: string) => void;
  setSortOption: (option: string) => void;
  setIsCategoriesLoaded: (loaded: boolean) => void;
}

export const useProductFinderFilterStore = create<ProductFinderFilterState>(
  (set) => ({
    categories: [],
    subCategories: [],
    thirdLevelCategories: [],
    categoryId: null,
    subCategoryId: null,
    thirdLevelCategoryId: null,
    priceRange: [0, 10000],
    priceRangeSelected: [0, 10000],
    searchText: "",
    sortOption: "0",
    isCategoriesLoaded: false,

    setCategories: (categories) => set({ categories }),
    setSubCategories: (sub) => set({ subCategories: sub }),
    setThirdLevelCategories: (third) => set({ thirdLevelCategories: third }),
    setCategoryId: (id) => set({ categoryId: id }),
    setSubCategoryId: (id) => set({ subCategoryId: id }),
    setThirdLevelCategoryId: (id) => set({ thirdLevelCategoryId: id }),
    setPriceRange: (range) => set({ priceRange: range }),
    setPriceRangeSelected: (range) => set({ priceRangeSelected: range }),
    setSearchText: (text) => set({ searchText: text }),
    setSortOption: (option) => set({ sortOption: option }),
    setIsCategoriesLoaded: (loaded) => set({ isCategoriesLoaded: loaded }),
  })
);
