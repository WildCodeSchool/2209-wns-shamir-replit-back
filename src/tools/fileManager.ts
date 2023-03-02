import fs from "fs";
import string from "string-sanitizer";
import { FileCode, Project } from "../models";
import { ProjToCodeFIle, FilesCodeData } from "../interfaces/IFiles";
import { ReqProject } from "../resolvers/projectResolver";
import { zip } from "zip-a-folder";

type CreateOneSubFolderProps = {
  project: ReqProject;
  clientPath: string;
  subFolderName: string;
};

export const fileManager = {
  // Folders functions

  createProjectFolder: async (folderName: string) => {
    try {
      // On stock le chemin du dossier dans une variable
      const sourceDir = "./projects/";
      // On créer le chemin de création du dossier
      const pathToCreate = `${sourceDir}${folderName}`;

      // Fonction de NodeJS qui permet de créer un dossier avec une gestion d'erreur
      // On verifie si le dossier existe
      if (!fs.existsSync(pathToCreate)) fs.mkdirSync(pathToCreate);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le dossier du projet");
    }
  },

  deleteProjectFolder: async (folderName: string): Promise<void> => {
    try {
      const sourceDir = "./projects/";
      const pathToDelete = `${sourceDir}${folderName}`;
      fs.rmSync(pathToDelete, { recursive: true, force: true });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible d'effacer le dossier du projet");
    }
  },

  // SubFolders functions

  createFolderTree: async (project: Project, clientPath: string) => {
    const splittedPath = clientPath.split("/").filter((str) => str.length > 0);

    let fullPath = `./projects/${project.id_storage_number}/`;

    splittedPath.map((folder) => {
      const pathToCreate = `${fullPath}${folder}/`;

      if (!fs.existsSync(pathToCreate)) fs.mkdirSync(pathToCreate);

      fullPath = pathToCreate;
    });
  },

  createOneSubFolder: async ({
    project,
    clientPath,
    subFolderName,
  }: CreateOneSubFolderProps) => {
    try {
      // On nettoi le nom du sous-dossier
      const updateSubName: string = string.sanitize.keepNumber(subFolderName);
      // On créer un variable qui contiendra le chemin de création du sous-dossier
      let pathToCreate: string;
      // On Créer une gestion d'arborescence pour les sous-dossiers
      if (clientPath) {
        pathToCreate = `./projects/${project.id_storage_number}/${clientPath}/${updateSubName}`;
      } else {
        pathToCreate = `./projects/${project.id_storage_number}/${updateSubName}`;
      }
      // On verifie si le dossier existe
      if (!fs.existsSync(pathToCreate)) fs.mkdirSync(pathToCreate);
      return project as unknown as Project;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le sous-dossier du projet");
    }
  },

  // Files functions
  createOneFile: async (
    project: Project,
    id_storage_file: string,
    contentData: string
  ) => {
    try {
      const fileToCreate = `./projects/${project.id_storage_number}/${id_storage_file}`;

      fs.writeFileSync(fileToCreate, contentData);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer un fichier");
    }
  },

  deleteOneFile: async (project: Project, file: FileCode) => {
    try {
      const pathToDelete = `./projects/${project.id_storage_number}${file.id_storage_file}`;

      fs.unlinkSync(pathToDelete);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le fichier");
    }
  },

  updateContentData: async (
    projectPath: string,
    filepath: string,
    contentData: string
  ) => {
    try {
      const fileToUpdate = `./projects/${projectPath}/${filepath}`;
      fs.writeFileSync(fileToUpdate, contentData);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de modifier le fichier");
    }
  },

  getArrayCodeFile: async (project: ProjToCodeFIle, files: FileCode[]) => {
    try {
      let tempPath: string;

      const codeData: FilesCodeData[] = files.map((item) => {
        const fileWithCode: FilesCodeData = {
          id: item.id,
          projectId: project.projectId,
          name: item.name,
          language: item.language,
          code: "",
        };

        tempPath = `./projects/${project.path}/${item.id_storage_file}`;
        const result = fs.readFileSync(tempPath, { encoding: "utf8" });
        fileWithCode.code = result;
        return fileWithCode;
      });

      return codeData;
    } catch (err) {
      throw new Error(
        "Impossible de recupérer le code d'un ou de plusieurs fichiers"
      );
    }
  },

  createZipFolder: async (folderName: string) => {
    try {
      await zip(`./projects/${folderName}`, `./archives/${folderName}.zip`);
      return `./archives/${folderName}.zip`;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de zipper le dossier");
    }
  },
};
