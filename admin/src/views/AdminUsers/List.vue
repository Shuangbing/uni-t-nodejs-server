<template>
    <div>
        <h1>管理者一覧</h1>
    <el-table
    :data="items"
    border
    style="width: 100%;">
    <el-table-column
      prop="username"
      label="メールアドレス"
      >
    </el-table-column>
    <el-table-column
      prop="fullname"
      label="フルネーム"
      >
    </el-table-column>
    <el-table-column
      prop="lastlogin"
      label="最終ログイン"
      >
      <template slot-scope="scope">
        <div>
          {{ scope.row.lastlogin | dateformat() }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="$router.push('/admins/edit/'+scope.row._id)">編集</el-button>
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
            const res = await this.$http.get('/admins')
            this.items = res.data.data
        }
    },
    created() {
        this.fetch()
    }
}
</script>