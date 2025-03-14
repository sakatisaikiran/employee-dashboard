import React from "react";
import EmployeeTable from ".//componets/EmployeeTable";
import "antd/dist/reset.css";

const App = () => {
  return (
    <div className="app-container">
      <h1>Employee Management Dashboard</h1>
      <EmployeeTable />
    </div>
  );
};

export default App;
