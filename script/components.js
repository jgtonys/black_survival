Vue.component('searching', {
  template: `
  <div class="text-xs-center">
    <v-progress-circular :size="70" indeterminate color="primary"></v-progress-circular>
  </div>
  `
})

Vue.component('user_stat', {
  template: `
  <div>
    <v-card-text>
      <p class="text-sm-left">hp : {{ hp }}</p>
      <p class="text-sm-left">sta : {{ sta }}</p>
    </v-card-text>
  </div>
  `,
  computed: {
    hp() {
      return user_info.getters.getHp
    },
    sta() {
      return user_info.getters.getSta
    }
  }
})

Vue.component('inventory', {
  template: `
  <div>
    <div v-for="(item,index) in bag">
    <v-btn
      depressed
      @click.stop="clickDialog(index)"
      color="primary"
      dark
    >{{ item.name }}</v-btn>
    </div>
    <v-dialog v-model="openDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ itemProperty.name }}</v-card-title>
        <div v-if="itemProperty.prop.includes('consume')">
          <v-card-title v-for="detail in itemProperty.consumeDetail" class="subheading">{{ detail }}</v-card-title>
        </div>
        <div v-if="itemProperty.prop.includes('material')">
          <v-card-title class="subheading">조합표</v-card-title>
          <v-btn-toggle v-model="selected_make" depressed>
            <v-btn v-for="(item,index) in itemProperty.make"
              color="blue darken-1"
              flat
            >{{ item.name }}</v-btn>
          </v-btn-toggle>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="itemProperty.prop.includes('consume')" color="green darken-1" flat @click="use">사용</v-btn>
          <v-btn v-if="itemProperty.prop.includes('material')" color="green darken-1" flat @click="make">조합</v-btn>
          <v-btn v-if="itemProperty.prop.includes('weapon')" color="green darken-1" flat @click="equip">장착</v-btn>
          <v-btn color="green darken-1" flat @click="remove">버리기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  `,
  data() {
    return {
      openDialog: false,
      currentItemIndex: 0,
      itemProperty: {
        name: '',
        prop: '',
        consumeDetail: [],
        make: []
      },
      selected_make: null
    }
  },
  methods: {
    use() {
      let i = this.currentItemIndex;
      itemUse(user_info.getters.bagList[i])
      user_info.commit('useItem',i);
      this.openDialog = false;
    },
    make() {
      console.log(this.selected_make);
    },
    equip() {
      console.log("equip!");
    },
    remove() {
      let i = this.currentItemIndex;
      user_info.commit('removeItem',i);
      this.openDialog = false;
    },
    clickDialog(i) {
      this.openDialog = true;
      this.currentItemIndex = i;
      let item = user_info.getters.bagList[i];
      this.itemProperty.name = item.name;
      this.itemProperty.prop = item.prop;
      this.itemProperty.make = [];
      this.itemProperty.consumeDetail = [];
      if(item.prop.includes('material')) {
        for(let i=0;i<item.upgradeTo.length;i++) {
          this.itemProperty.make.push(sys_info.getters.getFilterItem(item.upgradeTo[i])[0]);
        }
        console.log(this.itemProperty.make);
      }
      if(item.prop.includes('consume')) {
        for(let i=0;i<item.consumeDetail.length;i++) {
          switch(item.consumeDetail[i]) {
            case 'sta':
              this.itemProperty.consumeDetail.push("스테미너 +" + item.consumeAmount[i]);
              break;
            case 'hp':
              this.itemProperty.consumeDetail.push("체력 +" + item.consumeAmount[i]);
              break;
          }
        }
      }
    }
  },
  computed: {
    bag() {
      return user_info.getters.bagList
    }
  }

})

Vue.component('item_occur', {
  template: `
  <div class="text-xs-center">
    <v-card-title>{{ item.name }}</v-card-title>
    <v-btn @click="item_get">획득</v-btn>
    <v-btn @click="item_neglect">버리기</v-btn>
  </div>
  `,
  methods: {
    item_get() {
      if(user_info.getters.bagLength == 15) {alert("가방에 공간 부족!")}
      else {user_info.commit('pushItem',this.item)}
      sys_info.commit('clearView');
    },
    item_neglect() {
      sys_info.commit('clearView');
    }
  },
  computed: {
    item() {
      return itemFind()
    }
  }
})

Vue.component('not_found', {
  template: `
  <div class="text-xs-center">
    <v-card-title>아무것도 찾을 수 없었다.</v-card-title>
  </div>
  `
})


Vue.component('main_button', {
  template: `
    <div>
      <v-btn
        :loading="loading"
        :disabled="loading"
        @click="searching"
      >
      search
      </v-btn>
      <v-btn @click="move_fn">move</v-btn>
    </div>
  `,
  data() {
    return {
      loading: false
    }
  },
  methods: {
    searching() {
      this.loading = true;
      sys_info.commit("changeView",'searching');
      setTimeout(this.search_fn,1000);
    },
    move_fn() {
      sys_info.commit("changeView",'move_area');
    },
    search_fn() {
      if(Math.floor(Math.random()*10 > 3)) {
        sys_info.commit("changeView",'item_occur');
      } else {
        sys_info.commit("changeView",'not_found');
      }
      this.loading = false;
    }
  }
});

Vue.component('move_area', {
  template: `
    <div>
      <v-btn depressed v-for="i in 10" @click="move_to(i)">Area {{ i }}</v-btn>
    </div>
  `,
  methods: {
    move_to(i) {
      user_info.commit('changeLoca',i);
      sys_info.commit('clearView');
    }
  }
});
