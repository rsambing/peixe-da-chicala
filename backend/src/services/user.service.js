import prisma from '../lib/prisma.js';

export class UserService {
  async createUser(data) {
    if (await this.getUserByEmail(data.email)) {
      throw new Error("Email already exists");
    }

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role ?? 'customer'
      }
    });
  }

  async getUserById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async updateUser(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.role !== undefined) updateData.role = data.role;

    return await prisma.user.update({ where: { id }, data: updateData });
  }

  async deleteUser(id) {
    return await prisma.user.delete({ where: { id } });
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }
}