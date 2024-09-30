# Vue3 Template

一个开箱即用的 Vue3 + Vite 模板

## 目录结构

## 依赖包 & 功能

- pinia：全局状态管理
- axios：网络请求库
<!-- - vue3-carousel-rtl：Vue3轮播图组件 -->

## 主题色

主题色：蓝色 `#2348B8`

还有透明度

## 一些乱七八糟的实现项

还需要默认字体、图标、组件库、axios 封装、标准目录结构、移动端适配、上传与下载功能、错误提示（需要引入组件库

动画库

404 页面、缺省页、加载 loading、页面跳转 loading、接口 loading、登陆页面

权限管理、表格等内容的管理与生成、一些弹窗表单等业务组件、

一些搜索框组件、绑定回车 esc 事件等

现在需要 scss 中使用 tailwind 中的颜色变量，或者倒过来，tailwind 中使用 scss 中设置的变量

现在可以在 tw 中设置变量，然后在 css 中 通过 apply 的方式来进行引用

那么有几个问题

- 为什么要这样，方便在了哪里
  - 在行内写 twcss class，可以直接使用定制的颜色
  - 如果写行内样式，那么只能使用 hex 颜色等，不太方便
    - 解决方法就是不写行内样式，所有的一切都用 class 来进行管理
    - 那就需要一些常用的 css 名称等内容来方便起类名
  - TODO 现在需要的是 设置一些主题色，然后通过 apply 去在全局 scss 中引用
  - 这样一圈下来，先在 tw 中定义颜色，然后在 scss/css 中引用，只为了在行内样式中写颜色

需要设置全局的一些样式，比如主题色、字体大小等。这个可以放在 scss 中

但是即需要使用 css 的一些变量，也需要在 twcon 中设置，应该如何平衡

还需要啥呢

- ci/cd 的应用，把后端服务部署到本地内网服务器

还需要一个web ui，一个脚手架



```js

const handleNetworkError = (errStatus) => {
    let errMessage = '未知错误'
    if (errStatus) {
        switch (errStatus) {
            case 400:
                errMessage = '错误的请求'
                break
            case 401:
                errMessage = '未授权，请重新登录'
                break
            case 403:
                errMessage = '拒绝访问'
                break
            case 404:
                errMessage = '请求错误,未找到该资源'
                break
            case 405:
                errMessage = '请求方法未允许'
                break
            case 408:
                errMessage = '请求超时'
                break
            case 500:
                errMessage = '服务器端出错'
                break
            case 501:
                errMessage = '网络未实现'
                break
            case 502:
                errMessage = '网络错误'
                break
            case 503:
                errMessage = '服务不可用'
                break
            case 504:
                errMessage = '网络超时'
                break
            case 505:
                errMessage = 'http版本不支持该请求'
                break
            default:
                errMessage = `其他连接错误 --${errStatus}`
        }
    } else {
        errMessage = `无法连接到服务器！`
    }
```

## Todo List

- 为了保持其一致性，需要有个插件，将 css 中的变量
