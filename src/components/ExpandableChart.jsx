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
  getQualityDistributionTableData,
  getSizeDistributionTableData,
  getPriceTrendsTableData,
} from "../utility/getTabularData";
import ComparativeTable from "./tables/ComparativeTable";

const ExpandableChart = ({ children, chartData, title }) => {
  const [expanded, setExpanded] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [viewMode, setViewMode] = useState("chart"); // 'chart', 'table', or 'split'
  const containerRef = useRef(null);
  const theme = useTheme();

  // Default dimensions
  const normalDimensions = { width: "100%", height: "500px" };
  const expandedDimensions = { width: "95vw", height: "85vh" };

  const [dimensions, setDimensions] = useState(normalDimensions);

  const handleExpand = () => {
    setExpanded(true);
    setViewMode("chart");
    setDimensions(expandedDimensions);
  };

  const handleClose = () => {
    setExpanded(false);
    setViewMode("chart");
    setDimensions(normalDimensions);
  };

  const toggleTableView = () => {
    // Cycle through view modes: chart -> split -> table -> chart
    setViewMode((prevMode) => {
      if (prevMode === "chart") return "split";
      if (prevMode === "split") return "table";
      return "chart";
    });
  };

  const getTableData = () => {
    if (!chartData) return [];

    switch (title) {
      case "ColorDistributionChart":
        return getSizeColorTableData(chartData);
      case "ModelDistributionChart":
        return getSizeModelTableData(chartData);
      case "SizeDistributionChart":
        return getSizeDistributionTableData(chartData);
      case "QualityDistributionChart":
        return getQualityDistributionTableData(chartData);
      case "CombinedValueChart":
        return getPriceTrendsTableData(chartData);
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
            width: "95vw",
            height: "85vh",
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
              color={viewMode !== "chart" ? "primary" : "default"}
            >
              <MultipleStopRoundedIcon />
            </IconButton>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          {viewMode === "chart" && (
            <Box sx={{ flex: 1 }}>
              {React.cloneElement(children, {
                dimensions: {
                  width: "100%",
                  height: "100%",
                },
              })}
            </Box>
          )}

          {viewMode === "table" && (
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <Typography variant="h5" gutterBottom>
                {title.replace(/([A-Z])/g, " $1").trim()}
              </Typography>
              <Box sx={{ height: "calc(100% - 48px)", overflow: "auto" }}>
                <ComparativeTable tableData={tableData} />
              </Box>
            </Box>
          )}

          {viewMode === "split" && (
            <Box sx={{ flex: 1, display: "flex", gap: 2, overflow: "hidden" }}>
              <Box sx={{ width: "50%", height: "100%" }}>
                {React.cloneElement(children, {
                  dimensions: {
                    width: "100%",
                    height: "100%",
                  },
                })}
              </Box>
              <Box sx={{ width: "50%", height: "100%", overflow: "auto" }}>
                <Typography variant="h5" gutterBottom>
                  {title.replace(/([A-Z])/g, " $1").trim()}
                </Typography>
                <Box sx={{ height: "calc(100% - 48px)", overflow: "auto" }}>
                  <ComparativeTable tableData={tableData} />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ExpandableChart;
