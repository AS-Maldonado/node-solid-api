import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";

interface UsersServiceRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async register({
    name,
    email,
    password,
  }: UsersServiceRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) throw new UserAlreadyExistsError();

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
