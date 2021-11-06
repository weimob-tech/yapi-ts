const Router = require("@koa/router")
const { generate } = require("../service/generate")

const router = new Router()
router.post("/generate", async (ctx, next) => {
  console.log("开始生成代码")
  await generate(JSON.parse(ctx.request.body))
  console.log("生成成功")
  ctx.body = {
    success: true,
  }
})
module.exports = router
