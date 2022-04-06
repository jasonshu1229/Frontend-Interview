// let words = [5, 6, 1, 44]

// words.forEach(function (word) {
//   console.log(word)
//   if (word == 1) {
//     words.push(7)
//   }
// })
var words = ['one', 'two', 5, 'three', 'four'];
// words.forEach(function(word) {
//   console.log(word);
//   if (word === 'two') {
//     words.shift();
//   }
// });

words.every(everyVal => {
  console.log(everyVal)
  return typeof(everyVal) === "string"
})
