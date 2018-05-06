function itemFind() {
  let l = sys_info.getters.getItemList;
  m = Math.floor(Math.random()*7);
  return l[m]
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
