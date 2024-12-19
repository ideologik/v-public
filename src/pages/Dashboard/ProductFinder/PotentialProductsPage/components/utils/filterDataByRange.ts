export const filterDataByRange = (data: any, range: any) => {
  if (!data || data.length === 0) return [];
  if (range === "all") return data;

  const now = new Date();
  const startDate = new Date();

  switch (range) {
    case "1week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "1month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "3months":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "1year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return data;
  }

  return data.filter((entry: any) => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= now;
  });
};
