import { FirestoreService } from '../../services/FirestoreService.js';

export class HRModel extends FirestoreService {
  constructor() {
    super('humanresources');
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async createHR(hrData) {
    if (!this.validateEmail(hrData.email)) {
      throw new Error('Invalid email address format');
    }

    const existingHR = await this.findOneByField('email', hrData.email);
    if (existingHR) {
      throw new Error('Email already exists');
    }

    const hr = {
      firstname: hrData.firstname,
      lastname: hrData.lastname,
      email: hrData.email,
      password: hrData.password,
      contactnumber: hrData.contactnumber,
      role: hrData.role || 'HR-Admin',
      lastlogin: new Date(),
      isverified: hrData.isverified || false,
      verificationtoken: hrData.verificationtoken || null,
      verificationtokenexpires: hrData.verificationtokenexpires || null,
      departmentId: hrData.departmentId || null,
      organizationId: hrData.organizationId || null,
      otpCode: hrData.otpCode || null,
      otpExpires: hrData.otpExpires || null
    };

    return await this.create(hr);
  }

  async findByEmail(email) {
    return await this.findOneByField('email', email);
  }

  async findByContactNumber(contactnumber) {
    return await this.findOneByField('contactnumber', contactnumber);
  }

  async findByOrganization(organizationId) {
    return await this.findByField('organizationId', organizationId);
  }

  async updateLastLogin(id) {
    return await this.updateById(id, { lastlogin: new Date() });
  }

  async updateOTP(id, otpCode, otpExpires) {
    return await this.updateById(id, { 
      otpCode, 
      otpExpires 
    });
  }

  async clearOTP(id) {
    return await this.updateById(id, { 
      otpCode: null,
      otpExpires: null
    });
  }
}

export const HumanResources = new HRModel();
