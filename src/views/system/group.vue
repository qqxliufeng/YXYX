<template>
  <div class="container" style="padding: 2px">
    <table-header
      :form-model-array="formModelArray"
      @onsearch="onSearch"
      @onadd="onAdd"
      @ondelete="onDelete"
    />
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
        <el-table-column align="center" label="序号" prop="userId" width="120" />
        <el-table-column align="center" prop="phone" label="手机号码" width />
        <el-table-column align="center" prop="username" label="用户名" width />
        <el-table-column align="center" prop="dept.deptName" label="部门名称" show-overflow-tooltip />
        <el-table-column
          align="center"
          prop="roles[0].roleName"
          label="用户角色"
          show-overflow-tooltip
        />
        <el-table-column align="center" prop="isSchoolLeader" label="是否校长" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.isSchoolLeader === 1 ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column align="center" prop="isSalesLeader" label="是否主管" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.isSalesLeader===1?'是':'否' }}</template>
        </el-table-column>
        <el-table-column align="center" prop="accountNonLocked" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">{{ !!(scope.row.accountNonLocked)?'可用':'不可用' }}</template>
        </el-table-column>
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
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'Group',
  mixins: [TableMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '用户名/手机号',
          name: 'userNameOrPhone',
          span: 5,
          type: 'input'
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    onAdd() {
      this.$router.push({ name: 'AddGroupInfo' })
    },
    onDelete() {
      if (this.canDeleteItems()) {
        this.confirmDelete('userId', ids => {
          this.$http({
            url: this.$urlPath.deleteUsers,
            data: {
              userIds: ids
            }
          }).then(res => {
            this.$successMsg(res.msg)
            this.getData()
          })
        })
      }
    },
    onSearch() {
      this.$http({
        url: this.$urlPath.queryYouXingUserListByLike,
        methods: this.HTTP_GET,
        data: this.generatorFormObj(this.formModelArray)
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryYouXingUserList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        },
        withRoleId: true,
        withUserId: false
      }).then(res => {
        this.onSuccess(res.obj)
      })
    }
  }
}
</script>

<style>
</style>
