<template>
    <div>
        <h1>ユーザ{{id ? '編集' : '追加'}}</h1>
<el-form ref="form" :model="form" label-width="130px">
  <el-form-item label="メールアドレス">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
  <el-form-item label="所属学校">
  <el-select v-model="form.school" placeholder="请选择">
    <el-option
      v-for="item in school_data"
      :key="item._id"
      :label="item.name"
      :value="item._id">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="ユニコイン">
    <el-input-number v-model="form.unicoin" controls-position="right" :min="0" :max="1000"></el-input-number>
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
          school: '',
          unicoin: 0
      },
        school_data: {}
    }
    },
    methods: {
      async onSubmit() {
          let res = await this.$http.put('/users/'+this.id, this.form)
          this.$router.push('/users/list')
      },
      async fetch(){
          const res = await this.$http.get('/users/'+this.id)
          const res2 = await this.$http.get('/schools')
          this.school_data = res2.data.data
          this.form = res.data.data

      }
    },
    created() {
        if(this.id) {this.id && this.fetch()}
    },
  }
</script>