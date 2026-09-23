/// <reference types="bun" />

import * as path from "path";
import * as fs from "fs/promises";
import * as child_process from "node:child_process";
import os from "os";
import { promisify } from "util";

const nswagConfig = {
  input: "http://localhost:5000/openapi/v1.json",
  output: "../frontend/src/api/generated.ts",
  template: "Fetch",
  operationGenerationMode: "MultipleClientsFromFirstTagAndOperationName",
  dateTimeType: "string",
  typeStyle: "Class",
  generateDtoTypes: false,
};

const cs2tsConfig = {
  inputDirectoryPath: path.join(__dirname, "..", "backend"),
  outputFilePath: path.join(__dirname, "..", "frontend", "src", "api", "dtos.ts"),
  tabSize: 2,
  clearOutputDirectory: true,
  convertDatesTo: "String",
  convertNullablesTo: "Null",
  quotationMark: "Double"
};

async function mainAsync(): Promise<void> {
  await removeIfExistsAsync(nswagConfig.output);

  console.log("Generating clients.");
  await executeCommandAsync(`
    nswag openapi2tsclient \
      /input:"${nswagConfig.input}" \
      /output:"${nswagConfig.output}" \
      /template:"${nswagConfig.template}" \
      /operationGenerationMode:"${nswagConfig.operationGenerationMode}" \
      /DateTimeType:"${nswagConfig.dateTimeType}" \
      /MarkOptionalProperties:false \
      /NullValue:Null \
      /TypeStyle:"${nswagConfig.typeStyle}" \
      /GenerateOptionalParameters:false \
      /GenerateDtoTypes:${nswagConfig.generateDtoTypes}
  `);

  if (nswagConfig.typeStyle === "Interface") {
    console.log("Replacing RequestDto/ResponseDto to IRequestDto/IResponseDto.");
    const dtoNamePattern = /([A-Z][a-zA-Z]+)(RequestDto|ResponseDto)/;
    const generatedFileContent = await fs.readFile(nswagConfig.output, { encoding: "utf-8" });
    const replacedFileContent = generatedFileContent.replace(dtoNamePattern, "I$1$2");
    await fs.writeFile(nswagConfig.output, replacedFileContent);
  }

  await generateDtoFilesAsync();

  await executeCommandAsync(`pnpm exec prettier ${nswagConfig.output} --config ../.prettierrc --write`);
}

async function generateDtoFilesAsync(): Promise<void> {
  // Retrieve source C# files to generate.
  const entries = await fs.readdir(cs2tsConfig.inputDirectoryPath, { recursive: true });
  const dtoFileNames = entries.filter(name => {
    if (path.basename(name).startsWith("I")) {
      return false;
    }

    return (
      name.endsWith("ResponseDto.cs") ||
      name.endsWith("RequestDto.cs") ||
      name.endsWith("ListSortingCriterion.cs")
    );
  });

  const tempFilePath = path.join(path.dirname(cs2tsConfig.outputFilePath), "temp.cs");
  await removeIfExistsAsync(tempFilePath);
  await removeIfExistsAsync(cs2tsConfig.outputFilePath);
  fs.mkdir(cs2tsConfig.outputFilePath, { recursive: true });
  console.log(tempFilePath);

  // Prepare temp file.
  for (let index = 0; index < dtoFileNames.length; index += 1) {
    const inputFilePath = dtoFileNames[index];
    const inputFileContent = await fs.readFile(
      path.join(cs2tsConfig.inputDirectoryPath, inputFilePath),
      { encoding: "utf-8" });
    const inputFileLines = inputFileContent.split(os.EOL);
    const filteredLines = inputFileLines
      .filter(line => {
        return (
          !line.startsWith("using") &&
          !line.startsWith("namespace") &&
          !line.includes("#region") &&
          !line.includes("#endregion")
        );
      })
      .map(line => line.replaceAll("public required", "public"));

    let joinedContent = filteredLines.join(os.EOL);
    if (index > 0) {
      joinedContent = joinedContent + os.EOL + os.EOL;
      joinedContent = joinedContent.trimStart();
    }

    await fs.appendFile(tempFilePath, joinedContent);
  }

  // Generate from temp file.
  let command = `
    dotnet cs2ts \
      -o ${cs2tsConfig.outputFilePath} \
      -ts ${cs2tsConfig.tabSize} \
      -d ${cs2tsConfig.convertDatesTo} \
      -n ${cs2tsConfig.convertNullablesTo} \
      -q ${cs2tsConfig.quotationMark} \
  `;

  if (cs2tsConfig.clearOutputDirectory) {
    command += " -c";
  }

  command += ` ${tempFilePath}`;

  await executeCommandAsync(command);

  // Replace interfaces into types.
  let generatedFileContent = await fs.readFile(cs2tsConfig.outputFilePath, { encoding: "utf-8" });
  const interfacePattern = /interface ([A-Z][a-zA-Z0-9]*)/g;
  generatedFileContent = generatedFileContent.replaceAll(interfacePattern, "type $1 =");
  generatedFileContent = generatedFileContent.replaceAll("}", "};");
  await fs.writeFile(cs2tsConfig.outputFilePath, generatedFileContent);
}

const execAsync = promisify(child_process.exec);
async function executeCommandAsync(command: string): Promise<void> {
  const { stdout, stderr } = await execAsync(command, { cwd: __dirname });
  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    console.log(stderr);
  }
}

async function removeIfExistsAsync(path: string): Promise<void> {
  await fs.rm(path, {
    recursive: true,
    force: true,
  });
}

mainAsync();
