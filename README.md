# mpvue

> 基于mpvue扩展的H5，小程序双端开发平台,
> 使用vue快速开发H5，开发完在小程序客户端修改，提升开发效率
> 内置H5开发，编译脚本
*** 实际案例
微信搜索 天际汽车
*** 注意事项

config/local.js 配置本地使用url 这个需要拷贝local.bak.js成local.js来使用

## Build Setup

``` bash
# 安装依赖
yarn

# 开发时构建
yarn dev
yarn devH5

# 打包构建
yarn build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
yarn dev:wx
yarn dev:swan
yarn dev:tt
yarn dev:my
yarn devH5

# 指定平台的打包构建
yarn build:wx
yarn build:swan
yarn build:tt
yarn build:my
yarn buildH5


# 生成 bundle 分析报告
npm run build --report
```
##项目目录介绍
 > build 微信的编译脚本

 > buildH5 H5的编译脚本

 > config 配置中心

    -- index.js 配置接口的映射

    -- local.js 配置本地使用url 这个需要拷贝local.bak.js成local.js来使用

> src 项目核心

    assets 由于小程序只支持iconfont，这次统一使用iconfont来处理，语法使用less，这块可以根据实际情况来调整
    common 放置一些工具类的函数
        functions 日期处理，url拼接，url参数获取，双端统一的goRouter方法
        validate
    components 自建UI库
    controllers 主要是router.js 配置页面初始化
    cssModules 自建UI库
    directive 这块主要是埋点，这块后续还需要优化
    lib 主要是geolocation对获取地理位置在小程序端和H5端做了封装
    pages 实际的视图文件
    plugin 主要是防止分享类
    router 设置实际的路由
    servies
        feedback 双端统一的交互类，通过MP方式调用
        storage 双端统一的存储类
        api 统一的API接口类。针对小程序登录会做异步等待处理
        MP 双端统一的请求类。同时挂载一些方法上去。
        request 小程序端的请求类
        wx_auth 小程序端的登录方法合集
    App.h5 h5的主入口视图
    App.wx 微信的主入口视图
    main.h5 h5的主入口JS
    main.wx 微信的主入口JS

> static 静态目录，小程序里的图标使用，H5可以通过配置buildH5里的express脚本来使用

### 项目特色
继承了mpvue双端开发的高效，同时全面踩坑。
项目目提供MP核心方法，提供mpvuePlatform全局变量做兼容性处理

| 方法 | 使用说明 |
| ------ | ------ | ------ |
| request | 微信端使用wx.request，h5端使用axios |
| MP.Loading | 加载动画 |
| MP.Tip | tip框 |
| MP.Confirm | 确认框 |
| MP.Alert | Alert框 |
| MP.getQuery | 获取当前页面的查询参数 |
| MP.goBack | 回到上一级页面 |
| MP.getPreiviousRoutename | 获取上一级页面的路由名字 |
| MP.getCurrentRouter | 获取当前路由 |


