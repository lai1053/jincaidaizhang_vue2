<style lang='scss' scoped>
  .stock-icon-success{
    display: block;
    width: 18px;
    height: 18px;
    margin-left: 9px;
    cursor: pointer;
    background: url("./img/stock-success-1.png") no-repeat center;
  }
  .stock-icon-fail{
    display: block;
    width: 18px;
    height: 18px;
    margin-left: 9px;
    cursor: pointer;
    background: url("./img/stock-fail-1.png") no-repeat center;
  }
</style>

<template>
  <div>
    <el-button v-if="indexData.checkoutFlag!=='Y'&&String(scope.row.vm_state)!=='2'&&!changeTaxType" @click="recordVoucher(scope.row)" type="text"
               size="small" class="text-color">生成凭证
    </el-button>
    <div v-if="String(scope.row.vm_state)==='2'&&String(scope.row.inve_state)=== '2'" @click="viewInventory(scope.row)">
      <el-tooltip :content="scope.row.ccode" placement="top" effect="dark">
        <span class="stock-icon-success"></span>
      </el-tooltip>
    </div>
    <div v-if="String(scope.row.vm_state)==='2'&&String(scope.row.inve_state)==='3'">
      <el-tooltip :content="scope.row.inve_desc" placement="top" effect="dark">
        <span class="stock-icon-fail"></span>
      </el-tooltip>
    </div>
    <!--v-if="urlInfo.dljgId==='1'"-->
    <slot name="deleteBtn"></slot>
  </div>
</template>

<script>
  import {Loading, MessageBox} from 'element-ui'
  import {localParams} from '@/views/components/data/common'
  // api
  import {
    createTempPZ,
    viewInventoryInfo
  } from '@/api/common'
  const marks = {
    'sales': 'xs',
    'purchase': 'cg',
    'fund': 'zj',
    'expense': 'fy',
    'psb': 'psb'
  }
  export default {
    name: 'operation',
    data() {
      return {
        indexData: this.$store.getters.indexData,
        urlInfo: this.$store.getters.urlInfo
      }
    },
    props: {
      mainMenu: String,
      scope: Object,
      bookkeeping: Object, // 记账modal: false,iframeSrc: ''
      editContent: Object,
      changeTaxType: Boolean,
      inventory: Object
    },
    components: {},
    methods: {
      // 操作>删除
      deleteDetail(row) {
        this.$emit('delect', row)
      },
      // 操作>图片
      toImg(row) {
        this.$emit('on-click-img', row)
      },
      recordVoucher (row) {
        if (this.editContent && this.editContent.allSaveBtn) {
          return MessageBox.alert('数据已经修改，是否保存？', '全部保存', {
            confirmButtonText: '是',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.$emit('save-all')
              }
            }
          })
        }
        this.bookkeeping.iframeSrc = ''
        Loading.service(localParams)
        const params = this.mainMenu === 'psb' ? row.bill_id : row.id
        createTempPZ({
          id: params, // 清单id
          mark: marks[this.mainMenu] // 对应模块的标识(销售:xs;采购:cg;费用:fy;资金:zj)
        }).then(resp => {
          Loading.service().close()
          this.bookkeeping.modal = true
          this.bookkeeping.iframeSrc = `${resp.data}&url=${escape(window.location.href)}`
        }, error => {
          Loading.service().close()
          // this.bookkeeping.modal = true
          // this.bookkeeping.iframeSrc = 'http://jctest.zmkhua.com:84/finance/voucher/voucheradd.jsp?token=55555&AccountID=44444&temppz=1&from=jcgj&batch=4466677777&mark=fy&id=2339'
        })
      },
      viewInventory (row) {
        this.inventory.iframeSrc = ''
        Loading.service(localParams)
        viewInventoryInfo({
          module: marks[this.mainMenu],
          ccode: row.ccode,
          inve_billtitle_id: row.inve_billtitle_id
        }).then(resp => {
          Loading.service().close()
          this.inventory.modal = true
          this.inventory.iframeSrc = `${resp.data}&url=${escape(window.location.href)}`
        }, err => {
          Loading.service().close()
        })
      }
    },
    computed: {},
    mounted() {}
  }
</script>
