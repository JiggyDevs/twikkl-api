import { OptionalQuery } from 'src/core/types/database';
import { Admin } from './entities/admin.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAuthFactoryService {
  create(data: OptionalQuery<Admin>) {
    const admin = new Admin();

    if (data.email) admin.email = data.email;
    if (data.firstName) admin.firstName = data.firstName;
    if (data.image) admin.image = data.image;
    if (data.lastName) admin.lastName = data.lastName;
    if (data.password) admin.password = data.password;
    if (data.phone) admin.phone = data.phone;
    if (data.role) admin.role = data.role;
    if (data.status) admin.status = data.status;
    if (data.createdAt) admin.createdAt = data.createdAt;
    if (data.updatedAt) admin.updatedAt = data.updatedAt;

    return admin;
  }
}
