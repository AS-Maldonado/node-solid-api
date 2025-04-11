import { describe, expect, it } from "vitest";
import { UsersService } from "../users.service";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/inMemory/inMemory.users.repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

describe("UsersService Tests", () => {
  it("should be able register", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const usersService = new UsersService(inMemoryUsersRepository);

    const { user } = await usersService.register({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash the user password upon registration", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const usersService = new UsersService(inMemoryUsersRepository);

    const { user } = await usersService.register({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not be able to create a user with an existing email", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const usersService = new UsersService(inMemoryUsersRepository);
    const email = "johndoe@example.com";

    await usersService.register({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(
      usersService.register({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
