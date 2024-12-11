import React from "react";
import { Box, Typography } from "@mui/material";

const UnauthorizedPage: React.FC = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1">
        You do not have permission to access this page.
      </Typography>
    </Box>
  );
};

export default UnauthorizedPage;
