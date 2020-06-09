<!-- 集团用户查询 -->
<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container" style="border-bottom:1px solid #999;">
      <!-- <el-input v-model="listQuery.userNameOrPhone" placeholder="用户名/手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!--   <el-button v-waves="" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button> -->
      <el-button class="filter-item" style="margin-left: 100px; " type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <!-- table -->
    <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" :fit="true">
      <!-- <el-table-column type="selection" width="55" label='操作'/> -->
      <!--  <el-table-column label="创建人ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.createId }}
        </template>
      </el-table-column> -->
      <el-table-column prop="roleName" label="角色名称" width="" />
      <el-table-column prop="roleCode" label="角色简称" width="" />
      <el-table-column prop="dept.deptName" label="角色所属部门" width="" />
      <el-table-column prop="dr" label="删除标识" show-overflow-tooltip="">
        <template slot-scope="scope">
          {{ scope.row.dr===1?'已删除':'未删除' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" style="width:90px;" @click="handleRoleMenus(row)">
            分配菜单权限
          </el-button>

          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total&gt;0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑角色dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称  :" prop="roleName">
          <el-input v-model="temp.roleName" />
        </el-form-item>
        <el-form-item label="角色简称  :" prop="roleCode">
          <el-input v-model="temp.roleCode" />
        </el-form-item>
        <el-form-item label="角色所属部门:" prop="deptId">
          <el-select v-model="temp.deptId" class="filter-item" placeholder="请输入">
            <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 删除确认框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 菜单分配dialog -->
    <el-dialog :visible.sync="dialogMenuVisible" title="为角色分配菜单权限">
      <el-form ref="rolesForm" border="" fit="" highlight-current-row="" style="width: 100%">
        <el-form-item v-for="menu in RoleMenus" label="">
          <template>
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ menu.menuName }}</el-checkbox>
            <div style="margin:5px 0;" />
            <el-checkbox-group v-model="menuIds">
              <el-checkbox v-for="item in menu.children" :label="item.menuId" :checked="item.isSelect" @change="handleCheckedChange">{{ item.menuName }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">

        <el-button @click="dialogMenuVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="">
          确认
        </el-button> </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

import { fetchRolesList, saveRole, updateRole, deleteRole, getDepts, fetchAllMenuByRole } from '@/api/system'

const deptOptions = []
const RoleMenusOptions = []
export default {
  directives: { waves },

  components: { Pagination },
  data() {
    return {
      list: [],
      RoleMenusOptions: [],
      RoleMenus: [],
      menuIds: [],
      isIndeterminate: true,
      checkAll: false,
      total: 1,
      deleteThis: '',
      deptIds: '',
      deptOptions: '',
      delVisible: false, // 删除提示弹框的状态
      dialogMenuVisible: false, // 删除提示弹框的状态
      listQuery: {
        pageNum: 0,
        pageSize: 20

      },
      temp: {
        menuName: '',
        roleCode: '',
        deptId: ''
        // 新增用户数据
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        deptId: [{ type: 'number', message: '请选择', trigger: ['blur', 'change'] }],
        roleName: [{ required: true, message: '请选择', trigger: 'blur' }],
        roleCode: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    getList() {
      // 获取数据
      this.listLoading = true
      fetchRolesList(this.listQuery).then(response => {
        console.log(response.obj)
        this.list = response.obj.list
        this.total = response.obj.total
        console.log(this.list)
        // this.list = response.data.items
        // this.listLoading = false
      })
    },
    btnList() {
      // 搜索
      this.listLoading = true
      fetchDeptsList(this.listQuery).then(response => {
        console.log(response.obj)
        this.list = response.obj.list
        this.total = response.obj.total
        console.log(this.list)
        // this.list = response.data.items
        // this.listLoading = false
      })
    },

    getDept() {
      getDepts().then(response => {
        console.log(response.obj)
        this.deptOptions = []
        this.deptOptions = response.obj.list
        // this.list = response.obj.list
        // this.total = response.obj.total
        // console.log(this.list)
        // this.list = response.data.items
        // this.listLoading = false
      })
    },
    // 添加
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.getDept()
    },
    createData() {
      console.log('这是验证提交')
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.temp)
        if (valid) {
          saveRole(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新增数据成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('更新操作')
      this.getDept()
      // this.temp = Object.assign({}, row) // copy obj
      this.temp.deptId = row.deptId
      this.temp.roleId = row.roleId
      this.temp.roleName = row.roleName
      this.temp.roleCode = row.roleCode
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // this.$delete(tempData, 'dept')
          updateRole(tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.isReadOnly = false
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.delVisible = true// 显示删除弹框
      this.deleteThis = row.roleId
    },
    deleteRow() {
      deleteRole(this.deleteThis).then(response => {
        if (response.status == '200') {
          this.getList()
          this.$message.success('删除成功')
          this.deleteThis = ''
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      })
      this.delVisible = false// 关闭删除提示模态框
    },
    // 角色权限分配
    handleRoleMenus(row) {
      this.$forceUpdate()
      fetchAllMenuByRole(row.roleId).then(response => {
        this.RoleMenus = []
        if (response.status == '200') {
          this.$forceUpdate()
          this.RoleMenus = response.obj
          console.log('SHUJU ')
          console.log(this.RoleMenusOptions)
          console.log(this.RoleMenus)
          // this.$set(this.RoleMenus,isSelect, false)
          this.dialogMenuVisible = true// 弹框的状态
        }
        this.$nextTick(() => {
          this.$refs['rolesForm'] = []
        })
      }).catch(error => {
        console.log(error)
        this.$message.error('加载失败')
      })
    },
    handleCheckAllChange(val) {
      this.$forceUpdate()
      this.menuIds = val ? RoleMenusOptions : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      console.log(this.menuIds)
      const checkedCount = value.length
      alert(checkedCount)
      this.checkAll = checkedCount === this.menu.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.menu.length
    },

    resetTemp() {
      this.temp = {
        deptId: '',
        roleName: '',
        roleCode: ''
      }
    }

  }

}

</script>
  <style scoped="">

  .el-form-item label:after {
        content: "";
        display: inline-block;
        width: 100%;
    }

    .el-form-item__label {
        text-align: right;
        height: 50px;
    }

    .el-form-item.is-required .el-form-item__label:before {
        content: none !important;
    }

    .el-checkbox-group{
      border-bottom:1px solid #eee;
      padding-left:20px;
      margin-bottom:10px;
    }
    .el-checkbox-group:last-child{
      border-bottom:none;
      padding-left:20px;
    }
</style>
