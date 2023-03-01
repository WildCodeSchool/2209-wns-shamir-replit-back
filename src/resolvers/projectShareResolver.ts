import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IProjectShare } from "../interfaces/InputType";
import { Project, User } from "../models";
import { ProjectShare } from "../models/project_share.model";
import projectService from "../services/projectService";
import projectShareService from "../services/projectShareService";
import { TokenPayload } from "../tools/createApolloServer";

type ReqProject = Omit<Project, "userId"> & {
  userId: User;
  // id_storage_number: string;
};

type ReqProjectShare = Omit<ProjectShare, "projectId"> & {
  projectId: Project;
  // id_storage_number: string;
};

@Resolver(IProjectShare)
export class ProjectShareResolver {
  @Mutation(() => ProjectShare)
  async createProjectShare(
    @Arg("projectId") projectId: number,
    @Arg("read") read: boolean,
    @Arg("write") write: boolean,
    @Arg("comment") comment: boolean,
    @Arg("userId") userId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<ProjectShare> {
    try {
      const askerId = ctx.id;
      const [proj] = (await projectService.getAll(ctx.id)).filter(
        (projet) => projet.id === projectId
      ) as unknown as ReqProject[];

      if (proj.userId.id !== askerId) throw new Error("id not allowed");

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
  ): Promise<ProjectShare> {
    try {
      const { user } = (await projectShareService.getAll()).filter(
        (pshare) => pshare.id === projectShareId
      )[0];

      if (user.id === ctx.id)
        return await projectShareService.getById(projectShareId);
      else throw new Error("id not allowed");
    } catch (error) {
      console.error(error);
      throw new Error("can't get project by id");
    }
  }

  // @Mutation(() => ProjectShare)
  // async updateProjectShare(
  //   @Arg("ProjectShare") projectShare: iProjectShare,
  //   @Arg("ProjectShareId") projectShareId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<ProjectShare> {
  //   try {
  //     const projectId = (
  //       (await projectShareService.getAll()).filter(
  //         (pshare) => pshare.id === projectShareId
  //       ) as unknown[] as ReqProjectShare[]
  //     )[0].projectId.id;

  //     const userId = (
  //       (await projectService.getAll(ctx.id))).filter(
  //         (project) => project.id === projectId
  //       ) as unknown[] as ReqProject[]
  //     )[0].userId.id;

  //     if (userId === ctx.id)
  //       return await projectShareService.update(projectShare, projectShareId);
  //     else throw new Error("id not allowed");
  //   } catch (e) {
  //     console.error(e);

  //     throw new Error("Can't update ProjectShare");
  //   }
  // }

  // @Mutation(() => ProjectShare)
  // async deleteProjectShare(
  //   @Arg("ProjectShareId") projectShareId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<ProjectShare> {
  //   try {
  //     const { userId } = (await projectShareService.getAll()).filter(
  //       (pshare) => pshare.id === projectShareId
  //     )[0];

  //     if (userId === ctx.id)
  //       return await projectShareService.delete(projectShareId);
  //     else throw new Error("id not allowed");
  //   } catch (e) {
  //     console.error(e);

  //     throw new Error("Can't delete ProjectShare");
  //   }
  // }
}
