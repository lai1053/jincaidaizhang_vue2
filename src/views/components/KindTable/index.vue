<style lang="scss" scoped>
  .tooltip-content {
    p {
      margin: 0 0 4px 0;
    }
    p:last-child {
      margin: 0;
    }
  }
   .remarks{
      position: absolute;
      top:0;
      right: 5px;
      button{
        overflow: hidden;
        padding:8px 0;
        color: #CCCCCC;
      }
    }
    .warning-icon{
      position: absolute;
      top:15px;
      right: 0;
      color: #e96a69;
    }
</style>
<style>
  .item{
    line-height: 180%;
    word-wrap : break-word;
    text-align: left;
    max-width:400px;
  }
</style>

<template>
  <div tabindex="1" @keydown="keyDownEvent($event)" @keyup="keyUpEvent($event)">
    <el-table
      stripe
      border
      :data="list"
      :height="fullHeight"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      @row-dblclick="dblClickRow"
      @select="select"
      @cell-click="clickCell"
      class="vue-table vue-table-main">
      <!--勾选框-->
      <el-table-column
        width="36px"
        align="center"
        cell-style="hideRowName"
        type="selection">
      </el-table-column>
      <!--表单数据显示-->
      <el-table-column
        v-for="(item, i) in columns"
        v-if="!item.hide"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :min-width="item.minWidth"
        :max-width="item.maxWidth"
        :class-name="item.className"
        :key="item.key"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.tip?true:false">
        <template slot-scope="scope">

          <!--备注功能提示-->
          <div v-if="item.remarks && scope.row.remark!==null && scope.row.remark!==''" class="remarks" style="margin-left:-50px">
            <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-end" popper-class="item">
              <el-button type="text" @click="showRemark(scope.row)">
                <i class="iconfont icon-xiaoxi"></i>
              </el-button>
            </el-tooltip>
          </div>
          <!--辅助核算图标-->
          <!--<div v-if="item.complete && scope.row.complete !== true && scope.row.complete!==null" class="complete" style="left:-18px">-->
            <!--<el-tooltip class="itme" effect="dark" content="辅助核算科目未完善" placement="top-end">-->
              <!--<i class="el-icon-warning"></i>-->
            <!--</el-tooltip>-->
          <!--</div>-->
          <!--<template v-for="(detailList,i) in scope.row.detailList">-->
            <!--<div v-if="item.complete2 && detailList.complete !== true && detailList.complete!==null" class="complete" style="left:-18px">-->
              <!--<el-tooltip class="itme" effect="dark" content="辅助核算科目未完善" placement="top-end">-->
                <!--<i class="el-icon-warning"></i>-->
              <!--</el-tooltip>-->
            <!--</div>-->
          <!--</template>-->

          <template v-if="item.moreTip">
            <el-tooltip
              :disabled="scope.row[item.moreTip].length===0"
              effect="dark"
              placement="top">
              <div slot="content" class="tooltip-content"><p v-for="tip in scope.row[item.moreTip]" :key="tip">{{tip}}</p></div>
              <span v-if="item.moreTip === 'goodNames'" class="more-tips-content">{{scope.row[item.moreTip][0]}}</span>
              <span v-else class="more-tips-content" style="padding-right: 10px">{{scope.row[item.prop][0]}}</span>
            </el-tooltip>
            <el-tooltip  class="itme" effect="dark" content="辅助核算科目未完善" placement="top-end">
              <i v-if="item.moreTip !== 'goodNames'&& scope.row.assistComplete === false" class="el-icon-warning warning-icon"></i>
            </el-tooltip>

          </template>
          <template v-else-if="item.customTip">
            <el-tooltip
              :disabled="!scope.row.acctCodeName"
              effect="dark"
              placement="top">
              <div slot="content" class="tooltip-content"><p>{{scope.row.acctCodeName}}</p></div>
              <span class="more-tips-content" style="padding-right: 10px">{{scope.row[item.prop]}}</span>
            </el-tooltip>
            <el-tooltip v-if="scope.row.complete === false" class="itme" effect="dark" content="辅助核算科目未完善" placement="top-end">
              <i class="el-icon-warning warning-icon"></i>
            </el-tooltip>
          </template>
          <template v-else>
            <!--收据凭证-->
            <voucher-mark
              v-if="item.prop==='vm_state'"
              :scope="scope"
              :item="item"
              :main-menu="mainMenu"
              :change-tax-type="changeTaxType"
              @delete-voucher="deleteVoucher"
              @check-voucher="checkVoucher"
            ></voucher-mark>
            <!--记账模块-->
            <operation
              v-else-if="item.prop==='operation'"
              :scope="scope"
              :bookkeeping="bookkeeping"
              :inventory="inventory"
              :main-menu="mainMenu"
              :change-tax-type="changeTaxType">
              <template slot="deleteBtn" v-if="!changeTaxType">
                <span v-if="String(scope.row.vm_state)!=='2' && (indexData.checkoutFlag!=='Y')">|</span>
                <el-button v-if="String(scope.row.vm_state)!=='2'" type="text" size="small" class="text-color" @click="deleteRow(scope.row, scope.$index)">删除
                </el-button>
              </template>
            </operation>
            <!--表单其他信息-->
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </template>

      </el-table-column>
    </el-table>
    <add-remark
      v-if='dialogVisible'
      :dialogVisible='dialogVisible'
      :remarks_contents='remarks_contents'
      :text_length='text_length'
      @on-save-all='on_save_all'
      @on-handleClose='on_handleClose'>
    </add-remark>
  </div>
</template>

<script>
  import Operation from '@/views/components/ColumnItem/Operation'
  import VoucherMark from '@/views/components/ColumnItem/VoucherMark'
  import AddRemark from '@/views/components/AddRemark'

  import {MessageBox} from 'element-ui'
  import {toMoney} from '@/utils/utils'
  import {deepCopy} from '../../../utils/assist'

export default {
    data () {
      return {
        fullHeight: document.documentElement.clientHeight - 112,
        indexData: this.$store.getters.indexData,
        urlInfo: this.$store.getters.urlInfo,
        isShift: false,
        isCtrl: false,
        originRow: '',
        multipleSelection: [],
        dialogVisible: false,
        remarks_contents: '',
        text_length: 0,
        remarkId: 0
      }
    },
    props: {
      loading: Boolean,
      columns: Array,
      list: Array,
      mainMenu: String,
      bookkeeping: Object,
      changeTaxType: Boolean,
      inventory: Object
    },
    watch: {
    },
    created () {
    },
    methods: {
      showRemark (row) {
        const num = row.remark.length
        this.text_length = 200 - num
        this.dialogVisible = true
        this.remarks_contents = row.remark
        this.remarkId = row.id
      },
      // 保存
      on_save_all (arg) {
        const idArray = []
        idArray.push(this.remarkId)
        this.dialogVisible = false
        const mes = {
          id: idArray,
          arg: arg
        }
        this.$emit('on-save-Remark', mes)
      },
      // 关闭
      on_handleClose (arg) {
        this.dialogVisible = arg
      },
      select (selection, row) {
        this.originRow = this.multipleSelection.length === 1 ? this.multipleSelection[0].index : this.originRow
        const hasOriginRow = this.multipleSelection.filter(item => {
          return item.index === this.originRow
        })
        if (hasOriginRow.length === 0) {
          this.originRow = ''
          return
        }
        const currentIndex = row.index
        const list = this.list
        if (this.isShift && this.multipleSelection.length > 1) {
          let selectArray = []
          if (currentIndex > this.originRow) {
            selectArray = list.slice(this.originRow, currentIndex + 1)
          } else {
            selectArray = list.slice(currentIndex, this.originRow + 1)
          }
          if (selectArray) {
            this.$refs.multipleTable.clearSelection()
            selectArray.forEach(item => {
              this.$refs.multipleTable.toggleRowSelection(item)
            })
          }
        }
      },
      clickCell (row) {
        // if (this.isCtrl) {
        //   this.$refs.multipleTable.toggleRowSelection(row)
        // }
      },
      sortChange (e) {
        this.$emit('sort-change', e)
      },
      // 双击信息行，已生成凭证的查看详情，未生成凭证的编辑
      dblClickRow (row) {
        this.$emit('row-dblclick', row)
      },
      // 选择
      handleSelectionChange (list) {
        this.multipleSelection = list
        const amount = {
          postiveExTaxAmount: 0, // 金额 正
          negativeExTaxAmount: 0, // 金额 负
          positiveTax: 0, // 税额 正
          negativeTax: 0, // 税额 负
          positiveAmount: 0, // 价税合计 正
          negativeAmount: 0 // 价税合计 负
        }
        for (const item of list) {
          // 金额计算
          if (item.ex_tax_amount > 0) {
            amount.postiveExTaxAmount = parseFloat((+amount.postiveExTaxAmount) + item.ex_tax_amount).toFixed(2)
          } else {
            amount.negativeExTaxAmount = parseFloat((+amount.negativeExTaxAmount) + item.ex_tax_amount).toFixed(2)
          }
          // 税额计算
          if (item.tax_amount > 0) {
            amount.positiveTax = parseFloat((+amount.positiveTax) + item.tax_amount).toFixed(2)
          } else {
            amount.negativeTax = parseFloat((+amount.negativeTax) + item.tax_amount).toFixed(2)
          }
          // 价税合计计算
          if (item.amount > 0) {
            amount.positiveAmount = parseFloat((+amount.positiveAmount) + item.amount).toFixed(2)
          } else {
            amount.negativeAmount = parseFloat((+amount.negativeAmount) + item.amount).toFixed(2)
          }
        }
        Object.keys(amount).forEach(item => {
          const itemVal = amount[item]
          amount[item] = itemVal ? toMoney(itemVal) : 0
        })
        this.$emit('on-selection-change', list, amount)
      },
      // 删除凭证
      deleteVoucher (vchIdArray) {
        this.$emit('on-delete-voucher', vchIdArray)
      },
      // 删除清单
      deleteRow (row) {
        MessageBox.alert('确定要删除勾选的清单吗？删除后可通过再次理票恢复！', '删除清单', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.$emit('on-delete', [row.id])
            }
          }
        })
      },
      // 点击凭证字号进入查看凭证(拉取北京)
      checkVoucher (voucherId) {
        this.$emit('on-check-voucher', voucherId)
      },
      // 操作>图片
      toImg (row) {
        this.$emit('on-click-img', row)
      },
      keyDownEvent (evt) {
        const self = this
        if (evt.shiftKey) {
          self.isShift = true
        }
        if (evt.ctrlKey) {
          self.isCtrl = true
        }
      },
      keyUpEvent (evt) {
        const self = this
        self.isShift = false
        self.isCtrl = false
      }
    },
    listButton () {
    },
    computed: {
    },
    mounted () {
    },
    components: {
      VoucherMark,
      Operation,
      AddRemark
    }
  }
</script>
