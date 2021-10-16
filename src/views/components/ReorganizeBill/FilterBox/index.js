import FilterBox from '@/views/components/ReorganizeBill/FilterBox/index.vue'
import Vue from 'vue'
const FilterMenu = {
  install: function () {
    Vue.component('filter-box', FilterBox)
  }
}
export default FilterMenu
