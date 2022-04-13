const { Generator } = require("yapi-to-typescript/lib/cjs/Generator")
const { defineConfig } = require("yapi-to-typescript")
const fs = require("fs-extra")
const arg = require('arg');

const args = arg({
	// Types
	'--help': Boolean,
	'--version': Boolean,
  '--src': String,
  '--dataKey': String,

	// Aliases
	'--s': '--src',
});
const srcPath = args["--src"] || "src/api"
const dataKey = args["--dataKey"] || ""

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
    dataKey,
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
  let requestCodeTemplate = `// TODO: 此文件由yapi-ts生成, 可以随意修改
  import service from "axios"
  
  export default function request(payload, options) {
    return service({
      url: options.mock ? payload.mockUrl + payload.path : payload.path,
      method: payload.method,
      data: payload.method === "POST" ? payload.data : {},
      params: payload.method === "GET" ? payload.data : {},
    })
  }
  `
  let oriRrequestCode
  try {
    oriRrequestCode = fs.readFileSync(requestFunctionFilePath).toString()
    console.log(`检测到已经存在${requestFunctionFilePath}, 将使用其作为公共请求函数`)
    console.log(`请参考默认 ${requestFunctionFilePath} 模版：`)
    console.log(requestCodeTemplate)
  } catch (e) {
    console.log(`读取不到${requestFunctionFilePath}, 将生成新的文件`)
  }
  const output = await generator.generate()
  await generator.write(output)
  fs.outputFileSync(requestFunctionFilePath, oriRrequestCode || requestCodeTemplate)
}

module.exports = {
  generate,
}
