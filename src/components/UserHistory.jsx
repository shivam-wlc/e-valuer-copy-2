import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  CompareArrows as CompareIcon,
} from "@mui/icons-material";
import { diamondData } from "../utility/data";
import HistoryCard from "./userHistory/HistoryCard";
import DatabaseCard from "./userHistory/DatabaseCard";
import ComparisonView from "./userHistory/ComparisonView";
import CompareDialog from "./userHistory/CompareDialog";

// Sample history data
const sampleHistory = [
  {
    id: 1,
    Company: "Burgundy Diamonds",
    ParcelName: "4-8 Gr Z High 0 White",
    AuctionDate: "08/01/2025",
    LotNumber: "Lot 50",
    SizeGroup: "8gr",
    SizeCategory: "8gr",
    Model: "Crystals High",
    Quality: 1,
    Colour: "GH",
    StoneCount: 10,
    PricePerCarat: 938.67,
    Carats: 21.09,
    TotalPrice: 19800.52,
  },
  {
    id: 2,
    Company: "Burgundy Diamonds",
    ParcelName: "4-8 Gr Z High 0 White",
    AuctionDate: "08/01/2025",
    LotNumber: "Lot 50",
    SizeGroup: "8gr",
    SizeCategory: "8gr",
    Model: "Z High",
    Quality: 1,
    Colour: "GH",
    StoneCount: 11,
    PricePerCarat: 754.51,
    Carats: 23.99,
    TotalPrice: 18103.27,
  },
];

// Utility functions
const getItemKey = (item) => {
  const keys = Object.keys(item).sort();
  return keys.map((k) => `${k}:${JSON.stringify(item[k])}`).join("|");
};

const removeDuplicates = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    const key = getItemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const UserHistory = () => {
  const [uniqueComparisonData] = useState(() =>
    removeDuplicates([...sampleHistory, ...diamondData])
  );
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [selectedDb, setSelectedDb] = useState([]);
  const [searchHistory, setSearchHistory] = useState("");
  const [searchDb, setSearchDb] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Filter functions
  const filteredHistory = sampleHistory.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchHistory.toLowerCase())
    )
  );

  const filteredDb = diamondData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchDb.toLowerCase())
    )
  );

  const toggleHistorySelection = (item) => {
    const key = getItemKey(item);
    setSelectedHistory((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleDbSelection = (item) => {
    const key = getItemKey(item);
    setSelectedDb((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCompare = () => {
    if (selectedHistory.length === 0 || selectedDb.length === 0) return;
    setShowComparison(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const prepareChartData = () => {
    const historyItems = sampleHistory.filter((item) =>
      selectedHistory.includes(getItemKey(item))
    );
    const dbItems = diamondData.filter((item) =>
      selectedDb.includes(getItemKey(item))
    );

    return [
      ...historyItems.map((item) => ({
        name: `H-${item.ParcelName || getItemKey(item)}`,
        PricePerCarat: item.PricePerCarat,
        TotalPrice: item.TotalPrice,
        type: "History",
      })),
      ...dbItems.map((item) => ({
        name: `DB-${item.ParcelName || getItemKey(item)}`,
        PricePerCarat: item.PricePerCarat,
        TotalPrice: item.TotalPrice,
        type: "Database",
      })),
    ];
  };

  if (showComparison) {
    const chartData = prepareChartData();
    const historyItems = sampleHistory.filter((item) =>
      selectedHistory.includes(getItemKey(item))
    );
    const dbItems = diamondData.filter((item) =>
      selectedDb.includes(getItemKey(item))
    );

    return (
      <ComparisonView
        historyItems={historyItems}
        dbItems={dbItems}
        chartData={chartData}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        onBack={() => setShowComparison(false)}
        onNewComparison={() => {
          setSelectedHistory([]);
          setSelectedDb([]);
          setShowComparison(false);
          setCompareMode(true);
        }}
      />
    );
  }

  if (compareMode) {
    return (
      <CompareDialog
        open={true}
        onClose={() => setCompareMode(false)}
        title="Compare Diamonds"
        onCompare={handleCompare}
        disabled={selectedHistory.length === 0 || selectedDb.length === 0}
      >
        <Grid container spacing={3}>
          {/* History Selection Panel */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Your Purchase History
            </Typography>
            <TextField
              fullWidth
              placeholder="Search history..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <Paper sx={{ height: 400, overflow: "auto", p: 1 }}>
              {filteredHistory.map((item) => (
                <HistoryCard
                  key={getItemKey(item)}
                  item={item}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  selected={selectedHistory.includes(getItemKey(item))}
                  onSelect={() => toggleHistorySelection(item)}
                />
              ))}
            </Paper>
          </Grid>

          {/* Database Selection Panel */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              Diamond Database
            </Typography>
            <TextField
              fullWidth
              placeholder="Search database..."
              value={searchDb}
              onChange={(e) => setSearchDb(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            <Paper sx={{ height: 400, overflow: "auto", p: 1 }}>
              {filteredDb.slice(0, 50).map((item) => (
                <DatabaseCard
                  key={getItemKey(item)}
                  item={item}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  selected={selectedDb.includes(getItemKey(item))}
                  onSelect={() => toggleDbSelection(item)}
                />
              ))}
            </Paper>
          </Grid>
        </Grid>
      </CompareDialog>
    );
  }

  // Main History View
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: "#1a237e",
          borderBottom: "3px solid #1976d2",
          pb: 2,
          display: "inline-block",
        }}
      >
        Purchase History
      </Typography>

      <Grid container spacing={3}>
        {sampleHistory.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <HistoryCard
              item={item}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onCompare={() => {
                setSelectedHistory([getItemKey(item)]);
                setCompareMode(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          startIcon={<CompareIcon />}
          onClick={() => setCompareMode(true)}
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1.1rem",
            boxShadow: 3,
          }}
        >
          Compare Multiple Items
        </Button>
      </Box> */}
    </Box>
  );
};

export default UserHistory;
