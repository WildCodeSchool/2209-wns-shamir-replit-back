import { ApolloServer } from "apollo-server-express";
import { Execution } from "../models";
import { createApolloServer } from "../tools/createApolloServer";
import { queries } from "../tools/queries";

describe("Execution resolver", () => {
  let server: ApolloServer;
  const userEmail = "email@execution.execution";
  const userPassword = "test";
  const projectName = "project.execution";
  const projectDescription = "";
  const executionDate = "2022-01-01";
  const executionOutput = "coucou";
  const executionUpdatedOutput = "salut";

  let userId: number;
  let projectId: number;
  let executionId: number;

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

  test("should create a execution", async () => {
    const response = await server.executeOperation({
      query: queries.createExecution,
      variables: {
        userId,
        projectId,
        executionDate,
        output: executionOutput,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.createExecution).toBeDefined();

    executionId = response?.data?.createExecution.id;
  });

  test("should retrieve all executions", async () => {
    const response = await server.executeOperation({
      query: queries.getAllExecutions,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getAllExecutions).toBeDefined();

    const allExecutions = response.data?.getAllExecutions as Execution[];

    expect(allExecutions.length > 0).toBeTruthy();

    const createdExecutionOutput = allExecutions.filter(
      (execution) => execution.id === executionId
    )[0]?.output;

    expect(createdExecutionOutput).toEqual(executionOutput);
  });

  test("should retrieve execution previously created", async () => {
    const response = await server.executeOperation({
      query: queries.getExecutionById,
      variables: {
        executionId,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getExecutionById).toBeDefined();

    const execution = response.data?.getExecutionById as Execution;

    expect(execution.output).toEqual(executionOutput);
  });

  test("should update execution", async () => {
    const responseUpdateExecution = await server.executeOperation({
      query: queries.updateExecution,
      variables: {
        executionId,
        execution: { output: executionUpdatedOutput },
      },
    });

    expect(responseUpdateExecution.errors).toBeUndefined();
    expect(responseUpdateExecution.data?.updateExecution).toBeDefined();

    const updatedProject = responseUpdateExecution.data
      ?.updateExecution as Execution;

    expect(updatedProject.output).toEqual(executionUpdatedOutput);

    const responseGetExecutionById = await server.executeOperation({
      query: queries.getExecutionById,
      variables: {
        executionId,
      },
    });

    const getExecutionByIdExecution = responseGetExecutionById.data
      ?.getExecutionById as Execution;

    expect(getExecutionByIdExecution.output).toEqual(executionUpdatedOutput);
  });

  test("should delete execution", async () => {
    const responseDeleteExecution = await server.executeOperation({
      query: queries.deleteExecution,
      variables: {
        executionId,
      },
    });

    expect(responseDeleteExecution.errors).toBeUndefined();
    expect(responseDeleteExecution.data?.deleteExecution).toBeDefined();

    const deletedExecution = responseDeleteExecution.data
      ?.deleteExecution as Execution;

    expect(deletedExecution.id).toEqual(executionId);

    const responseGetAllExecutions = await server.executeOperation({
      query: queries.getAllExecutions,
    });

    const allExecutions = responseGetAllExecutions.data
      ?.getAllExecutions as Execution[];

    expect(
      allExecutions.filter((execution) => execution.id === executionId).length
    ).toEqual(0);
  });
});
