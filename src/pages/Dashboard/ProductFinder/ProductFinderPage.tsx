import React, { useEffect, useState } from "react";
import { getProducts } from "../../../api/productService";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ProductFinderProduct } from "../../../types/productFinder";

export const ProductFinderPage: React.FC = () => {
  const [products, setProducts] = useState<ProductFinderProduct[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetch();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Product Finder
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {products.map((product) => (
          <Paper key={product.id as string} sx={{ p: 2, width: 200 }}>
            <Typography variant="h6">{product.name as string}</Typography>
            <Typography variant="body2">
              Precio: {product.price as number}
            </Typography>
            <Typography variant="body2">
              Comprados el mes pasado: {product.soldLastMonth as number}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
