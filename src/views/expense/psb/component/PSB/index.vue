<style lang="scss" scoped>

</style>
<style lang="scss">
  .psb-box{
    .el-table{
      .edit-select-box-normal{
        .cell{
          padding-right: 10px;
          position: relative;
          height: 30px;
          line-height: 30px;
        }
        .el-select .el-input__inner {
          height: 30px;
          line-height: 30px;
          border-radius: 3px;
        }

      }
      .edit-row-box{
        .el-select{
          width: calc(100% - 28px);
        }
        .cell {
          padding-right: 10px;
          position: relative;
          height: 30px;
          line-height: 30px;
          .edit-tip {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            font-size: 16px;
            position: absolute;
            right: 10px;
            top: 50%;
            margin-top: -10px;
          }
        }
      }
    }

  }
  .psb-more-tips-content{
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    height: 30px;
    line-height: 30px;
  }
</style>
<template>
    <div class="psb-box">
      <el-table
      stripe
      border
      ref="multipleTable"
      :height="fullHeight"
      :data="list"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      @cell-click="clickCell"
      @selection-change="handleSelectionChange"
      @row-dblclick="dblClickRow"
      @select="handleSelected"
      class="vue-table vue-table-main"
      >
        <!--勾选框-->
        <el-table-column
          width="36px"
          align="center"
          cell-style="hideRowName"
          type="selection">
        </el-table-column>
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
            <template v-if="item.prop==='acct10'">
              <template v-if="scope.row.isEdit">
                <el-select
                  v-model="scope.row[item.prop]"
                  popper-class="auto-complete"
                  class="vue-edit-box"
                  placeholder=""
                  clearable
                  filterable
                  remote
                  @visible-change="stockVisibleChange($event,scope.row[item.prop])"
                  v-loadmore="stockLoadMore"
                  :remote-method="stockRemoteMethod"
                  @change="changeAccount(scope.row, '10')"
                  no-match-text="">
                  <el-option
                    v-for="(item, i) in stockAccount"
                    :key="i"
                    :label="item.account"
                    :value="item.account">
                    <span>{{item.account}}</span>
                    <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </el-tooltip>
                  </el-option>
                  <div class="auto-complete-btn" @click="addSub(scope.row, '10')">
                    <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
                    <span>新增</span>
                  </div>
                </el-select>
                <!--<span-->
                  <!--v-if="isAssist(scope.row[item.prop])"-->
                  <!--class="fuzhu"-->
                  <!--:class="scope.row.complete10 !== false?'fuzhu-selected-color':''"-->
                  <!--@click="showAssist(scope.row, '10')"-->
                  <!--style="top: 6px; right: 3px;">辅</span>-->
              </template>
              <template  v-else >
                <div class="edit-assi-box">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :disabled="!scope.row.acctCodeName"
                    :content="scope.row.acctCodeName"
                    placement="top-start">
                    <span class="edit-content psb-more-tips-content">{{scope.row[item.prop]}}</span>
                  </el-tooltip>
                </div>
              </template>
            </template>
            <template v-else-if="item.prop==='acct20'">
              <template v-if="scope.row.isEdit">
                <el-select
                  filterable
                  clearable
                  v-model="scope.row[item.prop]"
                  popper-class="auto-complete"
                  class="vue-edit-box"
                  placeholder=""
                  remote
                  @change="changeAccount(scope.row, '20')"
                  @visible-change="settleVisibleChange($event, scope.row[item.prop])"
                  v-loadmore="settleLoadMore"
                  :remote-method="settleRemoteMethod"
                >
                  <el-option
                    v-for="(item, i) in settleAccount"
                    :key="i"
                    :label="item.account"
                    :value="item.account">
                    <span>{{item.account}}</span>
                    <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </el-tooltip>
                  </el-option>
                  <div class="auto-complete-btn" @click="addSub(scope.row, '20')">
                    <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
                    <span>新增</span>
                  </div>
                </el-select>
                <!--<span-->
                  <!--v-if="isAssist(scope.row[item.prop])"-->
                  <!--class="fuzhu"-->
                  <!--:class="scope.row.complete20 !== false?'fuzhu-selected-color':''"-->
                  <!--@click="showAssist(scope.row, '20')"-->
                  <!--style="top: 6px; right: 3px;">辅</span>-->
              </template>
              <template  v-else >
                <div class="edit-assi-box">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :disabled="!scope.row.acctCodeName"
                    :content="scope.row.acctCodeName"
                    placement="top-start">
                    <span class="edit-content psb-more-tips-content">{{scope.row[item.prop]}}</span>
                  </el-tooltip>
                </div>
              </template>
            </template>
            <template v-else-if="item.prop==='charge_type_code'">
              <template v-if="scope.row.isEdit">
                <el-select
                  v-model="scope.row[item.prop]"
                  filterable
                  clearable
                  @change="changeChargeType(scope.row, $event)"
                  placeholder="">
                  <el-option
                    v-for="item in chargeType"
                    :key="item.charge_type_code"
                    :label="item.charge_type_name"
                    :value="item.charge_type_code">
                  </el-option>
                </el-select>
              </template>
              <template v-else><span class="psb-more-tips-content edit-content">{{scope.row.charge_type_name}}</span></template>
            </template>
            <voucher-mark
              v-else-if="item.prop==='vm_state'"
              :scope="scope"
              :item="item"
              :change-tax-type="changeTaxType"
              main-menu="psb"
              @check-voucher="checkVoucher"
              @delete-voucher="deleteVoucher"
            ></voucher-mark>
            <operation
              v-else-if="item.prop==='operation' && !changeTaxType"
              :scope="scope"
              :bookkeeping="bookkeeping"
              :editContent="editContent"
              main-menu="psb"
              @save-all="saveAll"
            ></operation>
            <span v-else>{{scope.row[item.prop]}}</span>
            <i v-if="scope.row.showIcon&&item.prop==='acct20'"
               class="el-icon-edit edit-tip text-color" style="z-index: 2"></i>
          </template>
        </el-table-column>
      </el-table>
      <!--新增科目-->
      <add-subject
        :subject-data="subjectData"
        @on-add-after="onAddSubAfter"
      ></add-subject>
      <!-- 辅助核算 -->
      <assist-accounting
        :accountingData="accountingData"
        :isDisabled="fuzhuDisabled"
        @refreshList="getAssist"
        @addAssissData="addAssistData"
      ></assist-accounting>
    </div>
</template>

<script>
  import Operation from '@/views/components/ColumnItem/Operation'
  import VoucherMark from '@/views/components/ColumnItem/VoucherMark'
  import AddSubject from '@/views/components/AddAcct/index'
  // 辅助核算
  const AssistAccounting = () => import('@/views/components/assistAccounting/index')

  import {deepCopy} from '@/utils/assist'
  import { showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {getLastStageCode, isFuzhuSub} from '@/utils/eval'
  import {getSettleSub, getCode} from '@/utils/subCode'
  import {getCurrencyCode, settleCode} from '@/views/components/AddAcct/eval'

  import {assistData} from '@/views/components/assistAccounting/data'
  import {subData} from '@/views/components/data/common'
  // 下拉框懒加载
  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {options} from '@/views/components/data/common'
  export default {
    data () {
      return {
        fullHeight: document.documentElement.clientHeight - 112,
        settleAccount: [],
        settleSub: [],
        options: deepCopy(options),
        subCode: getCode('psb'),
        stockAccount: [],
        upRow: {},
        subjectData: deepCopy(subData), // 科目新增
        accountingData: assistData, // 辅助核算所需字段
        fuzhuDisabled: false,
        currencyCode: getCurrencyCode('psb'),
        curItem: {},
        editType: ''
      }
    },
    props: {
      columns: Array,
      list: Array,
      editContent: Object,
      bookkeeping: Object,
      changeTaxType: Boolean,
      chargeType: Array
    },
    methods: {
      handleSelected (selectedList, row) {
        if (selectedList && selectedList.length) {
          const isCheck = selectedList.indexOf(row) !== -1
          const {list} = this
          for (const item of list) {
            if (item.id === row.id) {
              this.$refs.multipleTable.toggleRowSelection(item, isCheck)
            }
          }
        }
      },
      isAssist (acct) {
        return isAssist(acct)
      },
      saveAll () {
        this.$emit('on-save-all')
      },
      // 点击凭证字号进入查看凭证(拉取北京)
      checkVoucher (voucherId) {
        this.$emit('on-check-voucher', voucherId)
      },
      mouseEnter (row) {
        if (String(row.vm_state) === '2' || this.changeTaxType || row.isEdit) {
          return
        }
        row.showIcon = true
      },
      mouseLeave (row) {
        if (String(row.vm_state) === '2' || this.changeTaxType || row.isEdit) {
          return
        }
        row.showIcon = false
      },
      clickCell (e, f) {
        if (e.isEdit || e.vm_state === 2 || this.changeTaxType || (f.property !== 'acct10' && f.property !== 'acct20' && f.property !== 'charge_type_code')) return
        e.isEdit = true
        const code = getSettleSub(e.sm_id)
        this.settleSub = getLastStageCode(code)
        e.showIcon = false
        e.acct10 = isFuzhuSub(e.acct10)
        e.acct20 = isFuzhuSub(e.acct20)
        const upRow = this.upRow
        if (upRow && upRow.isEdit) {
          upRow.isEdit = false
        }
        this.upRow = e
      },
      addSub (curItem, type) {
        this.editType = type
        this.subjectData = deepCopy(subData)
        if (type === '20') {
          this.subjectData.superiorSub.code = getSettleSub(String(curItem.sm_id))
          this.subjectData.accounting.code =  settleCode
          this.subjectData.accounting.type = 'settle'
        } else {
          this.subjectData.superiorSub.code = this.subCode
          this.subjectData.accounting.code = this.currencyCode
          this.subjectData.accounting.type =  'income'
        }
        this.subjectData.subModal = true
        this.curItem = curItem
        this.editType = type
      },
      onAddSubAfter(code) {
        const {newSubVal} = this.subjectData
        if (this.editType === '10') {
          this.curItem.acct10 = `${code} ${newSubVal}`
        } else {
          this.curItem.acct20 = `${code} ${newSubVal}`
        }
        this.changeAccount(this.curItem, this.editType)
      },
      // 辅助核算
      showAssist(curItem, type) {
        this.editType = type
        this.curItem = curItem
        const acct = type === '10' ? curItem.acct10 : curItem.acct20
        const curValArray = acct.split(' ')
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.acctCiName = type === '10' ? curItem.acct_10_ci_name  : curItem.acct_20_ci_name
        this.getAssist(curItem)
      },
      getAssist() {
        showFuzhu(this.accountingData)
      },
      addAssistData (value) {
        if (this.editType === '10') {
          this.curItem.acct_10_ci_name = value
          this.curItem.complete10 = true
        } else {
          this.curItem.acct_20_ci_name = value
          this.curItem.complete20 = true
        }
        this.saveEditData(this.curItem)
      },
      changeChargeType (row) {
        const {chargeType} = this
        const idx = chargeType.findIndex(item => item.charge_type_code === row.charge_type_code)
        if (idx > -1) {
          row.charge_type_name = this.chargeType[idx].charge_type_name
        } else {
          row.charge_type_name = ''
        }
        row.acct10 = ''
        row.acct10_ci_name = ''
        row.complete10 = false
        this.saveEditData(row)
      },
      changeAccount(row, type) {
        if (type === '10') {
          row.acct_10_ci_name = ''
          row.complete10 = false
        } else {
          row.complete20 = false
          row.acct_20_ci_name = ''
        }
        this.saveEditData(row)
      },
      settleVisibleChange (val, model) {
        if (val) {
          this.settleAccount = selectVisibleChange(model, this.settleSub, this.options)
        }
      },
      settleLoadMore () {
        if (this.options.isLoadMore) {
          this.settleAccount = loadMore(this.settleAccount, this.settleSub, this.options)
        }
      },
      settleRemoteMethod (val) {
        this.settleAccount = remoteMethod(val, this.settleSub, this.options)
      },
      stockVisibleChange (val, model) {
        if (val) {
          this.stockAccount = selectVisibleChange(model, this.codeList, this.options)
        }
      },
      stockLoadMore () {
        if (this.options.isLoadMore) {
          this.stockAccount = loadMore(this.stockAccount, this.codeList, this.options)
        }
      },
      stockRemoteMethod (val) {
        this.stockAccount = remoteMethod(val, this.codeList, this.options)
      },
      handleSelectionChange (list) {
        this.$emit('on-selection-change', list)
      },
      saveEditData (row) {
        const {allSaveBtn, editList} = this.editContent
        if (!allSaveBtn) {
          this.editContent.allSaveBtn = true
        }
        if (editList.length) {
          const idx = editList.findIndex(v => v.id === row.id)
          if (idx > -1) {
            return
          }
        }
        editList.push(row)
        this.$refs.multipleTable.clearSelection()
      },
      // 双击信息行，已生成凭证的查看详情，未生成凭证的编辑
      dblClickRow (row) {
        this.$emit('row-dblclick', row)
      },
      deleteVoucher (vchIdArray) {
        this.$emit('on-delete-voucher', vchIdArray)
      },
      changeSettleMethod (row, newVal) {
        const {settleMethod} = this
        for (const item of settleMethod) {
          if (newVal === item.sm_name) {
            row.sm_id = item.sm_id
          }
        }
        const code = getSettleSub(row.sm_id)
        this.settleSub = getLastStageCode(code)
        row.acct20 = this.settleSub[0].account
        row.acct_20_ci_name = ''
        row.complete = false
      }
    },
    computed: {
      codeList () {
        return  getLastStageCode(this.subCode)
      }
    },
    components: {
      Operation,
      VoucherMark,
      AddSubject,
      AssistAccounting
    }
  }
</script>

<style scoped>

</style>
