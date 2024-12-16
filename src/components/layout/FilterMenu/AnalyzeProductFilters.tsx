// src/components/DateRangeFilter/DateRangeFilter.tsx

import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DateRangeOption,
  useDateFilterStore,
} from "../../../store/analyzeProductFilterStore";

const DateRangeFilter: React.FC = () => {
  const { dateRange, setDateRange } = useDateFilterStore();

  const handleDateRangeChange = (range: DateRangeOption) => {
    setDateRange(range);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Date Filter
      </Typography>

      <Typography variant="body1" gutterBottom>
        Time Range
      </Typography>
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Range</InputLabel>
        <Select
          label="Range"
          value={dateRange}
          onChange={(e) =>
            handleDateRangeChange(e.target.value as DateRangeOption)
          }
        >
          <MenuItem value="1week">1 Week</MenuItem>
          <MenuItem value="1month">1 Month</MenuItem>
          <MenuItem value="3months">3 Months</MenuItem>
          <MenuItem value="1year">1 Year</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default DateRangeFilter;
