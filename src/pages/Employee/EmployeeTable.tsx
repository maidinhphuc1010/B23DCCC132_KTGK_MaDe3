import { Table, Button, Modal, Input, Select, Space } from 'antd';
import { useState } from 'react';
import useEmployeeManagement from '../../models/employeeModel';
import EmployeeForm from './EmployeeForm';

const { Option } = Select;
const positions = ["Giám đốc", "Nhân viên", "Quản lý"];
const departments = ["Kỹ thuật", "Nhân sự", "Kinh doanh"];

const EmployeeTable = () => {
  const { employees, setVisible, setIsEdit, deleteEmployee, setSelectedEmployee, visible, isEdit } = useEmployeeManagement();
  const [search, setSearch] = useState<string>('');
  const [filterPosition, setFilterPosition] = useState<string | undefined>(undefined);
  const [filterDepartment, setFilterDepartment] = useState<string | undefined>(undefined);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.id.toLowerCase().includes(search.toLowerCase()) ||
      employee.name.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = filterPosition ? employee.position === filterPosition : true;
    const matchesDepartment = filterDepartment ? employee.department === filterDepartment : true;
    return matchesSearch && matchesPosition && matchesDepartment;
  });
  const clearFilters = () => {
    setSearch('');
    setFilterPosition(undefined);
    setFilterDepartment(undefined);
  };
  const handleDeleteEmployee = (id: string) => {
    setEmployeeToDelete(id);
    setConfirmDeleteVisible(true);
  };
  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete);
    }
    setConfirmDeleteVisible(false);
    setEmployeeToDelete(null); 
  };
  const handleCancelDelete = () => {
    setConfirmDeleteVisible(false);
    setEmployeeToDelete(null); 
  };

  const columns = [
    { title: 'Mã NV', dataIndex: 'id', key: 'id' },
    { title: 'Họ Tên', dataIndex: 'name', key: 'name' },
    { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
    { title: 'Phòng Ban', dataIndex: 'department', key: 'department' },
    { title: 'Lương', dataIndex: 'salary', key: 'salary', sorter: (a, b) => b.salary - a.salary },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      render: (record) => (
        <div>
          <Button
            onClick={() => {
              setVisible(true); 
              setSelectedEmployee(record); 
              setIsEdit(true);  
            }}
          >
            Sửa
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={() => handleDeleteEmployee(record.id)} type="primary">
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
            setIsEdit(false);
            setSelectedEmployee(null); 
          }}
        >
          Thêm Nhân Viên
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo Mã NV hoặc Họ Tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 400 }}
        />
        <Select
          placeholder="Chức Vụ"
          value={filterPosition}
          onChange={setFilterPosition}
          style={{ width: 200 }}
        >
          {positions.map((position) => (
            <Option key={position} value={position}>
              {position}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Phòng Ban"
          value={filterDepartment}
          onChange={setFilterDepartment}
          style={{ width: 200 }}
        >
          {departments.map((department) => (
            <Option key={department} value={department}>
              {department}
            </Option>
          ))}
        </Select>
        <Button onClick={clearFilters} type="default" style={{ marginLeft: 10 }}>
          Xóa Bộ Lọc
        </Button>
      </Space>

      <Table dataSource={filteredEmployees} columns={columns} rowKey="id" />


      <Modal
        visible={visible}
        title={isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        onCancel={() => {
          setVisible(false);
          setSelectedEmployee(null); 
        }}
        footer={null}
      >
        <EmployeeForm />
      </Modal>

      <Modal
        title="Xác nhận xóa"
        visible={confirmDeleteVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa nhân viên này?</p>
      </Modal>
    </div>
  );
};

export default EmployeeTable;
