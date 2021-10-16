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
        type="index"
        label="序号"
        width="50px"
      >
      </el-table-column>
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
        <template slot-scope="scope">
          <template v-if="item.prop==='operation'">
            <el-button  type="text"
                       size="small" class="text-color" @click="checkInvoice(scope.row.picture)">图片
            </el-button>
          </template>
          <template v-else>
            {{scope.row[item.prop]}}
          </template>
        </template>
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
    methods: {
      checkInvoice (url) {
        this.$emit('check-invoice', url)
      }
    },
    components: {
    }
  }
</script>

<style scoped>

</style>
