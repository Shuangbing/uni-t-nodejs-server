import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
    baseURL: 'http://localhost:3000/admin/api'
})

http.interceptors.request.use(config => {
    if (localStorage.token) {
        config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config
})

http.interceptors.response.use(res => {
    if(res.data.message) {
        //console.log(res.data.data.message)
        Vue.prototype.$notify({
            title: '完了',
            message: res.data.message,
            type: 'success'
        })
    }
    return res
}, err => {
    if(err.response.data.message) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })
    }

    if(err.response.status === 422) {
        console.log('login!')
        router.push('/login')
    }
    return Promise.reject(err)
})

export default http
