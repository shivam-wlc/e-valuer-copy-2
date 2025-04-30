// import React, { useState } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TextField,
//   InputAdornment,
//   Typography,
//   Button,
//   useTheme,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Divider,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// const DataTableView = ({ data }) => {
//   const transformedData = {};

//   data?.forEach((item) => {
//     const company = item.Company;
//     const parcel = item.ParcelName;

//     if (!transformedData[company]) {
//       transformedData[company] = {};
//     }

//     if (!transformedData[company][parcel]) {
//       transformedData[company][parcel] = [];
//     }

//     transformedData[company][parcel].push(item);
//   });

//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(20);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [searched, setSearched] = useState(false);

//   const filteredData = React.useMemo(() => {
//     if (!searched || !searchTerm.trim()) return data;
//     return data.filter((row) =>
//       Object.values(row).some((value) =>
//         String(value).toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [data, searchTerm, searched]);

//   const handleChangePage = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setSearched(true);
//     setPage(0);
//   };

//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchTerm("");
//     setSearched(false);
//     setPage(0);
//   };

//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         p: 3,
//         borderRadius: 3,
//         background: theme.palette.background.paper,
//         boxShadow: "0 4px 24px 0 rgba(60,72,100,0.10)",
//         minHeight: 400,
//         overflow: "hidden",
//       }}
//     >
//       <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 700,
//             color: theme.palette.primary.main,
//             flex: 1,
//             letterSpacing: 1,
//           }}
//         >
//           Diamond Data Table
//         </Typography>
//         <TextField
//           variant="outlined"
//           size="small"
//           placeholder="Search in all columns..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon color="primary" />
//               </InputAdornment>
//             ),
//             sx: {
//               borderRadius: 2,
//               background: theme.palette.background.default,
//             },
//           }}
//           sx={{ width: 260 }}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSearch();
//           }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ minWidth: 100, borderRadius: 2, boxShadow: 1 }}
//           onClick={handleSearch}
//           disabled={!searchInput.trim()}
//         >
//           Search
//         </Button>
//         {searched && (
//           <Button
//             variant="outlined"
//             color="secondary"
//             sx={{ minWidth: 80, borderRadius: 2 }}
//             onClick={handleClearSearch}
//           >
//             Clear
//           </Button>
//         )}
//       </Box>
//       {Object.keys(transformedData).length === 0 ? (
//         <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
//           No data found.
//         </Typography>
//       ) : (
//         Object.entries(transformedData).map(
//           ([company, parcels], companyIdx) => (
//             <React.Fragment key={company}>
//               <Box
//                 sx={{
//                   mb: 3,
//                   p: 2,
//                   borderRadius: 3,
//                   background: theme.palette.background.default,
//                   boxShadow: "0 2px 12px 0 rgba(60,72,100,0.06)",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontWeight: 700,
//                     mb: 2,
//                     color: theme.palette.primary.dark,
//                     letterSpacing: 0.5,
//                   }}
//                 >
//                   {company}
//                 </Typography>
//                 {Object.entries(parcels).map(([parcelName, items]) => (
//                   <Accordion
//                     key={parcelName}
//                     sx={{
//                       mb: 1.5,
//                       borderRadius: 2,
//                       boxShadow: "0 1px 6px 0 rgba(60,72,100,0.08)",
//                       background: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       "&:before": { display: "none" },
//                     }}
//                     disableGutters
//                   >
//                     <AccordionSummary
//                       expandIcon={<ExpandMoreIcon />}
//                       sx={{ px: 2, py: 1.5 }}
//                     >
//                       <Typography
//                         sx={{
//                           fontWeight: 600,
//                           fontSize: "1.08rem",
//                           color: theme.palette.text.primary,
//                         }}
//                       >
//                         {parcelName}
//                       </Typography>
//                     </AccordionSummary>
//                     <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
//                       <TableContainer
//                         sx={{
//                           borderRadius: 2,
//                           border: `1px solid ${theme.palette.divider}`,
//                         }}
//                       >
//                         <Table size="small" sx={{ minWidth: 700 }}>
//                           <TableHead>
//                             <TableRow>
//                               {items.length > 0 &&
//                                 Object.keys(items[0])
//                                   .filter((key) => key !== "Company")
//                                   .map((key) => (
//                                     <TableCell
//                                       key={key}
//                                       sx={{
//                                         fontWeight: 700,
//                                         background: theme.palette.primary.main,
//                                         color: "#fff",
//                                         fontSize: "1rem",
//                                         letterSpacing: 0.5,
//                                         whiteSpace: "nowrap",
//                                         position: "sticky",
//                                         top: 0,
//                                         zIndex: 2,
//                                         borderBottom: `2px solid ${theme.palette.primary.dark}`,
//                                       }}
//                                     >
//                                       {key}
//                                     </TableCell>
//                                   ))}
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {items.map((row, idx) => (
//                               <TableRow
//                                 key={idx}
//                                 sx={{
//                                   backgroundColor:
//                                     idx % 2 === 0
//                                       ? theme.palette.action.hover
//                                       : "inherit",
//                                   transition: "background 0.2s",
//                                   "&:hover": {
//                                     backgroundColor:
//                                       theme.palette.action.selected,
//                                   },
//                                 }}
//                               >
//                                 {Object.entries(row)
//                                   .filter(([key]) => key !== "Company")
//                                   .map(([key, value], i) => (
//                                     <TableCell
//                                       key={i}
//                                       sx={{
//                                         fontSize: "0.97rem",
//                                         whiteSpace: "nowrap",
//                                         borderBottom: `1px solid ${theme.palette.divider}`,
//                                       }}
//                                     >
//                                       {typeof value === "number"
//                                         ? value.toLocaleString()
//                                         : String(value)}
//                                     </TableCell>
//                                   ))}
//                               </TableRow>
//                             ))}
//                             {/* Optional: Add a summary row for numeric columns */}
//                             {items.length > 0 && (
//                               <TableRow>
//                                 {Object.entries(items[0])
//                                   .filter(([key]) => key !== "Company")
//                                   .map(([key, value], i) => {
//                                     if (typeof value === "number") {
//                                       const total = items.reduce(
//                                         (sum, row) =>
//                                           sum +
//                                           (typeof row[key] === "number"
//                                             ? row[key]
//                                             : 0),
//                                         0
//                                       );
//                                       return (
//                                         <TableCell
//                                           key={i}
//                                           sx={{
//                                             fontWeight: 600,
//                                             color: theme.palette.primary.main,
//                                             background:
//                                               theme.palette.action.hover,
//                                           }}
//                                         >
//                                           Total: {total.toLocaleString()}
//                                         </TableCell>
//                                       );
//                                     }
//                                     if (i === 0) {
//                                       return (
//                                         <TableCell
//                                           key={i}
//                                           sx={{
//                                             fontWeight: 600,
//                                             color: theme.palette.primary.main,
//                                             background:
//                                               theme.palette.action.hover,
//                                           }}
//                                         >
//                                           Count: {items.length}
//                                         </TableCell>
//                                       );
//                                     }
//                                     return (
//                                       <TableCell
//                                         key={i}
//                                         sx={{
//                                           background:
//                                             theme.palette.action.hover,
//                                         }}
//                                       />
//                                     );
//                                   })}
//                               </TableRow>
//                             )}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </AccordionDetails>
//                   </Accordion>
//                 ))}
//               </Box>
//               {companyIdx < Object.entries(transformedData).length - 1 && (
//                 <Divider
//                   sx={{
//                     my: 3,
//                     borderColor: theme.palette.divider,
//                     opacity: 0.7,
//                   }}
//                 />
//               )}
//             </React.Fragment>
//           )
//         )
//       )}
//     </Paper>
//   );
// };

// export default DataTableView;

// import React, { useState } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TextField,
//   InputAdornment,
//   Typography,
//   Button,
//   useTheme,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Divider,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// const DataTableView = ({ data }) => {
//   const transformedData = {};

//   data?.forEach((item) => {
//     const company = item.Company;
//     const parcel = item.ParcelName;

//     if (!transformedData[company]) {
//       transformedData[company] = {};
//     }

//     if (!transformedData[company][parcel]) {
//       transformedData[company][parcel] = [];
//     }

//     transformedData[company][parcel].push(item);
//   });

//   const theme = useTheme();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(20);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [searched, setSearched] = useState(false);

//   const filteredData = React.useMemo(() => {
//     if (!searched || !searchTerm.trim()) return data;
//     return data.filter((row) =>
//       Object.values(row).some((value) =>
//         String(value).toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [data, searchTerm, searched]);

//   const handleChangePage = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSearch = () => {
//     setSearchTerm(searchInput);
//     setSearched(true);
//     setPage(0);
//   };

//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchTerm("");
//     setSearched(false);
//     setPage(0);
//   };

//   // Define the desired column order and display names
//   const columnConfig = [
//     { key: "LotNumber", displayName: "Lot No." },
//     { key: "PricePerCarat", displayName: "Dollar per Carat" },
//     { key: "Carats", displayName: "Weight" },
//     { key: "TotalPrice", displayName: "Valuation" },
//     { key: "SizeCategory", displayName: "Size" },
//     { key: "Model", displayName: "Model" },
//     { key: "Quality", displayName: "Quality" },
//     { key: "Colour", displayName: "Color" },
//     { key: "AuctionDate", displayName: "Auction Date" },
//     // These will be hidden from the table but kept in data
//     { key: "Company", displayName: "Company", hidden: true },
//     { key: "ParcelName", displayName: "Parcel Name", hidden: true },
//     { key: "SizeGroup", displayName: "Size Group", hidden: true },
//     { key: "StoneCount", displayName: "Stone Count", hidden: true },
//   ];

//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         p: 3,
//         borderRadius: 3,
//         background: theme.palette.background.paper,
//         boxShadow: "0 4px 24px 0 rgba(60,72,100,0.10)",
//         minHeight: 400,
//         overflow: "hidden",
//       }}
//     >
//       <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 700,
//             color: theme.palette.primary.main,
//             flex: 1,
//             letterSpacing: 1,
//           }}
//         >
//           Diamond Data Table
//         </Typography>
//         <TextField
//           variant="outlined"
//           size="small"
//           placeholder="Search in all columns..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon color="primary" />
//               </InputAdornment>
//             ),
//             sx: {
//               borderRadius: 2,
//               background: theme.palette.background.default,
//             },
//           }}
//           sx={{ width: 260 }}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSearch();
//           }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ minWidth: 100, borderRadius: 2, boxShadow: 1 }}
//           onClick={handleSearch}
//           disabled={!searchInput.trim()}
//         >
//           Search
//         </Button>
//         {searched && (
//           <Button
//             variant="outlined"
//             color="secondary"
//             sx={{ minWidth: 80, borderRadius: 2 }}
//             onClick={handleClearSearch}
//           >
//             Clear
//           </Button>
//         )}
//       </Box>
//       {Object.keys(transformedData).length === 0 ? (
//         <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
//           No data found.
//         </Typography>
//       ) : (
//         Object.entries(transformedData).map(
//           ([company, parcels], companyIdx) => (
//             <React.Fragment key={company}>
//               <Box
//                 sx={{
//                   mb: 3,
//                   p: 2,
//                   borderRadius: 3,
//                   background: theme.palette.background.default,
//                   boxShadow: "0 2px 12px 0 rgba(60,72,100,0.06)",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontWeight: 700,
//                     mb: 2,
//                     color: theme.palette.primary.dark,
//                     letterSpacing: 0.5,
//                   }}
//                 >
//                   {company}
//                 </Typography>
//                 {Object.entries(parcels).map(([parcelName, items]) => (
//                   <Accordion
//                     key={parcelName}
//                     sx={{
//                       mb: 1.5,
//                       borderRadius: 2,
//                       boxShadow: "0 1px 6px 0 rgba(60,72,100,0.08)",
//                       background: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       "&:before": { display: "none" },
//                     }}
//                     disableGutters
//                   >
//                     <AccordionSummary
//                       expandIcon={<ExpandMoreIcon />}
//                       sx={{ px: 2, py: 1.5 }}
//                     >
//                       <Typography
//                         sx={{
//                           fontWeight: 600,
//                           fontSize: "1.08rem",
//                           color: theme.palette.text.primary,
//                         }}
//                       >
//                         {parcelName}
//                       </Typography>
//                     </AccordionSummary>
//                     <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
//                       <TableContainer
//                         sx={{
//                           borderRadius: 2,
//                           border: `1px solid ${theme.palette.divider}`,
//                         }}
//                       >
//                         <Table size="small" sx={{ minWidth: 700 }}>
//                           <TableHead>
//                             <TableRow>
//                               {columnConfig
//                                 .filter((col) => !col.hidden)
//                                 .map((col) => (
//                                   <TableCell
//                                     key={col.key}
//                                     sx={{
//                                       fontWeight: 700,
//                                       background: theme.palette.primary.main,
//                                       color: "#fff",
//                                       fontSize: "1rem",
//                                       letterSpacing: 0.5,
//                                       whiteSpace: "nowrap",
//                                       position: "sticky",
//                                       top: 0,
//                                       zIndex: 2,
//                                       borderBottom: `2px solid ${theme.palette.primary.dark}`,
//                                     }}
//                                   >
//                                     {col.displayName}
//                                   </TableCell>
//                                 ))}
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {items.map((row, idx) => (
//                               <TableRow
//                                 key={idx}
//                                 sx={{
//                                   backgroundColor:
//                                     idx % 2 === 0
//                                       ? theme.palette.action.hover
//                                       : "inherit",
//                                   transition: "background 0.2s",
//                                   "&:hover": {
//                                     backgroundColor:
//                                       theme.palette.action.selected,
//                                   },
//                                 }}
//                               >
//                                 {columnConfig
//                                   .filter((col) => !col.hidden)
//                                   .map((col, i) => (
//                                     <TableCell
//                                       key={i}
//                                       sx={{
//                                         fontSize: "0.97rem",
//                                         whiteSpace: "nowrap",
//                                         borderBottom: `1px solid ${theme.palette.divider}`,
//                                       }}
//                                     >
//                                       {typeof row[col.key] === "number"
//                                         ? row[col.key].toLocaleString()
//                                         : String(row[col.key])}
//                                     </TableCell>
//                                   ))}
//                               </TableRow>
//                             ))}
//                             {/* Summary row with count, totals and averages */}
//                             {items.length > 0 && (
//                               <TableRow
//                                 sx={{
//                                   backgroundColor: theme.palette.action.hover,
//                                 }}
//                               >
//                                 {columnConfig
//                                   .filter((col) => !col.hidden)
//                                   .map((col, i) => {
//                                     const numericValues = items
//                                       .map((item) => item[col.key])
//                                       .filter(
//                                         (value) => typeof value === "number"
//                                       );

//                                     if (numericValues.length > 0) {
//                                       const sum = numericValues.reduce(
//                                         (a, b) => a + b,
//                                         0
//                                       );
//                                       const avg = sum / numericValues.length;

//                                       return (
//                                         <TableCell
//                                           key={i}
//                                           sx={{
//                                             fontWeight: 600,
//                                             color: theme.palette.primary.main,
//                                           }}
//                                         >
//                                           <div>
//                                             Sum:{" "}
//                                             {sum.toLocaleString(undefined, {
//                                               maximumFractionDigits: 2,
//                                             })}
//                                           </div>
//                                           <div>
//                                             Avg:{" "}
//                                             {avg.toLocaleString(undefined, {
//                                               maximumFractionDigits: 2,
//                                             })}
//                                           </div>
//                                         </TableCell>
//                                       );
//                                     }

//                                     if (i === 0) {
//                                       return (
//                                         <TableCell
//                                           key={i}
//                                           sx={{
//                                             fontWeight: 600,
//                                             color: theme.palette.primary.main,
//                                           }}
//                                         >
//                                           Count: {items.length}
//                                         </TableCell>
//                                       );
//                                     }

//                                     return <TableCell key={i} />;
//                                   })}
//                               </TableRow>
//                             )}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </AccordionDetails>
//                   </Accordion>
//                 ))}
//               </Box>
//               {companyIdx < Object.entries(transformedData).length - 1 && (
//                 <Divider
//                   sx={{
//                     my: 3,
//                     borderColor: theme.palette.divider,
//                     opacity: 0.7,
//                   }}
//                 />
//               )}
//             </React.Fragment>
//           )
//         )
//       )}
//     </Paper>
//   );
// };

// export default DataTableView;

import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Typography,
  Button,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DataTableView = ({ data }) => {
  const transformedData = {};

  data?.forEach((item) => {
    const company = item.Company;
    const parcel = item.ParcelName;

    if (!transformedData[company]) {
      transformedData[company] = {};
    }

    if (!transformedData[company][parcel]) {
      transformedData[company][parcel] = [];
    }

    transformedData[company][parcel].push(item);
  });

  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searched, setSearched] = useState(false);

  const filteredData = React.useMemo(() => {
    if (!searched || !searchTerm.trim()) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searched]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setSearched(true);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setSearched(false);
    setPage(0);
  };

  // Define the desired column order and display names
  const columnConfig = [
    { key: "LotNumber", displayName: "Lot No.", showCalculations: false },
    {
      key: "PricePerCarat",
      displayName: "Dollar per Carat",
      showCalculations: true,
    },
    { key: "Carats", displayName: "Weight", showCalculations: true },
    { key: "TotalPrice", displayName: "Valuation", showCalculations: true },
    { key: "SizeCategory", displayName: "Size", showCalculations: false },
    { key: "Model", displayName: "Model", showCalculations: false },
    { key: "Quality", displayName: "Quality", showCalculations: false },
    { key: "Colour", displayName: "Color", showCalculations: false },
    {
      key: "AuctionDate",
      displayName: "Auction Date",
      showCalculations: false,
    },
    // These will be hidden from the table but kept in data
    { key: "Company", displayName: "Company", hidden: true },
    { key: "ParcelName", displayName: "Parcel Name", hidden: true },
    { key: "SizeGroup", displayName: "Size Group", hidden: true },
    { key: "StoneCount", displayName: "Stone Count", hidden: true },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 3,
        background: theme.palette.background.paper,
        boxShadow: "0 4px 24px 0 rgba(60,72,100,0.10)",
        minHeight: 400,
        overflow: "hidden",
      }}
    >
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            flex: 1,
            letterSpacing: 1,
          }}
        >
          Diamond Data Table
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search in all columns..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              background: theme.palette.background.default,
            },
          }}
          sx={{ width: 260 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 100, borderRadius: 2, boxShadow: 1 }}
          onClick={handleSearch}
          disabled={!searchInput.trim()}
        >
          Search
        </Button>
        {searched && (
          <Button
            variant="outlined"
            color="secondary"
            sx={{ minWidth: 80, borderRadius: 2 }}
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        )}
      </Box>
      {Object.keys(transformedData).length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          No data found.
        </Typography>
      ) : (
        Object.entries(transformedData).map(
          ([company, parcels], companyIdx) => (
            <React.Fragment key={company}>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 3,
                  background: theme.palette.background.default,
                  boxShadow: "0 2px 12px 0 rgba(60,72,100,0.06)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: theme.palette.primary.dark,
                    letterSpacing: 0.5,
                  }}
                >
                  {company}
                </Typography>
                {Object.entries(parcels).map(([parcelName, items]) => (
                  <Accordion
                    key={parcelName}
                    sx={{
                      mb: 1.5,
                      borderRadius: 2,
                      boxShadow: "0 1px 6px 0 rgba(60,72,100,0.08)",
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      "&:before": { display: "none" },
                    }}
                    disableGutters
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ px: 2, py: 1.5 }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "1.08rem",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {parcelName}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                      <TableContainer
                        sx={{
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Table size="small" sx={{ minWidth: 700 }}>
                          <TableHead>
                            <TableRow>
                              {columnConfig
                                .filter((col) => !col.hidden)
                                .map((col) => (
                                  <TableCell
                                    key={col.key}
                                    sx={{
                                      fontWeight: 700,
                                      background: theme.palette.primary.main,
                                      color: "#fff",
                                      fontSize: "1rem",
                                      letterSpacing: 0.5,
                                      whiteSpace: "nowrap",
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 2,
                                      borderBottom: `2px solid ${theme.palette.primary.dark}`,
                                    }}
                                  >
                                    {col.displayName}
                                  </TableCell>
                                ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {items.map((row, idx) => (
                              <TableRow
                                key={idx}
                                sx={{
                                  backgroundColor:
                                    idx % 2 === 0
                                      ? theme.palette.action.hover
                                      : "inherit",
                                  transition: "background 0.2s",
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.action.selected,
                                  },
                                }}
                              >
                                {columnConfig
                                  .filter((col) => !col.hidden)
                                  .map((col, i) => (
                                    <TableCell
                                      key={i}
                                      sx={{
                                        fontSize: "0.97rem",
                                        whiteSpace: "nowrap",
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                      }}
                                    >
                                      {typeof row[col.key] === "number"
                                        ? row[col.key].toLocaleString()
                                        : String(row[col.key])}
                                    </TableCell>
                                  ))}
                              </TableRow>
                            ))}
                            {/* Summary row with count, totals and averages */}
                            {items.length > 0 && (
                              <TableRow
                                sx={{
                                  backgroundColor: theme.palette.action.hover,
                                }}
                              >
                                {columnConfig
                                  .filter((col) => !col.hidden)
                                  .map((col, i) => {
                                    if (col.showCalculations) {
                                      const numericValues = items
                                        .map((item) => item[col.key])
                                        .filter(
                                          (value) => typeof value === "number"
                                        );

                                      if (numericValues.length > 0) {
                                        const sum = numericValues.reduce(
                                          (a, b) => a + b,
                                          0
                                        );
                                        const avg = sum / numericValues.length;

                                        return (
                                          <TableCell
                                            key={i}
                                            sx={{
                                              fontWeight: 600,
                                              color: theme.palette.primary.main,
                                            }}
                                          >
                                            <div>
                                              Sum:{" "}
                                              {sum.toLocaleString(undefined, {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2,
                                              })}
                                            </div>
                                            <div>
                                              Avg:{" "}
                                              {avg.toLocaleString(undefined, {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2,
                                              })}
                                            </div>
                                          </TableCell>
                                        );
                                      }
                                    }

                                    if (i === 0) {
                                      return (
                                        <TableCell
                                          key={i}
                                          sx={{
                                            fontWeight: 600,
                                            color: theme.palette.primary.main,
                                          }}
                                        >
                                          Count: {items.length}
                                        </TableCell>
                                      );
                                    }

                                    return <TableCell key={i} />;
                                  })}
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              {companyIdx < Object.entries(transformedData).length - 1 && (
                <Divider
                  sx={{
                    my: 3,
                    borderColor: theme.palette.divider,
                    opacity: 0.7,
                  }}
                />
              )}
            </React.Fragment>
          )
        )
      )}
    </Paper>
  );
};

export default DataTableView;
