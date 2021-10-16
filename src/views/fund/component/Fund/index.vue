<style lang="scss" scoped>
  .remarks{
    position: absolute;
    top:0px;
    right: 5px;
    button{
      overflow: hidden;
      padding:8px 0;
      color: #CCCCCC;
    }
  }
  .fund-page {
    .fuzhu {
      right: 12px;
    }
  }
  .warning-icon{
    position: absolute;
    top:8px;
    right: 0;
    color: #e96a69;
  }
  .edit-assi-box{
    display: inline-block;
    position: relative;
    width: calc(100% - 28px);
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    .fund-more-tips-content{
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      height: 30px;
      line-height: 30px;
    }
  }

</style>
<style lang="scss">
  .item{
    line-height: 180%;
    word-wrap : break-word;
    text-align: left;
    max-width:400px;
  }
  .fund-box{
    .el-table{
      .edit-row-box{
        .el-select{
          width: calc(100% - 28px);
        }
        .cell {
          padding-right: 10px;
          position: relative;
          height: 30px;
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
</style>
<template>
  <div class="fund-box" tabindex="1" @keydown="keyDownEvent($event)" @keyup="keyUpEvent">
    <el-table
      stripe
      border
      ref="multipleTable"
      :data="list"
      :height="fullHeight"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      @cell-click="clickCell"
      @select="select"
      class="vue-table vue-table-main">
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
        :class-name="item.className"
        :key="item.key"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.tip?true:false">
        <template slot-scope="scope">
          <!--备注模块图标-->
          <div v-if="item.remarks && scope.row.remark!==null && scope.row.remark!==''" class="remarks" style="width: 13px; height: 13px; margin-left: -50px">
            <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-end" popper-class="item">
              <el-button type="text" @click="showRemark(scope.row)">
                <i class="iconfont icon-xiaoxi"></i>
              </el-button>
            </el-tooltip>
          </div>
          <!--辅助核算警示-->
          <template v-if="item.prop==='acct'">
            <!--{{scope.row.bill_type_id === 51000015 ? '贷:':'借:'}}-->
            <template v-if="scope.row.isEdit">
              <el-select
                filterable
                clearable
                remote
                v-model="scope.row[item.prop]"
                popper-class="auto-complete"
                class="vue-edit-box"
                placeholder=""
                @change="changeCurBill(scope.row)"
                @visible-change="selectVisibleChange($event, scope.row[item.prop])"
                v-loadmore="loadMore"
                :remote-method="remoteMethod"
                no-match-text="">
                <el-option
                  v-for="(item, i) in accountList"
                  :key="item.account"
                  :label="item.account"
                  :value="item.account">
                  <span>{{item.account}}</span>
                  <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </el-tooltip>
                </el-option>
                <div class="auto-complete-btn" @click="addSub(scope.row)">
                  <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
                  <span>新增</span>
                </div>
              </el-select>
              <span
                class="fuzhu"
                v-if="scope.row.isEdit&&item.prop==='acct'&&isAssist(scope.row.acct)"
                :class="scope.row.complete?'fuzhu-selected-color':''"
                @click="showAssist(scope.row)">辅</span>
            </template>
            <template  v-else >
              <div class="edit-assi-box">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :disabled="!scope.row.acctCodeName"
                  :content="scope.row.acctCodeName"
                  placement="top-start">
                  <span class="edit-content fund-more-tips-content">{{scope.row[item.prop]}}</span>
                </el-tooltip>
              </div>
            </template>

          </template>
          <voucher-mark
            v-else-if="item.prop==='vm_state'"
            :scope="scope"
            :item="item"
            :change-tax-type="changeTaxType"
            main-menu="fund"
            @delete-voucher="deleteVoucher"
            @check-voucher="checkVoucher"
          ></voucher-mark>
          <operation
          v-else-if="item.prop==='operation' && !changeTaxType"
          :scope="scope"
          :bookkeeping="bookkeeping"
          :editContent="editContent"
          main-menu="fund"
          @save-all="saveAll"
        ></operation>
          <span v-else>{{scope.row[item.prop]}}</span>
          <i v-if="scope.row.showIcon&&item.prop==='acct'"
            class="el-icon-edit edit-tip text-color" style="z-index: 2"></i>
          <el-tooltip v-if="!scope.row.isEdit &&item.prop==='acct' && scope.row.complete === false" class="itme" effect="dark" content="辅助核算科目未完善" placement="top-end">
            <i class="el-icon-warning warning-icon" @click="showAssist(scope.row)"></i>
          </el-tooltip>
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
    <!--备注模块-->
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
  import AddSubject from '@/views/components/AddAcct/index'
  import AddRemark from '@/views/components/AddRemark'

  import {subData} from '@/views/components/data/common'
  import {getCurrencyCode} from '@/views/components/AddAcct/eval'

  import {getLastStageCode, isFuzhuSub} from '@/utils/eval'
  import {deepCopy} from '@/utils/assist'

  // 辅助核算
  const AssistAccounting = () => import('@/views/components/assistAccounting/index')
  import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {assistData} from '@/views/components/assistAccounting/data'
  import {isDisabledSub} from '@/utils/eval'
  import {Message} from 'element-ui'

  // 下拉框懒加载
  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {options, duration} from '@/views/components/data/common'

  export default {
    data () {
      return {
        fullHeight: document.documentElement.clientHeight - 112,
        subjectData: deepCopy(subData), // 科目新增
        accountingData: assistData, // 辅助核算所需字段
        upRow: {},
        rowData: {},
        isShift: false,
        isCtrl: false,
        originRow: '',
        multipleSelection: [],
        currencyCode: getCurrencyCode('fund'),
        fuzhuDisabled: false,
        accountList: [],
        options: deepCopy(options),
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
      editContent: Object,
      sortData: Object,
      bookkeeping: Object,
      changeTaxType: Boolean
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
      clickCell (e, f) {
        if (e.isEdit || e.vm_state === 2 || this.changeTaxType || f.property !== 'acct') return
        e.isEdit = true
        e.showIcon = false
        e.acct = isFuzhuSub(e.acct)
        const upRow = this.upRow
        if (upRow.isEdit) {
          upRow.isEdit = false
          const acctArray = upRow.acct.split(' ')
          if (acctArray.length > 1) {
            // upRow.acct = `${acctArray[0]} ${acctArray[1]}`
          }
        }
        this.upRow = e
      },
      sortChange (e) {
        this.$emit('sort-change', e)
      },
      handleSelectionChange (list) {
        this.multipleSelection = list
        this.$emit('on-selection-change', list)
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
      // 删除凭证
      deleteVoucher (vchIdArray) {
        this.$emit('on-delete-voucher', vchIdArray)
      },
      // 点击凭证字号进入查看凭证(拉取北京)
      checkVoucher (voucherId) {
        this.$emit('on-check-voucher', voucherId)
      },
      // 操作>图片
      toImg (row) {
        this.$emit('on-click-img', row)
      },
      saveAll () {
        this.$emit('on-save-all')
      },
      // 改变当前表格的值
      changeCurBill (row) {
        if (row.bill_type_id === 51000015) {
          row.acct_20_ci_name = ''
        } else {
          row.acct_10_ci_name = ''
        }
        let array = []
        const idx = this.multipleSelection.indexOf(row)
        if (idx !== -1) {
          array = this.multipleSelection.filter(v => v.vm_state !== 2)
          for (const item of array) {
            if (item.bill_type_id === 51000015) {
              item.acct_20_ci_name = ''
            } else {
              item.acct_10_ci_name = ''
            }
            item.acct = row.acct
            item.complete = !isAssist(row.acct)
          }
          this.saveEditData(array)
        } else {
          row.complete = !isAssist(row.acct)
          this.saveEditData(row)
        }
      },
      selectVisibleChange (val, model) {
        if (val) {
          this.accountList = selectVisibleChange(model, this.codeList, this.options)
        }
      },
      loadMore () {
        if (this.options.isLoadMore) {
          this.accountList = loadMore(this.accountList, this.codeList, this.options)
        }
      },
      remoteMethod (val) {
        this.accountList = remoteMethod(val, this.codeList, this.options)
      },
      // 新增科目
      addSub (row) {
        this.subjectData = deepCopy(subData)
        this.subjectData.superiorSub.code = []
        this.subjectData.accounting.code = this.currencyCode
        this.subjectData.accounting.type =  'all'
        this.subjectData.subModal = true
        this.subjectData.newSubVal = row.counterparty
        this.rowData = row
      },
      // 新增科目
      onAddSubAfter (code) {
        const {newSubVal} = this.subjectData
        this.rowData.acct = `${code} ${newSubVal}`
        this.changeCurBill(this.rowData)
      },
      isAssist (acct) {
        return isAssist(acct)
      },
      showAssist (row) {
        this.rowData = row
        const curValArray = row.acct.split(' ')
        const disableSub = isDisabledSub(row.acct)
        if (disableSub) {
          return Message({
            message: '该科目已被禁用，请到科目期初进行查看',
            type: 'warning',
            duration: duration
          })
        }
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.tips = row.counterparty
        if (String(row.vm_state) === '2') {
          this.fuzhuDisabled = true
        } else {
          this.fuzhuDisabled = false
        }
        this.accountingData.acctCiName = row.bill_type_id === 51000015 ? row.acct_20_ci_name : row.acct_10_ci_name
        this.getAssist()
      },
      getAssist () {
        showFuzhu(this.accountingData)
      },
      addAssistData (value) {
        if (this.rowData.bill_type_id === 51000015) {
          this.rowData.acct_20_ci_name = value
        } else {
          this.rowData.acct_10_ci_name = value
        }
        this.rowData.complete = true
        let array = []
        const idx = this.multipleSelection.indexOf(this.rowData)
        if (idx !== -1) {
          array = this.multipleSelection.filter(v => v.vm_state !== 2 && v.acct.split(' ')[0] === this.rowData.acct.split(' ')[0])
          for (const item of array) {
            if (item.bill_type_id === 51000015) {
              item.acct_20_ci_name = value
            } else {
              item.acct_10_ci_name = value
            }
            item.complete = true
          }
          this.saveEditData(array)
        } else {
          this.saveEditData(this.rowData)
        }
      },
      saveEditData (row) {
        const {allSaveBtn, editList} = this.editContent
        if (!allSaveBtn) {
          this.editContent.allSaveBtn = true
        }
        if (row instanceof Array) {
          for (const item of row) {
            const idx = editList.findIndex(v => v.id === item.id)
            if (idx === -1) {
              editList.push(item)
            }
          }
          this.$refs.multipleTable.clearSelection()
        } else {
          if (editList.length) {
            const idx = editList.findIndex(v => v.id === row.id)
            if (idx > -1) {
              return
            }
          }
          editList.push(row)
        }
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
    computed: {
      codeList () {
        return getLastStageCode([])
      }
    },
    components: {
      VoucherMark,
      Operation,
      AddSubject,
      AssistAccounting,
      AddRemark
    }
  }
</script>
