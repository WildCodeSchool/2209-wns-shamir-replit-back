import { io } from "../index";

type EditorSocketProps = {
  project_id: number;
  socketIds: string[] | undefined;
  userEmail: string;
};

type CoworkerSocketProps = {
  socketIds: string[];
  coworker: Coworker;
};

export type Coworker = {
  name: string;
  project_id: number;
  userId: number;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  socketIds: string[];
};

let coworkers: Coworker[] = [];

export const ioManager = {
  editorSocket: async ({
    project_id,
    socketIds,
    userEmail,
  }: EditorSocketProps) => {
    const sockets = await io.fetchSockets();
    sockets.map((socket) => {
      const socketProjectId = socket.handshake.query.project_id;
      const socketUserEmail = socket.handshake.query.userEmail;

      if (
        socketProjectId === project_id.toString() &&
        !socketIds?.includes(socket.id) &&
        userEmail !== socketUserEmail
      ) {
        socket.emit("refresh editor", userEmail);
      }
    });
  },
  coworkerSocket: async ({ socketIds, coworker }: CoworkerSocketProps) => {
    coworkers = [
      ...coworkers.filter((cw) => cw.userId !== coworker.userId),
      { ...coworker, socketIds },
    ];

    const sockets = await io.fetchSockets();
    sockets.map((socket) => {
      const socketProjectId = socket.handshake.query.project_id;

      if (
        socketProjectId === coworker.project_id.toString() &&
        !socketIds?.includes(socket.id)
      ) {
        socket.emit(
          "refresh cursor",
          coworkers.filter((cw) => cw.project_id === parseInt(socketProjectId))
        );
      }
    });
  },
  clearCoworkers: (socketId: string) => {
    coworkers = coworkers.filter((cw) => !cw.socketIds.includes(socketId));
  },
};

// export const updateWebsockets: ControllerFunction = async (req, res) => {
//   try {
//     const controller = req.websocket?.controller;
//     const reqWebsocket = req.websocket;
//     const reqAnswer = req.answer;
//
//     if (reqWebsocket) {
//       if (controller === "placement_dataController") {
//         const { id_placement, id_placement_data, socketIds } = reqWebsocket;
//         await ioManager.placement_dataController({
//           id_placement,
//           id_placement_data,
//           socketIds,
//         });
//       }
//
//       if (controller === "placementController") {
//         const { id_placement, id_placement_data, socketIds } = reqWebsocket;
//         await ioManager.placementController({
//           id_placement,
//         });
//       }
//
//       if (controller === "copyPlacementController") {
//         const { id_placement, socketIds } = reqWebsocket;
//         await ioManager.copyPlacementController({
//           id_placement,
//         });
//       }
//
//       if (controller === "mergeOperateurController") {
//         await ioManager.mergeOperateurController();
//       }
//
//       if (controller === "createCustomOperateurController") {
//         const { date_debut, socketIds } = reqWebsocket;
//         await ioManager.createCustomOperateurController({
//           date_debut,
//           socketIds,
//         });
//       }
//     }
//
//     if (reqAnswer) res.status(reqAnswer.status).send(reqAnswer.body);
//     else throw new Error("reqAnswer empty");
//   } catch (err) {
//     console.error(err);
//     res.sendStatus(500);
//   }
// };
