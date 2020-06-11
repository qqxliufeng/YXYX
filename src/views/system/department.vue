<template>
  <div class="container">
    <table-header title="基本操作" @onadd="onAdd" @ondelete="onDelete" />
    <el-card :body-style="{padding: 0}">
      <el-table
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="ID" prop="deptId" />
        <el-table-column align="center" prop="deptName" label="部门名称" />
        <el-table-column align="center" prop="deptCode" label="部门编码">
          <template slot-scope="scope">
            <span>{{ scope.row.deptCode | emptyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" />
        <el-table-column align="center" prop="status" label="状态" :formatter="statusFormatter" />
        <el-table-column
          align="center"
          label="操作"
          width="100"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <table-foot
      :total="total"
      :page-size="pageSize"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      @refresh="reloadData"
    />
    <el-dialog :title="mode === 'add' ? '添加部门' : '编辑部门'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempItem"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="tempItem.deptName" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="部门编码" prop="deptCode">
          <el-input
            v-model="tempItem.deptCode"
            οnkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')"
            placeholder="请输入部门编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="上级部门" prop="parentDeptId">
          <el-select v-model="tempItem.parentDeptId" class="filter-item" placeholder="请选择上级部门">
            <el-option
              v-for="item of allDepts"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="tempItem.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'Department',
  mixins: [TableMixins],
  data() {
    return {
      allDepts: [],
      mode: 'edit',
      dialogFormVisible: false,
      tempItem: {
        parentDeptId: '',
        deptName: '',
        deptCode: '',
        status: 0
      },
      rules: {
        status: [{ required: true, message: '请选择', trigger: 'blur' }],
        deptName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        deptCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        parentDeptId: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getData()
    this.getAllDepts()
  },
  methods: {
    statusFormatter(item) {
      return item.status === 0 ? '正常' : '禁用'
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryDepts,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    getAllDepts() {
      this.$http({
        url: this.$urlPath.queryDepts,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize: 10000
        }
      }).then(res => {
        this.allDepts = res.obj.list
      })
    },
    onAdd() {
      this.mode = 'add'
      this.dialogFormVisible = true
      this.tempItem = {
        parentDeptId: '',
        deptName: '',
        deptCode: '',
        status: 0
      }
    },
    onDelete() {
      if (this.canDeleteItems()) {
        this.confirmDelete('deptId', ids => {
          this.$http({
            url: this.$urlPath.deleteDepts,
            data: {
              deptIds: ids
            }
          }).then(res => {
            this.$successMsg(res.msg)
            this.getData()
          })
        })
      }
    },
    handleUpdate(item) {
      this.mode = 'edit'
      this.dialogFormVisible = true
      this.tempItem = {
        deptId: item.deptId,
        parentDeptId: item.parentDeptId,
        deptName: item.deptName,
        deptCode: item.deptCode,
        status: item.status
      }
    },
    handleDialogConfirm() {
      if (!this.tempItem.deptName) {
        this.$errorMsg('请输入部门名称')
        return
      }
      if (!this.tempItem.deptCode) {
        this.$errorMsg('请输入部门编码')
        return
      }
      if (!this.tempItem.parentDeptId) {
        this.$errorMsg('请选择上级部门')
        return
      }
      this.dialogFormVisible = false
      if (this.mode === 'edit') {
        this.$http({
          url: this.$urlPath.updateDept,
          data: this.tempItem
        }).then(res => {
          this.$successMsg('修改成功')
          this.getData()
        })
      } else {
        this.$http({
          url: this.$urlPath.saveDept,
          data: this.tempItem
        }).then(res => {
          this.$successMsg('保存成功')
        })
      }
    }
  }
}
</script>
