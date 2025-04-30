// src/utils/chartTableUtils.js

export const getSizeColorTableData = (chartData) => {
  if (!chartData || chartData.length === 0) return { periods: [], data: [] };

  // Get all unique colors
  const allColors = [...new Set(chartData.map((item) => item.Colour))];

  // Group data by month-year
  const dataByPeriod = chartData.reduce((acc, item) => {
    try {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
    } catch (error) {
      console.error("Error processing date:", error);
    }
    return acc;
  }, {});

  // Sort periods chronologically
  const sortedPeriods = Object.keys(dataByPeriod).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Build rows
  const comparativeData = allColors.map((color) => {
    const row = { Color: color };
    sortedPeriods.forEach((period) => {
      const periodItems = dataByPeriod[period].filter(
        (item) => item.Colour === color
      );
      let totalCarats = 0,
        totalPrice = 0,
        totalPricePerCarat = 0;
      if (periodItems.length > 0) {
        totalCarats = periodItems.reduce((sum, d) => sum + (d.Carats || 0), 0);
        totalPrice = periodItems.reduce(
          (sum, d) => sum + (d.TotalPrice || 0),
          0
        );
        totalPricePerCarat = periodItems.reduce(
          (sum, d) => sum + (d.PricePerCarat || 0),
          0
        );
      }
      // row[`${period} (Avg Weight)`] =
      //   periodItems.length > 0 ? totalCarats / periodItems.length : 0;
      row[`${period} (Total Weight)`] = totalCarats;
      row[`${period} ($/Carat Avg)`] =
        periodItems.length > 0 ? totalPricePerCarat / periodItems.length : 0;
      row[`${period} (Valuation)`] = totalPrice;
    });
    return row;
  });

  // Sort by Color
  comparativeData.sort((a, b) => a.Color.localeCompare(b.Color));

  // Build summary row (column totals for each period)
  const summaryRow = { Color: "TOTAL" };
  sortedPeriods.forEach((period) => {
    let totalEval = 0,
      totalDollarPerCarat = 0,
      totalAvgWt = 0,
      totalWeight = 0,
      countRows = 0;
    comparativeData.forEach((row) => {
      totalEval += row[`${period} (Valuation)`];
      totalDollarPerCarat += row[`${period} ($/Carat Avg)`];
      // totalAvgWt += row[`${period} (Avg Weight)`];
      totalWeight += row[`${period} (Total Weight)`];
      if (row[`${period} (Valuation)`] > 0) countRows++;
    });
    // summaryRow[`${period} (Avg Weight)`] =
    //   countRows > 0 ? totalAvgWt / countRows : 0;
    summaryRow[`${period} (Total Weight)`] = totalWeight;
    summaryRow[`${period} ($/Carat Avg)`] =
      countRows > 0 ? totalDollarPerCarat / countRows : 0;
    summaryRow[`${period} (Valuation)`] = totalEval;
  });

  return {
    periods: sortedPeriods,
    data: [...comparativeData, summaryRow],
  };
};

export const getSizeModelTableData = (chartData) => {
  if (!chartData || chartData.length === 0) return { periods: [], data: [] };

  // Get all unique models
  const allModels = [...new Set(chartData.map((item) => item.Model))];

  // Group data by month-year
  const dataByPeriod = chartData.reduce((acc, item) => {
    try {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
    } catch (error) {
      console.error("Error processing date:", error);
    }
    return acc;
  }, {});

  // Sort periods chronologically
  const sortedPeriods = Object.keys(dataByPeriod).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Build rows
  const comparativeData = allModels.map((model) => {
    const row = { Model: model };
    sortedPeriods.forEach((period) => {
      const periodItems = dataByPeriod[period].filter(
        (item) => item.Model === model
      );
      let totalCarats = 0,
        totalPrice = 0,
        totalPricePerCarat = 0;
      if (periodItems.length > 0) {
        totalCarats = periodItems.reduce((sum, d) => sum + (d.Carats || 0), 0);
        totalPrice = periodItems.reduce(
          (sum, d) => sum + (d.TotalPrice || 0),
          0
        );
        totalPricePerCarat = periodItems.reduce(
          (sum, d) => sum + (d.PricePerCarat || 0),
          0
        );
      }
      row[`${period} (Avg Weight)`] =
        periodItems.length > 0 ? totalCarats / periodItems.length : 0;
      row[`${period} (Total Weight)`] = totalCarats;
      row[`${period} ($/Carat Avg)`] =
        periodItems.length > 0 ? totalPricePerCarat / periodItems.length : 0;
      row[`${period} (Valuation)`] = totalPrice;
    });
    return row;
  });

  // Sort by Model
  comparativeData.sort((a, b) => a.Model.localeCompare(b.Model));

  // Build summary row (column totals for each period)
  const summaryRow = { Model: "TOTAL" };
  sortedPeriods.forEach((period) => {
    let totalEval = 0,
      totalDollarPerCarat = 0,
      totalAvgWt = 0,
      totalWeight = 0,
      countRows = 0;
    comparativeData.forEach((row) => {
      totalEval += row[`${period} (Valuation)`];
      totalDollarPerCarat += row[`${period} ($/Carat Avg)`];
      totalAvgWt += row[`${period} (Avg Weight)`];
      totalWeight += row[`${period} (Total Weight)`];
      if (row[`${period} (Valuation)`] > 0) countRows++;
    });
    summaryRow[`${period} (Avg Weight)`] =
      countRows > 0 ? totalAvgWt / countRows : 0;
    summaryRow[`${period} (Total Weight)`] = totalWeight;
    summaryRow[`${period} ($/Carat Avg)`] =
      countRows > 0 ? totalDollarPerCarat / countRows : 0;
    summaryRow[`${period} (Valuation)`] = totalEval;
  });

  return {
    periods: sortedPeriods,
    data: [...comparativeData, summaryRow],
  };
};

export const getSizeDistributionTableData = (chartData) => {
  if (!chartData || chartData.length === 0) return { periods: [], data: [] };

  // Get all unique sizes (use SizeCategory or SizeGroup)
  const allSizes = [
    ...new Set(
      chartData.map((item) => item.SizeCategory || item.SizeGroup || "Unknown")
    ),
  ];

  // Group data by month-year
  const dataByPeriod = chartData.reduce((acc, item) => {
    try {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(item);
    } catch (error) {
      console.error("Error processing date:", error);
    }
    return acc;
  }, {});

  // Sort periods chronologically
  const sortedPeriods = Object.keys(dataByPeriod).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Build rows
  const comparativeData = allSizes.map((size) => {
    const row = { Size: size };
    sortedPeriods.forEach((period) => {
      const periodItems = dataByPeriod[period].filter(
        (item) => (item.SizeCategory || item.SizeGroup || "Unknown") === size
      );
      let totalCarats = 0,
        totalPrice = 0,
        totalPricePerCarat = 0;
      if (periodItems.length > 0) {
        totalCarats = periodItems.reduce((sum, d) => sum + (d.Carats || 0), 0);
        totalPrice = periodItems.reduce(
          (sum, d) => sum + (d.TotalPrice || 0),
          0
        );
        totalPricePerCarat = periodItems.reduce(
          (sum, d) => sum + (d.PricePerCarat || 0),
          0
        );
      }
      row[`${period} (Avg Weight)`] =
        periodItems.length > 0 ? totalCarats / periodItems.length : 0;
      row[`${period} (Total Weight)`] = totalCarats;
      row[`${period} ($/Carat Avg)`] =
        periodItems.length > 0 ? totalPricePerCarat / periodItems.length : 0;
      row[`${period} (Valuation)`] = totalPrice;
    });
    return row;
  });

  // Sort by Size (if numeric)
  comparativeData.sort((a, b) => {
    const aNum = parseFloat(a.Size);
    const bNum = parseFloat(b.Size);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return String(a.Size).localeCompare(String(b.Size));
  });

  // Build summary row
  const summaryRow = { Size: "TOTAL" };
  sortedPeriods.forEach((period) => {
    let totalEval = 0,
      totalDollarPerCarat = 0,
      totalAvgWt = 0,
      totalWeight = 0,
      countRows = 0;
    comparativeData.forEach((row) => {
      totalEval += row[`${period} (Valuation)`];
      totalDollarPerCarat += row[`${period} ($/Carat Avg)`];
      totalAvgWt += row[`${period} (Avg Weight)`];
      totalWeight += row[`${period} (Total Weight)`];
      if (row[`${period} (Valuation)`] > 0) countRows++;
    });
    summaryRow[`${period} (Avg Weight)`] =
      countRows > 0 ? totalAvgWt / countRows : 0;
    summaryRow[`${period} (Total Weight)`] = totalWeight;
    summaryRow[`${period} ($/Carat Avg)`] =
      countRows > 0 ? totalDollarPerCarat / countRows : 0;
    summaryRow[`${period} (Valuation)`] = totalEval;
  });

  return {
    periods: sortedPeriods,
    data: [...comparativeData, summaryRow],
  };
};

export const getQualityDistributionTableData = (chartData) => {
  if (!chartData || chartData.length === 0) return { periods: [], data: [] };

  // Get all unique qualities (sorted numerically)
  const allQualities = [
    ...new Set(chartData.map((item) => Number(item.Quality))),
  ].sort((a, b) => a - b);

  // Group data by month-year
  const dataByPeriod = chartData.reduce((acc, item) => {
    try {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(item);
    } catch (error) {
      console.error("Error processing date:", error);
    }
    return acc;
  }, {});

  // Sort periods chronologically
  const sortedPeriods = Object.keys(dataByPeriod).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Build rows
  const comparativeData = allQualities.map((quality) => {
    const row = { Quality: quality };
    sortedPeriods.forEach((period) => {
      const periodItems = dataByPeriod[period].filter(
        (item) => Number(item.Quality) === quality
      );
      let totalCarats = 0,
        totalPrice = 0,
        totalPricePerCarat = 0;
      if (periodItems.length > 0) {
        totalCarats = periodItems.reduce((sum, d) => sum + (d.Carats || 0), 0);
        totalPrice = periodItems.reduce(
          (sum, d) => sum + (d.TotalPrice || 0),
          0
        );
        totalPricePerCarat = periodItems.reduce(
          (sum, d) => sum + (d.PricePerCarat || 0),
          0
        );
      }
      row[`${period} (Avg Weight)`] =
        periodItems.length > 0 ? totalCarats / periodItems.length : 0;
      row[`${period} (Total Weight)`] = totalCarats;
      row[`${period} ($/Carat Avg)`] =
        periodItems.length > 0 ? totalPricePerCarat / periodItems.length : 0;
      row[`${period} (Valuation)`] = totalPrice;
    });
    return row;
  });

  // Sort by Quality (numeric)
  comparativeData.sort((a, b) => a.Quality - b.Quality);

  // Build summary row
  const summaryRow = { Quality: "TOTAL" };
  sortedPeriods.forEach((period) => {
    let totalEval = 0,
      totalDollarPerCarat = 0,
      totalAvgWt = 0,
      totalWeight = 0,
      countRows = 0;
    comparativeData.forEach((row) => {
      totalEval += row[`${period} (Valuation)`];
      totalDollarPerCarat += row[`${period} ($/Carat Avg)`];
      totalAvgWt += row[`${period} (Avg Weight)`];
      totalWeight += row[`${period} (Total Weight)`];
      if (row[`${period} (Valuation)`] > 0) countRows++;
    });
    summaryRow[`${period} (Avg Weight)`] =
      countRows > 0 ? totalAvgWt / countRows : 0;
    summaryRow[`${period} (Total Weight)`] = totalWeight;
    summaryRow[`${period} ($/Carat Avg)`] =
      countRows > 0 ? totalDollarPerCarat / countRows : 0;
    summaryRow[`${period} (Valuation)`] = totalEval;
  });

  return {
    periods: sortedPeriods,
    data: [...comparativeData, summaryRow],
  };
};

export const getPriceTrendsTableData = (chartData) => {
  if (!chartData || chartData.length === 0) return { periods: [], data: [] };

  // Group data by month-year
  const dataByPeriod = chartData.reduce((acc, item) => {
    try {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(item);
    } catch (error) {
      console.error("Error processing date:", error);
    }
    return acc;
  }, {});

  // Sort periods chronologically
  const sortedPeriods = Object.keys(dataByPeriod).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Build rows: only one row for "Price Comparison"
  const row = { Label: "Price Comparison" };
  sortedPeriods.forEach((period) => {
    const periodItems = dataByPeriod[period];
    let totalCarats = 0,
      totalPrice = 0,
      totalPricePerCarat = 0;
    if (periodItems.length > 0) {
      totalCarats = periodItems.reduce((sum, d) => sum + (d.Carats || 0), 0);
      totalPrice = periodItems.reduce((sum, d) => sum + (d.TotalPrice || 0), 0);
      totalPricePerCarat = periodItems.reduce(
        (sum, d) => sum + (d.PricePerCarat || 0),
        0
      );
    }
    row[`${period} (Avg Weight)`] =
      periodItems.length > 0 ? totalCarats / periodItems.length : 0;
    row[`${period} (Total Weight)`] = totalCarats;
    row[`${period} ($/Carat Avg)`] =
      periodItems.length > 0 ? totalPricePerCarat / periodItems.length : 0;
    row[`${period} (Valuation)`] = totalPrice;
  });

  // Build summary row (totals across all periods)
  const summaryRow = { Label: "TOTAL" };
  sortedPeriods.forEach((period) => {
    summaryRow[`${period} (Avg Weight)`] = row[`${period} (Avg Weight)`];
    summaryRow[`${period} (Total Weight)`] = row[`${period} (Total Weight)`];
    summaryRow[`${period} ($/Carat Avg)`] = row[`${period} ($/Carat Avg)`];
    summaryRow[`${period} (Valuation)`] = row[`${period} (Valuation)`];
  });

  return {
    periods: sortedPeriods,
    data: [row, summaryRow],
  };
};
