import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver, ID } from "type-graphql";
import { iProjectShare } from "../interfaces/InputType";
import { ProjectShare } from "../models/project_share.model";
import projectService from "../services/projectService";
import projectShareService from "../services/projectShareService";
import { TokenPayload } from "../tools/createApolloServer";
import userService from "../services/userService";
import { Project } from "../models/project.model";

@Resolver(iProjectShare)
export class ProjectShareResolver {
  @Mutation(() => ProjectShare)
  async createProjectShare(
    @Arg("projectId") projectId: number,
    @Arg("read") read: boolean,
    @Arg("write") write: boolean,
    @Arg("comment") comment: boolean,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      const userId = ctx.id;

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
  async getAllProjectShares(
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare[]> {
    try {
      const projectShares = await projectShareService.getAll();

      return projectShares.filter(
        (projectShare) => projectShare.userId === ctx.id
      );
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
      const { userId } = (await projectShareService.getAll()).filter(
        (pshare) => pshare.id === projectShareId
      )[0];

      if (userId === ctx.id)
        return await projectShareService.getById(projectShareId);
      else throw new Error("id not allowed");
    } catch (error) {
      console.error(error);
      throw new Error("can't get project by id");
    }
  }

  @Mutation(() => ProjectShare)
  async updateProjectShare(
    @Arg("ProjectShare") projectShare: iProjectShare,
    @Arg("ProjectShareId") projectShareId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      const { userId } = (await projectShareService.getAll()).filter(
        (pshare) => pshare.id === projectShareId
      )[0];

      if (userId === ctx.id)
        return await projectShareService.update(projectShare, projectShareId);
      else throw new Error("id not allowed");
    } catch (e) {
      console.error(e);

      throw new Error("Can't update ProjectShare");
    }
  }

  @Mutation(() => ProjectShare)
  async deleteProjectShare(
    @Arg("ProjectShareId") projectShareId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      const { userId } = (await projectShareService.getAll()).filter(
        (pshare) => pshare.id === projectShareId
      )[0];

      if (userId === ctx.id)
        return await projectShareService.delete(projectShareId);
      else throw new Error("id not allowed");
    } catch (e) {
      console.error(e);

      throw new Error("Can't delete ProjectShare");
    }
  }
}
