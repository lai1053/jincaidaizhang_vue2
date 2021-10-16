<style lang="scss" scoped>
  .footer-tip{
    display: inline-block;
    text-align: left;
    float: left;
    line-height: 32px;
    font-size: 12px;
    color: #666666;
    .amount-box{
      display: inline-block;
      text-align: left;
    }
    .tip-color{
      margin-left: 252px;
      span{
        color: #FFA854;
      }
    }
  }
</style>
<style lang="scss">
  .fund-batch-add-acct {
    .el-table::before {
      height: 0;
      .el-table .cell {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
    .el-table--border th{
      border-bottom: none;
    }
    .fund-batch-table {
      td {
        border-right: none;
      }
      td.grey-border{
        border-right: 1px solid #ebeef5;
      }
      thead.is-group{
        th {
          border-right: none;
          border-bottom: none;
        }
      }
      thead.is-group{
        th.grey-border {
          border-right: 1px solid #ebeef5;
        }
      }
    }

  }
  .fund-batch-add-sub{
    position: absolute;
    top:50%;
    left:50%;
    margin-left:-550px;
    margin-top:-262px !important;
  }
</style>
<template>
  <el-dialog
    width="1100px"
    :title="batchAddAcctModal.subTitle"
    :visible.sync="batchAddAcctModal.subModal"
    class="vau-add-sub"
    custom-class="fund-batch-add-sub"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="fund-batch-add-acct">
      <el-table
        :data="batchAddAcctModal.list"
        heiglight-current-row
        header-align="center"
        stripe
        height="396"
        @cell-mouse-enter="mouseEnter"
        @cell-mouse-leave="mouseLeave"
        @row-click="clickRow"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        :cell-class-name="hasBorder"
        :header-cell-class-name="hasBorder"
        ref="batchAddAcctTable"
        style="width: 100%"
        class="fund-batch-table"
      >
        <el-table-column
          width="50px"
          align="center"
          cess-style="hideRowName"
          type="selection"
        >
        </el-table-column>
        <el-table-column
          type="index"
          label="行号"
          cess-style="hideRowName"
          width="50">
        </el-table-column>
        <el-table-column
          prop="counterparty"
          label="对方户名"
          width="200px"
          :show-overflow-tooltip="showTooTip"
          sortable="custom"
          class-name="batch-edit-row-box"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.showIcon"
               class="el-icon-edit edit-tip" style="right: 20px;"></i>
            {{scope.row.counterparty}}
          </template>

        </el-table-column>
        <el-table-column
          prop="collectionTotal"
          label="收款流水"
          width="100px"
          sortable="custom"
          :show-overflow-tooltip="showTooTip"
        ></el-table-column>
        <el-table-column
          prop="paymentTotal"
          label="付款流水"
          width="100px"
          sortable="custom"
          :show-overflow-tooltip="showTooTip"
        ></el-table-column>
        <el-table-column
          label="新增科目（辅助项目）"
          align="center"
        >
          <el-table-column
            prop="higherSub"
            label="上级科目（辅助类别）"
            width=""
            :show-overflow-tooltip="showTooTip"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.isEdit">
                <el-select
                  v-model="scope.row.higherSub"
                  size="small"
                  style="width: 226px;"
                  placeholder="请选择"
                  filterable
                  remote
                  v-loadmore="loadMore"
                  :remote-method="remoteMethod"
                  @visible-change="selectVisibleChange($event, scope.row.higherSub)"
                  @change="handleChange(scope.row)"
                >
                  <el-option
                    v-for="item in accountList"
                    :key="item.account"
                    :label="item.account"
                    :value="item.account"
                    :disabled="item.disabled"></el-option>
                </el-select>
              </template>
              <template v-else>{{scope.row.higherSub}}</template>
            </template>
          </el-table-column>
          <el-table-column
            prop="newAcct"
            label="科目（辅助项目）名称"
            width=""
            :show-overflow-tooltip="showTooTip"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.isEdit">
                <el-input
                  size="small"
                  clearable
                  v-model="scope.row.newAcct"
                ></el-input>
              </template>
              <template v-else>{{scope.row.newAcct}}</template>
            </template>

          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <div class="footer-tip">
        <div class="amount-box">合计：<span class="text-color">{{batchAddAcctModal.list.length}}</span>条</div>&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="amount-box">已选中<span class="text-color">{{batchAddAcctModal.selectedList.length}}</span>条</div>
        <div class="amount-box tip-color"><span>温馨提示：</span>为对账单中的“对方户名”批量增加核算科目</div>
      </div>
      <el-button size="small" type='primary' @click="SaveBatchAddSub">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // 组件
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import {Message, Loading, MessageBox} from 'element-ui'
  import {localParams, duration} from '@/views/components/data/common'

  import {filterAccount} from '@/utils/filterAccount'
  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {options} from '@/views/components/data/common'
  import {deepCopy} from '@/utils/assist'
  import {sortChange} from '@/utils/utils'
  import {batchAddNewKM, getFundContactList
  } from '@/api/fund'

  export default {
    data() {
      return {
        upRow: {},
        accountList: [],
        // codeList: [],
        options: deepCopy(options),
        showTooTip: true
      }
    },
    props: {
      batchAddAcctModal: Object
    },
    created() {
      // this.getCodeList()
    },
    methods: {
      getCodeList () {
        this.getAccountList().then(allAccount => {
          this.codeList = filterAccount(allAccount, [])
        })
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
      sortChange (e) {
        if (e.prop) {
          sortChange(this.batchAddAcctModal.list, e)
        }
      },
      clickRow (e) {
        if (e.isEdit) return
        const upRow = this.upRow
        if (upRow.isEdit) {
          upRow.isEdit = false
        }
        e.isEdit = true
        e.showIcon = false
        this.upRow = e
      },
      handleSelectionChange (list) {
        this.batchAddAcctModal.selectedList = list
      },
      selectVisibleChange (val, model) {
        if (val) {
          this.accountList = selectVisibleChange(model, this.batchAddAcctModal.contactCode, this.options)
        }
      },
      loadMore () {
        if (this.options.isLoadMore) {
          this.accountList = loadMore(this.accountList, this.batchAddAcctModal.contactCode, this.options)
        }
      },
      remoteMethod (val) {
        this.accountList  = remoteMethod(val, this.batchAddAcctModal.contactCode, this.options)
      },
      mouseEnter (row) {
        if (row.isEdit) {
          return
        }
        row.showIcon = true
      },
      mouseLeave (row) {
        if (row.isEdit) {
          return
        }
        row.showIcon = false
      },
      handleChange(row) {
        row.assistCode = ''
        const {contactCode} = this.batchAddAcctModal
        const idx = contactCode.findIndex(item => item.account === row.higherSub)
        if (idx === -1) return
        row.assistCode = contactCode[idx].assistCode
      },
      SaveBatchAddSub () {
        const {selectedList, list} = this.batchAddAcctModal
        const newAccountList = []
        if (selectedList.length === 0) {
          return Message({
            message: '要新增科目，请选择至少1条数据！',
            type: 'warning',
            duration: duration
          })
        } else {
          let message = ''
          let idx = ''
          let isSave = true
          for (let i = 0; i < selectedList.length; i++) {
            if (!selectedList[i].higherSub) {
              idx = list.findIndex(item => item === selectedList[i])
              message = `第${idx + 1}行上级科目不能为空！`
              isSave = false
              break
            }
            if (!selectedList[i].newAcct) {
              idx = list.findIndex(item => item === selectedList[i])
              message = `第${idx + 1}行新增科目名称不能为空！`
              isSave = false
              break
            }
            newAccountList.push({
              parentCode: selectedList[i].higherSub.split(' ')[0],
              name: selectedList[i].newAcct,
              assistCode: selectedList[i].assistCode
            })
            isSave = true
          }
          if (!isSave) {
            return Message({
              message: message,
              type: 'warning',
              duration: duration
            })
          }
          Loading.service(localParams)
          batchAddNewKM({flowKMVOList: newAccountList}).then(resp => {
            Loading.service().close()
            Message({
              message: resp.message,
              type: 'success',
              duration: duration
            })
            this.$store.dispatch('GetAccountList').then(respA => {
              this.batchAddAcctModal.echoList = selectedList
              this.$emit('on-batch-add-after', resp.data)
            })
            if (this.upRow) {
              this.upRow.isEdit = false
            }
            this.$refs.batchAddAcctTable.clearSelection()
            this.batchAddAcctModal.subModal = false
          }, error => {
            Loading.service().close()
          })
        }
      },
      hasBorder ({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 4) {
          return 'grey-border'
        }
      }
    },
    components: {
      FooterPagination
    }
  }
</script>

<style scoped>

</style>
