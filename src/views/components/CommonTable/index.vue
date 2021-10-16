<template>
  <div>
    <el-table
      :data="list"
      header-align="center"
      height="356"
      stripe
      highlight-current-row
      style="width: 100%"
      class="vue-table vue-table-detail">
      <el-table-column
        v-for="(item, i) in columns"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :min-width="item.minWidth"
        :class-name="item.className"
        :key="item.key"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.tip?true:false">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: {
      list: Array,
      columns: Array
    },
    components: {
    }
  }
</script>

<style scoped>

</style>
