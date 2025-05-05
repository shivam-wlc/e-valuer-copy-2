import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  FilterList,
  AutoGraph,
  TableChart,
  BarChart,
} from "@mui/icons-material";

import { diamondData } from "../utility/data";

import SizeDistributionChart from "../components/charts/SizeDistributionChart";
import ColorDistributionChart from "../components/charts/ColorDistributionChart";
import ModelDistributionChart from "../components/charts/ModelDistributionChart";
import QualityDistributionChart from "../components/charts/QualityDistributionChart";
import CombinedValueChart from "../components/charts/CombinedValueChart";

import FilterPanel from "../components/filters/FilterPanel";
import DataTableView from "../components/tables/DataTableView";
import ExpandableChart from "../components/ExpandableChart";
import QualityModelBarChart from "../components/charts/QualityDistributionChart";
import QualityModelBarChartNew from "../components/charts/QualityDistributionChartNew";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("graph");

  const initialValues = useMemo(() => {
    const companies = [...new Set(diamondData.map((item) => item.Company))];
    const parcels = [...new Set(diamondData.map((item) => item.ParcelName))];
    return {
      company: companies.length > 0 ? companies[0] : "",
      parcelName: parcels.length > 0 ? parcels[0] : "",
    };
  }, []);

  const [filters, setFilters] = useState({
    company: initialValues.company,
    // parcelName: initialValues.parcelName,
    parcelName: "",
    model: [],
    quality: [],
    colour: [],
    sizeCategory: [],
    caratRange: [0, 10],
    dateRange: { from: "", to: "" },
  });

  const resetFilters = () => {
    setFilters({
      company: initialValues.company,
      // parcelName: initialValues.parcelName,
      parcelName: "",
      model: [],
      quality: [],
      colour: [],
      sizeCategory: [],
      caratRange: [0, 10],
      dateRange: { from: "", to: "" },
    });
  };

  const filteredData = useMemo(() => {
    let data = [...diamondData];

    // Filter by company
    if (filters.company.length > 0) {
      data = data.filter((d) => filters.company.includes(d.Company));
    }

    // Filter by other fields
    if (filters.model.length > 0) {
      data = data.filter((d) => filters.model.includes(d.Model));
    }
    if (filters.quality.length > 0) {
      data = data.filter((d) => filters.quality.includes(d.Quality));
    }
    if (filters.colour.length > 0) {
      data = data.filter((d) => filters.colour.includes(d.Colour));
    }
    if (filters.sizeCategory.length > 0) {
      data = data.filter((d) => filters.sizeCategory.includes(d.SizeCategory));
    }
    if (filters.parcelName && filters.parcelName.length > 0) {
      data = data.filter((item) => item.ParcelName === filters.parcelName);
    }

    // Filter by carat range
    data = data.filter(
      (d) =>
        d.Carats >= filters.caratRange[0] && d.Carats <= filters.caratRange[1]
    );

    // Filter by date range (DD/MM/YYYY format)
    if (filters.dateRange.from && filters.dateRange.to) {
      // Parse the input dates (YYYY-MM-DD format from date inputs)
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);

      // Adjust toDate to include the entire end day
      toDate.setHours(23, 59, 59, 999);

      data = data.filter((item) => {
        if (!item.AuctionDate) return false;

        // Parse the DD/MM/YYYY date string
        const [day, month, year] = item.AuctionDate.split("/");
        const auctionDate = new Date(`${year}-${month}-${day}`);

        // Check if date is valid
        if (isNaN(auctionDate.getTime())) return false;

        return auctionDate >= fromDate && auctionDate <= toDate;
      });
    }

    return data;
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some(
    (filter) =>
      (Array.isArray(filter) && filter.length > 0) ||
      (!Array.isArray(filter) && filter !== "" && filter !== null)
  );

  const handleChartClick = (filterUpdate = {}) => {
    setFilters((prev) => ({
      ...prev,
      ...Object.entries(filterUpdate).reduce((acc, [key, value]) => {
        acc[key] = [value];
        return acc;
      }, {}),
    }));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 3, p: 2 }}>
        <Paper
          elevation={3}
          sx={{
            width: 280,
            p: 2,
            borderRadius: 3,
            height: "fit-content",
            position: "sticky",
            top: 20,
          }}
        >
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  <IconButton>
                    <FilterList color="primary" />
                  </IconButton>
                  Filters
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1,
                bgcolor: "#f5f7fa",
                borderRadius: 2,
                p: 0.5,
                boxShadow: "0 1px 4px 0 rgba(60,72,100,0.06)",
              }}
            >
              <Tabs
                value={viewMode}
                onChange={(_, newValue) => setViewMode(newValue)}
                sx={{
                  minHeight: "auto",
                }}
              >
                <Tab
                  value="graph"
                  icon={<BarChart fontSize="small" />}
                  label="Graph"
                  sx={{
                    minWidth: "auto",
                    minHeight: "auto",
                    p: 1,
                    mr: 10,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                    },
                  }}
                />
                <Tab
                  value="table"
                  icon={<TableChart fontSize="small" />}
                  label="Table"
                  sx={{
                    minWidth: "auto",
                    minHeight: "auto",
                    p: 1,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                    },
                  }}
                />
              </Tabs>
            </Box>

            <FilterPanel filters={filters} onChange={setFilters} />
          </Box>
          <Box
            sx={{
              mt: 2,
              width: "100%",
              textAlign: "center",
            }}
          >
            {hasActiveFilters && (
              <Button
                variant="contained"
                size="small"
                onClick={resetFilters}
                sx={{ mb: 1, width: "100%", p: 1 }}
              >
                <AutoGraph sx={{ mr: 1 }} /> Reset
              </Button>
            )}
          </Box>
        </Paper>

        {viewMode === "graph" ? (
          <Box
            sx={{
              flex: 1,
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <ExpandableChart
              chartData={filteredData}
              title="SizeDistributionChart"
            >
              <SizeDistributionChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>

            <ExpandableChart
              chartData={filteredData}
              title="ColorDistributionChart"
            >
              <ColorDistributionChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>

            <ExpandableChart
              chartData={filteredData}
              title="ModelDistributionChart"
            >
              <ModelDistributionChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>

            <ExpandableChart
              chartData={filteredData}
              title="QualityDistributionChart"
            >
              <QualityDistributionChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>

            <ExpandableChart
              chartData={filteredData}
              title="CombinedValueChart"
            >
              <CombinedValueChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>
            <ExpandableChart
              chartData={filteredData}
              title="CombinedValueChart"
            >
              <QualityModelBarChartNew
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>
          </Box>
        ) : (
          <DataTableView data={filteredData} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
