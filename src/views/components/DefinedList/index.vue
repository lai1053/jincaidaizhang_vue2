<style lang='scss'>
  .dndList-list {
    .el-tag {
      margin: 6px;
    }
    .el-button {
      margin: 6px;
    }
  }
</style>

<template>
  <div class="vue-defined-list">
    <!--<span class="set-btn" @click="toSetListItem">
      <i class="el-icon-setting"></i>
    </span>-->
    <el-dialog
      width="700px"
      title="自定义列"
      :visible.sync="modal">
      <div class="dndList-list">
        <h4>已选择表头字段项（拖动表单调整顺序）</h4>
        <draggable :list="list" class="dragArea" :options="{group:'article'}">
          <el-tag
            type="info"
            v-for="(item, i) in list"
            :key="item.prop"
            :closable="!item.isMust"
            :disable-transitions="false"
            @close="handleClose(i)">
            {{item.label}}
          </el-tag>
        </draggable>
        <h4 style="margin-top: 30px;">选择表头字段项</h4>
        <el-button
          size="small"
          v-for="(item, i) in waitList"
          :key='item.prop'
          @click="addWaitListToList(i)">+ {{item.label}}</el-button>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="saveSetResult">保存</el-button>
        <el-button size="mini" @click="getList">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import {deepCopy} from '@/utils/assist'
  import {setMainType} from './defineList'

  export default {
    name: 'definedList',
    data() {
      return {
        modal: false,
        list: [],
        waitList: []
      }
    },
    props: {
      mainMenu: String,
      columns: Array
    },
    watch: {
      'modal': function (newVal) {
        if (newVal) {
          this.getList()
        }
      }
    },
    components: {
      draggable
    },
    methods: {
      getList() {
        const list = []
        const waitList = []
        const columns = deepCopy(this.columns)
        columns.forEach((item) => {
          if (item.hide) {
            waitList.push(item)
          } else {
            if (item.prop !== 'vm_state' && item.prop !== 'operation') {
              list.push(item)
            }
          }
        })
        this.list = list
        this.waitList = waitList
      },
      toSetListItem() {
        this.modal = true
      },
      addWaitListToList(i) {
        this.waitList[i].hide = false
        this.list.push(this.waitList[i])
        this.waitList.splice(i, 1)
      },
      handleClose(i) {
        this.waitList.push(this.list[i])
        this.list.splice(i, 1)
      },
      saveSetResult() {
        this.modal = false
        this.list.forEach((item, i) => {
          item.hide = false
          Object.keys(item).forEach(str => {
            if (str !== 'key') {
              this.columns[i][str] = item[str]
            } else {
              this.columns[i].key = Math.ceil(Math.random() * 10000)
            }
          })
        })
        this.waitList.forEach((item, i) => {
          item.hide = true
          Object.keys(item).forEach(str => {
            if (str !== 'key') {
              this.columns[this.list.length + i][str] = item[str]
            } else {
              this.columns[this.list.length + i].key = Math.ceil(Math.random() * 10000)
            }
          })
        })
        // setMainType(this.mainMenu, JSON.stringify(this.columns))
      }
    },
    computed: {},
    mounted() {}
  }
</script>
