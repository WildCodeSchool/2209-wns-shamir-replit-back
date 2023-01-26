import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { iProjectShare } from "../interfaces/InputType";
import { ProjectShare } from "../models/project_share.model";
import projectShareService from "../services/projectShareService";
import { TokenPayload } from "../tools/createApolloServer";

@Resolver(iProjectShare)
export class ProjectShareResolver {
  @Mutation(() => ProjectShare)
  async createProjectShare(
    @Arg("projectId") projectId: number,
    @Arg("userId") userId: number,
    @Arg("read") read: boolean,
    @Arg("write") write: boolean,
    @Arg("comment") comment: boolean,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      const projectShareFromDB = await projectShareService.create(
        projectId,
        userId,
        read,
        write,
        comment
      );
      if (userId === ctx.id) return projectShareFromDB
      else throw new Error("id not allowed");
    } catch (error) {
      console.error(error);
      throw new Error("can't create projectShare");
    }
  }

  @Query(() => [ProjectShare])
  async getAllProjectShares( @Ctx() ctx: Context<TokenPayload>): Promise<ProjectShare[]> {
    try {
      const proj = await projectShareService.getAll();
      return proj.filter(x => x.id === ctx.id)
      return await projectShareService.getAll();
    } catch (error) {
      console.error(error);
      throw new Error("can't get all projectsShare");
    }
  }

  @Query(() => ProjectShare)
  async getProjectShareById(
    @Arg("projectShareId") projectShareId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      if (projectShareId === ctx.id) return await projectShareService.getById(projectShareId);
      else throw new Error("id not allowed");
    } catch (error) {
      console.error(error);
      throw new Error("can't get project by id");
    }
  }

  @Mutation(() => ProjectShare)
  async updateProjectShare(
    @Arg("ProjectShare") ProjectShare: iProjectShare,
    @Arg("ProjectShareId") ProjectShareId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      if (ProjectShareId === ctx.id) return await projectShareService.update(ProjectShare, ProjectShareId);
      else throw new Error("id not allowed");
    } catch (e) {
      console.error(e);

      throw new Error("Can't update ProjectShare");
    }
  }

  @Mutation(() => ProjectShare)
  async deleteProjectShare(
    @Arg("ProjectShareId") ProjectShareId: number,
    @Ctx() ctx: Context<TokenPayload>

  ): Promise<ProjectShare> {
    try {
      if (ProjectShareId === ctx.id) return await projectShareService.delete(ProjectShareId);
      else throw new Error("id not allowed");
    } catch (e) {
      console.error(e);

      throw new Error("Can't delete ProjectShare");
    }
  }
}
