import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { ExpandOutlined, Close } from "@mui/icons-material";
import MultipleStopRoundedIcon from "@mui/icons-material/MultipleStopRounded";
import {
  getSizeColorTableData,
  getSizeModelTableData,
  // getQualityCompanyTableData,
  getQualityDistributionTableData,
  getSizeDistributionTableData,
  getPriceTrendsTableData,
} from "../utility/getTabularData";

// import DynamicTable from "./tables/DynamicTable";
import ComparativeTable from "./tables/ComparativeTable";

const ExpandableChart = ({ children, chartData, title }) => {
  const [expanded, setExpanded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const containerRef = useRef(null);
  const theme = useTheme();

  // Default dimensions
  const normalDimensions = { width: "100%", height: "500px" };
  const expandedDimensions = { width: "95vw", height: "85vh" };
  const tableModeDimensions = { width: "60%", height: "100%" };

  const [dimensions, setDimensions] = useState(normalDimensions);

  const handleExpand = () => {
    setExpanded(true);
    setShowTable(false);
    setDimensions(expandedDimensions);
  };

  const handleClose = () => {
    setExpanded(false);
    setShowTable(false);
    setDimensions(normalDimensions);
  };

  const toggleTableView = () => {
    const newShowTable = !showTable;
    setShowTable(newShowTable);
    if (expanded) {
      setDimensions(newShowTable ? tableModeDimensions : expandedDimensions);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (expanded && containerRef.current) {
        const width = showTable ? "60%" : "95vw";
        const height = showTable ? "100%" : "85vh";
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded, showTable]);

  const getTableData = () => {
    if (!chartData) return [];

    switch (title) {
      case "ColorDistributionChart":
        return getSizeColorTableData(chartData);
      case "ModelDistributionChart":
        return getSizeModelTableData(chartData);
      case "SizeDistributionChart":
        return getSizeDistributionTableData(chartData);
      case "QualityModelBarChart":
        return getQualityDistributionTableData(chartData);
      case "PriceTrendChart":
        return getPriceTrendsTableData(chartData);
      // case "QualityCompanyChart":
      //   return getQualityCompanyTableData(chartData);

      // Add other cases as needed
      default:
        return chartData;
    }
  };
  const tableData = getTableData();

  return (
    <>
      {/* Normal View */}
      <Paper elevation={3} sx={{ p: 2, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton onClick={handleExpand} size="small">
            <ExpandOutlined fontSize="small" />
          </IconButton>
        </Box>
        <Box
          ref={containerRef}
          sx={{ width: dimensions.width, height: dimensions.height }}
        >
          {React.cloneElement(children, { dimensions })}
        </Box>
      </Paper>

      {/* Expanded View */}
      <Modal open={expanded} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: showTable ? "95vw" : "90vw",
            height: showTable ? "85vh" : "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ textAlign: "right", mt: 1 }}>
            <IconButton
              onClick={toggleTableView}
              sx={{ mr: 1 }}
              color={showTable ? "primary" : "default"}
            >
              <MultipleStopRoundedIcon />
            </IconButton>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              overflow: "hidden",
              gap: 2,
            }}
          >
            {/* Chart Area - smaller when table is shown */}
            <Box
              sx={{
                width: showTable ? "60%" : "100%",
                height: "100%",
                transition: "width 0.3s ease",
                overflow: "auto",
              }}
            >
              {React.cloneElement(children, {
                dimensions: {
                  width: "100%",
                  height: "100%",
                },
              })}
            </Box>

            {/* Table Area - slides in from right */}
            {showTable && (
              <Box
                sx={{
                  mt: 0,
                  height: "100%",
                  maxHeight: "100%",
                  overflow: "auto",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Monthly Comparison
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Compare metrics across different months
                </Typography>
                <Box
                  sx={{ mt: 2, height: "calc(100% - 64px)", overflow: "auto" }}
                >
                  <ComparativeTable tableData={tableData} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ExpandableChart;
