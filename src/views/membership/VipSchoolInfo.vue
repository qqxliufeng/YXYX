<template>
  <div class="container" style="padding: 0">
    <el-card>
      <div slot="header">
        <span class="title text-bold">基本信息</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'VipSchoolInfo',
  data() {
    return {

    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http(this.$urlPath.querySchoolBySchoolId, this.HTTP_GET, {
        schoolId: this.$route.params.schoolId
      }, false, false).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style>

</style>
