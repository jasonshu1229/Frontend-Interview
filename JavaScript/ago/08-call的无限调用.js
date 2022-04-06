let name = "lsh";

function A(x, y, z) {
  let res = x + y + z;
  console.log(res, this)
}

function B(x, y) {
  let res = x - y;
  console.log(res, this.name)
}

// B.call.call.call(A, 20, 10); // => A.call(20, 10);  NaN undefined
B.call.call.call.call(A, 20, 10, 9); // => A.call(20, 10, 9); 19 undefined
B.call.call.call.call(A, 40, 10, 9, 8); // => A.call(20, 10, 9, 8)
// Function.prototype.call(A, 20, 10);

