<style lang='scss' scoped>
  .total {
    line-height: 32px;
    font-size: 12px;
    height: 32px;
    color: #606266;
    text-align: left;
    float: left;
    div {
      display: inline-block;
    }
    .total-num {
      color: #1ab394;
    }
  }
  .psb-page {
    width: 100%;
    height: 100%;
    position: relative;
    .disable-import {
      background: url(./images/tong1.png) no-repeat center;
    }
    .psb-page-box {
      background: url(./images/tong3.png) no-repeat center;
    }
    .psb-page-box:hover, .psb-page-box:focus {
      background: url(./images/tong2.png) no-repeat center;
    }
  }
  .guide{
    position: absolute;
    background: url("images/guide.png");
    bottom: 36px;
    left: 50%;
    margin-left: -296px;
    height: 72px;
    width: 592px;
  }
</style>
<style lang="scss">
  .psb-center-modal{
    .el-dialog__footer {
      overflow: hidden;
    }
  }
</style>
<template>
  <div class="psb-page">
    <div v-if="hasData === 'list'">
      <header-operate
        inputTip="请输入报销单号"
        main-menu="psb"
        :more="more"
        :btn-type="btnType"
        :form-content="formContent"
        :filter-form="filterForm"
        :filter-form-old="filterFormOld"
        :edit-content="editContent"
        :change-tax-type="changeTaxType"
        :multiple-selection="multipleSelection"
        @on-filter="getFilterList"
        @on-save-all="saveAll"
        @on-import-data="importData"
        @on-create-voucher="createVoucher"
        @on-delete-voucher="deleteVoucher"
        @on-setting-voucher="settingVoucher"
      >
        <template slot="filterItem">
          <el-form-item label="报销人">
            <el-input
              v-model="formContent.reimburse_user"
              size="small"
              class="input-box"
              placeholder="请输入报销人名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="报销类型">
            <el-select
              v-model="formContent.charge_type_code"
              size="small"
              filterable
              allow-create
              placeholder="请选择报销类型">
              <el-option
                v-for="item in chargeType"
                :key="item.charge_type_code"
                :label="item. charge_type_name"
                :value="item.charge_type_code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报销金额">
            <el-col :span="11">
              <el-input
                v-model="formContent.min_reim_amount"
                placeholder="0.00"
                @input="handleInput($event,'formContent','min_reim_amount')"
                @change="getAmountBefore('min_reim_amount')"
                size="small"
              ></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input
                v-model="formContent.max_reim_amount"
                placeholder="0.00"
                @input="handleInput($event,'formContent','max_reim_amount')"
                @change="getAmountBefore('max_reim_amount')"
                size="small"
              ></el-input>
            </el-col>
          </el-form-item>
        </template>
      </header-operate>
      <psb-index
        :columns="columns"
        :list="list"
        :bookkeeping="bookkeeping"
        :change-tax-type="changeTaxType"
        :charge-type="chargeType"
        :edit-content="editContent"
        @on-selection-change="handleSelectionChange"
        @on-check-voucher="toCheckVoucher"
        @on-delete-voucher="deleteVoucher"
        @on-save-all="saveAll"
        @row-dblclick="dblClickRow"></psb-index>
      <!--底部统计栏-->
      <div class="footer-total-amount">
        <div class="footer-amount" ref="footerBox">
           <span style="font-size: 14px;font-weight: bold; color:#666666;">
          合计&nbsp;&nbsp;</span>报销单：<span class="text-color">{{count.totalIdNum}}</span>张&nbsp;&nbsp;&nbsp;&nbsp;
          报销金额：<span  class="text-color">{{count.reimTotalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <footer-pagination
          @size-change="handlePage($event, 'pageSize')"
          @current-change="handlePage($event, 'currentPage')"
          :current-page.sync="currentPage"
          :page-sizes="[50, 100, 300, '全部']"
          :page-size="pageSize"
          :total="totalRecord"
          :total-page="totalPage"
        ></footer-pagination>
      </div>
    </div>

    <div v-if="hasData === 'import'" @click="importData" :class="changeTaxType ? 'page-box disable-import': 'page-box psb-page-box'"></div>
    <div class="help-modal-box"  v-if="hasData === 'import'"><help-modal main-menu="psb"></help-modal></div>
    <div class="guide" v-if="hasData==='import'"></div>
    <!--统计-->
    <el-dialog
      v-if="dialogModal.modal"
      :width="typeDesc[dialogModal.type][0]"
      :visible.sync="dialogModal.modal"
      :title="typeDesc[dialogModal.type][1]"
      top="0"
      :close-on-click-modal="false"
      append-to-body
      class="fund-dialog vertical-center-modal psb-center-modal">
      <!--凭证习惯设置-->
      <setting-voucher
        v-if="dialogModal.type==='setting'"
        :setting-data="settingData"
        :taxFinance="taxFinance"
      ></setting-voucher>
      <common-table
        v-if="dialogModal.type==='detail'"
        :columns="detailColumns"
        :list="detailList"
        main-menus="psb"
        @check-invoice="toCheckInvoice"
      ></common-table>
      <!--发票列表页-->
      <template slot="footer">
        <!--凭证习惯设置-->
        <template v-if="dialogModal.type==='setting'">
          <el-button @click="closeSettingModal" size="small" class="button-com">取消</el-button>
          <el-button @click="saveSettingVoucher" size="small" type="primary">确定</el-button>
        </template>
        <template v-if="dialogModal.type=== 'detail'">
          <div class="total">
            <div >发票张数：<span class="text-color">{{detailAmount.totalInvoiceNum}}</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
            金额：<span class="text-color">{{detailAmount.totalExTaxAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            税额：<span class="text-color">{{detailAmount.totalTaxAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            价税合计：<span class="text-color">{{detailAmount.totalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </template>
      </template>
    </el-dialog>
    <!--记账-->
    <keep-accounts
      v-if="bookkeeping.modal"
      :bookkeeping="bookkeeping"
      @on-save="getPsbList"
    ></keep-accounts>
    <!--凭证查看模块-->
    <check-voucher :voucher="voucher"></check-voucher>
    <!--没注册票税宝弹出页-->
    <common-dialog v-if="commonModal.modal" :common-modal="commonModal"></common-dialog>
    <!--查看发票详情弹窗-->
    <common-dialog v-if="checkInvoice.modal" :common-modal="checkInvoice"></common-dialog>
  </div>
</template>

<script>
  import HeaderOperate from '@/views/components/HeaderOperate'
  import {Message, MessageBox, Loading} from 'element-ui'
  import psbIndex from '@/views/expense/psb/component/PSB/index'
  import KeepAccounts from '@/views/components/KeepAccounts/index.vue'
  import CheckVoucher from '@/views/components/CheckVoucher.vue'
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import SettingVoucher from '@/views/components/SettingVoucher/index.vue'
  import CommonTable from '@/views/expense/psb/component/CommonTable'
  import CommonDialog from '@/views/components/CommonDialog.vue'
  import HelpModal from '@/views/components/Help/index.vue'

  import {localParams, duration} from '@/views/components/data/common'
  import {dealListForVoucher, checkNum, toMoney} from '@/utils/utils'

  import {fixedData} from '@/views/expense/psb/data/fixedData'
  import {psbData} from '@/views/expense/psb/data/common'
  import {deepCopy} from '@/utils/assist'
  import {settingData} from '@/views/expense/psb/data/voucher'
  import {queryVoucherRule, updateVoucherRule} from '@/api/common'
  import {queryPsbList, importData, createVoucher,
    deleteVoucher, savePsbData,  queryInvoiceDetail} from '@/api/psb'

  export default {
    data () {
      return {
        ...fixedData,
        ...deepCopy(psbData),
        filterFormOld: deepCopy(psbData.filterForm),
        formContent: deepCopy(psbData.filterForm),
        settingData: deepCopy(settingData),
        inputVal: '', // 头部输入框搜索
        vmState: '0',
        editContent: {
          allSaveBtn: false,
          editList: []
        },
        list: [],
        hasData: '',
        settleMethod: [{
          sm_id: 1,
          sm_name: '现金结算'
        }, {
          sm_id: 16,
          sm_name: '往来结算'
        }],
        bookkeeping: {
          modal: false,
          iframeSrc: ''
        },
        changeTaxType: false, // 纳税身份转换false 可编辑，true不可编辑
        voucher: {  // 凭证查看
          modal: false,
          curListIdx: null,
          vch_id: '',
          list: []
        },
        currentPage: 1,
        pageSize: 50,
        totalRecord: 0, // 流水总条数
        totalPage: 1, // 流水总页数
        amountData: {
          totalIdNum: 0, // 流水数目，即清单条数
          reimTotalAmount: 0// 报销金额
        },
        count: {},
        multipleSelection: [],
        dialogModal: {
          modal: false, // 弹出框控制
          type: 'detail' // 'setUp'理票
        },
        taxFinance: true,
        detailList: [],
        uuid: '',
        commonModal: {
          modal: false,
          iframeSrc: '',
          width: '1030px'
        },
        checkInvoice: {
          modal: false,
          iframeSrc: '',
          width: '1100px'
        },
        detailAmount: {
          totalInvoiceNum: 0,
          totalExTaxAmount: 0,
          totalTaxAmount: 0,
          totalAmount: 0
        },
        chargeType: [],
        url: ''
      }
    },
    created () {
      switch (process.env.NODE_ENV) {
        case 'green':
          this.url = 'http://test.mypsb.cn/api/web/billcenter/index.html#/imgPreview'
          break
        case 'smoke':
          this.url = 'https://mypsb.cn/api/web/billcenter/index.html#/imgPreview'
          break
        case 'production':
          this.url = 'https://mypsb.cn/api/web/billcenter/index.html#/imgPreview'
          break
        case 'testing':
          this.url = 'http://test.mypsb.cn/api/web/billcenter/index.html#/imgPreview'
          break
        default:
          this.url = 'http://test.mypsb.cn/api/web/billcenter/index.html#/imgPreview'
      }
      this.init()
    },
    methods: {
      init () {
        this.getPsbList()
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
      },
      getPsbList () {
        Loading.service(localParams)
        this.queryPsbList().then(resp => {
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },
      queryPsbList () {
        this.list = []
        return new Promise((resolve, reject) => {
          queryPsbList({
            reim_code: this.inputVal,
            reimburse_user: this.filterForm.reimburse_user, //
            charge_type_code: this.filterForm.charge_type_code,
            min_reim_amount: this.filterForm.min_reim_amount,
            max_reim_amount: this.filterForm.max_reim_amount,
            vm_state: this.vmState,
            pageQueryVO: {
              currentPage: this.currentPage,
              pageSize: this.pageSize
            }
          }).then(resp => {
            const respData = resp.data
            if (respData) {
              const {psbChargeTypeCodeNameList, totalInfo, pageInfo, dataList} = respData
              this.hasData = totalInfo.billNumInDB > 0 ? 'list' : 'import'
              this.chargeType = psbChargeTypeCodeNameList
              Object.keys(this.amountData).forEach(item => {
                const itemVal = totalInfo[item]
                if (item === 'reimTotalAmount') {
                  this.amountData[item] = toMoney(itemVal)
                } else {
                  this.amountData[item] = itemVal
                }
              })
              for (const item of dataList) {
                item.isEdit = false
                item.showIcon = false
                item.amountStr = toMoney(item.reim_amount)
                item.acct10 = item.acct_10_code ? `${item.acct_10_code} ${item.acct_10_name}` : ''
                item.acct20 = item.acct_20_code ? `${item.acct_20_code} ${item.acct_20_name}` : ''
              }
              this.count = deepCopy(this.amountData)
              this.totalRecord = pageInfo.totalRecord
              this.totalPage = pageInfo.totalPage
              this.list = deepCopy(dataList)
            }
            return resolve(respData)
          }, error => {
            return reject(error)
          })
        })
      },
      getFilterList (inputVal, vmState) {
        this.currentPage = 1
        this.inputVal = inputVal || ''
        this.vmState = vmState
        this.getPsbList(this.inputVal)
      },
      importData () {
        if (this.changeTaxType) return
        Loading.service(localParams)
        importData().then(resp => {
          const {isBindEnterprise, bindUrl} = resp.data
          if (!isBindEnterprise) {
            this.commonModal.iframeSrc = bindUrl
            this.commonModal.modal = true
            Loading.service().close()
            return false
          }
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.queryPsbList().then(resp=> {
            Loading.service().close()
          }, err => {
            Loading.service().close()
          })
        }, err => {
          Loading.service().close()
        })
      },
      createVoucher (idArray) {
        const array = Array.from(new Set(idArray))
        Loading.service(localParams)
        createVoucher({
          idArray: array
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.queryPsbList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          this.queryPsbList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        })
      },
      deleteVoucher(vchIdArray) {
        Loading.service(localParams)
        deleteVoucher({
          vch_id_list_array: vchIdArray
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.queryPsbList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          Loading.service().close()
        })
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
          queryVoucherRule({module: 'psb'}).then(resp => {
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
          module: 'psb'
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
      },
      // 控制过滤输入框只能输入数字
      handleInput (evt, type, name) {
        const self = this
        if (!checkNum(evt)) {
          evt = evt.replace(/[^\d|.]/g, '')
          setTimeout(function () {
            self[type][name] = evt
          }, 10)
        }
      },
      getAmountBefore (type) {
        const formContent = this.formContent
        const {min_reim_amount, max_reim_amount} = formContent
        if (max_reim_amount && min_reim_amount && parseFloat(min_reim_amount) > parseFloat(max_reim_amount)) {
          formContent[type] = ''
          return Message({
            message: '所选报销金额的最小值不能大于所选报税金额的最大值！',
            type: 'warning',
            duration: duration
          })
        }
      },
      handlePage (val, type) {
        if (this.editContent.allSaveBtn) {
          return MessageBox.alert('数据已经修改，是否保存？', '全部保存', {
            confirmButtonText: '是',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.saveAll()
              }
            }
          })
        } else {
          if (type === 'pageSize') {
            this.pageSize = val
            this.currentPage = 1
          } else {
            this.currentPage = val
          }
          this.getPsbList()
        }
      },
      handleSelectionChange(list) {
        if (list && list.length) {
          const amount = {
            totalIdNum: 0,
            reimTotalAmount: 0
          }
          const billNum = []
          for (const item of list) {
            amount.reimTotalAmount = parseFloat((+amount.reimTotalAmount) + item.reim_amount).toFixed(2)
            billNum.push(item.id)
          }
          amount.reimTotalAmount = toMoney(amount.reimTotalAmount)
          amount.totalIdNum = Array.from(new Set(billNum)).length
          this.count = amount
        } else {
          this.count = deepCopy(this.amountData)
        }
        this.multipleSelection = list
      },
      // modal 点击凭证字号进入查看凭证(拉取北京)
      toCheckVoucher (voucherId) {
        this.voucher.modal = true
        this.voucher.curListIdx = null
        this.voucher.vch_id = voucherId
        this.voucher.list = dealListForVoucher(this.list)
      },
      saveAll () {
        const editList = this.editContent.editList
        const changedDataArray = []
        for (const item of editList) {
          const acct10Array = item.acct10.split(' ')
          const acct20Array = item.acct20.split(' ')
          const billDetail =  {
            id: item.id,
            index_no: item.index_no,
            charge_type_code: item.charge_type_code,
            acct_20_code: acct20Array[0] || '',
            acct_20_name: acct20Array[1] || '',
            acct_20_ci_name: item.acct_20_ci_name || '',
            acct_10_code: acct10Array[0] || '',
            acct_10_name: acct10Array[1] || '',
            acct_10_ci_name: item.acct_20_ci_name || ''
          }
          changedDataArray.push(billDetail)
        }
        Loading.service(localParams)
        savePsbData({
          changedDataArray
        }).then(resp => {
          this.editContent.allSaveBtn = false
          this.editContent.editList = []
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.queryPsbList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          this.queryPsbList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        })
      },
      dblClickRow (row) {
        Loading.service(localParams)
        this.queryPsbDetail(row).then(resp => {
          Loading.service().close()
        }, error => {
          Loading.service().close()
        })
      },
      queryPsbDetail (row) {
        this.uuid = row.uuid
        return new Promise((resolve, reject) => {
          queryInvoiceDetail({
            uuid: row.uuid
          }).then(resp => {
            const {invoiceDataList} = resp.data
            for (const item of invoiceDataList) {
              item.totalPrice = toMoney(item.totalPrice)
              item.totalTaxPrice = toMoney(item.totalTaxPrice)
              item.amount = toMoney(item.amount)
            }
            Object.keys(this.detailAmount).forEach(item => {
              const itemVal = resp.data[item]
              if (item === 'totalInvoiceNum') {
                this.detailAmount[item] = itemVal
              } else {
                this.detailAmount[item] = toMoney(itemVal)
              }
            })
            this.detailList = invoiceDataList
            this.dialogModal.modal = true
            this.dialogModal.type = 'detail'
            resolve(resp)
          }, err => {
            return reject(err)
          })
        })
      },
      toCheckInvoice (imgUrl) {
        const img = decodeURI(imgUrl)
        this.checkInvoice.iframeSrc = `${this.url}?img=${img}`
        this.checkInvoice.modal = true
      }
    },
    components: {
      HeaderOperate,
      psbIndex,
      KeepAccounts,
      CheckVoucher,
      FooterPagination,
      SettingVoucher,
      CommonTable,
      CommonDialog,
      HelpModal
    }
  }
</script>

<style scoped>

</style>
