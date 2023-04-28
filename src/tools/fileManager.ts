import fs from "fs";
import string from "string-sanitizer";
import { FileCode, Project } from "../models";
import { ProjToCodeFIle, FilesCodeData } from "../interfaces/IFiles";
// import { ReqProject } from "../resolvers/projectResolver";
import { zip } from "zip-a-folder";
import { ioManager } from "../websocket/ioManager";
import { IProject } from "../interfaces/InputType";

type CreateOneSubFolderProps = {
  project: IProject;
  clientPath: string;
  subFolderName: string;
};

type UpdateContentDataProps = {
  projectPath: string;
  filepath: string;
  contentData: string;
  project_id: number;
  socketIds: string[];
  userEmail: string;
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

  updateContentData: async ({
    projectPath,
    filepath,
    contentData,
    project_id,
    socketIds,
    userEmail,
  }: UpdateContentDataProps) => {
    try {
      const fileToUpdate = `./projects/${projectPath}/${filepath}`;

      await ioManager.editorSocket({ project_id, socketIds, userEmail });

      fs.writeFileSync(fileToUpdate, contentData);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de modifier le fichier");
    }
  },

  getArrayCodeFile: async (project: ProjToCodeFIle, files: FileCode[]) => {
    const codeData: FilesCodeData[] = [];

    for (const file of files) {
      try {
        const filePath = `./projects/${project.path}/${file.id_storage_file}`;
        const code = await fs.promises.readFile(filePath, { encoding: "utf8" });

        codeData.push({
          id: file.id,
          projectId: project.projectId,
          name: file.name,
          language: file.language,
          code,
        });
      } catch (error) {
        console.error(`Error reading file ${file.id_storage_file}:`, error);
        throw new Error(
          `Unable to retrieve code for file ${file.id_storage_file}`
        );
      }
    }

    return codeData;
    // try {
    //   let tempPath: string;
    //   console.log("proj, files", project, files);

    //   const codeData: FilesCodeData[] = files.map((item) => {
    //     const fileWithCode: FilesCodeData = {
    //       id: item.id,
    //       projectId: project.projectId,
    //       name: item.name,
    //       language: item.language,
    //       code: "",
    //     };
    //     console.log(item.id_storage_file);

    //     tempPath = `./projects/${project.path}/${item.id_storage_file}`;
    //     const result = fs.readFileSync(tempPath, { encoding: "utf8" });
    //     console.log("resou", result);

    //     fileWithCode.code = result;
    //     return fileWithCode;
    //   });
    //   console.log("codedata", codeData);

    //   return codeData;
    // } catch (err) {
    //   throw new Error(
    //     "Impossible de recupérer le code d'un ou de plusieurs fichiers"
    //   );
    // }
  },

  createZipFolder: async (folderName: string) => {
    const date = Date.now();
    try {
      await zip(
        `./projects/${folderName}`,
        `./archives/${date}_${folderName}.zip`
      );
      return `./archives/${date}_${folderName}.zip`;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de zipper le dossier");
    }
  },

  deleteZipFolder: async () => {
    try {
      const pathToZip = `./archives/`;
      const start = Date.now();
      fs.readdir(pathToZip, (err, files) => {
        files.forEach((file) => {
          if (file === ".gitignore") return;
          const fileCreationDate = parseInt(file.split("_")[0]);
          const remainingTime = (start - fileCreationDate) / 1000 / 60;
          if (remainingTime > 5)
            fs.rmSync(`${pathToZip}/${file}`, { recursive: true, force: true });
        });
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de supprimer le dossier zip");
    }
  },
};
