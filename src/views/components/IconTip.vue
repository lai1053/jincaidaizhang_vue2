<style lang='scss' scoped>
  .vue-tag {
    padding-right: 12px;
    position: relative;
    .vue-icon-box {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      right: -4px;
      margin-top: -10px;
      text-align: center;
      line-height: 20px;
    }
    .vue-icon {
      color: #666666;
    }
    .vue-tag-content {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>

<template>
  <div
    class="vue-tag text-color"
    @mouseenter="closable=true"
    @mouseleave="closable=false">
    <div v-if="content.length===1" class="vue-tag-content" @click.stop="check(0)">{{content[0]}}</div>
    <el-dropdown v-if="content.length>1" @command="check">
      <i class="el-icon-document"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, idx) in content"
          :command="idx"
          :key="idx"
        >{{item}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="vue-icon-box" v-if="closable && !changeTaxType" @click="close(row)">
      <i class="el-icon-circle-close vue-icon"></i>
    </div>
  </div>
</template>

<script>
  import {Loading} from 'element-ui'
  import {localParams} from '@/views/components/data/common'
  import {checkPz} from '@/api/common'

  const mainMenus = {
    'sales': 'xs',
    'purchase': 'cg',
    'fund': 'zj',
    'expense': 'fy',
    'salary': 'gz',
    'psb': 'psb'
  }

  export default {
    name: 'IconTip',
    data() {
      return {
        closable: false
      }
    },
    props: {
      mainMenu: String,
      content: Array, // 凭证字号
      row: Object, // 当前点击的行信息
      changeTaxType: Boolean
    },
    components: {},
    methods: {
      close(val) {
        const vchIdArray = val.vch_id_list.split(',')
        const vchId = []
        for (const item of vchIdArray) {
          if (item) {
            vchId.push(item)
          }
        }
        if (vchId.length === 1) {
          this.checkVoucher('on-close', vchId)
        } else {
          this.$emit('on-close', vchId)
        }
      },
      check(idx) {
        const voucherId = this.row.vch_id_list.split(',')[idx]
        this.checkVoucher('on-check', voucherId)
      },
      checkVoucher(type, voucherId) {
        Loading.service(localParams)
        const {mainMenu, row} = this
        const key = mainMenu === 'psb' ? 'uuid' : 'id'
        const value =  mainMenu === 'salary' ? row.bill_id : mainMenu === 'psb' ? row.uuid : row.id // 清单id
        checkPz({
          [key]: value,
          mark: mainMenus[mainMenu], // 对应模块的标识(销售:xs;采购:cg;费用:fy;资金:zj,工资表:gz)
          pzId: type === 'on-check' ? voucherId : voucherId[0] // 凭证id
        }).then(item => {
          Loading.service().close()
          this.$emit(type, voucherId)
        }, error => {
          Loading.service().close()
        })
      }
    },
    computed: {},
    mounted() {}
  }
</script>
