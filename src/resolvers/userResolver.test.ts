import { ApolloServer, gql } from "apollo-server-express";
import { createApolloServer } from "../tools/createApolloServer";

const queries = {
  createUser: gql`
    mutation CreateUser($password: String!, $email: String!) {
      createUser(password: $password, email: $email) {
        id
        login
        email
        date_end_subscription
        date_start_subscription
      }
    }
  `,
  getAllUsers: gql`
    query GetAllUsers {
      getAllUsers {
        date_end_subscription
        date_start_subscription
        email
        id
        login
      }
    }
  `,
};

describe("User resolver", () => {
  let server: ApolloServer;
  let userEmail = "email@test.test";
  let userId: number;

  beforeAll(async () => {
    server = await createApolloServer();
    await server.start();
  });

  test("should create a user", async () => {
    const createUser = queries.createUser;

    const response = await server.executeOperation({
      query: createUser,
      variables: {
        password: "test",
        email: userEmail,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.createUser).toBeDefined();

    userId = response?.data?.createUser.id;
  });

  test("should retrieve user previously created", async () => {
    const response = await server.executeOperation({
      query: queries.getAllUsers,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getAllUsers).toBeDefined();

    const allUsers = response.data?.getAllUsers as any[];

    expect(allUsers.length > 0).toBeTruthy();

    allUsers.map((user, userIndex) => console.log("user", userIndex, user));

    const createdUserEmail = allUsers.filter((user) => user.id === userId)[0]
      ?.email;

    expect(createdUserEmail).toEqual(userEmail);
  });
});
