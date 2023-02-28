import { ApolloServer } from "apollo-server-express";
import { createApolloServer } from "../tools/createApolloServer";
import { queries } from "../tools/queries";
import { FileCode } from "../models";

describe("File resolver", () => {
  let server: ApolloServer;
  const userEmail = "email@file.file";
  const userPassword = "test";
  const projectName = "project.file";
  const projectDescription = "";
  const contentData = "console.log()";
  const clientPath = "/// zera// z45aed /";
  const language = "javascript";
  const name = "testFile";
  const updatedName = "updatedTestFile";

  let userId: number;
  let projectId: number;
  let fileId: number;

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

  test("should create a file", async () => {
    const response = await server.executeOperation({
      query: queries.createFile,
      variables: {
        contentData,
        clientPath,
        language,
        name,
        projectId,
        userId,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.createFile).toBeDefined();

    fileId = response?.data?.createFile.id;
  });

  test("should retrieve all files", async () => {
    const response = await server.executeOperation({
      query: queries.getAllFiles,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getAllFiles).toBeDefined();

    const allFiles = response.data?.getAllFiles as FileCode[];

    expect(allFiles.length > 0).toBeTruthy();

    const fileName = allFiles.filter((file) => file.id === fileId)[0]?.name;

    expect(fileName).toEqual(name);
  });

  test("getFileById", async () => {
    const response = await server.executeOperation({
      query: queries.getFileById,
      variables: {
        fileId,
      },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.getFileById).toBeDefined();

    const file = response.data?.getFileById as FileCode;

    expect(file.name).toEqual(name);
  });

  test("should update file", async () => {
    const responseUpdateFile = await server.executeOperation({
      query: queries.updateFileCode,
      variables: {
        fileId,
        file: { name: updatedName },
      },
    });

    expect(responseUpdateFile.errors).toBeUndefined();
    expect(responseUpdateFile.data?.updateFileCode).toBeDefined();

    const updatedFile = responseUpdateFile.data?.updateFileCode as FileCode;

    expect(updatedFile.name).toEqual(updatedName);

    const responseGetFileById = await server.executeOperation({
      query: queries.getFileById,
      variables: {
        fileId,
      },
    });

    const getFileById = responseGetFileById.data?.getFileById as FileCode;

    expect(getFileById.name).toEqual(updatedName);
  });

  test("should delete file", async () => {
    const responseDeleteFile = await server.executeOperation({
      query: queries.deleteFileCode,
      variables: {
        fileId,
      },
    });

    expect(responseDeleteFile.errors).toBeUndefined();
    expect(responseDeleteFile.data?.deleteFileCode).toBeDefined();

    const deletedFile = responseDeleteFile.data?.deleteFileCode as FileCode;

    expect(deletedFile.id).toEqual(fileId);

    const responseGetAllFiles = await server.executeOperation({
      query: queries.getAllFiles,
    });

    const allFiles = responseGetAllFiles.data?.getAllFiles as FileCode[];

    expect(allFiles.filter((file) => file.id === fileId).length).toEqual(0);
  });
});
