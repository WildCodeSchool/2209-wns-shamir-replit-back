import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { iProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import projectService from "../services/projectService";

@Resolver(iProject)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("userId") userId: number,
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("isPublic") isPublic: boolean
  ): Promise<Project> {
    try {
      const projectFromDB = await projectService.create(
        userId,
        name,
        description,
        isPublic
      );
      return projectFromDB;
    } catch (err) {
      console.error(err);
      throw new Error("Can't create Project");
    }
  }

  @Query(() => [Project])
  async getAllProjects(): Promise<Project[]> {
    try {
      return await projectService.getAll();
    } catch (err) {
      console.error(err);
      throw new Error("Can't find all Projects");
    }
  }

  @Query(() => Project)
  async getProjectById(@Arg("projectId") projectId: number): Promise<Project> {
    try {
      return await projectService.getById(projectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find Project");
    }
  }

  @Mutation(() => Project)
  async updateProject(
    @Arg("Project") Project: iProject,
    @Arg("ProjectId") ProjectId: number
  ): Promise<Project> {
    try {
      return await projectService.update(Project, ProjectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async deleteProject(@Arg("ProjectId") ProjectId: number): Promise<Project> {
    try {
      return await projectService.delete(ProjectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete Project");
    }
  }
}
