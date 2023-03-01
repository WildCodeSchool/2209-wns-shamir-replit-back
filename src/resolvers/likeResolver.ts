import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { iLike } from "../interfaces/InputType";
import likeService from "../services/likeService";
import { TokenPayload } from "../tools/createApolloServer";
import { Like } from "../models";

@Resolver(iLike)
export class LikeResolver {
  // @Mutation(() => Like)
  // async createLike(
  //   @Arg("projectId") projectId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<Like> {
  //   try {
  //     const userId = ctx.id;

  //     const likeFromDB = await likeService.create(projectId, userId);
  //     return likeFromDB;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("can't create like");
  //   }
  // }

  @Query(() => [Like])
  async getAllLikes(@Ctx() ctx: Context<TokenPayload>): Promise<Like[]> {
    try {
      const likes = await likeService.getAll();

      return likes.filter((like) => like.user === ctx.id);
    } catch (error) {
      console.error(error);
      throw new Error("can't get all likes");
    }
  }

  @Query(() => Like)
  async getLikeById(
    @Arg("likeId") likeId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Like> {
    try {
      const { user } = (await likeService.getAll()).filter(
        (like) => like.id === likeId
      )[0];

      if (user === ctx.id) return await likeService.getById(likeId);
      else throw new Error("id not allowed");
    } catch (error) {
      console.error(error);
      throw new Error("can't get like by id");
    }
  }

  @Mutation(() => Like)
  async updateLike(
    @Arg("like") like: iLike,
    @Arg("likeId") likeId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Like> {
    try {
      const { user } = (await likeService.getAll()).filter(
        (_like) => _like.id === likeId
      )[0];

      if (user === ctx.id) return await likeService.update(like, likeId);
      else throw new Error("id not allowed");
    } catch (e) {
      console.error(e);

      throw new Error("Can't update like");
    }
  }

  @Mutation(() => Like)
  async deleteLike(
    @Arg("likeId") likeId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Like> {
    try {
      const { user } = (await likeService.getAll()).filter(
        (like) => like.id === likeId
      )[0];

      if (user === ctx.id) return await likeService.delete(likeId);
      else throw new Error("id not allowed");
    } catch (e) {
      console.error(e);

      throw new Error("Can't delete like");
    }
  }
}
