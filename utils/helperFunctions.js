export function arrayifyWithKey(obj){
  return Object.keys(obj).map(key => {
    let objIdx = {};
    objIdx = obj[key];
    objIdx.key = key;
    return objIdx
  })
}

export function arrayify(obj){
  return Object.keys(obj).map(key => {
    return key
  })
}
