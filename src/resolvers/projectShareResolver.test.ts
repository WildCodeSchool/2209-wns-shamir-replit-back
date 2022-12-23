import { ApolloServer } from "apollo-server-express";
import { createApolloServer } from "../tools/createApolloServer";
import { queries } from "../tools/queries";
import { ProjectShare } from "../models/project_share.model";

describe("Execution resolver", () => {
  let server: ApolloServer;
  const userEmail = "email@execution.execution";
  const userPassword = "test";
  const projectName = "project.execution";
  const projectDescription = "";
  const comment = true;
  const write = true;
  const read = true;

  let userId: number;
  let projectId: number;
  let projectShareId: number;

  beforeAll(async () => {
    server = await createApolloServer();
    await server.start();

    // setting up dependencies ...
    const newUser = await server.executeOperation({
      query: queries.createUser,
      variables: {
        password: userPassword,
        email: userEmail,
      },
    });

    userId = newUser?.data?.createUser.id;

    const newProject = await server.executeOperation({
      query: queries.createProject,
      variables: {
        userId,
        name: projectName,
        description: projectDescription,
        isPublic: false,
      },
    });

    projectId = newProject?.data?.createProject.id;
  });

  test("should create a projectShare", async () => {
    const response = await server.executeOperation({
      query: queries.createProjectShare,
      variables: {
        comment,
        write,
        read,
        userId,
        projectId,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.createProjectShare).toBeDefined();

    projectShareId = response?.data?.createProjectShare.id;
  });

  test("should retrieve all projectShare", async () => {
    const response = await server.executeOperation({
      query: queries.getAllProjectShares,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getAllProjectShares).toBeDefined();

    const allProjectShare = response.data
      ?.getAllProjectShares as ProjectShare[];

    expect(allProjectShare.length > 0).toBeTruthy();

    const projectShareRead = allProjectShare.filter(
      (projectShare) => projectShare.id === projectShareId
    )[0]?.read;

    expect(projectShareRead).toEqual(read);
  });

  test("getProjectShareById", async () => {
    const response = await server.executeOperation({
      query: queries.getProjectShareById,
      variables: {
        projectShareId,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getProjectShareById).toBeDefined();

    const projectShare = response.data?.getProjectShareById as ProjectShare;

    expect(projectShare.read).toEqual(read);
  });

  test("should update projectShare", async () => {
    const responseUpdateProjetShare = await server.executeOperation({
      query: queries.updateProjectShare,
      variables: {
        projectShareId,
        projectShare: { read: false },
      },
    });

    expect(responseUpdateProjetShare.errors).toBeUndefined();
    expect(responseUpdateProjetShare.data?.updateProjectShare).toBeDefined();

    const updatedProjectShare = responseUpdateProjetShare.data
      ?.updateProjectShare as ProjectShare;

    expect(updatedProjectShare.read).toEqual(false);

    const responseGetProjectShareById = await server.executeOperation({
      query: queries.getProjectShareById,
      variables: {
        projectShareId,
      },
    });

    const getProjectShareByIdProjectShare = responseGetProjectShareById.data
      ?.getProjectShareById as ProjectShare;

    expect(getProjectShareByIdProjectShare.read).toEqual(false);
  });

  test("should delete projectShare", async () => {
    const responseDeleteExecution = await server.executeOperation({
      query: queries.deleteProjectShare,
      variables: {
        projectShareId,
      },
    });

    expect(responseDeleteExecution.errors).toBeUndefined();
    expect(responseDeleteExecution.data?.deleteProjectShare).toBeDefined();

    const deletedProjectShare = responseDeleteExecution.data
      ?.deleteProjectShare as ProjectShare;

    expect(deletedProjectShare.id).toEqual(projectShareId);

    const responseGetAllExecutions = await server.executeOperation({
      query: queries.getAllProjectShares,
    });

    const allProjectsShare = responseGetAllExecutions.data
      ?.getAllProjectShares as ProjectShare[];

    expect(
      allProjectsShare.filter(
        (projectShare) => projectShare.id === projectShareId
      ).length
    ).toEqual(0);
  });
});
