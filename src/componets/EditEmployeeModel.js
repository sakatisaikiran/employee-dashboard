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
