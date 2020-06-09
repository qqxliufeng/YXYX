<!--
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-05-20 11:46:00
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 11:51:26
-->
<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
