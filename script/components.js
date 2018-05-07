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
    <div>
        <v-btn
          v-for="(item,index) in overlapBag[0]"
          :key="item.name"
          depressed
          outline
          flat
          @click.stop="clickDialog(overlapBag[2][index])"
          :color="colorByRarity(item.rarity)"
          dark
        >{{ item.name }}
        <template v-if="overlapBag[1][index] != 1">
        ({{ overlapBag[1][index] }})
        </template>
        </v-btn>
    </div>
    <v-dialog v-model="openDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{ itemProperty.name }}</v-card-title>
        <div v-if="itemProperty.prop.includes('consume')">
          <v-card-title v-for="detail in itemProperty.consumeDetail" :key="detail" class="subheading">{{ detail }}</v-card-title>
        </div>
        <div v-if="itemProperty.prop.includes('material')">
          <v-card-title class="subheading">조합표</v-card-title>
          <v-btn-toggle v-model="selected_make" depressed>
            <v-btn v-for="(item,index) in itemProperty.make"
              :key="item.name"
              color="blue darken-1"
              flat
              @click = "showRecipe(item)"
            >{{ item.name }}</v-btn>
          </v-btn-toggle>
          <v-card-text v-if="toggleRecipe" class="subheading">
            <p v-for="r in recipe">{{ r }}</p>
          </v-card-text>
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
      selected_make: null,
      recipe: [],
      toggleRecipe: false,
      canMakeRecipe: false,
      materialsToDelete: []
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
      if(this.selected_make != null && this.canMakeRecipe) {
        let d = this.materialsToDelete;
        let dlist = []
        for(let i=0;i<d.length;i++) {
          dlist.push(this.bag[d[i]]);
        }
        for(let i=0;i<dlist.length;i++) {
          user_info.commit("deleteItem",dlist[i]);
        }
        user_info.commit("pushItem",this.itemProperty.make[this.selected_make]);
      } else {
        alert("만들 수 없음!");
      }
      this.openDialog = false;
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
      this.selected_make = null;
      this.toggleRecipe = false;
      this.canMakeRecipe = false;
      this.materialsToDelete = [];
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
    },
    showRecipe(item) {
      this.recipe = [];
      this.materialsToDelete = [];
      this.canMakeRecipe = false;
      let sct = 0
      for(let i=0;i<item.recipe.length;i++) {
        let objectMaterial = sys_info.getters.getFilterItem(item.recipe[i].id)[0]
        let text = objectMaterial.name + " " + item.recipe[i].ct + "개"
        let bagCount = this.bag.map((e, i) => e === objectMaterial ? i: '').filter(String);
        let needCount = parseInt(item.recipe[i].ct)
        if(bagCount.length >= needCount) {
          text += " (완)";
          sct += 1;
          this.materialsToDelete = this.materialsToDelete.concat(bagCount.slice(0,needCount));
        } else {
          text += " (미완 현재" + bagCount.length + "개 소지)";
        }
        this.recipe.push(text);
      }
      if(item.recipe.length == sct) {
        this.canMakeRecipe = true;
      }
      this.toggleRecipe = true;
    },
    colorByRarity(r) {
      if(r > 40) {
        return "black"
      } else if(r > 20) {
        return "brown"
      } else if(r >10) {
        return "indigo"
      } else {
        return "deep-purple"
      }
    }
  },
  computed: {
    bag() {
      return user_info.getters.bagList
    },
    overlapBag() {
      let bag = this.bag;
      let windowBag = [];
      let overlapCt = [];
      let realIndex = [];
      for(let i=0;i<bag.length;i++) {
        let f = windowBag.indexOf(bag[i])
        if(f == -1) {
          windowBag.push(bag[i]);
          overlapCt.push(1);
          realIndex.push(i);
        } else {
          overlapCt[f] += 1;
        }
      }
      if(windowBag.length == 0) {
        return ""
      } else {
        return [windowBag,overlapCt,realIndex]
      }
    }
  }

})

Vue.component('item_occur', {
  template: `
  <div class="text-xs-center">
    <v-card-title>{{ item.name }}</v-card-title>
    <template v-if="!depletion">
      <v-btn @click="item_get">획득</v-btn>
      <v-btn @click="item_neglect">버리기</v-btn>
    </template>
  </div>
  `,
  data() {
    return {
      depletion: false
    }
  },
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
      let i = itemFind(user_info.getters.userLoca);
      if(!i) {
        this.depletion = true;
        return {name:"여기엔 더이상 아이템이 존재하지 않습니다."}
      } else {
        if(this.depletion == true) {this.depletion = false;}
        return i
      }
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
      if(Math.floor(Math.random()*10 > 2)) {
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
