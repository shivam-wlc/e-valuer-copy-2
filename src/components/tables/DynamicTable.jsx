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
} from "@mui/material";

const DynamicTable = ({ tableData, title }) => {
  const theme = useTheme();

  if (!tableData || tableData.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No data available
      </Typography>
    );
  }

  // Get all unique keys from the first row to create headers
  const headers = Object.keys(tableData[0]).filter(
    (key) => key !== "Period" // Exclude Period if it exists
  );

  return (
    <TableContainer component={Paper} elevation={3}>
      {title && (
        <Typography
          variant="h6"
          sx={{
            p: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          {title}
        </Typography>
      )}
      <Table size="small" aria-label="dynamic table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                "&:nth-of-type(odd)": {
                  backgroundColor: theme.palette.action.hover,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.selected,
                  cursor: "pointer",
                },
                transition: "background-color 0.2s",
              }}
            >
              {headers.map((header) => {
                const value = row[header];
                let displayValue = value;

                // Format numbers appropriately
                if (typeof value === "number") {
                  if (header === "Evaluation" || header === "DollarPerCarat") {
                    displayValue = value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  } else if (header === "AverageWeight") {
                    displayValue = value.toFixed(2);
                  } else {
                    displayValue = value.toLocaleString();
                  }
                }

                return (
                  <TableCell
                    key={`${index}-${header}`}
                    sx={{
                      whiteSpace: "nowrap",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
