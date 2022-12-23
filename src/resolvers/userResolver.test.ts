import { ApolloServer } from "apollo-server-express";
import { User } from "../models";
import { createApolloServer } from "../tools/createApolloServer";
import { queries } from "../tools/queries";

describe("User resolver", () => {
  let server: ApolloServer;
  const userEmail = "email@test.test";
  const userPassword = "test";
  const userUpdatedEmail = "updatedEmail@test.test";
  let userId: number;

  beforeAll(async () => {
    server = await createApolloServer();
    await server.start();
  });

  test("should create a user", async () => {
    const response = await server.executeOperation({
      query: queries.createUser,
      variables: {
        password: userPassword,
        email: userEmail,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.createUser).toBeDefined();

    userId = response?.data?.createUser.id;
  });

  test("retrieve token", async () => {
    const response = await server.executeOperation({
      query: queries.getToken,
      variables: {
        password: userPassword,
        email: userEmail,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getToken).toBeDefined();
  });

  test("don't retrieve token with bad password", async () => {
    console.error = jest.fn();
    const response = await server.executeOperation({
      query: queries.getToken,
      variables: {
        password: "bad password",
        email: userEmail,
      },
    });

    expect(console.error).toHaveBeenCalled();
    expect(response.errors).toBeDefined();
    expect(response.data?.getToken).toBeUndefined();
  });

  test("should retrieve all users", async () => {
    const response = await server.executeOperation({
      query: queries.getAllUsers,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getAllUsers).toBeDefined();

    const allUsers = response.data?.getAllUsers as User[];

    expect(allUsers.length > 0).toBeTruthy();

    const createdUserEmail = allUsers.filter((user) => user.id === userId)[0]
      ?.email;

    expect(createdUserEmail).toEqual(userEmail);
  });

  test("should retrieve user previously created", async () => {
    const response = await server.executeOperation({
      query: queries.getUserById,
      variables: {
        userId,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getUserById).toBeDefined();

    const user = response.data?.getUserById as User;

    expect(user.email).toEqual(userEmail);
  });

  test("should update user", async () => {
    const responseUpdateUser = await server.executeOperation({
      query: queries.updateUser,
      variables: {
        userId,
        user: { email: userUpdatedEmail },
      },
    });

    expect(responseUpdateUser.errors).toBeUndefined();
    expect(responseUpdateUser.data?.updateUser).toBeDefined();

    const updatedUser = responseUpdateUser.data?.updateUser as User;

    expect(updatedUser.email).toEqual(userUpdatedEmail);

    const responseGetUserById = await server.executeOperation({
      query: queries.getUserById,
      variables: {
        userId,
      },
    });

    const getUserByIdUser = responseGetUserById.data?.getUserById as User;

    expect(getUserByIdUser.email).toEqual(userUpdatedEmail);
  });

  test("should delete user", async () => {
    const responseDeleteUser = await server.executeOperation({
      query: queries.deleteUser,
      variables: {
        userId,
      },
    });

    expect(responseDeleteUser.errors).toBeUndefined();
    expect(responseDeleteUser.data?.deleteUser).toBeDefined();

    const deletedUser = responseDeleteUser.data?.deleteUser as User;

    expect(deletedUser.id).toEqual(userId);

    const responseGetAllUsers = await server.executeOperation({
      query: queries.getAllUsers,
    });

    const allUsers = responseGetAllUsers.data?.getAllUsers as User[];

    expect(allUsers.filter((user) => user.id === userId).length).toEqual(0);
  });
});
