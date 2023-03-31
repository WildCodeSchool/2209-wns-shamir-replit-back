import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IProjectShare } from "../interfaces/InputType";
import { ProjectShare } from "../models/project_share.model";
import projectService from "../services/projectService";
import projectShareService from "../services/projectShareService";
import { TokenPayload } from "../tools/createApolloServer";

@Resolver(ProjectShare)
export class ProjectShareResolver {
  @Mutation(() => ProjectShare)
  async createProjectShare(
    @Arg("data") data: IProjectShare,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      const proj = await projectService.getByProjId(ctx.id, data.projectId);
      if (!proj) throw new Error("id not allowed");
      const projectShareFromDB = await projectShareService.create(data, ctx.id);
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
        (projectShare) => projectShare.user.id === ctx.id
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
  ): Promise<ProjectShare | null> {
    try {
      return await projectShareService.getById(ctx.id, projectShareId);
    } catch (error) {
      console.error(error);
      throw new Error("can't get project by id");
    }
  }

  @Mutation(() => ProjectShare)
  async updateProjectShare(
    @Arg("data") data: IProjectShare,
    @Arg("ProjectShareId") projectShareId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare | null> {
    try {
      return await projectShareService.update(data, ctx.id, projectShareId);
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
      return await projectShareService.delete(ctx.id, projectShareId);
    } catch (e) {
      console.error(e);
      throw new Error("Can't delete ProjectShare");
    }
  }
}
