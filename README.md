## yapi-ts

### 演示
为前端项目生成请求代码


![](https://image-c.weimobwmc.com/static-resource/5aefd2b8a9ed45a0b1b0f5710483ba42.gif)

![](https://image-c.weimobwmc.com/static-resource/474a20c0027c4c3d85187488ca054c48.jpg)

### 使用方式
* npx yapi-ts --s src/api
* 安装[yapi-ts chrome插件.zip](https://c.weimobwmc.com/static-resource/dcd672cadfd94f319759433f14574109.zip)
* 打开yapi需要的接口页面, 点击生成代码

<hr />
<hr />
<hr />
<hr />
<hr />
<hr />
<hr />

## 提示
### 安装chrome插件
1. 浏览器打开（[chrome扩展程序 chrome://extensions/](chrome://extensions/)）
2. 打开开发者模式
  ![](https://image-c.weimobwmc.com/static-resource/39bac812cad94de88212023f01473504.jpg)
1. 下载[yapi ts chrome插件.zip](https://c.weimobwmc.com/static-resource/dcd672cadfd94f319759433f14574109.zip), 将zip解压
2. 将文件夹拖入chrome扩展程序页面
  ![](https://image-c.weimobwmc.com/static-resource/70cf10a789734f0daf93846e1513cd30.jpg)
  

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
    "module": "{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/vue_app/*"],
      "CoPackageProcessEdit/*": ["src/vue_app/views/mcp/cockpit/CoPackageProcessEdit/*"],
      "ACoPackageProcessEdit/*": ["src/vue_app/views/mcp/ACoPackageProcessEdit/*"]
    },
    "target": "ES6",
    "module": "ES2015",
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "./src/vue_app/**/*",
    "./src/react_app/**/*"
  ],
  "exclude": ["node_modules"]
}
",
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "./src/**/*",
  ],
  "exclude": ["node_modules"]
}
  ```