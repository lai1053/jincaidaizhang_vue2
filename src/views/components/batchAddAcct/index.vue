<style lang="scss" scoped>
  .footer-tip{
    display: inline-block;
    text-align: left;
    float: left;
    line-height: 32px;
    font-size: 12px;
    color: #666666;
  }
</style>
<style lang="scss">
  .batch-add-acct{
    .el-table::before{
      height: 0;
      .el-table .cell {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
    .label-name{
      width: 180px;
      text-align: right;
      display: inline-block;
    }
  }
  .batch-add-acct-modal{
    position: absolute;
    top:50%;
    left:50%;
    margin-left:-340px;
    margin-top:-266px !important;
  }
</style>
<template>
  <el-dialog
    width="680px"
    :title="batchSubjectData.subTitle"
    :visible.sync="batchSubjectData.subModal"
    class="vau-add-sub"
    custom-class="batch-add-acct-modal"
    :close-on-click-modal="false"
    append-to-body
  >
    <div style="padding:10px 20px 30px 20px" class="batch-add-acct">
      <div style="margin-bottom:12px">
        <span class="label-name">上级科目名称（辅助类别）：</span>
        <el-select
          v-model="batchSubjectData.superiorSub.curVal"
          size="small"
          style="width: 390px"
          placeholder="请选择"
          filterable
          remote
          v-loadmore="loadMore"
          :remote-method="remoteMethod"
          @change="changeAcct"
          @visible-change="selectVisibleChange($event, batchSubjectData.superiorSub.curVal)"
        >
          <el-option
          v-for="(item) in batchSubjectData.superiorSub.options"
          :key="item.account"
          :label="item.account"
          :value="item.account"
          :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="batchSubjectData.isStock">
        <div style="margin-bottom:12px">
          <span class="label-name">规格型号：</span>
          <el-input
            v-model="batchSubjectData.guige"
            clearable
            size="small"
            style="width: 390px;"
          ></el-input>
        </div>
        <div style="margin-bottom:12px">
          <span class="label-name">计量单位：</span>
          <el-select v-model="batchSubjectData.unitName" size="small" placeholder="请选择" style="width: 390px">
            <el-option
              v-for="item in unitData"
              :value="item.name"
              :label="item.name"
              :key="item.name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div>
        <el-table
        :data="batchSubjectData.list"
        header-align="center"
        height="220"
        stripe
        highlight-current-row
        style="width: 100%"
        @cell-mouse-enter="mouseEnter"
        @cell-mouse-leave="mouseLeave"
        @cell-click="clickCell"
        >
          <el-table-column
          prop="name"
          class-name="edit-row-box"
          show-overflow-tooltip
          label="科目（辅助项目）名称"
          align="left"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.isEdit" >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="科目新增科目（辅助项目）名称不能为空！"
                  placement="top-start"
                  manual
                  v-model="visible"
                >
                  <el-input
                    v-model="scope.row.initVal"
                    size="small"
                    class="edit-input"
                    clearable
                    :placeholder="scope.row.newSubVal"
                    @focus="inputChange(scope.row.initVal)"
                    @input="inputChange"
                  ></el-input>
                </el-tooltip>
              </template>

              <template v-else>
                {{scope.row.initVal}}
                <i v-if="scope.row.showIcon" class="el-icon-edit edit-tip" style="right: 20px;"></i>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer">
      <div class="footer-tip">
        新增科目数：{{batchSubjectData.list.length}}条
      </div>
      <el-button size="small" type="primary" @click="add">增加</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {filterAccount} from '@/utils/filterAccount'
  import {Message, Loading, MessageBox} from 'element-ui'
  import {localParams, duration} from '@/views/components/data/common'
  import {batchAddNewKM} from '@/api/common'
  import {deepCopy} from '@/utils/assist'

  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {options} from '@/views/components/data/common'
  // 计量单位
  import {getUnit} from '@/api/common'
  export default {
    name: 'batchAddAcct',
    props: {
      batchSubjectData: Object
    },
    data () {
      return {
        upRow: {},
        editVal: '',
        visible: false,
        codeList: [],
        options: deepCopy(options),
        unitData: []
      }
    },
    watch: {
      'batchSubjectData.subModal': function () {
        if (this.upRow) {
          this.upRow.isEdit = false
        }
        this.getCodeeList()
      }
    },
    methods: {
      getCodeeList() {
        const {batchSubjectData} = this
        // const code = batchSubjectData.superiorSub.code
        this.getAccountList().then(allAccount => {
          // batchSubjectData.superiorSub.options = filterAccount(allAccount, code)
          this.codeList = batchSubjectData.superiorSub.options
          batchSubjectData.subTitle = '批量新增科目（辅助项目）'
        })
        getUnit().then(resp => {
          this.unitData = resp.data
        })
      },
      getAccountList () {
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
      changeAcct(val) {
        const {batchSubjectData} = this
        batchSubjectData.guige = ''
        batchSubjectData.unitName = ''
        batchSubjectData.assistCode = ''
        batchSubjectData.isStock = false
        const idx = this.codeList.findIndex(item => item.account === val)
        if (idx !== -1) {
          batchSubjectData.isStock = this.codeList[idx].stock
          batchSubjectData.assistCode = this.codeList[idx].assistCode
        }
      },
      mouseEnter (row) {
        if (row.isEdit) return
        row.showIcon = true
      },
      mouseLeave (row) {
        if (row.isEdit) return
        row.showIcon = false
      },
      clickCell (e, f) {
        if (e.isEdit) return
        if (!e) {
          this.visible = true
        } else {
          this.visible = false
        }
        const upRow = this.upRow
        if (upRow.isEdit) {
          upRow.isEdit = false
        }
        this.editVal = e.name
        e.isEdit = true
        e.showIcon = false
        this.upRow = e
      },
      inputChange (e) {
        if (!e) {
          this.visible = true
        } else {
          this.visible = false
        }
      },
      add () {
        const {batchSubjectData: {module, list, superiorSub: {curVal}, isStock, guige, unitName,  assistCode}} = this
        if (!curVal) {
          return Message({
            message: '上级科目（辅助项目）名称不能为空！',
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
        const subName = []
        for (const item of list) {
          if (!item.initVal) {
            return Message({
              message: '科目（辅助项目）名称不能为空！',
              type: 'warning',
              duration: duration
            })
          }
          subName.push(item.initVal)
        }
        Loading.service(localParams)
        batchAddNewKM({
          kmCode: curVal.split(' ')[0],
          subKms: subName,
          guige: guige,
          unitName: unitName,
          assistCode: assistCode,
          remark: module
        }).then(resp => {
          Loading.service().close()
          Message({
            message: resp.message,
            type: 'success',
            duration: duration
          })
          this.$store.dispatch('GetAccountList').then(respA => {
            this.$emit('on-batch-add-after', resp.data.data)
          })
          if (this.upRow) {
            this.upRow.isEdit = false
          }
          this.batchSubjectData.subModal = false
        }, error => {
          Loading.service().close()
        })
      },
      selectVisibleChange (val, model) {
        if (val) {
          const {batchSubjectData} = this
          batchSubjectData.superiorSub.options = selectVisibleChange(model, this.codeList, this.options)
        }
      },
      loadMore () {
        if (this.options.isLoadMore) {
          const {batchSubjectData} = this
          batchSubjectData.superiorSub.options = loadMore(batchSubjectData.superiorSub.options, this.codeList, this.options)
        }
      },
      remoteMethod (val) {
        const {batchSubjectData} = this
        batchSubjectData.superiorSub.options  = remoteMethod(val, this.codeList, this.options)
      }
    }
  }
</script>

<style scoped>

</style>
