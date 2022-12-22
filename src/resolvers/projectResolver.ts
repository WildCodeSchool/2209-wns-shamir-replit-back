import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { iProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import projectService from "../services/projectService";
import string from "string-sanitizer";

@Resolver(iProject)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("userId") userId: number,
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("isPublic") isPublic: boolean
  ): Promise<Project> {

    // On Stock un timestamp pour avoir un nom unique
    const timeStamp = Date.now();
    // On supprime les espaces et les caractères spéciaux du nom du projet
    const updateName = string.sanitize.keepNumber(name);
    // On crée le nom du dossier avec le timestamp, le nom du projet et l'id de l'utilisateur
    const folderName = `${timeStamp}_${updateName}_${userId}`;

    // On crée le projet dans la base de données
    const projectFromDB = await projectService.create(
      userId,
      name,
      description,
      isPublic,
      folderName
    );

    await projectService.createFolder(folderName, userId);
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
    @Arg("Project") Project: iProject,
    @Arg("ProjectId") ProjectId: number
  ): Promise<Project> {
    try {
      return await projectService.update(Project, ProjectId);
    } catch (e) {
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async deleteProject(@Arg("ProjectId") ProjectId: number): Promise<Project> {
    try {
      return await projectService.delete(ProjectId);
    } catch (e) {
      throw new Error("Can't delete Project");
    }
  }
}
