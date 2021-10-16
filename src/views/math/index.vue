<style lang='scss' scoped>
  .el-icon-success {
    color: #67C23A;
  }
  .el-icon-warning {
    color: #E6A23C;
  }
  .statics{
    margin-top: 15px;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;
    .hasMatchedAmount{
      margin-left:20px;
    }
  }
  .edit-assi-box {
    text-align: left;
    text-indent: 14px;
    display: inline-block;
    position: relative;
    width: calc(100% - 28px);
    height: 30px;
    line-height: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
<style lang='scss'>
  .el-icon-edit{
    position: relative;
    cursor:pointer;
    text-align: center;
    width: 30px;
    height: 30px;
  }
  .match-subject{
    margin-top: 10px;
  }
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
  .text-tips{
    overflow:hidden;
    vertical-align:top;
    cursor:pointer;
    display: inline-block;
    margin: 4px 0 0 -5px;
    opacity:0;
    height: 30px;
    line-height:30px;
    width: 40px;
  }
  .match-subject{
    .el-select{
      width:90%;
      max-width: 340px;
      .el-input__inner{
        height: 32px;
        line-height: 32px;
        border-color:#e0efef;
      }
    }
    .el-table__body-wrapper .el-table_1_column_2{
      .cell{
        text-align: left;
      }
    }
    .edit-row-box{
      .cell {
        padding-right: 10px;
        position: relative;
        height: 32px;
      }
      .more-tips-content{
        display: inline-block !important;
        height: 30px;
        line-height: 30px;
      }
      .edit-tip {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 16px;
        position: absolute;
        right: 10px;
        top: 50%;
        margin-top: -10px;
      }
    }
    .matchSubHead{
      height: 42px;
      margin: 0 10px;
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
        margin-top: -2px;
        /*margin-bottom: 15px;*/
      }
    }
  }

  .tableContain{
    /*border:1px solid #e8e8e8;*/
    .el-table--scrollable-x .el-table__body-wrapper{
      overflow-x:hidden;
    }
    .el-table__row{
      td:first-child{
        .cell{
          padding-left: 50px;
        }
      }
      td:first-child:not([colspan]){
        text-indent: 3.5em;
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
  .el-table thead th.is-leaf{
    border-left: 1px solid #f3f3f8;
    border-bottom: 1px solid #f3f3f8;
    &:nth-of-type(1){
      border-left:none;
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
        :height="clientHeight"
        stripe
        highlight-current-row
        ref="tableScroll"
        @cell-mouse-enter="mouseEnter"
        @cell-mouse-leave="mouseLeave"
        @cell-click="clickCell"
        style="width: 100%">

        <!--业务项-->
        <el-table-column
          prop="date"
          label="业务项"
          width=""
          label-class-name="main-type-class"
          align="left"
          >
          <template slot-scope="scope">
            <span>{{scope.row.acct_name}}</span>
          </template>
        </el-table-column>

        <!-- 本账套科目 -->
        <el-table-column
          prop="name"
          label="本账套科目"
          width=""
          align="center"
          class-name="edit-row-box">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <el-select
                v-model="scope.row.acct_val"
                filterable
                remote
                width=""
                class="vue-edit-box"
                clearable
                placeholder="请选择科目"
                v-loadmore="loadMore"
                :remote-method="remoteMethod"
                @change="handleChange(scope.row)"
                @clear="handleClear(scope.row)"
                @focus="handleToggle(scope.row)"
                @blur="handleBlur">
                <el-option
                  v-for="(item, i) in subjectList"
                  :key="i"
                  :label="item.account"
                  :value="item.account">
                  <div style="position: relative">
                    {{item.account}}  <!--真正的下拉选项信息-->
                    <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">  <!--下拉选项的提示信息-->
                      <span class="text-tips">{{item.account}}</span>
                    </el-tooltip>
                  </div>
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <div class="edit-assi-box">
                <el-tooltip :disabled="!scope.row.acctCodeName" class="item" effect="dark" :content="scope.row.acctCodeName" placement="top-start">
                  <span class="edit-content more-tips-content">{{scope.row.acct_val}}</span>
                </el-tooltip>
              </div>
            </template>
            <i v-if="scope.row.showIcon"
               class="el-icon-edit edit-tip text-color"></i>
          </template>
        </el-table-column>


        <!--配置状态 start-->
        <el-table-column
          prop="address"
          label="配置状态"
          width="220"
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
          width="220"
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
    <!--&lt;!&ndash; 新增 &ndash;&gt;-->
    <!--<add-subject-->
    <!--:subject-data="subjectData"-->
    <!--@on-add-after="onAddSubAfter"-->
    <!--&gt;</add-subject>-->
  </div>
</template>

<script>
  import { mapGetters} from 'vuex'
  import {sortTit, createSubject, createParamObj} from '@/views/math/common'
  import addSubject from '@/views/components/AddAcct/index'
  import {getCurrencyCode} from '@/views/components/AddAcct/eval'
  import {localParams, duration, subData} from '@/views/components/data/common'
  import {deepCopy} from '@/utils/assist'
  import {getLastStageCode} from '@/utils/eval'
  import {
    initAddAcct,          // 拉取新增科目
    SubjectMatch,
    updateSubjcetMatch,
    subjectMatchAgain,
  } from '@/api/common'
  import {getUrlData} from '@/utils/validate'
  const url = decodeURI(window.location.href).split('?')
  const urlInfo = getUrlData(url[1])
  const ITEMSIZE = 20
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
        // clientHeight: 0,
        radio: 'subjectAll',  // subjectAll 全部，subjectRest 未匹配
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
        rowData: {},
        titObjArr: [],  // 科目的一级标题组成的数组
        itemNum: 1,
        subjectList: [],
        inputWord: undefined,
        upRow: {},
        titObj:{}
      }
    },
    computed: {
      ...mapGetters([
        'subjectMatch'   // 科目列表
      ]),
      tableScroll () {
        return this.$refs.tableScroll.$refs.bodyWrapper
      },
      // 获取科目列表，为末级科目列表
      accountList () {
        return getLastStageCode([])
      },
      clientHeight (){
        return document.documentElement.clientHeight - 110
      }
    },
    created () {
      this.init()
    },
    methods: {
      clickCell (e, f) {
        if (e.isEdit === undefined) {
          this.upRow.isEdit = false
          e.showIcon = false
        } else {
          this.upRow.isEdit = true
          e.showIcon = false
        }
        if (e.isEdit || f.property !== 'name') return
        e.isEdit = true
        e.showIcon = false
        if (this.upRow.isEdit) {
          this.upRow.isEdit = false
        }
        this.upRow = e
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
      handleBlur () {
        this.inputWord = undefined
      },
      remoteMethod (keyword) {
        const self = this
        let arr = []
        this.timer ? clearTimeout(this.timer) : ''
        this.inputWord = keyword
        if (keyword) {
          this.timer = setTimeout(() => {
            arr = self.accountList.filter(v => {
              return v.account.indexOf(keyword) > -1
            })
            this.filterAccount = arr
            this.subjectList = this.filterAccount.slice(0, ITEMSIZE)
          }, 8)
        } else {
          this.subjectList = this.accountList.slice(0, ITEMSIZE)
        }
      },
      loadMore () {
        this.itemNum++
        const length = this.subjectList.length
        const list =  this.inputWord === undefined ? this.accountList.slice(length, length + ITEMSIZE) : this.filterAccount.slice(length, length + ITEMSIZE)
        this.subjectList = Array.from(new Set(this.subjectList.concat(list)))
      },
      init (isUpdate) {
        const param = this.radio === 'subjectRest' ? 0 : ''
        this.loading = true
        // 重新匹配科目后要重新拉取匹配科目的接口获取数据
        SubjectMatch(param, urlInfo.isSimpleAccount).then(res => {
          this.initData(res)
        }, error => {
          this.loading = false
        })
      },
      initData (data) {
        this.loading = false
        this.dealWithData(data)  // 处理响应回来的数据
        this.list = this.radio === 'subjectRest' ? this.hasMatchList : this.list
        // if (isUpdate === 'update' && this.radio === 'subjectRest' && this.hasMatchList.length === 0){
        //   this.radio === 'subjectAll'
        //   this.list = this.list
        // }
        this.headInputVal = ''
      },
      // 新增科目
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
        // this.changeCurStatus(this.rowData)
        this.addSubmitData(this.rowData)
      },
      // 改变当前表格的匹配的状态
      changeCurStatus (row) {
        row.is_matched = row.acct_val.trim() ? 1 : 0// 匹配状态为“已匹配”
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
        const NUM = ['一、', '二、', '三、', '四、', '五、', '六、', '七、', '八、', '九、', '十、']
        const resp = respData.data.data
        const arr = []
        // 把数据过滤成框架需要的数据格式
        const titArr = sortTit(Object.keys(resp)) // 把返回来的对象的标题组成一个数组，按序号对数组元素排序

        titArr.map((v, index) => {
          // const charNum = NUM[index] + v.slice(1) // 把标题拼接字符串
          const title = v.replace(/^\d*/, '')
          const  charNum = NUM[index] + title
          const titObj = this.titleObj(charNum)   // 创建显示要求的标题对象格式

          if (resp[v].length !== 0) {   // 遍历响应数据，如果一级标题下对应的数组不为空
            arr.push(titObj)            // 在创建的数组中先添加这个标题
            resp[v].map(v => {          // 再把这个一级标题对应的数组元素添加进这个数组中
              v.acct_list = this.accountList
              v.isEdit = false
              v.showIcon = false
              arr.push(createSubject(v))// createSubject这个方法是将数组元素处理成组件要求的对象格式
            })
          }
          // 处理：如果响应的数据中，有的科目的状态是“未匹配”，那么这个科目的标题的状态也改成未匹配
          titObj.is_matched = resp[v].filter(v => v.is_matched === 0).length === 0 ? 1 : 0
          this.titObjArr.push(titObj)  // 标题对象数组
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
        this.subjectList = this.accountList.slice(0, ITEMSIZE)
      },
      // 保存
      updateSubjcetMatch () {
        if (this.submitData.length === 0) {
          this.$message({
            title: '提示',
            message: '未匹配任何业务，请重新选择匹配业务',
            type: 'warning',
            duration: duration
          })
        } else {
          updateSubjcetMatch({
            detialList: deepCopy(this.submitData)
          }).then(res => {
            if (res.success) {
              // 更新浏览器缓存的科目匹配数据
              this.$store.dispatch('GetMatchAccountList').then(res => {
                this.init('update')  //  刷新，重新初始化页面
              }, error => {
              })
            }
            this.submitData = []
          }, error => {
          })
        }
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
              duration: 3000
            })
            this.init()
          }, error => {
            this.$message({
              title: '失败',
              message: '请求失败',
              type: 'fail',
              duration: 2000
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
            if (self.num * 50 < total + this.titObjArr.length) {   // 并且数据的条数少于总条数，则每次加载50条
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
        const result = []           // 不包含一级标题的数组
        const resultWidthoutTit = []   // 包含了一级标题的数组
        let data = this.radio === 'subjectAll' ? this.allList : this.hasMatchList
        // 处理一下，过滤掉标题
        data = data.filter(v => v.colspan !== true)
        // 筛选满足搜索的要求的项
        data.forEach(function (item) {
          const itemName = item.acct_code + ' ' + item.acct_name
          itemName.replace(/^\s+|\s+$/g, '').indexOf(valStr) > -1 ? result.push(item) && resultWidthoutTit.push(item) : ''  // 过滤数据
        })
        // 过滤并插入一级标题
        this.titObjArr.map((v, i) => {
          var eleIndex = i + 1
          var hasEle = result.findIndex((ele) => {
            return ele.acct_catalog === eleIndex
          })
          if (hasEle !== -1) {
            result.splice(hasEle, 0, v)
          }
        })
        this.list = result  // 处理列表数据
        const hasMatchAmount = resultWidthoutTit.filter(v => v.is_matched === 1)
        this.hasMatch  = hasMatchAmount.length  // 已匹配科目数
        this.needMatch = resultWidthoutTit.length - this.hasMatch  // 未匹配科目数
      },
      changeRadioType (val) {
        if (this.upRow.isEdit) {
          this.upRow.isEdit = false
        }
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
      // ...mapMutations({
      //   setAcctList: 'SET_ACCOUNT_LIST'
      // }),

    },
    mounted () {
      this.scrollEvent()
    },
    components: {
      addSubject
    },
    watch:{
      // 'subjectMatch': function (newVal) {
      //   this.initData(newVal)
      // }
    }
  }
</script>
