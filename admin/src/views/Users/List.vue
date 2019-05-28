<template>
    <div>
        <h1>ユーザ一覧</h1>
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
      prop="school.name"
      label="学校名"
      >
    </el-table-column>
    <el-table-column
      prop="unicoin"
      label="ユニコイン"
      
      >
    </el-table-column>
    <el-table-column
      prop="unicoin"
      label="操作">
      <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="$router.push('/users/edit/'+scope.row._id)">編集</el-button>
      </template>
    </el-table-column>
  </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            items: [],
            schools: [],
            
        }
    },
    methods: {
        async fetch(){
            const res_schools = await this.$http.get('/schools')
            const res_user = await this.$http.get('/users')
            this.items = res_user.data.data
            this.schools = res_schools.data.data
        }
    },
    created() {
        this.fetch()
    }
}
</script>