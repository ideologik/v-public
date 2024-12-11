import React from "react";
import { Box, Typography } from "@mui/material";

const NotFoundPage: React.FC = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        404 - Not Found
      </Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
