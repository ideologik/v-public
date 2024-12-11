import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Slider from "@material-ui/core/Slider";
import {
  productFinderCategories,
  productFinderSubCategories,
  productFinderPriceRange,
} from "services";
import { useAtom } from "jotai";
import { bsSelectedCategoryAtom } from "stores/productAtom";

// Función recursiva para eliminar categorías duplicadas
function removeDuplicateCategories(categories, seenIds = new Set()) {
  return categories
    .filter((category) => {
      if (seenIds.has(category.categoryId)) {
        return false; // Excluye categorías duplicadas
      } else {
        seenIds.add(category.categoryId); // Agrega el ID al Set
        return true; // Incluye la categoría
      }
    })
    .map((category) => ({
      ...category,
      subCategories: removeDuplicateCategories(category.subCategories, seenIds), // Limpia subcategorías recursivamente
    }));
}

const ProductsFilter = ({ onFiltersChange }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevelCategories, setThirdLevelCategories] = useState([]);

  const [selectedCategoryState, setSelectedCategoryState] = useAtom(bsSelectedCategoryAtom);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [priceRangeSelected, setPriceRangeSelected] = useState([0, 10000]);
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("0");

  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);

  // Fetch and clean categories on mount
  useEffect(() => {
    const fetchDealsGroups = async () => {
      setIsCategoriesLoaded(false);
      const productGroups = await productFinderCategories();
      const sortedCategories = productGroups.sort((a, b) => a.category.localeCompare(b.category));

      sortedCategories.forEach((cat) => {
        cat.subCategories = cat.subCategories.filter((sub) => sub.category !== "");
        cat.subCategories.forEach((sub) => {
          sub.subCategories = sub.subCategories.filter((sub2) => sub2.category !== "");
        });
      });

      const cleanedCategories = removeDuplicateCategories(sortedCategories);
      setCategories(cleanedCategories);
      setIsCategoriesLoaded(true);

      // Establecer categoría predeterminada y subcategorías si no hay categoría seleccionada
      if (!selectedCategoryState.categoryId) {
        const defaultCategory = cleanedCategories.find((cat) => cat.category === "Toys & Games");
        if (defaultCategory) {
          setSelectedCategoryState({
            categoryId: defaultCategory.categoryId,
            subCategoryId: null,
            thirdLevelCategoryId: null,
          });
          setSubCategories(defaultCategory.subCategories || []);
        }
      } else {
        const currentCategory = cleanedCategories.find(
          (cat) => cat.categoryId === selectedCategoryState.categoryId
        );
        setSubCategories(currentCategory?.subCategories || []);
      }
    };
    const fetchPriceRange = async () => {
      const priceRange = await productFinderPriceRange();
      setPriceRange([priceRange.min, priceRange.max]);
      setPriceRangeSelected([priceRange.min, priceRange.max]);
    };

    fetchDealsGroups();
    fetchPriceRange();
  }, []);

  // Actualizar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (!categories.length) return;

    const currentCategory = categories.find(
      (cat) => cat.categoryId === selectedCategoryState.categoryId
    );
    setSubCategories(currentCategory?.subCategories || []);

    if (!currentCategory || !currentCategory.subCategories?.length) {
      // Solo actualizar si hay cambios para evitar sobrescrituras innecesarias
      if (
        selectedCategoryState.subCategoryId !== null ||
        selectedCategoryState.thirdLevelCategoryId !== null
      ) {
        setSelectedCategoryState((prev) => ({
          ...prev,
          subCategoryId: null,
          thirdLevelCategoryId: null,
        }));
      }
      setThirdLevelCategories([]);
    }
  }, [selectedCategoryState.categoryId, categories]);

  // Actualizar categorías de tercer nivel cuando cambia la subcategoría seleccionada o las subcategorías se cargan
  useEffect(() => {
    const fetchThirdLevelCategories = async (id) => {
      const thirdLevelCategories = await productFinderSubCategories(id);
      return thirdLevelCategories;
    };

    if (!subCategories.length) return; // Esperar a que las subcategorías se carguen

    const currentSubCategory = subCategories.find(
      (sub) => sub.categoryId === selectedCategoryState.subCategoryId
    );
    console.log("currentCategory", currentSubCategory);
    if (currentSubCategory) {
      fetchThirdLevelCategories(currentSubCategory.categoryId).then((thirdLevelCategories) => {
        setThirdLevelCategories(thirdLevelCategories);
      });
    }

    if (!currentSubCategory || !currentSubCategory.subCategories?.length) {
      if (selectedCategoryState.thirdLevelCategoryId !== null) {
        setSelectedCategoryState((prev) => ({
          ...prev,
          thirdLevelCategoryId: null,
        }));
      }
    }
  }, [selectedCategoryState.subCategoryId, subCategories]);

  // Actualizar los filtros cuando cambie cualquier parte del estado seleccionado
  useEffect(() => {
    handleFilterChange();
  }, [selectedCategoryState, isCategoriesLoaded]);

  const handleCategoryChange = (level, value) => {
    setSelectedCategoryState((prev) => {
      if (level === "category") {
        return {
          ...prev,
          categoryId: value,
          subCategoryId: null,
          thirdLevelCategoryId: null,
        };
      }
      if (level === "subCategory") {
        return {
          ...prev,
          subCategoryId: value,
          thirdLevelCategoryId: null,
        };
      }
      if (level === "thirdLevelCategory") {
        return {
          ...prev,
          thirdLevelCategoryId: value,
        };
      }
      return prev;
    });
  };

  const handleFilterChange = () => {
    onFiltersChange({
      searchText,
      AmazonCategoryId: selectedCategoryState.categoryId,
      AmazonSubCategoryId: selectedCategoryState.subCategoryId,
      AmazonThirdCategoryId: selectedCategoryState.thirdLevelCategoryId,
      priceFrom: priceRange[0],
      priceTo: priceRange[1],
      sort_by: sortOption,

      isCategoriesLoaded,
    });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRangeSelected(newValue);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearch = () => {
    onFiltersChange({
      searchText,
      AmazonCategoryId: selectedCategoryState.categoryId,
      AmazonSubCategoryId: selectedCategoryState.subCategoryId,
      priceFrom: priceRangeSelected[0],
      priceTo: priceRangeSelected[1],
      sort_by: sortOption,
    });
  };

  return (
    <MDBox sx={{ padding: 2 }}>
      <Card>
        <CardContent>
          {!isCategoriesLoaded ? (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="46px">
              <CircularProgress size={30} />
            </MDBox>
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
                  <FormControl fullWidth variant="outlined" sx={{ height: "46px" }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      value={selectedCategoryState.categoryId || ""}
                      onChange={(e) => handleCategoryChange("category", e.target.value)}
                      sx={{ height: "46px" }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                          {category.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Subcategory Filter */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ height: "46px" }}>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                      label="Subcategory"
                      value={selectedCategoryState.subCategoryId || "all"}
                      onChange={(e) => handleCategoryChange("subCategory", e.target.value)}
                      sx={{ height: "46px" }}
                    >
                      <MenuItem value="all">All Subcategories</MenuItem>
                      {subCategories.map((subCategory) => (
                        <MenuItem key={subCategory.categoryId} value={subCategory.categoryId}>
                          {subCategory.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Price Range Slider */}
                <Grid item xs={12} md={2}>
                  <Typography id="price-range-slider" variant="body2" color="textSecondary">
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
                  <MDButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ height: "46px" }}
                    onClick={handleSearch}
                  >
                    Search
                  </MDButton>
                </Grid>
              </Grid>

              <Grid container spacing={2} alignItems="center" justifyContent="flex-end" mt={2}>
                {/* Sort Filter */}
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth variant="outlined" sx={{ height: "36px" }}>
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
    </MDBox>
  );
};

ProductsFilter.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ProductsFilter;
