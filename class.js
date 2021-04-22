class Es6Parent {
    constructor (name) {
        this.name = name;
    }
    sayName () {

    }
}
class child extends Es6Parent {
    m () {}
}
console.log(child.__proto__)
console.log(child.constructor.prototype)
console.log(child.prototype)
console.log(child.prototype.__proto__)
let Es6Instance = new Es6Parent('li');
/*console.log(Es6Instance)
console.log(Es6Instance.constructor)
console.log(Es6Instance.__proto__)
console.log(Es6Parent.prototype)
console.log(Es6Instance.constructor === Es6Parent)
console.log(Es6Instance.__proto__ === Es6Parent.prototype)*/

/* ----------------------------------- */
console.log('-----------------------------------')

function Es5Parent(name) {
   this.name = name;
}
Es5Parent.prototype.sayName = function () {

}
let Es5Instance = new Es5Parent('li');
/*console.log(Es5Instance)
console.log(Es5Instance.constructor)
console.log(Es5Instance.__proto__)
console.log(Es5Parent.prototype)
console.log(Es5Instance.constructor === Es5Parent);
console.log(Es5Instance.__proto__ === Es5Parent.prototype);*/
