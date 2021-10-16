<style lang='scss'>
  .vue-table-detail {
    border: 1px solid #e7ebf5;
    .el-table__body-wrapper {
      overflow-x: scroll;
    }
    .fuzhu {
      right: 4px;
      top: 9px;
    }
  }
  .table-detail{
    .vue-table-detail {
      .td-right {
       .cell{
         padding-right: 34px;
       }
     }
    }
  }
</style>

<template>
  <div class="table-detail">
    <el-table
      stripe
      :data="tableData"
      :height="height"
      class="vue-table vue-table-detail">
      <el-table-column
        v-for="item in columns"
        v-if="!item.hide"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :class-name="item.className"
        :key="item.prop"
        show-overflow-tooltip
        :fixed="item.type==='add'?'right':false">
        <template slot-scope="scope">
          <span v-if="item.prop!=='card'">
            {{scope.row[item.prop]}}
            <span class="fuzhu"
                  v-if="item.needAssist&&getIsAssist(scope.row, item)"
                  @click="showAssist(scope.$index, scope.row, item)"
            >辅</span>
          </span>
          <el-button v-if="item.prop==='card'" type="text"><i class="el-icon-view" @click="toCheckCard(scope.row)"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'viceFileDetail',
    data() {
      return {
      }
    },
    props: {
      height: String,
      tableData: Array,
      columns: Array,
      editData: Object
    },
    components: {
    },
    methods: {
      toCheckCard(row) {
        this.$emit('on-check-card', row)
      },
      // 辅助弹窗数据格式化
      showAssist(idx, row, item) {
        this.$emit('on-assist', idx, row[item.prop])
      },
      getIsAssist(row, item) {
        let flag = false
        const sub = row[item.options] ? row[item.options] : this.editData[item.options]
        const curVal = row[item.prop].split(' ')[0]
        if (sub && sub[curVal] && sub[curVal].split(' ')[2]) {
          flag = true
        }
        return flag
      },
    },
    computed: {},
    mounted() {
    }
  }
</script>
