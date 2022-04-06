// Object.prototype.toString是一步到位的
function getType(object) {
  return Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
}

getType({}); // object
getType("a"); // string
getType(1); // number
getType(true); // boolean
getType(null); // null
getType(undefined); // undefined
getType(Symbol("a")); // symbol
getType(11n); // bigint
getType(/a/); // regexp
getType(new Date()); // date
getType([0, 1, 2]); // array
getType(function () {}); // function
getType(new Error()); // error
getType(new Map()); // map
getType(new Set()); // set
