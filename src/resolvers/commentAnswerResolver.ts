import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { CommentAnswer } from "../models/comment_answer.model";
import commentAnswerService from "../services/commentAnswerService";
import { TokenPayload } from "../tools/createApolloServer";

// const getAllowedProjectFileIds = async (ctx: TokenPayload) =>
//   (await projectService.getAll())
//     .filter(
//       (project) =>
//         project.user.id === ctx.id ||
//         project.isPublic ||
//         project.projectShare.map((pshare) => pshare.user.id === ctx.id)
//     )
//     .map((project) => project.fileCode.map((file) => file.id))
//     .flat();

// export const isAllowedcommentAnswer = (
//   commentAnswer: CommentAnswer,
//   codeComments: CodeComment[],
//   allowedProjectFileIds: number[]
// ) => {
//   const fileIds = codeComments
//     .filter((comment) => comment.id === commentAnswer.codeComment.id)
//     .map((comment) => comment.fileCode.id);

//   return (
//     fileIds.filter((fileId) => allowedProjectFileIds.includes(fileId)).length >
//     0
//   );
// };

@Resolver(CommentAnswer)
export class CommentAnswerResolver {
  @Mutation(() => CommentAnswer)
  async createCommentAnswer(
    @Arg("codeCommentId") codeCommentId: number,
    @Arg("comment") comment: string,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CommentAnswer> {
    try {
      return await commentAnswerService.create(codeCommentId, comment, ctx.id);
    } catch (e) {
      throw new Error("Can't createCodeComment");
    }
  }
}
// @Resolver(iCommentAnswer)
// export class CommentAnswerResolver {
//   @Mutation(() => CommentAnswer)
//   async createCommentAnswer(
//     @Arg("codeCommentId") codeCommentId: number,
//     @Arg("comment") comment: string,
//     @Arg("answer_date") answerDate: Date,
//     @Ctx() ctx: Context<TokenPayload>
//   ): Promise<CommentAnswer> {
//     try {
//       const userId = ctx.id;

//       const codeComment = await codeCommentService.getById(codeCommentId);

//       const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
//       if (!isAllowedcomment(codeComment, allowedProjectFileIds))
//         throw new Error("non authorisé");

//       const commentAnswerFromDB = await commentAnswerService.create(
//         codeCommentId,
//         userId,
//         comment,
//         answerDate
//       );
//       return commentAnswerFromDB;
//     } catch (e) {
//       throw new Error("Can't createCommentAnswer");
//     }
//   }

//   @Query(() => [CommentAnswer])
//   async getAllCommentAnswers(
//     @Ctx() ctx: Context<TokenPayload>
//   ): Promise<CommentAnswer[]> {
//     try {
//       const commentAnswers = await commentAnswerService.getAll();
//       const codeComments = await codeCommentService.getAll();

//       const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);

//       return commentAnswers.filter((commentAnswer) =>
//         isAllowedcommentAnswer(
//           commentAnswer,
//           codeComments,
//           allowedProjectFileIds
//         )
//       );
//     } catch (e) {
//       throw new Error("Can't getAllCommentAnswers");
//     }
//   }

//   @Query(() => CommentAnswer)
//   async getCommentAnswerById(
//     @Arg("commentAnswerId") commentAnswerId: number,
//     @Ctx() ctx: Context<TokenPayload>
//   ): Promise<CommentAnswer> {
//     try {
//       const commentAnswer = await commentAnswerService.getById(commentAnswerId);
//       const codeComments = await codeCommentService.getAll();

//       const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
//       if (
//         isAllowedcommentAnswer(
//           commentAnswer,
//           codeComments,
//           allowedProjectFileIds
//         )
//       )
//         return commentAnswer;
//       else throw new Error("not allowed");
//     } catch (e) {
//       throw new Error("Can't getCommentAnswerById");
//     }
//   }

//   @Mutation(() => CommentAnswer)
//   async updateCommentAnswer(
//     @Arg("CommentAnswer") commentAnswer: iCommentAnswer,
//     @Arg("CommentAnswerId") commentAnswerId: number,
//     @Ctx() ctx: Context<TokenPayload>
//   ): Promise<CommentAnswer> {
//     try {
//       const commentAnswer = await commentAnswerService.getById(commentAnswerId);
//       const codeComments = await codeCommentService.getAll();

//       const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
//       if (
//         isAllowedcommentAnswer(
//           commentAnswer,
//           codeComments,
//           allowedProjectFileIds
//         )
//       )
//         return await commentAnswerService.update(
//           commentAnswer,
//           commentAnswerId
//         );
//       else throw new Error("not allowed");
//     } catch (e) {
//       throw new Error("Can't update CommentAnswer");
//     }
//   }

//   @Mutation(() => CommentAnswer)
//   async deleteCommentAnswer(
//     @Arg("CommentAnswerId") commentAnswerId: number,
//     @Ctx() ctx: Context<TokenPayload>
//   ): Promise<CommentAnswer> {
//     try {
//       const commentAnswer = await commentAnswerService.getById(commentAnswerId);
//       const codeComments = await codeCommentService.getAll();

//       const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
//       if (
//         isAllowedcommentAnswer(
//           commentAnswer,
//           codeComments,
//           allowedProjectFileIds
//         )
//       )
//         return await commentAnswerService.delete(commentAnswerId);
//       else throw new Error("not allowed");
//     } catch (e) {
//       throw new Error("Can't delete CommentAnswer");
//     }
//   }
//}
