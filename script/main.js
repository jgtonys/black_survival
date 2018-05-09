

var main_menu = new Vue({
  el: '#main',
  computed: {
    view() {
      return sys_info.getters.currentView
    }
  },
  created() {
    sys_info.commit("setItemList",list);
    sys_info.commit("initMapProp");
    itemMapSet();
  }
});
