import prisma from '../lib/prisma.js';

export class UserService {
  async createUser(data) {
    if (await this.getUserByEmail(data.email)) {
      throw new Error("Email already exists");
    }
    return await prisma.user.create({ data });
  }
  async getUserById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }
  async getAllUsers() {
    return await prisma.user.findMany();
  }
  async updateUser(id, data) {
    return await prisma.user.update({ where: { id }, data });
  }
  async deleteUser(id){
    return await prisma.user.delete({where:{id}});
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }
}