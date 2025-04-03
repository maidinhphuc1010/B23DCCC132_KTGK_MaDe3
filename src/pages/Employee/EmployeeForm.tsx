import { Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import useEmployeeManagement from '../../models/employeeModel';
import { EmployeeStatus } from '../../models/employeeModel';

const { Option } = Select;
const positions = ["Giám đốc", "Nhân viên", "Quản lý"];
const departments = ["Kỹ thuật", "Nhân sự", "Kinh doanh"];

const EmployeeForm = () => {
  const { saveEmployee, selectedEmployee, setVisible, isEdit, setSelectedEmployee } = useEmployeeManagement();
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedEmployee && isEdit) {
      form.setFieldsValue({
        name: selectedEmployee.name,
        position: selectedEmployee.position,
        department: selectedEmployee.department,
        salary: selectedEmployee.salary,
        status: selectedEmployee.status,
      });
    } else {
      form.resetFields();  
    }
  }, [selectedEmployee, isEdit, form]);

  const validateName = (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('Họ tên không được để trống!');
    }
    if (value.length > 50) {
      return Promise.reject('Họ tên không được vượt quá 50 ký tự!');
    }
    const regex = /[^a-zA-Z0-9\s]/; // Kiểm tra ký tự đặc biệt
    if (regex.test(value)) {
      return Promise.reject('Họ tên không được chứa ký tự đặc biệt!');
    }
    return Promise.resolve();
  };

  const handleFinish = (values: any) => {
    saveEmployee(values);  
    setVisible(false);  
    form.resetFields(); 
    setSelectedEmployee(null); 
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item label="Họ và Tên" name="name" 
                 rules={[{ required: true, message: 'Họ tên không được để trống!' }, 
                         { validator: validateName }]}>
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item label="Chức vụ" name="position" rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}>
        <Select placeholder="Chọn chức vụ">
          {positions.map((position) => (
            <Option key={position} value={position}>
              {position}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Phòng ban" name="department" rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}>
        <Select placeholder="Chọn phòng ban">
          {departments.map((department) => (
            <Option key={department} value={department}>
              {department}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Lương" name="salary" rules={[{ required: true, message: 'Lương không được để trống!' }]}>
        <Input placeholder="Nhập lương" type="number" />
      </Form.Item>

      <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
        <Select placeholder="Chọn trạng thái">
          {Object.values(EmployeeStatus).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Lưu Thay Đổi' : 'Thêm Nhân Viên'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
