import {
  Box,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Typography,
  Checkbox,
  ListItemText,
  MenuItem,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { diamondData } from "../../utility/data";
import { BarChart, TableChart } from "@mui/icons-material";
import { useMemo } from "react";

const getFilterOptions = (data, key) =>
  [...new Set(data.map((item) => item[key]))].sort();

const getUnique = (key) =>
  [...new Set(diamondData.map((item) => item[key]))].sort();

const FilterPanel = ({ filters, onChange, viewMode, setViewMode }) => {
  // Get base data filtered by company (if selected)
  const filteredByCompany = useMemo(() => {
    return filters.company?.length > 0
      ? diamondData.filter((item) => filters.company.includes(item.Company))
      : diamondData;
  }, [filters.company]);

  // Get data filtered by parcel (if selected)
  const filteredByParcel = useMemo(() => {
    let data = filteredByCompany;

    if (filters.parcelName?.length > 0) {
      data = data.filter((item) =>
        filters.parcelName.includes(item.ParcelName)
      );
    }

    // Apply other filters to determine available options
    if (filters.model?.length > 0) {
      data = data.filter((item) => filters.model.includes(item.Model));
    }
    if (filters.quality?.length > 0) {
      data = data.filter((item) => filters.quality.includes(item.Quality));
    }
    if (filters.colour?.length > 0) {
      data = data.filter((item) => filters.colour.includes(item.Colour));
    }
    if (filters.sizeCategory?.length > 0) {
      data = data.filter((item) =>
        filters.sizeCategory.includes(item.SizeCategory)
      );
    }

    return data;
  }, [
    filteredByCompany,
    filters.parcelName,
    filters.model,
    filters.quality,
    filters.colour,
    filters.sizeCategory,
  ]);

  const companies = getUnique("Company");
  const parcelNames = getFilterOptions(filteredByCompany, "ParcelName");
  const models = getUnique("Model");
  const qualities = getUnique("Quality");
  const colours = getUnique("Colour");
  const sizeCategories = getUnique("SizeCategory");

  const handleMultiSelectChange = (key) => (event) => {
    const value = event.target.value;
    onChange({
      ...filters,
      [key]: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCaratChange = (_, newValue) => {
    onChange({ ...filters, caratRange: newValue });
  };

  const clearFilter = (key) => {
    onChange({ ...filters, [key]: [] });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, // Reduced gap for compactness
        width: "100%",
        background: "transparent",
      }}
    >
      {/* Company Filter */}
      <Box sx={{ mb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "#262728",
              letterSpacing: 0.5,
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Company
          </Typography>

          {filters?.company && filters?.company?.length > 0 && (
            <Button
              size="small"
              onClick={() => clearFilter("company")}
              sx={{
                fontSize: "0.6rem",
                color: "#d32f2f",
                textTransform: "none",
                p: 0.5,
                minWidth: "auto",
                "&:hover": { background: "transparent" },
              }}
            >
              Clear
            </Button>
          )}
        </Box>

        {/* <FormControl
          fullWidth
          size="small"
          sx={{
            background: "#f5f7fa",
            borderRadius: 1.5,
            boxShadow: "0 1px 2px 0 rgba(60,72,100,0.05)",
          }}
        >
          <InputLabel sx={{ fontSize: "0.8rem" }}>Company</InputLabel>
          <Select
            multiple
            value={filters.company}
            onChange={(e) => {
              // Reset parcelName and dateRange when company changes
              onChange({
                ...filters,
                company:
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value,
                parcelName: [],
                dateRange: { from: "", to: "" },
              });
            }}
            label="Company"
            renderValue={(selected) => selected.join(", ")}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                  borderRadius: 8,
                  marginTop: 4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              },
            }}
            sx={{
              borderRadius: 1.5,
              "& .MuiSelect-select": {
                py: 1,
                fontSize: "0.8rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {companies.map((option) => (
              <MenuItem key={option} value={option} sx={{ py: 0.5 }}>
                <Checkbox
                  checked={
                    filters.company && filters.company.indexOf(option) > -1
                  }
                  color="primary"
                  size="small"
                  sx={{ p: 0.5 }}
                />
                <ListItemText
                  primary={option}
                  primaryTypographyProps={{ fontSize: "0.8rem" }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <FormControl
          fullWidth
          size="small"
          sx={{ background: "#f5f7fa", borderRadius: 1.5 }}
        >
          <Select
            value={filters.company}
            onChange={(e) => {
              onChange({
                ...filters,
                company: e.target.value,
                parcelName: "", // Reset parcel when company changes
                dateRange: { from: "", to: "" },
              });
            }}
          >
            {companies.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ParcelName Filter: only show if one company is selected */}

      <Box sx={{ mb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "#262728",
              letterSpacing: 0.5,
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Parcel Name
          </Typography>
          {filters?.parcelName && filters?.parcelName?.length > 0 && (
            <Button
              size="small"
              onClick={() => clearFilter("parcelName")}
              sx={{
                fontSize: "0.6rem",
                color: "#d32f2f",
                textTransform: "none",
                p: 0.5,
                minWidth: "auto",
                "&:hover": { background: "transparent" },
              }}
            >
              Clear
            </Button>
          )}
        </Box>
        {/* <FormControl
            fullWidth
            size="small"
            sx={{
              background: "#f5f7fa",
              borderRadius: 1.5,
              boxShadow: "0 1px 2px 0 rgba(60,72,100,0.05)",
            }}
          >
            <InputLabel sx={{ fontSize: "0.8rem" }}>Parcel Name</InputLabel>
            <Select
              multiple
              value={filters.parcelName || []}
              onChange={(e) => {
                // Reset dateRange when parcel changes
                onChange({
                  ...filters,
                  parcelName:
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value,
                  dateRange: { from: "", to: "" },
                });
              }}
              label="Parcel Name"
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    overflowY: "auto",
                    borderRadius: 8,
                    marginTop: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                },
              }}
              sx={{
                borderRadius: 1.5,
                "& .MuiSelect-select": {
                  py: 1,
                  fontSize: "0.8rem",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              {parcelNames.map((option) => (
                <MenuItem key={option} value={option} sx={{ py: 0.5 }}>
                  <Checkbox
                    checked={
                      filters.parcelName &&
                      filters.parcelName.indexOf(option) > -1
                    }
                    color="primary"
                    size="small"
                    sx={{ p: 0.5 }}
                  />
                  <ListItemText
                    primary={option}
                    primaryTypographyProps={{ fontSize: "0.8rem" }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        <FormControl
          fullWidth
          size="small"
          sx={{ background: "#f5f7fa", borderRadius: 1.5 }}
        >
          <Select
            value={filters.parcelName}
            onChange={(e) => {
              onChange({
                ...filters,
                parcelName: e.target.value,
                dateRange: { from: "", to: "" },
              });
            }}
          >
            <MenuItem value="">None</MenuItem>
            {parcelNames.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Date Range: only show if a parcel is selected */}
      {/* {filters?.parcelName?.length > 0 && ( */}
      <Box
        sx={{
          width: "100%",
          background: "#f5f7fa",
          borderRadius: 1.5,
          p: 0.5,
          boxShadow: "0 1px 2px 0 rgba(60,72,100,0.05)",
          mt: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: "#262728",
            letterSpacing: 0.5,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            display: "block",
            mb: 1,
          }}
        >
          Auction Date Range
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Box
            component="input"
            type="date"
            value={filters.dateRange.from}
            onChange={(e) =>
              onChange({
                ...filters,
                dateRange: { ...filters.dateRange, from: e.target.value },
              })
            }
            sx={{
              flex: 1,
              p: "6px 8px",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
              fontSize: "0.8rem",
              color: "#262728",
              "&:focus": {
                outline: "none",
                borderColor: "#1976d2",
                boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
              },
            }}
          />
          <Box
            component="input"
            type="date"
            value={filters.dateRange.to}
            onChange={(e) =>
              onChange({
                ...filters,
                dateRange: { ...filters.dateRange, to: e.target.value },
              })
            }
            sx={{
              flex: 1,
              p: "6px 8px",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
              fontSize: "0.8rem",
              color: "#262728",
              "&:focus": {
                outline: "none",
                borderColor: "#1976d2",
                boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
              },
            }}
          />
        </Box>
      </Box>
      {/* )} */}
      {[
        { key: "model", label: "Model", options: models },
        { key: "quality", label: "Quality", options: qualities },
        { key: "colour", label: "Colour", options: colours },
        {
          key: "sizeCategory",
          label: "Size Category",
          options: sizeCategories,
        },
      ].map(({ key, label, options }) => (
        <Box key={key} sx={{ mb: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5} // Reduced margin
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#262728",
                letterSpacing: 0.5,
                fontSize: "0.75rem",
                textTransform: "uppercase",
              }}
            >
              {label}
            </Typography>
            {filters[key]?.length > 0 && (
              <Button
                size="small"
                onClick={() => clearFilter(key)}
                sx={{
                  fontSize: "0.6rem",
                  color: "#d32f2f",
                  textTransform: "none",
                  p: 0.5,
                  minWidth: "auto",
                  "&:hover": { background: "transparent" },
                }}
              >
                Clear
              </Button>
            )}
          </Box>
          <FormControl
            fullWidth
            size="small"
            sx={{
              background: "#f5f7fa",
              borderRadius: 1.5,
              boxShadow: "0 1px 2px 0 rgba(60,72,100,0.05)",
              "&:hover": {
                boxShadow: "0 2px 4px 0 rgba(60,72,100,0.1)",
              },
            }}
          >
            <InputLabel sx={{ fontSize: "0.8rem" }}>{label}</InputLabel>
            <Select
              multiple
              value={filters[key]}
              onChange={handleMultiSelectChange(key)}
              label={label}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    overflowY: "auto",
                    borderRadius: 8,
                    marginTop: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                },
              }}
              sx={{
                borderRadius: 1.5,
                "& .MuiSelect-select": {
                  py: 1,
                  fontSize: "0.8rem",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    py: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "#e3f2fd",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "#bbdefb",
                    },
                  }}
                >
                  <Checkbox
                    checked={filters[key].indexOf(option) > -1}
                    color="primary"
                    size="small"
                    sx={{ p: 0.5 }}
                  />
                  <ListItemText
                    primary={option}
                    primaryTypographyProps={{ fontSize: "0.8rem" }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}

      {/* Carat Range */}
      <Box
        sx={{
          width: "100%",
          background: "#f5f7fa",
          borderRadius: 1.5,
          p: 0.5,
          boxShadow: "0 1px 2px 0 rgba(60,72,100,0.05)",
          mt: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: "#262728",
            letterSpacing: 0.5,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            display: "block",
            mb: 1,
          }}
        >
          Carat Range
        </Typography>
        <Slider
          sx={{
            width: "90%",
            mx: "auto",
            color: "#1976d2",
            "& .MuiSlider-thumb": {
              width: 14,
              height: 14,
              background: "#fff",
              border: "2px solid #1976d2",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: "0 0 0 6px rgba(25, 118, 210, 0.1)",
              },
            },
            "& .MuiSlider-track": {
              height: 4,
            },
            "& .MuiSlider-rail": {
              height: 4,
              background: "#e3e8f0",
            },
            "& .MuiSlider-valueLabel": {
              fontSize: "0.7rem",
              fontWeight: "normal",
              top: -20,
              backgroundColor: "unset",
              color: "#1976d2",
              "&:before": {
                display: "none",
              },
            },
          }}
          min={0}
          max={10}
          step={0.1}
          value={filters.caratRange}
          onChange={handleCaratChange}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default FilterPanel;
