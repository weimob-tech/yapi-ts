chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async function () {
    if (request.action === "doCreate") {
      try {
        await doCreate()
        sendResponse({
          step: "success",
          message: "代码生成成功",
        })
      } catch (e) {
        sendResponse({
          step: "error",
          message: e.message || "出现异常",
        })
        console.error(e)
      }
    }
  }())
  return true
})

async function doCreate() {
  const { token, catId, origin } = await getParams()
  try {
    await fetch("http://localhost:25100/generate", {
      method: "POST",
      body: JSON.stringify({
        token,
        catId,
        origin,
      }),
    })
  } catch (e) {
    console.log(e)
    throw new Error("本地服务未启动, 无法生成api模块, 请查看 npm: yapi-ts")
  }
}

async function getParams() {
  const [_, projectId = "", _1, catidOrApiId = ""] = location.pathname.match(/project\/(\d+)\/(interface\/api\/((cat\_)?\d+))?/) || []
  const catId = catidOrApiId.startsWith("cat_") ? catidOrApiId.replace("cat_", "") : await getCatId(catidOrApiId)
  const token = await getToken(projectId)
  return {
    projectId, catId, token, origin: location.origin,
  }
}

async function getCatId(apiId) {
  if (!apiId) return "0"
  return await fetch(`${location.origin}/api/interface/get?id=${apiId}`).then((res) => res.text()).then((res) => JSON.parse(res).data.catid)
}
async function getToken(projectId) {
  if (!projectId) throw new Error("请打开yapi项目页面")
  return await fetch(`${location.origin}/api/project/token?project_id=${projectId}`).then((res) => res.text()).then((res) => JSON.parse(res).data)
}
