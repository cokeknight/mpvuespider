declare namespace mp {
  interface Storage {
    getAllKeys: () => { keys: Array<string>, currentSize?: number, limitSize?: number },
    set: (key: string, value: any) => void,
    // 获取值，返回字符串
    get: (key: string) => any,
    // 支持字符串和数组
    remove: (key: string | string[]) => void,
    clear: () => void,
    checkMemory: () => void
  }
  interface shareConfig{
    title: string,
    desc: string,
    link: string,
    imgUrl: string
  }
}
declare var NODE_ENV: any
declare var PLATFORM_H5: any
declare var mpvuePlatform: any
declare var window: any
declare module "storage" {
  let storage: mp.Storage;
  export = storage
}
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
