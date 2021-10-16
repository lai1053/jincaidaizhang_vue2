<style scoped lang="scss">
  .bill-title{
    font-weight: 800;
  }
  .header-box{
    height: 38px;
    line-height: 33px;
    padding: 0 0 5px 0;
    overflow: hidden;
    .header-left{
      float: left;
      .icon-box{
        display: inline-block;
        color:#fff;
        width:24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        background: #c8c9cc;
      }
      .collapse {
        margin-left: 15px;
        display: inline-block;
        .collapse-btn {
          cursor: pointer;
        }
      }
    }
  }
</style>
<style lang="scss">
  .purchase-query-bill-box{
    .el-table::before {
      height: 0;
      .el-table .cell {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
  }

</style>
<template>
    <div class="purchase-query-bill-box">
      <div class="header-box">
        <div class="header-left">
          <div class="icon-box"><i class="iconfont icon-dengpao"></i></div>
          <span class="bill-title">查询结果：<span>{{mainDetail.list.length}}</span>条</span>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="mainDetail.list"
          ref="table"
          heiglight-current-row
          header-align="center"
          stripe
          height="300"
          style="width: 100%"
          class="query-bill-table"
          @selection-change="handleSelectChange"
          @sort-change="sortChange"
        >
          <el-table-column
            width="50px"
            align="center"
            cess-style="hideRowName"
            type="selection"
            :selectable="checkSelectTable"
          ></el-table-column>
          <el-table-column
            v-for="item in columns"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :key="item.prop"
            :show-overflow-tooltip="item.tip?true:false"
            :sortable="item.sortable"
            :class-name="item.className"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'dkrq'">
                {{scope.row[item.prop] === '999912' ? '' : scope.row[item.prop]}}
              </template>
              <template v-else>
                {{scope.row[item.prop]}}
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
    import {sortChange} from '@/utils/utils'
    import {deepCopy} from '@/utils/assist'
    import 'element-ui/lib/theme-chalk/base.css'
    // collapse 展开折叠
    export default {
      name: 'QueryContent',
      data () {
        return {
        }
      },
      props: {
        mainDetail: Object,
        columns: Array
      },
      methods: {
        handleSelectChange (list) {
          this.mainDetail.selectedList = list
        },
        checkSelectTable (row) {
          return row.rzfs === 0
        },
        sortChange (e) {
          if (e.prop) {
            sortChange(this.mainDetail.list, e)
          } else {
            this.mainDetail.list = deepCopy(this.mainDetail.oldList)
          }
        }
      },
      components: {
      }
    }
</script>

<style scoped>

</style>
