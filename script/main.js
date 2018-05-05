

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
  },
  methods: {
    shuffle(l) {
      for(let i=l.length;i;i--) {
        let j = Math.floor(Math.random()*i);
        let t = l[j];
        l[j] = l[i-1];
        l[i-1] = t;
      }
    }
  }
});
