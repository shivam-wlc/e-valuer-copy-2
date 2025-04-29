import { DataProvider } from "./context/DataContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <>
      <DataProvider>
        <Dashboard />
      </DataProvider>
    </>
  );
}

export default App;
