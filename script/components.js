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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="use">사용</v-btn>
          <v-btn color="green darken-1" flat @click.native="remove">버리기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  `,
  data() {
    return {
      openDialog: false,
      currentItemIndex: 0
    }
  },
  methods: {
    use() {
      let i = this.currentItemIndex;
      user_info.commit('changeStat',i);
      user_info.commit('useItem',i);
      this.openDialog = false;
    },
    remove() {
      let i = this.currentItemIndex;
      user_info.commit('removeItem',i);
      this.openDialog = false;
    },
    clickDialog(i) {
      this.openDialog = true;
      this.currentItemIndex = i;
    }
  },
  computed: {
    bag() {
      return user_info.getters.bagList
    },
    itemProperty() {
      let itemList = user_info.getters.bagList
      if(itemList.length == 0) {
        return {name:""}
      } else {
        return itemList[this.currentItemIndex]
      }

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
      if(user_info.getters.bagLength == 5) {alert("가방에 공간 부족!")}
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
