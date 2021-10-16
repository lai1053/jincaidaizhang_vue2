<style lang='scss' scoped>
  .el-icon-success {
    color: #67C23A;
  }

  .el-icon-warning {
    color: #E6A23C;
  }
  .statics{
    margin-top:15px;
    .hasMatchedAmount{
      margin-left:20px;
    }
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
  .auto-complete, .auto-complete-t {
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
  .match-subject{
    .el-select{
      width:80%;
      .el-input__inner{
        height:30px;
        line-height:30px;
        border-color:#e0efef;
      }
    }
    .matchSubHead{
      height:46px;
      .el-radio-group{
        margin-left: 40px;
        margin-top: 10px;
      }
      .el-input{
        float:left;
        width:auto;
        /*margin-right:40px;*/
        /*margin-top: 0px;*/
        .el-input__inner{
          border-color:#e8e8e8;
          height:34px;
          line-height:34px;
          border-radius:2px;
        }
        .el-input__icon{
          line-height:35px;
        }
      }
      .head_radio-group{
        float: left;
        /*margin-top:5px;*/
        .el-radio+.el-radio{
          margin-left:20px;
        }
      }
      .head_input{
        float:left;
        width:182px;
        padding-left:25px;
        height:34px;
        line-height:34px;
        border:1px solid #e8e8e8;
        margin-left:40px;
        outline:none;
        border-radius:2px;
      }
      .head_resetMatch--btn{
        float: right;
        margin-top:-5px;
        margin-bottom: 15px;
      }
    }
  }

  .tableContain{
    border:1px solid #e8e8e8;
    .el-table--scrollable-x .el-table__body-wrapper{
      overflow-x:hidden;
    }
    .el-table__row{
      td:first-child{
        .cell{
          padding-left: 40px;
        }
      }
      td:first-child:not([colspan]){
        text-indent: 3em;
      }

    }
  }
  .el-icon-circle-plus-outline{
    color:#999999
  }
  .main-type-class {
    .main-type-class {
      text-align: center;
    }
  }
</style>
<template>
  <div class="match-subject">
    <div class="matchSubHead">
      <div class="head_radio-group">
        <el-input v-model="headInputVal" @input="inpFilter" placeholder="请输入业务名称">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-radio-group v-model="radio" @change="changeRadioType">
          <el-radio label="subjectRest">未配置</el-radio>
          <el-radio label="subjectAll">全部</el-radio>
        </el-radio-group>
      </div>
      <div class="head_resetMatch--btn">
        <el-button size="medium" type='primary' @click="updateSubjcetMatch">保存</el-button>
        <el-button size="medium" type='primary' @click="handleRefresh">重新配置</el-button>
      </div>
    </div>
    <div class="tableContain" ref="tableContain">
      <el-table
        :data="list"
        :span-method="spanMethod"
        v-loading="loading"
        header-align="center"
        height="400"
        stripe
        highlight-current-row
        ref="tableScroll"
        style="width: 100%">

        <!--业务项-->
        <el-table-column
          prop="date"
          label="业务项"
          width="380"
          label-class-name="main-type-class"
          align="left">
          <template slot-scope="scope">
            <!--<span v-if="scope.row.acct_code.length===4">{{scope.row.acct_code.replace(/[0-9]/g, '&nbsp;&nbsp;')}}</span>-->
            <!--<span v-if="scope.row.acct_code.length>4">{{scope.row.acct_code.slice(0, scope.row.acct_code.length - 1).replace(/[0-9]/g, '&nbsp;&nbsp;')}}-</span>-->
            <!--<span v-if="scope.row.acct_code.length>4">{{scope.row.acct_code}}</span>-->
            <span>{{scope.row.acct_name}}</span>
          </template>
        </el-table-column>

        <!-- 本账套科目 -->
        <el-table-column
          prop="name"
          label="本账套科目"
          width="389"
          align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.acct_val"
              auto-complete
              filterable
              width="106px"
              class="vue-edit-box"
              popper-class="auto-complete"
              clearable
              placeholder="请选择科目"
              @change="handleChange(scope.row)"
              @clear="handleClear(scope.row)"
              @focus="handleToggle(scope.row)">
              <el-option
                v-for="(val, i) in scope.row.acct_list"
                :key="i"
                :label="val"
                :value="val">
              </el-option>
              <!-- 默认状态下 -->
              <div class="auto-complete-btn" @click="addSub(scope.row)"
                   v-if="scope.row.acct_code.length > 4  && !scope.row.acct_val && !scope.row.dest_acct_code && !scope.row.dest_acct_name">
                <i class="el-icon-circle-plus-outline"></i>
                <span>新增</span>
              </div>
              <!-- 清除数据后 -->
              <div class="auto-complete-btn" @click="addSub(scope.row)"
                   v-if="!scope.row.acct_val && scope.row.acct_code.length > 4">
                <i class="el-icon-circle-plus-outline"></i>
                <span>新增</span>
              </div>
            </el-select>
          </template>
        </el-table-column>


        <!--配置状态 start-->
        <el-table-column
          prop="address"
          label="配置状态"
          width="92"
          align="center">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.is_matched === 1"></i>
            <i class="el-icon-warning" v-if="scope.row.is_matched === 0"></i>
          </template>
        </el-table-column>
        <!--配置状态 start-->

        <!-- 方式 start-->
        <el-table-column
          prop="address"
          label="方式"
          width="160"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.is_auto ? '自动' : '手动'}}</span>
          </template>
        </el-table-column>
        <!-- 方式 end-->
      </el-table>
    </div>


    <div class="statics">
      <span>未配置数：{{needMatch}}</span>
      <span class="hasMatchedAmount" v-show="radio==='subjectAll'">已配置数：{{hasMatch}}</span>
      <!--<span>重新配置业务数 {{reMatchNum}} 个</span>-->
    </div>
    <!-- 新增 -->
    <!--<add-subject :addSubjectModal="addSubjectModal"-->
                 <!--:subjectData="addSubjectModal.subject"-->
                 <!--:newAddRowParam = "addSubjectModal.newAddRowParam"-->
                 <!--@confirm="handleConfirm"></add-subject>-->
    <add-subject
      :subject-data="subjectData"
      @on-add-after="onAddSubAfter"
    ></add-subject>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {sortTit, createSubject, createParamObj} from '@/views/components/MatchSubject/common'
  import addSubject from '@/views/components/AddAcct/index'
  import {localParams, duration, subData} from '@/views/components/data/common'
  import {deepCopy} from '@/utils/assist'
  import {getCurrencyCode} from '@/views/components/AddAcct/eval'
  import {getLastStageCode} from '@/utils/eval'
  import {
    initAddAcct,          // 拉取新增科目
    SubjectMatch,
    updateSubjcetMatch,
    subjectMatchAgain,
    toAddAcct
  } from '@/api/common'

  export default {
    name: 'match-subject',
    data () {
      return {
        list: [],
        needMatch: 0,  // 未匹配数据条数
        reMatchNum: 0,
        hasMatch: 0, // 已匹配数据条数
        loading: false,
        timeout: 300,
        radio: 'subjectRest',  // subjectAll 全部，subjectRest 未匹配
        hasMatchList: [],  // 未匹配数据
        allList: [], // 全部数据
        acctList: [],
        addSubjectModal: {
          visible: false,
          subject: {},
          newAddRowParam: {}  // 传递给科目新增的参数
        },
        row: null,
        isShowAdd: true,
        num: 1,
        headInputVal: '',  // 搜索框的值
        submitData: [],     // 要提交的增量匹配的数据
        subjectData: deepCopy(subData), // 科目新增
        currencyCode: getCurrencyCode('fund'),
        rowData: {}
      }
    },
    props: {
      subjectModal: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      ...mapGetters([
        'accountList'   // 科目列表
      ]),
      tableScroll () {
        return this.$refs.tableScroll.$refs.bodyWrapper
      },
      // 获取科目列表，为末级科目列表
      accountList () {
        return getLastStageCode([])
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        const param = this.radio === 'subjectRest' ? 0 : ''
        this.loading = true
        SubjectMatch(param).then(res => {
          this.loading = false
          this.dealWithData(res)  // 处理响应回来的数据
          this.list = this.radio === 'subjectRest' ? this.hasMatchList : this.list
        }, error => {
          this.$message({
            title: '失败',
            message: '请求失败',
            type: 'fail',
            duration: duration
          })
          this.loading = false
          console.log(error)
        })
      }, // 新增科目
      addSub (row) {
        this.subjectData = deepCopy(subData)
        this.subjectData.superiorSub.code = []
        this.subjectData.accounting.code = this.currencyCode
        this.subjectData.accounting.type =  'all'
        this.subjectData.subModal = true
        this.subjectData.newSubVal = row.counterparty
        this.rowData = row
      },
      // 新增科目保存后触发的事件
      onAddSubAfter (code) {
        const {newSubVal} = this.subjectData
        this.rowData.acct_val = `${code} ${newSubVal}`
        this.changeCurStatus(this.rowData)
        this.addSubmitData(this.rowData)
      },
      // 改变当前表格的匹配的状态
      changeCurStatus (row) {
        row.is_matched = 1  // 匹配状态为“已匹配”
        row.is_auto = 0     // 匹配方式为“手动”
      },
      // 组装请求参数submitData的元素
      addSubmitData (row) {
        const obj = this.isSameObj(createParamObj(row))
        obj !== undefined && obj !== '' ? this.submitData.push(obj) : ''
      },
      // 创建表格标题对象
      titleObj (charNum) {
        return new Object({
          'acct_code': '',             // 内置科目code
          'acct_name': `${charNum}`,   // 内置科目
          'is_matched': '',            // 匹配状态
          'is_auto': '',               // 是否自动
          'dest_acct_code': '',        // 本账科目
          'dest_acct_name': '',        // 本账科目
          'acct_val': '',              // 本账科目
          'acct_list': [],
          'colspan': true
        })
      },
      // 检查是否是同一个对象
      isSameObj (obj) {
        if (this.submitData.length !== 0) {
          for (const v of this.submitData) {
            let flag = false
            const differAttr = {
              acct_code: v.acct_code,
              acct_name: v.acct_name,
              dest_acct_code: v.dest_acct_code,
              dest_acct_name: v.dest_acct_name
            }
            for (const i in differAttr) {
              if (obj.hasOwnProperty(i) && obj[i] !== i) {
                flag = true
              }
            }
            obj = flag === true ? obj : undefined
            return obj
          }
        } else {
          return obj
        }
      },
      /* 表格标题合并列 */
      spanMethod ({row, column, rowIndex, columnIndex}) {
        if (row && row.colspan) {
          if (columnIndex === 0) {
            return {
              rowspan: 1,
              colspan: 4
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      // 格式化返回的数据
      dealWithData (respData) {
        const num = ['一、', '二、', '三、', '四、', '五、', '六、', '七、', '八、', '九、', '十、']
        const resp = respData.data.data
        const arr = []
        // 把数据过滤成框架需要的数据格式
        const titArr = sortTit(Object.keys(resp))
        titArr.map((v, index) => {
          const charNum = num[index] + v.slice(1)
          const titObj = this.titleObj(charNum)
          if (resp[v].length !== 0) {
            arr.push(titObj)
            resp[v].map(v => {
              arr.push(createSubject(v))
            })
          }
          titObj.is_matched = resp[v].filter(v => v.is_matched === 0).length === 0 ? 1 : 0
        })

        this.list = arr.slice(0, 50)  // 一进来获取北京的全部科目,由于框架加载慢的问题，这里直截取全部数据中的50条
        this.allList = arr // 全部科目列表
        this.hasMatchList = this.allList.filter(v => v.is_matched === 0) // 未匹配科目的列表
        this.needMatch = respData.data.xppNum  // 需匹配（数值，表示还没匹配的科目数量）
        this.hasMatch = respData.data.yppNum   // 已匹配（数值，表示还已经匹配的科目数量）
        this.resetScrollParam()
      },
      // 获取下拉科目总表
      handleToggle (row) {
        row.acct_list = this.accountList
      },
      // 保存
      updateSubjcetMatch () {
        updateSubjcetMatch({
          detialList: deepCopy(this.submitData)
        }).then(res => {
          if (res.success) {
            // row.is_matched = row.acct_val ? 1 : 0
            // 更新浏览器缓存的科目匹配数据
            this.$store.dispatch('GetMatchAccountList').then(res => {
              this.init()  //  刷新，重新初始化页面
            }, error => {
              console.log(error)
            })
          }
        }, error => {
          this.$message({
            title: '失败',
            message: '请求失败',
            type: 'fail',
            duration: duration
          })
          console.log(error)
        })
        this.submitData = []
      },
      // 输入框清空数据
      handleClear (row) {
        row.is_matched = 0
      },
      // 点击下拉，输入框的值改变
      handleChange (row) {
        this.changeCurStatus(row)
        this.addSubmitData(row)
        this.reMatchNum = this.submitData.length
      },
      // 重新匹配
      handleRefresh () {
        this.$confirm('重新匹配，将删除所有已建立匹配关系！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          subjectMatchAgain({}).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: duration
            })
            this.init()
          }, error => {
            this.$message({
              title: '失败',
              message: '请求失败',
              type: 'fail',
              duration: duration
            })
            console.log(error)
          })
        })
      },
      // 表格滚动触发的事件，超出高度400，数据继续加载
      scrollEvent () {
        const self = this
        self.tableScroll.addEventListener('scroll', () => {
          const total = self.radio === 'subjectAll' ? self.needMatch + self.hasMatch : self.needMatch// 数据总条数
          const curBox = self.tableScroll.getElementsByClassName('el-table__body')[0]
          if (self.tableScroll.scrollTop > (curBox.offsetHeight - self.tableScroll.offsetHeight - 10)) {  // 如果表格滚到接近底部
            if (self.num * 50 < total) {   // 并且数据的条数少于总条数，则每次加载50条
              let addArr = []
              const list = self.radio === 'subjectAll' ? self.allList : self.hasMatchList
              if (self.radio === 'subjectAll') {
                // 计算追加的数据
                addArr = list.slice(self.num * 50).length < 50 ? list.slice(self.num * 50) : list.slice(self.num * 50, (self.num + 1) * 50)
              }
              self.list = self.list.concat(addArr)
              self.num++  // 数据追加
            }
          }
        })
      },
      // 输入框查询的时候的过滤规则
      inpFilter () {
        const valStr = this.headInputVal.replace(/^\s+|\s+$/g, '')
        const result = []
        const data = this.radio === 'subjectAll' ? this.allList : this.hasMatchList
        data.forEach(function (item) {
          const itemName = item.acct_code + ' ' + item.acct_name
          itemName.replace(/^\s+|\s+$/g, '').indexOf(valStr) > -1 ? result.push(item) : ''  // 过滤数据
        })
        this.list = result
        const hasMatchAmount = result.filter(v => v.is_matched === 1)
        this.hasMatch  = hasMatchAmount.length  // 已匹配科目数
        this.needMatch = result.length - this.hasMatch  // 未匹配科目数
      },
      changeRadioType (val) {
        if (val === 'subjectRest') {
          this.list = this.hasMatchList.slice(0, 50)
        } else if (val === 'subjectAll') {
          this.list = this.allList.slice(0, 50)
        }
        if (this.headInputVal.toString()) {
          this.inpFilter()
        }
        // 重置懒加载的参数
        this.resetScrollParam()
      },
      // 重置参数
      resetScrollParam () {
        // 重置以下三个参数
        this.num = 1
      },
      ...mapMutations({
        setAcctList: 'SET_ACCOUNT_LIST'
      })
    },
    mounted () {
      this.scrollEvent()
    },
    watch: {
      // 监听当页面打开的状态
      subjectModal (v) {
        if (v) {
          // 重置输入框的值
          this.headInputVal = ''
          // 重置radio的值
          this.radio = 'subjectRest'
          // 初始化页面
          this.init()
        }
      }
    },
    components: {
      addSubject
    }
  }
</script>
