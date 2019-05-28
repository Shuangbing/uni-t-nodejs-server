<template>
    <div>
        <h1>管理者{{id ? '編集' : '追加'}}</h1>
<el-form ref="form" :model="form" label-width="130px">
  <el-form-item label="メールアドレス">
    <el-input v-model="form.username" type="email"></el-input>
  </el-form-item>
  <el-form-item label="フルネーム">
    <el-input v-model="form.fullname"></el-input>
  </el-form-item>
  <el-form-item label="パスワード">
    <el-input v-model="form.password" type="password"></el-input>
  </el-form-item>
  
  <el-form-item>
    <el-button type="primary" @click="onSubmit">{{id ? '編集' : '新規追加'}}</el-button>
    <el-button @click="$router.go(-1)">戻る</el-button>
  </el-form-item>
</el-form>
    </div>
</template>

<script>
  export default {
    props: {
        id: {}
    },
    data() {
      return {
        form: {
          username: '',
          fullname: '',
      }
    }
    },
    methods: {
      async onSubmit() {
          let res;
          if(this.id){
            res = await this.$http.put('/admins/'+this.id, this.form)
          }else{
            res = await this.$http.post('/admins', this.form)
          }
          this.$router.push('/admins/list')
      },
      async fetch(){
          const res = await this.$http.get('/admins/'+this.id)
          this.form = res.data.data

      }
    },
    created() {
        if(this.id) {this.id && this.fetch()}
    },
  }
</script>