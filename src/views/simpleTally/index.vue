<style lang="scss" scoped>
  .simple{
    width: 100%;
    height: 100%;
    position: relative;

    .tax-amount{
      float: right;
      box-sizing: border-box;
      min-width: 32%;
    }
    .excluding-tax{
      min-width: 68%;
      box-sizing: border-box;
      float: left;
      text-align: right;
    }
    .grey{
      color: #c0c4cc;
    }
    .warn{
      color:#FFA854;
    }
    .bg-write{
      background: #fff;
    }
    .bg-grey{
      background: #fafafa;
    }
    .icon-box{
      position: absolute;
      right: 10px;
      font-size: 16px;
      top: 12px;
      color: #dcdfe6;
      i{
        cursor: pointer;
        margin-right: 5px;
      }
    }
  }
</style>
<style lang="scss">
  .simple{
    .label-padding{
      padding-right: 55px !important;
      position: relative;
    }
    .no-border{
      border-right: none !important;
    }
    .table-bottom{
      height: 44px;
      font-size: 13px;
      line-height: 44px;
    }
    .rate-input{
      width: 66px;
    }
    .vue-edit-box{
      .el-input__inner{
        text-align: left;
      }
    }
    .is-show-select {
      float: left;
      width: 45%;
      .el-input{

      }
    }
    .is-show-select+.is-show-input{
      float: right;
      width: 50%
    }
    .el-input__inner{
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
      text-align: right;
    }
    .rate-input{
      .el-input__inner{
        line-height: 28px;
      }
    }

  }
</style>
<template>
  <div class="simple">
    <div class="header-operate">
      <!--帮助-->
      <help-modal main-menu="simpleTally"></help-modal>
      <el-button
        v-for="item in btnType"
        :key="item.key"
        :disabled="disabled"
        @click="handelSaveBtn(item.value)"
        size="small"
        type='primary'
        class="float-right-btn">
        {{item.name}}
      </el-button>
      <el-button
        size="small"
        class="float-right-btn button-com"
        @click="copyData"
        :disabled="disabled"
      >复制上期</el-button>
    </div>
    <!--收入-->
    <div>
      <el-table
        stripe
        border
        :data="collectList"
        :max-height="collectTableHeight"
        :cell-class-name="cellClassName"
        class="vue-table vue-table-main"
        @cell-mouse-enter="mouseEnter"
        @cell-mouse-leave="mouseLeave"
      >
        <el-table-column
          prop="collection"
          label="收入项目"
          min-width="32%"
          align="left"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.trans_name"
              class="vue-edit-box"
              size="small"
              :disabled="disabled"
              @change="changeAcct(scope.row, incomeTransTypeList, 'income')"
            >
              <el-option
                v-for="(item, i) in incomeTransTypeList"
                :key="item.trans_name"
                :label="item.trans_name"
                :value="item.trans_name">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="income"
          label="不含税收入"
          align="right"
          min-width="35%"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.showInput">
              <el-select
                v-model="scope.row.shouldPayAcct"
                class="vue-edit-box is-show-select"
                size="small"
                :disabled="disabled"
              >
                <el-option
                  v-for="(item, i) in acctShouldPayList"
                  :key="item.acct"
                  :label="item.acct"
                  :value="item.acct">
                </el-option>
              </el-select>
            </template>
            <el-input
              v-model="scope.row.ex_tax_amount"
              class="is-show-input"
              size="small"
              placeholder="0.00"
              @input="handleIncomeInput($event, scope.row)"
              :disabled="disabled"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="taxAmount"
          label="税额"
          class-name="no-border label-padding"
          align="right"
          min-width="33%"
          placeholder="0.00"
        >
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.showInput"
              v-model="scope.row.tax_amount"
              :disabled="true"
              size="small"
              placeholder="0.00"
            ></el-input>
            <div class="icon-box" v-if="!disabled && scope.row.showIcon">
              <i class="iconfont icon-add1" @click="addRow(scope.row, scope.$index, collectList, incomeModule, 'income')"></i>
              <i class="iconfont icon-shanchutupian" @click="deleteRow(scope.row,scope.$index, collectList, 'income')"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div :class="collectList.length%2 === 0 ?'bg-white table-bottom' : 'bg-grey table-bottom'">
        <div style="text-align: right; padding-right: 65px">
          <div class="excluding-tax">
            <span v-if="excludingTax > limitAccount">
            <el-tooltip :content="collectLimit" placement="top" effect="dark">
              <i class=" el-icon-warning" style="font-size: 16px;color: #F56C6C"></i>
            </el-tooltip>
          </span>
            不含税收入合计： <span :class="excludingTaxStr === '0.00' ? 'grey' : 'warn'">{{excludingTaxStr}}</span>
          </div>
          <div class="tax-amount">
            价税合计：<span :class="taxAmountStr === '0.00' ? 'grey' : 'warn'" style="margin-right: 30px;">{{taxAmountStr}}</span>
            <span v-if="stockTip">
                <el-tooltip :content="stockTip" placement="top" effect="dark">
                  <i class=" el-icon-warning" style="font-size: 16px;color: #F56C6C"></i>
                </el-tooltip>
            </span>
            综合成本率
            <el-input
            size="small"
            placeholder="0.00"
            v-model="cost_rate"
            class="rate-input"
            @input="handleRateInput($event)"
            @change="handleInputChange"
            :disabled="disabled"
          ></el-input>&nbsp;%
            <el-tooltip content="仅为货物成本，其他支出及人工包含在“支出项目”中" placement="top" effect="dark">
              <i class="el-icon-question warn" style="font-size: 17px;"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!--支出-->
    <div style="margin-top: 44px;">
      <el-table
        stripe
        border
        :data="paymentList"
        :max-height="payTableHeight"
        ref="payTable"
        :cell-class-name="cellClassName"
        class="vue-table vue-table-main"
        @cell-mouse-enter="mouseEnter"
        @cell-mouse-leave="mouseLeave"
      >
        <el-table-column
          prop="pay"
          label="支出项目"
          min-width="32%"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.trans_name"
              class="vue-edit-box"
              size="small"
              @change="changeAcct(scope.row, payTransTypeList, 'payment')"
              :disabled="disabled"
            >
              <el-option
                v-for="(item, i) in payTransTypeList"
                :key="item.trans_name"
                :label="item.trans_name"
                :value="item.trans_name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="payment"
          label="支出金额"
          class-name="no-border label-padding"
          align="right"
          min-width="68%"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.showInput">
              <el-select
                v-model="scope.row.shouldPayAcct"
                class="vue-edit-box is-show-select"
                size="small"
                :disabled="disabled"
                clearable
              >
                <el-option
                  v-for="(item, i) in acctShouldPayList"
                  :key="item.acct"
                  :label="item.acct"
                  :value="item.acct">
                </el-option>
              </el-select>
            </template>
            <el-input
              v-model="scope.row.amount"
              size="small"
              class="is-show-input"
              placeholder="0.00"
              @input="handelPaymentInput($event, scope.row)"
              :disabled="disabled"
              clearable
            ></el-input>
            <div class="icon-box" v-if="!disabled && scope.row.showIcon">
              <i class="iconfont icon-add1" @click="addRow(scope.row, scope.$index, paymentList, payModule, 'pay')"></i>
              <i class="iconfont icon-shanchutupian" @click="deleteRow(scope.row,scope.$index, paymentList, 'pay')"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div :class="paymentList.length%2 === 0 ?'bg-white table-bottom' : 'bg-grey table-bottom'">
        <div style="text-align: right; padding-right: 65px">
             <span v-if="excludingTax < expense_total">
                <el-tooltip content="当期支出已超过当期收入，请注意账务赤字风险！" placement="top" effect="dark">
                  <i class=" el-icon-warning" style="font-size: 16px;color: #F56C6C"></i>
                </el-tooltip>
             </span>
          支出合计： <span :class="paymentTotalStr=== '0.00' ? 'grey' : 'warn'">{{paymentTotalStr}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // 组件
  import HelpModal from '@/views/components/Help/index.vue'
  import {Loading, Message, MessageBox} from 'element-ui'
  // 数据
  import {fixedData} from './data/fixedData'

  // api
  import {checkNum} from '@/utils/utils'
  import {deepCopy} from '@/utils/assist'
  import {toMoney} from '../../utils/utils'
  import {printFn} from './data/eval'
  import {getUrlData} from '@/utils/validate'
  import {getSimpleTally, saveAndFiletax, copyLastData} from '@/api/simpleTally'
  import {localParams, duration} from '@/views/components/data/common'
  const url = decodeURI(window.location.href).split('?')
  const urlInfo = getUrlData(url[1])
  export default {
    name: '',
    data () {
      return {
        ...fixedData,
        collectList: [],
        paymentList: [],
        incomeTransTypeList: [],
        payTransTypeList: [],
        acctShouldPayList: [],
        excludingTax: 0,
        excludingTaxStr: '0.00',
        income_total: 0,
        taxAmountStr: '0.00',
        expense_total: 0,
        paymentTotalStr: '0.00',
        cost_rate: 100,
        collectTableHeight: '',
        payTableHeight: '',
        disabled: false,
        collectLimit: '',
        stockCostMessage: '',
        stockTip: '',
        limitAccount: 100000
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        Loading.service(localParams)
        this.disabled  = urlInfo.IsEdit === 'false'
        const maxHeight = (document.documentElement.clientHeight - 215) / 2
        this.collectTableHeight = maxHeight
        this.payTableHeight = maxHeight
        const limitNumber =  parseInt(urlInfo.ssyf) > 201812 ? 10 : 3
        this.limitAccount =  parseInt(urlInfo.ssyf) > 201812 ? 100000 : 30000
        this.collectLimit = `当期收入已超过${limitNumber}万元，将有可能产生应纳税额，请确认！`
        this.querySimpleTally().then(resp => {
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },
      querySimpleTally () {
        return new Promise((resolve, reject) => {
          getSimpleTally(urlInfo).then(resp => {
            const {incomeTransTypeList, payTransTypeList, acctShouldPayList, stockCostMessage} = resp.data
            for (const item of acctShouldPayList) {
              item.acct = item.code + ' ' + item.name
            }
            this.acctShouldPayList = acctShouldPayList
            this.incomeTransTypeList = incomeTransTypeList
            this.payTransTypeList = payTransTypeList
            this.stockTip = stockCostMessage
            this.dealWithData(resp)
            return resolve(resp)
          }, err => {
            return reject(err)
          })
        })
      },
      dealWithData (resp) {
        const {simpleAcct: {cost_rate, detailList, income_total, expense_total}} = resp.data
        this.income_total =  income_total ||  0.00
        this.taxAmountStr = income_total ? toMoney(income_total.toFixed(2)) : '0.00'
        this.expense_total = expense_total  || 0.00
        this.paymentTotalStr = expense_total ? toMoney(expense_total.toFixed(2)) : '0.00'
        this.cost_rate =  printFn(cost_rate * 100)
        const collectList = []
        const paymentList = []
        for (const item of detailList) {
          item.showIcon = false
          item.showInput = item.trans_id === 5 || item.trans_id === 14
          if (item.trans_type_cat === 1) {
            collectList.push(item)
          } else if (item.trans_type_cat === 2) {
            paymentList.push(item)
          }
        }
        this.collectList = collectList
        this.paymentList = paymentList
        let excludingTax = 0
        this.collectList.forEach((item, index) => {
          item.index = index
          excludingTax = printFn(excludingTax + Number(item.ex_tax_amount))
        })
        this.excludingTax = excludingTax || 0.00
        this.excludingTaxStr = excludingTax ? toMoney(excludingTax.toFixed(2)) : '0.00'
        this.paymentList.forEach((item, index) => {
          item.index = index
        })
      },
      handelSaveBtn (type) {
        Loading.service(localParams)
        const {collectList, paymentList, cost_rate} = this
        const saveList = []
        let income = 0
        let tax = 0
        for (const item of collectList) {
          if (item.showInput && item.shouldPayAcct && item.trans_name && item.ex_tax_amount || !item.showInput && item.trans_name && item.ex_tax_amount) {
            income = printFn(income +  parseFloat(item.ex_tax_amount))
            tax = printFn(tax +  parseFloat(item.tax_amount) + parseFloat(item.ex_tax_amount))
            saveList.push(item)
          }
        }
        let payment = 0
        for (const item of paymentList) {
          if (item.trans_name && item.amount) {
            saveList.push(item)
            payment = printFn(payment + parseFloat(item.amount))
          }
        }
        let isEmpty = ''
        if (!type && !income && !payment) {
          isEmpty = '收入、支出均为空，不能提交'
        }
        if (!type && !isEmpty && income && !payment) {
          isEmpty = '有收入无支出，可能涉及企业所得税，不能提交'
        }
        const limitNumber =  parseInt(urlInfo.ssyf) > 201812 ? 100000 : 30000
        // const msg = parseInt(urlInfo.ssyf) > 201812 ?
        if (!isEmpty && income > limitNumber) {
          isEmpty = parseInt(urlInfo.ssyf) > 201812 ? '当期收入已超过10万元，不符合小微减免政策，不适用快报功能！': '当期收入超过3万，不符合月3季9免税规定，不适用快报功能。'
        }
        if (isEmpty) {
          Loading.service().close()
          return Message({
            message: isEmpty,
            type: 'warning',
            duration: duration
          })
        }
        const rate = printFn(Number(cost_rate) / 100)
        const params = Object.assign({}, urlInfo, {
          simpleAcct: {
            income_total: tax,
            expense_total: payment,
            cost_rate: rate
          },
          acctDetailList: saveList,
          saveOnly: type
        })
        if (income < payment) {
          return MessageBox.alert('当期 收入价税合计+资金收款 < 支出+资金付款 ，请确认现金无赤字。', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.saveBillDetail(params)
              } else {
                Loading.service().close()
              }
            }
          })
        } else {
          this.saveBillDetail(params)
        }
      },
      saveBillDetail (params) {
        saveAndFiletax(params).then(resp => {
          Message({
            message: resp.message,
            duration: duration,
            type: 'success'
          })
          this.disabled = resp.data.pzgenerated && resp.data.pzgenerated === 1
          this.querySimpleTally().then(resp => {
            Loading.service().close()
          }, err => {
            Loading.service().close()
          })
        }, err => {
          Loading.service().close()
        })
      },
      copyData () {
        Loading.service(localParams)
        copyLastData(urlInfo).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: 2700
          })
          this.dealWithData(resp)
        }, err => {
          Loading.service().close()
        })
      },
      changeAcct (row, list, type) {
        row.shouldPayAcct = ''
        row.trans_id = ''
        const idx = list.findIndex(item => item.trans_name === row.trans_name)
        if (idx === -1) return
        row.showInput = list[idx].id === 5 || list[idx].id === 14
        if (type === 'income') {
          this.handleIncomeInput(row.ex_tax_amount, row)
        }
        row.trans_id = list[idx].id
      },
      handleIncomeInput (evt, row) {
        const tax_rate = row.showInput ? 0 : 0.03
        const self = this
        if (typeof evt === undefined || evt === null || evt === '') {
          evt = 0
        }
        if (!checkNum(evt)) {
          evt = evt.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1')
          setTimeout(function () {
            row.ex_tax_amount = evt
            row.tax_amount = printFn(evt * tax_rate).toFixed(2)
            self.calcIncome(evt, row)
          })
        } else {
          row.tax_amount = printFn(evt * tax_rate).toFixed(2)
          this.calcIncome(evt, row)
        }
      },
      calcIncome () {
        let income = 0
        let tax = 0
        this.collectList.forEach((item, index) => {
          if (!isNaN(parseFloat(item.ex_tax_amount))) {
            income = printFn(income +  parseFloat(item.ex_tax_amount))
            tax = printFn(tax +  parseFloat(item.tax_amount) + parseFloat(item.ex_tax_amount))
          }
        })
        this.excludingTax = income
        this.excludingTaxStr = toMoney(income.toFixed(2))
        this.income_total = tax
        this.taxAmountStr = toMoney(tax.toFixed(2))
      },
      handleInputChange () {
        const value = parseInt(deepCopy(this.cost_rate), 10)
        if (isNaN(value)) {
          this.cost_rate = '100'
        }
      },
      handleRateInput (evt) {
        if (typeof evt === undefined || evt === null || evt === '') return
        const self = this
        const reg = new RegExp(/^(\d{1,2}(\.\d{0,2})?|100)$/)
        if (!reg.test(evt)) {
          evt = evt.slice(0, evt.length - 1)
          setTimeout(function () {
            self.cost_rate = evt
          }, 10)
        }
      },
      handelPaymentInput (evt, row) {
        const self = this
        if (!checkNum(evt)) {
          evt = evt.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, '$1')
          setTimeout(function () {
            row.amount = evt
            self.calcPayment()
          })
        } else {
          this.calcPayment()
        }
      },
      calcPayment () {
        let payment = 0
        this.paymentList.forEach((item, index) => {
          if (!isNaN(parseFloat(item.amount))) {
            payment = printFn(payment + parseFloat(item.amount))
          }
        })
        this.expense_total = payment
        this.paymentTotalStr = toMoney(payment.toFixed(2))
      },
      cellClassName ({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 2) {
          return 'label-padding'
        }
      },
      mouseEnter (row) {
        if (row.showIcon) return
        row.showIcon = true
      },
      mouseLeave (row) {
        row.showIcon = false
      },
      addRow (row, index, list, module, type) {
        list.splice(index + 1, 0, deepCopy(module))
      },
      deleteRow (row, index, list, type) {
        const length = list.length
        if (length === 1) {
          return Message({
            message: '已经只剩一行了不能再删除了！',
            type: 'warning',
            duration: duration
          })
        }
        list.splice(index, 1)
        if (type === 'income') {
          this.calcIncome()
        } else {
          this.calcPayment()
        }
      }
    },
    components: {
      HelpModal
    },
    watch: {
    },
    computed: {
    },
    mounted () {
    }
  }
</script>

