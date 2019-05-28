<template>
    <div>
        <h1>学校一覧</h1>
        <el-row :gutter="50">
        <el-col :span="50" v-for="(item, index) in items" :key="index">
        <el-card class="box-card">
        <div slot="header" class="clearfix">
        <span>{{item.name}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="$router.push('/schools/edit/'+item._id)">編集</el-button>
        </div>
        <el-tag v-if="item.supportList.useWlan">WLAN</el-tag>
        <el-tag v-if="item.supportList.useTimetable">時間割</el-tag>
        <el-tag v-if="item.supportList.useScore">成績照会</el-tag>
        <el-tag v-if="item.supportList.useAttend">出席登録</el-tag>
        </el-card>
        </el-col>
        </el-row>
</div>
</template>

<style>

  .el-tag{
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
    clear: both
  }

  .box-card {
    margin-bottom: 50px;
    width: 350px;
  }
</style>

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