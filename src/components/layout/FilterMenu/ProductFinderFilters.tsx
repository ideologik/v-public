// src/components/layout/FilterMenu/ProductFinderFilters.tsx

import React, { useEffect } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Box,
  Slider,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  RadioProps,
} from "@mui/material";

import {
  getProductFinderCategories,
  getProductFinderSubCategories,
  getProductFinderPriceRange,
} from "../../../api/productFinderService";
import { useProductFinderFilterStore } from "../../../store/productFinderFilterStore";

interface Category {
  categoryId: number;
  category: string;
  subCategories: Category[];
}

function removeDuplicateCategories(
  categories: Category[],
  seenIds: Set<number> = new Set()
): Category[] {
  return categories
    .filter((category) => {
      if (seenIds.has(category.categoryId)) {
        return false;
      } else {
        seenIds.add(category.categoryId);
        return true;
      }
    })
    .map((category) => ({
      ...category,
      subCategories: removeDuplicateCategories(category.subCategories, seenIds),
    }));
}

const ProductFinderFilters: React.FC = () => {
  const {
    categories,
    subCategories,
    categoryId,
    subCategoryId,
    thirdLevelCategoryId,
    priceRange,
    priceRangeSelected,
    searchText,
    sortOption,
    isCategoriesLoaded,
    lastLoadedAt,
    setCategories,
    setSubCategories,
    setThirdLevelCategories,
    setCategoryId,
    setSubCategoryId,
    setThirdLevelCategoryId,
    setPriceRange,
    setPriceRangeSelected,
    setSearchText,
    setSortOption,
    setIsCategoriesLoaded,
    setLastLoadedAt,
  } = useProductFinderFilterStore();

  useEffect(() => {
    if (lastLoadedAt !== null) return;

    const fetchData = async () => {
      setIsCategoriesLoaded(false);
      const productGroups = await getProductFinderCategories();
      const sortedCategories = productGroups.sort((a, b) =>
        a.category.localeCompare(b.category)
      );

      sortedCategories.forEach((cat) => {
        cat.subCategories = cat.subCategories.filter(
          (sub) => sub.category !== ""
        );
        cat.subCategories.forEach((sub) => {
          sub.subCategories = sub.subCategories.filter(
            (sub2) => sub2.category !== ""
          );
        });
      });

      const cleanedCategories = removeDuplicateCategories(sortedCategories);
      setCategories(cleanedCategories);
      setIsCategoriesLoaded(true);

      // Set default category if none selected
      if (!categoryId) {
        const defaultCategory = cleanedCategories.find(
          (cat) => cat.category === "Toys & Games"
        );
        if (defaultCategory) {
          setCategoryId(defaultCategory.categoryId);
          setSubCategoryId(null);
          setThirdLevelCategoryId(null);
          setSubCategories(defaultCategory.subCategories || []);
        }
      } else {
        const currentCategory = cleanedCategories.find(
          (cat) => cat.categoryId === categoryId
        );
        setSubCategories(currentCategory?.subCategories || []);
      }

      // Fetch price range
      const pr = await getProductFinderPriceRange();
      setPriceRange([pr.min, pr.max]);
      setPriceRangeSelected([pr.min, pr.max]);

      setLastLoadedAt(Date.now());
    };

    fetchData();
  }, [
    categoryId,
    setCategories,
    setIsCategoriesLoaded,
    setPriceRange,
    setPriceRangeSelected,
    setSubCategories,
    setCategoryId,
    setSubCategoryId,
    setThirdLevelCategoryId,
    lastLoadedAt,
    setLastLoadedAt,
  ]);

  useEffect(() => {
    if (!categories.length) return;
    const currentCategory = categories.find(
      (cat) => cat.categoryId === categoryId
    );
    setSubCategories(currentCategory?.subCategories || []);

    if (!currentCategory || !currentCategory.subCategories?.length) {
      if (subCategoryId !== null || thirdLevelCategoryId !== null) {
        setSubCategoryId(null);
        setThirdLevelCategoryId(null);
      }
      setThirdLevelCategories([]);
    }
  }, [
    categoryId,
    categories,
    subCategoryId,
    thirdLevelCategoryId,
    setSubCategories,
    setSubCategoryId,
    setThirdLevelCategoryId,
    setThirdLevelCategories,
  ]);

  useEffect(() => {
    const fetchThirdLevelCategories = async (id: number) => {
      const tlCategories = await getProductFinderSubCategories(id);
      return tlCategories;
    };

    if (!subCategories.length) return;
    const currentSubCategory = subCategories.find(
      (sub) => sub.categoryId === subCategoryId
    );

    if (currentSubCategory) {
      fetchThirdLevelCategories(currentSubCategory.categoryId).then(
        (tlCats) => {
          setThirdLevelCategories(tlCats);
        }
      );
    }

    if (!currentSubCategory || !currentSubCategory.subCategories?.length) {
      if (thirdLevelCategoryId !== null) {
        setThirdLevelCategoryId(null);
      }
    }
  }, [
    subCategoryId,
    subCategories,
    setThirdLevelCategories,
    thirdLevelCategoryId,
    setThirdLevelCategoryId,
  ]);

  const handleCategoryChange = (
    level: "category" | "subCategory" | "thirdLevelCategory",
    value: string | number
  ) => {
    // Si el valor es "all", eso representa null
    if (value === "all") {
      value = null as any;
    }

    // Si es número, asigna ese valor directamente
    // Si es null, asigna null
    let val: number | null = null;
    if (typeof value === "number") {
      val = value;
    } else if (value === null) {
      val = null;
    } else {
      // Si no es number ni null, podría ser un string representando un número
      // Si no es "all", asume que es un número en formato string
      val = Number(value);
      if (isNaN(val)) {
        val = null;
      }
    }

    if (level === "category") {
      setCategoryId(val);
      setSubCategoryId(null);
      setThirdLevelCategoryId(null);
    } else if (level === "subCategory") {
      setSubCategoryId(val);
      setThirdLevelCategoryId(null);
    } else if (level === "thirdLevelCategory") {
      setThirdLevelCategoryId(val);
    }
  };

  const handlePriceChange = (_: any, newValue: number[]) => {
    setPriceRangeSelected([newValue[0], newValue[1]]);
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const handleSortOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortOption(event.target.value);
  };

  return (
    <>
      {!isCategoriesLoaded ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="46px"
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            Filter
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={handleSearchTextChange}
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" gutterBottom>
            Category
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Show</InputLabel>
            <Select
              label="Show"
              value={categoryId === null ? "all" : categoryId}
              onChange={(e) => handleCategoryChange("category", e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" gutterBottom>
            Subcategory
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Show</InputLabel>
            <Select
              label="Show"
              value={subCategoryId === null ? "all" : subCategoryId}
              onChange={(e) =>
                handleCategoryChange("subCategory", e.target.value)
              }
            >
              <MenuItem value="all">All Sub-Categories</MenuItem>
              {subCategories.map((subCategory) => (
                <MenuItem
                  key={subCategory.categoryId}
                  value={subCategory.categoryId}
                >
                  {subCategory.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" gutterBottom>
            Price Range
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ fontSize: "0.8rem" }}>
            ${priceRangeSelected[0].toFixed(2)} - $
            {priceRangeSelected[1].toFixed(2)}
          </Typography>
          <Slider
            sx={{ mb: 2 }}
            value={priceRangeSelected}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={priceRange[0]}
            max={priceRange[1]}
          />

          <Typography variant="body1" gutterBottom>
            Sort
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <RadioGroup value={sortOption} onChange={handleSortOptionChange}>
            <FormControlLabel value="0" control={<Radio />} label="Relevance" />
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="Sold Last Month"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="Price Low to High"
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="Price High to Low"
            />
            <FormControlLabel
              value="4"
              control={<Radio />}
              label="Competition High to Low"
            />
          </RadioGroup>
        </Box>
      )}
    </>
  );
};

export default ProductFinderFilters;
