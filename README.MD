## cocos creator build web 打包脚本

### 主要内容
1. web项目构建
2. css js文件压缩

### 准备工作
1. 安装nodejs ts-node 支持

2. npm install 安装必要依赖

3. 创建自己的运行参数配置 ./ExeConfig.ts
`
/**
 * 拷贝下面的内容 根据自己配置修改 保存为./ExeConfig.ts
 */
export let ExeConfig = {
    cocosCreatorExePath: 'E:/CreatorDir/CocosCreator/CocosCreator.exe',//可执行的CocosCreator.exe 路径
    projectPath: 'F:/myCocos/Demo'  //工程项目路径
}
`
### 运行方式
1. ts-node index.ts
2. 双击buildWeb.cmd