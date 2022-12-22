import { ApolloServer, gql } from "apollo-server-express";
import { Project, User } from "../models";
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
  createProject: gql`
    mutation CreateProject(
      $isPublic: Boolean!
      $description: String!
      $name: String!
      $userId: Float!
    ) {
      createProject(
        isPublic: $isPublic
        description: $description
        name: $name
        userId: $userId
      ) {
        description
        id
        id_storage_number
        isPublic
        name
        nb_views
        nb_likes
      }
    }
  `,
  getAllProjects: gql`
    query GetAllProjects {
      getAllProjects {
        description
        id
        id_storage_number
        isPublic
        name
        nb_likes
        nb_views
      }
    }
  `,
  getProjectById: gql`
    query GetProjectById($projectId: Float!) {
      getProjectById(projectId: $projectId) {
        description
        id
        id_storage_number
        isPublic
        name
        nb_likes
        nb_views
      }
    }
  `,
  updateProject: gql`
    mutation UpdateProject($projectId: Float!, $project: iProject!) {
      updateProject(ProjectId: $projectId, Project: $project) {
        description
        id
        id_storage_number
        isPublic
        name
        nb_likes
        nb_views
      }
    }
  `,
  deleteProject: gql`
    mutation DeleteProject($projectId: Float!) {
      deleteProject(ProjectId: $projectId) {
        id
      }
    }
  `,
};

describe("Project resolver", () => {
  let server: ApolloServer;
  const userEmail = "email@test.test";
  const userPassword = "test";
  const projectName = "projectTest";
  const projectUpdatedName = "projectUpdated";
  const projectDescription = "";
  let userId: number;
  let projectId: number;

  beforeAll(async () => {
    server = await createApolloServer();
    await server.start();

    // setting up dependencies ...
    const response = await server.executeOperation({
      query: queries.createUser,
      variables: {
        password: userPassword,
        email: userEmail,
      },
    });

    userId = response?.data?.createUser.id;
  });

  test("should create a project", async () => {
    const response = await server.executeOperation({
      query: queries.createProject,
      variables: {
        userId,
        name: projectName,
        description: projectDescription,
        isPublic: false,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.createProject).toBeDefined();

    projectId = response?.data?.createProject.id;
  });

  test("should retrieve all project", async () => {
    const response = await server.executeOperation({
      query: queries.getAllProjects,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getAllProjects).toBeDefined();

    const allProjects = response.data?.getAllProjects as Project[];

    expect(allProjects.length > 0).toBeTruthy();

    const createdProjectName = allProjects.filter(
      (project) => project.id === projectId
    )[0]?.name;

    expect(createdProjectName).toEqual(projectName);
  });

  test("should retrieve project previously created", async () => {
    const response = await server.executeOperation({
      query: queries.getProjectById,
      variables: {
        projectId,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getProjectById).toBeDefined();

    const project = response.data?.getProjectById as Project;

    expect(project.name).toEqual(projectName);
  });

  test("should update project", async () => {
    const responseUpdateProject = await server.executeOperation({
      query: queries.updateProject,
      variables: {
        projectId,
        project: { name: projectUpdatedName },
      },
    });

    expect(responseUpdateProject.errors).toBeUndefined();
    expect(responseUpdateProject.data?.updateProject).toBeDefined();

    const updatedProject = responseUpdateProject.data?.updateProject as Project;

    expect(updatedProject.name).toEqual(projectUpdatedName);

    const responseGetUserById = await server.executeOperation({
      query: queries.getProjectById,
      variables: {
        projectId,
      },
    });

    const getProjectByIdProject = responseGetUserById.data
      ?.getProjectById as Project;

    expect(getProjectByIdProject.name).toEqual(projectUpdatedName);
  });

  test("should delete user", async () => {
    const responseDeleteProject = await server.executeOperation({
      query: queries.deleteProject,
      variables: {
        projectId,
      },
    });

    expect(responseDeleteProject.errors).toBeUndefined();
    expect(responseDeleteProject.data?.deleteProject).toBeDefined();

    const deletedProject = responseDeleteProject.data?.deleteProject as Project;

    expect(deletedProject.id).toEqual(projectId);

    const responseGetAllProjects = await server.executeOperation({
      query: queries.getAllProjects,
    });

    const allProjects = responseGetAllProjects.data
      ?.getAllProjects as Project[];

    expect(
      allProjects.filter((project) => project.id === projectId).length
    ).toEqual(0);
  });
});
