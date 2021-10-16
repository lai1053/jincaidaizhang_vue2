<style lang="scss">
  .reorganize-box{
    position: absolute;
    margin-top: -164px;
    margin-left: -164px;
    top: 50%;
    left: 50%;
    .page-reorganize-box{
      width: 308px;
      height: 328px;
      position: relative;
      float: left;
      color: #666;
    }
    .download-bill,.upload-bill{
      display: block;
      position: absolute;
      bottom: 50px;
      font-size: 12px;
      .iconfont{
        margin-right: 5px;
      }
    }
    .download-bill{
      left: 50px;
    }
    .upload-bill{
      right: 50px;
    }
  }
</style>
<style lang="scss" scoped>
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
  <div class="sales">
    <div  v-if="hasImport === 'list'">
      <header-operate
        inputTip="请输入发票号码或往来单位"
        main-menu="sales"
        :btn-type="btnType"
        :more="more"
        :form-content="formContent"
        :filter-form="filterForm"
        :filter-form-old="filterFormOld"
        :multiple-selection="multipleSelection"
        :proofState="true"
        :change-tax-type="changeTaxType"
        @on-filter="getFilterList"
        @batch-setup="batchSetup"
        @on-delete="deleteInvoice"
        @on-delete-voucher="deleteVoucher"
        @on-create-voucher="createVoucher"
        @on-setting-voucher="settingVoucher"
        @on-save-Remark="save_Remark"
        @on-delete-remarks="delete_Remark"
        @on-delete-inventory="deleteInventory"
      >
        <template slot="filterItem">
          <el-form-item label="开票日期">
            <el-col :span="11">
              <el-date-picker value-format="yyyy-MM-dd"  size="small" v-model="formContent.bill_date_start" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker value-format="yyyy-MM-dd"  size="small" v-model="formContent.bill_date_end" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="价税合计金额">
            <el-col :span="11">
              <el-input
                v-model="formContent.min_amount"
                placeholder="0.00"
               @input="handleInput($event, 'formContent','min_amount')"
                size="small"
              ></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input
                v-model="formContent.max_amount"
                placeholder="0.00"
               @input="handleInput($event, 'formContent','max_amount')"
                size="small"
              ></el-input>
            </el-col>
          </el-form-item>
        </template>
      </header-operate>
      <!--列表信息-->
      <kind-table
        :loading="loading"
        :columns="columns"
        :list="list"
        :bookkeeping="bookkeeping"
        :inventory="inventory"
        :change-tax-type="changeTaxType"
        main-menu="sales"
        @sort-change="sortChange"
        @on-delete="deleteInvoice"
        @on-selection-change="handleSelectionChange"
        @row-dblclick="dblClickRow"
        @on-delete-voucher="deleteVoucher"
        @on-check-voucher="toCheckVoucher"
        @on-save-Remark="save_Remark"
      ></kind-table>
      <div class="footer-total-amount">
        <footer-amount
          :amount-data="amountData"
          :float-data="floatAmount"
          :float-title="floatTitle"
        ></footer-amount>
        <footer-pagination
          @size-change="handlePage($event, 'pageSize')"
          @current-change="handlePage($event, 'currentPage')"
          :current-page.sync="currentPage"
          :page-sizes="[50, 100, 300]"
          :page-size="pageSize"
          :total="totalRecord"
          :total-page="totalPage"
        ></footer-pagination>
      </div>
    </div>
    <div class="help-modal-box"  v-if="hasImport === 'import'"><help-modal main-menu="sales"></help-modal></div>
    <!--理票页面-->
    <!--无导入开始-->
    <!--<div v-if="hasImport === 'import'" :class="changeTaxType? 'page-box common-disable':'page-box sale-page-box'" @click="batchSetup"></div>-->
    <!--无导入结束-->
    <!--银峰开始-->
    <div v-if="hasImport==='import'" class="reorganize-box">
      <div @click="batchSetup" :class="changeTaxType ? 'page-reorganize-box disable-auto-box': 'page-reorganize-box auto-reorganize-bill'"></div>
    </div>
    <!--银峰结束-->
    <el-button v-if="hasImport==='import'" size="small" type='primary'  @click="handleImport"  style="float: right; margin-top: 6px">导入发票</el-button>
    <div class="guide" v-if="hasImport==='import'"></div>
    <!--弹窗  图片-->
    <el-dialog
      v-if="dialogModal.modal"
      :width="typeDesc[dialogModal.type][0]"
      :visible.sync="dialogModal.modal"
      :title="typeDesc[dialogModal.type][1]"
      top="0"
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
      class="fund-dialog vertical-center-modal">
      <!--理票-->
      <reorganize-bill
        ref="reorganizeBill"
        main-menu="sales"
        v-if="dialogModal.type==='setup'"
        :setup-data="setupData"
        :service-columns="serviceColumns"
        :tab-pane="tabPaneType"
        :setup-modal="setupModal"
        @on-save-setup-sub="saveSetupSub"
      ></reorganize-bill>
      <!--双击编辑-->
      <bill-edit
        v-if="dialogModal.type==='detail'||dialogModal.type==='edit'"
        ref="billEdit"
        main-menu="sales"
        :dialog-modal="dialogModal"
        :list="list"
        :main-detail="mainDetail"
        :main-title="mainTitle"
        :settle-method="settleMethod"
        :columns="billColumns"
        :table-data="detailList"
        @on-up-next="dblClickRow"></bill-edit>
      <!--导入发票-->
      <import-form
        v-if="dialogModal.type==='import'"
        :form-modal="formModal"
        :downloadUrl="downloadUrl"
        :changeTaxType="changeTaxType"
      ></import-form>
      <!--凭证习惯设置-->
      <setting-voucher
        v-if="dialogModal.type==='setting'"
        :setting-data="settingData"
        :taxFinance="taxFinance"
      ></setting-voucher>
      <!--理票 业务确认-->
      <template slot="footer">
        <!--理票  结算科目确认-->
        <template v-if="dialogModal.type==='setup'&&setupData.step==='one'">
          <div class="footer-amount">
            <div class="amount-box"><span style="font-size: 14px;font-weight: bold; color:#666666;"> 合计&nbsp;&nbsp;&nbsp;&nbsp;
          </span></div>
            <el-tooltip
              effect="dark"
              :disabled="!filterTip"
              :content="filterTip"
              placement="top-start">
              <div class="amount-box">
                发票：<span class="text-color" >{{setupData.service.listNum}}</span>张&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </el-tooltip>
            <div class="amount-box">价税合计：<span class="text-color" >{{setupData.service.amount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <div class="amount-box" v-if="setupData.service.negativeAmount!= 0"><span class="text-color" >{{setupData.service.negativeAmount}}</span></div>
          </div>
          <el-button v-if="setupData.service.allList && setupData.service.allList.length > 0" size="small" style="margin-left: 15px" type='primary' @click="toNext">下一步</el-button>
          <el-button v-else size="small" style="margin-left: 15px" type='primary' @click="closeModel">关闭</el-button>
        </template>
        <!--理票 科目确认-->
        <template v-if="dialogModal.type==='setup'&&setupData.step==='two'">
          <!--<div class="footer-tip"><span>温馨提示：</span>历史期间有发生但本期间无发生业务的'存货'，不在本会计期间显示</div>-->
          <el-button class="button-com" size="small" @click="onUp">上一步</el-button>
          <el-button size="small" style="margin-left: 15px" type='primary' @click="saveSubSetup">保存</el-button>
        </template>
        <!--双击查看清单详情 底部按钮-->
        <template v-if="dialogModal.type==='detail'||dialogModal.type==='edit'">
          <detail-footer
            v-if="dialogModal.type==='detail'"
            :list="list"
            :detail="mainDetail"
            :checkoutFlag="checkoutFlag"
            :changeTaxType="changeTaxType"
            main-menu="sales"
            @on-up-next="dblClickRow"
            @on-check-voucher="toCheckVoucher"
            @on-delete-voucher="deleteVoucher($event, true)">
            <template slot="amountCount">
              <amount-count
                module="sale"
                :total="detailList.length"
                :sum="mainDetail.ex_tax_amount"
                :tax="mainDetail.tax_amount"
                :amount="mainDetail.amount"
              ></amount-count>
            </template>
          </detail-footer>
          <edit-footer
            v-else
            :modalType="dialogModal.type"
            :list="list"
            :detail="mainDetail"
            @on-up-next="dblClickRow"
            @on-operation="operationBefore">
            <template slot="amountCount">
              <amount-count
                module="sale"
                :total="detailList.length"
                :sum="mainDetail.ex_tax_amount"
                :tax="mainDetail.tax_amount"
                :amount="mainDetail.amount"
              ></amount-count>
            </template>
          </edit-footer>
        </template>
        <!--导入发票-->
        <template  v-if="dialogModal.type ==='import'">
          <el-button @click="sureImport" size="small" type="primary">导入</el-button>
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
      :bookkeeping="bookkeeping"
      v-if="bookkeeping.modal"
      @on-save="getSaleList"
    ></keep-accounts>
    <!--查看存货-->
    <inventory-bill v-if="inventory.modal" :inventory="inventory"></inventory-bill>
  </div>

</template>
<script>
  // 组件
  import HeaderOperate from '@/views/components/HeaderOperate'
  import ReorganizeBill from '@/views/components/ReorganizeBill/index'
  import KindTable from '@/views/components/KindTable/index'
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import CheckVoucher from '@/views/components/CheckVoucher.vue'
  import KeepAccounts from '@/views/components/KeepAccounts/index.vue'
  import billEdit from '@/views/components/BillEdit/index.vue'
  import DetailFooter from '@/views/components/BillFooter/DetailFooter.vue'
  import EditFooter from '@/views/components/BillFooter/EditFooter.vue'
  import AmountCount from '@/views/components/AmountCount.vue'
  import FooterAmount from '@/views/components/FooterAmount'
  import HelpModal from '@/views/components/Help/index.vue'
  import importForm from '@/views/components/importForm'
  import SettingVoucher from '@/views/components/SettingVoucher/index.vue'
  import AddRemark from '@/views/components/AddRemark'
  import InventoryBill from '@/views/components/InventoryBill/index.vue'

  import {fixedData} from './data/fixedData'
  import {filterForm, setupData, floatTitle, setupModal} from './data/com'
  import {settingData} from './data/voucher'
  import {deepCopy} from '@/utils/assist'
  import {
    getSaleList,
    delVoucher,
    createVoucher,
    editBills,
    saveSaleInvoiceAndGeneratePz,
    downloadSaleInvoice,
    querySaleAcctList,
    saveAcct,
    addRemark,
    deleteRemark,
    deleteSaleInvoice,
    deleteInventoryBill} from '@/api/sales'
  import {queryVoucherRule, updateVoucherRule} from '@/api/common'
  import { dealListForVoucher, checkNum, toMoney} from '@/utils/utils'
  import {
    crtTimeFtt
  } from '@/utils/dateFormat'
  import {isFuzhuSub} from '@/utils/eval'
  import {localParams, duration} from '@/views/components/data/common'
  import {Message, Loading} from 'element-ui'

  // 样式
  if (process.env.NODE_ENV === 'testing') {
    require('./styles/index-blue.scss')
  } else {
    require('./styles/index.scss')
  }
  const ordersNames = {
    billDate: 'bill_date',
    cust_name: 'cust_name',
    amountStr: 'amount',
    sm_name: 'sm_name',
    acct_10: 'acct_10_code',
    acct_20: 'acct_20_code',
    vm_state: 'voucher_num',
    bill_type_name: 'bill_type_for_sort_only', // 新增发票类型 将原来的bill_type_id替换成现在的
    'inv_no': 'inv_no'
  }
  const orders = {
    ascending: 'ASC',
    descending: 'DESC'
  }

  export default {
    data () {
      return {
        ...fixedData,
        filterForm: deepCopy(filterForm),
        filterFormOld: deepCopy(filterForm),
        formContent: deepCopy(filterForm),
        floatTitle: deepCopy(floatTitle),
        settingData: deepCopy(settingData),
        setupModal: deepCopy(setupModal),
        hasImport: '',
        inputVal: '', // 头部输入框搜索
        vmState: '0',
        loading: false,
        list: [],
        oldList: [],
        amountDataOld: {
          billNum: '',
          postiveExTaxAmount: '',
          negativeExTaxAmount: '',
          positiveTax: '',
          negativeTax: '',
          positiveAmount: '',
          negativeAmount: ''
        },
        floatAmount: {
          xxBillNum: '',
          ppBillNum: '',
          zpBillNum: '',
          dkBillNum: '',
          jdcBillNum: ''
        },
        amountData: {},
        checkoutFlag: false,
        billDetait: {}, // 详情 保存一个分原始数据
        mainDetail: {
          updatePage: 0
        }, // 详情 主表数据
        detailList: [], // 详情 从表列表
        settleMethod: [], // 结算方式列表
        sortData: {
          prop: '',
          order: ''
        },
        multipleSelection: [],
        dialogModal: {
          modal: false, // 弹出框控制
          type: 'setup' // 'setUp'理票
        },
        setupData: deepCopy(setupData),
        voucher: {
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
        subModal: {
          modal: true
        },
        editData: {},
        billId: '',
        editList: [],
        viceData: [],
        totalData: {
          totalPrice: '0.00',
          totalTax: '0.00',
          totalAmount: '0.00'
        },
        billHeight: '230px',
        batchSetupList: [],
        serviceList: [],
        smNameList: [],
        accountList: [],
        selectList: [],
        currentPage: 1,
        pageSize: 50,
        totalRecord: 0, // 流水总条数
        totalPage: 1, // 流水总页数
        updatePage: 0,  // 用来监听详情生成凭证
        filterTip: '',
        formModal: {
          fileInfo: {},
          mold: 'sales'
        },
        downloadUrl: '',
        changeTaxType: false, // 纳税身份转换，false可编辑，true 不可编辑
        remarks: {    // 备注添加页
          modal: false,
          message: false
        },
        incomeCode: [],
        contactCode: [],
        inventory: {
          modal: false,
          iframeSrc: ''
        },
        taxFinance: true, // 凭证习惯切换
        tabPaneType: []
      }
    },
    props: {
    },
    created () {
      this.init()
    },
    methods: {
      // 删除备注信息
      handleDialogClose (done) {
        if (this.dialogModal.type !== 'setting') {
          done()
        } else {
          const {summary: {subItem}} = this.settingData
          let isEdit = subItem[0].options[0].isEdit && subItem[0].options[0].name !== subItem[0].options[0].defaultName
          if (!isEdit) {
            isEdit = subItem[1].options[0].isEdit && subItem[1].options[0].name !== subItem[1].options[0].defaultName
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
      init () {
        const indexData = this.$store.getters.indexData
        const urlInfo = this.$store.getters.urlInfo
        this.downloadUrl = `${process.env.BASE_API}/sale/exportExcel.do?ent_id=${indexData.entAcctVO.id}&qyid=${urlInfo.qyid}&year_period=${urlInfo.ssyf}&nsrmc=${indexData.nsrmc}`
        const changeTime = indexData.entAcctVO.year_period
        if (changeTime) {
          if (parseInt(changeTime) > parseInt(urlInfo.ssyf)) {
            this.changeTaxType = true
            this.btnType = null
            this.more = null
          }
        }
        this.getSaleList()
      },
      getSaleList () {
        // this.list = []
        Loading.service(localParams)
        this.querySaleList().then(resp => {
          Loading.service().close()
        }, err => {
          Loading.service().close()
          // this.hasImport = 'import'
        })
      },
      querySaleList () {
        this.list = []
        return new Promise((resolve, reject) => {
          getSaleList({
            cust_nameOrInv_no: this.inputVal,
            inv_no: this.filterForm.inv_no,
            bill_date_start: this.filterForm.bill_date_start,
            bill_date_end: this.filterForm.bill_date_end,
            min_amount: this.filterForm.min_amount,
            max_amount: this.filterForm.max_amount,
            pageQueryVO: {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              orderName: this.sortData.prop,
              order: this.sortData.order // 排序方式，二选一： ASC：升序 DESC：降序
            },
            vm_state: this.vmState
          }).then(resp => {
            const respData = resp.data
            if (respData) {
              this.floatTitle = deepCopy(floatTitle)
              this.hasImport = respData.billCount.billNumInDB  > 0 ? 'list' : 'import'
              this.totalRecord = respData.page.totalRecord
              this.totalPage = respData.page.totalPage
              Object.keys(this.amountDataOld).forEach(item => {
                const itemVal = respData.billCount[item]
                if (item === 'billNum') {
                  this.amountDataOld[item] = itemVal
                } else {
                  this.amountDataOld[item] = itemVal ? toMoney(itemVal) : 0
                }
              })
              Object.keys(this.floatAmount).forEach(item => {
                const itemVal = respData.billCount[item]
                this.floatAmount[item] = itemVal
                if (this.floatAmount.ppBillNum === 0 && item === 'zpBillNum' && itemVal !== 0) {
                  this.floatTitle[item].labels = '其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;中：'
                }
              })
              this.amountData = deepCopy(this.amountDataOld)
              this.oldList = this.dealWithList(respData.dataList)
              this.list = deepCopy(this.oldList)
              return resolve(respData)
            }
          }, error => {
            return reject(error)
          })
        })
      },
      dealWithList (resp) {
        const list = deepCopy(resp)
        list.forEach((item, index) => {
          item.amountStr = toMoney(item.amount)
          item.acct_10 = item.acct_10_code ? `${item.acct_10_code} ${item.acct_10_name}` : ''
          item.acct_20 = []
          item.acctCodeNameList = []
          item.goodNames = []
          item.index = index
          item.billDate = item.bill_date ? crtTimeFtt('yyyy-MM-dd', item.bill_date) : ''  // yyyy-MM-dd
          if (item.detailList && item.detailList.length > 0) {
            const detailList = item.detailList
            let assistComplete = true
            for (const dItem of detailList)  {
              if (dItem.acct_20_name) {
                if (item.acct_20.length < 5) {
                  item.acct_20.push(`${dItem.acct_20_code} ${dItem.acct_20_name}`)
                } else if (item.acct_20.length === 5) {
                  item.acct_20.push('...')
                }
              }
              if (dItem.acctCodeName) {
                if (item.acctCodeNameList.length < 5) {
                  item.acctCodeNameList.push(dItem.acctCodeName)
                } else if (item.acctCodeNameList.length === 5) {
                  item.acctCodeNameList.push('...')
                }
              }
              if (dItem.goods_name) {
                if (item.goodNames.length < 5) {
                  item.goodNames.push(dItem.goods_name)
                } else if (item.goodNames.length === 5) {
                  item.goodNames.push('...')
                }
              }
              if (dItem.complete === false) {
                assistComplete = dItem.complete
              }
            }
            item.assistComplete = assistComplete
            // item.complete = item.complete !== false
          }
        })
        return list
      },
      // 排序
      sortChange (e) {
        this.sortData.prop = e.prop ? ordersNames[e.prop] : ''
        this.sortData.order = e.order ? orders[e.order] : ''
        this.getSaleList()
      },
      // 筛选
      getFilterList (inputVal, vmState) {
        this.currentPage = 1
        this.inputVal = inputVal || ''
        this.vmState = vmState
        this.getSaleList(this.inputVal)
      },
      // 删除清单
      deleteInvoice (idArray) {
        Loading.service(localParams)
        deleteSaleInvoice({
          billIdArray: idArray  // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.currentPage = 1
          this.querySaleList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          Loading.service().close()
        })
      },
      handleSelectionChange (list, amount) {
        if (list && list.length > 0) {
          this.amountData = amount
          this.amountData.billNum = list.length
        } else {
          this.amountData = deepCopy(this.amountDataOld)
        }
        this.multipleSelection = list
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
      // 双击编辑数据
      dblClickRow (row) {
        Loading.service(localParams)
        this.querySalesDetail(row).then(resp => {
          Loading.service().close()
        }, error => {
          Loading.service().close()
        })
      },
      querySalesDetail  (row, types) {
        this.billId = row.id
        return new Promise((resolve, reject) => {
          editBills({
            bill_id: row.id
          }).then(resp => {
            if (types) {
              this.updatePage++
            }
            this.dialogModal.modal = true
            // 结算方式
            this.settleMethod = resp.data.smInfoList
            // 主档详情
            const mainDetail = resp.data.sale
            const type = (this.checkoutFlag || row.isMerge || String(mainDetail.vm_state) === '2' || this.changeTaxType) ? 'detail' : 'edit'
            this.dialogModal.type = type
            this.typeDesc[type][1] = `销售${row.bill_type_name}  ${type === 'edit' ? '编辑' : '查看'}`
            mainDetail.bill_type_name = row.bill_type_name
            mainDetail.isMerge = row.isMerge
            mainDetail.billDate = mainDetail.billDate = crtTimeFtt('yyyy-MM-dd', mainDetail.bill_date)
            mainDetail.acct = mainDetail.acct_10_code ? `${mainDetail.acct_10_code} ${mainDetail.acct_10_name}` : ''
            mainDetail.acct_ci_name = mainDetail.acct_10_ci_name || ''
            mainDetail.ex_tax_amount = toMoney(mainDetail.ex_tax_amount)
            mainDetail.tax_amount = toMoney(mainDetail.tax_amount)
            mainDetail.amount = toMoney(mainDetail.amount)
            mainDetail.updatePage = this.updatePage
            // 从档详情
            const detailList = resp.data.invoiceDetailInfoList
            const {accountSetupType} = resp.data.voucherRule
            for (const item of detailList) {
              item.acct = item.acct_20_code ? `${item.acct_20_code} ${item.acct_20_name}` : ''
              item.acct_ci_name = item.acct_20_ci_name || ''
              item.tax_rate = `${item.tax_rate * 100}%`
              item.unitPrice = item.unit_price === null ? null : toMoney(item.unit_price)
              item.exTaxAmount = toMoney(item.ex_tax_amount)
              item.taxAmount = toMoney(item.tax_amount)
              item.amountStr = toMoney(item.amount)
              item.showIcon = false
              item.isEdit =  false
              if (item.acct) {
                item.acct = isFuzhuSub(item.acct)
              }
              item.newSubVal = accountSetupType === '1' && item.specification ? `${item.goods_name}（${item.specification}）` : item.goods_name

            }
            this.mainDetail = deepCopy(mainDetail)
            this.detailList = deepCopy(detailList)
            this.billDetait = {mainDetail, detailList}
            return resolve(resp.data)
          }, error => {
            return reject(error)
          })
        })
      },
      // 保存前做判断
      operationBefore (type) {
        Loading.service(localParams)
        const {mainDetail, detailList, billDetait} = this
        const billEdit = this.$refs.billEdit
        let isEmpty = ''
        if (!mainDetail.sm_name) {
          isEmpty = '结算方式不能为空！'
        }
        if (!isEmpty && !mainDetail.acct) {
          isEmpty = '借方科目不能为空！'
        }
        if (!isEmpty) {
          const pageSize = billEdit.pageSize
          const length = detailList.length
          for (let i = 0; i < length; i++) {
            const item = detailList[i]
            if (!item.acct) {
              isEmpty = `第${Math.ceil((i + 1) / pageSize)}页第${(i + 1) % pageSize}行明细条目的贷方科目不能为空！`
              break
            }
          }
        }
        if (isEmpty) {
          Loading.service().close()
          return Message({
            message: `${isEmpty}`,
            type: 'warning',
            duration: duration
          })
        }
        const editList = billEdit.editList
        let isEdit = false
        // 检测是否修改

        if (editList.length ||
          mainDetail.sm_id !== billDetait.mainDetail.sm_id ||
          mainDetail.acct !== billDetait.mainDetail.acct ||
          mainDetail.acct_ci_name !== billDetait.mainDetail.acct_ci_name) {
          isEdit = true
        }
        if (type === 'save' && !isEdit) {
          Loading.service().close()
          return Message({
            message: '当前没做任何修改!',
            type: 'warning',
            duration: duration
          })
        }
        const viceList = []
        if (editList.length) {
          for (const item of editList) {
            viceList.push({
              index_no: item.index_no,
              acct_20_code: item.acct_code,
              acct_20_name: item.acct_name,
              acct_20_ci_name: item.acct_ci_name
            })
          }
        }
        const acct = mainDetail.acct.split(' ')
        const params = {
          bill_id: mainDetail.id, // 单据id
          generatePZ: type === 'voucher' ? 1 : 0, // 是否生成凭证：0：仅仅保存1：保存并且生成凭证
          sm_id: mainDetail.sm_id, // 结算方式id
          acct_10_code: acct[0], // 贷方科目代码
          acct_10_name: acct[1], // 贷方科目名称
          acct_10_ci_name: mainDetail.acct_ci_name, // 贷方科目辅助核算项
          detailList: viceList
        }
        this.saveSaleInvoiceAndGeneratePz(params, type)
      },
      // 保存数据
      saveSaleInvoiceAndGeneratePz (params, type) {
        saveSaleInvoiceAndGeneratePz(params).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.querySaleList().then(resp => {
            let row = ''
            if (type === 'voucher') {
              let i = 0
              const list = this.list
              list.forEach((v, idx) => {
                if (v.id === params.bill_id) {
                  i = idx
                  row = list[i]
                }
              })
              // if (i < list.length) {
              //   row = list[i + 1]
              // }
            }
            if (row) {
              this.querySalesDetail(row, 'createVoucher').then(resp => {
                Loading.service().close()
              }, error => {
                this.dialogModal.modal = false
                Loading.service().close()
              })
            } else {
              this.dialogModal.modal = false
              Loading.service().close()
            }
          }, error => {
            this.dialogModal.modal = false
            Loading.service().close()
          })
        }, error => {
          this.querySaleList().then(resp => {
            Loading.service().close()
          }, err => {
            this.querySaleList().then(resp => {
              Loading.service().close()
            }, err => {
              Loading.service().close()
            })
          })
        })
      },
      // 页码设
      handlePage (val, type) {
        if (type === 'pageSize') {
          this.pageSize = val
          this.currentPage = 1
        } else {
          this.currentPage = val
        }
        this.getSaleList()
      },
      // 生成凭证
      createVoucher (idArray) {
        Loading.service(localParams)
        createVoucher({
          billIdArray: idArray
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.querySaleList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, err => {
          this.querySaleList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        })
      },
      // 删除凭证
      deleteVoucher (vchIdArray, type) {
        Loading.service(localParams)
        delVoucher({
          vch_id_list_array: vchIdArray
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          if (type) {
            this.querySalesDetail(this.mainDetail, 'deleteVoucher').then(resp => {
              Loading.service().close()
            }, error => {
              Loading.service().close()
            })
            this.querySaleList()
          } else {
            this.dialogModal.modal = false
            this.querySaleList().then(resp => {
              Loading.service().close()
            }, error => {
              Loading.service().close()
            })
          }
        }, err => {
          Loading.service().close()
        })
      },
      // 添加备注
      save_Remark (arg) {
        const params = {
          billIdArray: arg.id,
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
      // 查看凭证
      toCheckVoucher (voucherId) {
        this.voucher.modal = true
        this.voucher.curListIdx = null
        this.voucher.vch_id = voucherId
        this.voucher.list = dealListForVoucher(this.list)
      },
      // 查看图片
      toImg (row) {
        this.imgInfo = row
        this.dialogModal.type = 'img'
        this.dialogModal.modal = true
      },
      // 理票
      batchSetup () {
        if (this.changeTaxType) return
        Loading.service(localParams)
        downloadSaleInvoice().then(resp => {
          Loading.service().close()
          this.handleReorganizeBillData(resp)
        }, err => {
          Loading.service().close()
        })
      },
      handleReorganizeBillData (resp) {
        this.dialogModal.modal = true
        this.dialogModal.type = 'setup'
        this.setupData = deepCopy(setupData)
        const {invoiceInfoList, smInfoList, totalAmount, negativeAmount} = resp.data
        const {service} = this.setupData
        for (const item of smInfoList) {
          service.settleMethod[item.item_id] = item.item_name
        }
        const length  = invoiceInfoList.length
        for (let i = 0; i < length; i++) {
          invoiceInfoList[i].key = i
          invoiceInfoList[i].amountStr = toMoney(invoiceInfoList[i].amount)
        }
        service.allList = deepCopy(invoiceInfoList)
        service.list = invoiceInfoList
        service.listNum = service.allList.length
        service.amount = toMoney(totalAmount)
        service.negativeAmount = toMoney(negativeAmount)
      },
      // 理票下一步
      toNext (type) {
        const {service: {allList}, subModal} = this.setupData
        Loading.service(localParams)
        querySaleAcctList({
          invoiceInfoList: allList
        }).then(resp => {
          this.setupData.step = 'two'
          subModal.tabStep = 'one'
          // 判断是否要对页面进行初始化
          if (type) {
            subModal.isFresh++
          }
          const {contactAll, incomeAll, incomeCode, contactCode, voucherRule: {accountSetupType}} = resp.data
          this.tabPaneType = accountSetupType === '1' ? this.tabPaneSpec : this.tabPane
          subModal.incomeCode = this.dealWithCodeList(incomeCode)
          subModal.contactCode = this.dealWithCodeList(contactCode)
          const acct10Info  = this.dealWithAcctList(contactAll, '10')
          const acct20Info  = this.dealWithAcctList(incomeAll, '20', accountSetupType)
          Loading.service().close()
          this.dealWithAcct(acct10Info, 'one')
          this.dealWithAcct(acct20Info, 'two')
        }, err => {
          Loading.service().close()
        })
      },
      dealWithCodeList (list) {
        const codeList = []
        let acc_ci_name = {}
        for (const item of list) {
          if (item._AssistId === null || item._AssistCode === null ) {
            acc_ci_name = ''
          } else {
            acc_ci_name = JSON.stringify({[item._AssistId] : item._AssistCode})
          }
          codeList.push({
            account: item._Code + ' ' + item._Name,
            tip: item._Code + ' ' + item._ParentName,
            edit: item._Edit,
            acct_ci_name: acc_ci_name
          })
        }
        return codeList
      },
      closeModel () {
        this.dialogModal.modal = false
        this.dialogModal.type = ''
        this.setupData = deepCopy(setupData)
      },
      dealWithAcct (acctInfo, step) {
        const subModal = this.setupData.subModal
        subModal[step].noList = acctInfo.noList
        subModal[step].allList = acctInfo.allList
        subModal[step].noMatchList = acctInfo.noMatchList
        subModal[step].radio = acctInfo.noMatchList.length ? 'noMatch' : acctInfo.noList.length ? 'no' : 'all'
        subModal[step].list = acctInfo.noMatchList.length ? acctInfo.noMatchList : acctInfo.noList.length ? acctInfo.noList : acctInfo.allList
        subModal[step].noNum = acctInfo.noList.length
        subModal[step].noMatchNum = acctInfo.noMatchList.length
        subModal[step].allNum = acctInfo.allList.length
      },
      // 理票上一步
      onUp () {
        this.setupData.step = 'one'
      },
      dealWithAcctList (list, code, accountSetupType) {
        const acctCode = code === '10' ? 'acct_10_code' : 'acct_20_code'
        const acctName = code === '10' ? 'acct_10_name' : 'acct_20_name'
        const name =  code === '10' ? 'cust_name' : 'good_name'
        const acctCi =  code === '10' ? 'acct_10_ci_name' : 'acct_20_ci_name'
        const noList = []
        const noMatchList = []
        const allList = []
        for (const item of list) {
          const curItem = {
            name: item[name],
            initVal: item[name],
            acct_ci_name: item[acctCi],
            isEdit: false,
            showIcon: false,
            specification: item.specification || '',
            newSubVal: item[name]
          }
          if (accountSetupType && accountSetupType === '1' && item.specification) {
            curItem.newSubVal = `${item[name]}（${item.specification}）`
            curItem.initVal = `${item[name]}（${item.specification}）`
          }
          if (item[acctCode]) {
            // const acct = `${item[acctCode]} ${item[acctName]}`
            curItem.acct = `${item[acctCode]} ${item[acctName]}`
            // curItem.acct = isFuzhuSub(acct)
            if (String(item.match_mark) === '1') {
              noList.push(curItem)
            }
          } else {
            curItem.acct = ''
            noMatchList.push(curItem)
          }
          allList.push(curItem)
        }
        return {noList, allList, noMatchList}
      },
      // 保存理票数据
      saveSubSetup () {
        Loading.service(localParams)
        const {service: {allList}, subModal} = this.setupData
        const contactList = []
        const contactEditlist = subModal.one.allList
        for (const item of contactEditlist) {
          let acct_code = ''
          let acct_name = ''
          if (item.acct) {
            const idx = item.acct.indexOf(' ')
            acct_code = item.acct.slice(0, idx)
            acct_name = item.acct.slice(idx + 1)
          }
          contactList.push({
            cust_name: item.name,
            acct_10_code: acct_code,
            acct_10_name: acct_name,
            acct_10_ci_name: item.acct_ci_name
          })
        }
        const incomeList = []
        const incomeEditList =  subModal.two.allList
        for (const item of incomeEditList) {
          let acct_code = ''
          let acct_name = ''
          if (item.acct) {
            const idx = item.acct.indexOf(' ')
            acct_code = item.acct.slice(0, idx)
            acct_name = item.acct.slice(idx + 1)
          }
          incomeList.push({
            good_name: item.name,
            acct_20_code: acct_code,
            acct_20_name: acct_name,
            acct_20_ci_name: item.acct_ci_name,
            specification: item.specification
          })
        }
        saveAcct({
          invoiceInfoList: allList,
          contactList: contactList,
          incomeList: incomeList
        }).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.dialogModal.modal = false
          this.dialogModal.type = ''
          this.setupData = deepCopy(setupData)
          this.getSaleList()
        }, err => {
          Loading.service().close()
        })
      },
      handleImport () {
        this.formModal.fileInfo = {}
        this.dialogModal.modal = true
        this.dialogModal.type = 'import'
      },
      sureImport () {
        const {fileInfo} = this.formModal
        if (!fileInfo.name) {
          return Message({
            message: '请选择需要导入的模板文件！',
            type: 'warning',
            duration: duration
          })
        }
        if (!(/\.(xls|XLS|xlsx|XLSX)$/.test(fileInfo.name))) {
          return Message({
            message: '当前系统仅支持Excel格式（xls  xlsx），请检查后重新导入！',
            type: 'warning',
            duration: duration
          })
        }
        if (fileInfo.size > 1024 * 1024 * 3) {
          return Message({
            message: '导入文件大于3M，不支持导入！',
            type: 'warning',
            duration: duration
          })
        }
        Loading.service(localParams)
        const indexData = this.$store.getters.indexData
        const urlInfo = this.$store.getters.urlInfo
        const formData = new FormData()
        formData.append('ent_id', indexData.entAcctVO.id)
        formData.append('qyid', urlInfo.qyid)
        formData.append('year_period', String(urlInfo.ssyf))
        formData.append('importExcel', fileInfo)
        const self = this
        self.$http.post(`${process.env.BASE_API}/sale/importExcel.do`, formData).then(resp => {
          Loading.service().close()
          const data = resp.data
          if (data && data.code === '0') {
            Message({
              message: data.message,
              type: 'success',
              duration: duration
            })
            this.handleReorganizeBillData(resp.data)
          } else {
            Message({
              message: data.message,
              type: 'error',
              duration: duration
            })
          }
        }, err => {
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
          queryVoucherRule({module: 'sale'}).then(resp => {
            const {firstMergeRule, ywSummaryRule, jsSummaryRule, voucherDateRule} = resp.data
            this.settingData = deepCopy(settingData)
            const {createType, summary, createDate} = this.settingData
            createType.subItem[0].type = firstMergeRule
            const createIdx = createType.subItem[0].options.findIndex(item => item.val === firstMergeRule)
            if (createIdx > -1) {
              createType.subItem[0].options[createIdx].showTip = true
            }
            summary.subItem[0].options[0].name = jsSummaryRule.sm_id
            summary.subItem[0].options[0].defaultName = deepCopy(jsSummaryRule.sm_id)
            summary.subItem[1].options[0].name = ywSummaryRule.transType
            summary.subItem[1].options[0].defaultName = deepCopy(ywSummaryRule.transType)
            createDate.voucherDateRule = voucherDateRule
            summary.subItem[0].summaryType = summary.subItem[0].summaryType.concat(this.dealWithVoucherData(summary.subItem[0].options, jsSummaryRule))
            summary.subItem[1].summaryType = summary.subItem[1].summaryType.concat(this.dealWithVoucherData(summary.subItem[1].options, ywSummaryRule))
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
        const {createType: {subItem}, summary, createDate: {voucherDateRule}} = this.settingData
        let isEdit = summary.subItem[0].options[0].isEdit && summary.subItem[0].options[0].name !== summary.subItem[0].options[0].defaultName
        if (!isEdit) {
          isEdit = summary.subItem[1].options[0].isEdit && summary.subItem[1].options[0].name !== summary.subItem[1].options[0].defaultName
        }
        if (isEdit) {
          Loading.service().close()
          return Message({
            message: '凭证摘要编辑后未进行保存，请先保存您所编辑的凭证摘要！',
            type: 'warning',
            duration: duration
          })
        }
        const accountData = summary.subItem[0].summaryType
        const serviceData = summary.subItem[1].summaryType
        const serviceSummary = {
          transType: summary.subItem[1].options[0].name,
          goodServiceName: serviceData.indexOf('goodServiceName') > -1 ? '1' : '0',
          specification: serviceData.indexOf('specification') > -1 ? '1' : '0',
          qtyAndunit: serviceData.indexOf('qtyAndunit') > -1 ? '1' : '0',
          unitPrice: serviceData.indexOf('unitPrice') > -1 ? '1' : '0'
        }
        const accountSummary = {
          sm_id: summary.subItem[0].options[0].name,
          custName: accountData.indexOf('custName') > -1 ? '1' : '0',
          qdlx: accountData.indexOf('qdlx') > -1 ? '1' : '0',
          fplx: accountData.indexOf('fplx') > -1 ? '1' : '0',
          invNo: accountData.indexOf('invNo') > -1 ? '1' : '0'
        }
        const params = {
          voucher_rule: JSON.stringify({
            firstMergeRule: subItem[0].type,
            voucherDateRule: voucherDateRule,
            ywSummaryRule: serviceSummary,
            jsSummaryRule: accountSummary
          }),
          module: 'sale'
        }
        this.saveVoucherRule(params).then(resp => {
          Loading.service().close()
          this.dialogModal.modal = false
          this.dialogModal.type = ''
        }, err => {
          Loading.service().close()
        })
      },
      saveVoucherRule (params) {
        return new Promise((resolve, reject) => {
          updateVoucherRule(params).then(resp => {
            Message({
              message: resp.message,
              type: 'success',
              duration: duration
            })
            resolve(resp)
          }, err => {
            reject(err)
          })
        })
      },
      deleteInventory (inventoryArray) {
        Loading.service(localParams)
        deleteInventoryBill({
          inventoryInfo: inventoryArray
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.currentPage = 1
          this.querySaleList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          Loading.service().close()
        })
      },
      saveSetupSub (params) {
        Loading.service(localParams)
        this.saveVoucherRule(params).then(resp => {
          this.setupModal.modal = false
          this.toNext(true)
        }, err => {
          Loading.service(localParams)
        })
      }
    },
    components: {
      HeaderOperate,
      KindTable,
      ReorganizeBill,
      FooterPagination,
      CheckVoucher,
      KeepAccounts,
      billEdit,
      DetailFooter,
      EditFooter,
      AmountCount,
      FooterAmount,
      HelpModal,
      importForm,
      SettingVoucher,
      AddRemark,
      InventoryBill
    }
  }

</script>
