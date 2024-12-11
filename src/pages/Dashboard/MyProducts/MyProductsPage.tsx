import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface MyProduct {
  id: string | number;
  name: string;
  price: number;
  stock?: number;
  // Add additional product fields if needed
}

export const MyProductsPage: React.FC = () => {
  const [myProducts, setMyProducts] = useState<MyProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Implement getMyProducts() or similar
      const data: MyProduct[] = [];
      setMyProducts(data);
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Products
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {myProducts.map((product) => (
          <Paper key={product.id} sx={{ p: 2, width: 200 }}>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2">Price: {product.price}</Typography>
            {product.stock !== undefined && (
              <Typography variant="body2">Stock: {product.stock}</Typography>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
