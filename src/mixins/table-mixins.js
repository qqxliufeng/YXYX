/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 14:40:03
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 14:41:31
 */
export default {
  data() {
    return {
      tableConfig: {
        headerCellStyle: {
          backgroundColor: '#f5f5f5',
          color: '#333333'
        },
        stripe: true,
        border: true,
        size: 'mini',
        defaultSort: {
          prop: 'id',
          order: 'descending'
        },
        style: {
          width: '99%',
          margin: '10px auto'
        }
      },
      tableData: [],
      page: 0,
      pageSize: 10,
      total: 0,
      loading: true,
      multipleSelection: [],
      searchInfo: '',
      pageInfo: {}
    }
  },
  mounted() {
    this.$root.$on('refresh_table', _ => {
      this.reloadData()
    })
  },
  beforeDestroy() {
    this.$root.$off('refresh_table')
    console.log('消息取消监听')
  },
  methods: {
    resetData() {
      this.tableData = []
      this.page = 0
      this.total = 0
    },
    reloadData() {
      this.resetData()
      this.getData()
    },
    currentChange(currentPage) {
      this.loading = true
      this.page = currentPage
      this.getData()
    },
    prevClick(currentPage) {
      this.loading = true
      this.page = currentPage
    },
    nextClick(currentPage) {
      this.loading = true
      this.page = currentPage
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSuccess(data) {
      this.loading = false
      this.tableData = data.list
      // this.tableData = this.tableData.concat(this.tableData)
      // this.tableData = this.tableData.concat(this.tableData)
      this.pageInfo = {
        endRow: data.endRow,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage,
        isFirstPage: data.isFirstPage,
        isLastPage: data.isLastPage,
        navigateFirstPage: data.navigateFirstPage,
        navigateLastPage: data.navigateLastPage,
        navigatePages: data.navigatePages,
        navigatepageNums: data.navigatepageNums,
        nextPage: data.nextPage,
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        pages: data.pages,
        prePage: data.prePage,
        size: data.size,
        startRow: data.startRow,
        total: data.total
      }
      this.total = this.pageInfo.total
    },
    generatorFormObj(formModelArray = []) {
      const form = {}
      form['pageNum'] = this.page
      form['pageSize'] = this.pageSize
      formModelArray.forEach(it => {
        const name = it.name
        const value = it.value
        if (value instanceof Array) {
          value.forEach((i, index) => {
            form[it.name[index]] = i
          })
        } else {
          form[name] = value
        }
      })
      return form
    }
  }
}
