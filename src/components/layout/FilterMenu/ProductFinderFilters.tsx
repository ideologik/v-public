// src/components/layout/FilterMenu/ProductFinderFilters.tsx
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Button,
  Slider,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import {
  getProductFinderCategories,
  getProductFinderSubCategories,
  getProductFinderPriceRange,
} from "../../../api/productFinderService";
import { useProductFinderFilterStore } from "../../../store/productFinderFilterStore";

// Recursive function to remove duplicate categories
function removeDuplicateCategories(categories: any[], seenIds = new Set()) {
  return categories
    .filter((category) => {
      if (seenIds.has(category.categoryId)) {
        return false;
      } else {
        seenIds.add(category.categoryId);
        return true;
      }
    })
    .map((category: any) => ({
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
  } = useProductFinderFilterStore();

  // Fetch and clean categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoaded(false);
      const productGroups = await getProductFinderCategories();
      const sortedCategories = productGroups.sort((a: any, b: any) =>
        a.category.localeCompare(b.category)
      );

      sortedCategories.forEach((cat: any) => {
        cat.subCategories = cat.subCategories.filter(
          (sub: any) => sub.category !== ""
        );
        cat.subCategories.forEach((sub: any) => {
          sub.subCategories = sub.subCategories.filter(
            (sub2: any) => sub2.category !== ""
          );
        });
      });

      const cleanedCategories = removeDuplicateCategories(sortedCategories);
      setCategories(cleanedCategories);
      setIsCategoriesLoaded(true);

      // If no category selected, set a default one
      if (!categoryId) {
        const defaultCategory = cleanedCategories.find(
          (cat: any) => cat.category === "Toys & Games"
        );
        if (defaultCategory) {
          setCategoryId(defaultCategory.categoryId);
          setSubCategoryId(null);
          setThirdLevelCategoryId(null);
          setSubCategories(defaultCategory.subCategories || []);
        }
      } else {
        const currentCategory = cleanedCategories.find(
          (cat: any) => cat.categoryId === categoryId
        );
        setSubCategories(currentCategory?.subCategories || []);
      }
    };

    const fetchPriceRangeData = async () => {
      const pr = await getProductFinderPriceRange();
      setPriceRange([pr.min, pr.max]);
      setPriceRangeSelected([pr.min, pr.max]);
    };

    fetchCategories();
    fetchPriceRangeData();
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
  ]);

  // Update subCategories when categoryId changes
  useEffect(() => {
    if (!categories.length) return;

    const currentCategory = categories.find(
      (cat: any) => cat.categoryId === categoryId
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

  // Update thirdLevelCategories when subCategoryId changes
  useEffect(() => {
    const fetchThirdLevelCategories = async (id: number) => {
      const tlCategories = await getProductFinderSubCategories(id);
      return tlCategories;
    };

    if (!subCategories.length) return;
    const currentSubCategory = subCategories.find(
      (sub: any) => sub.categoryId === subCategoryId
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
    value: any
  ) => {
    if (level === "category") {
      setCategoryId(value || null);
      setSubCategoryId(null);
      setThirdLevelCategoryId(null);
    }
    if (level === "subCategory") {
      setSubCategoryId(value === "all" ? null : value);
      setThirdLevelCategoryId(null);
    }
    if (level === "thirdLevelCategory") {
      setThirdLevelCategoryId(value || null);
    }
  };

  const handlePriceChange = (event: any, newValue: number[]) => {
    setPriceRangeSelected([newValue[0], newValue[1]]);
  };

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOption(event.target.value as string);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Card>
        <CardContent>
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
            <>
              <Grid container spacing={2} alignItems="center">
                {/* Search Field */}
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Search"
                    variant="outlined"
                    sx={{ height: "46px" }}
                    InputProps={{ style: { height: "46px" } }}
                    value={searchText}
                    onChange={handleSearchTextChange}
                  />
                </Grid>

                {/* Category Filter */}
                <Grid item xs={12} md={3}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ height: "46px" }}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      value={categoryId || ""}
                      onChange={(e) =>
                        handleCategoryChange("category", e.target.value)
                      }
                      sx={{ height: "46px" }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category: any) => (
                        <MenuItem
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Subcategory Filter */}
                <Grid item xs={12} md={3}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ height: "46px" }}
                  >
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      label="Subcategory"
                      value={subCategoryId || "all"}
                      onChange={(e) =>
                        handleCategoryChange("subCategory", e.target.value)
                      }
                      sx={{ height: "46px" }}
                    >
                      <MenuItem value="all">All Subcategories</MenuItem>
                      {subCategories.map((subCategory: any) => (
                        <MenuItem
                          key={subCategory.categoryId}
                          value={subCategory.categoryId}
                        >
                          {subCategory.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Price Range Slider */}
                <Grid item xs={12} md={2}>
                  <Typography
                    id="price-range-slider"
                    variant="body2"
                    color="textSecondary"
                  >
                    Price Range: ${priceRangeSelected[0].toFixed(2)} - $
                    {priceRangeSelected[1].toFixed(2)}
                  </Typography>
                  <Slider
                    value={priceRangeSelected}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={priceRange[0]}
                    max={priceRange[1]}
                  />
                </Grid>

                {/* Search Button */}
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ height: "46px" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-end"
                mt={2}
              >
                {/* Sort Filter */}
                <Grid item xs={12} md={2}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ height: "36px" }}
                  >
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      label="Sort by"
                      value={sortOption}
                      onChange={handleSortChange}
                      sx={{ height: "36px" }}
                    >
                      <MenuItem value="0">Relevance</MenuItem>
                      <MenuItem value="1">Best Selling</MenuItem>
                      <MenuItem value="2">Price: Low to High</MenuItem>
                      <MenuItem value="3">Price: High to Low</MenuItem>
                      <MenuItem value="4">Rating: High to Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductFinderFilters;
