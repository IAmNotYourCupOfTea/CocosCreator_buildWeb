
//vscode v1.52+ Promise<any>修复
declare interface PromiseConstructor {
    new <any>(executor: (resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void) => void): Promise<any>;
}