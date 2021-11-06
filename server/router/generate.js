async function getParams () {
  const [_, projectId = "", _1, catidOrApiId = ""] = location.pathname.match(/project\/(\d+)\/(interface\/api\/((cat\_)?\d+))?/) || []
  let catId = catidOrApiId.startsWith("cat_") ? catidOrApiId.replace("cat_", "") : await getCatId(catidOrApiId)
  const token = await getToken(projectId)
  return {projectId, catId, token}
}
async function getCatId (apiId) {
  if (!apiId) return "0"
  return await fetch(`${location.origin}/api/interface/get?id=${apiId}`).then(res => {
    return res.text()
  }).then(res => {
    return JSON.parse(res).data.catid
  })
}
async function getToken(projectId){
  if (!projectId) throw new Error("请选择项目")
  return await fetch(`${location.origin}/api/project/token?project_id=${projectId}`).then(res => {
    return res.text()
  }).then(res => {
    return JSON.parse(res).data
  })
}
await getParams()

