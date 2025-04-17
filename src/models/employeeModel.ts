import { useState, useEffect } from 'react';
import { Employee, EmployeeStatus } from '../services/Employee/typing'; 

const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(employees);
  }, [employees]);

  const saveToLocalStorage = (data: Employee[]) => {
    localStorage.setItem('employees', JSON.stringify(data));
  };

  const getStatusPrefix = (status: EmployeeStatus): string | null => {
    switch (status) {
      case EmployeeStatus.Trial:
        return 'TV';
      case EmployeeStatus.ContractSigned:
        return 'HD';
      case EmployeeStatus.Resigned:
        return 'NV';
      default:
        return null;
    }
  };

  const generateEmployeeId = (status: EmployeeStatus): string => {
    const prefix = getStatusPrefix(status);
    if (prefix) {
      const filteredEmployees = employees.filter((e) => e.id.startsWith(prefix));
      const newNumber = (filteredEmployees.length + 1).toString().padStart(3, '0');
      return `${prefix}${newNumber}`;
    } else {
      const generalEmployees = employees.filter((e) => !e.id.startsWith('TV') && !e.id.startsWith('HD') && !e.id.startsWith('NV'));
      const newNumber = (generalEmployees.length + 1).toString().padStart(3, '0');
      return `${newNumber}`;
    }
  };

  const saveEmployee = (employee: Employee) => {
    let updatedEmployees;
    if (isEdit && selectedEmployee) {
      updatedEmployees = employees.map((e) => (e.id === selectedEmployee.id ? employee : e));
    } else {
      const newEmployee = { ...employee, id: generateEmployeeId(employee.status) };
      updatedEmployees = [...employees, newEmployee];
    }
    setEmployees(updatedEmployees);
    saveToLocalStorage(updatedEmployees); 
  };

  const deleteEmployee = (id: string) => {
    const employeeToDelete = employees.find((e) => e.id === id);
    if (!employeeToDelete) return;

    if (employeeToDelete.status === EmployeeStatus.Trial || employeeToDelete.status === EmployeeStatus.Resigned) {
      const updatedEmployees = employees.filter((e) => e.id !== id);
      setEmployees(updatedEmployees);
      saveToLocalStorage(updatedEmployees); 
    } else {
      alert('Bạn chỉ được phép xóa nhân viên đang thử việc hoặc đã thôi việc!');
    }
  };

  return {
    employees,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    selectedEmployee,
    setSelectedEmployee,
    saveEmployee,
    deleteEmployee,
  };
};

export default useEmployeeManagement;
