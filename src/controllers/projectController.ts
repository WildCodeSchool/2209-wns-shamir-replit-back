import projectService from "../services/projectService";
import { ExpressControllerFunction } from "../interfaces";
import { fileManager } from "../tools/fileManager";
import projectShareService from "../services/projectShareService";
import { User, ProjectShare } from "../models";

type ReqShare = Omit<ProjectShare, "userId" | "projectShare"> & {
  userId: User;
};

export const projectController: ExpressControllerFunction = async (
  req,
  res
) => {
  try {
    const { token } = req;
    if (token) {
      const { projectId } = req.params;
      const pid = parseInt(projectId, 10);

      const [projet] = await projectService.getById(pid);
      const projectShare = (await projectShareService.getUserCanView(
        pid
      )) as unknown as ReqShare[];
      const canView = projectShare.filter(
        (item) => item.userId.id === token.id
      );
      if (
        (projet.isPublic === false && projet.userId !== token.id) ||
        canView.length === 0
      )
        throw new Error("Vous n'avez pas accès à ce projet");
      const fileName: string = projet.id_storage_number;

      const pathZip = await fileManager.createZipFolder(fileName);
      res.download(pathZip, (err) => {
        if (err) {
          res.send({
            error: err,
            msg: "Problem downloading the file",
          });
        }
      });
    } else {
      res.status(500).send("Internal server error");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
