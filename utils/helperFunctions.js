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

export function randomize(numberOfQuestions) {
  let arr = [];
  while (arr.length < 5) {
    let number = Math.floor(Math.random () * numberOfQuestions) + 1;
    if (!arr.includes(number)) arr.push(number);
  }
}
