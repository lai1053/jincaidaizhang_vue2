<style lang='scss' scoped>
  .recycle{
    position: relative;
  }
  .billdetail-foot {
    margin-top: 10px;
  }
  .header-btn {
    padding: 10px 6px;
  }
  .vue-table {
    width: 100%;
  }
  .recycle .header-btn .el-button{
    margin-left: 0;
  }
</style>
<template>
  <div class="recycle">
    <!-- 头部 -->
    <header-operate
      inputTip="请输入销售方名称"
      main-menu="pending"
      :form-content="formContent"
      :filter-form="filterForm"
      :filter-form-old="filterFormOld"
      :btn-type="btnType"
      :clear="true"
      :multiple-selection="multipleSelection"
      :change-tax-type="changeTaxType"
      :proofState="false"
      @on-move-to-purchase="moveToPurchase"
      @on-clear-data="deleteData"
      @on-filter="getFilterList "
      @on-save-Remark="save_Remark"
      @on-delete-remarks="delete_Remark"
      :more="more"
    >
      <template slot="filterItem">
        <el-form-item label="销售方名称">
          <el-input
            v-model="formContent.fkfmc"
            placeholder="请输入销售方名称"
            clearable suffix-icon="el-icon-search" size="small"></el-input>
        </el-form-item>
        <el-form-item label="发票类型">
          <el-select
            v-model="formContent.inv_type_name"
            size="small"
            clearable
            filterable
            allow-create
          >
            <el-option
              v-for="(item, idx) in screen"
              :key="idx"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票号码">
          <el-input
            v-model="formContent.inv_no"
            placeholder="请输入发票号码"
            @input="handleInput($event, 'formContent', 'inv_no')"
            clearable suffix-icon="el-icon-search" size="small"></el-input>
        </el-form-item>
        <el-form-item label="开票日期">
          <el-col :span="11">
            <el-date-picker
            value-format="yyyy-MM-dd"
            size="small"
            v-model="formContent.kprq_start"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              value-format="yyyy-MM-dd"
              size="small"
              v-model="formContent.kprq_end"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="金额">
          <el-col :span="11">
            <el-input
              v-model="formContent.min_hjje"
              placeholder="0.00"
            @input="handleInput($event,'formContent','min_hjje')"
              size="small"
            ></el-input>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-input
              v-model="formContent.max_hjje"
              placeholder="0.00"
            @input="handleInput($event,'formContent','max_hjje')"
              size="small"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="税额">
          <el-col :span="11">
            <el-input
              v-model="formContent.min_hjse"
              placeholder="0.00"
            @input="handleInput($event, 'formContent','min_hjse')"
              size="small"
            ></el-input>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-input
              v-model="formContent.max_hjse"
              placeholder="0.00"
              @input="handleInput($event, 'formContent','max_hjse')"
              size="small"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="价税合计">
          <el-col :span="11">
            <el-input
              v-model="formContent.min_jshj"
              placeholder="0.00"
            @input="handleInput($event, 'formContent','min_jshj')"
              size="small"
            ></el-input>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-input
              v-model="formContent.max_jshj"
              placeholder="0.00"
            @input="handleInput($event, 'formContent', 'max_jshj')"
              size="small"
            ></el-input>
          </el-col>
        </el-form-item>
      </template>
    </header-operate>
    <!--主列表-->
    <kind-table
      :loading="loading"
      :columns="columns"
      :list="list"
      main-menu="pending"
      @sort-change="sortChange"
      @on-selection-change="handleSelectionChange"
      @row-dblclick="dblClickRow"
      @on-save-Remark="save_Remark"
    ></kind-table>
    <!--底部统计-->
    <div class="footer-total-amount">
      <footer-amount
        :amount-data="count"
        :module-type="moduleType"
      ></footer-amount>
      <footer-pagination
        @size-change="handlePage($event, 'pageSize')"
        @current-change="handlePage($event, 'currentPage')"
        :current-page.sync="currentPage"
        :page-sizes="[50,100, 300]"
        :page-size="pageSize"
        :total="totalRecord"
        :total-page="totalPage"
      ></footer-pagination>
    </div>
    <!--列表明细-->
    <div v-if=" dialogModal.visible">
      <el-dialog
        title="票据查看"
        :visible.sync=" dialogModal.visible"
        :close-on-click-modal="false"
        width="1100px"
        class="pending-modal">
        <!-- 主档 -->
        <main-table
          :mainData="mainData"
        ></main-table>
        <!-- 从档 -->
        <vice-table
          :tableData="viceData"
        ></vice-table>
        <!--上一页 下一页-->
        <up-next-page
          :modal-type="dialogModal.type"
          :list="list"
          :detail="mainData"
          @on-up-next="dblClickRow">
        </up-next-page>
        <div slot="footer" style="height: 32px;">
          <amount-count style="width:80%;display: inline-block;"
                        :total="mainData.pendingDetailVOList.length"
                        :sum="mainData.hjjeStr"
                        :tax="mainData.hjseStr"
                        :amount="mainData.jshjStr"
          ></amount-count>
          <el-dropdown v-if="!changeTaxType" @command="handleCommand" placement="top-end" style="float: right;">
            <el-button size="small" type="primary" icon="el-icon-more">
              <!-- 操作 -->分配<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item command="moveToPurchase"><i class="fas fa-sign-out-alt"></i> 采购</el-dropdown-item>-->
              <el-dropdown-item command="batchDelete"><i class="fas fa-trash-alt"></i> 彻底删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  // 组件
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import KindTable from '@/views/components/KindTable/index'
  import mainTable from './components/DynaticTable/mainTable'
  import viceTable from './components/DynaticTable/viceTable'
  import amountCount from '@/views/components/AmountCount.vue'
  import HeaderOperate from '@/views/components/HeaderOperate'
  import FooterAmount from  '@/views/components/FooterAmount'
  import UpNextPage from '@/views/components/UpNextPage'
  // api
  import {selectAmount, toMoney} from '@/utils/utils'
  import {deepCopy} from '@/utils/assist'

  import {pend} from './data/fixedData'
  import {filterForm } from './data/com'
  import {Message, Loading, MessageBox} from 'element-ui'
  import {checkNum} from '@/utils/utils'

  // api
  import {
    moveToPurchase,
    queryPendingList,
    batchDeleteData,
    queryPendingListDetail,
    addRemark,
    deleteRemark
  } from '@/api/pending'
  import {localParams, duration} from '@/views/components/data/common'
  const orderNames = {
    hjjeStr: 'hjje',
    hjseStr: ' hjse',
    jshjStr: 'jshj',
    inv_no: 'inv_no',
    inv_type_name: 'bill_type_for_sort_only',
    kprq: 'kprq'
  }
  const orders = {
    ascending: 'ASC',
    descending: 'DESC'
  }
  export default {
    name: 'recycle-index',
    data () {
      return {
        more: [{
          itemType: 'remarks',
          itemName: '添加备注'
        }, {
          itemType: 'deleteRemarks',
          itemName: '删除备注'
        }],
        submenu: '51000024',
        ...pend,
        filterForm: deepCopy(filterForm),
        filterFormOld: deepCopy(filterForm),
        formContent: deepCopy(filterForm),
        inputVal: '',
        currentPage: 1,
        pageSize: 50,
        totalRecord: 0,
        totalPage: 1,
        list: [],
        // 底部统计
        count: {},
        amountData: {
          billNum: 0, // 发票数量
          postiveExTaxAmount: 0, // 金额 正
          negativeExTaxAmount: 0, // 金额 负
          positiveTax: 0, // 税额 正
          negativeTax: 0, // 税额 负
          positiveAmount: 0, // 价税合计 正
          negativeAmount: 0 // 价税合计 负
        },
        mainData: [],
        viceData: [],
        multipleSelection: [], // 批量数据
        sortData: { // 排序
          prop: '', // 字段
          order: '' // 升序 降序
        },
        dialogModal: {
          visible: false,
          type: 'detail'
        },
        fullHeight: document.documentElement.clientHeight - 112,
        loading: false,
        selectAmount: {
          attachmentNum: 0,
          sum: 0,   // 金额
          tax: 0,   // 税额
          amount: 0, // 价税统计
          negativeSum: 0,
          negativeTax: 0,
          negativeAmount: 0
        },
        moduleType: 'pending',
        changeTaxType: false, // 纳税身份转换，false可编辑，true 不可编辑
        taxType: ''
      }
    },
    created () {
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
      this.getPendingList()
      const {taxType} = urlInfo
      this.taxType = taxType
    },
    computed: {
      screen () {
        if (this.taxType === '1') {
          return  ['全部',  '普票', '专票', '代开专票', '机动车', '海关', '统一收购', '农产品', '通行费']
        } else {
          return  ['全部',  '普票', '专票（已认证）', '专票（未认证）', '代开专票（已认证）', '代开专票（未认证）', '机动车（已认证）', '机动车（未认证）',
            '海关（已认证）', '统一收购（已认证）', '农产品（已认证）', '通行费（已认证）', '通行费（未认证）']
        }
      }

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
          this.getPendingList()
        }, e => {
          console.log(e)
          this.getPendingList()
        })
      },
      // 保存备注信息
      save_Remark (arg) {
        const params = {
          bill_id_array: arg.id,
          remark: arg.arg
        }
          addRemark(params).then(resp => {
            this.$message({
              showClose: true,
              message: '保存备注信息成功',
              duration: 1500,
              type: 'success'
            })
            this.getPendingList()
          }, err => {
            console.log(err)
            this.getPendingList()
          })
      },
      sortChange (e) {
        this.sortData.prop = e.prop ? orderNames[e.prop] : ''
        this.sortData.order = e.order ? orders[e.order] : ''
        this.getPendingList()
      },
      getFilterList (inputVal) {
        this.inputVal = inputVal || ''
        this.getPendingList(this.inputVal)
      },
      // 请求列表 接口
      getPendingList () {
        Loading.service(localParams)
        this.queryPendingList().then(resp => {
          Loading.service().close()
        }, error => {
          Loading.service().close()
        })
      },
      queryPendingList () {
        const {fkfmc, inv_no, inv_type_name, kprq_start, kprq_end, min_hjje, max_hjje, min_hjse, max_hjse, min_jshj, max_jshj} = this.filterForm
        return new Promise((resolve, reject) => {
          queryPendingList({
            fkfmc: fkfmc || this.inputVal, // 销售方名称
            inv_no: inv_no, // 发票号码
            inv_type_name: inv_type_name, // 精确匹配
            kprq_start: kprq_start, // 开票日期
            kprq_end: kprq_end,
            min_hjje: min_hjje, // 金额合计
            max_hjje: max_hjje,
            min_hjse: min_hjse, // 合计税额
            max_hjse: max_hjse,
            min_jshj: min_jshj, // 价税合计
            max_jshj: max_jshj,
            pageQueryVO: {
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              orderName: this.sortData.prop, // 发票类型：bill_type_id 价税合计：amount 凭证字号：vt_num_list 往来单位：cust_name 结算科目：acct_20_code 存货科目：acct_10_code 开票日期：bill_date
              order: this.sortData.order // 排序方式，二选一： ASC：升序 DESC：降序
            }
          }).then(resp => {
            const respData = resp.data
            if (respData) {
              Object.keys(this.amountData).forEach(item => {
                const itemVal = respData.billCount[item]
                if (item === 'billNum') {
                  this.amountData[item] = itemVal
                } else {
                  this.amountData[item] = itemVal ? toMoney(itemVal) : 0
                }
              })
              this.totalRecord = respData.page.totalRecord
              this.totalPage = respData.page.totalPage
              this.count = deepCopy(this.amountData)
              this.list = this.dealWithList(respData.dataList)
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
          item.goodNames = []
          item.hjjeStr = toMoney(item.hjje)
          item.hjseStr = toMoney(item.hjse)
          item.jshjStr = toMoney(item.jshj)
          item.index = index
          item.taxRate = `${item.pendingDetailVOList[0].tax_rate * 100}%`
          if (item.pendingDetailVOList && item.pendingDetailVOList.length > 0) {
            const detailList = item.pendingDetailVOList
            for (const dItem of detailList) {
              if (dItem.goods_name) {
                if (item.goodNames.length < 5) {
                  item.goodNames.push(dItem.goods_name)
                } else if (item.goodNames.length === 5) {
                  item.goodNames.push('...')
                }
              }
            }
          }
        })
        return list
      },
      // 页码操作
      handlePage (val, type) {
        if (type === 'pageSize') {
          this.pageSize = val
          this.currentPage = 1
        } else {
          this.currentPage = val
        }
        this.getPendingList()
      },
      // 删除回收站数据
      deleteData (idArray) {
        Loading.service(localParams)
        batchDeleteData({
          bill_id_array: idArray
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.dialogModal.visible = false
          this.queryPendingList().then(resp => {
            Loading.service().close()
          }, error => {
            Loading.service().close()
          })
        }, error => {
          Loading.service().close()
        })
      },
      // 移至采购
      moveToPurchase (idArray) {
        Loading.service(localParams)
        moveToPurchase({
          bill_id_array: idArray
        }).then(resp => {
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.multipleSelection = []
          this.dialogModal.visible = false
          this.queryPendingList().then(reps => {
            Loading.service().close()
          }, err => {
            Loading.service().close()
          })
        }, error => {
          Loading.service().close()
        })
      },
      dblClickRow (row) {
        Loading.service(localParams)
        this.queryPendingDetail(row).then(resp => {
          Loading.service().close()
        }, error => {
          Loading.service().close()
        })
      },
      queryPendingDetail (row) {
        return new Promise((resolve, reject) => {
          queryPendingListDetail({
            bill_id: row.id
          }).then(resp => {
            this.dialogModal.visible = true
            this.mainData = row
            const list = resp.data.pendingDetailVOList
            for (const item of list) {
              item.unit_price = toMoney(item.unit_price)
              item.amount = toMoney(item.amount)
              item.jshj = toMoney(item.jshj)
              item.tax_amount = toMoney(item.tax_amount)
            }
            this.viceData = resp.data.pendingDetailVOList
            // resp
            return resolve(resp.data)
          }, error => {
            return reject(error)
          })
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
      // 多选
      handleSelectionChange (list, amount) {
        this.multipleSelection = list
        if (list && list.length > 0) {
          this.count = amount
          this.count.billNum = list.length
        } else {
          this.count = deepCopy(this.amountData)
        }
      },
      // 明细按钮操作
      handleCommand (command) {
        const id = []
        id[0] = this.mainData.id
        if (command === 'batchDelete') {
          return MessageBox.alert('确定要删除数据吗?删除后无法恢复', '删除清单', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.deleteData(id)
              }
            }
          })
        } else {
          this.moveToPurchase(id)
        }
      }
      // 旧数据
    },
    components: {
      FooterAmount,
      HeaderOperate,
      FooterPagination,
      KindTable,
      mainTable,
      viceTable,
      amountCount,
      UpNextPage

    },
    watch: {
    }
  }
</script>
