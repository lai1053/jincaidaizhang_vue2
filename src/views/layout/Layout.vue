<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <!--<navbar-new></navbar-new>-->
    <!--<sidebar class="sidebar-container"></sidebar>-->
    <div class="main-container">
      <app-main></app-main>
    </div>
    <!--<sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>-->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, NavbarNew } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    NavbarNew
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
