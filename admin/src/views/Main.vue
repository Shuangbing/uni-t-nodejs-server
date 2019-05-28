

<template>
<el-container style="height: 100vh;">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu router :default-openeds="$router.path" unique-opened :default-active="$router.path">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-school"></i>対応学校</template>
        <el-menu-item-group>
          <template slot="title">対応学校管理</template>
          <el-menu-item index="/schools/list">学校一覧</el-menu-item>
          <el-menu-item index="/schools/create">新規追加</el-menu-item>
        </el-menu-item-group>

      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-user"></i>ユーザー</template>
        <el-menu-item-group>
          <template slot="title">ユーザー管理</template>
          <el-menu-item index="/users/list">全てのユーザー</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>システム管理</template>
        <el-menu-item-group>
          <template slot="title">管理者</template>
          <el-menu-item index="/admins/list">管理者一覧</el-menu-item>
          <el-menu-item index="/admins/create">管理者追加</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="通知">
          <el-menu-item index="3-3">メール送信管理</el-menu-item>
        </el-menu-item-group>
        
      </el-submenu>
    </el-menu>
  </el-aside>
  
  <el-container>
    
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<style>
  .el-header {
    color: #333;
    line-height: 10px;
  }
  
  .el-aside {
    color: #333;
  }
</style>
