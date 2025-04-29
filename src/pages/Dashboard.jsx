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

import SizeColorChart from "../components/charts/SizeColorChart";
import SizeModelChart from "../components/charts/SizeModelChart";
import QualityModelBarChart from "../components/charts/QualityModelBarChart";
import SizeDistributionChart from "../components/charts/SizeDistributionChart";
import PricePerCaratChart from "../components/charts/PricePerCaratChart";
import TotalValueChart from "../components/charts/TotalValueChart";
import CombinedValueChart from "../components/charts/CombinedValueChart";

import FilterPanel from "../components/filters/FilterPanel";
import DataTableView from "../components/tables/DataTableView";
import ExpandableChart from "../components/ExpandableChart";

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
    parcelName: initialValues.parcelName,
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
      parcelName: initialValues.parcelName,
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

    // Filter by ParcelName first
    // if (filters.parcelName && filters.parcelName.length > 0) {
    //   data = data.filter((d) => filters.parcelName.includes(d.ParcelName));
    // }
    if (filters.company.length > 0) {
      data = data.filter((d) => filters.company.includes(d.Company));
    }
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
    if (filters.sizeCategory.length > 0) {
      data = data.filter((d) => filters.sizeCategory.includes(d.SizeCategory));
    }
    if (filters.parcelName && filters.parcelName.length > 0) {
      data = data.filter((item) => item.ParcelName === filters.parcelName);
    }

    data = data.filter(
      (d) =>
        d.Carats >= filters.caratRange[0] && d.Carats <= filters.caratRange[1]
    );

    const parseDBDate = (str) => {
      if (!str) return null;
      const parts = str.split("/");
      if (parts.length !== 3) return null;
      let month, day, year;
      if (parseInt(parts[0], 10) > 12) {
        [day, month, year] = parts;
      } else {
        [month, day, year] = parts;
      }
      return new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
    };

    if (filters.dateRange.from && filters.dateRange.to) {
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);

      data = data.filter((item) => {
        const auctionDate = parseDBDate(item.AuctionDate);
        return auctionDate && auctionDate >= fromDate && auctionDate <= toDate;
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
                sx={{ minHeight: "auto" }}
              >
                <Tab
                  value="graph"
                  icon={<BarChart fontSize="small" />}
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
                <Tab
                  value="table"
                  icon={<TableChart fontSize="small" />}
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
            <ExpandableChart chartData={filteredData} title="PriceTrendChart">
              <CombinedValueChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>

            <ExpandableChart
              chartData={filteredData}
              title="ColorDistributionChart"
            >
              <SizeColorChart data={filteredData} onClick={handleChartClick} />
            </ExpandableChart>

            <ExpandableChart
              chartData={filteredData}
              title="ModelDistributionChart"
            >
              <SizeModelChart data={filteredData} onClick={handleChartClick} />
            </ExpandableChart>

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
              title="QualityModelBarChart"
            >
              <QualityModelBarChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>

            {/* <ExpandableChart
            // chartData={filteredData}
            // title="QualityModelBarChart"
            >
              <PricePerCaratChart
                data={filteredData}
                onClick={handleChartClick}
              />
            </ExpandableChart>

            <ExpandableChart
            // chartData={filteredData}
            // title="QualityModelBarChart"
            >
              <TotalValueChart data={filteredData} onClick={handleChartClick} />
            </ExpandableChart> */}
          </Box>
        ) : (
          <DataTableView data={filteredData} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
