<style lang="scss" scoped>
  .fund-page{
    .footer-total-amount{
      display: inline-block;
      .footer-amount{
        max-width: calc(100% - 370px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 30px;
        line-height: 44px;
        font-size: 12px;
      }
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

<template>
  <div class="fund-page">
    <!--列表页面-->
    <div v-if="hasImport==='list'" class="fund">
      <!--头部操作-->
      <header-operate
        inputTip="请输入对方户名或摘要"
        main-menu="fund"
        :more="more"
        :btn-type="btnType"
        :edit-content="editContent"
        :form-content="formContent"
        :filter-form="filterForm"
        :filter-form-old="filterFormOld"
        :filer-bank="filerBank"
        :multiple-selection="multipleSelection"
        :isFilterNumber="isFilterNumber"
        :change-tax-type="changeTaxType"
        :proofState="true"
        @on-filter="getFilterList"
        @on-import="importForm"
        @on-create-voucher="createVoucher"
        @on-delete-voucher="deleteVoucher"
        @on-delete="deleteBill"
        @batch-setup="batchSetup"
        @set-bank-bill="setBankBill"
        @on-save-all="saveAll"
        @on-setting-voucher="settingVoucher"
        @on-save-Remark="save_Remark"
        @on-delete-remarks="delete_Remark"
        @batch-setup-acct="batchSetupAcct"
      >
        <template slot="filterItem">
          <el-form-item label="收款/付款">
            <el-select
              v-model="formContent.billTypeId"
              size="small"
              filterable
              allow-create>
              <el-option
                v-for="(name, idx) in billTypes"
                :key="idx"
                :label="name"
                :value="idx"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会计科目">
            <el-select
              v-model="formContent.acctSetState"
              size="small"
              filterable
              allow-create>
              <el-option
                v-for="(name, idx) in acctSetStates"
                :key="idx"
                :label="name"
                :value="idx"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </header-operate>
      <!--table列表-->
      <fund-index
        :loading="loading"
        :columns="columns"
        :list="list"
        :edit-content="editContent"
        :sort-data="sortData"
        :bookkeeping="bookkeeping"
        :change-tax-type="changeTaxType"
        @on-selection-change="handleSelectionChange"
        @on-check-voucher="toCheckVoucher"
        @on-delete-voucher="deleteVoucher"
        @sort-change="sortChange"
        @on-save-all="saveAll"
        @on-save-Remark="save_Remark"
        @on-fund-sava="fund_save"
      ></fund-index>
      <div class="footer-total-amount">
        <el-tooltip placement="top" :disabled="!showTip">
          <div slot="content">
              <span style="font-size: 14px;font-weight: bold; color:#666666;">
          合计&nbsp;&nbsp;</span>流水：<span class="text-color">{{count.billNum}}</span>条&nbsp;&nbsp;&nbsp;&nbsp;
            未生成凭证：<span  class="text-color">{{count.novoucherNum}}</span>条&nbsp;&nbsp;&nbsp;&nbsp;
            收款：<span  class="text-color">{{count.collectTotalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            付款：<span  class="text-color">{{count.payTotalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <div v-if="!multipleSelection.length">
              <!--期末余额：<span style="color: #1ab394;">{{count.closing_balance}}</span>-->
            </div>
          </div>
          <div class="footer-amount" ref="footerBox">
           <span style="font-size: 14px;font-weight: bold; color:#666666;">
          合计&nbsp;&nbsp;</span>流水：<span class="text-color">{{count.billNum}}</span>条&nbsp;&nbsp;&nbsp;&nbsp;
            未生成凭证：<span  class="text-color">{{count.novoucherNum}}</span>条&nbsp;&nbsp;&nbsp;&nbsp;
            收款：<span  class="text-color">{{count.collectTotalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            付款：<span  class="text-color">{{count.payTotalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <div v-if="!multipleSelection.length">
              <!--期末余额：<span style="color: #1ab394;">{{count.closing_balance}}</span>-->
            </div>
          </div>
        </el-tooltip>
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
    <!--导入对账单-->
    <div v-if="hasImport==='import'" :class="changeTaxType ? 'page-box disable-import': 'page-box fund-page-box'" @click="importForm"></div>
    <div class="guide" v-if="hasImport==='import'"></div>
    <div class="help-modal-box"  v-if="hasImport === 'import'"><help-modal main-menu="fund"></help-modal></div>
    <!--导入等一系列弹框-->
    <el-dialog
      v-if="dialogModal.modal"
      :width="typeDesc[dialogModal.type][0]"
      :visible.sync="dialogModal.modal"
      :title="typeDesc[dialogModal.type][1]"
      top="0"
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
      class="fund-dialog vertical-center-modal">
      <!--导入功能模块-->
      <import-form
        v-if="dialogModal.type==='import'"
        ref="importForm"
        :form-modal="formModal"
        :error-modal="errorModal"
        @on-save-bank="saveBankBill"
      ></import-form>
      <!--交易流水确认-->
      <vice-file-detail
        v-if="dialogModal.type==='trans'"
        :columns="tranModal.columns"
        :table-data="tranModal.list"
        height="400px"
      ></vice-file-detail>
      <!--会计科目确认 & 批量设置setup-->
      <subject-confirm
        v-if="dialogModal.type==='sub'||dialogModal.type==='setup'"
        :batch-add-acct-modal="batchAddAcctModal"
        :sub-modal="subModal"
      ></subject-confirm>
      <!--银行账号设置-->
      <bank-list
        v-if="dialogModal.type==='bank'"
        :edit-bank="editBank"
      ></bank-list>
      <!--凭证习惯设置-->
      <setting-voucher
        v-if="dialogModal.type==='setting'"
        :setting-data="settingData"
        :taxFinance="taxFinance"
        main-menu="fund"
      ></setting-voucher>
      <template slot="footer">
        <template v-if="dialogModal.type==='import'">
          <el-button size="small" style="margin-left: 15px" type='primary' @click="sureImport">确定</el-button>
        </template>
        <template v-if="dialogModal.type==='trans'">
          <div class="footer-amount">
            <div class="amount-box"><span style="font-size: 14px;font-weight: bold; color:#666666;"> 合计：
          </span>流水：<span class="text-color">{{tranModal.amount.billNum}}</span>条&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <div class="amount-box">收款：<span   class="text-color">{{tranModal.amount.collectTotalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <div class="amount-box">付款：<span   class="text-color">{{tranModal.amount.payTotalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <!--<div class="amount-box">期末余额：<span style="color: #1ab394" >{{tranModal.amount.closing_balance}}</span></div>-->
          </div>
          <el-button size="small" style="margin-left: 15px" type='primary' @click="saveSubSetup">保存</el-button>
          <!--<el-button size="small" style="margin-left: 15px" type='primary' @click="toNext">下一步</el-button>-->
        </template>
        <template v-if="dialogModal.type==='sub'||dialogModal.type==='setup'">
          <div class="footer-tip"><span>温馨提示：</span>批量确认银行流水的会计科目</div>
          <el-button size="small" class="button-com" v-if="dialogModal.type==='sub'" @click="onUp">上一步</el-button>
          <el-button size="small" type="primary"  @click="onBatchAddAcct">批量新增科目</el-button>
          <el-button size="small" style="margin-left: 15px" type='primary' @click="saveSubSetup">保存</el-button>
        </template>
        <template v-if="dialogModal.type==='bank'">
          <el-button size="small" type='primary' @click="saveBankBillBefore">保存</el-button>
        </template>
        <!--凭证习惯设置-->
        <template v-if="dialogModal.type==='setting'">
          <el-button @click="closeSettingModal" size="small" class="button-com">取消</el-button>
          <el-button @click="saveSettingVoucher" size="small" type="primary">确定</el-button>
        </template>
      </template>
    </el-dialog>
    <!--凭证查看模块-->
    <check-voucher :voucher="voucher"></check-voucher>
    <!--记账-->
    <keep-accounts
      v-if="bookkeeping.modal"
      :bookkeeping="bookkeeping"
      @on-save="getFundList"
    ></keep-accounts>
    <batch-setup-acct
    :subjectData="setupAcctData"></batch-setup-acct>
  </div>

</template>

<script>
  // 组件
  import fundIndex from '@/views/fund/component/Fund/index'
  import HeaderOperate from '@/views/components/HeaderOperate'
  import ImportForm from '@/views/fund/component/ImportForm/index'
  import SubjectConfirm from '@/views/fund/component/SubjectConfirm/index'
  import ViceFileDetail from '@/views/components/detailModal/viceFileDetail.vue'
  import BankList from '@/views/fund/component/BankList/index'
  import CheckVoucher from '@/views/components/CheckVoucher.vue'
  import KeepAccounts from '@/views/components/KeepAccounts/index.vue'
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import HelpModal from '@/views/components/Help/index.vue'
  import SettingVoucher from '@/views/components/SettingVoucher/index.vue'
  import batchSetupAcct from '@/views/components/batchSetupAcct/index.vue'

  import {Message, Loading, MessageBox} from 'element-ui'

  import {deepCopy} from '@/utils/assist'
  import {dealListForVoucher, toMoney} from '@/utils/utils'
  import {crtTimeFtt} from '@/utils/dateFormat'
  // api
  import {
    queryFlowFundList, // 获取资金清单列表
    updateFlowFund, // 保存银行账号对账单
    queryBankAcctList, // 查询银行账号列表
    createVoucher, // 生成凭证（支持批量）
    deleteVoucher, // 删除凭证（支持批量）
    deleteFlowFundList, // 删除银行对账单列表
    queryBatchSetupList,
    saveBacthSetup, // 保存批量设置
    saveBankAcct, // 保存银行账号（添加和修改）
    saveBankStatement, // 10.8.保存导入银行对账单
    addRemark, // 12.12 备注信息新增
    deleteRemark, // 删除备注信息
    getFundContactList
  } from '@/api/fund'
  import {queryVoucherRule, updateVoucherRule} from '@/api/common'
  // data
  import {localParams, duration, subData, subjectData} from '@/views/components/data/common'
  import {fixedData, bankColumns} from '@/views/fund/data/fixedData'
  import {fundData} from '@/views/fund/data/com'
  import {settingData} from '@/views/fund/data/voucher'

  // 样式

  if (process.env.NODE_ENV === 'testing') {
    require('./styles/index-blue.scss')
  } else {
    require('./styles/index.scss')
  }

  const orderNames = {
    trans_type_name: 'bill_type_name',
    amountStr: 'amount',
    collect_amount: 'collect_amount',
    pay_amount: 'pay_amount',
    vm_state: 'voucher_num',
    counterparty: 'counterparty',
    summary: 'summary',
    billDate: 'bill_date',
    acct: 'acct_code'
  }
  const orders = {
    ascending: 'ASC',
    descending: 'DESC'
  }

  export default {
    data () {
      return {
        ...fixedData,
        ...deepCopy(fundData), // tranModal
        isFilterNumber: false,
        filterFormOld: deepCopy(fundData.filterForm),
        formContent: deepCopy(fundData.filterForm),
        settingData: deepCopy(settingData),
        hasImport: '',
        inputVal: '', // 头部输入框搜索
        checkoutFlag: false,
        dialogModal: {
          modal: false, // 弹出框控制
          type: 'import' // 'import'导入 'trans'交易流水确认 'sub'会计科目确认
        },
        formModal: {
          bankList: [],
          bankCode: '', // 银行账号
          fileInfo: {} // 对账单信息
        },
        vmState: '0',
        errorModal: { // 导入错误的具体提示
          modal: false,
          info: []
        },
        currentPage: 1,
        pageSize: 50,
        loading: false,
        list: [],
        multipleSelection: [],
        totalRecord: 0, // 流水总条数
        totalPage: 1, // 流水总页数
        amountData: {
          billNum: '', // 流水数目，即清单条数
          novoucherNum: '', // 未生成凭证流水数目
          payTotalAmount: '', // 收款合计
          collectTotalAmount: '', // 付款合计
          closing_balance: '' // 期末余额
        },
        count: {},
        filerBank: {
          bankCode: '', // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
          bankList: [] // 银行列表
        },
        editContent: {
          allSaveBtn: false,
          editList: []
        },
        sortData: {
          prop: '',
          order: ''
        },
        voucher: {  // 凭证查看
          modal: false,
          curListIdx: null,
          vch_id: '',
          list: []
        },
        bookkeeping: {
          modal: false,
          iframeSrc: ''
        },
        imgInfo: {},
        editBank: {
          list: [],
          delList: [],
          columns: bankColumns
        },
        subjectData: deepCopy(subData), // 科目新增
        setupAcctData: deepCopy(subjectData), // 科目设置数据
        setUpList: [],
        batchAddAcctModal: deepCopy(fundData.batchAddAcctModal),
        showTip: false,
        footerAmountMaxWidth: document.documentElement.clientWidth - 390 - 17,
        changeTaxType: false, // 纳税身份转换false 可编辑，true不可编辑
        taxFinance: true, // 凭证切换

      }
    },
    created () {
      const indexData = this.$store.getters.indexData
      const urlInfo = this.$store.getters.urlInfo
      this.checkoutFlag = indexData && indexData.checkoutFlag === 'Y'
      const changeTime = indexData.entAcctVO.year_period
      if (changeTime) {
        if (parseInt(changeTime) > parseInt(urlInfo.ssyf)) {
          this.changeTaxType = true
          this.btnType = null
          this.more = null
        }
      }
      if (this.checkoutFlag) {
        this.btnType = null
        this.more = null
      }
      this.init()
      window.closeFund = this.beforeClose
    },
    methods: {
      //资金辅助核算保存
      fund_save(){
        this.saveAll()
      },
      // 删除备注信息
      delete_Remark (arg) {
        deleteRemark(arg).then(res => {
          this.$message({
            showClose: true,
            message: '删除备注信息成功',
            duration: 1500,
            type: 'success'
          })
          this.init()
        }, e => {
          console.log(e)
          this.init()
        })
      },
      beforeClose () {
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
      handleDialogClose (done) {
        if (this.dialogModal.type !== 'setting') {
          done()
        } else {
          const { summary: {createSummaryType}} = this.settingData
          const collectDetail = createSummaryType[1].settingSummaryType[0].options[0]
          const payDetail = createSummaryType[1].settingSummaryType[1].options[0]
          let isEdit = collectDetail.isEdit && collectDetail.name !== collectDetail.defaultName
          if (!isEdit) {
            isEdit = payDetail.isEdit && payDetail.name !== payDetail.defaultName
          }
          if (isEdit) {
            return Message({
              message: '凭证摘要编辑后未进行保存，请先保存您所编辑的凭证摘要！',
              type: 'warning',
              duration: duration
            })
          } else {
            done()
          }
        }
      },
      // 初始化数据
      init (type) {
        this.getBankList('1', '0').then(list => {
          this.hasImport = list && list.length ? 'list' : 'import'
          this.filerBank.bankList = list
          if (type) {
            return this.getFundList()
          }
          if (this.hasImport === 'list') {
            Loading.service(localParams)
            this.filerBank.bankCode = list[0].bank_num
            this.getFundList()
          }
        })
      },
      // 查询银行账号列表
      getBankList (checkBillData, bankState) {
        return new Promise((resolve, reject) => {
          Loading.service(localParams)
          queryBankAcctList({
            check_bill_data: checkBillData, // 0：不需要银行账号当前会计期间有对账单数据，可以有对账单数据或者没有对账单数据；1：需要银行账号当前会计期间有对账单数据
            bank_state: bankState // 银行账号启用状态：0：代表全部（启用和停用）1：启用4：停用
          }).then(resp => {
            Loading.service().close()
            if (resp.data && resp.data.length) {
              for (const item of resp.data) {
                item.bank_name_num = `${item.bank_name}${item.bank_num}`
              }
            } else {
              resp.data = []
            }
            return resolve(resp.data)
          }, error => {
            Loading.service().close()
            return reject(error)
          })
        })
      },
      // 保存备注信息
      save_Remark (arg) {
        const params = {
          idArray: arg.id,
          remark: arg.arg
        }
        addRemark(params).then(resp => {
          this.$message({
            showClose: true,
            message: '保存备注信息成功',
            duration: 1500,
            type: 'success'
          })
          this.init()
        }, err => {
          console.log(err)
          this.init()
        })
      },
      // 查询银行行账单列表
      getFundList () {
        this.list = []
        Loading.service(localParams)
        const {billTypeId, acctSetState} = this.filterForm
        queryFlowFundList({
          bank_num: this.filerBank.bankCode, // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
          bill_type_id: billTypeId, // 单据类型 51000015收款 51000016付款 51000017转款
          acct_setup_state: +acctSetState, // 会计科目设置状态：0：全部；1：未设置；2：已设置
          vm_state: this.vmState, // 所选单据类型：0为全部  1为未执行生成  2为已生成凭证  3为生成凭证失败
          check_latest_bank_acct: '0', // 是不是只返回最新导入的一家银行对账单0：不是1：是
          counterparty_summary: this.inputVal, // 对方户名或者摘要：（1）默认不传，（2）传的时候需要为数字
          pageQueryVO: {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            orderName: this.sortData.prop,
            order: this.sortData.order
          }
        }).then(resp => {
          Loading.service().close()
          if (resp.data) {
            Object.keys(this.amountData).forEach(item => {
              const itemVal =  resp.data[item]
              if (item === 'payTotalAmount' || item === 'collectTotalAmount' || item === 'closing_balance') {
                this.amountData[item] = toMoney(itemVal)
              } else {
                this.amountData[item] = itemVal
              }
            })
            this.count = deepCopy(this.amountData)
            this.totalRecord = resp.data.totalRecord
            this.totalPage = resp.data.totalPage
            this.list = this.dealWithList(resp.data.flowFundVOList)
          }
        }, error => {
          Loading.service().close()
        })
      },
      // 处理列表数据
      dealWithList (resp) {
        const list = deepCopy(resp)
        list.forEach((item, index) => {
          item.isEdit = false
          item.showIcon = false
          item.index = index
          item.amountStr = toMoney(item.amount)
          item.billDate = crtTimeFtt('yyyy-MM-dd', item.bill_date)   // yyyy-MM-dd
          if (item.bill_type_id === 51000015) {
            item.trans_type_name = '收款'
            item.collect_amount = toMoney(item.amount)
            item.acct = item.acct_20_code ? `${item.acct_20_code} ${item.acct_20_name}` : ''
          } else {
            item.trans_type_name = '付款'
            item.pay_amount = toMoney(item.amount)
            item.acct = item.acct_10_code ? `${item.acct_10_code} ${item.acct_10_name}` : ''
          }
          // if (item.acct) {
          //   item.acct = isFuzhuSub(item.acct)
          // }
          if (item.vm_state === 2) {
            item.vmState = item.vt_num_list.split(',')[0].split('-')[1]
          } else if (item.vm_state === 3) {
            item.vmState = '1000000000000'
          } else {
            item.vmState = '1000000000001'
          }
        })
        return list
      },
      // 排序
      sortChange (e) {
        this.sortData.prop = e.prop ? orderNames[e.prop] : ''
        this.sortData.order = e.order ? orders[e.order] : ''
        this.getFundList()
      },
      handlePage (val, type) {
        if (this.editContent.allSaveBtn) {
          return MessageBox.alert('数据已经修改，是否保存？', '全部保存', {
            confirmButtonText: '是',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                /* if (type === 'pageSize') {
                  this.pageSize = val
                  this.currentPage = 1
                } else {
                  this.currentPage = val
                } */
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
          this.getFundList()
        }
      },
      getFilterList (inputVal, vmState) {
        this.currentPage = 1
        this.inputVal = inputVal || ''
        this.vmState = vmState
        this.getFundList()
      },
      // 点击导入按钮
      importForm () {
        if (this.changeTaxType) return
        this.dialogModal.modal = true
        this.dialogModal.type = 'import'
        this.formModal.bankList = []
        this.formModal.bankCode = ''
        this.formModal.fileInfo = {}
        this.getBankList('0', '1').then((list) => {
          this.formModal.bankList = list
        })
      },
      saveAll () {
        const editList = this.editContent.editList
        const flowFundVOList = []
        for (const item of editList) {
          const acctArray = item.acct.split(' ')
          const billDetail = item.bill_type_id === 51000015 ? {
            acct_20_code: acctArray[0],
            acct_20_name: acctArray[1],
            acct_20_ci_name: item.acct_20_ci_name || '',
            acct_10_code: '',
            acct_10_name: '',
            acct_10_ci_name: ''
          } : {
            acct_10_code: acctArray[0],
            acct_10_name: acctArray[1],
            acct_10_ci_name: item.acct_10_ci_name || '',
            acct_20_code: '',
            acct_20_name: '',
            acct_20_ci_name: ''
          }
          flowFundVOList.push(Object.assign({
            id: item.id,
            bill_type_id: item.bill_type_id
          }, billDetail))
        }
        Loading.service(localParams)
        updateFlowFund({
          flowFundVOList
        }).then(resp => {
          Loading.service().close()
          this.editContent.allSaveBtn = false
          this.editContent.editList = []
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.getFundList()
        }, error => {
          Loading.service().close()
        })
      },
      // 生成凭证 接口
      createVoucher (idArray) {
        Loading.service(localParams)
        createVoucher({
          idArray: idArray
        }).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.getFundList()
        }, error => {
          Loading.service().close()
          this.getFundList()
        })
      },
      deleteVoucher (vchIdArray) {
        Loading.service(localParams)
        deleteVoucher({
          vch_id_list_array: vchIdArray
        }).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.getFundList()
        }, error => {
          Loading.service().close()
        })
      },
      deleteBill () {
        Loading.service(localParams)
        deleteFlowFundList({
          bank_num: this.filerBank.bankCode // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
        }).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.currentPage = 1
          this.init()
        }, error => {
          Loading.service().close()
        })
      },
      batchSetup () {
        Loading.service(localParams)
        this.subModal = deepCopy(fundData.subModal)
        queryBatchSetupList({
          bank_num: this.filerBank.bankCode, // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
          bill_type_id: 0, // 单据类型 51000015收款 51000016付款 51000017转款
          acct_setup_state: 0, // 会计科目设置状态：0：全部；1：未设置；2：已设置
          vm_state: 0 // 所选单据类型：0为全部  1为未执行生成  2为已生成凭证  3为生成凭证失败
        }).then(resp => {
          Loading.service().close()
          this.dialogModal.modal = true
          this.dialogModal.type = 'setup'
          const {contactCode} = resp.data
          this.subModal.contactCode = this.dealWithCodeList(contactCode)
          const acctList = this.dealWithSetUpList(resp.data.acctInfoList)
          this.dealWithSubModalData(acctList.acctInfoList, acctList.noList)
        }, error => {
          Loading.service().close()
        })
      },
      dealWithSetUpList (acctInfoList) {
        const noList = []
        acctInfoList.forEach((item, index) => {
          item.isEdit = false
          item.showIcon = false
          item.key = index
          item.collectNum = Number(item.collectionTotal)
          item.paymentNum = Number(item.paymentTotal)
          item.collectionTotal = item.collectionTotal !== '0' ? item.collectionTotal : ' '
          item.paymentTotal = item.paymentTotal !== '0' ? item.paymentTotal : ''
          if (item.acctCodeNameStr) {
            if (item.acctCodeNameStr.split(';').length > 1) {
              item.acct = '已确认了多个科目'
            } else {
              item.acct = item.acctCodeNameStr
              const accountList = this.$store.getters.accountList
              if (accountList && accountList.accountDetail) {
                const detail = accountList.accountDetail
                const idx = detail.findIndex(v => v._Code === item.acctCodeNameStr.split(' ')[0])
                if (idx > -1 && detail[idx]._AuxAccItem.trim() !== '' && detail[idx]._AuxAccItem.trim() !== null) {
                  item.acct = `${item.acctCodeNameStr} 辅`
                }
              }
            }
          } else {
            item.acct = ''
            noList.push(item)
          }
        })
        return {acctInfoList, noList}
      },
      dealWithSubModalData (acctInfoList, noList) {
        this.subModal.allList = acctInfoList
        this.subModal.noList = noList
        this.subModal.radio = this.subModal.noList.length ? 'no' : 'all'
        this.subModal.list = this.subModal.noList.length ? this.subModal.noList : this.subModal.allList
        this.subModal.noNum = this.subModal.noList.length
        this.subModal.allNum = this.subModal.allList.length
      },
      dealWithCodeList (list) {
        const codeList = []
        for (const item of list) {
          codeList.push({
            account: item._Code + ' ' + item._Name,
            tip: item._Code + ' ' + item._ParentName,
            edit: item._Edit,
            acct_ci_name: item._AssistId && item._AssistCode ? JSON.stringify({[item._AssistId]: item._AssistCode}) : ''
          })
        }
        return codeList
      },
      // 保存批量设置
      saveSubSetup () {
        this.dialogModal.type === 'setup' ? this.saveBacthSetup() : this.saveBankStatement()
      },
      saveBankStatement () {
        const flowFundVOList = []
        for (const item of this.tranModal.list) {
          const {bill_type_id, bill_date, counterparty, summary, amount, acct_10_code, acct_10_name, acct_10_ci_name, acct_20_code, acct_20_name, acct_20_ci_name, bank_num, closing_balance, counterparty_id, summary_id, trans_type} = item
          flowFundVOList.push({bill_type_id, bill_date, counterparty, summary, amount, acct_10_code, acct_10_name, acct_10_ci_name, acct_20_code, acct_20_name, acct_20_ci_name, bank_num, closing_balance, counterparty_id, summary_id, trans_type})
        }
        const acctInfoList = []
        for (const item of this.subModal.allList) {
          let acctCodeNameStr = ''
          if (item.acct === '已确认了多个科目') {
            acctCodeNameStr = item.acctCodeNameStr
          } else {
            const acctArray = item.acct.split(' ')
            acctCodeNameStr = acctArray.length > 2 ? `${acctArray[0]} ${acctArray[1]}` : item.acct
          }
          acctInfoList.push({
            counterparty: item.counterparty,
            acctCodeNameStr: acctCodeNameStr,
            acct_ci_name: item.acct_ci_name
          })
        }
        Loading.service(localParams)
        saveBankStatement({
          flowFundVOList: flowFundVOList, // 批量保存资金列表
          acctInfoList: acctInfoList // 批量设置对方名称和科目：
        }).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            dangerouslyUseHTMLString: true,
            type: 'success',
            duration: 3000
          })
          this.dialogModal.modal = false
          this.filerBank.bankCode = this.formModal.bankCode
          this.init(true)
        }, error => {
          Loading.service().close()
        })
      },
      saveBacthSetup () {
        const {editList} = this.subModal
        Loading.service(localParams)
        saveBacthSetup({
          bank_num: this.filerBank.bankCode, // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
          acctInfoList: editList
        }).then(resp => {
          Loading.service().close()
          this.dialogModal.modal = false
          this.getFundList()
        }, error => {
          Loading.service().close()
        })
      },
      // 银行账号设置
      setBankBill () {
        this.editBank.list = []
        this.editBank.delList = []
        this.getBankList('0', '0').then((list) => {
          this.dialogModal.modal = true
          this.dialogModal.type = 'bank'
          for (const item of list) {
            item.showIcon = false
            item.bank_state = String(item.bank_state)
            const accountList = this.$store.getters.accountList
            if (accountList && accountList.accountDetail) {
              const detail = accountList.accountDetail
              const idx = detail.findIndex(v => v._Code === item.bank_acct_code.split(' ')[0])
              if (idx > -1 && detail[idx]._AuxAccItem.trim() !== '' && detail[idx]._AuxAccItem.trim() !== null) {
                item.bank_acct_code = `${item.bank_acct_code} 辅`
              }
            }
          }
          this.editBank.list = list
        })
      },
      saveBankBillBefore () {
        const indexData = this.$store.getters.indexData
        const list = this.editBank.list
        const bankAcctList = []
        let dex = ''
        const length = list.length
        for (let i = 0; i < length; i++) {
          const item = list[i]
          if (item.id === 0) {
            if (!item.bank_name && !item.bank_num && !item.bank_acct_code) return
            if (!item.bank_name) {
              dex = `第${i + 1}行的银行名称必填！`
              break
            }
            if (!item.bank_num) {
              dex = `第${i + 1}行的账号必填！`
              break
            }
          }
          if (!item.bank_acct_code) {
            dex = `第${i + 1}行的核算科目必填！`
            break
          }
          let bank_acct_code = item.bank_acct_code
          const subArray = item.bank_acct_code.split(' ')
          if (subArray.length) {
            bank_acct_code = `${subArray[0]} ${subArray[1]}`
          }
          bankAcctList.push({
            ent_id: indexData.entAcctVO.id,
            id: item.id,
            operateType: item.id === 0 ? '1' : '2',
            bank_name: item.bank_name,
            bank_num: item.bank_num,
            bank_acct_code: bank_acct_code,
            bank_acct_ci_name: item.bank_acct_ci_name,
            ccy_name: item.ccy_name,
            bank_state: item.bank_state
          })
        }
        // 校验重复  后台已经校验 屏蔽
        /* if (!dex) {
          const bankList = deepCopy(bankAcctList)
          bankList.sort(function (a, b) {
            return b.bank_num - a.bank_num
          })
          const bankLength = bankList.length
          for (let i = 0; i < bankLength; i++) {
            if (bankList[i].bank_num === bankList[i + 1].bank_num) {
              dex = '银行账号不能有重复！'
              break
            }
          }
        } */
        if (dex) {
          return Message({
            message: `${dex}`,
            type: 'warning',
            duration: duration
          })
        }
        const param = bankAcctList.concat(this.editBank.delList)
        this.saveBankBill(param, true)
      },
      saveBankBill (param, type) {
        Loading.service(localParams)
        saveBankAcct({
          bankAcctList: param
        }).then(resp => {
          Loading.service().close()
          if (type) {
            this.dialogModal.modal = false
          } else {
            const item = param[0]
            this.formModal.bankCode = item.bank_num
            this.$refs.importForm.closedBankModal()
            this.getBankList('0', '1').then((list) => {
              this.formModal.bankList = list
            })
          }
        }, error => {
          Loading.service().close()
        })
      },
      // 点击勾选多选，删除等，多选内容置空
      handleSelectionChange (list) {
        if (list && list.length) {
          const amount = {
            novoucherNum: 0, // 未生成凭证流水数目
            payTotalAmount: '0', // 付款合计
            collectTotalAmount: '0' // 收款合计
          }
          for (const item of list) {
            if (item.vm_state !== 2) {
              amount.novoucherNum++
            }
            if (item.bill_type_id === 51000015) {
              amount.collectTotalAmount = parseFloat((+amount.collectTotalAmount) + item.amount).toFixed(2)
            } else {
              amount.payTotalAmount = parseFloat((+amount.payTotalAmount) + item.amount).toFixed(2)
            }
          }
          amount.collectTotalAmount = toMoney(amount.collectTotalAmount)
          amount.payTotalAmount = toMoney(amount.payTotalAmount)
          this.count = amount
          this.count.billNum = list.length
        } else {
          this.count = deepCopy(this.amountData)
        }
        this.multipleSelection = list
        // this.selectAmount = selectAmount
      },
      // modal 点击凭证字号进入查看凭证(拉取北京)
      toCheckVoucher (voucherId) {
        this.voucher.modal = true
        this.voucher.curListIdx = null
        this.voucher.vch_id = voucherId
        this.voucher.list = dealListForVoucher(this.list)
      },
      toImg (row) {
        this.imgInfo = row
        this.dialogModal.type = 'img'
        this.dialogModal.modal = true
      },
      // 点击确定按钮
      sureImport () {
        const {bankCode, fileInfo, bankList} = this.formModal
        if (!(/\.(xls|XLS|xlsx|XLSX)$/.test(fileInfo.name))) {
          return Message({
            message: '当前系统仅支持Excel格式（xls  xlsx），请检查后重新导入！',
            type: 'warning',
            duration: duration
          })
        }
        // console.log(fileInfo.size)
        if (fileInfo.size > 1024 * 1024 * 3) {
          return Message({
            message: '导入文件大于3M，不支持导入！',
            type: 'warning',
            duration: duration
          })
        }
        if (!bankCode) {
          return Message({
            message: '银行账号不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        if (!fileInfo.name) {
          return Message({
            message: '请选择需要导入的模板文件！',
            type: 'warning',
            duration: duration
          })
        }
        const idx = bankList.findIndex(v => v.bank_num === bankCode)
        const bankName = bankList[idx].bank_name
        const indexData = this.$store.getters.indexData
        const urlInfo = this.$store.getters.urlInfo
        const formData = new FormData()
        formData.append('ent_id', indexData.entAcctVO.id)
        formData.append('qyid', urlInfo.qyid)
        formData.append('year_period', String(urlInfo.ssyf))
        formData.append('bank_name', bankName)
        formData.append('bank_num', bankCode)
        formData.append('bankStatement', fileInfo)
        // bill_state 0：没有导入 1：有导入
        // console.log(bankList[idx].bill_state)
        if (bankList[idx].bill_state === 0) {
          return this.parseBankStatement(formData)
        }
        if (bankList[idx].vm_state === 0) {
          return MessageBox.alert('所选的账号已导入过对账单，重复导入将覆盖已导入的数据', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.parseBankStatement(formData)
              }
            }
          })
        }
        return MessageBox.alert('已导入对账单并生成了凭证，请删除凭证后重新导入', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        })
      },
      parseBankStatement (formData) {
        const self = this
        this.tranModal = deepCopy(fundData.tranModal)
        this.subModal = deepCopy(fundData.subModal)
        Loading.service(localParams)
        self.$http.post(`${process.env.BASE_API}/flowFund/parseBankStatement.do`, formData).then(function (resp) {
          const data = resp.data
          Loading.service().close()
          if (data && data.code === '0') {
            Message({
              message: data.message,
              type: 'success',
              duration: duration
            })
            const {billNum, collectTotalAmount, payTotalAmount, closing_balance, flowFundVOList, acctInfoList} = data.data
            for (const item of flowFundVOList) {
              item.amountStr = toMoney(item.amount)
              item.billDate = crtTimeFtt('yyyy-MM-dd', item.bill_date)   // yyyy-MM-dd
              if (item.bill_type_id === 51000015) {
                item.bill_type_name = '收款'
                item.collect_amount = toMoney(item.amount)
              } else {
                item.bill_type_name = '付款'
                item.pay_amount = toMoney(item.amount)
              }
            }
            self.tranModal.list = flowFundVOList
            self.tranModal.amount = {
              billNum: billNum,
              collectTotalAmount: toMoney(collectTotalAmount),
              payTotalAmount: toMoney(payTotalAmount),
              closing_balance: toMoney(closing_balance)
            }
            self.setUpList = self.dealWithSetUpList(acctInfoList)
            self.dialogModal.modal = true
            self.dialogModal.type = 'trans'
          } else {
            if (data.data && data.data.length) {
              self.errorModal.modal = true
              self.errorModal.info = data.data
            } else {
              Message({
                message: data.message,
                type: 'error',
                duration: duration
              })
            }
          }
        }, function (error) {
          Loading.service().close()
          Message({
            message: error.message,
            type: 'error',
            duration: duration
          })
        })
      },
      toNext () {
        this.dialogModal.type = 'sub'
        this.dialogModal.modal = true
        const {acctInfoList, noList} = deepCopy(this.setUpList)
        this.dealWithSubModalData(acctInfoList, noList)
      },
      onUp () {
        this.dialogModal.modal = true
        this.dialogModal.type = 'trans'
      },
      onBatchAddAcct () {
        const noList = deepCopy(this.subModal.noList)
        this.batchAddAcctModal = deepCopy(fundData.batchAddAcctModal)
        this.getFundAcct().then(resp => {
          this.batchAddAcctModal.contactCode = resp
          this.dialogModal.modal = true
        })
        for (const item of noList) {
          item.showIcon = false
          item.isEdit = false
          item.newAcct = item.counterparty
          const isCompany = item.counterparty_id.substr(0, 1)
          if (isCompany === '2' && !item.paymentNum && item.collectionTotal) {
            item.higherSub = '1122 应收账款'
          } else if (isCompany === '2' &&  !item.collectNum && item.paymentTotal) {
            item.higherSub = '2202 应付账款'
          } else if (isCompany === '1') {
            item.higherSub = '2241 其他应付款'
          } else {
            item.higherSub = ''
          }
        }
        // this.batchAddAcctModal = deepCopy(fundData.batchAddAcctModal)
        this.batchAddAcctModal.subModal = true
        this.batchAddAcctModal.list = noList
      },
      getFundAcct () {
        return new Promise((resolve, reject) => {
          getFundContactList().then(resp => {
            const {data} = resp
            const list = []
            for (const item of data) {
              list.push({
                account: item._Code + ' ' + item._Name,
                disabled: item._Edit,
                stock: item._Stock,
                assistCode: item._AssistCode
              })
            }
            return resolve(list)
          }, err => {
            reject(err)
          })
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
          queryVoucherRule({module: 'flowfund'}).then(resp => {
            const {firstMergeRule, secondMergeRule, voucherDateRule,
              flowfundSummaryType, collectionSummaryRule, paymentSummaryRule} = resp.data
            this.settingData = deepCopy(settingData)
            const {createType: {subItem, subject}, summary, createDate} = this.settingData
            subItem[0].type = firstMergeRule
            const createIdx = subItem[0].options.findIndex(item => item.val === firstMergeRule)
            if (createIdx > -1) {
              subItem[0].options[createIdx].showTip = true
            }
            summary.summaryType = flowfundSummaryType
            const {createSummaryType} = summary
            createSummaryType[1].settingSummaryType[0].options[0].name = collectionSummaryRule.transType
            createSummaryType[1].settingSummaryType[0].options[0].defaultName = deepCopy(collectionSummaryRule.transType)
            createSummaryType[1].settingSummaryType[1].options[0].name = paymentSummaryRule.transType
            createSummaryType[1].settingSummaryType[1].options[0].defaultName = deepCopy(paymentSummaryRule.transType)
            createSummaryType[1].settingSummaryType[0].type = ['transType'].concat(this.dealWithVoucherData(createSummaryType[1].settingSummaryType[0].options, collectionSummaryRule))
            createSummaryType[1].settingSummaryType[1].type = ['transType'].concat(this.dealWithVoucherData(createSummaryType[1].settingSummaryType[1].options, paymentSummaryRule))
            createDate.voucherDateRule = voucherDateRule
            subject[0].options.forEach(item => {
              if (secondMergeRule && secondMergeRule[item.val] === '1') {
                subject[0].type.push(item.val)
              }
            })
            this.dialogModal.modal = true
            this.dialogModal.type = 'setting'
            return resolve(resp)
          }, err => {
            return reject(err)
          })
        })
      },
      dealWithVoucherData (list, rule) {
        const checkArray = []
        list.forEach(item => {
          if (rule[item.value] === '1') {
            checkArray.push(item.value)
          }
          if (rule.goodServiceName && rule.goodServiceName === '1') {
            item.show = true
          }
        })
        return checkArray
      },
      closeSettingModal () {
        this.dialogModal.modal = false
        this.dialogModal.type = ''
      },
      saveSettingVoucher () {
        Loading.service(localParams)
        const {createType: {subItem, subject}, createDate: {voucherDateRule}, summary: {summaryType, createSummaryType}} = this.settingData
        const collectDetail = createSummaryType[1].settingSummaryType[0].options[0]
        const payDetail = createSummaryType[1].settingSummaryType[1].options[0]
        let isEdit = collectDetail.isEdit && collectDetail.name !== collectDetail.defaultName
        if (!isEdit) {
          isEdit = payDetail.isEdit && payDetail.name !== payDetail.defaultName
        }
        if (isEdit) {
          Loading.service().close()
          return Message({
            message: '凭证摘要编辑后未进行保存，请先保存您所编辑的凭证摘要！',
            type: 'warning',
            duration: duration
          })
        }
        const serviceData = subject[0].type
        const secondMergeRule = {
          depositAccount: serviceData.indexOf('depositAccount') > -1 ? '1' : '0',
          oppositeFlowfundAccount: serviceData.indexOf('oppositeFlowfundAccount') > -1 ? '1' : '0',
        }
        const collctRule = createSummaryType[1].settingSummaryType[0].type
        const payRule = createSummaryType[1].settingSummaryType[1].type
        const collectionSummaryRule = {
          transType: createSummaryType[1].settingSummaryType[0].options[0].name,
          billDate: collctRule.indexOf('billDate') > -1 ? '1' : '0',
          counterparty: collctRule.indexOf('counterparty') > -1 ? '1' : '0',
          summary: collctRule.indexOf('summary') > -1 ? '1' : '0'
        }
        const paymentSummaryRule = {
          transType: createSummaryType[1].settingSummaryType[1].options[0].name,
          billDate: payRule.indexOf('billDate') > -1 ? '1' : '0',
          counterparty: payRule.indexOf('counterparty') > -1 ? '1' : '0',
          summary: payRule.indexOf('summary') > -1 ? '1' : '0'
        }
        const params = {
          voucher_rule: JSON.stringify({
            firstMergeRule: subItem[0].type,
            voucherDateRule: voucherDateRule,
            secondMergeRule: secondMergeRule,
            flowfundSummaryType: summaryType,
            collectionSummaryRule: collectionSummaryRule,
            paymentSummaryRule: paymentSummaryRule
          }),
          module: 'flowfund'
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
      batchSetupAcct () {
        this.setupAcctData = deepCopy(subjectData)
        this.setupAcctData.subModal = true
        this.setupAcctData.code = []
        this.setupAcctData.mainMenu = 'fund'
        this.setupAcctData.accounting.type =  'all'
      }
    },
    mounted () {
    },
    updated () {
      this.$nextTick(() => {
        if (this.$refs.footerBox) {
          this.showTip = this.$refs.footerBox.offsetWidth >= this.footerAmountMaxWidth
        }
      })
    },
    components: {
      fundIndex,
      ImportForm,
      SubjectConfirm,
      ViceFileDetail,
      HeaderOperate,
      BankList,
      CheckVoucher,
      KeepAccounts,
      FooterPagination,
      HelpModal,
      SettingVoucher,
      batchSetupAcct
    }
  }
</script>
