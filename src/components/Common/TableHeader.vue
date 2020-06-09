<template>
  <div style="margin-bottom: 5px">
    <el-card :body-style="{padding: '0px'}">
      <div slot="header" class="flex align-center">
        <span class="text-bold text-sm">{{ title }}</span>
        <div class="flex-sub" />
        <el-button v-if="showAdd" type="warning" size="mini" @click="onadd">添加</el-button>
        <el-button v-if="showDelete" type="danger" size="mini" @click="ondelete">删除</el-button>
        <el-button type="primary" size="mini" @click="onsearch">查询</el-button>
      </div>
      <el-form :inline="true" size="small" :gutter="5">
        <el-form-item
          v-for="item of formModelArray"
          :key="item.id"
          :label="item.label"
          style="padding: 10px"
        >
          <el-input v-if="item.type === 'input'" v-model="item.value" placeholder="请输入内容" />
          <el-cascader
            v-else-if="item.type === 'address'"
            v-model="item.value"
            :options="level"
            :props="{label: 'name', value: 'name'}"
            clearable
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    title: {
      type: String,
      default: '查询内容'
    },
    formModelArray: {
      type: Array,
      default: function() {
        return []
      }
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      level: this.$privinceData
    }
  },
  methods: {
    onadd() {
      this.$emit('onadd')
    },
    ondelete() {
      this.$emit('ondelete')
    },
    onsearch() {
      this.$emit('onsearch')
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-card__header {
  padding: 10px;
}
>>> .el-form-item {
  margin-bottom: 0px;
}
</style>
