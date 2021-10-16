<style lang='scss' scoped>
  .detail-footer{
    min-height: 33px;
  }
</style>

<template>
  <div class="detail-footer">
    <slot name="amountCount"></slot>
    <el-button v-if="!checkoutFlag&&detail&&detail.vt_num_list&&detail.vt_num_list.length&&!changeTaxType" class="button-com" size="small" @click="deleteVoucher">删除凭证</el-button>
    <el-dropdown
      v-if="detail&&detail.vt_num_list&&detail.vt_num_list.length>1"
      @command="viewVoucher">
      <el-button type="primary" size="small">查看凭证</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, idx) in detail.vt_num_list"
          :command="idx"
          :key="idx"
        >{{item}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      v-if="detail&&detail.vt_num_list&&detail.vt_num_list.length===1"
      type="primary"
      @click="viewVoucher(0)"
      size="small" >查看凭证</el-button>
  </div>
</template>

<script>
  import {
    deleteVoucherBefore
  } from '@/utils/utils'

  import {Loading} from 'element-ui'
  import {localParams} from '@/views/components/data/common'
  import {checkPz} from '@/api/common'

  const mainMenus = {
    'sales': 'xs',
    'purchase': 'cg',
    'fund': 'zj',
    'expense': 'fy',
    'salary': 'gz'
  }

  export default {
    name: 'DetailBtn',
    data() {
      return {
      }
    },
    props: {
      checkoutFlag: Boolean,
      detail: Object,
      mainMenu: String,
      changeTaxType: Boolean
    },
    components: {},
    methods: {
      viewVoucher(idx) {
        const voucherId = this.detail.vch_id_list.split(',')[idx]
        if (this.mainMenu) {
          this.checkVoucher('on-check-voucher', voucherId)
        } else {
          this.$emit('on-check-voucher', voucherId)
        }
      },
      deleteVoucher() {
        deleteVoucherBefore(this.detail).then(ids => {
          const vmIds = ids.split(',')
          const array = []
          for (const item of vmIds) {
            if (item) {
              array.push(item)
            }
          }
          if (this.mainMenu && array.length === 1) {
            return this.checkVoucher('on-delete-voucher', array)
          } else {
            this.$emit('on-delete-voucher', array)
          }
        })
      },
      checkVoucher(type, voucherId) {
        Loading.service(localParams)
        const {mainMenu, detail} = this
        checkPz({
          id: mainMenu === 'salary' ? detail.bill_id : detail.id, // 清单id
          mark: mainMenus[mainMenu], // 对应模块的标识(销售:xs;采购:cg;费用:fy;资金:zj,工资表:gz)
          pzId: type === 'on-check-voucher' ? voucherId : voucherId[0] // 凭证id
        }).then(item => {
          Loading.service().close()
          this.$emit(type, voucherId)
        }, error => {
          Loading.service().close()
        })
      }
    },
    computed: {
    },
    mounted() {
    }
  }
</script>
