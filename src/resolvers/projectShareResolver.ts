import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { iProjectShare } from "../interfaces/InputType";
import { ProjectShare } from "../models/project_share.model";
import projectShareService from "../services/projectShareService";

@Resolver(iProjectShare)
export class ProjectShareResolver {
  @Mutation(() => ProjectShare)
  async createProjectShare(
    @Arg("projectId") projectId: number,
    @Arg("userId") userId: number,
    @Arg("read") read: boolean,
    @Arg("write") write: boolean,
    @Arg("comment") comment: boolean
  ): Promise<ProjectShare> {
    try {
      const projectShareFromDB = await projectShareService.create(
        projectId,
        userId,
        read,
        write,
        comment
      );
      return projectShareFromDB;
    } catch (error) {
      console.error(error);
      throw new Error("can't create projectShare");
    }
  }

  @Query(() => [ProjectShare])
  async getAllProjectShares(): Promise<ProjectShare[]> {
    try {
      return await projectShareService.getAll();
    } catch (error) {
      console.error(error);
      throw new Error("can't get all projectsShare");
    }
  }

  @Query(() => ProjectShare)
  async getProjectShareById(
    @Arg("projectShareId") projectShareId: number
  ): Promise<ProjectShare> {
    try {
      return await projectShareService.getById(projectShareId);
    } catch (error) {
      console.error(error);
      throw new Error("can't get project by id");
    }
  }

  @Mutation(() => ProjectShare)
  async updateProjectShare(
    @Arg("ProjectShare") ProjectShare: iProjectShare,
    @Arg("ProjectShareId") ProjectShareId: number
  ): Promise<ProjectShare> {
    try {
      return await projectShareService.update(ProjectShare, ProjectShareId);
    } catch (e) {
      console.error(e);

      throw new Error("Can't update ProjectShare");
    }
  }

  @Mutation(() => ProjectShare)
  async deleteProjectShare(
    @Arg("ProjectShareId") ProjectShareId: number
  ): Promise<ProjectShare> {
    try {
      return await projectShareService.delete(ProjectShareId);
    } catch (e) {
      console.error(e);

      throw new Error("Can't delete ProjectShare");
    }
  }
}
