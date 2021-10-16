<style lang='scss' scoped>
  .reorganize-bill {

  }
</style>

<template>
  <div class="reorganize-bill">
    <top-steps v-if="setupData.step!=='batchSetupAccount'"  :cur-step="setupData.step" :main-menu="mainMenu"></top-steps>
    <steps-one key="zero" @on-change-account="onChangeAccount" @batch-setup-account="onBatchSetupAccount" v-if="setupData.step==='zero'&&mainMenu==='purchase'" :main-menu="mainMenu" :service="setupData.business" :service-columns="businessColumns" :step="setupData.step"></steps-one>
    <steps-one key="one" v-if="setupData.step==='one'" :main-menu="mainMenu" :service="setupData.service" :service-columns="serviceColumns" :step="setupData.step"></steps-one>
    <steps-two key="two" @on-save-setup-sub="saveSetupSub" v-if="setupData.step==='two'" :main-menu="mainMenu" :subModal="setupData.subModal" :tab-pane="tabPane" :setup-modal="setupModal"></steps-two>
    <steps-two key="batchSetupAccount" v-if="mainMenu==='purchase' && setupData.step==='batchSetupAccount'" type="batchSetupAccount" :main-menu="mainMenu" :subModal="setupData.batchSetupModal" :tab-pane="batchSetupTabPane"></steps-two>
  </div>
</template>

<script>
  import TopSteps from '@/views/components/ReorganizeBill/TopSteps/index.vue'
  import StepsOne from '@/views/components/ReorganizeBill/StepsOne/index.vue'
  import StepsTwo from '@/views/components/ReorganizeBill/StepsTwo/index.vue'

  export default {
    name: 'ReorganizeBill',
    data() {
      return {
      }
    },
    props: {
      mainMenu: String,
      setupData: Object,
      serviceColumns: Array,
      tabPane: Array,
      businessColumns: Array,
      batchSetupTabPane: Array,
      setupModal: Object
    },
    created() {
    },
    methods: {
      onBatchSetupAccount() {
        this.$emit('batch-setup-account', 'setup')
      },
      onChangeAccount (type) {
        this.$emit('on-change-account', type)
      },
      saveSetupSub (params) {
        this.$emit('on-save-setup-sub', params)
      }
    },
    computed: {},
    mounted() {},
    components: {
      TopSteps,
      StepsOne,
      StepsTwo
    }
  }
</script>
