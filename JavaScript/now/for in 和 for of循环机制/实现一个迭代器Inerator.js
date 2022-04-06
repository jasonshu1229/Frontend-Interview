class Iterator {
  constructor(assemble) {
    this.assemble = assemble;
    this.index = 0;
  }

  next() {
    let { index, assemble } = this;
    if (index > assemble.length - 1) {
      return {
        done: true,
        value: undefined,
      };
    } else {
      return {
        done: false,
        value: assemble[this.index++],
      };
    }
  }
}

let itor = new Iterator([10, 20, 30, 40]);
console.log(itor.next()); // { done: false, value: 10 }
console.log(itor.next()); // { done: false, value: 20 }
console.log(itor.next()); // { done: false, value: 30 }
console.log(itor.next()); // { done: false, value: 40 }
console.log(itor.next()); // { done: true, value: undefined }
