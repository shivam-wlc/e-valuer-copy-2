import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SortControl = ({ sortField, onChange }) => {
  return (
    <Box>
      <FormControl size="small">
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortField}
          onChange={(e) => onChange(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="AuctionDate">Auction Date</MenuItem>
          <MenuItem value="PricePerCarat">Price per Carat</MenuItem>
          <MenuItem value="TotalPrice">Total Price</MenuItem>
          <MenuItem value="Carat">Carat</MenuItem>
          <MenuItem value="Quality">Quality</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortControl;
