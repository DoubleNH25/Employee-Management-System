import { FirestoreService } from '../../services/FirestoreService.js';

export class DepartmentModel extends FirestoreService {
  constructor() {
    super('departments');
  }

  async createDepartment(deptData) {
    const department = {
      name: deptData.name,
      description: deptData.description,
      employeeIds: deptData.employeeIds || [],
      humanResourceIds: deptData.humanResourceIds || [],
      noticeIds: deptData.noticeIds || [],
      organizationId: deptData.organizationId
    };

    return await this.create(department);
  }

  async findByOrganization(organizationId) {
    return await this.findByField('organizationId', organizationId);
  }

  async findByNameInOrganization(name, organizationId) {
    const departments = await this.query([
      { field: 'name', operator: '==', value: name },
      { field: 'organizationId', operator: '==', value: organizationId }
    ]);
    return departments[0] || null;
  }

  async addEmployee(departmentId, employeeId) {
    return await this.addToArray(departmentId, 'employeeIds', employeeId);
  }

  async addHR(departmentId, hrId) {
    return await this.addToArray(departmentId, 'humanResourceIds', hrId);
  }

  async addNotice(departmentId, noticeId) {
    return await this.addToArray(departmentId, 'noticeIds', noticeId);
  }

  async removeEmployee(departmentId, employeeId) {
    return await this.removeFromArray(departmentId, 'employeeIds', employeeId);
  }

  async removeHR(departmentId, hrId) {
    return await this.removeFromArray(departmentId, 'humanResourceIds', hrId);
  }
}

export const Department = new DepartmentModel();
