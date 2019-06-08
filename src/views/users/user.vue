<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" @keyup.enter.native='serachUser' clearable v-model="query" class="input-with-select searchBox">
        <el-button slot="append" icon="el-icon-search" @click='serachUser'></el-button>
      </el-input>
      <el-button type="success" plain @click="adduser">添加用户</el-button>
    </div>
    <!-- 数据展示区域 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatu($event,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
            <el-button type="success" icon="el-icon-share" @click="showGrantRoleDialog(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加层 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="addrules" ref="addForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="conpass">
          <el-input v-model="addForm.conpass" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑层 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色层 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form :model="roleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="roleForm.username" auto-complete="off" style="width:222px" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="roleForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
  </div>
</template>
<script>
import {
  getUserList,
  editUser,
  delUserById,
  updateUserStatuById,
  addUser
} from '@/api/index.js'
import { getAllRoleList, editRole } from '@/api/role_index.js'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addForm.conpass !== '') {
          this.$refs.addForm.validateField('conpass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      // 用户状态
      userstatu: true,
      // 用户搜索关键字
      query: '',
      //   当前页码
      pagenum: 1,
      // 每页显示的记录数
      pagesize: 1,
      // 表格数据源
      userList: [],
      editDialogFormVisible: false, // 编辑层不显示
      formLabelWidth: '120px', // 表单label的宽度
      editForm: {
        username: '',
        mobile: '',
        email: ''
      },
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      roleDialogFormVisible: false, // 角色分配层不显示
      roleList: [],
      roleForm: {
        id: '',
        username: '',
        rid: ''
      },
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        conpass: '',
        email: '',
        mobile: ''
      },
      addrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
        conpass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    serachUser () {
      this.init() // 搜索功能
    },
    adduser () {
      this.addDialogFormVisible = true
    },
    addSubmit () {
      console.log(this.addForm)
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm).then(result => {
            this.init()
            this.addDialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    roleSubmit () {
      console.log(this.roleForm)
      editRole(this.roleForm).then(result => {
        this.init()
        this.roleDialogFormVisible = false
      })
    },
    showGrantRoleDialog (data) {
      console.log(data)
      this.roleDialogFormVisible = true
      this.roleForm.username = data.username
      this.roleForm.rid = data.role_name
      this.roleForm.id = data.id
    },
    changeStatu (type, id) {
      updateUserStatuById(id, type).then(result => {
        if (result.meta.status === 200) {
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
        }
      })
    },
    del (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id).then(result => {
            if (result.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        })
        .catch(() => {})
    },
    editSubmit () {
      // console.log(this.$refs.editForm)
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm).then(result => {
            this.init()
            this.editDialogFormVisible = false
          })
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    showEditDialog (data) {
      // console.log(data)
      this.editDialogFormVisible = true
      this.editForm.id = data.id
      this.editForm.mobile = data.mobile
      this.editForm.email = data.email
      this.editForm.username = data.username
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },
    init () {
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        // console.log(result)
        this.userList = result.data.users
        this.total = result.data.total
      })
    }
  },
  mounted () {
    this.init()
    getAllRoleList().then(result => {
      console.log(result)
      this.roleList = result.data
    })
  }
}
</script>
<style lang="less" scoped>
.searchBox {
  width: 300px;
  margin-right: 10px;
}
</style>
