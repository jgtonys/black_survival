function itemFind(index) {
  let l = sys_info.getters.getFilterItemMap[index];
  return l.pop();
}


function itemMapSet() {
  let l = sys_info.getters.getItemList;
  let itemMap = [];
  for(let i=1;i<11;i++) {
    itemMap[i] = [];
    const areaGenItem = l.map((e, o) => e.gen.includes(i) ? e: '').filter(String);
    for(let j=0;j<areaGenItem.length;j++) {
      for(let k=0;k<areaGenItem[j].rarity;k++) {
        itemMap[i].push(areaGenItem[j]);
      }
    }
    shuffle(itemMap[i]);
  }
  sys_info.commit('setItemMap',itemMap);
}

function shuffle(l) {
  for(let i=l.length;i;i--) {
    let j = Math.floor(Math.random()*i);
    let t = l[j];
    l[j] = l[i-1];
    l[i-1] = t;
  }
}


function itemUse(item) {
  if(typeof(item.consumeDetail) != "object") {
    switch(item.consumeDetail) {
      case 'sta':
        user_info.commit('changeSta',item.consumeAmount);
        break;
      case 'hp':
        user_info.commit('changeHp',item.consumeAmount);
        break;
    }
  } else {
    for(let i=0;i<item.consumeDetail.length;i++) {
      switch(item.consumeDetail[i]) {
        case 'sta':
          user_info.commit('changeSta',item.consumeAmount[i]);
          break;
        case 'hp':
          user_info.commit('changeHp',item.consumeAmount[i]);
          break;
      }
    }
  }
}

//function makeItem()
