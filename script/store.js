const user_info = new Vuex.Store({
  state: {
    bag: [],
    loca: 0,
    hp: 100,
    sta: 100
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
    changeLoca (state,loca) {
      state.loca = loca;
    },
    changeSta (state,amount) {
      console.log("sta change");
      state.sta += parseInt(amount);
    },
    changeHp (state,amount) {
      console.log("hp change");
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
    }
  }
})

const sys_info = new Vuex.Store({
  state: {
    view: '',
    itemList: []
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
    }
  }
})
