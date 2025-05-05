// Navbar.jsx
import { AppBar, Box, Button, ButtonGroup, Toolbar } from "@mui/material";
import { BarChart, TableChart } from "@mui/icons-material";

const Navbar = ({ viewMode, setViewMode }) => {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{ zIndex: 1201, backgroundColor: "#fff" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <ButtonGroup variant="contained">
          <Button
            onClick={() => setViewMode("graph")}
            color={viewMode === "graph" ? "primary" : "inherit"}
            startIcon={<BarChart />}
          >
            Graph View
          </Button>
          <Button
            onClick={() => setViewMode("table")}
            color={viewMode === "table" ? "primary" : "inherit"}
            startIcon={<TableChart />}
          >
            Table View
          </Button>
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
