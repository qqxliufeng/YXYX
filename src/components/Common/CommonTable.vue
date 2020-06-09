<!--
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 14:47:15
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 15:06:42
-->
<template>
  <el-table
    v-loading="loading"
    :stripe="tableConfig.stripe"
    :header-cell-style="tableConfig.headerCellStyle"
    :data="tableData"
    :border="tableConfig.border"
    :size="tableConfig.size"
    :default-sort="tableConfig.defalutSort"
    :style="tableConfig.style"
  >
    <slot slot="" />
  </el-table>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'CommonTables',
  mixins: [TableMixins],
  methods: {
    initData() {
      this.tableData = [
        {
          id: 1
        }
      ]
      this.loading = false
    }
  }
}
</script>

<style>

</style>
