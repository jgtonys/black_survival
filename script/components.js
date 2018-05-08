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
      <p class="text-sm-left my-0">
        <v-progress-linear v-model="hp" height="2" color="pink dark" background-color="pink lighten-3"></v-progress-linear>
      </p>
      <p class="text-sm-left my-0">
        <v-progress-linear v-model="sta" height="2" color="blue dark" background-color="blue-grey"></v-progress-linear>
      </p>
      <p class="text-sm-left my-0">atk : {{ atk }}</p>
      <v-progress-circular
        v-if="isConsumeCool"
        :size="50"
        :width="10"
        :rotate="-90"
        :value="consumeCoolPercent"
        color="teal"
    >
      {{ consumeCool }}
    </v-progress-circular>
    </v-card-text>
  </div>
  `,
  computed: {
    hp() {
      return user_info.getters.getHp
    },
    sta() {
      return user_info.getters.getSta
    },
    atk() {
      return user_info.getters.getAtk
    },
    consumeCool() {
      return time_info.getters.getItemCoolTimeLeft
    },
    isConsumeCool() {
      return time_info.getters.getItemCoolTime
    },
    consumeCoolPercent() {
      return (this.consumeCool / time_info.getters.getItemCoolTimeDefault)*100
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
          :outline="sBI(item)"
          @click.stop="clickDialog(overlapBag[2][index])"
          :color="cBR(item)"
          class="animated lightSpeedIn"
          dark
        >{{ item.name }}
        <template v-if="overlapBag[1][index] != 1">
        ({{ overlapBag[1][index] }})
        </template>
        </v-btn>
    </div>
    <v-dialog v-model="openDialog" max-width="600">
      <v-card>
        <v-layout row wrap>
          <v-flex>
            <v-card tile flat>
              <v-card-title class="headline">{{ itemProperty.name }}</v-card-title>
              <template v-if="itemProperty.prop.includes('consume')">
                <v-card-text v-for="detail in itemProperty.consumeDetail" :key="detail" class="subheading py-0">{{ detail }}</v-card-text>
              </template>
            </v-card>
          </v-flex>
          <v-flex>
            <template v-if="itemProperty.prop.includes('material')">
              <v-btn-toggle v-model="selected_make" depressed class="ma-16">
                <v-btn v-for="(item,index) in itemProperty.make"
                  :key="item.name"
                  color="blue darken-1"
                  flat
                  @click = "showRecipe(item)"
                >{{ item.name }}</v-btn>
              </v-btn-toggle>
              <template v-if="toggleRecipe" class="caption">
                <p v-for="r in recipe">{{ r }}</p>
              </template>
            </template>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="itemCoolTime"
            :disabled="itemCoolTime"
            v-if="itemProperty.prop.includes('consume')"
            color="green darken-1"
            flat
            @click="use"
          >사용<span slot="loader">{{ itemCoolTimeLeft }}초 남음</span></v-btn>
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
      let item = user_info.getters.bagList[i];
      itemUse(item)
      user_info.commit('useItem',i);
      this.openDialog = false;
      time_info.dispatch("setItemCoolAction",item.coolTime);
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
      } else if(this.selected_make == null) {
        alert("선택된 조합 없음");
      } else {
        alert("재료 부족!")
      }
      this.openDialog = false;
    },
    equip() {
      let i = this.currentItemIndex;
      let item = user_info.getters.bagList[i];
      user_info.commit('useItem',i);
      user_info.commit("changeEquip",item);
      this.openDialog = false;
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
    cBR(i) {
      return colorByRarity(i)
    },
    sBI(i) {
      return styleByItem(i)
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
    },
    itemCoolTime() {
      return time_info.getters.getItemCoolTime
    },
    itemCoolTimeLeft() {
      return time_info.getters.getItemCoolTimeLeft
    }
  }

})

Vue.component('item_occur', {
  template: `
  <div class="animated fadeInLeft text-xs-center">
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

Vue.component('test', {
  template: `
  <div>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm6 md4>
          <v-card>
            <v-card-title primary class="title">장비</v-card-title>
            <template>
              <v-container fluid grid-list-xl>
                <v-layout row row>
                  <v-btn depressed :outline="sBI(equip.weapon)" :color="cBR(equip.weapon)" class="animated fadeIn" dark>
                    <template v-if="equip.weapon">{{ equip.weapon.name }}</template>
                    <template v-else>무기</template>
                  </v-btn>
                  <v-btn depressed :outline="sBI(equip.head)" :color="cBR(equip.head)" class="animated fadeIn" dark>
                    <template v-if="equip.head">{{ equip.head.name }}</template>
                    <template v-else>머리</template>
                  </v-btn>
                </v-layout>
                <v-layout row>
                  <v-btn depressed :outline="sBI(equip.glove)" :color="cBR(equip.glove)" class="animated fadeIn" dark>
                    <template v-if="equip.glove">{{ equip.glove.name }}</template>
                    <template v-else>장갑</template>
                  </v-btn>
                  <v-btn depressed :outline="sBI(equip.armor)" :color="cBR(equip.armor)" class="animated fadeIn" dark>
                    <template v-if="equip.armor">{{ equip.armor.name }}</template>
                    <template v-else>갑옷</template>
                  </v-btn>
                  <v-btn depressed :outline="sBI(equip.subweapon)" :color="cBR(equip.subweapon)" class="animated fadeIn" dark>
                    <template v-if="equip.subweapon">{{ equip.subweapon.name }}</template>
                    <template v-else>보조무기</template>
                  </v-btn>
                </v-layout>
                <v-layout row row>
                  <v-btn depressed :outline="sBI(equip.accessory)" :color="cBR(equip.accessory)" class="animated fadeIn" dark>
                    <template v-if="equip.accessory">{{ equip.accessory.name }}</template>
                    <template v-else>장신구</template>
                  </v-btn>
                  <v-btn depressed :outline="sBI(equip.leg)" :color="cBR(equip.leg)" class="animated fadeIn" dark>
                    <template v-if="equip.leg">{{ equip.leg.name }}</template>
                    <template v-else>다리</template>
                  </v-btn>
                </v-layout>

              </v-container>
            </template>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm6 md3>
          <v-layout row wrap>
            <v-flex d-flex>
              <v-card color="indigo" dark>
                <v-card-text>{{ lorem }}</v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-layout row wrap>
                <v-flex
                  v-for="n in 2"
                  :key="n"
                  d-flex
                  xs12
                >
                  <v-card
                    color="red lighten-2"
                    dark
                  >
                    <v-card-text>{{ lorem }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
  `,
  data() {
    return {
      lorem: "asdfjalsdkfj;alskdf;laksjd;lfkjasdlfa"
    }
  },
  methods: {
    cBR(i) {
      return colorByRarity(i)
    },
    sBI(i) {
      return styleByItem(i)
    }
  },
  computed: {
    equip() {
      let e = user_info.getters.getEquip
      return e
    }
  }
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
      <v-btn @click="move_fn">Move</v-btn>
      <v-btn @click.stop="openDialog = true">Equip</v-btn>
      <v-dialog v-model="openDialog" max-width="800">
        <test></test>
      </v-dialog>
    </div>
  `,
  data() {
    return {
      loading: false,
      openDialog: false
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
      <v-btn depressed v-for="i in 10" :key="i" @click="move_to(i)">Area {{ i }}</v-btn>
    </div>
  `,
  methods: {
    move_to(i) {
      user_info.commit('changeLoca',i);
      sys_info.commit('clearView');
    }
  }
});
