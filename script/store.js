const user_info = new Vuex.Store({
  state: {
    bag: [],
    loca: 1,
    hp: 100,
    sta: 100,
    notFind: 20,
    atk: 5
  },
  mutations: {
    pushItem (state,item) {
      state.bag.push(item);
    },
    useItem (state,index) {
      state.bag.splice(index,1);
    },
    removeItem (state,index) {
      state.bag.splice(index,1);
    },
    deleteItem (state,item) {
      let t = state.bag.splice(state.bag.indexOf(item),1);
    },
    changeLoca (state,loca) {
      state.loca = loca;
    },
    changeSta (state,amount) {
      state.sta += parseInt(amount);
    },
    changeHp (state,amount) {
      state.hp += parseInt(amount);
    }
  },
  getters: {
    bagList: state => {
      return state.bag
    },
    bagLength: state => {
      return state.bag.length
    },
    userLoca: state => {
      return state.loca
    },
    getHp: state => {
      return state.hp
    },
    getSta: state => {
      return state.sta
    },
    getAtk: state => {
      return state.atk
    },
    getMissRate: state => {
      return state.notFind
    }
  }
})

const sys_info = new Vuex.Store({
  state: {
    view: '',
    itemList: [],
    itemMapSet: []
  },
  mutations: {
    clearView (state) {
      state.view = '';
    },
    changeView (state,form) {
      state.view = form;
    },
    setItemList (state, list) {
      state.itemList = list
    },
    setItemMap (state, list) {
      state.itemMapSet = list
    }
  },
  getters: {
    currentView: state => {
      return state.view
    },
    getItemList: state => {
      return state.itemList
    },
    getFilterItem: state => {
      return id => state.itemList.filter(item => {
        return item.id == id
      })
    },
    getFilterItemMap: state => {
      return state.itemMapSet
    }
  }
})

const time_info = new Vuex.Store({
  state: {
    itemCoolTime: false,
    itemCoolTimeLeft: 0
  },
  mutations: {
    setItemCoolTime (state,payload) {
      state.itemCoolTime = payload[0];
      state.itemCoolTimeLeft = payload[1];
    },
    cutItemCoolTimeLeft (state) {
      state.itemCoolTimeLeft -= 1;
    }
  },
  actions: { //action can only use one payload, so make it list
    setItemCoolAction({commit},ct) {
      let coolTime = ct;
      commit('setItemCoolTime',[true,coolTime]);
      let t = setInterval(() => {
        commit('cutItemCoolTimeLeft')
      },1000);
      setTimeout(() => {
        commit('setItemCoolTime',[false,0]);
        clearInterval(t);
      }, coolTime*1000);
    }
  },
  getters: {
    getItemCoolTime: state => {
      return state.itemCoolTime
    },
    getItemCoolTimeLeft: state => {
      return state.itemCoolTimeLeft
    }
  }
})
