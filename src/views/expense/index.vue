<style lang='scss' scoped>
  .expense{
    position: relative;
  }
  .billdetail-foot {
    margin-top: 10px;
  }

  .header-btn {
    padding: 10px 6px;
  }

  i.fa {
    margin-right: 10px;
  }
  .vue-table {
    width: 100%;
    border-top: 1px solid #e7ebf5;
    border-bottom: 1px solid #e7ebf5;
  }

  .line{
    text-align: center;
  }
  .footer-total-amount{
    position: relative;
  }
  .footer-tip{
 /*   position:absolute;
    z-index: 99;
    left: 0;
    width: 100%;
    text-align: center;
    padding:10px;*/
    font-size: 12px;
    color: #999;
    line-height: 24px;
  }
</style>

<template>
  <div class="expense">
    <!-- 头部 -->
    <header-operate
    :btn-type="btnType"
    :multiple-selection="multipleSelection"
    :form-content="formContent"
    :filter-form="filterForm"
    :filter-form-old="filterFormOld"
    :edit-content="editContent"
    :isFilterNumber="isFilterNumber"
    :change-tax-type="changeTaxType"
    :proofState="true"
    inputTip="请输入凭证字号"
    main-menu="expense"
    @on-filter="getExpenseList"
    @on-create-voucher="createVoucher"
    @on-save-all="onSaveAll"
    @on-delete-voucher="deleteVoucher(0, $event)"
    @on-clear-data="deleteInvoice"
    @on-save-Remark="save_Remark"
    @on-delete-remarks="delete_Remark"
    @on-setting-voucher="settingVoucher"
    :more="more"
    >
      <template slot="filterItem">
        <el-form-item label="摘要">
          <el-input v-model="formContent.summary" placeholder="请输入摘要"
          size="small"></el-input>
        </el-form-item>
        <el-form-item :label="vatId !=='1' ? '价税合计金额' : '支出金额' ">
          <el-col :span="11">
            <el-input
              v-model="formContent.startAmount"
              placeholder="0.00"
              @input="handleInput($event,'startAmount')"
              size="small"
            ></el-input>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-input
              v-model="formContent.endAmount"
              placeholder="0.00"
              @input="handleInput($event,'endAmount')"
              size="small"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-if="vatId!=='1'" label="可抵扣进项税额">
          <el-col :span="11">
            <el-input
              v-model="formContent.startTaxamount"
              placeholder="0.00"
              @input="handleInput($event,'startTaxamount')"
              size="small"
            ></el-input>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-input
              v-model="formContent.endTaxamount"
              placeholder="0.00"
              @input="handleInput($event,'endTaxamount')"
              size="small"
            ></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="凭证状态">
          <el-select v-model="formContent.curScreen" size="small">
            <el-option
              v-for="item in options_vm_states"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
      </template>
    </header-operate>
    <!--主列表-->
    <main-table
    :columns="columns"
    :table-data="tableData"
    :list="list"
    :loading="loading"
    :exacct-list="exacctList"
    :bookkeeping="bookkeeping"
    :editContent="editContent"
    :change-tax-type="changeTaxType"
    @on-hint="hint_input"
    @save-all="onSaveAll"
    @on-selection-change="handleSelectionChange"
    @check-voucher="toCheckVoucher"
    @on-delete-voucher="deleteSingleVoucher"
    @delete-row="deleteRow"
    @change-val="changeVal"
    @on-add-sub="addSub"
    @sort-change="sortChange"
    @on-save-Remark="save_Remark"
    ></main-table>
    <!--底部合计栏-->
    <div class="footer-total-amount">
      <div class="footer-amount">
        <div class="amount-box" style="font-size: 14px;font-weight: bold;">
          <span style="font-size: 14px;font-weight: bold; color:#666666;"> 合计</span>&nbsp;&nbsp;
        </div>
        <div class="amount-box"  v-if="vatId!=='1'">
          价税合计金额：
          <span v-if="String(amountData.tax) === '0' && amountData.negativeTax === '0'">0&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span v-if="String(amountData.tax)!== '0'">{{amountData.tax}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span v-if="String(amountData.negativeTax) !== '0'">{{amountData.negativeTax}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div class="amount-box"  v-if="vatId ==='1'">
          支出金额：
          <span v-if="String(amountData.tax) === '0' && String(amountData.negativeTax) === '0'">0&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span v-if="String(amountData.tax)!== '0'">{{amountData.tax}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span v-if="String(amountData.negativeTax)!=='0'">{{amountData.negativeTax}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div v-if="vatId!=='1'" class="amount-box">
          可抵扣进项税额：
          <span v-if="String(amountData.taxAmount) === '0' && String(amountData.negativeTaxAmount) ==='0'">0&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span v-if="String(amountData.taxAmount)!=='0'">{{amountData.taxAmount}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span v-if="String(amountData.negativeTaxAmount)!=='0'">{{amountData.negativeTaxAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div class="footer-tip">
        <span style="color:#FFA854;">温馨提示：</span>1、仅对有发生额的费用行录入数据即可。2、默认现金付款。
      </div>
    </div>

    <!--新增科目弹窗-->
   <add-subject
      :subjectData="subjectData"
      @on-add-after="onAddSubAfter"
      main-menu="expense"
   ></add-subject>
    <!--查看凭证-->
    <check-voucher
      :voucher="voucher"
    ></check-voucher>
    <!--记账-->
    <keep-accounts
      :bookkeeping="bookkeeping"
      @on-save="getExpenseList"
    ></keep-accounts>
    <!--弹窗-->
    <el-dialog
      v-if="dialogModal.modal"
      :close-on-click-modal="false"
      :width="typeDesc[dialogModal.type][0]"
      :visible.sync="dialogModal.modal"
      :title="typeDesc[dialogModal.type][1]"
    >
      <template>
        <!--凭证习惯设置-->
        <setting-voucher
          v-if="dialogModal.type==='setting'"
          :setting-data="settingData"
          :taxFinance="taxFinance"
        ></setting-voucher>
      </template>
      <template slot="footer">
        <!--凭证习惯设置-->
        <template v-if="dialogModal.type==='setting'">
          <el-button @click="closeSettingModal" size="small" class="button-com">取消</el-button>
          <el-button @click="saveSettingVoucher" size="small" type="primary">确定</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script >
  import KeepAccounts from '@/views/components/KeepAccounts/index.vue'
  import AddSubject from '@/views/components/AddAcct/index'
  import CheckVoucher from '@/views/components/CheckVoucher.vue'
  import HeaderOperate from '@/views/components/HeaderOperate'
  import MainTable from './components/MainTable'
  import SettingVoucher from '@/views/components/SettingVoucher/index.vue'

  import {deepCopy} from '@/utils/assist'
  import {expenseData} from './data/common'
  import {fixedData} from './data/fixedData'
  import {settingData} from './data/voucher'
  import {
    getColumnList,
    saveExpenseRecord,
    deleteBills,
    createVouchers,
    initAddAcct,
    deleteVoucher,
    initAcctCode,
    saves,
    addRemark,
    deleteRemark } from '@/api/expense'
  import {queryVoucherRule, updateVoucherRule} from '@/api/common'
  import {filterForm} from './data/data'
  import {Message, Loading, MessageBox} from 'element-ui'
  import {localParams, duration, subData} from '@/views/components/data/common'
  import {crtTimeFtt} from '@/utils/dateFormat'
  import { dealListForVoucher, checkNum, toMoney} from '@/utils/utils'
  import { sortTables } from '@/utils/sort'
  import {getFloat} from './data/count'

  import store from '@/store/index'

  export default {
    name: 'expenseIndex',
    data () {
      return {
        ...deepCopy(expenseData),
        ...fixedData,
        settingData: deepCopy(settingData),
        more: [{
          itemType: 'deleteVoucher',
          itemName: '删除凭证'
        }, {
          itemType: 'clearData',
          itemName: '删除清单'
        }, {
          itemType: 'remarks',
          itemName: '添加备注'
        }, {
          itemType: 'deleteRemarks',
          itemName: '删除备注'
        }],
        dialogModal: {
          modal: false, // 弹出框控制
          type: 'setting' // 'setUp'理票
        },
        isFilterNumber: true,
        list: [],
        oldList: [],
        tableData: [],
        ent_id: '',
        exacctList: [],
        multipleSelection: [],
        subjectData: deepCopy(subData),
        rowData: {},
        voucher: {
          modal: false,
          curListIdx: null,
          vch_id: '',
          list: []
        },
        filterForm: deepCopy(filterForm),
        filterFormOld: deepCopy(filterForm),
        formContent: deepCopy(filterForm),
        editContent: {
          allSaveBtn: false,
          editList: []
        },
        bookkeeping: {
          modal: false,
          iframeSrc: ''
        },
        imgModal: {
          modal: false
        },
        footerAmount: {},
        amountData: {
          tax: 0,
          negativeTax: 0,
          taxAmount: 0,
          negativeTaxAmount: 0
        },
        imgInfo: {},
        loading: false,
        edited: true,
        showTip: sessionStorage.getItem('expenseTip'),
        vatId: '',
        hint: '',
        changeTaxType: false, // 纳税身份转换，false可编辑，true 不可编辑
        taxFinance: true // 凭证切换
      }
    },
    created () {
      this.getExpenseList()
      const indexData = this.$store.getters.indexData
      const urlInfo = this.$store.getters.urlInfo
      const changeTime = indexData.entAcctVO.year_period
      if (changeTime) {
        if (parseInt(changeTime) > parseInt(urlInfo.ssyf)) {
          this.changeTaxType = true
          this.btnType = null
          this.more = null
        }
      }
      window.closeExpense = this.beforeClose
    },
    methods: {
      // 删除备注信息
      delete_Remark (arg) {
        deleteRemark(arg).then(res => {
          this.$message({
            showClose: true,
            message: '删除备注信息成功',
            duration: 1500,
            type: 'success'
          })
          this.getExpenseList()
        }, e => {
          console.log(e)
          this.getExpenseList()
        })
      },
      // 保存备注信息
      save_Remark (arg) {
        const params = {
          ids: arg.id,
          remark: arg.arg
        }
         addRemark(params).then(resp => {
            this.$message({
              showClose: true,
              message: '保存备注信息成功',
              duration: 1500,
              type: 'success'
            })
            this.getExpenseList()
          }, err => {
            console.log(err)
            this.getExpenseList()
          })
      },
      clear_s () {
        const vm = this
        const urlInfo = store.getters.urlInfo
        const indexData = store.getters.indexData
        let dateFormat
        if (vm.tableData[0].bill_date != null) {
          dateFormat = vm.tableData[0].bill_date
        } else {
          // 获取业务期间
          const bill_date = urlInfo.ssyf
          // 获取当前年份
          const nian = bill_date.substr(0, 4)
          // 获取当前月份
          const yue = bill_date.substr(4, 6)
          // 构造一个日期对象：
          const day = new Date(nian, yue, 0)
          // 获取天数：
          const daycount = day.getDate()
          dateFormat = nian + '-' + yue + '-' + daycount
        }
        const itm = {
          year_period: urlInfo.ssyf,
          bill_date: dateFormat,
          summary: '',
          tax_amount: 0,
          amount: 0,
          acct_10_code: vm.tableData[0].acct_10_code,
          acct_10_name: vm.tableData[0].acct_10_name,
          id: vm.tableData[0].id,
          ent_id: indexData.entAcctVO.id // 企业id
        }
        const expenseList = []
        expenseList.push(itm)
        const params = {
          expenseList: expenseList
        }
        saves(params).then(res => {
          vm.getExpenseList()
        }, error => {
        })
      },
      // 批量删除费用
      deleteInvoice (idArray) {
        const vm = this
        Loading.service(localParams)
        if (vm.tableData.length === 1) {
          if (idArray.length === vm.tableData.length) {
            vm.$message({
              showClose: true,
              message: '已经只剩一行了不能再删除了！！！',
              duration: 1500,
              type: 'warning'
            })
            Loading.service().close()
          }
        } else {
          if (idArray.length === vm.tableData.length) {
            idArray.splice(0, 1)
            deleteBills(idArray).then(res => {
              if (res.code === '0') {
                Message({
                  message: res.message,
                  type: 'success',
                  duration: duration
                })
                vm.clear_s()
                Loading.service().close()
              }
            }).catch(e => {
              Message({
                message: e,
                type: 'error',
                duration: duration
              })
              Loading.service().close()
            })
          } else {
            deleteBills(idArray).then(res => {
              if (res.code === '0') {
                vm.getExpenseList()
                Loading.service().close()
                Message({
                  message: res.message,
                  type: 'success',
                  duration: duration
                })
              }
            }).catch(e => {
              Message({
                message: e,
                type: 'error',
                duration: duration
              })
            })
          }
        }
      },

      // 批量删除凭证
      deleteVoucher (isIncome, vchIdArray, type) {
        Loading.service(localParams)
        deleteVoucher(vchIdArray).then(res => {
          if (res.code === '0') {
            this.getExpenseList()
            Loading.service().close()
            Message({
              message: res.message,
              type: 'success',
              duration: duration
            })
          }
        }).catch(e => {
          Loading.service().close()
          Message({
            message: e,
            type: 'warning',
            duration: duration
          })
        })
      },
      // 离开页面前判断是否要保存数据
      beforeClose () {
        if (this.editContent.allSaveBtn) {
          return MessageBox.alert('数据已经修改，是否保存？', '全部保存', {
            confirmButtonText: '是',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.onSaveAll()
              }
            }
          })
        } else {
          let url = null
          if (parent !== window) {
            try {
              url = parent.location.href
            } catch (e) {
              url = document.referrer
            }
          } else {
            url = window.location.href
          }
          parent.postMessage('off', url)
        }
      },
      // 获取页面数据
      getExpenseList (inputVal, vmState) {
        this.list = []
        this.tableData = []
        this.oldList = []
        Loading.service(localParams)
        this.editContent = {
          allSaveBtn: false,
          editList: []
        }
        this.multipleSelection = []
        const params = {
          vm_state: vmState,
          startAmount: this.filterForm.startAmount,
          endAmount: this.filterForm.endAmount,
          startTaxamount: this.filterForm.startTaxamount,
          endTaxamount: this.filterForm.endTaxamount,
          summary: this.filterForm.summary,
          vt_num_list: inputVal || '' // 凭证字号：（1）默认不传
        }
        getColumnList(params).then(resp => {
          const dataList = resp.data
          this.vatId = String(dataList.vat_id)
          if (this.vatId === '1') {
            this.columns = this.columns.filter(item => item.prop !== 'resetTaxAmount')
            const idx = this.columns.findIndex(item => item.prop === 'resetAmount')
            this.columns[idx].label = '支出金额'
          }
          Object.keys(this.amountData).forEach(item => {
            this.amountData[item] = toMoney(dataList[item])
            this.amountData[item] = toMoney(dataList[item])
          })
          this.footerAmount = deepCopy(this.amountData)
          this.initData(dataList)
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },
      initData (data) {
        if (data.list && data.list.length > 0) {
          data.list.forEach((item, index) => {
            item.isEdit = false
            item.showIcon = false
            item.showWarningIcon = false
            item.resetAmount = item.amount === 0 ? '' : toMoney(item.amount)
            item.resetTaxAmount = item.tax_amount === 0 ? '' : toMoney(item.tax_amount)
            item.amount = item.amount === 0 ? '' : item.amount
            item.att_num = item.att_num === 0 ? '' : item.att_num
            item.tax_amount = item.tax_amount === 0 ? '' : item.tax_amount
            item.index = index
            if (!item.bill_date) {
              const defaultDate = new Date(+String(item.year_period).substring(0, 4), +String(item.year_period).substring(4), 0)
              item.formatDate = crtTimeFtt('yyyy-MM-dd', defaultDate)
              item.defaultDate = defaultDate
            } else {
              item.formatDate = crtTimeFtt('yyyy-MM-dd', item.bill_date)
              item.defaultDate = new Date(item.bill_date)
            }
            item.code_name = item.acct_10_code + ' ' + item.acct_10_name
            if (item.vm_state === 2) {
              item.vmState = item.vt_num_list.split(',')[0].split('-')[1]
            } else if (item.vm_state === 3) {
              item.vmState = '1000000000000'
            } else {
              item.vmState = '1000000000001'
            }
          })
        }
        if (data.allList && data.allList.length > 0) {
          data.allList.map(item => {
            if (item._AuxAccItem.trim() !== '' && item._AuxAccItem.trim() !== null) {
              item.exacct = item._Code.trim() + ' ' + item._Name.trim() + ' ' + '辅'
            } else {
              item.exacct = item._Code + ' ' +  item._Name
            }
          })
        }
        this.list = data.list
        this.tableData = data.list
        this.exacctList = data.allList
      },
      // 删除一行
      deleteRow (row, index) {
        if (this.tableData.length > 1) {
          if (this.editContent.allSaveBtn) {
            if (row.id === 0) {
              this.tableData.splice(index, 1)
              let newData = false
              const tableData = this.tableData
              for (let i = 0; i < tableData.length; i++) {
                if (this.tableData[i].id === 0) {
                  newData = true
                }
                tableData[i].index = i
              }
              if (!newData && this.editContent.editList.length === 0) {
                this.editContent.allSaveBtn = false
              }
            } else {
              return MessageBox.alert('数据已经修改，是否保存？', '全部保存', {
                confirmButtonText: '是',
                type: 'warning',
                callback: action => {
                  if (action === 'confirm') {
                    this.onSaveAll()
                  }
                }
              })
            }
          } else {
            if (!String(row.id)) {
              return Message({
                message: '清单ID不能为空',
                type: 'warning',
                duration: duration
              })
            }
            if (!row.resetAmount || String(row.resetAmount) === '0') {
              const params = [row.id]
              Loading.service(localParams)
              this.onDeleteRow(params)
              return
            }
            MessageBox.alert('你确定要删除这条费用信息吗？', '请确认', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: action => {
                if (action === 'confirm') {
                  const params = [row.id]
                  Loading.service(localParams)
                  this.onDeleteRow(params)
                }
              }
            })
          }
        } else {
          Message({
            message: '已经只剩一行了不能再删除了！',
            type: 'warning'
          })
        }
      },
      onDeleteRow (params) {
        deleteBills(params).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.getExpenseList()
        }, err => {
          Loading.service().close()
          console.log(err)
        })
      },
      // 编辑输入框值发生变化时
      changeVal (row) {
        const editList = this.editContent.editList
        let isNew = true
        if (row.id !== 0) {
          for (let i = 0; i < editList.length; i++) {
            if (editList[i].id === row.id) {
              isNew = false
              editList[i] = row
              break
            }
          }
          if (isNew) {
            editList.push(row)
          }
          this.editContent.editList = editList
          this.editContent.allSaveBtn = true
        }
      },
      // 获取提示信息
      hint_input (msg) {
        this.hint = msg
      },
      // 保存编辑数据
      onSaveAll () {
        const hint = this.hint
        for (const val of this.tableData) {
          if (val.id === 0) {
            this.editContent.editList.push(val)
          }
        }
        for (const item of this.editContent.editList) {
          if (item.showWarningIcon && this.vatId !== '1') {
            Message({
              message: hint,
              type: 'warning',
              duration: duration
            })
            return false
          }
        }
        Loading.service(localParams)
        const expenseList = []
        this.editContent.editList.forEach((item) => {
          const dateFormat = item.defaultDate
          let acct_code = ''
          let acct_name = ''
          if (item.code_name) {
            const idx = item.code_name.indexOf(' ')
            acct_code = item.code_name.slice(0, idx)
            acct_name = item.code_name.slice(idx + 1)
          }
          item.bill_date = crtTimeFtt('yyyy-MM-dd', dateFormat)
          item.acct_10_code = acct_code
          item.acct_10_name = acct_name
          item.amount = item.amount ? item.amount : 0
          item.amount = getFloat(item.amount, 2)
          item.tax_amount = item.tax_amount ? item.tax_amount : 0
          item.tax_amount = getFloat(item.tax_amount, 2)
          item.att_num = item.att_num ?  item.att_num : 0
          expenseList.push(item)
        })
        const params = {
          expenseList: expenseList
        }
        saveExpenseRecord(params).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.getExpenseList()
        }, error => {
          console.log(error)
          Loading.service().close()
        })
      },
      handleSelectionChange (list) {
        if (list && list.length > 0) {
          const amount = {
            tax: 0,
            negativeTax: 0,
            taxAmount: 0,
            negativeTaxAmount: 0
          }
          for (const item of list) {
            if (item.amount > 0) {
              amount.tax = (+amount.tax) + (+item.amount)
            } else {
              amount.negativeTax = (+amount.negativeTax) + (+item.amount)
            }
            if (item.tax_amount > 0) {
              amount.taxAmount = (+amount.taxAmount) + (+item.tax_amount)
            } else {
              amount.negativeTaxAmount = (+amount.negativeTaxAmount) + (+item.tax_amount)
            }
          }
          Object.keys(amount).forEach(item => {
            const itemVal = amount[item]
            amount[item] = itemVal ? toMoney(itemVal.toFixed(2)) : '0'
          })
          this.amountData = amount
        } else {
          this.amountData = deepCopy(this.footerAmount)
        }
        this.multipleSelection = list
      },
      createVoucher (ids) {
        if (this.editContent.allSaveBtn) {
          return MessageBox.alert('数据已经修改，是否保存？', '全部保存', {
            confirmButtonText: '是',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.onSaveAll()
              }
            }
          })
        }
        Loading.service(localParams)
        const params = {
          idArray: ids
        }
        createVouchers(params).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.getExpenseList()
        }, error => {
          console.log(error)
          this.getExpenseList()
          Loading.service().close()
        })
      },
      addSub (row) {
        Loading.service(localParams)
        this.subjectData = deepCopy(subData)
        this.subjectData.subTitle = '新增科目'
        initAddAcct().then(resp => {
          const list = []
          resp.data.forEach(item => {
            list.push(item._Code + ' ' + item._Name)
          })
          this.subjectData.superiorSub.options = list
          this.subjectData.subModal = true
          this.rowData = row
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },
      onAddSubAfter (code, name) {
        const {newSubVal} = this.subjectData
        this.rowData.code_name = `${code} ${name}-${newSubVal}`
        this.changeVal(this.rowData)
        initAcctCode().then(resp => {
          if (resp.data && resp.data.length > 0) {
            resp.data.map(item => {
              if (item._AuxAccItem.trim() !== '' && item._AuxAccItem.trim() !== null) {
                item.exacct = item._Code.trim() + ' ' + item._Name.trim() + ' ' + '辅'
              } else {
                item.exacct = item._Code + ' ' +  item._Name
              }
            })
            this.exacctList = resp.data
          }
        }, err => {
        })
      },
      toCheckVoucher (voucherId) {
        this.voucher.modal = true
        this.voucher.curListIdx = null
        this.voucher.vch_id = voucherId
        this.voucher.list = dealListForVoucher(this.tableData)
      },
      deleteSingleVoucher (vchIdList, rowData) {
        Loading.service(localParams)
        /* const params = {
          id: rowData.id,
          vch_id_list: vchIdList
        }*/
        const params = [vchIdList]
        deleteVoucher(params).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.getExpenseList()
        }, error => {
          Loading.service().close()
        })
      },
      // 控制过滤输入框只能输入数字
      handleInput (evt, name) {
        const self = this
        if (!checkNum(evt)) {
          evt = evt.replace(/[^\d|.]/g, '')
          setTimeout(function () {
            self.formContent[name] = evt
          }, 10)
        }
      },
      sortChange (tableData, e) {
        this.tableData = sortTables(tableData, e)
      },
      toImg (row) {
        this.imgInfo = row
        this.imgModal.modal = true
      },
      closeTip () {
        sessionStorage.setItem('expenseTip', 'hide')
        this.showTip =  sessionStorage.getItem('expenseTip')
      },
      settingVoucher () {
        Loading.service(localParams)
        this.queryVoucher().then(resp => {
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },
      queryVoucher () {
        return new Promise((resolve, reject) => {
          queryVoucherRule({module: 'expense'}).then(resp => {
            const {firstMergeRule, voucherDateRule} = resp.data
            this.settingData = deepCopy(settingData)
            const {createType: {subItem}, createDate} = this.settingData
            subItem[0].type = firstMergeRule
            createDate.voucherDateRule = voucherDateRule
            this.dialogModal.modal = true
            this.dialogModal.type = 'setting'
            return resolve(resp)
          }, err => {
            return reject(err)
          })
        })
      },
      closeSettingModal () {
        this.dialogModal.modal = false
        this.dialogModal.type = ''
      },
      saveSettingVoucher () {
        Loading.service(localParams)
        const {createType: {subItem}, createDate: {voucherDateRule}} = this.settingData
        const params = {
          voucher_rule: JSON.stringify({
            firstMergeRule: subItem[0].type,
            voucherDateRule: voucherDateRule
          }),
          module: 'expense'
        }
        updateVoucherRule(params).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.dialogModal.modal = false
          this.dialogModal.type = ''
        }, err => {
          Loading.service().close()
        })
      }
    },
    components: {
      HeaderOperate,
      MainTable,
      AddSubject,
      CheckVoucher,
      KeepAccounts,
      SettingVoucher
    }
  }
</script>
