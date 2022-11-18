import { NodeVM, VMScript } from "vm2";

type ConsoleOutput = {
  log: string[];
  error: string[];
  warn: string[];
  info: string[];
};

const executeCode = async (code: string) => {
  const vm = new NodeVM({
    console: "redirect",
    timeout: 30000,
    require: {
      root: "./",
    },
  });

  try {
    const consoleOutput: ConsoleOutput = {
      log: [],
      info: [],
      error: [],
      warn: [],
    };
    const resultScript = new VMScript(code);
    vm.on("console.log", (...arg: string[]) => {
      console.log(`VM stdout: ${arg.join(" ")}`);
      consoleOutput.log = [...consoleOutput.log, ...arg];
    });
    vm.on("console.info", (...arg: string[]) => {
      console.info(`VM stdout: ${arg.join(" ")}`);
      consoleOutput.info = [...consoleOutput.info, ...arg];
    });
    vm.on("console.warn", (...arg: string[]) => {
      console.warn(`VM stdout: ${arg.join(" ")}`);
      consoleOutput.warn = [...consoleOutput.warn, ...arg];
    });
    vm.on("console.error", (...arg: string[]) => {
      console.error(`VM stdout: ${arg.join(" ")}`);
      consoleOutput.error = [...consoleOutput.error, ...arg];
    });
    vm.run(resultScript);
    console.log("cslOuput", consoleOutput.log);

    return consoleOutput;
  } catch (err) {
    console.log(err);
  }
};

export default executeCode;
