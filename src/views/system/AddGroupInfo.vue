<template>
  <div class="container">
    <el-card body-style="padding: 0">
      <div slot="header" class="flex justify-between align-center">
        <span class="title text-bold">添加用户信息</span>
        <el-button type="primary" size="small" @click="saveInfo">保存</el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span class="title text-bold">基本信息</span>
      </div>
      <el-form>
        <el-form-item label="所属部门">
          <el-col :span="10">
            <el-select
              v-model="baseInfo.deptId"
              placeholder="请选择所属部门"
              style="width: 100%"
              @change="onDeptChange"
            >
              <el-option
                v-for="item of deptList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-col :span="10">
            <el-select v-model="baseInfo.roleId" placeholder="请选择用户角色" style="width: 100%">
              <el-option
                v-for="item of roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="是否校长">
          <el-col :span="10">
            <el-radio-group v-model="baseInfo.isSchoolLeader">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="是否主管">
          <el-col :span="10">
            <el-radio-group v-model="baseInfo.isSalesLeader">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span class="title text-bold">用户信息</span>
      </div>
      <el-form>
        <el-form-item label="真实姓名">
          <el-col :span="10">
            <el-input v-model="baseInfo.userName" placeholder="请输入真实姓名（必填）" maxlength="10" />
          </el-col>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-col :span="10">
            <el-input v-model="baseInfo.userNickName" placeholder="请输入用户昵称（必填）" maxlength="10" />
          </el-col>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-col :span="10">
            <el-radio-group v-model="baseInfo.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="10">
            <el-input
              v-model="baseInfo.phone"
              placeholder="请输入手机号码（必填）"
              maxlength="11"
              @blur="onPhoneBlur"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-col :span="10">
            <el-input v-model="baseInfo.password" placeholder="请输入登录密码" maxlength="11" readonly />
          </el-col>
        </el-form-item>
        <el-form-item label="选择地址">
          <el-col :span="10">
            <el-cascader
              v-model="baseInfo.area"
              style="width: 100%"
              :options="level"
              :props="{label: 'name', value: 'name'}"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-col :span="10">
            <el-input
              v-model="baseInfo.address"
              type="textarea"
              :rows="2"
              placeholder="请输入详细地址（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-col :span="10">
            <el-input v-model="baseInfo.note" type="textarea" :rows="2" placeholder="请输入备注" />
          </el-col>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-col :span="10">
            <el-radio-group v-model="baseInfo.isLock">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="集团用户">
          <el-col :span="10">
            <el-radio-group v-model="baseInfo.isyxuser">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card body-style="padding: 0" style="margin-top: 10px">
      <div slot="header" class="flex justify-end align-center">
        <el-button type="primary" size="small" @click="saveInfo">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { isvalidPhone } from '../../utils/validate'
export default {
  name: 'AddGroupInfo',
  data() {
    return {
      deptList: [],
      roleList: [],
      level: this.$privinceData,
      baseInfo: {
        deptId: 0,
        roleId: '',
        isSchoolLeader: 0, // 是否校长 0否 1是
        isSalesLeader: 0, // 是否主管 0否 1是
        userName: '', //      用户真实姓名
        userNickName: '', //    用户昵称
        schoolId: '', //    所属学校ID
        isLock: 0, //       用户状态：0正常 1禁用
        photo: '', //       用户头像
        phone: '', //       手机号
        password: '', //     用户密码
        sex: 1, //      性别 1男 0女
        area: [],
        address: '', //     家庭住址
        note: '', //     备注
        isyxuser: 0 //     是否集团用户 0否 1是
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    saveInfo() {
      this.$root.$emit('refresh_table')
      if (!this.baseInfo.deptId) {
        this.$errorMsg('请选择所属部门')
        return
      }
      if (!this.baseInfo.roleId) {
        this.$errorMsg('请选择角色')
        return
      }
      if (!this.baseInfo.userName) {
        this.$errorMsg('请输入真实用户姓名')
        return
      }
      if (!this.baseInfo.userNickName) {
        this.$errorMsg('请输入用户昵称')
        return
      }
      if (!this.baseInfo.phone) {
        this.$errorMsg('请输入用户手机号')
        return
      }
      if (!isvalidPhone(this.baseInfo.phone)) {
        this.$errorMsg('请输入合法的用户手机号')
        return
      }
      if (!this.baseInfo.area || this.baseInfo.area.length === 0) {
        this.$errorMsg('请选择省市地区')
        return
      }
      if (!this.baseInfo.address) {
        this.$errorMsg('请输入详细地址')
        return
      }
      this.$http({
        url: this.$urlPath.saveUser,
        methods: this.HTTP_POST,
        data: this.baseInfo
      }).then(res => {
        this.$successMsg(res.msg)
        this.$router.back()
      })
    },
    queryRoleByDeptId() {
      this.$http({
        url: this.$urlPath.queryRolesByDeptId,
        methods: this.HTTP_GET,
        data: {
          deptId: this.baseInfo.deptId
        }
      }).then(res => {
        this.roleList = res.obj
        if (this.roleList && this.roleList.length > 0) {
          this.baseInfo.roleId = this.roleList[0].roleId
        } else {
          this.$errorMsg('当前部门没有角色信息，请重新选择')
        }
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryDepts,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize: 100
        }
      }).then(res => {
        this.deptList = res.obj.list
        if (this.deptList && this.deptList.length > 0) {
          this.baseInfo.deptId = this.deptList[0].deptId
          this.queryRoleByDeptId()
        }
      })
    },
    onDeptChange(value) {
      this.baseInfo.roleId = ''
      this.roleList = []
      this.queryRoleByDeptId()
    },
    onPhoneBlur() {
      this.baseInfo.password = ''
      if (!this.baseInfo.phone) {
        return
      }
      if (!isvalidPhone(this.baseInfo.phone)) {
        return
      }
      this.baseInfo.password = this.baseInfo.phone.substring(5)
    }
  }
}
</script>

<style>
</style>
