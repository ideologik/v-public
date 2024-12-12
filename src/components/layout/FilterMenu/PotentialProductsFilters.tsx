// src/components/layout/FilterMenu/PotentialProductsFilters.tsx

import React from "react";
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
} from "@mui/material";
import { usePotentialProductsFilterStore } from "../../../store/potentialProductsFilterStore";

const PotentialProductsFilters: React.FC = () => {
  const {
    sourcingPlatform,
    categories,
    subCategories,
    categoryId,
    subCategoryId,
    priceRange,
    priceRangeSelected,

    sortOption,
    isDataLoaded,
    setSourcingPlatform,
    setCategoryId,
    setSubCategoryId,
    setPriceRangeSelected,

    setSortOption,
  } = usePotentialProductsFilterStore();

  const handleSourcingPlatformChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = e.target.value as "all" | "aliexpress" | "cj";
    setSourcingPlatform(value); // Esto disparará en la página la recarga de datos
  };

  const handleCategoryChange = (value: string | number) => {
    if (value === "all") {
      setCategoryId(null);
    } else {
      const val = typeof value === "number" ? value : Number(value);
      setCategoryId(isNaN(val) ? null : val);
    }
  };

  const handleSubCategoryChange = (value: string | number) => {
    if (value === "all") {
      setSubCategoryId(null);
    } else {
      const val = typeof value === "number" ? value : Number(value);
      setSubCategoryId(isNaN(val) ? null : val);
    }
  };

  const handlePriceChange = (event: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRangeSelected([value[0], value[1]]);
    }
  };

  const handleSortOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortOption(event.target.value);
  };

  return (
    <>
      {!isDataLoaded ? (
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

          {/* Sourcing Platform */}
          <Typography variant="body1" gutterBottom>
            Sourcing Platform
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Show</InputLabel>
            <Select
              label="Show"
              value={sourcingPlatform}
              onChange={handleSourcingPlatformChange}
            >
              <MenuItem value="all">All Platforms</MenuItem>
              <MenuItem value="aliexpress">AliExpress</MenuItem>
              <MenuItem value="cj">CJDropshipping</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body1" gutterBottom>
            Category
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Show</InputLabel>
            <Select
              label="Show"
              value={categoryId === null ? "all" : categoryId}
              onChange={(e) =>
                handleCategoryChange(e.target.value as string | number)
              }
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat: any) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.category}
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
                handleSubCategoryChange(e.target.value as string | number)
              }
            >
              <MenuItem value="all">All Sub-Categories</MenuItem>
              {subCategories.map((sub: any) => (
                <MenuItem key={sub.categoryId} value={sub.categoryId}>
                  {sub.category}
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

export default PotentialProductsFilters;
