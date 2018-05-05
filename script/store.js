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
    changeStat (state,index) {
      let item = state.bag[index];
      console.log(item)
      if(item.prop == "consume"){
        for(let l=0;l<item.consumeDetail.length;l++) {
          if(item.consumeDetail[l] == "hp"){
            state.hp += parseInt(item.consumeAmount[l]);
          } else if(item.consumeDetail[l] == "sta"){
            state.sta += parseInt(item.consumeAmount[l]);
          }
        }
      }
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
    }
  }
})
