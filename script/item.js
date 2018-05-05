function itemFind() {
  let l = sys_info.getters.getItemList;
  m = Math.floor(Math.random()*6);
  return l[m]
}
