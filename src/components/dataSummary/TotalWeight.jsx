import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const TotalWeight = ({ data }) => {
  const theme = useTheme();
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});

  // Toggle expansion for a specific year
  const toggleYearExpansion = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  // Toggle expansion for a specific month
  const toggleMonthExpansion = (monthKey) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthKey]: !prev[monthKey],
    }));
  };

  // Calculate summaries by year, month, and size category
  const summaryData = useMemo(() => {
    if (!data || data.length === 0)
      return { years: {}, months: {}, sizeCategories: {} };

    const yearSummary = {};
    const monthSummary = {};
    const sizeCategorySummary = {};

    data.forEach((item) => {
      try {
        // Get date parts from DD/MM/YYYY format
        const [day, month, year] = item.AuctionDate.split("/");
        const numYear = parseInt(year);
        const monthKey = `${month}-${year}`; // Key for month-year pairs
        const sizeCategory = item.SizeCategory || "Uncategorized";
        const sizeCategoryMonthKey = `${monthKey}-${sizeCategory}`;

        // Initialize year object if it doesn't exist
        if (!yearSummary[numYear]) {
          yearSummary[numYear] = {
            weight: 0,
            totalValue: 0,
          };
        }

        // Initialize month object if it doesn't exist
        if (!monthSummary[monthKey]) {
          monthSummary[monthKey] = {
            month,
            year: numYear,
            weight: 0,
            totalValue: 0,
          };
        }

        // Initialize size category for month object if it doesn't exist
        if (!sizeCategorySummary[sizeCategoryMonthKey]) {
          sizeCategorySummary[sizeCategoryMonthKey] = {
            monthKey,
            sizeCategory,
            weight: 0,
            totalValue: 0,
          };
        }

        // Add to year totals
        yearSummary[numYear].weight += item.Carats || 0;
        yearSummary[numYear].totalValue += item.TotalPrice || 0;

        // Add to month totals
        monthSummary[monthKey].weight += item.Carats || 0;
        monthSummary[monthKey].totalValue += item.TotalPrice || 0;

        // Add to size category totals for the month
        sizeCategorySummary[sizeCategoryMonthKey].weight += item.Carats || 0;
        sizeCategorySummary[sizeCategoryMonthKey].totalValue +=
          item.TotalPrice || 0;
      } catch (error) {
        console.error("Error processing date:", error);
      }
    });

    // Calculate dollar per carat for each year
    Object.keys(yearSummary).forEach((year) => {
      yearSummary[year].dollarPerCarat =
        yearSummary[year].weight > 0
          ? yearSummary[year].totalValue / yearSummary[year].weight
          : 0;
    });

    // Calculate dollar per carat for each month
    Object.keys(monthSummary).forEach((monthKey) => {
      monthSummary[monthKey].dollarPerCarat =
        monthSummary[monthKey].weight > 0
          ? monthSummary[monthKey].totalValue / monthSummary[monthKey].weight
          : 0;
    });

    // Calculate dollar per carat for each size category within month
    Object.keys(sizeCategorySummary).forEach((key) => {
      sizeCategorySummary[key].dollarPerCarat =
        sizeCategorySummary[key].weight > 0
          ? sizeCategorySummary[key].totalValue /
            sizeCategorySummary[key].weight
          : 0;
    });

    return {
      years: yearSummary,
      months: monthSummary,
      sizeCategories: sizeCategorySummary,
    };
  }, [data]);

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(summaryData.years)
      .map((year) => parseInt(year))
      .sort((a, b) => b - a);
  }, [summaryData]);

  // Format number with commas and fixed decimal places
  const formatNumber = (number, decimals = 2) => {
    return (
      number?.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) || "0.00"
    );
  };

  // Get months for a specific year, sorted chronologically
  const getMonthsForYear = (year) => {
    return Object.values(summaryData.months)
      .filter((monthData) => monthData.year === parseInt(year))
      .sort((a, b) => parseInt(a.month) - parseInt(b.month));
  };

  // Get size categories for a specific month, sorted by weight
  const getSizeCategoriesForMonth = (monthKey) => {
    return Object.values(summaryData.sizeCategories)
      .filter((sizeData) => sizeData.monthKey === monthKey)
      .sort((a, b) => b.weight - a.weight);
  };

  // Convert month number to month name
  const getMonthName = (monthNum) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[parseInt(monthNum) - 1] || `Month ${monthNum}`;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        background: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: theme.palette.primary.main,
        }}
      >
        Auction summary
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Sum of Weight
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                $/Carat
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Total Value
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedYears.map((year) => (
              <React.Fragment key={year}>
                <TableRow
                  hover
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>{year}</TableCell>
                  <TableCell align="right">
                    {formatNumber(summaryData.years[year].weight)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(summaryData.years[year].dollarPerCarat)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(summaryData.years[year].totalValue)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => toggleYearExpansion(year)}
                    >
                      {expandedYears[year] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Expanded monthly data */}
                {expandedYears[year] &&
                  getMonthsForYear(year).map((monthData) => (
                    <React.Fragment key={`${year}-${monthData.month}`}>
                      <TableRow
                        hover
                        sx={{
                          cursor: "pointer",
                          backgroundColor: theme.palette.background.default,
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                        onClick={() =>
                          toggleMonthExpansion(`${monthData.month}-${year}`)
                        }
                      >
                        <TableCell sx={{ pl: 4 }}>
                          {getMonthName(monthData.month)}
                          {expandedMonths[`${monthData.month}-${year}`] ? (
                            <ExpandLessIcon
                              fontSize="small"
                              sx={{ ml: 1, verticalAlign: "middle" }}
                            />
                          ) : (
                            <ExpandMoreIcon
                              fontSize="small"
                              sx={{ ml: 1, verticalAlign: "middle" }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(monthData.weight)}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(monthData.dollarPerCarat)}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(monthData.totalValue)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      {/* Expanded size category data for month */}
                      {expandedMonths[`${monthData.month}-${year}`] &&
                        getSizeCategoriesForMonth(
                          `${monthData.month}-${year}`
                        ).map((sizeData) => (
                          <TableRow
                            key={`${monthData.month}-${year}-${sizeData.sizeCategory}`}
                          >
                            <TableCell sx={{ pl: 8 }}>
                              {sizeData.sizeCategory}
                            </TableCell>
                            <TableCell align="right">
                              {formatNumber(sizeData.weight)}
                            </TableCell>
                            <TableCell align="right">
                              {formatNumber(sizeData.dollarPerCarat)}
                            </TableCell>
                            <TableCell align="right">
                              {formatNumber(sizeData.totalValue)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}

            {/* Total row */}
            {sortedYears.length > 0 && (
              <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatNumber(
                    sortedYears.reduce(
                      (acc, year) => acc + summaryData.years[year].weight,
                      0
                    )
                  )}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatNumber(
                    sortedYears.reduce(
                      (acc, year) => acc + summaryData.years[year].totalValue,
                      0
                    ) /
                      sortedYears.reduce(
                        (acc, year) => acc + summaryData.years[year].weight,
                        0
                      )
                  )}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatNumber(
                    sortedYears.reduce(
                      (acc, year) => acc + summaryData.years[year].totalValue,
                      0
                    )
                  )}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}

            {/* Empty state */}
            {sortedYears.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 2 }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TotalWeight;
