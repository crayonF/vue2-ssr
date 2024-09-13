import Axios from 'axios'
const $http = Axios.create()

$http.defaults.baseURL = 'http://dev.xxxx.com'

// 添加请求拦截器
$http.interceptors.request.use(function (config) {
    return config
}, function (error) {
    // doSomething
    return Promise.reject(error)
})

// 添加响应拦截器
$http.interceptors.response.use(function (response) {
// 对响应数据做点什么
    if (response.data) {
        // dosomething
    }
    return response
}, function (error) {
// 对响应错误做点什么
    if (error && error.response) {
        switch (error.response.status) {
        case 400:
            error.message = '错误请求'
            break
        case 500:
            error.message = '服务端出错'
            break
        default:
            error.message = `连接错误${error.response.status}`
        }
    } else {
        error.message = '网络出现问题，请稍后再试'
    }
    return Promise.resolve(error)
})
export default $http