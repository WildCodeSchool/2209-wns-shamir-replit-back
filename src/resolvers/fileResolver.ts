import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { iFileCode, iFilesWithCode } from "../interfaces/InputType";
import { FileCode } from "../models/file.model";
import fileService from "../services/fileService";
import string from "string-sanitizer";
import { Project, ProjectShare } from "../models";
import projectService from "../services/projectService";
import { Context } from "apollo-server-core";
import { TokenPayload } from "../tools/createApolloServer";
import { fileManager } from "../tools/fileManager";
import { User } from "../models";
import projectShareService from "../services/projectShareService";
import { ProjToCodeFIle } from "../interfaces/IFiles";

type ReqFile = Omit<File, "userId"> & {
  userId: User;
  id_storage_file: string;
};

type ReqProject = Omit<Project, "userId"> & {
  userId: User;
};

type ReqProjectShare = Omit<ProjectShare, "userId" | "projectId"> & {
  userId: User;
  projectId: Project;
};

@Resolver(iFileCode)
export class FileResolver {
  @Query(() => [FileCode])
  async getAllFiles(@Ctx() ctx: Context<TokenPayload>): Promise<FileCode[]> {
    try {
      const files = await fileService.getAll();
      return files.filter((file) => file.userId === ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver les fichiers : Resolver");
    }
  }

  @Query(() => FileCode)
  async getFileById(
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode> {
    try {
      const file = await fileService.getById(fileId);
      if (file.userId !== ctx.id) throw new Error("non authorisé");
      return file;
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver un fichier par l'id : Resolver");
    }
  }

  @Mutation(() => FileCode)
  async createFile(
    @Arg("projectId") projectId: number,
    @Arg("name") name: string,
    @Arg("language") language: string,
    @Arg("clientPath") clientPath: string,
    @Arg("contentData") contentData: string,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode> {
    try {
      const userId = ctx.id;

      // On Stock un timestamp pour avoir un nom unique
      const timeStamp = Date.now();
      // On supprime les espaces et les caractères spéciaux du nom du projet
      const updateName = string.sanitize.keepNumber(name);

      const updateClientPath = clientPath
        .split("/")
        .map((str) => string.sanitize.keepNumber(str))
        .join("/")
        .replace(/\/+/g, "/");

      // On crée le nom du dossier avec le timestamp, le nom du projet et l'id de l'utilisateur
      const fileName = `${timeStamp}_${updateName}_${userId}`;
      const project: Project = (await projectService.getById(projectId))[0];
      // Création du fichier sur le serveur et dans la bdd
      return await fileService.create(
        userId,
        projectId,
        fileName,
        name,
        language,
        updateClientPath,
        contentData,
        project
      );
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas réussi à Créer un fichier : Resolver");
    }
  }

  @Mutation(() => FileCode)
  async updateFileCode(
    @Arg("file") file: iFileCode,
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode> {
    try {
      const _file = await fileService.getById(fileId);
      if (_file.userId !== ctx.id) throw new Error("non authorisé");

      return await fileService.update(file, fileId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update FileCode");
    }
  }

  @Mutation(() => FileCode)
  async deleteFileCode(
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ) {
    try {
      const _file = await fileService.getById(fileId);
      if (_file.userId !== ctx.id) throw new Error("non authorisé");

      const file: FileCode = await fileService.getById(fileId);

      const projectId = (file.projectId as unknown as Project).id;

      const project: Project = (await projectService.getById(projectId))[0];

      return await fileService.delete(fileId, project, file);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete FileCode");
    }
  }

  @Query(() => [FileCode])
  async getFilesByProjectId(
    @Arg("projectId") projectId: string,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode[]> {
    try {
      const projId = parseInt(projectId, 10);
      const project = (await projectService.getById(
        projId
      )) as unknown as ReqProject[];

      const projectShares =
        (await projectShareService.getAll()) as unknown as ReqProjectShare[];

      const thisUserCanView = projectShares.filter(
        (pshare) =>
          pshare.projectId.id === projId && pshare.userId.id === ctx.id
      );

      if (
        !project[0].isPublic &&
        project[0].userId.id !== ctx.id &&
        thisUserCanView.length === 0
      )
        throw new Error("non authorisé");

      const files = await fileService.getAllFilesByProId(projId);

      return files;
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver un fichier par l'id : Resolver");
    }
  }

  @Query(() => [iFilesWithCode])
  async getCodeFiles(
    @Arg("projectId") projectId: string,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<iFilesWithCode[]> {
    try {
      const projId = parseInt(projectId, 10);
      const [project] = (await projectService.getById(
        projId
      )) as unknown as ReqProject[];

      const projectShares =
        (await projectShareService.getAll()) as unknown as ReqProjectShare[];

      const thisUserCanView = projectShares.filter(
        (pshare) =>
          pshare.projectId.id === projId && pshare.userId.id === ctx.id
      );

      if (
        !project.isPublic &&
        project.userId.id !== ctx.id &&
        thisUserCanView.length === 0
      )
        throw new Error("non authorisé");

      const files = await fileService.getAllFilesByProId(projId);

      const minProject: ProjToCodeFIle = {
        projectId: project.id,
        path: project.id_storage_number,
      };

      const result: iFilesWithCode[] = await fileManager.getArrayCodeFile(
        minProject,
        files
      );

      return result;
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver un fichier par l'id : Resolver");
    }
  }

  @Mutation(() => String)
  async updateCodeFile(
    @Arg("projectId") projectId: number,
    @Arg("fileId") fileId: number,
    @Arg("contentData") contentData: string,
    @Ctx() ctx: Context<TokenPayload>
  ) {
    try {
      // de l'id du fichier pour verifier si le fichier existe
      // Verifier si le fichier appartient bien à l'utilisateur
      const projectShares =
        (await projectShareService.getAll()) as unknown as ReqProjectShare[];

      const thisUserCanEdit = projectShares.filter(
        (pshare) =>
          pshare.projectId.id === projectId &&
          pshare.userId.id === ctx.id &&
          pshare.write
      );

      const _file = (await fileService.getById(fileId)) as unknown as ReqFile;
      if (_file.userId.id !== ctx.id && thisUserCanEdit.length === 0)
        throw new Error("non authorisé");

      // Verifier si le fichier existe bien dans la bdd
      // Verifier si le fichier existe bien sur le serveur
      if (!_file.id_storage_file)
        throw new Error("Pas de fichier sur le serveur");

      const project: Project = (await projectService.getById(projectId))[0];

      await fileManager.updateContentData(
        project.id_storage_number,
        _file.id_storage_file,
        contentData,
        projectId
      );
      const result = {
        success: true,
      };
      return JSON.stringify(result);
    } catch (err) {
      throw new Error("Une erreur est survenue lors de l'update du code");
    }
  }
}
