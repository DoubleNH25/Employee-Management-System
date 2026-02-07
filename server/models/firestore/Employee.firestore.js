import { FirestoreService } from '../../services/FirestoreService.js';

export class EmployeeModel extends FirestoreService {
  constructor() {
    super('employees');
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async createEmployee(employeeData) {
    if (!this.validateEmail(employeeData.email)) {
      throw new Error('Invalid email address format, please enter a valid email address');
    }

    const existingEmployee = await this.findOneByField('email', employeeData.email);
    if (existingEmployee) {
      throw new Error('Email already exists');
    }

    const employee = {
      firstname: employeeData.firstname,
      lastname: employeeData.lastname,
      email: employeeData.email,
      password: employeeData.password,
      contactnumber: employeeData.contactnumber,
      phone: employeeData.phone || employeeData.contactnumber || null,
      role: employeeData.role || 'Employee',
      lastlogin: new Date(),
      isverified: employeeData.isverified || false,
      verificationtoken: employeeData.verificationtoken || null,
      verificationtokenexpires: employeeData.verificationtokenexpires || null,
      loginOTP: employeeData.loginOTP || null,
      loginOTPExpires: employeeData.loginOTPExpires || null,
      departmentId: employeeData.departmentId || null,
      attendanceId: employeeData.attendanceId || null,
      noticeIds: employeeData.noticeIds || [],
      salaryIds: employeeData.salaryIds || [],
      leaverequestIds: employeeData.leaverequestIds || [],
      generaterequestIds: employeeData.generaterequestIds || [],
      organizationId: employeeData.organizationId || null,
      schedule: employeeData.schedule || null
    };

    return await this.create(employee);
  }

  async findByEmail(email) {
    return await this.findOneByField('email', email);
  }

  async findByOrganization(organizationId) {
    return await this.findByField('organizationId', organizationId);
  }

  async findByDepartment(departmentId) {
    return await this.findByField('departmentId', departmentId);
  }

  async updateLastLogin(id) {
    return await this.updateById(id, { lastlogin: new Date() });
  }

  async addNotice(employeeId, noticeId) {
    return await this.addToArray(employeeId, 'noticeIds', noticeId);
  }

  async addSalary(employeeId, salaryId) {
    return await this.addToArray(employeeId, 'salaryIds', salaryId);
  }

  async addLeaveRequest(employeeId, leaveId) {
    return await this.addToArray(employeeId, 'leaverequestIds', leaveId);
  }

  async addGenerateRequest(employeeId, requestId) {
    return await this.addToArray(employeeId, 'generaterequestIds', requestId);
  }
}

export const Employee = new EmployeeModel();
