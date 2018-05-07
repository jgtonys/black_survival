

var main_menu = new Vue({
  el: '#main',
  computed: {
    loca() {
      return user_info.getters.userLoca
    },
    view() {
      return sys_info.getters.currentView
    }
  },
  created() {
    sys_info.commit("setItemList",list);
    itemMapSet();
  }
});
