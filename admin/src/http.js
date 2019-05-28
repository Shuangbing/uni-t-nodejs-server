import axios from 'axios'
import Vue from 'vue'

const http = axios.create({
    baseURL: 'http://localhost:3000/admin/api'
})

http.interceptors.request.use(config => {
    config.headers.Authorization = 'Bearer '+localStorage.token
    return config
})

http.interceptors.response.use(res => {
    return res
}, err => {
    Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message
    })
    return Promise.reject(err)
})

export default http
