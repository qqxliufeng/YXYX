<template>
  <div class="container">
    <table-header
      title="基本操作"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="false"
      @onsearch="onSearch"
    >
      <template slot="other">
        <el-button type="warning" size="mini" @click="generatorCards">批量生成学习卡</el-button>
        <el-button type="danger" size="mini" @click="downCards">批量下载学习卡</el-button>
      </template>
    </table-header>
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
        <el-table-column align="center" prop="cardCode" label="学习卡编码" width />
        <el-table-column align="center" prop="cardErcode" label="二维码" show-overflow-tooltip />
        <el-table-column
          align="center"
          prop="cardType"
          label="学习卡类型"
          :formatter="cardTypeFormatter"
        />
        <el-table-column align="center" prop="isBind" label="绑定状态" :formatter="bindFormatter" />
        <el-table-column align="center" prop="validityMonth" label="有效期">
          <template slot-scope="scope">
            <span>{{ scope.row.validityMonth + '个月' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip />
        <el-table-column align="center" prop="endTime" label="到期时间" :formatter="endTimeFormatter" />
        <el-table-column align="center" prop="status" label="状态" :formatter="statusFormatter" />
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="textBookList(scope.row)">教材列表</el-button>
            <el-button type="warning" size="mini" @click="grantTextBookList(scope.row)">授权列表</el-button>
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
    <el-dialog title="批量生成学习卡" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学习卡类型" prop="parentDeptId">
          <el-col :span="24">
            <el-select
              v-model="generatorCardObj.cardType"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择学习卡类型"
            >
              <el-option
                v-for="item of cardTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="学习卡数量" prop="menuSequence">
          <el-col :span="24">
            <el-input-number
              v-model="generatorCardObj.studyCardNum"
              style="width: 100%"
              :min="1"
              :max="200"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="有效期单位（月）">
          <el-col :span="24">
            <el-input-number v-model="generatorCardObj.validityMonth" style="width: 100%" :min="1" />
          </el-col>
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
import tableMixins from '../../mixins/table-mixins'
import { blobToExecl } from '../../api/common'
export default {
  name: 'MenuButton',
  mixins: [tableMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '学习卡编码',
          name: 'cardCode',
          span: 5,
          type: 'input'
        },
        {
          id: 2,
          value: '',
          label: '学习卡状态',
          name: 'status',
          span: 5,
          type: 'select',
          selectOptions: [
            {
              label: '未激活',
              value: 0
            },
            {
              label: '已激活',
              value: 1
            },
            {
              label: '已到期',
              value: 2
            }
          ]
        },
        {
          id: 3,
          value: '',
          label: '是否绑定',
          name: 'isBind',
          span: 5,
          type: 'select',
          selectOptions: [
            {
              label: '未绑定',
              value: 0
            },
            {
              label: '已绑定',
              value: 1
            }
          ]
        }
      ],
      generatorCardObj: {
        cardType: 'P',
        studyCardNum: 1,
        validityMonth: 1
      },
      dialogFormVisible: false,
      cardTypes: [
        {
          label: '小学正式卡',
          value: 'P'
        },
        {
          label: '小学体验卡',
          value: 'TP'
        },
        {
          label: '初中正式卡',
          value: 'M'
        },
        {
          label: '初中体验卡',
          value: 'TM'
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    cardTypeFormatter(item) {
      // P小学正式卡  TP小学体验卡 M初中正式卡 TM初中体验卡
      switch (item.cardType) {
        case 'P':
          return '小学正式卡'
        case 'TP':
          return '小学体验卡'
        case 'M':
          return '初中正式卡'
        case 'TM':
          return '初中体验卡'
      }
    },
    bindFormatter(item) {
      return item.isBind === 0 ? '未绑定' : '已绑定'
    },
    statusFormatter(item) {
      // 0未分配教材 1已分配教材 2未激活 3已激活 4已到期
      switch (item.status) {
        case 0:
          return '未分配教材'
        case 1:
          return '已分配教材'
        case 2:
          return '未激活'
        case 3:
          return '已激活'
        case 4:
          return '已到期'
      }
    },
    endTimeFormatter(item) {
      return item.endTime ? item.endTime : '暂无'
    },
    onSearch() {
      this.loading = true
      const form = this.generatorFormObj(this.formModelArray)
      this.$http({
        url: this.$urlPath.queryStudyCardLike,
        methods: this.HTTP_GET,
        data: form
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    generatorCards() {
      this.dialogFormVisible = true
    },
    downCards() {
      if (this.canDownItems()) {
        this.confirmDown('studyCardId', ids => {
          this.$http({
            url: this.$urlPath.uploadStudyCardExcel,
            methods: this.HTTP_GET,
            data: {
              studyCardIds: ids
            },
            responseType: `blob`
          }).then(res => {
            blobToExecl(res)
          })
        })
      }
    },
    handleDialogConfirm() {
      this.dialogFormVisible = false
      this.$warningConfirm('确定要批量生成学习卡吗？', _ => {
        this.$http({
          url: this.$urlPath.saveStudyCard,
          data: this.generatorCardObj
        }).then(res => {
          this.$successMsg('生成成功')
          this.getData()
        })
      })
    },
    textBookList(item) {
      this.$router.push({
        name: 'TextBookList',
        params: {
          studyCardId: item.studyCardId,
          studyCardCode: item.cardCode,
          studyCardErcode: item.cardErcode
        }
      })
    },
    grantTextBookList(item) {
      this.$http({
        url: this.$urlPath.queryTextBookByStudyCardId,
        methods: this.HTTP_GET,
        data: {
          studyCardId: item.studyCardId
        }
      }).then(res => {
        console.log(res)
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryStudyCard,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    }
  }
}
</script>
