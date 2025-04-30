import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  Box,
} from "@mui/material";

const ComparativeTable = ({ tableData }) => {
  console.log("tableData", tableData);
  const theme = useTheme();

  if (!tableData || !tableData.data || tableData.data.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No data available
      </Typography>
    );
  }

  const { periods, data } = tableData;
  // Determine the main column name dynamically
  let mainCol1 = "";
  if (data.length > 0) {
    if (Object.prototype.hasOwnProperty.call(data[0], "Model"))
      mainCol1 = "Model";
    else if (Object.prototype.hasOwnProperty.call(data[0], "Color"))
      mainCol1 = "Color";
    else if (Object.prototype.hasOwnProperty.call(data[0], "Size"))
      mainCol1 = "Size";
    else if (Object.prototype.hasOwnProperty.call(data[0], "Quality"))
      mainCol1 = "Quality";
    else if (Object.prototype.hasOwnProperty.call(data[0], "Label"))
      mainCol1 = "Label";
    else mainCol1 = Object.keys(data[0])[0];
  }
  // const subColumns = [
  //   { key: "Avg Weight", label: "Avg. Weight" },
  //   { key: "Total Weight", label: "Total Weight" },
  //   { key: "$/Carat Avg", label: "$/Carat (Avg)" },
  //   { key: "Valuation", label: "Valuation" },
  // ];

  // Define subColumns based on main column
  const subColumns =
    mainCol1 === "Size"
      ? [
          { key: "Avg Weight", label: "Avg. Weight" },
          { key: "Total Weight", label: "Total Weight" },
          { key: "$/Carat Avg", label: "$/Carat (Avg)" },
          { key: "Valuation", label: "Valuation" },
        ]
      : [
          { key: "Total Weight", label: "Total Weight" },
          { key: "$/Carat Avg", label: "$/Carat (Avg)" },
          { key: "Valuation", label: "Valuation" },
        ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: theme.palette.background.default,
        p: 0,
        m: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableContainer
        component={Paper}
        elevation={4}
        sx={{
          flex: 1,
          height: "100vh", // Ensure full viewport height
          width: "100vw",
          overflow: "auto", // Enable scrolling
          borderRadius: 3,
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
        }}
      >
        <Table size="small" stickyHeader aria-label="comparative table">
          <TableHead>
            <TableRow>
              <TableCell
                rowSpan={2}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  borderRight: `2px solid ${theme.palette.divider}`,
                  boxShadow: "2px 0 8px -4px rgba(0,0,0,0.04)",
                }}
              >
                {mainCol1}
              </TableCell>

              {periods.map((period, idx) => (
                <TableCell
                  key={period}
                  align="center"
                  colSpan={subColumns.length}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.contrastText,
                    borderLeft:
                      idx !== 0
                        ? `2px solid ${theme.palette.divider}`
                        : undefined,
                    borderRight: `2px solid ${theme.palette.divider}`,
                    boxShadow:
                      idx !== 0
                        ? "-2px 0 8px -4px rgba(0,0,0,0.04)"
                        : undefined,
                  }}
                >
                  {period}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {periods.map((period, idx) =>
                subColumns.map((col, subIdx) => (
                  <TableCell
                    key={`${period}-${col.key}`}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: theme.palette.secondary[100],
                      color: theme.palette.text.primary,
                      borderLeft:
                        subIdx === 0
                          ? `2px solid ${theme.palette.divider}`
                          : undefined,
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor:
                    index % 2 === 0
                      ? theme.palette.grey[50]
                      : theme.palette.grey[100],
                  "&:hover": {
                    backgroundColor: theme.palette.action.selected,
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    backgroundColor:
                      index % 2 === 0
                        ? theme.palette.primary[50]
                        : theme.palette.primary[100],
                    color: theme.palette.primary.dark,
                    zIndex: 2,
                    borderRight: `2px solid ${theme.palette.divider}`,
                  }}
                >
                  {row[mainCol1]}
                </TableCell>

                {periods.map((period, idx) =>
                  subColumns.map((col, subIdx) => (
                    <TableCell
                      key={`${index}-${period}-${col.key}`}
                      align="center"
                      sx={{
                        borderLeft:
                          subIdx === 0
                            ? `2px solid ${theme.palette.divider}`
                            : undefined,
                        borderRight:
                          subIdx === subColumns.length - 1
                            ? `2px solid ${theme.palette.divider}`
                            : undefined,
                        fontWeight: col.key === "Valuation" ? 600 : 400,
                        color:
                          col.key === "Valuation"
                            ? theme.palette.success.dark
                            : theme.palette.text.primary,
                        bgcolor:
                          idx % 2 === 0
                            ? theme.palette.grey[50]
                            : theme.palette.grey[100],
                      }}
                    >
                      {col.key === "Valuation"
                        ? row[`${period} (${col.key})`]?.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : row[`${period} (${col.label})`] !== undefined
                        ? row[`${period} (${col.label})`].toFixed(2)
                        : row[`${period} (${col.key})`] !== undefined
                        ? row[`${period} (${col.key})`].toFixed(2)
                        : ""}
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComparativeTable;
