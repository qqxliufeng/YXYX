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
      <el-button class="filter-item" style="margin-left:50px; " type="primary" icon="" @click="delAll">
        批量删除
      </el-button>
    </div>
    <!-- table -->
    <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" label="操作" />
      <el-table-column label="创建人ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.createId }}
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门名称" width="" />
      <el-table-column prop="dr" label="删除标识" show-overflow-tooltip="">
        <template slot-scope="scope">
          {{ scope.row.dr===1?'已删除':'未删除' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip="">
        <template slot-scope="scope">
          {{ scope.row.status===1?'禁用':'正常' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>

        <!--   <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total&gt;0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="部门名称  :" prop="deptName">
          <el-input v-model="temp.deptName" />
        </el-form-item>
        <el-form-item label="部门编码  :" prop="deptCode">
          <el-input v-model="temp.deptCode" οnkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')" clearable />
        </el-form-item>
        <el-form-item label="上一级部门:" prop="parentDeptId">
          <el-select v-model="temp.parentDeptId" class="filter-item" placeholder="请输入">
            <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门状态 :" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="0">
              正常
            </el-radio>
            <el-radio :label="1">
              禁用
            </el-radio>
          </el-radio-group>
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

    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
    <!--  <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border="" fit="" highlight-current-row="" style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">
          Confirm
        </el-button> </span>
    </el-dialog> -->
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

import { fetchDeptsList, searchList, getDepts, saveDept, updateDept, deleteDepts } from '@/api/system'

const deptOptions = []
const roleNameOptions = []
// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  directives: { waves },

  components: { Pagination },
  data() {
    return {
      list: [],
      total: 1,
      multipleSelection: [],
      deptIds: '',
      deptOptions: '',
      delVisible: false, // 删除提示弹框的状态
      isReadOnly: false,
      listQuery: {
        pageNum: 0,
        pageSize: 20

      },
      temp: {
        parentDeptId: '',
        // deptId:'',
        deptName: '',
        deptCode: '',
        status: ''
        // 新增用户数据
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        // deptId: [{ type: 'number', message: '请选择', trigger: ["blur",'change']}],
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        deptName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        deptCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        parentDeptId: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
      fetchDeptsList(this.listQuery).then(response => {
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
    handleFilter() {
      this.listQuery.pageNum = 1
      this.btnList()
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
          saveDept(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('更新操作')
      console.log(row)
      console.log(this.temp)
      this.getDept()
      // this.temp = Object.assign({}, row) // copy obj
      this.temp.deptId = row.deptId
      this.temp.deptName = row.deptName
      this.temp.parentDeptId = row.parentDeptId
      this.temp.deptCode = row.deptCode
      this.temp.status = row.status
      console.log(this.temp)
      this.isReadOnly = true
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
          console.log('------')
          console.log(tempData)
          updateDept(tempData).then(() => {
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
    handleDelete(row, index) {
      deleteDepts().then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })

        this.list.splice(index, 1)
      })
    },
    deleteRow() {
      console.log('批量删除')
      deleteDepts(this.deptIds).then(response => {
        if (response.status == '200') {
          this.getList()
          this.$message.success('删除成功')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      })
      this.delVisible = false// 关闭删除提示模态框
    },
    // 批量删除
    delAll() {
      this.delVisible = true// 显示删除弹框
      const length = this.multipleSelection.length
      for (let i = 0; i < length; i++) {
        this.deptIds = this.deptIds + this.multipleSelection[i].deptId + ','
      }
      // this.userIds=this.userIds.join();
      console.log(this.deptIds)
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      for (let i = 0; i < length; i++) {
        this.deptIds.push(this.multipleSelection[i].deptId)
      }
    },
    resetTemp() {
      this.temp = {
        deptName: '',
        parentDeptId: '',
        deptCode: '',
        status: 0
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
</style>
