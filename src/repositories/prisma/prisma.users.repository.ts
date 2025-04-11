import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../interfaces/users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return userWithSameEmail;
  }
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }
}
