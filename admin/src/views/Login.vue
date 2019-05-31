<template>
    <div class="login-container">
        <el-card header="ログイン" class="login-card">
        <el-form @submit.native.prevent="login">
          <el-form-item label="メールアドレス">
          <el-input v-model="model.username" placeholder="メールアドレス" type="email"></el-input>
          </el-form-item>
          <el-form-item label="パスワード">
          <el-input v-model="model.password" placeholder="パスワード" type="password"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" native-type="submit">ログイン</el-button>
          </el-form-item>
        </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            model: {

            }
        }
    },
    methods: {
        async login(){
            const res = await this.$http.post('/login', this.model)
            localStorage.token = res.data.data.access_token
            this.$router.push('/')
            //this.$message({type: 'success', message: 'ログイン完了'})
        }
    },
}
</script>

<style>
.login-card{
    width: 25rem;
    margin: 10rem auto;
}
</style>