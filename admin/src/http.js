import axios from 'axios'
import Vue from 'vue'

const http = axios.create({
    baseURL: 'http://localhost:3000/admin/api'
})

http.interceptors.response.use(res => {
    Vue.prototype.$message({
        type: 'success',
        message: res.data.message
    })
    return res
}, err => {
    Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message
    })
    return Promise.reject(err)
})

export default http
