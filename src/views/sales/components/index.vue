<template>
  <div>
    <el-table
    :height="fullHeight"
    boder
    :data="list"
    class="vue-table-main vue-table"
    >
      <el-table-column
      width="50px"
      align="center"
      cell-style="hideRowName"
      type="selection"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, i) in columns"
        v-if="!item.hide"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :class-name="item.className"
        :sortable="item.sortable"
        :key="item.key"
        :show-overflow-tooltip="item.tip?true:false"
      >
        <template slot-scope="scope">
          <template></template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
      name: 'sale-index',
      data () {
        return {
          fullHeight: document.documentElement.clientHeight - 154
        }
      },
      props: {
        list: Array,
        columns: Array,
      }
    }
</script>

<style scoped>

</style>
