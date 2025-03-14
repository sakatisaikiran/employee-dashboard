// // import React, { useState } from "react";
// // import { Modal, Input, Select, Button } from "antd";
// // import { updateEmployee } from "../services/api";

// // const { Option } = Select;

// // const EditEmployeeModal = ({ visible, employee, onClose, refresh }) => {
// //   const [form, setForm] = useState(employee);

// //   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

// //   const handleSubmit = async () => {
// //     await updateEmployee(employee.id, form);
// //     refresh();
// //     onClose();
// //   };

// //   return (
// //     <Modal visible={visible} title="Edit Employee" onCancel={onClose} footer={[
// //       <Button key="cancel" onClick={onClose}>Cancel</Button>,
// //       <Button key="submit" type="primary" onClick={handleSubmit}>Save</Button>
// //     ]}>
// //       <Input name="name" placeholder="Name" value={form?.name} onChange={handleChange} />
// //       <Input name="role" placeholder="Role" value={form?.role} onChange={handleChange} />
// //       <Input name="salary" placeholder="Salary" value={form?.salary} onChange={handleChange} />
// //       <Select value={form?.status} onChange={(value) => setForm({ ...form, status: value })}>
// //         <Option value="Active">Active</Option>
// //         <Option value="Inactive">Inactive</Option>
// //       </Select>
// //     </Modal>
// //   );
// // };

// // export default EditEmployeeModal;
// import React, { useEffect, useState } from "react";
// import { Modal, Input, Select, Button, message } from "antd";
// import { updateEmployee } from "../services/api";

// const { Option } = Select;

// const EditEmployeeModal = ({ visible, employee, onClose, refresh }) => {
//   const [form, setForm] = useState(employee || {});

//   // Update form state when employee changes
//   useEffect(() => {
//     setForm(employee || {});
//   }, [employee]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSelectChange = (value) => {
//     setForm({ ...form, status: value });
//   };

//   const handleSubmit = async () => {
//     try {
//       await updateEmployee(employee.id, form);
//       message.success("Employee details updated successfully!");
//       refresh();
//       onClose();
//     } catch (error) {
//       message.error("Failed to update employee.");
//     }
//   };

//   return (
//     <Modal
//       open={visible}
//       title="Edit Employee"
//       onCancel={onClose}
//       footer={[
//         <Button key="cancel" onClick={onClose}>
//           Cancel
//         </Button>,
//         <Button key="submit" type="primary" onClick={handleSubmit}>
//           Save
//         </Button>,
//       ]}
//     >
//       <Input name="name" placeholder="Name" value={form?.name || ""} onChange={handleChange} style={{ marginBottom: 10 }} />
//       <Input name="role" placeholder="Role" value={form?.role || ""} onChange={handleChange} style={{ marginBottom: 10 }} />
//       <Input name="salary" placeholder="Salary" value={form?.salary || ""} onChange={handleChange} style={{ marginBottom: 10 }} />
//       <Select value={form?.status || "Active"} onChange={handleSelectChange} style={{ width: "100%" }}>
//         <Option value="Active">Active</Option>
//         <Option value="Inactive">Inactive</Option>
//       </Select>
//     </Modal>
//   );
// };

// export default EditEmployeeModal;
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";

const { Option } = Select;

const EditEmployeeModal = ({ visible, employee, onClose, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue(employee);
    }
  }, [employee, form]);

  const handleUpdate = async (values) => {
    try {
      await onUpdate(values);
      message.success("Employee updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update employee.");
    }
  };

  return (
    <Modal
      title="Edit Employee"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="department" label="Department" rules={[{ required: true, message: "Please select a department" }]}>
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
  );
};

export default EditEmployeeModal;
