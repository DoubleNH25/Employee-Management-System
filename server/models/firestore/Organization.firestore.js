import { FirestoreService } from '../../services/FirestoreService.js';

export class OrganizationModel extends FirestoreService {
  constructor() {
    super('organizations');
  }

  async createOrganization(orgData) {
    const existingOrgByName = await this.findOneByField('name', orgData.name);
    if (existingOrgByName) {
      throw new Error('Organization name already exists');
    }

    const existingOrgByURL = await this.findOneByField('OrganizationURL', orgData.OrganizationURL);
    if (existingOrgByURL) {
      throw new Error('Organization URL already exists');
    }

    const existingOrgByEmail = await this.findOneByField('OrganizationMail', orgData.OrganizationMail);
    if (existingOrgByEmail) {
      throw new Error('Organization email already exists');
    }

    const organization = {
      name: orgData.name,
      description: orgData.description,
      employeeIds: orgData.employeeIds || [],
      hrIds: orgData.hrIds || [],
      OrganizationURL: orgData.OrganizationURL,
      OrganizationMail: orgData.OrganizationMail
    };

    return await this.create(organization);
  }

  async findByName(name) {
    return await this.findOneByField('name', name);
  }

  async findByURL(url) {
    return await this.findOneByField('OrganizationURL', url);
  }

  async findByEmail(email) {
    return await this.findOneByField('OrganizationMail', email);
  }

  async addEmployee(organizationId, employeeId) {
    return await this.addToArray(organizationId, 'employeeIds', employeeId);
  }

  async addHR(organizationId, hrId) {
    return await this.addToArray(organizationId, 'hrIds', hrId);
  }

  async removeEmployee(organizationId, employeeId) {
    return await this.removeFromArray(organizationId, 'employeeIds', employeeId);
  }

  async removeHR(organizationId, hrId) {
    return await this.removeFromArray(organizationId, 'hrIds', hrId);
  }
}

export const Organization = new OrganizationModel();
