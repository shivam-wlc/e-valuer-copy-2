// context/DataContext.js

import { createContext, useContext, useState } from "react";
import { diamondData } from "../utility/data";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ field: null, order: "asc" });
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState(diamondData);

  return (
    <DataContext.Provider
      value={{
        filters,
        setFilters,
        sort,
        setSort,
        selectedItems,
        setSelectedItems,
        data,
        setData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
