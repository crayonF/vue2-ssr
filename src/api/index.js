import http from './http'

export default {
    getUserInfo() {
        // return http({
        //     url: '/api/user/getUserInfo',
        //     method: 'get'
        // })
        return Promise.resolve({
            name: '张三',
            age: 18
        })
    },
}
