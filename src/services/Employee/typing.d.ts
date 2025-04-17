export enum EmployeeStatus {
    Trial = 'Thử việc',
    ContractSigned = 'Đã ký hợp đồng',
    Leave = 'Nghỉ phép',
    Resigned = 'Đã thôi việc',
  }
  
  export interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    salary: number;
    status: EmployeeStatus;
  }
  