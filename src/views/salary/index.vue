<style lang='scss' scoped>
  .vue-main {
    margin-bottom: 15px;
    border-top: 1px solid #e3e8ee;
    border-left: 1px solid #e3e8ee;
    .vue-row-col {
      height: 31px;
      line-height: 30px;
      border-right: 1px solid #e3e8ee;
      border-bottom: 1px solid #e3e8ee;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .vue-row-col-bg {
      padding: 0 6px;
      text-align: right;
      background-color: #fafafa;
    }

    .vue-must {
      color: red;
      margin-left: 3px;
    }
    .vue-edit-box {
      width: 100%;
    }
  }

  .header-btn {
    padding: 10px 6px;
  }
  .footer-amount{
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #666666;
  }
  .vue-table {
  }
</style>
<style lang='scss'>
  .vue-main-create {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border: none;
      border-radius: 0;
    }
  }

  .auto-complete-t {
    display: none !important;
  }

  .auto-complete,
  .auto-complete-t {
    .el-scrollbar {
      padding-bottom: 34px;
    }
    .el-scrollbar {
      display: block !important;
    }
    .el-select-dropdown__wrap {
      max-height: 218px;
    }
    ul {
      position: static !important;
      .auto-complete-btn {
        width: 100%;
        height: 34px;
        line-height: 34px;
        border-top: 1px solid #d7dde4;
        text-align: center;
        position: absolute;
        bottom: 0;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        background-color: #F5F6F7;
      }
    }
  }
  .salaryTable{
    td{
      .cell{padding-right:10px!important;}
    }
  }
</style>
<template>
  <div>
    <div class="header-operate">
      <!--帮助-->
      <help-modal main-menu="salary"></help-modal>
      <el-dropdown @command="handleCommand" class="more-box" v-if="!changeTaxType">
        <el-button size="small" type="primary" icon="el-icon-more">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <!-- 更多下拉按钮组 -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item2 in headBtns"
            v-if="item2.isShow === true || list.length === 0 "
            :command="item2.key"
            :key="item2.key">
            <i :class="item2.icon"></i>
            {{item2.name}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        size="small"
        type='primary'
        class="float-right-btn"
        v-if="!changeTaxType"
        v-show="list.length === 0"
        @click="handleImport">
        <i class="fa fa-plus"></i>
        导入
      </el-button>
      <el-button
        @click="generateVoucher"
        size="small"
        type='primary'
        :disabled="!row"
        class="float-right-btn"
        v-if="!changeTaxType"
        v-show="isShowVoucher">
        <i class="fas fa-plus-square"></i>
        生成凭证
      </el-button>
    </div>
    <el-table
      border
      stripe
      :data="list"
      ref="multipleTable"
      @row-dblclick="handleClickDynatic"
      :height="fullHeight"
      class="vue-table vue-table-main salaryTable">
      <el-table-column
        label="应发工资"
        align="right"
        width="">
        <template slot-scope="scope">
          {{toMoney(scope.row.i_pay_total)}}
        </template>
      </el-table-column>
      <el-table-column
        label="社保"
        align="right"
        width=""
        show-overflow-tooltip>
        <template slot-scope="scope">
          <!--小黑框<i class="el-icon-menu" style="float: left;line-height: 24px;" @click="viewDetail"></i>-->
          {{toMoney(scope.row.d_si_total + scope.row.d_si_total_ent)}}
        </template>
      </el-table-column>
      <el-table-column
        label="公积金"
        align="right"
        width="">
        <template slot-scope="scope">
          {{toMoney(scope.row.d_hf + scope.row.d_hf_ent)}}
        </template>
      </el-table-column>
      <el-table-column
        label="个税"
        align="right"
        width="">
        <template slot-scope="scope">
          {{toMoney(scope.row.d_pi_tax)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="其他扣项"
        align="right"
        width="">
        <template slot-scope="scope">
          {{toMoney(scope.row.d_deduct_other_total)}}
        </template>
      </el-table-column>
      <el-table-column
        label="实发工资"
        align="right"
        width="">
        <template slot-scope="scope">
          {{toMoney(scope.row.take_home_pay)}}
        </template>
      </el-table-column>
      <el-table-column
        label="凭证"
        align="center"
        width="98px"
        class="voucher-num">
        <template slot-scope="scope">
          <voucher-mark
            :change-tax-type="changeTaxType"
            :scope="scope"
            :item="{prop: 'vm_state', value: 'vt_num_list', desc: 'vm_state_desc'}"
            main-menu="salary"
            @delete-voucher="handleDeleteVoucher"
            @check-voucher="checkVoucher"
          ></voucher-mark>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <span class="text-color" style="cursor: pointer" @click="handleDeleteListRow(scope.row)"
                v-if="scope.row.vm_state && scope.row.vm_state !== 2 && !changeTaxType">删除</span>
        </template>
      </el-table-column>
    </el-table>


    <!--新增或查看明细-->
    <el-dialog :title="this.dynatic.state | titleFilter"
               :visible.sync="dynatic.visible"
               width="1100px" top="0" class="vertical-center-modal" :close-on-click-modal="false">
        <dynamic-table
          :access="dynatic.state"
          :tableDataOrigin="dynatic.data"
          :isCopy="isCopy"
          :vmState = 'vm_state'
          :simple_module="simple_module"
          :private_state="private_state"
          :visible="dynatic.visible"
          @on-save="handleSave"
          @failed-to-crate-voucher="refreshList"
          @on-changeState="handleChangeState"
          @on-import-salary="importSalaryMadel"
          @import-template="salaryImport">
        </dynamic-table>
        <!-- 已生成凭证 -->
        <div slot="footer">
          <!--<div style="float: right;margin-top: 15px;" >
            <el-button type="primary" size="small" :loading="btnsLoading.voucher"
                       @click="checkVoucher(row.vch_id_list)">查看凭证
            </el-button>
            <el-button type="primary" size="small" :loading="btnsLoading.create" @click="handleDeleteVoucher(row)">删除凭证
            </el-button>
          </div>-->
          <detail-footer
            v-if="dynatic.state === 'voucher'"
            :detail="row"
            :checkoutFlag="checkoutFlag"
            :change-tax-type="changeTaxType"
            main-menu="salary"
            @on-check-voucher="checkVoucher"
            @on-delete-voucher="handleDeleteVoucher">
          </detail-footer>
        </div>
    </el-dialog>


    <!-- 查看凭证 -->
    <check-voucher :voucher="voucher"></check-voucher>

    <!-- 导入 -->
    <import-form :formModal="formModal" :flag='formModal.flag' @on-import="salaryImport"></import-form>

    <!-- 匹配科目 -->
    <el-dialog title="科目设置" :visible.sync="subjectModal.modal" :close-on-click-modal="false" width="1100px" top="0" class="vertical-center-modal matchSub_dialog">
      <match-subject :subjectModal="subjectModal.modal"></match-subject>
    </el-dialog>

    <!--选择导出月份/复制上一期的月份-->
    <el-dialog
      :title="monthSelect.state|monthTitleFilter"
      :visible.sync="monthSelect.visible"
      width="400px" :close-on-click-modal="false">
      <!--日期控件-->
      <el-date-picker
        style="width: 290px;margin-left:20px"
        size="small"
        :placeholder="monthSelect.state|monthTitleFilter"
        v-model="monthSelect.inputMonth"
        type="month"
        format="yyyyMM"
        value-format="yyyyMM">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelHandler" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="clickHandler(monthSelect.state)">确 定</el-button>
        </span>
    </el-dialog>
    <a href="" download  style="display:none" id="exportIframe">导出</a>
    <!--<iframe name="exportIframe" style="display:none"></iframe>-->
  </div>
</template>

<script>
  import store from '@/store'
  import { mapGetters } from 'vuex'
  import { dealListForVoucher, toMoney } from '@/utils/utils'
  import { filterAccount } from '@/utils/filterAccount'
  // import mainFileCreate from '@/views/components/createModal/mainFileCreate'
  import dynamicTable from './components/DynaticTable/index'
  import VoucherMark from '@/views/components/ColumnItem/VoucherMark'
  import checkVoucher from '@/views/components/CheckVoucher.vue'
  import ImportForm from './components/ImportForm/index'
  import MatchSubject from '@/views/components/MatchSubject'
  import {headBtns} from '@/views/salary/data/common'
  import DetailFooter from '@/views/components/BillFooter/DetailFooter.vue'
  import HelpModal from '@/views/components/Help/index.vue'
  import {Loading} from 'element-ui'
  import {localParams, duration} from '@/views/components/data/common'

  import {deepCopy} from '@/utils/assist'

  // api
  import {
    getSalaryList,
    deleteSalary,
    newVoucher,
    deleteVoucher,
    getSalaryDeptDetail,  // 获取单个工资单据数据
    copyOfLastPeriod, // 复制上一期
    getPeriod, // 获取可导出月份
    // getCopyPeriod // 获取可复制上期的月份
  } from '@/api/salary'
  import FooterAmount from  '@/views/components/FooterAmount'
export default {
    data () {
      return {
        ...mapGetters(['indexData', 'accountList']),
        list: [],
        fullHeight: document.documentElement.clientHeight - 62,        // 表格可视区域的高度
        loading: false,
        voucherState: ['全部', '未生成', '已生成', '生成失败'],
        isShowVoucher: true,    // 是否显示“生成凭证”的按钮
        hasVoucher: true,
        row: null,
        dynatic: {              // 新增或编辑页面弹出框所有属性
          visible: false,       // 是否显示 dialog
          state: '',            // 状态： 创建 or 编辑
          vouchState: false,    // 是否已生成凭证
          data: null
        },
        monthSelect: {
          visible: false,
          state: '',
          inputMonth: '',
          iframeSrc: ''
        },
        voucher: {           // 查看凭证
          modal: false,
          curListIdx: null,
          vch_id: '',
          title: '数据查看',
          list: []
        },
        btnsLoading: {        // 底部按钮的状态
          save: false,
          voucher: false,
          create: false
        },
        formModal: {          // 导入
          modal: false,       // 弹出框控制
          flag: ''            // 标识导入页面是由哪个按钮点击弹出的“导入模板”还是“导入”，有两个入口
        },
        subjectModal: {        // 科目匹配
          modal: false         // 弹出框控制
        },
        imgModal: {            // 图片
          modal: false,
          billType: ''
        },
        periodDate: [],        // 可导日期
        ssyf: this.$store.getters.urlInfo.ssyf,    // 所属月份
        headBtns: headBtns,
        isCopy: '',            // 0:不是复制上期，1：复制上期
        simple_module: '',     // 0：手动新增，1：标准版导入，2：精简版导入
        private_state: '',     // 判断是导入后还是手动 >7：导入，<=7：手动新增
        vm_state: 1,           // 是否已经生成凭证：1为未生成，2为已生成
        amountData: {
          billNum: '',         // 清单条数
          attachmentNum: '0',  // 附件数量
          voucherNum: '0',     // 已生成凭证数
          novoucherNum: '0'    // 未生成凭证数
        },
        moduleType: '',
        listLength: 0,
        urlInfo: this.$store.getters.urlInfo,
        checkoutFlag: this.$store.getters.indexData.checkoutFlag === 'Y',
        changeTaxType: false // 纳税身份转换，true不可编辑，false可编辑
      }
    },
    mounted () {
    },
    created() {
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
      this.init()
    },
    filters: {
      // 数据详情 标题
      titleFilter (state) {
        const title = {
          create: '新增',
          edit: '数据编辑',
          voucher: '查看单据',
          detail: ''
        }
        return title[state]
      },
      monthTitleFilter (state) {
        // 选择月份 标题
        const title = {
          export: '请选择导出月份',
          copy: '请选择复制的月份'
        }
        return title[state]
      }
    },
    computed: {
    },
    methods: {
      importSalaryMadel (type) {
        this.simple_module = type // 0：手动新增，1：标准版导入，2：精简版导入
      },
      toMoney(num) {
        return toMoney(num)
      },
      clickHandler (state) {
        state === 'export' ? this.exportExl() : this.copyOfLastPeriod()
      },
      cancelHandler () {
        this.monthSelect.visible = false
      },
      handleChangeState () {
        this.dynatic.state = ''
      },
      // 获取列表数据
      init () {
        Loading.service(localParams)
        this.querySalaryList().then(res => {
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },
      querySalaryList () {
        return new Promise((resolve, reject) => {
          getSalaryList({}).then(
            res => {
              if (res.data.salaryDeptList.length) {
                this.list = res.data.salaryDeptList && [res.data.salaryDeptList[0]]// 返回的新增的清单列表
                this.vm_state = this.list[0].vm_state
                this.row = this.list[0]
                this.list[0].vm_state === 2  // vm_state存储的是什么信息
                  ? (this.isShowVoucher = false)
                  : (this.isShowVoucher = true)
                // 新增需求
                // 获取到该条清单是导入还是手动新增的
                this.isCopy = this.row.isCopy // 0:不是复制上期，1：复制上期
                this.simple_module = this.row.simple_module // 0：手动新增，1：标准版导入，2：精简版导入
                this.private_state = this.row.private_state
                // 重新获得单个清单的数据
              } else {
                this.list = []
                this.isShowVoucher = false
              }
              this.getPeriod()

              /* 清单条数合计，表格底部的价税合计 */
              Object.keys(this.amountData).forEach(item => {
                this.amountData[item] = res.data[item]
              })
              this.listLength = res.data.billNum
              return resolve(res)
              // 解决：新增后刷新列表，但是可到处日期未同步。
              // 获取单个清单列表数据
            },
            error => {
              console.log(error)
              return reject(error)
            }
          )
        })
      },
      // 获取可导出月份
      getPeriod () {
        const vm = this
        getPeriod({}).then(
          res => {
            if (res.success && res.data && res.data.length > 0) {
              vm.periodDate = res.data
            }
          }, error => {
            console.log(error)
          })
      },
      refreshList () {
        this.querySalaryList().then(res => {
          this.dynatic.visible = false
        }, err => {
          this.dynatic.visible = true
        })
      },
      // 导出
      exportExl () {
        const vm = this
        // 判断月份
        if (!vm.monthSelect.inputMonth) {
          this.$message({
            message: '导出月份不能为空！',
            type: 'warning',
            duration: duration
          })
          return false
        }

        // 判断是否在可导出日期数组内
        if (vm.periodDate.toString().indexOf(vm.monthSelect.inputMonth) < 0) {
          this.$message({
            message: '当前所选月份不可导出！',
            type: 'warning',
            duration: duration
          })
          return false
        }
        const indexData = store.getters.indexData
        const downloadUrl = `${process.env.BASE_API}/salary/exportExl.do?ent_id=${indexData.entAcctVO.id}&qymc=${indexData.nsrmc}&ssyf=${vm.monthSelect.inputMonth}&key=${new Date().getTime()}`
        const ele = document.getElementById('exportIframe')
        ele.setAttribute('href', downloadUrl) // 防止点击时属性值没有更新成功
        ele.click()
        clearTimeout(exportTimer)
        const exportTimer = setTimeout(function () {
          vm.monthSelect.visible = false
        }, 1700)
      },

      // 复制上一期
      copyPrev () {
        // 判断选择复制的月份是否为空
        if (this.monthSelect.inputMonth.replace(/(^\s*)|(\s*$)/g, '') === '') {
          this.$message({
            title: '请选择月份',
            message: '请选择月份',
            type: 'warning',
            duration: duration
          })
          return false
        }
        Loading.service(localParams)
        // 请求复制上一期的数据 year_period: this.monthSelect.inputMonth
        copyOfLastPeriod({}).then(
          res => {
            // const vm = this
            this.loading = true
            if (res.success) {
              this.$message({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: duration
              })
            }
            this.querySalaryList().then(res => {
              Loading.service().close()
            }, err => {
              Loading.service().close()
            })
          },
          error => {
            console.log(error)
            Loading.service().close()
          }
        )
      },
      // 删除整条清单
      handleDeleteListRow (row) {
        // 先判断是否已删除凭证
        this.$confirm('确认要删除该清单条目？删除后数据无法恢复！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Loading.service(localParams)
          deleteSalary({
            salaryId: `${row.bill_id},`
          }).then(
            res => {
              if (res.success) {
                this.$message({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: duration
                })
                this.querySalaryList().then(res => {
                  Loading.service().close()
                }, err => {
                  Loading.service().close()
                })
              }
              // window.location.reload()
            },
            error => {
              Loading.service().close()
              console.log(error)
            }
          )
        })
      },
      // 生成凭证
      generateVoucher () {
        Loading.service(localParams)
        const id = this.list[0].bill_id
        const accounts = store.getters.accountList.accounts
        const bankCode = filterAccount(accounts, ['1002']).toString()
        newVoucher({
          salaryId: `${id},`,
          bank_acctList: bankCode
        }).then(
          res => {
            this.$message({
              title: '成功',
              message: '生成凭证成功',
              type: 'success',
              duration: duration
            })
            this.isShowVoucher = false  // “生成凭证”的按钮不显示
            this.querySalaryList().then(res => {
              Loading.service().close()
            }, err => {
              Loading.service().close()
            })
          },
          error => {
            console.log(error)
            this.querySalaryList().then(res => {
              Loading.service().close()
            }, error => {
              Loading.service().close()
            })
          }
        )
      },
      // 删除凭证
      handleDeleteVoucher (voucherId) {
        Loading.service(localParams)
        deleteVoucher({
          billId: this.row.bill_id,
          voucherId: this.row.vch_id_list
        }).then(
          res => {
            if (res.success) {
              this.$message({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: duration
              })
            }
            this.isShowVoucher = true  // 重新显示“生成凭证”的按钮
            this.data = null
            this.dynatic.visible = false   // 关闭弹出页面
            // 重新获取工资表主页面的数据
            this.querySalaryList().then(res => {
              Loading.service().close()
            }, err => {
              Loading.service().close()
            })
          },
          error => {
            console.log(error)
            Loading.service().close()
          }
        )
      },
      // 查看详情
      viewDetail () {
        this.dynatic.visible = true
        this.dynatic.state = 'detail'
        // 获取单个清单列表数据
        this.getSalaryDeptDetail()
      },
      getSalaryDeptDetail () {
        Loading.service(localParams)
        getSalaryDeptDetail({
          salaryId: `${this.list[0].bill_id},`
        }).then(
          res => {
            Loading.service().close()
            this.$store.dispatch('GetBillData', res.data)
            this.dynatic.data = this.$store.state.salary.billData
            this.dynatic.visible = true
            // this.list = res.data.salaryDeptList && [res.data.salaryDeptList[0]]// 返回的新增的清单列表
          },
          error => {
            Loading.service().close()
            this.$message({
              title: '失败',
              message: '获取清单数据失败',
              type: 'fail',
              duration: duration
            })
            console.log(error)
          })
      },
      // 编辑 or 创建 清单
      handleClickDynatic (row) {
        Loading.service(localParams)
        this.row = deepCopy(row)
        // 如果是编辑状态，先判断是否已生成凭证, state = 2 已生成凭证
        this.list[0].vm_state === 2 || this.changeTaxType ? (this.dynatic.state = 'voucher') : (this.dynatic.state = 'edit')
        if (this.list[0].vm_state === 2) {
          const vtNumList = []
          const array = this.row.vt_num_list.split(',')
          for (const item of array) {
            if (item) {
              vtNumList.push(item)
            }
          }
          this.row.vt_num_list = vtNumList
        }
        this.getSalaryDeptDetail()
      },
      // 下拉按钮
      handleCommand (command) {
        this[command]()
      },
      // 复制上一期
      copyMonth () {
        this.monthSelect.visible = true
        this.monthSelect.inputMonth = ''
        this.monthSelect.state = 'copy'
        this.monthSelect.iframeSrc = ''
      },
      // 导出
      exportMonth () {
        this.monthSelect.visible = true
        this.monthSelect.inputMonth = ''
        this.monthSelect.state = 'export'
        this.monthSelect.iframeSrc = ''
      },
      // 新增的函数
      createBill () {
        this.dynatic.visible = true
        this.dynatic.state = 'create'
        this.$store.dispatch('GetBillData', {})
        this.dynatic.data = this.$store.state.salary.billData
      },
      // 新增
      handleCreateBill () {
        const cancelTips = '取消新增'
        this.switchTag(cancelTips, this.createBill)
      },
      // 导入
      handleImport () {
        const cancelTips = '取消导入'
        this.switchTag(cancelTips, this.importCallback)
      },
      copyOfLastPeriod () {
        Loading.service(localParams)
        copyOfLastPeriod({}).then(
          res => {
            // const vm = this
            if (res.success) {
              this.$message({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: duration
              })
            }
            this.querySalaryList().then(res => {
              Loading.service().close()
            })
          },
          error => {
            console.log(error)
            Loading.service().close()
          }
        )
      },
      // 弹出提示的函数
      switchTag (cancelTips, callback) {
        let tips = ''
        const month = parseInt(this.ssyf.slice(4))

        switch (month) {
          case 4:
            tips = '该月份为社保变更期间，请注意进行变更！'
            break
          case 7 :
            tips = '该月份为公积金变更期间，请注意进行变更！'
            break
          default:
            tips = ''
        }

        tips === '' ? callback() : this.$alert(tips, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              callback()  // 回调函数
            } else {
              this.$message({
                type: 'info',
                message: cancelTips
              })
            }
          }
        })
        this.monthSelect.visible = false
      },

      // 查看凭证
      checkVoucher (voucherId) {
        this.voucher.modal = true  // 控制页面显示或者是不显示
        this.voucher.curListIdx = null  // 这个是
        this.voucher.vch_id = voucherId   // 第一张凭证的id
        this.voucher.list = dealListForVoucher(this.list)  // 这个生成的所有的凭证的id，返回数组的形式
      },

      // 保存/保存并生成凭证
      handleSave () {
        this.dynatic.visible = false
        Loading.service().close()
        this.querySalaryList().then(res => {
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },

      // 导入会话框
      importCallback () {
        this.formModal.modal = true
      },

      // 导入 确认
      salaryImport () {
        this.init()
      },

      // 科目匹配
      handleMatchSubjects () {
        this.subjectModal.modal = true
      },

      // 图片
      handleImg (row) {
        this.imgModal.modal = true
        this.imgModal.billType = row.bill_type_id.toString()
        this.imgModal.row = row
      }
    },
    components: {
      // mainFileCreate,
      dynamicTable,
      VoucherMark,
      checkVoucher,
      ImportForm,    // 导入功能表单
      MatchSubject,  // 科目匹配
      FooterAmount,
      DetailFooter,
      HelpModal
    }
}
</script>
