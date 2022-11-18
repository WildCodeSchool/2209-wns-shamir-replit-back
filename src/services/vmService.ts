import { NodeVM, VMScript } from "vm2";

type ConsoleOutput = {
  type: "log" | "info" | "warn" | "error";
  message: string[];
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
    let consoleOutput: ConsoleOutput[] = [];
    const resultScript = new VMScript(code);
    vm.on("console.log", (...arg: string[]) => {
      consoleOutput = [...consoleOutput, { type: "log", message: arg }];
    });
    vm.on("console.info", (...arg: string[]) => {
      consoleOutput = [...consoleOutput, { type: "info", message: arg }];
    });
    vm.on("console.warn", (...arg: string[]) => {
      consoleOutput = [...consoleOutput, { type: "warn", message: arg }];
    });
    vm.on("console.error", (...arg: string[]) => {
      consoleOutput = [...consoleOutput, { type: "error", message: arg }];
    });
    vm.run(resultScript);
    return consoleOutput;
  } catch (err) {
    console.log(err);
  }
};

export default executeCode;
