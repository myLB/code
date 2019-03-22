let $iterator = function () {
    let _this = this;
    let index = 0;
    return {
        next() {
            if(index < _this.length) {
                return {
                    value: _this[index++],
                    done: false
                }
            }else {
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    }
}
function obj() {}
arr = [1,2,3,4]
obj.prototype[Symbol.iterator] = $iterator.bind(arr);
for (let i of new obj()) {
    console.log(i)
}