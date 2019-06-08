<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightList" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope='scope'>
              <span>{{scope.row.level | levelFormat}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/rights_index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  mounted () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      let result = await getAllRightList('list')
      this.rightList = result.data.data
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-table .warning-row {
  background: red;
}

.el-table .success-row {
  background: blue;
}
</style>
