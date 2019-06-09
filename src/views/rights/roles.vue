<template>
  <div class="role">
    <!-- 路径导航--面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    </div>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" ref="addForm" :label-width="'120px'">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-top:15px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag
                  closable
                  :type="'success'"
                  @close="removeSingleRight(scope.row,first.id)"
                >{{first.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <el-row
                  v-for="second in first.children"
                  :key="second.id"
                  style="margin-bottom:15px"
                >
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        :type="'info'"
                        @close="removeSingleRight(scope.row,second.id)"
                      >{{second.authName}}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="18">
                    <div class="grid-content bg-purple-light">
                      <el-tag
                        closable
                        :type="'warning'"
                        v-for="third in second.children"
                        :key="third.id"
                        style="margin-right:5px;margin-bottom:15px"
                        @close="removeSingleRight(scope.row,third.id)"
                      >{{third.authName}}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有任何权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top-end">
            <el-button type="success" icon="el-icon-share" @click='showGrantDialog(scope.row)'></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="grantDialogFormVisible">
      <div class="rightListBox">
        <el-tree
          ref="rightTree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectedKeys"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoleList,
  removeRightByUserId,
  addRole,
  grantRoleSubmit
} from '@/api/role_index.js'
import { getAllRightList } from '@/api/rights_index.js'
export default {
  data () {
    return {
      roleId: '',
      // 角色数据
      roleList: [],
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogFormVisible: false,
      selectedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rightList: [],
      grantDialogFormVisible: false
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    async removeSingleRight (row, rightid) {
      let result = await removeRightByUserId(row.id, rightid)
      row.children = result.data.data
      console.log(row)
    },
    async getRoleList () {
      let result = await getAllRoleList()
      this.roleList = result.data
      console.log(this.roleList)
    },
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    // 添加角色
    async addRole () {
      let result = await addRole(this.addForm)
      console.log(result)
      if (result.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.addDialogFormVisible = false
        this.getRoleList()
      }
    },
    async showGrantDialog (row) {
      this.grantDialogFormVisible = true
      let result = await getAllRightList('tree')
      this.rightList = result.data.data
      this.roleId = row.id
      this.selectedKeys = []
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.selectedKeys.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    async grantRoleSubmit () {
      let allNodes = this.$refs.rightTree.getCheckedNodes()
      let arr = allNodes.map(value => {
        return value.id + ',' + value.pid
      })
      let ids = arr.join(',')
      let temp = ids.split(',')
      let finalIds = Array.from(new Set(temp))
      let result = await grantRoleSubmit(this.roleId, finalIds.join(','))
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.grantDialogFormVisible = false
        this.getRoleList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.rightListBox{
  height: 400px;
  overflow: scroll;
}
</style>
