import axios from "axios";

const API_URL = "http://localhost:5000/employees";

export const getEmployees = () => axios.get(API_URL);
export const addEmployee = (employee) => axios.post(API_URL, employee);
export const updateEmployee = (id, updatedEmployee) => axios.put(`${API_URL}/${id}`, updatedEmployee);
// export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);
// export const deleteEmployee = async (id) => {
//     return axios.delete(`${API_URL}/${id}`);
// };
export const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Error deleting employee:", error);
      return { success: false, error };
    }
  };
  