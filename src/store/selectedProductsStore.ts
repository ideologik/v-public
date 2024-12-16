import { create } from "zustand";
import { BestsellerProduct } from "../types/productFinder";
import { UnifiedProduct } from "../types/potentialProduct";

interface SelectedProductsState {
  selectedProduct: BestsellerProduct | null;
  selectedProductImage: string | null;
  selectedProductForAnalysys: UnifiedProduct | null;

  setSelectedProduct: (product: BestsellerProduct | null) => void;
  setSelectedProductImage: (url: string | null) => void;
  setSelectedProductForAnalysys: (product: UnifiedProduct | null) => void;
}

export const useSelectedProductsStore = create<SelectedProductsState>(
  (set) => ({
    selectedProduct: null,
    selectedProductImage: null,
    selectedProductForAnalysys: null,

    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setSelectedProductImage: (url) => set({ selectedProductImage: url }),
    setSelectedProductForAnalysys: (product) =>
      set({ selectedProductForAnalysys: product }),
  })
);
