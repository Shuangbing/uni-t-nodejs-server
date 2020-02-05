<template>
  <div>
    <h1>学校{{id ? '編集' : '追加'}}</h1>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="学校名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="ファイル名">
        <el-input v-model="form.actionFile"></el-input>
      </el-form-item>
      <el-form-item label="表示停止">
        <el-switch v-model="form.hidden"></el-switch>
      </el-form-item>
      <el-form-item label="一般登録">
        <el-switch v-model="form.support"></el-switch>
      </el-form-item>
      <el-form-item label="対応機能">
        <el-checkbox label="時間割同期" v-model="form.supportList.useTimetable"></el-checkbox>
        <el-checkbox label="無線LAN認証" v-model="form.supportList.useWlan"></el-checkbox>
        <el-checkbox label="成績照会" v-model="form.supportList.useScore"></el-checkbox>
        <el-checkbox label="出席登録" v-model="form.supportList.useAttend"></el-checkbox>
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
        name: "",
        hidden: false,
        support: true,
        supportList: {
          useWlan: true,
          useAttend: true,
          useScore: true,
          useTimetable: true
        }
      }
    };
  },
  methods: {
    async onSubmit() {
      if (this.id) {
        await this.$http.put("/schools/" + this.id, this.form);
      } else {
        await this.$http.post("/schools", this.form);
      }
      this.$router.push("/schools/list");
    },
    async fetch() {
      const res = await this.$http.get("/schools/" + this.id);
      this.form = res.data.data;
    }
  },
  created() {
    if (this.id) {
      this.id && this.fetch();
    }
  }
};
</script>