import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { ProjectShare } from "../models/project_share.model";
import projectShareService from "../services/projectShareService";

@Resolver(ProjectShare)
export class ProjectShareResolver {
  @Mutation(() => ProjectShare)
  async createProjectShare(
    @Arg("read") read: boolean,
    @Arg("write") write: boolean,
    @Arg("comment") comment: boolean
  ): Promise<ProjectShare> {
    const projectShareFromDB = await projectShareService.create(
      read,
      write,
      comment
    );
    console.log(projectShareFromDB);
    return projectShareFromDB;
  }

  @Query(() => [ProjectShare])
  async getAllProjectShares(): Promise<ProjectShare[]> {
    return await projectShareService.getAll();
  }

  @Query(() => ProjectShare)
  async getProjectShareById(
    @Arg("projectShareId") projectShareId: number
  ): Promise<ProjectShare> {
    return await projectShareService.getById(projectShareId);
  }

  @Mutation(() => ProjectShare)
  async updateProjectShare(
    @Arg("ProjectShare") ProjectShare: ProjectShare,
    @Arg("ProjectShareId") ProjectShareId: number
  ): Promise<ProjectShare> {
    try {
      return await projectShareService.update(ProjectShare, ProjectShareId);
    } catch (e) {
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
      throw new Error("Can't delete ProjectShare");
    }
  }
}
