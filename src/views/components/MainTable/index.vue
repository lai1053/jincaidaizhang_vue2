<style lang='scss'>
  .vue-table {
    width: 100%;
    border-top: 1px solid #e7ebf5;
    .vue-row-child {
      .el-table-column--selection {
        .cell {
          label {
            display: none;
          }
        }
      }
    }
    .tree-ctrl {
      position: absolute;
      top: 50%;
      margin-top: -10px;
      left: 8px;
      color: #1ab394;
      [class*=" el-icon-"], [class^=el-icon-] {
        font-weight: bold;
      }
    }
  }
</style>
<template>
  <el-table
    stripe
    border
    :data="formatData"
    :height="fullHeight"
    :row-style="showRow"
    :row-class-name="hideRowName"
    ref="multipleTable"
    v-loading="loading"
    @row-dblclick="dblClickRow"
    @selection-change="handleSelectionChange"
    @sort-change="sortChange"
    class="vue-table vue-table-main">
    <el-table-column
      width="50px"
      align="center"
      cell-style="hideRowName"
      type="selection">
    </el-table-column>
    <!--<el-table-column width="50px" align="center">
      <template slot-scope="props">
        <span class="tree-ctrl" v-if="iconShow(props.row)" @click="toggleExpanded(props.$index)">
          <i v-if="!props.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
      </template>
    </el-table-column>-->
    <!--:fixed="(item.prop==='operation'||item.prop==='vm_state')?'right':false"-->
    <el-table-column
      v-for="(item, i) in columns"
      v-if="!item.hide"
      :prop="item.prop"
      :label="item.label"
      :align="item.align"
      :width="item.width"
      :class-name="item.className"
      :key="item.key"
      :sortable="item.sortable"
      :show-overflow-tooltip="item.tip?true:false">
      <template slot-scope="scope">
        <span class="tree-ctrl" v-if="i===0&&iconShow(scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        <column-item
          :item="item"
          :scope="scope"
          :main-menu="mainMenu"
          :storage="storage"
          @delect="deleteDetail"
          @delete-voucher="deleteVoucher"
          @check-voucher="checkVoucher"
          @check-bill="getBillDetail"
          @on-click-img="toImg"
          @on-storage="toStorage">
          <template slot="icon" >
            </template>
        </column-item>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import columnItem from '@/views/components/ColumnItem.vue'
  import treeToArray from './eval'
  import {Message} from 'element-ui'
  import {sortChange} from '@/utils/utils'

  export default {
    name: 'mainTable',
    data() {
      return {
        fullHeight: document.documentElement.clientHeight - 154
      }
    },
    props: {
      storage: Boolean,
      mainMenu: String,
      submenu: String,
      columns: Array,
      tableData: Array,
      sortData: Object,
      loading: Boolean,
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: false
      }
    },
    created() {
      if (this.submenu) {
        this.fullHeight = document.documentElement.clientHeight - 184
      }
    },
    computed: {
      // 格式化数据源
      formatData: function () {
        let tmp
        if (!Array.isArray(this.tableData)) {
          tmp = [this.tableData]
        } else {
          tmp = this.tableData
        }
        const func = this.evalFunc || treeToArray
        const args = this.evalArgs ? Array.concat([tmp], this.evalArgs) : [tmp, this.expandAll]
        return func.apply(null, args)
      }
    },
    methods: {
      showRow: function (row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        row.row._show = show
        return show ? '' : 'display:none;'
      },
      hideRowName: function (row) {
        return row.row.parent ? 'vue-row-child' : ''
      },
      // 切换下级是否展开
      toggleExpanded: function (trIndex) {
        const record = this.formatData[trIndex]
        record._expanded = !record._expanded
      },
      // 图标显示
      iconShow(record) {
        return (record.mergeList && record.mergeList.length > 0)
      },
      sortChange(e) {
        this.sortData.prop = e.prop
        this.sortData.order = e.order
        if (!e.prop) {
          return this.$emit('sort-change')
        }
        sortChange(this.tableData, e)
      },
      // 双击信息行，已生成凭证的查看详情，未生成凭证的编辑
      dblClickRow(val) {
        if (val.ids && val.ids.length > 1) return
        this.$emit('dbl-click-row', val)
      },
      // 点击抵扣类型旁边的图标查看清单列表
      getBillDetail(rowData) {
        this.$emit('check-bill', rowData)
      },
      // 操作>删除
      deleteDetail(rowData) {
        if (!String(rowData.id)) {
          return Message({
            message: '清单ID不能为空',
            type: 'warning',
            duration: 2 * 1000
          })
        }
        this.$confirm('确认要删除该清单条目？删除后数据无法恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = `${String(rowData.id)};`
          this.$emit('on-delete', ids, 'one')
        })
      },
      // 操作>图片
      toImg(rowData) {
        this.$emit('on-click-img', rowData)
      },
      toStorage(rowData) {
        this.$emit('on-storage', rowData)
      },
      // 删除凭证
      deleteVoucher(rowData) {
        if (!String(rowData.vch_id_list)) {
          return Message({
            message: '凭证ID不能为空',
            type: 'warning',
            duration: 5 * 1000
          })
        }
        this.$confirm('确认要删除凭证？删除后数据无法恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = rowData.vch_id_list
          this.$emit('on-delete-voucher', ids, rowData)
        }).catch(() => {
        })
      },
      // 点击凭证字号进入查看凭证(拉取北京)
      checkVoucher(voucherId) {
        this.$emit('check-voucher', voucherId)
      },
      handleSelectionChange(val) {
        const curSelect = []
        const selectAmount = {
          attachmentNum: 0,
          sum: 0,
          tax: 0,
          amount: 0,
          negativeSum: 0,
          negativeTax: 0,
          negativeAmount: 0
        }
        if (this.mainMenu === 'fund') {
          val.forEach((item, idx) => {
            this.tableData.forEach((v, vi) => {
              if (String(v.id) === String(item.id) && String(v.ids) === String(item.ids)) {
                selectAmount.sum = parseFloat((+selectAmount.sum) + item.amount).toFixed(2)
                curSelect.push(item)
                if (item.mergeList) {
                  selectAmount.attachmentNum += item.mergeList.length
                } else {
                  selectAmount.attachmentNum++
                }
              }
            })
          })
        } else {
          val.forEach((item, idx) => {
            this.tableData.forEach((v, vi) => {
              if (String(v.id) === String(item.id) && String(v.ids) === String(item.ids)) {
                if (item.amount > 0) {
                  selectAmount.amount = parseFloat((+selectAmount.amount) + item.amount).toFixed(2)
                } else {
                  selectAmount.negativeAmount = parseFloat((+selectAmount.negativeAmount) + item.amount).toFixed(2)
                }
                if (item.mergeList) {
                  selectAmount.attachmentNum += item.mergeList.length
                  item.mergeList.forEach((mItem) => {
                    if (mItem.ex_tax_amount > 0) {
                      selectAmount.sum = parseFloat((+selectAmount.sum) + mItem.ex_tax_amount).toFixed(2)
                    } else {
                      selectAmount.negativeSum = parseFloat((+selectAmount.negativeSum) + mItem.ex_tax_amount).toFixed(2)
                    }
                    if (mItem.tax_amount > 0) {
                      selectAmount.tax = parseFloat((+selectAmount.tax) + mItem.tax_amount).toFixed(2)
                    } else {
                      selectAmount.negativeTax = parseFloat((+selectAmount.negativeTax) + mItem.tax_amount).toFixed(2)
                    }
                  })
                } else {
                  selectAmount.attachmentNum++
                  if (item.ex_tax_amount > 0) {
                    selectAmount.sum = parseFloat((+selectAmount.sum) + item.ex_tax_amount).toFixed(2)
                  } else {
                    selectAmount.negativeSum = parseFloat((+selectAmount.negativeSum) + item.ex_tax_amount).toFixed(2)
                  }
                  if (item.tax_amount > 0) {
                    selectAmount.tax = parseFloat((+selectAmount.tax) + item.tax_amount).toFixed(2)
                  } else {
                    selectAmount.negativeTax = parseFloat((+selectAmount.negativeTax) + item.tax_amount).toFixed(2)
                  }
                }
                curSelect.push(item)
              }
            })
          })
        }

        this.$emit('on-selection-change', curSelect, selectAmount)
      }
    },
    components: {
      columnItem
    },
    mounted() {
    }
  }
</script>
