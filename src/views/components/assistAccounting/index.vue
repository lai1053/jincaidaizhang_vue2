
<template>
  <div class="assist-account">
    <el-dialog
      width="600px"
      :title="accountingData.title"
      :visible.sync="accountingData.fuzhuModal"
      class="vau-add-sub"
      :close-on-click-modal="false"
      append-to-body>
      <div style="padding: 0 20px;"  class="dialog">
      <!-- {{accountingData}} -->
        <div class="item_wrap">
            <div class="itemBox" v-for="(item,index) in  accountingData.fuzuData" :key="item.name">
              <span class="item_name" style="width:60px">{{item.name}}</span>
              <el-select
                placeholder="请选择"
                :disabled="isDisabled"
                style="width:166px"
                size="small"
                @change="changeAsisis(index,item)"
                v-model="item.modelVal"
                :key="item.name"
              >
                <el-option
                  v-for="(item1,index1) in item.childrenOne"
                  :key="index1"
                  :label="item1.name"
                  :data-index="index1"
                  :value="item1.name"
                >
                </el-option>
                <!--<div @click="addSubject(item.name,index)" class="auto-complete-btn"  v-if="!item.isHasChildren">-->
                  <!--<i class="el-icon-circle-plus-outline" style="color: #999999;"></i>-->
                  <!--<span>新增</span>-->
                <!--</div>-->
              </el-select>

              <el-select
                placeholder="请选择"
                :disabled="isDisabled"
                filterable
                style="width:166px;margin-left: 10px"
                size="small"
                v-model="item.childrenOne[0].modelVal"
                v-if="item.isHasChildren"
                popper-class="auto-complete"
                @change="changeSub(index,item.childrenOne[0].modelVal)"
              >
                <el-option
                  v-for="(item2,index3) in accountingData.subData[index]"
                  :value="item2.name"
                  :label="item2.name"
                  :key="item2.name"
                >
                </el-option>
                <div @click="addSubject(item, index)" class="auto-complete-btn" v-if="item.modelVal != ''" >
                  <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
                  <span>新增</span>
                </div>
              </el-select>
            </div>
        </div>
      </div>
      <div slot="footer">
        <div class="assist-account-footer-tip" v-if="accountingData.tips">{{accountingData.tips}}</div>
        <el-button size="small"  type='primary' @click="confirmBtn">确认</el-button>
      </div>
    </el-dialog>
    <add-item :addItemData="addItemData" @refreshList="refreshList"></add-item>
  </div>

</template>

<script>
  import {localParams} from '@/views/components/data/common'
  import {filterAccount} from '@/utils/filterAccount'
  import {Message, Loading} from 'element-ui'
  import {changeAsisis, changeSub} from '@/views/components/assistAccounting/eval'
  import {showFuzhu} from '@/views/components/assistAccounting/eval'

  import addItem from './addItem'
  // 计量单位
  import {getUnit} from '@/api/common'
  import {addItemData} from './data'
  import {deepCopy} from '../../../utils/assist'

  export default {
    name: 'assistAccounting',
    data () {
      return {
        addItemData: deepCopy(addItemData),
        currentSubValue: [], // 第二个下拉框当前选中的值
        selectValue: {}, // 所有下拉框选中的值
        firstIndex: '', // 用于保存第一个下拉框选中项的洗标
        // 父组件传过来为accountingData0，子组件转成 accountingData再使用，避免死循环
        fuzuItem: {},
        idx: 0
      }
    },
    computed: {
    },
    props: {
      accountingData: Object,
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    components: {
      addItem
    },
    mounted () {
    },
    methods: {
      // 关闭
      closeModal () {
        this.accountingData.fuzhuModal = false
      },
      /**
       * 添加辅助项目
       * @param fuzuItem  当前新增科目的值
       */
      addSubject (fuzuItem, idx) {
        this.fuzuItem = fuzuItem
        this.idx = idx
        this.addItemData = deepCopy(addItemData)
        this.addItemData.acctCode = this.accountingData.title.split(' ')[0]
        const selectedGroupData = fuzuItem.chilldrenName
        let subIndex = ''
        // 当前选中的值的下标
        for (let i = 0; i < selectedGroupData.length; i++) {
          if (selectedGroupData[i] ===  fuzuItem.modelVal) {
            subIndex = i
            break
          }
        }
        this.addItemData.tbCode = fuzuItem.childrenOne[subIndex].tbCode
        this.addItemData.code = fuzuItem.childrenOne[subIndex].code
        this.addItemData.classId = fuzuItem.childrenOne[subIndex].id
        const value = fuzuItem.name
        switch (value) {
          case '存货':
            this.addItemData.project = '新增项目名称'
            this.addItemData.unit = '计量单位'
            this.addItemData.title = '新增存货名称'
            this.addItemData.hasGuige = true
            this.getUnit()
            break
          default:
            this.addItemData.title = `新增${value}项目`
            this.addItemData.project = '新增项目名称'
        }
        this.addItemData.dialogVisible = true
      },
      /**
       * 监听一个select框的变化
       * @param index  当前选中下标
       * @param fuzhuItem    当前选中值,用于联动第二组数据
       */
      changeAsisis (index, fuzhuItem) {
        changeAsisis(index, fuzhuItem, this.accountingData)
      },
      getUnit () {
        Loading.service(localParams)
        getUnit().then(resp => {
          Loading.service().close()
          this.addItemData.dataList = resp.data
        }).catch(error => {
          Loading.service().close()
          console.log(error)
        })
      },
      refreshList (shortName) {
        this.fuzuItem.childrenOne[0].modelVal = shortName
        // changeSub(this.idx, shortName, this.accountingData)
        showFuzhu(this.accountingData, 'addAcct')
        // this.$emit('refreshList')
      },
      changeSub (index, value) {
        changeSub(index, value, this.accountingData)
      },
      confirmBtn () {
        const vm = this
        this.selectValue = {}
        const {submitData, showItem} = this.accountingData
        let isEmpty = false
        let msg = ''
        for (let n = 0; n < submitData.length; n++) {
          if (Object.keys(submitData[n]).length === 0) {
            msg = `${showItem[n]}不能为空`
            return Message({
              message: msg,
              type: 'warning'
            })

          } else {
            isEmpty = true
          }
          // if (showItem[n] !=='部门') {
        }
        submitData.forEach(item => {
          vm.selectValue = Object.assign(vm.selectValue, item)
        })

        if (!isEmpty) {
          return
        }
        // submitData = JSON.stringify(submitData)
        this.$emit('addAssissData', JSON.stringify(vm.selectValue))
        this.accountingData.fuzhuModal = false
      },
    },
    watch: {
    }

  }
</script>
<style lang='scss' scoped>
  .dialog{
    max-height: 300px;
    overflow-y: auto;
  }
  .vau-add-sub{
    .vue-iframe {
      width: 100%;
      height: 540px;
      border: none;
      margin: 0px 0px -2px 0px;
    }
    .el-input--suffix .el-input__inner {
      height: 36px !important;
      line-height: 36px !important;
    }
  }
  .item_wrap{
    margin-bottom: 12px;
    .item_name{
      display: inline-block;
      width: 100px;
    }
    .tree_box{
      display: inline-block;vertical-align: top;
      width: 170px;
      margin-left: 10px;
    }
    &>select{
      width: 120px;
      margin-left: 10px;
    }
  }

  .itemBox{
    margin: 0 auto 25px auto;
    /*text-align: center;*/

  }
  .auto-complete-t {
    display: none !important;
  }
  .el-scrollbar {
    padding-bottom: 34px;
  }

  .el-scrollbar {
    display: block !important;
  }
  .el-select-dropdown__wrap {
    max-height: 218px;
  }
  .auto-complete {
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
  .assist-account-footer-tip {
    width: 480px;
    line-height: 32px;
    text-align: left;
    font-size: 12px;
    color: #666666;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<style lang="scss">
   .dialog .itemBox .el-input__inner{
    height: 34px !important;
    line-height: 34px !important;
  }
</style>
