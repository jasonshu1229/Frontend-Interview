// 因为最后返回的平均值是 Number类型，所以reduce的第二个参数为 Number
let r = [
  {score:1},
  {score:2},
  {score:3},
  {score:4}
].reduce((previousValue, currentValue, currentIndex, arr)=>{
  if(arr.length-1 === currentIndex){
    // 当 currentValue变成数组的最后一项时，把之前的累加，除以数组的元素的总个数
    return (previousValue + currentValue.score )/ arr.length
  }
  return previousValue + currentValue.score
},0);
