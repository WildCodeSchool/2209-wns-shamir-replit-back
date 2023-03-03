import CronJob from "node-cron";

import { fileManager } from "../tools/fileManager";

const initScheduledJobs = () => {
  if (process.env.NODE_ENV !== "test") console.log("initScheduledJobs...");

  const every5min = "*/1 * * * *";

  const deleteZip = CronJob.schedule(every5min, () =>
    fileManager.deleteZipFolder()
  );

  deleteZip.start();
};

export default { initScheduledJobs };
