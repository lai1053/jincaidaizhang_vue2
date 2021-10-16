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
  .setting-dialog{
    .el-dialog__title{
      height: 21px;
      display: inline-block;
    }
  }
</style>
<style lang="scss" scoped>
  .inv-detail-btn{
    float: right;
    text-decoration: underline;
    cursor: pointer;
    line-height: 34px;
    margin-right: 20px;
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
  .footer-float-data{
    list-style: none;
    padding: 0;
    margin: 0;
    line-height: 24px;

  }
  .setting-voucher-container{
    position: relative;
    .nav{
      position: absolute;
      line-height: 24px;
      font-size: 18px;
      color: #303133;
      top: -52px;
      left: -25px;
      span{
        display: inline-block;
        padding: 8px 15px;
        cursor: pointer;
        &:hover{
          color: #1ab394;
        }
        &.tab-active{
          border-top: 2px solid #1ab394;
          color: #1ab394;
        }
      }

    }
  }

</style>

<template>
  <div class="purchase-page">
    <!--列表页面-->
    <div v-if="hasImport==='list'" class="purchase">
      <!--头部操作-->
      <header-operate
        inputTip="请输入发票号码或往来单位"
        main-menu="purchase"
        :more="more"
        :btn-type="btnType"
        :form-content="formContent"
        :filter-form="filterForm"
        :filter-form-old="filterFormOld"
        :multiple-selection="multipleSelection"
        :proofState="true"
        :change-tax-type="changeTaxType"
        @on-filter="getFilterList"
        @on-create-voucher="createVoucher"
        @on-delete-voucher="deleteVoucher(0, $event)"
        @on-delete="deleteInvoice"
        @on-transform="unCertifiedTransform"
        @batch-setup="batchSetup"
        @query-invoice="queryInvoice"
        @on-setting-voucher="settingVoucher"
        @on-save-Remark="save_Remark"
        @on-delete-remarks="delete_Remark"
        @on-delete-inventory="deleteInventory"
      >
        <template slot="filterItem">
          <el-form-item label="发票类型">
            <el-select
              v-model="formContent.billTypeId"
              size="small"
              filterable
              allow-create>
              <el-option
                v-for="name in billTypes"
                :key="name"
                :label="name"
                :value="name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开票日期">
            <el-col :span="11">
              <el-date-picker
                v-model="formContent.startDate"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                @change="getDateBefore('startDate')"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="formContent.endDate"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                @change="getDateBefore('endDate')"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="价税合计">
            <el-col :span="11">
              <el-input
                v-model="formContent.startAmount"
                placeholder="0.00"
                @input="handleInput($event,'formContent','startAmount')"
                @change="getAmountBefore('startAmount')"
                size="small"
              ></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input
                v-model="formContent.endAmount"
                placeholder="0.00"
                @input="handleInput($event,'formContent','endAmount')"
                @change="getAmountBefore('endAmount')"
                size="small"
              ></el-input>
            </el-col>
          </el-form-item>
        </template>
      </header-operate>
      <!--table-->
      <kind-table
        :loading="loading"
        :columns="columns"
        :list="list"
        :bookkeeping="bookkeeping"
        :change-tax-type="changeTaxType"
        :inventory="inventory"
        main-menu="purchase"
        @sort-change="sortChange"
        @row-dblclick="dblClickRow"
        @on-check-voucher="toCheckVoucher"
        @on-delete-voucher="deleteVoucher(0, $event)"
        @on-delete="deleteInvoice"
        @on-selection-change="handleSelectionChange"
        @on-save-Remark="save_Remark"
      ></kind-table>
      <!--底部合计 & 分页-->
      <div class="footer-total-amount">
        <footer-amount
          :amount-data="count"
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
    <!--理票页面-->
    <div class="help-modal-box"  v-if="hasImport==='setup'"><help-modal mainMenu="purchase"></help-modal></div>
    <!--<div v-if="hasImport==='setup'" :class="changeTaxType ? 'page-box common-disable':'page-box purchase-page-box'" @click="batchSetup"></div>-->
    <!--银峰开始-->
    <div v-if="hasImport==='setup'" class="reorganize-box">
      <div  :class="changeTaxType ? 'page-reorganize-box disable-auto-box': 'page-reorganize-box auto-reorganize-bill'" @click="batchSetup"></div>
    </div>
    <!--银峰结束-->
    <div class="guide" v-if="hasImport==='setup'"></div>
    <div style=" float: right; margin-top: 6px">
      <el-button v-if="hasImport==='setup'" size="small" type='primary'  @click="handleImport"  >导入发票</el-button>
    </div >

    <!--弹窗-->
    <el-dialog
      v-if="dialogModal.modal"
      :close-on-click-modal="false"
      :width="typeDesc[dialogModal.type][0]"
      :visible.sync="dialogModal.modal"
      :title="typeDesc[dialogModal.type][1]"
      top="0"
      @close="closedDialog"
      :before-close="handleDialogClose"
      :class="dialogModal.type==='setting' ? 'setting-dialog' : ''"
      class="fund-dialog vertical-center-modal">
      <template>
        <!--理票模块-->
        <reorganize-bill
          v-if="dialogModal.type==='setup'"
          main-menu="purchase"
          ref="reorganizeBill"
          :setup-data="setupData"
          :service-columns="serviceColumns"
          :business-columns="businessColumns"
          :tab-pane="tabPaneType"
          :setup-modal="setupModal"
          :batch-setup-tab-pane="batchSetupTabPane"
          @batch-setup-account="onBatchSetupAccount"
          @on-change-account="onChangeAccount"
          @on-save-setup-sub="saveSetupSub"
        ></reorganize-bill>
        <!--双击查看清单详情-->
        <bill-edit
          v-if="dialogModal.type==='detail'||dialogModal.type==='edit'"
          ref="billEdit"
          main-menu="purchase"
          :dialog-modal="dialogModal"
          :list="list"
          :main-detail="mainDetail"
          :main-title="mainTitle"
          :settle-method="settleMethod"
          :columns="billColumns"
          :table-data="detailList"
          @on-up-next="dblClickRow"></bill-edit>
        <!--待认证转进项-->
        <div v-if="dialogModal.type==='income'" class="incom-box">
          <span style="margin-right: 8px;">待认证转进项税额</span>
          <span v-if="income.vm_state=== 2">{{income.total_certify_tax_amount}}</span>
          <el-input
            v-if="income.vm_state!==2"
            v-model="income.total_certify_tax_amount"
            size="small"
            class="input-box"
            @input="handleInput($event, 'income', 'total_certify_tax_amount')"
            placeholder="请输入税额"></el-input>
          <i class="inv-detail-btn text-color" @click="viewInvDetail">发票详情</i>
        </div>
        <!--查票-->
        <query-invoice
          ref="queryForm"
          v-if="dialogModal.type ==='query'"
          :query-invoice-detail="queryInvoiceDetail"
        ></query-invoice>
        <!--导入发票-->
        <import-form
          v-if="dialogModal.type==='import'"
          :form-modal="formModal"
          :downloadUrl="downloadUrl"
          :changeTaxType="changeTaxType"
        ></import-form>
        <!--凭证习惯设置-->
        <div v-if="dialogModal.type==='setting'" class="setting-voucher-container">
          <div v-if="taxType=== '2'" class="nav">
            <span :class="taxFinance===true ? 'tab-active' : ''" @click="taxFinance = true">凭证习惯设置</span>
            <span :class="taxFinance===false ? 'tab-active' : ''" @click="taxFinance = false">账务处理方式</span>
          </div>
          <setting-voucher
            :setting-data="settingData"
            :taxFinance="taxFinance"
          ></setting-voucher>
        </div>
        <!--进项票详情-->
        <common-table
          v-if="dialogModal.type==='check'"
          :columns="certifiedTaxColumns"
          :list="certifiedTaxList"
        ></common-table>
      </template>
      <template slot="footer">
        <!--理票 选票-->
        <template v-if="dialogModal.type==='setup'&&setupData.step==='zero'">
          <div class="footer-amount">
            <div class="amount-box"><span style="font-size: 14px;font-weight: bold; color:#666666;"> 合计:&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
            <el-tooltip
              class="item"
              effect="dark"
              :disabled="!setupData.business.listNum"
              :content="filterTip"
              placement="top-start">
              <div slot="content">
                <ul class="footer-float-data" >
                  <li v-for="(item,index) of kind"><span>{{item.date}}&nbsp;{{item.count}}张</span></li>
                </ul>
              </div>
              <div class="amount-box">

                发票：<span class="text-color" >{{setupData.business.listNum}}</span>张&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </el-tooltip>
            <div class="amount-box">金额：
              <span v-if="setupData.business.hjje==='0'&&setupData.business.negativeSum==='0'">0</span>
              <span class="text-color" v-if="setupData.business.hjje!== '0'">{{setupData.business.hjje}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span class="text-color" v-if="setupData.business.negativeSum!=='0'">{{setupData.business.negativeSum}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div class="amount-box">
              税额：
              <span class="text-color" v-if="setupData.business.hjse==='0' && setupData.business.hgseB==='0'">0</span>
              <span class="text-color" v-if="setupData.business.hjse!=='0'">{{setupData.business.hjse}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span v-if="setupData.business.hgseB!=='0'" class="text-color">{{setupData.business.hgseB}}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div class="amount-box">
              <span style="color: #FFA854;">温馨提示：</span>请将需入账的发票放入【已选票】列表。
            </div>
          </div>

          <!--v-if="setupData.service.allList.length"-->
          <el-button
            v-if="setupData.business.oldAccountList.length"
            size="small" type="primary"
            @click="toSettle">下一步</el-button>
          <el-button
            v-if="!setupData.business.oldAccountList.length && !setupData.business.oldNotAccountList.length"
            size="small"
            type="primary"
            @click="dialogModal.modal=false ">关闭</el-button>
          <!--第一步-->
          <el-button
            v-if="!setupData.business.oldAccountList.length && setupData.business.oldNotAccountList.length"
            type="primary"
            size="small"
            @click="savePendingData"
          >保存</el-button>
        </template>
        <!--理票 结算确认-->
        <template v-if="dialogModal.type==='setup'&&setupData.step==='one'">
          <div class="footer-amount">
            <div class="amount-box"><span style="font-size: 14px;font-weight: bold; color:#666666;"> 合计&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
            <div class="amount-box">
                发票：<span class="text-color" >{{setupData.service.listNum}}</span>张&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            <div class="amount-box">价税合计：
              <span class="text-color">{{setupData.service.amount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span v-if="setupData.service.negativeAmount!==0" class="text-color">{{setupData.service.negativeAmount}}</span>
            </div>
          </div>
          <!--v-if="setupData.service.allList.length"-->
          <el-button
            size="small"
            class="button-com x "
            @click="onUp('zero')">上一步</el-button>
          <el-button
            size="small" type="primary"
            @click="toSubject">下一步</el-button>
        </template>
        <!--理票 科目确认-->
        <template v-if="dialogModal.type==='setup'&&setupData.step==='two'">
          <!--<div class="footer-tip"><span>温馨提示：</span>历史期间有发生但本期间无发生业务的'{{setupData.subModal.tabStep==='one'?'往来单位':'存货'}}'，不在本会计期间显示</div>-->
          <el-button size="small" class="button-com" @click="onUp('one')">上一步</el-button>
          <!--最后一步保存按钮-->
          <el-button size="small" style="margin-left: 15px" type='primary' @click="saveSubSetup">保存</el-button>
        </template>
        <!--查票-->
        <template v-if="dialogModal.type==='query'">
          <div class="footer-tip"><span>温馨提示：</span>以下发票不可勾选1、已生成凭证的发票；2、开票月份>当前会计期间的发票。</div>
          <el-button size="small" class="button-com" @click="dialogModal.modal=false">取消</el-button>
          <el-button size="small" style="margin-left: 15px" type='primary' @click="handleSaveQueryBill">入账</el-button>
        </template>
        <!--理票 批量业务确认-->
        <template v-if="dialogModal.type==='setup'&&setupData.step==='batchSetupAccount'">
          <!--<div class="footer-tip"><span>温馨提示：</span>历史期间有发生但本期间无发生业务的'{{setupData.subModal.tabStep==='one'?'往来单位':'存货'}}'，不在本会计期间显示</div>-->
          <el-button size="small" class="button-com" @click="cancelBatchSetupAccount">取消</el-button>
          <el-button size="small" style="margin-left: 15px" type='primary' @click="saveBatchSetupAccount">保存</el-button>
        </template>
        <!--双击查看清单详情 底部按钮-->
        <template v-if="dialogModal.type==='detail'||dialogModal.type==='edit'">
          <detail-footer
            v-if="dialogModal.type==='detail'"
            :detail="mainDetail"
            :checkoutFlag="checkoutFlag"
            :change-tax-type="changeTaxType"
            main-menu="purchase"
            @on-check-voucher="toCheckVoucher"
            @on-delete-voucher="deleteVoucher(0, $event, true)">
            <template slot="amountCount">
              <amount-count
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
                :total="detailList.length"
                :sum="mainDetail.ex_tax_amount"
                :tax="mainDetail.tax_amount"
                :amount="mainDetail.amount"
              ></amount-count>
            </template>
          </edit-footer>
        </template>
        <template v-if="dialogModal.type==='income'">
          <template>
            <div class="footer-amount">
              待认证进项税额科目余额：{{income.qcye_je}}
            </div>
            <el-button
              v-if="income.vm_state!==2"
              :type="income.total_certify_tax_amount && String(income.total_certify_tax_amount) !== '0' ? 'primary': 'info'"
              :disabled="!income.total_certify_tax_amount || String(income.total_certify_tax_amount) === '0'"
              size="small"
              style="margin-left: 15px"
              @click="createVoucherIncome">生成凭证</el-button>
          </template>
          <detail-footer
            v-if="income.vm_state===2"
            :detail="income"
            :checkoutFlag="checkoutFlag"
            @on-check-voucher="toCheckVoucher"
            @on-delete-voucher="deleteVoucher(1, $event)">
          </detail-footer>
        </template>
        <!--导入发票-->
        <template v-if="dialogModal.type ==='import'">
          <el-button @click="sureImport" size="small" type="primary">导入</el-button>
        </template>
        <!--凭证习惯设置-->
        <template v-if="dialogModal.type==='setting'">
          <el-button @click="closeSettingModal" size="small" class="button-com">取消</el-button>
          <el-button @click="saveSettingVoucher" size="small" type="primary">确定</el-button>
        </template>
        <!--待认证转进项发票详情-->
        <template v-if="dialogModal.type==='check'">
          <div class="footer-amount" style="float: none;">
            <div class="amount-box"><span style="font-size: 14px;font-weight: bold; color:#666666;"> 合计&nbsp;&nbsp;</span></div>
            <div class="amount-box">
              发票：<span class="text-color" >{{certifiedTaxDetail.invoiceNum}}</span>张&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div class="amount-box">金额：
              <span class="text-color">{{certifiedTaxDetail.exTaxAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div class="amount-box">税额：
              <span class="text-color">{{certifiedTaxDetail.taxAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </template>
      </template>
    </el-dialog>
    <!--凭证查看模块-->
    <check-voucher :voucher="voucher"></check-voucher>
    <!--记账-->
    <keep-accounts
      v-if="bookkeeping.modal"
      :bookkeeping="bookkeeping"
      @on-save="getBillList"
    ></keep-accounts>
    <!--查看存货-->
    <inventory-bill v-if="inventory.modal" :inventory="inventory"></inventory-bill>
  </div>
</template>

<script>
  // 组件
  import HeaderOperate from '@/views/components/HeaderOperate'
  import KindTable from '@/views/components/KindTable/index'
  import ReorganizeBill from '@/views/components/ReorganizeBill/index'
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import CheckVoucher from '@/views/components/CheckVoucher.vue'
  import KeepAccounts from '@/views/components/KeepAccounts/index.vue'
  import BillEdit from '@/views/components/BillEdit/index.vue'
  import DetailFooter from '@/views/components/BillFooter/DetailFooter.vue'
  import EditFooter from '@/views/components/BillFooter/EditFooter.vue'
  import AmountCount from '@/views/components/AmountCount.vue'
  import FooterAmount from '@/views/components/FooterAmount'
  import HelpModal from '@/views/components/Help/index.vue'
  import QueryInvoice from '@/views/purchase/components/QueryInvoice'
  import importForm from '@/views/components/importForm'
  import SettingVoucher from '@/views/components/SettingVoucher/index.vue'
  import CommonTable from '@/views/components/CommonTable/index.vue'
  import InventoryBill from '@/views/components/InventoryBill/index.vue'

  import {Message, Loading, MessageBox} from 'element-ui'

  import {deepCopy} from '@/utils/assist'
  import {checkNum, dealListForVoucher, toMoney} from '@/utils/utils'
  import {crtTimeFtt} from '@/utils/dateFormat'
  import {isFuzhuSub} from '@/utils/eval'

  import {localParams, duration} from '@/views/components/data/common'
  import {fixedData} from '@/views/purchase/data/fixedData'
  import {purData, setupData, setupModal} from '@/views/purchase/data/com'
  import {settingData} from '@/views/purchase/data/voucher'
  import {queryInvoiceDetail} from '@/views/purchase/components/QueryInvoice/data/com'
  // api

  import {
    queryPurchaseList, // 获取清单列表
    downloadPurchaseInvoice, // 采购发票下载
    queryPurchaseAcctList, // 12.4.采购科目确认查询
    queryPurchaseDetail, // 12.6.单张发票编辑查询
    saveInvoiceInfo, // 12.5.保存业务和科目确认
    deleteInvoice, // 删除发票
    deleteVoucher, // 删除凭证
    createVoucher, // 生成凭证
    saveAndGeneratePz, // 单张发票保存（并生成凭证）
    queryToBeCertifiedTax, // 待认证转进项税额查询
    createVoucherIncome,  // 12.11.待认证转进项税额生成凭证
    queryPurchaseSettlement,
    savePendingData,
    saveJxHistoryInvoice,
    queryCertifiedTaxDetail,
    addRemark, // 添加备注
    deleteRemark, // 删除备注
    deleteInventoryBill
  } from '@/api/purchase'
  import {queryVoucherRule, updateVoucherRule} from '@/api/common'

  // 样式
  if (process.env.NODE_ENV === 'testing') {
    require('./styles/index-blue.scss')
  } else {
    require('./styles/index.scss')
  }
  const orderNames = {
    bill_type_name: 'bill_type_for_sort_only',
    amountStr: 'amount',
    vm_state: 'voucher_num',
    cust_name: 'cust_name',
    acct_20: 'acct_20_code',
    acct_10: 'acct_10_code',
    billDate: 'bill_date',
    isPurchase: 'is_purchase',
    isAccount: 'is_account',
    inv_no: 'inv_no'
  }
  const orders = {
    ascending: 'ASC',
    descending: 'DESC'
  }

  export default {
    data () {
      return {
        ...fixedData,
        ...deepCopy(purData), // tranModal
        filterFormOld: deepCopy(purData.filterForm),
        formContent: deepCopy(purData.filterForm),
        floatTitle: deepCopy(purData.floatTitle),
        settingData: deepCopy(settingData),
        queryInvoiceDetail: deepCopy(queryInvoiceDetail),
        setupModal: deepCopy(setupModal),
        checkoutFlag: false,
        hasImport: '',
        inputVal: '', // 头部输入框搜索
        vmState: '0',
        dialogModal: {
          modal: false, // 弹出框控制
          type: 'setup' // 'setUp'理票
        },
        setupData: { // 理票
          ...deepCopy(setupData)
        },
        pendingList: {}, // 理票接口信息
        income: {}, // 待认证转进项
        currentPage: 1,
        pageSize: 50,
        loading: false,
        list: [],
        totalRecord: 0, // 流水总条数
        totalPage: 1, // 流水总页数,
        count: {},    // 底部合计
        amountData: {
          billNum: 0, // 单据总数
          postiveExTaxAmount: 0, // 金额 正
          negativeExTaxAmount: 0, // 金额 负
          positiveTax: 0, // 税额 正
          negativeTax: 0, // 税额 负
          positiveAmount: 0, // 价税合计 正
          negativeAmount: 0 // 价税合计 负
        },
        sortData: { // 排序
          prop: '', // 字段
          order: '' // 升序 降序
        },
        multipleSelection: [], // 多选选项
        billDetait: {}, // 详情 保存一个分原始数据
        mainDetail: {}, // 详情 主表数据
        detailList: [], // 详情 从表列表
        settleMethod: [], // 结算方式列表
        imgInfo: {},
        voucher: {  // 凭证查看
          modal: false,
          curListIdx: null,
          vch_id: '',
          list: []
        },
        bookkeeping: { // 记账
          modal: false,
          iframeSrc: ''
        },
        moveToPending: '',
        updatePage: 0,
        floatAmount: {
          jxBillNum: '', // 进项发票总数
          ppBillNum: '', // 普通发票个数
          zpYrzBillNum: '', // 专票（已认证）个数
          zpWrzBillNum: '', // 专票（未认证）个数
          dkYrzBillNum: '', // 代开专票（已认证）个数
          dkWrzBillNum: '', // 代开专票（未认证）个数
          jdcYrzBillNum: '', // 机动车（已认证）个数
          jdcWrzBillNum: '', // 机动车（未认证）个数
          hgYrzBillNum: '', // 海关（已认证）个数
          tysgYrzBillNum: '', // 统一收购（已认证）个数
          ncpYrzBillNum: '', // 农产品（已认证）个数
          txfYrzBillNum: '', // 通行费（已认证）个数
          txfWrzBillNum: '', // 通行费（未认证）个数
          ppPendingNum: '', // 回收站：普票个数
          zpPendingNum: '', // 回收站：专票个数
          dkPendingNum: '', // 回收站：代开专票个数
          jdcPendingNum: '', // 回收站：机动车个数
          hgPendingNum: '', // 回收站：海关个数
          tysgPendingNum: '', // 回收站：统一收购个数
          ncpPendingNum: '', // 回收站：农产品个数
          txfPendingNum: '', // 回收站：通行费个数
          xgmZpBillNum: '', // 小规模专票
          xgmDkBillNum: '', // 小规模代开专票
          xgmJdcBillNum: '', // 小规模机动车
          xgmTxfBillNum: '' ,// 小规模通行费
        },
        filterTip: '1',
        batchSetupModal: deepCopy(setupData.batchSetupModal),
        formModal: {
          fileInfo: {},
          mold: 'purchase'
        },
        downloadUrl: '',
        changeTaxType: false, // 纳税身份转换，false可编辑，true 不可编辑
        taxType: '', // 小规模企业标识
        isAddRemark: true, // 备注信息
        certifiedTaxId: '',
        certifiedTaxList: [],
        certifiedTaxDetail: {
          exTaxAmount: 0,
          invoiceNum: 0,
          taxAmount: 0
        },
        incomeCode: [],
        contactCode: [],
        dialogVisible: false, // 理票弹出框
        inventory: {
          modal: false,
          iframeSrc: ''
        },
        taxFinance: true, // 凭证习惯切换
        tabPaneType: []
      }
    },
    props: {},
    created () {
      this.init()
      this.getBillList()
    },
    methods: {
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
      // 删除备注信息
      delete_Remark (arg) {
        deleteRemark(arg).then(res => {
          this.$message({
            showClose: true,
            message: '删除备注信息成功',
            duration: 1500,
            type: 'success'
          })
          this.getBillList()
        }, e => {
          console.log(e)
          this.getBillList()
        })
      },
      init () {
        const indexData = this.$store.getters.indexData
        const urlInfo = this.$store.getters.urlInfo
        this.downloadUrl = `${process.env.BASE_API}/purchase/exportExcel.do?ent_id=${indexData.entAcctVO.id}&qyid=${urlInfo.qyid}&year_period=${urlInfo.ssyf}&nsrmc=${indexData.nsrmc}`
        this.checkoutFlag = indexData && indexData.checkoutFlag === 'Y'
        // 小规模企业
        // const incomeInvRule = indexData.businessConfigVO.incomeInvRule
        const {taxType} = urlInfo
        this.taxType = urlInfo.taxType
        if (taxType === '1') {
          const {billTypes} = this
          const typeArray = billTypes.map(item => {
            if (item.indexOf('（') !== -1) {
              item = item.split('（')[0]
            }
            return item
          })
          this.billTypes = Array.from(new Set(typeArray))
          delete this.mainTitle.dkyf
          this.mainTitle.empty = {
            empty: true,
            name: '',
            value: '',
            width: 8
          }
        }
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
          this.getBillList()
        }, err => {
          this.getBillList()
        })
      },
      getBillList () {
        Loading.service(localParams)
        this.queryPurchaseList().then(item => {
          Loading.service().close()
        }, error => {
          Loading.service().close()
        })
      },
      // 请求列表参数
      queryPurchaseList () {
        this.list = []
        const {billTypeId, invoiceNum, startAmount, endAmount, startDate, endDate} = this.filterForm
        return new Promise((resolve, reject) => {
          queryPurchaseList({
            cust_nameOrInv_no: this.inputVal, // 发票号码或往来单位 模糊搜索
            inv_type_name: billTypeId, // 精确匹配
            inv_no: invoiceNum, // 模糊搜索条件：发票号码
            bill_date_start: startDate, // 范围搜索：开票日期起，YYYY-MM-DD
            bill_date_end: endDate, // 范围搜索：开票日期止，YYYY-MM-DD
            min_amount: startAmount, // 范围搜索：价税合计起
            max_amount: endAmount, // 范围搜索：价税合计止
            pageQueryVO: {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              orderName: this.sortData.prop, // 发票类型： 价税合计：amount 凭证字号：vt_num_list 往来单位：cust_name 结算科目：acct_20_code 存货科目：acct_10_code 开票日期：bill_date
              order: this.sortData.order // 排序方式，二选一： ASC：升序 DESC：降序
            },
            vm_state: this.vmState
          }).then(resp => {
            const respData = resp.data
            this.hasImport = respData.billCount.billNumInDB ? 'list' : 'setup'
            if (!respData.billCount.billNumInDB) return resolve(resp.data)
            if (this.taxType === '1') {
              this.floatTitle = deepCopy(purData.xiaoFloatTitle)
            } else {
              this.floatTitle = deepCopy(purData.floatTitle)
            }
            if (respData) {
              Object.keys(this.amountData).forEach(item => {
                const itemVal = respData.billCount[item]
                if (item === 'billNum') {
                  this.amountData[item] = itemVal
                } else {
                  this.amountData[item] = itemVal ? toMoney(itemVal) : 0
                }
              })
              const qizArr = []
              const recycledArr = []
              Object.keys(this.floatAmount).forEach(item => {
                const itemVal = respData.billCount[item]
                this.floatAmount[item] = itemVal
                if (item === 'ppBillNum' || item === 'zpYrzBillNum' || item === 'zpWrzBillNum' || item === 'dkYrzBillNum' || item === 'dkWrzBillNum' || item === 'jdcYrzBillNum' || item === 'jdcWrzBillNum' || item === 'hgYrzBillNum' || item === 'tysgYrzBillNum' || item === 'ncpYrzBillNum' || item === 'txfYrzBillNum' || item === 'txfWrzBillNum' || item === 'xgmZpBillNum' || item === 'xgmDkBillNum' || item === 'xgmJdcBillNum' || item === 'xgmTxfBillNum' ) {
                  if (item && itemVal !== 0) {
                    qizArr.push(item)
                  }
                } else if (item === 'ppPendingNum' || item === 'zpPendingNum' || item === 'dkPendingNum' || item === 'jdcPendingNum'  || item === 'hgPendingNum' || item === 'ncpPendingNum' || item === 'tysgPendingNum' || item === 'ncpPendingNum' || item === 'txfPendingNum') {
                  if (item && itemVal !== 0) {
                    recycledArr.push(item)
                    this.floatTitle[recycledArr[0]].labels = '回&nbsp;&nbsp;收&nbsp;&nbsp;站：'
                  }
                }
              })
              this.floatTitle[qizArr[0]].labels = '其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;中：'
              this.totalRecord = respData.page.totalRecord
              this.totalPage = respData.page.totalPage
              this.count = deepCopy(this.amountData)
              if (respData.dataList && respData.dataList.length) {
                this.list = this.dealWithList(respData.dataList)
              }
            }
            return resolve(resp.data)
          }, error => {
            return reject(error)
          })
        })
      },
      // 处理列表数据
      dealWithList (resp) {
        const list = deepCopy(resp)
        list.forEach((item, index) => {
          item.amountStr = toMoney(item.amount)
          item.billDate = crtTimeFtt('yyyy-MM-dd', item.bill_date)   // yyyy-MM-dd
          item.acct_20 = item.acct_20_code ? `${item.acct_20_code} ${item.acct_20_name}` : ''
          item.acct_10 = []
          item.acctCodeNameList = []
          item.goodNames = []
          item.index = index
          if (item.detailList && item.detailList.length > 0) {
            const detailList = item.detailList
            let assistComplete = true
            for (const dItem of detailList) {
              if (dItem.acct_10_code) {
                if (item.acct_10.length < 5) {
                  item.acct_10.push(`${dItem.acct_10_code} ${dItem.acct_10_name}`)
                } else if (item.acct_10.length === 5) {
                  item.acct_10.push('...')
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
          }
        })
        return list
      },
      // 筛选
      getFilterList (inputVal, vmState) {
        this.currentPage = 1
        this.inputVal = inputVal || ''
        this.vmState = vmState
        this.getBillList()
      },
      // 排序
      sortChange (e) {
        this.sortData.prop = e.prop ? orderNames[e.prop] : ''
        this.sortData.order = e.order ? orders[e.order] : ''
        this.getBillList()
      },
      handlePage (val, type) {
        if (type === 'pageSize') {
          this.pageSize = val
          this.currentPage = 1
        } else {
          this.currentPage = val
        }
        this.getBillList()
      },
      // 双击信息行，已生成凭证的查看详情，未生成凭证的编辑
      dblClickRow (row) {
        Loading.service(localParams)
        this.queryPurchaseDetail(row).then(resp => {
          Loading.service().close()
        }, error => {
          Loading.service().close()
        })
      },
      queryPurchaseDetail (row, types) {
        return new Promise((resolve, reject) => {
          queryPurchaseDetail({
            bill_id: row.id
          }).then(resp => {
            if (types) {
              this.updatePage++
            }
            // 结算方式
            this.settleMethod = resp.data.smInfoList
            // 主档详情
            const mainDetail = resp.data.purchase
            this.dialogModal.modal = true
            const type = (this.checkoutFlag || row.isMerge || String(mainDetail.vm_state) === '2' || this.changeTaxType) ? 'detail' : 'edit'
            this.dialogModal.type = type
            this.typeDesc[type][1] = `${row.bill_type_name}  ${type === 'edit' ? '编辑' : '查看'}`
            mainDetail.bill_type_name = row.bill_type_name
            mainDetail.isMerge = row.isMerge
            mainDetail.billDate = crtTimeFtt('yyyy-MM-dd', mainDetail.bill_date)   // yyyy-MM-dd
            mainDetail.acct = mainDetail.acct_20_code ? `${mainDetail.acct_20_code} ${mainDetail.acct_20_name}` : ''
            mainDetail.acct_ci_name = mainDetail.acct_20_ci_name || ''
            mainDetail.updatePage = this.updatePage

            mainDetail.ex_tax_amount = toMoney(mainDetail.ex_tax_amount)
            mainDetail.tax_amount = toMoney(mainDetail.tax_amount)
            mainDetail.amount = toMoney(mainDetail.amount)
            // 从当详情列表
            const detailList = resp.data.invoiceDetailInfoList
            const {accountSetupType} = resp.data.voucherRule
            for (const item of detailList) {
              item.isEdit =  false
              item.showIcon = false
              item.taxRate = `${item.tax_rate * 100}%`
              item.unitPrice = item.unit_price === null ? null : toMoney(item.unit_price)
              item.exTaxAmount = toMoney(item.ex_tax_amount)
              item.taxAmount = toMoney(item.tax_amount)
              item.amountStr = toMoney(item.amount)
              item.acct = item.acct_10_code ? `${item.acct_10_code} ${item.acct_10_name}` : ''
              item.acct_ci_name = item.acct_10_ci_name || ''
              item.newSubVal = accountSetupType === '1' && item.specification ? `${item.goods_name}（${item.specification}）` : item.goods_name
              if (item.acct) {
                item.acct = isFuzhuSub(item.acct)
              }
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
      operationBefore (type) {
        Loading.service(localParams)
        const {mainDetail, detailList, billDetait} = this
        const billEdit = this.$refs.billEdit
        // 校验必填字段是否为空 & 检测是否修改
        let isEmpty = ''
        if (!mainDetail.sm_name) {
          isEmpty = '结算方式不能为空！'
        }
        if (!isEmpty && !mainDetail.acct) {
          isEmpty = '贷方科目不能为空！'
        }
        if (!isEmpty) {
          const pageSize = billEdit.pageSize
          const length = detailList.length
          for (let i = 0; i < length; i++) {
            const item = detailList[i]
            if (!item.acct) {
              isEmpty = `第${Math.ceil((i + 1) / pageSize)}页第${(i + 1) % pageSize}行明细条目的借方科目不能为空！`
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
        // console.log(editList)
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
              acct_10_code: item.acct_code,
              acct_10_name: item.acct_name,
              acct_10_ci_name: item.acct_ci_name
            })
          }
        }
        const acct = mainDetail.acct.split(' ')
        const params = {
          bill_id: mainDetail.id, // 单据id
          generatePZ: type === 'voucher' ? 1 : 0, // 是否生成凭证：0：仅仅保存1：保存并且生成凭证
          sm_id: mainDetail.sm_id, // 结算方式id
          acct_20_code: acct[0], // 贷方科目代码
          acct_20_name: acct[1], // 贷方科目名称
          acct_20_ci_name: mainDetail.acct_ci_name, // 贷方科目辅助核算项
          detailList: viceList
        }
        this.saveAndGeneratePz(params, type)
      },
      saveAndGeneratePz (params, type) {
        saveAndGeneratePz(params).then(resp => {
          Message({
            message: resp.message || `${type === 'voucher' ? '生成凭证' : '保存'}成功！`,
            type: 'success',
            duration: duration
          })
          this.queryPurchaseList().then(resp => {
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
              this.queryPurchaseDetail(row, 'createVoucher').then(resp => {
                Loading.service().close()
              }, error => {
                this.dialogModal.modal = false
                Loading.service().close()
              })
            } else {
              Loading.service().close()
              this.dialogModal.modal = false
            }
          }, error => {
            this.dialogModal.modal = false
            Loading.service().close()
          })
        }, error => {
          this.queryPurchaseList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        })
      },
      handleSelectionChange (list, amount) {
        if (list && list.length) {
          this.count = amount
          this.count.billNum = list.length
        } else {
          this.count = deepCopy(this.amountData)
        }
        this.multipleSelection = list
      },
      toImg (row) {
        this.imgInfo = row
        this.dialogModal.type = 'img'
        this.dialogModal.modal = true
      },
      // modal 点击凭证字号进入查看凭证(拉取北京)
      toCheckVoucher (voucherId) {
        this.voucher.modal = true
        this.voucher.curListIdx = null
        this.voucher.vch_id = voucherId
        this.voucher.list = dealListForVoucher(this.list)
      },
      // 生成凭证 接口
      createVoucher (billIdArray) {
        Loading.service(localParams)
        createVoucher({
          ids: billIdArray
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.queryPurchaseList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          this.queryPurchaseList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        })
      },
      // 删除凭证
      deleteVoucher (isIncome, vchIdArray, type) {
        Loading.service(localParams)
        deleteVoucher({
          vch_id_list_array: vchIdArray,
          delCertifyTaxVoucher: isIncome // 是否删除待认证转进项税额凭证：0：不是（默认值）1：是
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          if (isIncome === 1) {
            this.dialogModal.modal = false
            Loading.service().close()
            return
          }
          this.multipleSelection = []
          if (type) {
            this.queryPurchaseDetail(this.mainDetail, 'deleteVoucher').then(resp => {
              Loading.service().close()
            }, error => {
              Loading.service().close()
            })
            this.queryPurchaseList()
          } else {
            this.dialogModal.modal = false
            this.queryPurchaseList().then(item => {
              Loading.service().close()
            }, error => {
              Loading.service().close()
            })
          }
        }, error => {
          Loading.service().close()
        })
      },
      // 删除清单
      deleteInvoice (idArray) {
        Loading.service(localParams)
        deleteInvoice({
          ids: idArray  // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.currentPage = 1
          this.queryPurchaseList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          Loading.service().close()
        })
      },
      getDateBefore (type) {
        const formContent = this.formContent
        const {endDate, startDate} = formContent
        if (startDate && endDate && startDate.replace(/-/g, '') > endDate.replace(/-/g, '')) {
          formContent[type] = ''
          return Message({
            message: '所选开票日期的开始日期不能大于所选开票日期截至时间！',
            type: 'warning',
            duration: duration
          })
        }
      },
      getAmountBefore (type) {
        const formContent = this.formContent
        const {endAmount, startAmount} = formContent
        if (endAmount && startAmount && startAmount > endAmount) {
          formContent[type] = ''
          return Message({
            message: '所选价税合计的最小值不能大于所选价税合计的最大值！',
            type: 'warning',
            duration: duration
          })
        }
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
      batchSetup () {
        if (this.changeTaxType) return
        this.setupData = deepCopy(setupData)
        this.batchSetupModal = deepCopy(setupData.batchSetupModal)
        Loading.service(localParams)
        downloadPurchaseInvoice().then(resp => {
          Loading.service().close()
          this.handleReorganizeBillData(resp)
        }, err => {
          Loading.service().close()
        })
      },
      handleReorganizeBillData (resp) {
        this.typeDesc.setup[1] = ''
        this.dialogModal.modal = true
        this.dialogModal.type = 'setup'
        const {totalInvoiceNum, purchaseNumber, accountNumber, invoiceInfoList, pendingList, accountList, accountNotList} = resp.data
        const {business} = this.setupData
        business.purchaseNumber = purchaseNumber
        business.accountNumber = accountNumber
        business.listNum = totalInvoiceNum
        accountList.forEach((item, index) => {
          item.createDate = parseInt(item.kprq.replace(/-/g, ''))
          item.accountFlag = 'account'
          item.amountStr = toMoney(item.amount)
          item.key = index
        })
        const length = accountList.length
        accountNotList.forEach((item, index) => {
          item.createDate = parseInt(item.kprq.replace(/-/g, ''))
          item.amountStr = toMoney(item.amount)
          item.accountFlag = 'notAccount'
          item.key = deepCopy(length) + index
        })
        business.oldNotAccountList = deepCopy(accountNotList)
        business.oldAccountList = deepCopy(accountList)
        business.step = accountList.length || !accountList.length && !accountNotList.length ? 'account' : 'unAccount'
        business.accountList = accountList
        business.accountNotList = accountNotList
        business.invoiceInfoList = deepCopy(invoiceInfoList)
        business.allList = invoiceInfoList
        business.list = business.step === 'account' ? accountList : accountNotList
        this.pendingList = pendingList
        // this.dealWIthBusinessData(accountList, accountNotList)
      },
      dealWIthBusinessData (accountList, accountNotList) {

        const goodsList = this.dealWithBusinessList(accountList, 'good_name')
        const custList = this.dealWithBusinessList(accountNotList, 'cust_name')
        this.dealWithBusiness(custList, 'one')
        this.dealWithBusiness(goodsList, 'two')
      },
      dealWithBusinessList (list, name) {
        const noList = []
        const allList = []
        list.map((item, index) => {
          item.index = index
          item.name = item[name]
          item.type = name
          if (Number(item.isPurchase) === 1) {
            noList.push(item)
          }
          allList.push(item)
        })
        return {noList, allList}
      },
      dealWithBusiness (list, step) {
        const batchSetupModal = this.batchSetupModal
        batchSetupModal[step].noList = list.noList
        batchSetupModal[step].allList = list.allList
        batchSetupModal[step].radio = list.noList.length ? 'no' : 'all'
        batchSetupModal[step].list = list.noList.length ? list.noList : list.allList
        batchSetupModal[step].noNum = list.noList.length
        batchSetupModal[step].allNum = list.allList.length
        this.batchSetupModal = batchSetupModal
      },
      onChangeAccount (type) {
        this.moveToPending = type
      },
      onBatchSetupAccount (type) {
        const {business: {allList}} = this.setupData
        if (allList.length === 0) return
        this.typeDesc[type][1] = '批量业务确认'
        this.setupData.step = 'batchSetupAccount'
        this.batchSetupModal.editCustName = []
        this.batchSetupModal.editGoodsName = []
        this.setupData.batchSetupModal = deepCopy(this.batchSetupModal)
        this.setupData.batchSetupModal.tabStep = 'one'
      },
      cancelBatchSetupAccount () {
        this.typeDesc.setup[1] = ''
        this.setupData.step = 'zero'
      },
      saveBatchSetupAccount () {
        const {batchSetupModal} = this.setupData
        const editCustNameList = batchSetupModal.editCustName
        const editGoodsNameList = batchSetupModal.editGoodsName
        let isEmpty = false
        let isEdit = false
        if (editCustNameList.length === 0 && editGoodsNameList.length === 0) {
          isEmpty = true
        } else if (editCustNameList.length > 0 || editGoodsNameList.length > 0) {
          if (editCustNameList.length > 0) {
            const custList = this.batchSetupModal.one.allList
            editCustNameList.map(item =>  {
              const idx = custList.findIndex(v => v.index === item.index)
              if (idx > -1) {
                if (Number(custList[idx].isPurchase) !== Number(item.isPurchase)) {
                  isEdit = true
                }
              }
            })
          }
          if (editGoodsNameList.length > 0) {
            const goodsList = this.batchSetupModal.two.allList
            editGoodsNameList.map(cItem =>  {
              const idx = goodsList.findIndex(v => v.index === cItem.index)
              if (idx > -1) {
                if (Number(goodsList[idx].isPurchase) !== Number(cItem.isPurchase)) {
                  isEdit = true
                }
              }
            })
          }
        }
        if (isEmpty || !isEdit) {
          this.setupData.step = 'zero'
          return
        }
        const {business: {allList}} = this.setupData
        this.batchSetupModal = deepCopy(batchSetupModal)
        const {one, two} = this.batchSetupModal
        this.dealWIthBusinessData(two.allList, one.allList)
        for (const itemCust of one.allList) {
          for (const item of allList) {
            if (item.cust_name === itemCust.name) {
              item.isPurchase = itemCust.isPurchase
            }
          }
        }
        for (const itemGoods of two.allList) {
          for (const item of allList) {
            for (const detailItem of item.detailList) {
              if (detailItem.goods_name === itemGoods.name) {
                detailItem.isPurchase = itemGoods.isPurchase
              }
            }
          }
        }
        const moveToPendingList = []
        let purchaseLength = 0 // 采购统计 +
        let accountLength = 0
        for (const item of allList) {
          let custPurchase = 0
          let detailListIspurchase = 0
          if (Number(item.isPurchase) === 0) {
            custPurchase = 0
          } else {
            custPurchase = 1
          }
          const idx = item.detailList.findIndex(v => Number(v.isPurchase) === 0)
          if (idx > -1) {
            detailListIspurchase = 0
          } else {
            detailListIspurchase = 1
          }
          item.isPurchase =  custPurchase === 1 && detailListIspurchase === 1 ?  1 : 0
          item.isAccount = item.isPurchase
          if (item.isAccount === 0) {
            moveToPendingList.push(item)
          } else {
            accountLength++
          }
          if (Number(item.isPurchase) === 1) {
            purchaseLength++
          }
        }
        if (moveToPendingList.length === allList.length) {
          this.moveToPending = true
        } else {
          this.moveToPending = false
        }
        this.setupData.business.purchaseNumber = purchaseLength
        this.setupData.business.accountNumber = accountLength
        this.setupData.step = 'zero'
        this.setupData.business.list.map((item, index) => {
          for (const cItem of allList) {
            if (item.key === cItem.key) {
              this.setupData.business.list[index] = deepCopy(cItem)
            }
          }
        })
      },
      unCertifiedTransform () {
        Loading.service(localParams)
        queryToBeCertifiedTax().then(resp => {
          Loading.service().close()
          this.dialogModal.modal = true
          this.dialogModal.type = 'income'
          const {total_certify_tax_amount, qcye_je, vm_state, vt_num_list, vch_id_list, id}  = resp.data
          this.certifiedTaxId = id
          const vtNumList = []
          if (vm_state === 2) {
            const vtNumArray =  vt_num_list.split(',')
            for (const item of vtNumArray) {
              if (item) {
                vtNumList.push(item)
              }
            }
          }
          this.income = {
            total_certify_tax_amount: vm_state === 2 ? toMoney(total_certify_tax_amount) : String(total_certify_tax_amount), // 待认证转进项余额
            qcye_je: toMoney(qcye_je), // 科目余额
            vm_state: vm_state, // 生成凭证状态
            vt_num_list: vtNumList, // 凭证字号列表,各以逗号,分隔,如: 记-1,记-2
            vch_id_list: vch_id_list // 凭证ID列表,各ID以逗号,分隔,如: 1,2
          }
        }, error => {
          Loading.service().close()
        })
      },
      createVoucherIncome () {
        Loading.service(localParams)
        createVoucherIncome({
          total_certify_tax_amount: this.income.total_certify_tax_amount.replace(/,/g, ''),
          id: this.certifiedTaxId
        }).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.dialogModal.modal = false
        }, error => {
          Loading.service().close()
        })
      },
      toSettle () {
        this.getSettleList()
      },
      getSettleList () {
        const {business: {allList, oldAccountList}} = this.setupData
        Loading.service(localParams)
        queryPurchaseSettlement({
          invoiceInfoList: allList,
          accountList: oldAccountList
        }).then(resp => {
          Loading.service().close()
          this.dialogModal.modal = true
          this.dialogModal.type = 'setup'
          this.setupData.step = 'one'
          const {invoiceInfoList, totalAmount, smInfoList, negativeAmount} = resp.data
          const {service} = this.setupData
          const length  = invoiceInfoList.length
          // 由于初始理票 id全部为0 发票号码唯一性不能确定 创建一个唯一值key
          for (let i = 0; i < length; i++) {
            invoiceInfoList[i].key = i
            invoiceInfoList[i].amountStr = toMoney(invoiceInfoList[i].amount)
          }
          service.allList = deepCopy(invoiceInfoList)
          service.accountList = invoiceInfoList
          service.oldNotAccountList = deepCopy(invoiceInfoList)
          service.oldAccountList = deepCopy(invoiceInfoList)
          service.step = 'account'
          service.list = invoiceInfoList
          service.listNum = invoiceInfoList.length
          service.amount = toMoney(totalAmount)
          service.negativeAmount = negativeAmount ? toMoney(negativeAmount) : 0
          for (const item of smInfoList) {
            service.settleMethod[item.item_id] = item.item_name
          }
        }, error => {
          Loading.service().close()
        })
      },
      toSubject (type) {
        const {service: {allList}, subModal} = this.setupData
        this.setupData.service.inputVal = ''
        Loading.service(localParams)
        queryPurchaseAcctList({
          invoiceInfoList: allList
        }).then(resp => {
          Loading.service().close()
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
          const acct20Info = this.dealWithAcct20List(contactAll)
          const acct10Info = this.dealWithAcct10List(incomeAll,  accountSetupType)
          this.dealWithAcct(acct20Info, 'two')
          this.dealWithAcct(acct10Info, 'one')
        }, error => {
          Loading.service().close()
        })
      },
      dealWithAcct20List (acct20InfoList) {
        const noList = []
        const allList = []
        const noMatchList = []
        for (const item of acct20InfoList) {
          const curItem = {
            name: item.cust_name,
            initVal: item.cust_name,
            newSubVal: item.cust_name,
            acct_ci_name: item.acct_20_ci_name,
            isEdit: false,
            showIcon: false
          }
          if (item.acct_20_code) {
            const acct =  `${item.acct_20_code} ${item.acct_20_name}`
            // curItem.acct = `${item.acct_20_code} ${item.acct_20_name}`
            curItem.acct = isFuzhuSub(acct)
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
      dealWithAcct10List (acct10InfoList, accountSetupType ) {
        // const code = getCode('purchase')
        // const acctCodeName = getLastStageCode(code)[0]
        const noList = []
        const allList = []
        const noMatchList = []
        for (const item of acct10InfoList) {
          const curItem = {
            name: item.good_name,
            initVal: item.good_name,
            acct_ci_name: item.acct_10_ci_name,
            newSubVal: item.good_name,
            isEdit: false,
            showIcon: false,
            specification: item.specification || ''
          }
          if (accountSetupType === '1' && item.specification) {
            curItem.newSubVal = `${item.good_name}（${item.specification}）`
            curItem.initVal = `${item.good_name}（${item.specification}）`
          }
          if (item.acct_10_code) {
            const acct = `${item.acct_10_code} ${item.acct_10_name}`
            // curItem.acct = `${item.acct_10_code} ${item.acct_10_name}`
            curItem.acct = isFuzhuSub(acct)
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
      dealWithAcct (acctInfo, step) {
        const subModal = this.setupData.subModal
        subModal[step].noList = acctInfo.noList
        subModal[step].allList = acctInfo.allList
        subModal[step].noMatchList = acctInfo.noMatchList
        subModal[step].radio = acctInfo.noMatchList.length ? 'noMatch' : acctInfo.noList.length ? 'no' : 'all'
        subModal[step].list = acctInfo.noMatchList.length ? acctInfo.noMatchList : acctInfo.noList.length ? acctInfo.noList : acctInfo.allList
        subModal[step].noNum = acctInfo.noList.length
        subModal[step].allNum = acctInfo.allList.length
        subModal[step].noMatchNum = acctInfo.noMatchList.length
      },
      onUp (step) {
        this.setupData.service.inputVal = ''
        this.setupData.step = step
      },
      savePendingData () {
        Loading.service(localParams)
        const {cgData, dyData, fpData} = this.pendingList
        const businessList = this.setupData.business.allList
        const {business: {invoiceInfoList, oldAccountList, oldNotAccountList}} = this.setupData
        savePendingData({
          invoiceInfoList: invoiceInfoList,
          accountNotList: oldNotAccountList,
          accountList: oldAccountList,
          delInfoList: businessList,
          cgData: cgData,
          dyData: dyData,
          fpData: fpData
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.dialogModal.modal = false
          this.dialogModal.type = ''
          this.setupData = deepCopy(setupData)
          this.batchSetupModal = deepCopy(setupData.batchSetupModal)
          this.queryPurchaseList().then(resp => {
            Loading.service().close()
          }, err => {
            Loading.service().close()
          })
        }, err => {
          Loading.service().close()
        })
      },
      saveSubSetup () {
        Loading.service(localParams)
        // const {service: {allList, deleteList}, subModal: {one, two}} = this.setupData
        const {service: {allList}, subModal: {one, two}, business: {oldNotAccountList, oldAccountList}} = this.setupData
        const oneList = one.allList
        const twoList = two.allList
        const incomeList = []
        for (const item of oneList) {
          let acct_code = ''
          let acct_name = ''
          if (item.acct) {
            const idx = item.acct.indexOf(' ')
            // const acctArray = item.acct.split(' ')
            acct_code = item.acct.slice(0, idx)
            acct_name = item.acct.slice(idx + 1)
          }
          incomeList.push({
            good_name: item.name,
            acct_10_code: acct_code,
            acct_10_name: acct_name,
            acct_10_ci_name: item.acct_ci_name,
            specification: item.specification
          })
        }
        const contactList = []
        for (const item of twoList) {
          let acct_code = ''
          let acct_name = ''
          if (item.acct) {
            const idx = item.acct.indexOf(' ')
            // const acctArray = item.acct.split(' ')
            acct_code = item.acct.slice(0, idx)
            acct_name = item.acct.slice(idx + 1)
          }
          contactList.push({
            cust_name: item.name,
            acct_20_code: acct_code,
            acct_20_name: acct_name,
            acct_20_ci_name: item.acct_ci_name
          })
        }
        const {cgData, dyData, fpData} = this.pendingList
        const deleteList = []
        for (const item of oldNotAccountList) {
          if (item.accountFlag === 'account') {
            deleteList.push(item)
          }
        }
        const addList = []
        for (const item of oldAccountList) {
          if (item.accountFlag === 'notAccount') {
            addList.push(item)
          }
        }
        saveInvoiceInfo({
          invoiceInfoList: allList, // 发票信息列表（发票下载信息，修改结算方式信息后，回传后端）
          contactList: contactList, // 往来科目列表信息
          incomeList: incomeList, // 存货科目列表信息
          accountList: oldAccountList,
          accountNotList: oldNotAccountList,
          delAccountList: deleteList,
          addAccountList: addList,
          cgData: cgData, // 待用区入库的数
          dyData: dyData, // 待用区留用的数据
          fpData: fpData // 待用区废票数据
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.dialogModal.modal = false
          this.dialogModal.type = ''
          this.batchSetupModal = []
          this.setupData = deepCopy(setupData)
          this.batchSetupModal = deepCopy(setupData.batchSetupModal)
          this.queryPurchaseList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          Loading.service().close()
        })
      },
      queryInvoice () {
        this.dialogModal.modal = true
        this.dialogModal.type = 'query'
        this.queryInvoiceDetail = deepCopy(queryInvoiceDetail)
      },
      handleSaveQueryBill () {
        const {selectedList} = this.queryInvoiceDetail
        if (selectedList.length === 0) {
          return Message({
            message: '请先选择发票',
            type: 'warning',
            duration: duration
          })
        }
        Loading.service(localParams)
        saveJxHistoryInvoice({
          cgData: selectedList
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.queryInvoiceDetail = deepCopy(queryInvoiceDetail)
          this.queryPurchaseList().then(item => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
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
        self.$http.post(`${process.env.BASE_API}/purchase/importExcel.do`, formData).then(resp => {
          Loading.service().close()
          const data = resp.data
          if (data && data.code === '0') {
            Message({
              message: data.message,
              type: 'success',
              duration: duration
            })
            this.setupData = deepCopy(setupData)
            this.batchSetupModal = deepCopy(setupData.batchSetupModal)
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
          queryVoucherRule({module: 'purchase'}).then(resp => {
            const {firstMergeRule, ywSummaryRule, jsSummaryRule, voucherDateRule, firstMergeRuleForExpenseInJX, ywSummaryRuleForExpenseInJX, inputVatProcessType} = resp.data
            this.settingData = deepCopy(settingData)
            const {createType, summary, createDate, financeSetting} = this.settingData
            createType.subItem[0].type = firstMergeRule
            createType.subItem[1].type = firstMergeRuleForExpenseInJX
            const createIdx = createType.subItem[0].options.findIndex(item => item.val === firstMergeRule)
            if (createIdx > -1) {
              createType.subItem[0].options[createIdx].showTip = true
            }
            summary.subItem[0].options[0].name = ywSummaryRule.transType
            summary.subItem[0].options[0].defaultName = deepCopy(ywSummaryRule.transType)
            summary.subItem[1].options[0].name = ywSummaryRuleForExpenseInJX.transType
            summary.subItem[1].options[0].defaultName = deepCopy(ywSummaryRuleForExpenseInJX.transType)
            summary.subItem[2].options[0].defaultName = deepCopy(jsSummaryRule.sm_id)
            summary.subItem[2].options[0].name = jsSummaryRule.sm_id
            createDate.voucherDateRule = voucherDateRule
            financeSetting.inputVatProcessType = inputVatProcessType
            summary.subItem[0].summaryType = summary.subItem[0].summaryType.concat(this.dealWithVoucherData(summary.subItem[0].options, ywSummaryRule))
            if (ywSummaryRuleForExpenseInJX.goodServiceName === '1') {
              summary.subItem[1].summaryType.push('goodServiceName')
            }
            summary.subItem[2].summaryType = summary.subItem[2].summaryType.concat(this.dealWithVoucherData(summary.subItem[2].options, jsSummaryRule))
            this.dialogModal.modal = true
            this.dialogModal.type = 'setting'
            if (this.taxType === '2') {
              this.typeDesc.setting[1] = ''
            }
            this.taxFinance = true
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
        const {createType: {subItem}, summary, createDate: {voucherDateRule}, financeSetting: {inputVatProcessType}} = this.settingData
        let isEdit = summary.subItem[0].options[0].isEdit && summary.subItem[0].options[0].name !== summary.subItem[0].options[0].defaultName
        if (!isEdit) {
          isEdit = summary.subItem[1].options[0].isEdit && summary.subItem[1].options[0].name !== summary.subItem[1].options[0].defaultName
        }
        if (!isEdit) {
          isEdit = summary.subItem[2].options[0].isEdit && summary.subItem[2].options[0].name !== summary.subItem[2].options[0].defaultName
        }
        if (isEdit) {
          Loading.service().close()
          return Message({
            message: '凭证摘要编辑后未进行保存，请先保存您所编辑的凭证摘要！',
            type: 'warning',
            duration: duration
          })
        }
        const serviceData = summary.subItem[0].summaryType
        const accountData = summary.subItem[2].summaryType
        const serviceSummary = {
          transType: summary.subItem[0].options[0].name,
          goodServiceName: serviceData.indexOf('goodServiceName') > -1 ? '1' : '0',
          specification: serviceData.indexOf('specification') > -1 ? '1' : '0',
          qtyAndunit: serviceData.indexOf('qtyAndunit') > -1 ? '1' : '0',
          unitPrice: serviceData.indexOf('unitPrice') > -1 ? '1' : '0'
        }
        const accountSummary = {
          sm_id: summary.subItem[2].options[0].name,
          custName: accountData.indexOf('custName') > -1 ? '1' : '0',
          qdlx: accountData.indexOf('qdlx') > -1 ? '1' : '0',
          fplx: accountData.indexOf('fplx') > -1 ? '1' : '0',
          invNo: accountData.indexOf('invNo') > -1 ? '1' : '0'
        }
        const expenseSummary = {
          transType: summary.subItem[1].options[0].name,
          goodServiceName: summary.subItem[1].summaryType.indexOf('goodServiceName') > -1 ? '1' : '0'
        }
        const params = {
          voucher_rule: JSON.stringify({
            firstMergeRule: subItem[0].type,
            firstMergeRuleForExpenseInJX: subItem[1].type,
            voucherDateRule: voucherDateRule,
            ywSummaryRule: serviceSummary,
            jsSummaryRule: accountSummary,
            ywSummaryRuleForExpenseInJX: expenseSummary,
            inputVatProcessType: inputVatProcessType
          }),
          module: 'purchase'
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
      viewInvDetail () {
        Loading.service(localParams)
        queryCertifiedTaxDetail({id: this.certifiedTaxId}).then(resp => {
          Loading.service().close()
          this.certifiedTaxList = []
          const {dataList, invoiceNum,  exTaxAmount, taxAmount} = resp.data
          this.certifiedTaxDetail.invoiceNum = invoiceNum
          this.certifiedTaxDetail.exTaxAmount = toMoney(exTaxAmount.toFixed(2))
          this.certifiedTaxDetail.taxAmount = toMoney(taxAmount.toFixed(2))
          for (const item of dataList) {
            item.ex_tax_amount = toMoney(item.ex_tax_amount)
            item.tax_amount = toMoney(item.tax_amount)
          }
          this.certifiedTaxList = dataList
          this.dialogModal.modal = true
          this.dialogModal.type = 'check'
        }, err => {
          Loading.service().close()
        })
      },
      closedDialog () {
        if (this.dialogModal.type === 'check') {
          this.dialogModal.modal = true
          this.dialogModal.type = 'income'
        }
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
          this.queryPurchaseList().then(item => {
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
        this.saveVoucherRule(params).then(res => {
          this.setupModal.modal = false
          this.toSubject(true)
        }, err => {
          Loading.service(localParams)
        })
      }
    },
    computed:{
      kind(){
        const {business} = this.setupData
        let list = business.list
        let set = []
        list.forEach((i)=>{
          set.push(i.inv_type_name)
        })
        let arr = [];
        let result = set
        result.sort()
        for (let i = 0; i < result.length;) {
          let count = 0;
          for (let j = i; j < result.length; j++) {
            if (result[i] === result[j]) {
              count++;
            }
          }
          arr.push({
            date: result[i],
            count: count
          })
          i+=count;
        }
        return arr
      }
    },
    components: {
      HeaderOperate,
      KindTable,
      ReorganizeBill,
      FooterPagination,
      CheckVoucher,
      KeepAccounts,
      BillEdit,
      DetailFooter,
      EditFooter,
      AmountCount,
      FooterAmount,
      HelpModal,
      QueryInvoice,
      importForm,
      SettingVoucher,
      CommonTable,
      InventoryBill
    },
    watch:{
    }
  }
</script>
