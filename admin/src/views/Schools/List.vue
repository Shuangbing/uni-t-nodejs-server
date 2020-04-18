<template>
  <div>
    <h1>学校一覧</h1>
    <el-table :data="items" style="width: 100%">
      <el-table-column prop="name" label="学校名"></el-table-column>
      <el-table-column label="対応機能">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.supportList.useWlan">WLAN</el-tag>
          <el-tag v-if="scope.row.supportList.useTimetable">時間割</el-tag>
          <el-tag v-if="scope.row.supportList.useScore">成績照会</el-tag>
          <el-tag v-if="scope.row.supportList.useAttend">出席登録</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="$router.push(`/schools/edit/${scope.row._id}`)">編集</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
.el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin-bottom: 50px;
  width: 350px;
}
</style>

<script>
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("/schools");
      this.items = res.data.data;
    }
  },
  created() {
    this.fetch();
  }
};
</script>