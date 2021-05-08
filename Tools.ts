import { ExeConfig } from "./ExeConfig";
import * as child_process from 'child_process'

class Tools {
    //删除注释
    static clearComments(str: string) {
        let reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g //正则表达式
        return str.replace(reg, (word) => { // 去除注释后的文本
            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
        });
    }

    static logTime() {
        let date = new Date()
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':'
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        return Y + M + D + h + m + s
    }

    //cocos build web
    static buildWebAsync(project: string) {
        return new Promise((resolve, reject) => {
            console.log(project, '构建h5 >>>')
            let child = child_process.spawn(`${ExeConfig.cocosCreatorExePath}`,
                [
                    '--path',
                    project,
                    '--build',
                    '"platform=web-mobile"' //;debug=false
                ])
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);

            child.on('error', err => {
                console.error('构建h5失败', err)
                //reject(err)
            })
            child.on('exit', code => {
                if (code == 0) {
                    let web = `${project}/build/web-mobile`
                    console.log('构建h5', web)
                    return resolve(web)
                } else {
                    return reject(new Error('构建h5失败了'))
                }
            })
        }) as Promise<any>
    }


}

export { Tools }
// let project = 'xxx'
// let parms = `--path ${project} --build "platform=web-mobile;debug=false"`
// let list = parms.split(' ')

// console.log(list)