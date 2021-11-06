const { Generator } = require("yapi-to-typescript/lib/cjs/Generator")
const { defineConfig } = require("yapi-to-typescript")
const fs = require("fs-extra")
const arg = require('arg');

const args = arg({
	// Types
	'--help': Boolean,
	'--version': Boolean,
  '--src': String,

	// Aliases
	'--s': '--src',
});
const srcPath = args["--src"] || "src/api"

const generator = new Generator(defineConfig([
  {
    serverUrl: "",
    typesOnly: false,
    target: "javascript",
    reactHooks: {
      enabled: false,
    },
    prodEnvName: "production",
    outputFilePath: (interfaceInfo) => `${srcPath}/${interfaceInfo.query_path.path.replace(/\/[^/]*$/, "").replace(/^\//, "")}.ts`,
    requestFunctionFilePath: `${srcPath}/request.ts`,
    dataKey: "data",
    projects: [
      {
        token: "",
        categories: [
          {
            id: 0,
            getRequestFunctionName(interfaceInfo, changeCase) {
              return changeCase.camelCase(
                `api${interfaceInfo.parsedPath.name}`,
              )
            },
          },
        ],
      },
    ],
  },
]))
/**
 * 生成ts
 * @param {*} {token, id}
 */
async function generate({ token, catId, origin } = {}) {
  let { requestFunctionFilePath } = generator.config[0]
  generator.config[0].serverUrl = origin
  generator.config[0].projects[0].token = token
  generator.config[0].projects[0].categories[0].id = Number(catId)
  requestFunctionFilePath = requestFunctionFilePath.replace(".ts", ".js")
  let requestCode
  try {
    requestCode = fs.readFileSync(requestFunctionFilePath).toString()
  } catch (e) {
    console.log(`读取不到${requestFunctionFilePath}, 将生成新的文件`)
  }
  const output = await generator.generate()
  await generator.write(output)
  if (requestCode) {
    fs.outputFileSync(requestFunctionFilePath, requestCode)
  }
}

module.exports = {
  generate,
}
