const user_info = new Vuex.Store({
  state: {
    bag: [],
    loca: 1,
    hp: 50,
    sta: 30,
    notFind: 20,
    atk: 5,
    equip: {
      weapon: '',
      head: '',
      glove: '',
      armor: '',
      subweapon: '',
      accessory: '',
      leg: ''
    }
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
      console.log(state.hp);
    },
    changeEquip (state,item) {
      let prop = item.equipDetail;
      let original = state.equip[prop];
      if(original) {
        state.bag.push(original);
      }
      state.equip[prop] = item;
      console.log(state.equip[prop]);
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
    },
    getEquip: state => {
      return state.equip
    }
  }
})

const sys_info = new Vuex.Store({
  state: {
    view: '',
    itemList: [],
    itemMapSet: [],
    mapProp: [],
    msg: []
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
    },
    initMapProp (state) { //0이 중립 1이 아군 2가 적군
      for(let i=1;i<11;i++) {
        state.mapProp[i] = 0;
      }
      state.mapProp[1] = 1; //to be erased
      state.mapProp[8] = 2; //to be erased
    },
    pushMsg (state,m) {
      state.msg.push(m);
      console.log(m); //to be erased
    },
    eraseMsg (state) {
      state.msg.splice(0,1);
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
    },
    getMapProp: state => {
      return state.mapProp
    },
    getMsg: state => {
      return state.msg
    }
  },
  actions: {
    alertMsg ({commit},m) {
      commit("pushMsg",m);
      setTimeout(() => {
        commit("eraseMsg");
      }, 1000);
    }
  }
})

const time_info = new Vuex.Store({
  state: {
    itemCoolTime: false,
    itemCoolTimeLeft: 0,
    itemCoolTimeDefault: 0
  },
  mutations: {
    setItemCoolTime (state,payload) {
      state.itemCoolTime = payload[0];
      state.itemCoolTimeLeft = payload[1];
      state.itemCoolTimeDefault = payload[1];
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
    },
    getItemCoolTimeDefault: state => {
      return state.itemCoolTimeDefault
    }
  }
})

const enemy_info = new Vuex.Store({
  state: {
    hp: 100,
    atk: 1,
    enemyAttacking: false,
    enemyAttackingT: ''
  },
  mutations: {
    setEnemyInfo (state,payload) {
      state.hp = payload[0];
      state.atk = payload[1];
    },
    setEnemyAttacking (state) {
      state.enemyAttacking = true;
      console.log("enemy attacking start");//to be erased
    },
    attack (state) {
      sys_info.dispatch("alertMsg","적의 공격을 받았습니다.");
      user_info.commit("changeHp",0 - state.atk);
    },
    clearEnemyAttacking (state) {
      state.enemyAttacking = false;
      sys_info.dispatch("alertMsg","적이 쓰러졌다.");
      clearInterval(state.enemyAttackingT);
      console.log("enemy attacking stopped");//to be erased
    }
  },
  actions: { //action can only use one payload, so make it list
    startEnemyAttack({commit,state}) {
      commit("setEnemyAttacking",true);
      state.enemyAttackingT = setInterval(() => {
        if(state.hp <= 0) {
          commit("clearEnemyAttacking");
        } else {
          commit("attack");
        }
      },2000);
    }
  },
  getters: {
    getHp: state => {
      return state.hp
    }
  }
})
