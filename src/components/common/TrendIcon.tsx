import {
  ArrowUpward,
  ArrowDownward,
  HorizontalRule,
} from "@mui/icons-material";
import { Box } from "@mui/material";

interface TrendIconProps {
  current: number;
  average: number;
}

const getTrendIcon = (current: number, average: number) => {
  if (current > average) return <ArrowUpward style={{ color: "green" }} />;
  if (current < average) return <ArrowDownward style={{ color: "red" }} />;
  return <HorizontalRule style={{ color: "gray" }} />;
};

export const TrendIcon: React.FC<TrendIconProps> = ({ current, average }) => {
  return (
    <Box component="span" sx={{ verticalAlign: "middle" }}>
      {getTrendIcon(current, average)}
    </Box>
  );
};
