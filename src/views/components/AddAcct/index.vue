<style lang='scss'>
  .vau-add-sub{
    .vue-iframe {
      width: 100%;
      height: 540px;
      border: none;
      margin: 0px 0px -2px 0px;
    }
    .label-name{
      width: 180px;
      text-align: right;
      display: inline-block;
    }
  }
</style>
<template>
  <el-dialog
    width="550px"
    :title="subjectData.subTitle"
    :visible.sync="subjectData.subModal"
    class="vau-add-sub"
    :close-on-click-modal="false"
    append-to-body>
    <div style="padding: 10px 20px 30px 20px;">
      <div style="margin-bottom: 12px;">
        <span class="label-name" >{{subjectData.complex ? '上级科目名称（辅助类别）：' : '上级科目名称：'}}</span>
        <el-select
          v-if="!subjectData.complex"
          v-model="subjectData.superiorSub.curVal"
          size="small"
          style="width: 226px;"
          remote
          @change="changeSuperiorSub"
          @visible-change="selectVisibleChange($event, subjectData.superiorSub.curVal)"
          v-loadmore="loadMore"
          :remote-method="remoteMethod"
          placeholder="请选择"
          filterable>
          <el-option
            v-for="(val, idx) in subjectData.superiorSub.options"
            :key="idx"
            :label="val"
            :value="val"></el-option>
        </el-select>
        <el-select
          v-else
          v-model="subjectData.superiorSub.curVal"
          size="small"
          style="width: 226px;"
          remote
          @change="changeSuperiorSub"
          @visible-change="selectVisibleChange($event, subjectData.superiorSub.curVal)"
          v-loadmore="loadMore"
          :remote-method="remoteMethod"
          placeholder="请选择"
          filterable>
          <el-option
            v-for="(item) in subjectData.superiorSub.options"
            :key="item.account"
            :label="item.account"
            :value="item.account"
           :disabled="item.disabled"></el-option>
        </el-select>
      </div>
      <div style="margin-bottom: 12px;">
        <span class="label-name">{{subjectData.complex ? '新增科目（辅助项目）名称：': '新增科目名称：'}}</span>
        <el-input
          v-model="subjectData.newSubVal"
          clearable
          size="small"
          style="width: 226px;"
        ></el-input>
      </div>

      <el-checkbox
        v-if="subjectData.hasCheck"
        v-model="subjectData.synAdd"
        style="margin: 12px 0 0 92px;"
      >{{subjectData.hasCheck}}</el-checkbox>
      <div v-if="subjectData.hasUnit" style="margin-top: 12px;">
        <span class="label-name">
          <el-checkbox
            v-model="subjectData.unitCheck"
            style="margin-right: 18px"
            @change="changeUnitCheck"
            :disabled="!subjectData.editFlag"
          >数量核算</el-checkbox>
        <span>数量单位：</span>
        </span>

        <el-input
          v-model="subjectData.unitVal"
          :disabled="!subjectData.unitCheck || !subjectData.editFlag"
          size="small"
          style="width: 226px;"
        ></el-input>
      </div>
      <div v-if="subjectData.hasMoney" style="margin-top: 12px;">
        <span class="label-name">
            <el-checkbox
              v-model="subjectData.moneyCheck"
              style="margin-right: 18px"
              @change="changeMoneyCheck"
              :disabled="!subjectData.editFlag"
            >外币核算</el-checkbox>
        <span>外币币种：</span>
        </span>
        <el-select
          v-model="subjectData.moneyType"
          :disabled="!subjectData.moneyCheck || !subjectData.editFlag"
          size="small"
          filterable
          placeholder=""
          style="width:226px;">
          <el-option
            v-for="item in currency"
            :key="item.id"
            :label="item._Name"
            :value="item._Code">
          </el-option>
        </el-select>
      </div>
      <div v-if="subjectData.isStock">
        <div style="margin-bottom: 12px;">
          <span class="label-name">规格型号：</span>
          <el-input
            v-model="subjectData.guige"
            clearable
            size="small"
            style="width: 226px;"
          ></el-input>
        </div>
        <div style="margin-bottom: 12px;">
          <span class="label-name">计量单位：</span>
          <el-select v-model="subjectData.unitName" size="small" placeholder="请选择"  style="width: 226px;">
            <el-option
              v-for="item in unitData"
              :value="item.name"
              :label="item.name"
              :key="item.name"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button size="small" type='primary' @click="add">增加</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {deepCopy} from '@/utils/assist'

  const currencyCode = ['6001', '5001', '1403', '1405', '1411', '1121', '1122', '1123', '1221', '2201', '2202', '2203', '2241', '1002'] // 外币核算科目
  const unitCode = ['6001', '5001', '6051', '5051', '6301', '5301', '1403', '1405', '1411', '6402', '5402'] // 数量核算科目
  import {localParams, duration} from '@/views/components/data/common'
  import {filterAccount} from '@/utils/filterAccount'
  import {removeCurrencyAccount} from '@/utils/eval'
  import {addAcctCommon, checkBalance} from '@/api/common'
  import {Message, Loading, MessageBox} from 'element-ui'
  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {options} from '@/views/components/data/common'
  // 计量单位
  import {getUnit} from '@/api/common'
  export default {
    name: 'AddAcct',
    data() {
      return {
        currencyCode: currencyCode,
        unitCode: unitCode,
        isCofirm: 0,
        codeList: [],
        options: deepCopy(options),
        unitData: []
      }
    },
    props: {
      mainTitle: Object,
      editData: Object,
      subjectData: Object,
      mainMenu: {
        default: 'common',
        type: String
      }
    },
    watch: {
      'subjectData.superiorSub.code': function() {
        this.getCodeList()
      },
      'subjectData.subModal': {
        handler (val) {
          if (val && this.mainMenu === 'expense') {
            this.codeList = deepCopy(this.subjectData.superiorSub.options)
          } else if (val && this.mainMenu === 'reorganize') {
            const {subjectData} = this
            const currencyCode = subjectData.accounting.code
            this.codeList = deepCopy(this.subjectData.superiorSub.options)
            this.getAccountList().then(allAccount => {
              subjectData.accounting.options = filterAccount(allAccount, currencyCode)
              subjectData.subTitle = '新增科目（辅助项目）'
            })
            getUnit().then(resp => {
              this.unitData = resp.data
            })
          }
        }
      }
    },
    components: {},
    methods: {
      getCodeList() {
        const {subjectData} = this
        const code = subjectData.superiorSub.code
        const currencyCode = subjectData.accounting.code
        this.getAccountList().then(allAccount => {
          // subjectData.superiorSub.options = subjectData.removeCurrency ? removeCurrencyAccount(filterAccount(allAccount, code)) : filterAccount(allAccount, code)
          this.codeList = subjectData.removeCurrency ? removeCurrencyAccount(filterAccount(allAccount, code)) : filterAccount(allAccount, code)
          subjectData.accounting.options = filterAccount(allAccount, currencyCode)
          subjectData.subTitle = '新增科目'
        })
      },
      // 调增加的接口
      add() {
        const {subjectData: {isStock, unitName, newSubVal, unitCheck, moneyCheck, moneyType, unitVal, superiorSub: {curVal}}} = this
        if (!newSubVal) {
          return Message({
            message: '新增科目名称不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        if (!curVal) {
          return Message({
            message: '上级科目名称不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        if (isStock && !unitName) {
          return Message({
            message: '计量单位不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        if (unitCheck && !unitVal) {
          return Message({
            message: '数量单位不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        if (moneyCheck && !moneyType) {
          return Message({
            message: '外币币种不能为空',
            type: 'warning',
            duration: duration
          })
        }
        this.subjectData.newSubVal = newSubVal.replace(/\s/g, '')
        Loading.service(localParams)
        this.isCofirm = 0
        this.addAcct()
      },
      addAcct () {
        const {subjectData: {moneyType, unitVal, superiorSub: {curVal}, removeCurrency, guige, unitName,  assistCode, module}} = this
        const params = {
          numberUnit: unitVal, // 数量单位(不填则传空字符串)
          acctName: this.subjectData.newSubVal, // 科目名称
          currency: moneyType,
          acct: curVal.split(' ')[0],
          isCofirm: this.isCofirm,
          guige: guige,
          unitName: unitName,
          assistCode: assistCode,
          remark: module
        }
        addAcctCommon(params).then((resp) => {
          if (resp.data.balance === 'true') {
            return MessageBox.alert(`${resp.message}`, '新增科目', {
              confirmButtonText: '是',
              type: 'warning',
              callback: action => {
                if (action === 'confirm') {
                  this.isCofirm = 1
                  this.addAcct()
                } else {
                  Loading.service().close()
                  return
                }
              }
            })
          }
          Message({
            message: `${resp.message}`,
            type: 'success',
            duration: duration
          })
          Loading.service().close()
          this.$store.dispatch('GetAccountList').then(respA => {
            this.$emit('on-add-after', resp.data.code, resp.data.name, respA)
          })
          this.subjectData.subModal = false
        }, error => {
          Loading.service().close()
        })
      },
      changeUnitCheck() {
        if (!this.subjectData.unitCheck) {
          this.subjectData.unitVal = ''
        }
      },
      changeMoneyCheck() {
        if (!this.subjectData.moneyCheck) {
          this.subjectData.moneyType = ''
        }
      },
      closeModal() {
        this.subjectData.subModal = false
      },
      // 获取科目
      getAccountList() {
        return new Promise((resolve, reject) => {
          const accountList = this.$store.getters.accountList
          let allAccount = []
          if (accountList && accountList.allAccount && accountList.allAccount.length > 0) {
            allAccount = this.$store.getters.accountList.allAccount
            resolve(allAccount)
          } else {
            Loading.service(localParams)
            this.$store.dispatch('GetAccountList').then(resp => {
              Loading.service().close()
              allAccount = this.$store.getters.accountList.allAccount
              resolve(allAccount)
            }, error => {
              Loading.service().close()
              reject(error)
            })
          }
        })
      },
      changeSuperiorSub(val) {
        if (this.mainMenu === 'expense') return
        const {subjectData} = this
        subjectData.hasMoney = false
        subjectData.hasUnit = false
        subjectData.moneyCheck = false
        subjectData.unitCheck = false
        subjectData.moneyType = ''
        subjectData.unitVal = ''
        subjectData.guige = ''
        subjectData.unitName = ''
        subjectData.assistCode = ''
        subjectData.isStock = false
        if (this.mainMenu === 'reorganize') {
          const idx = this.codeList.findIndex(item => item.account === val)
          if (idx !== -1) {
            subjectData.assistCode = this.codeList[idx].assistCode
            this.subjectData.isStock = this.codeList[idx].stock
            if (this.subjectData.isStock) return
          }
        }
        const hasAccounting = subjectData.accounting.options.indexOf(val)
        const type = subjectData.accounting.type
        // subjectData.newSubVal = subjectData.newSubVal ? subjectData.newSubVal : subjectData.initSubVal
        if (hasAccounting !== -1) {
          checkBalance({
            acct: val.split(' ')[0]
          }).then(resp => {
            if (resp.data.isEdit === 'false') {
              subjectData.editFlag = false
            } else {
              subjectData.editFlag = true
            }
            if (type === 'settle') {
              subjectData.hasMoney = true
            } else {
              const acctCode = val.split(' ')[0].substr(0, 4)
              if (this.currencyCode.indexOf(acctCode) !== -1) {
                subjectData.hasMoney = true
              }
              if (this.unitCode.indexOf(acctCode) !== -1) {
                subjectData.hasUnit = true
              }
            }
            if (!subjectData.editFlag && !subjectData.hasUnit && !subjectData.hasMoney) return
            const acctCode = val.split(' ')[0]
            const allAccount = this.$store.getters.accountList.accountDetail
            if (acctCode) {
              const account = allAccount.filter(function (item, i) {
                return item._Code === acctCode
              })
              if (account && account.length > 0) {
                if (account[0]._Unit) {
                  // 如果数量核算
                  subjectData.unitVal = account[0]._Unit
                  subjectData.unitCheck = true
                }
                if (account[0]._WBDW) {
                  // 如果外币核算
                  // 如果外币核算
                  subjectData.moneyType = account[0]._WBDW
                  subjectData.moneyCheck = true
                }
              } else {
                if (subjectData.hasUnit) {
                  subjectData.unitVal = ''
                  subjectData.unitCheck = false
                } else {
                  subjectData.moneyType = ''
                  subjectData.moneyCheck = false
                }
              }
            }
          }, err => {
          })
        }
      },
      selectVisibleChange (val, model) {
        if (val) {
          const {subjectData} = this
          subjectData.superiorSub.options = selectVisibleChange(model, this.codeList, this.options)
        }
      },
      loadMore () {
        if (this.options.isLoadMore) {
          const {subjectData} = this
          subjectData.superiorSub.options = loadMore(subjectData.superiorSub.options, this.codeList, this.options)
        }
      },
      remoteMethod (val) {
        const {subjectData} = this
        subjectData.superiorSub.options  = remoteMethod(val, this.codeList, this.options)
      }
    },
    computed: {
      currency() {
        const currency = this.$store.getters.currency
        if (currency) {
          return currency
        } else {
          this.$store.dispatch('GetCurrencyList').then(resp => {
            return resp
          })
        }
      }
    },
    mounted() {
    }
  }
</script>
