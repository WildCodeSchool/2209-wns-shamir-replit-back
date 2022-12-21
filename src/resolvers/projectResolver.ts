import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Project } from "../models/project.model";
import projectService from "../services/projectService";

@Resolver(Project)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("userId") userId: number,
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("isPublic") isPublic: boolean,
  ): Promise<Project> {
    const projectFromDB = await projectService.create(userId, name, description, isPublic);
    console.log(projectFromDB);
    return projectFromDB;
  }

  @Query(() => [Project])
  async getAllProjects(): Promise<Project[]> {
    return await projectService.getAll();
  }

  @Query(() => Project)
  async getProjectById(@Arg("projectId") projectId: number): Promise<Project> {
    return await projectService.getById(projectId);
  }

  @Mutation(() => Project)
  async updateProject(
    @Arg("Project") Project: Project,
    @Arg("ProjectId") ProjectId: number
  ): Promise<Project> {
    try {
      return await projectService.update(Project, ProjectId);
    } catch (e) {
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async deleteProject(
    @Arg("ProjectId") ProjectId: number
  ): Promise<Project> {
    try {
      return await projectService.delete( ProjectId);
    } catch (e) {
      throw new Error("Can't delete Project");
    }
  }
}
