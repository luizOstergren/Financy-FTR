import { prismaClient } from "../../prisma/prisma";
import { CreateUserInput, EditUserInput } from "../dtos/input/user.input";
import { hashPassword } from "../utils/hash";

export class UserService {
  private async findUserOrThrow(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  private async verifyEmailIsAvailable(email: string, userIdAlreadyExist?: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (user && user.id !== userIdAlreadyExist) {
      throw new Error("Email already in use");
    }
  }

  async findUser(id: string) {
    return this.findUserOrThrow(id);
  }

  async createUser(data: CreateUserInput) {
    await this.verifyEmailIsAvailable(data.email);

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
      },
    });

    return user;
  }

  async editUser(data: EditUserInput) {
  await this.findUserOrThrow(data.id);

  if (data.email) {
    await this.verifyEmailIsAvailable(data.email, data.id);
  }

  const updateData: Record<string, any> = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.password !== undefined) {
    updateData.password = await hashPassword(data.password);
  }

  return prismaClient.user.update({
    where: { id: data.id },
    data: updateData,
  });
}
}