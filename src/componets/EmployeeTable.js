import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Modal, Form, message, Switch } from "antd";
import { getEmployees, deleteEmployee, addEmployee, updateEmployee } from "../services/api";
import EditEmployeeModal from "./EditEmployeeModel";
import "../styles/EmployeeTable.css";

const { Search } = Input;
const { Option } = Select;

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      message.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = (id) => {
  //   Modal.confirm({
  //     title: "Are you sure?",
  //     content: "This will delete the employee permanently.",
  //     onOk: async () => {
  //       try {
  //         await deleteEmployee(id);
  //         message.success("Employee deleted successfully!");

  //         setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  //         setFilteredEmployees((prev) => prev.filter((emp) => emp.id !== id));
  //       } catch (error) {
  //         message.error("Failed to delete employee.");
  //       }
  //     },
  //   });
  // };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will delete the employee permanently.",
      onOk: async () => {
        const result = await deleteEmployee(id);
        if (result.success) {
          message.success("Employee deleted successfully!");
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
          setFilteredEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } else {
          message.error("Failed to delete employee.");
        }
      },
    });
  };
  

  const handleEdit = (record) => {
    setEditingEmployee(record);
    setEditModalVisible(true);
  };

  const handleAddEmployee = async () => {
    try {
      const values = await addForm.validateFields();
      const newEmployee = { id: Date.now(), ...values };

      await addEmployee(newEmployee);
      message.success("Employee added successfully!");

      setEmployees((prev) => [...prev, newEmployee]);
      setFilteredEmployees((prev) => [...prev, newEmployee]);

      setAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      message.error("Failed to add employee.");
    }
  };

  const handleFilter = (value, field) => {
    let filtered = employees;

    if (value) {
      filtered = filtered.filter((emp) =>
        emp[field].toString().toLowerCase().includes(value.toLowerCase())
      );
    }

    if (filterStatus !== null) {
      filtered = filtered.filter((emp) => emp.status === filterStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleStatusToggle = (checked) => {
    const statusFilter = checked ? "Active" : "Inactive";
    setFilterStatus(statusFilter);

    const filtered = employees.filter((emp) => emp.status === statusFilter);
    setFilteredEmployees(filtered);
  };

  const handleUpdateEmployee = async (updatedValues) => {
    try {
      const updatedEmployee = { ...editingEmployee, ...updatedValues };
      await updateEmployee(editingEmployee.id, updatedEmployee);
      message.success("Employee updated successfully!");

      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee.id ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);

      setEditModalVisible(false);
      setEditingEmployee(null);
    } catch (error) {
      message.error("Failed to update employee.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: (a, b) => a.id - b.id },
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Salary", dataIndex: "salary", key: "salary", sorter: (a, b) => a.salary - b.salary },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setAddModalVisible(true)} style={{ margin: "10px" }}>
        Add Employee
      </Button>

      <Search placeholder="Search by Name" onChange={(e) => handleFilter(e.target.value, "name")} style={{ width: 200, margin: "10px" }} />
      <Select placeholder="Filter by Department" onChange={(value) => handleFilter(value, "department")} style={{ width: 200, margin: "10px" }}>
        <Option value="">All</Option>
        <Option value="IT">IT</Option>
        <Option value="HR">HR</Option>
        <Option value="Finance">Finance</Option>
      </Select>

      <span style={{ marginLeft: "10px", fontWeight: "bold" }}>Show Active Employees: </span>
      <Switch onChange={handleStatusToggle} style={{ marginLeft: "5px" }} />

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={filteredEmployees}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Add Employee Modal */}
      <Modal
        title="Add Employee"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={handleAddEmployee}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true, message: "Please select department" }]}>
            <Select>
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please enter role" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="salary" label="Salary" rules={[{ required: true, message: "Please enter salary" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onUpdate={handleUpdateEmployee}
        employee={editingEmployee}
      />
    </>
  );
};

export default EmployeeTable;



// import React, { useEffect, useState } from "react";
// import { Table, Button, Input, Select, Modal, Form, message, Switch } from "antd";
// import { getEmployees, deleteEmployee, addEmployee, updateEmployee } from "../services/api";
// import EditEmployeeModal from "./EditEmployeeModel";
// import "../styles/EmployeeTable.css";
// import { saveAs } from "file-saver";
// import Papa from "papaparse";

// const { Search } = Input;
// const { Option } = Select;

// const EmployeeTable = () => {
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [filterStatus, setFilterStatus] = useState(null);
//   const [form] = Form.useForm();
//   const [addForm] = Form.useForm();

//   useEffect(() => {
//     fetchEmployees();
//     loadGridState();
//   }, []);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     try {
//       const response = await getEmployees();
//       setEmployees(response.data);
//       setFilteredEmployees(response.data);
//     } catch (error) {
//       message.error("Failed to load employees.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveGridState = (keys) => {
//     localStorage.setItem("selectedRowKeys", JSON.stringify(keys));
//   };

//   const loadGridState = () => {
//     const storedKeys = localStorage.getItem("selectedRowKeys");
//     if (storedKeys) {
//       setSelectedRowKeys(JSON.parse(storedKeys));
//     }
//   };

//   const handleDelete = async (id) => {
//     Modal.confirm({
//       title: "Are you sure?",
//       content: "This will delete the employee permanently.",
//       onOk: async () => {
//         const result = await deleteEmployee(id);
//         if (result.success) {
//           message.success("Employee deleted successfully!");
//           setEmployees((prev) => prev.filter((emp) => emp.id !== id));
//           setFilteredEmployees((prev) => prev.filter((emp) => emp.id !== id));
//         } else {
//           message.error("Failed to delete employee.");
//         }
//       },
//     });
//   };

//   const handleEdit = (record) => {
//     setEditingEmployee(record);
//     setEditModalVisible(true);
//   };

//   const handleAddEmployee = async () => {
//     try {
//       const values = await addForm.validateFields();
//       const newEmployee = { id: Date.now(), ...values };
//       await addEmployee(newEmployee);
//       message.success("Employee added successfully!");
//       setEmployees((prev) => [...prev, newEmployee]);
//       setFilteredEmployees((prev) => [...prev, newEmployee]);
//       setAddModalVisible(false);
//       addForm.resetFields();
//     } catch (error) {
//       message.error("Failed to add employee.");
//     }
//   };

//   const handleExportCSV = () => {
//     const csv = Papa.unparse(employees);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "employees.csv");
//   };

//   const handleFilter = (value, field) => {
//     let filtered = employees;
//     if (value) {
//       filtered = filtered.filter((emp) =>
//         emp[field].toString().toLowerCase().includes(value.toLowerCase())
//       );
//     }
//     if (filterStatus !== null) {
//       filtered = filtered.filter((emp) => emp.status === filterStatus);
//     }
//     setFilteredEmployees(filtered);
//   };

//   const handleStatusToggle = (checked) => {
//     const statusFilter = checked ? "Active" : "Inactive";
//     setFilterStatus(statusFilter);
//     const filtered = employees.filter((emp) => emp.status === statusFilter);
//     setFilteredEmployees(filtered);
//   };

//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id", sorter: (a, b) => a.id - b.id },
//     { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
//     { title: "Department", dataIndex: "department", key: "department" },
//     { title: "Role", dataIndex: "role", key: "role" },
//     { title: "Salary", dataIndex: "salary", key: "salary", sorter: (a, b) => a.salary - b.salary },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       filters: [
//         { text: "Active", value: "Active" },
//         { text: "Inactive", value: "Inactive" },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: "Actions",
//       render: (_, record) => (
//         <>
//           <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
//           <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Button type="primary" onClick={() => setAddModalVisible(true)} style={{ margin: "10px" }}>Add Employee</Button>
//       <Button type="default" onClick={handleExportCSV} style={{ margin: "10px" }}>Export CSV</Button>
//       <Search placeholder="Search by Name" onChange={(e) => handleFilter(e.target.value, "name")} style={{ width: 200, margin: "10px" }} />
//       <Select placeholder="Filter by Department" onChange={(value) => handleFilter(value, "department")} style={{ width: 200, margin: "10px" }}>
//         <Option value="">All</Option>
//         <Option value="IT">IT</Option>
//         <Option value="HR">HR</Option>
//         <Option value="Finance">Finance</Option>
//       </Select>
//       <Switch onChange={handleStatusToggle} style={{ marginLeft: "5px" }} />
//       <Table
//         rowSelection={{
//           selectedRowKeys,
//           onChange: (keys) => {
//             setSelectedRowKeys(keys);
//             saveGridState(keys);
//           },
//         }}
//         columns={columns}
//         dataSource={filteredEmployees}
//         rowKey={(record) => record.id}
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />
//       <EditEmployeeModal
//         visible={editModalVisible}
//         onCancel={() => setEditModalVisible(false)}
//         employee={editingEmployee}
//       />
//     </>
//   );
// };

// export default EmployeeTable;





// import React, { useEffect, useState } from "react";
// import { Table, Button, Input, Select, Modal, Form, message, Switch } from "antd";
// import { getEmployees, deleteEmployee, addEmployee, updateEmployee } from "../services/api";
// import EditEmployeeModal from "./EditEmployeeModel";
// import "../styles/EmployeeTable.css";
// import { saveAs } from "file-saver";
// import Papa from "papaparse";

// const { Search } = Input;
// const { Option } = Select;

// const EmployeeTable = () => {
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [filterStatus, setFilterStatus] = useState(null);
//   const [form] = Form.useForm();
//   const [addForm] = Form.useForm();

//   useEffect(() => {
//     fetchEmployees();
//     loadGridState();
//   }, []);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     try {
//       const response = await getEmployees();
//       setEmployees(response.data);
//       setFilteredEmployees(response.data);
//     } catch (error) {
//       message.error("Failed to load employees.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveGridState = (keys) => {
//     localStorage.setItem("selectedRowKeys", JSON.stringify(keys));
//   };

//   const loadGridState = () => {
//     const storedKeys = localStorage.getItem("selectedRowKeys");
//     if (storedKeys) {
//       setSelectedRowKeys(JSON.parse(storedKeys));
//     }
//   };

//   const handleDelete = async (id) => {
//     Modal.confirm({
//       title: "Are you sure?",
//       content: "This will delete the employee permanently.",
//       onOk: async () => {
//         const result = await deleteEmployee(id);
//         if (result.success) {
//           message.success("Employee deleted successfully!");
//           setEmployees((prev) => prev.filter((emp) => emp.id !== id));
//           setFilteredEmployees((prev) => prev.filter((emp) => emp.id !== id));
//         } else {
//           message.error("Failed to delete employee.");
//         }
//       },
//     });
//   };

//   const handleEdit = (record) => {
//     setEditingEmployee(record);
//     setEditModalVisible(true);
//   };

//   const handleAddEmployee = async () => {
//     try {
//       const values = await addForm.validateFields();
//       const newEmployee = { id: Date.now(), ...values };
//       await addEmployee(newEmployee);
//       message.success("Employee added successfully!");
//       setEmployees((prev) => [...prev, newEmployee]);
//       setFilteredEmployees((prev) => [...prev, newEmployee]);
//       setAddModalVisible(false);
//       addForm.resetFields();
//     } catch (error) {
//       message.error("Failed to add employee.");
//     }
//   };

//   const handleUpdateEmployee = async (updatedValues) => {
//     try {
//       const updatedEmployee = { ...editingEmployee, ...updatedValues };
//       await updateEmployee(editingEmployee.id, updatedEmployee);
//       message.success("Employee updated successfully!");
//       const updatedEmployees = employees.map((emp) =>
//         emp.id === editingEmployee.id ? updatedEmployee : emp
//       );
//       setEmployees(updatedEmployees);
//       setFilteredEmployees(updatedEmployees);
//       setEditModalVisible(false);
//       setEditingEmployee(null);
//     } catch (error) {
//       message.error("Failed to update employee.");
//     }
//   };

//   const handleExportCSV = () => {
//     const csv = Papa.unparse(employees);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "employees.csv");
//   };

//   const handleFilter = (value, field) => {
//     let filtered = employees;
//     if (value) {
//       filtered = filtered.filter((emp) =>
//         emp[field].toString().toLowerCase().includes(value.toLowerCase())
//       );
//     }
//     if (filterStatus !== null) {
//       filtered = filtered.filter((emp) => emp.status === filterStatus);
//     }
//     setFilteredEmployees(filtered);
//   };

//   const handleStatusToggle = (checked) => {
//     const statusFilter = checked ? "Active" : "Inactive";
//     setFilterStatus(statusFilter);
//     const filtered = employees.filter((emp) => emp.status === statusFilter);
//     setFilteredEmployees(filtered);
//   };

//   return (
//     <>
//       <Button type="primary" onClick={() => setAddModalVisible(true)} style={{ margin: "10px" }}>Add Employee</Button>
//       <Button type="default" onClick={handleExportCSV} style={{ margin: "10px" }}>Export CSV</Button>
//       <Search placeholder="Search by Name" onChange={(e) => handleFilter(e.target.value, "name")} style={{ width: 200, margin: "10px" }} />
//       <Select placeholder="Filter by Department" onChange={(value) => handleFilter(value, "department")} style={{ width: 200, margin: "10px" }}>
//         <Option value="">All</Option>
//         <Option value="IT">IT</Option>
//         <Option value="HR">HR</Option>
//         <Option value="Finance">Finance</Option>
//       </Select>
//       <Switch onChange={handleStatusToggle} style={{ marginLeft: "5px" }} />
//       <Table
//         rowSelection={{
//           selectedRowKeys,
//           onChange: (keys) => {
//             setSelectedRowKeys(keys);
//             saveGridState(keys);
//           },
//         }}
//         columns={[
//           { title: "ID", dataIndex: "id", key: "id", sorter: (a, b) => a.id - b.id },
//           { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
//           { title: "Department", dataIndex: "department", key: "department" },
//           { title: "Role", dataIndex: "role", key: "role" },
//           { title: "Salary", dataIndex: "salary", key: "salary", sorter: (a, b) => a.salary - b.salary },
//           { title: "Actions", render: (_, record) => (
//             <>
//               <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
//               <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
//             </>
//           ) },
//         ]}
//         dataSource={filteredEmployees}
//         rowKey={(record) => record.id}
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />
//       <EditEmployeeModal
//         visible={editModalVisible}
//         onCancel={() => setEditModalVisible(false)}
//         onUpdate={handleUpdateEmployee}
//         employee={editingEmployee}
//       />
//     </>
//   );
// };

// export default EmployeeTable;
