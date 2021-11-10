## yapi-ts

### 演示
为前端项目生成请求代码


![](https://image-c.weimobwmc.com/static-resource/5aefd2b8a9ed45a0b1b0f5710483ba42.gif)

![](https://image-c.weimobwmc.com/static-resource/04c28cfe7d704d2895091bfe22b36a07.jpg)

### 使用方式
* yarn add yapi-ts
* npx yapi-ts --s src/api
* 安装[chrome商店yapi-ts插件（翻墙）](https://chrome.google.com/webstore/detail/yapi-ts/nojjmcbnjafgcfhfmopkdjgbmmaeadmm) 或者 [yapi-ts chrome插件.zip](https://c.weimobwmc.com/static-resource/dcd672cadfd94f319759433f14574109.zip)
* 打开yapi需要的接口页面, 点击生成代码

<hr />
<hr />
<hr />
<hr />
<hr />
<hr />
<hr />

## 提示

### 翻墙安装chrome插件
1. [yapi-ts安装](https://chrome.google.com/webstore/detail/yapi-ts/nojjmcbnjafgcfhfmopkdjgbmmaeadmm)

### 非翻墙安装chrome插件
1. 浏览器打开（[chrome扩展程序 chrome://extensions/](chrome://extensions/)）
2. 打开开发者模式
  ![](https://image-c.weimobwmc.com/static-resource/f2a6196d383e4ab1af50a0276ab22d32.jpg)
3. 下载[yapi ts chrome插件.zip](https://c.weimobwmc.com/static-resource/dcd672cadfd94f319759433f14574109.zip), 解压出文件夹
4. 将文件夹拖入chrome扩展程序页面
  ![](https://image-c.weimobwmc.com/static-resource/642bfd1f9377405d86b017c8c2925e94.jpg)
5. 安装完成
  ![](https://image-c.weimobwmc.com/static-resource/9fb96eac41214b2ba61bbf14e22aa642.png)

### vscode自动引入代码
1. 在项目根目录创建jsconfig.json（配置后, vscode默认插件能够自动import）

![](https://image-c.weimobwmc.com/static-resource/a880f1a8525d40cca4076497c24c0ac8.jpg)

![](https://image-c.weimobwmc.com/static-resource/2a5c9524cb894b5180d5ae998bf0f596.jpg)

  ``` json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
    },
    "target": "ES6",
    "module": "ES2015",
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "./src/**/*",
  ],
  "exclude": ["node_modules"]
}
  ```