import { Request, Response } from "express";
import projectService from "../services/projectService";
import { fileManager } from "../tools/fileManager";

export const projectController = async (req: Request, res: Response) => {
  try {
    console.log(req);
    // Choper l'id du projet
    const { projectId } = req.params;
    const pid = parseInt(projectId, 10);
    // Choper les infos tu projet (getbyid)
    const [projet] = await projectService.getById(pid);

    // Obtenir le path du dossier projet
    const fileName: string = projet.id_storage_number;

    // Convertir l'ensemble du projet en archive Zip
    const pathZip = await fileManager.createZipFolder(fileName);
    // Lancer le download de l'archive coté client avec le path et le nom de l'archive
    res.download(pathZip, (err) => {
      if (err) {
        res.send({
          error: err,
          msg: "Problem downloading the file",
        });
      }
    });

    // Supprimer l'archive

    // PROJET
    // const project: iProject = await projectService.getById(projectId);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
