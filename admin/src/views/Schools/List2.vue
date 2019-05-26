<template>
    <div>
        <h1>学校一覧</h1>
        <el-table
    :data="items"
    border
    style="width: 100%;">
    <el-table-column
      fixed
      prop="name"
      label="学校名"
      width="300">
    </el-table-column>
    <el-table-column
      prop="hidden"
      label="公開中"
      width="200">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.hidden" disabled></el-switch>
      </template>
    </el-table-column>
    <el-table-column
      prop="support"
      label="登録可能"
      width="200">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.support" disabled></el-switch>
      </template>
    </el-table-column>
    <el-table-column
      prop="users"
      label="認証済ユーザ"
      width="150">
    </el-table-column>
    <el-table-column
      
      label="操作"
>     fixed
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">詳細</el-button>
        <el-button type="text" size="small">編集</el-button>
      </template>
    </el-table-column>
  </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            items: []
        }
    },
    methods: {
        async fetch(){
            const res = await this.$http.get('/schools')
            this.items = res.data.data
        }
    },
    created() {
        this.fetch()
    }
}
</script>