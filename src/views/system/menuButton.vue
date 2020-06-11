<template>
  <div class="container">按键</div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'MenuButton',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryAllButtonInMenu,
        methods: this.HTTP_GET,
        data: {
          menuId: 2
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
