#!/usr/bin/env node

const Koa = require("koa")
const cors = require("koa2-cors")
const koaBody = require("koa-body")
const router = require("./router")

const app = new Koa()

app.use(cors({
  origin: "*",
}))
app.use(koaBody({
  jsonLimit: "1kb",
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(25100)
console.log("yapi-ts已启动（https://www.npmjs.com/package/yapi-ts）")