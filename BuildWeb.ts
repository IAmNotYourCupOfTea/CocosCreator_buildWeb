import * as fs_extra from 'fs-extra'
import * as fs from 'fs'
import * as  uglifyjs from 'uglify-js'
import * as ClearCss from 'clean-css'
import * as path from 'path'
import { Tools } from './tools';
import { ExeConfig } from './ExeConfig';

class BuildWeb {

    private projectPath: string  //工程项目路径
    private tempProjet: string //实际操作的临时项目路径
    private outputWebPath: string //打包输出项目路径

    constructor() {
        this.projectPath = ExeConfig.projectPath
    }

    //项目同级目录
    private checkConfig() {
        console.log('校验脚本配置>>>')
        if (!fs.existsSync('./ExeConfig.ts')) {
            console.log('请检查是否有脚本运行配置文件 ./ExeConfig.ts')
            process.exit(1)
        }

        console.log('校验脚本配置完成')
        console.log('当前操作项目', this.projectPath)
    }


    build() {
        //配置文件校验
        this.checkConfig()
        //创建临时项目
        this.createtempProject()
        //web build
        return Tools.buildWebAsync(this.tempProjet)
            .then((webPath: string) => {
                this.outputWebPath = webPath
            })
            .then(() => {
                //css js 压缩
                return this.jsCssCompress(this.outputWebPath)
            })
            .then(() => {
                console.log(`${this.projectPath}  ${Tools.logTime()} 构建h5成功 输出路径:${this.outputWebPath}`)
            })
            .catch((e) => {
                console.error('打包错误', e)
                process.exit(-1)
            })


    }

    //创建临时项目
    private createtempProject() {
        console.log('创建临时项目>>>')
        this.tempProjet = `./output/project-${Date.now()}`
        const copyfiles = ['assets', 'build-templates', 'packages', 'settings', 'creator.d.ts', 'project.json', 'tsconfig.json']
        for (const file of fs_extra.readdirSync(this.projectPath)) {
            if (copyfiles.includes(file)) {
                fs_extra.copySync(`${this.projectPath}/${file}`, `${this.tempProjet}/${file}`)
            }
        }
        console.log('拷贝项目成功')
    }

    //js css 文件压缩
    private jsCssCompress(operaionDir: string) {

        let files = fs.readdirSync(operaionDir)

        let jsCompress = (filePath) => {
            return new Promise((reslove, reject) => {
                let content = fs.readFileSync(filePath).toString('utf8')
                let output = uglifyjs.minify(content)
                if (output.error) {
                    console.error('js压缩失败', filePath)
                    return reject(output.error)
                }
                fs.writeFileSync(filePath, output.code)
                console.log('js压缩成功', filePath)
                return reslove(filePath)
            })
        }

        let cssCompress = (filePath) => {
            return new Promise((reslove, reject) => {
                let content = fs.readFileSync(filePath).toString('utf-8')
                let output = new ClearCss().minify(content).styles
                if (!output) {
                    return reject('css compress fail')
                }
                console.log('css压缩成功', filePath)
                fs.writeFileSync(filePath, output)
                return reslove(filePath)
            })
        }

        let promiseList = []

        for (const file of files) {
            let filePath = `${operaionDir}/${file}`
            if (path.extname(file) == '.js') {
                promiseList.push(jsCompress(filePath))
            } else if (path.extname(file) == '.css') {
                promiseList.push(cssCompress(filePath))
            }
        }

        return Promise.all(promiseList)
    }

}

export { BuildWeb }