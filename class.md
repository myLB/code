# es6类与es5类的区别

##es6

```ecmascript 6
    class Es6Parent {
        constructor (name) {
            this.name = name;
        }
        sayName () {
    
        }
    }
    const Es6Instance = new Es6Parent('li');
    console.log(Es6Instance) // 实例
    console.log(Es6Instance.constructor) // 指向类Es6Parent
    console.log(Es6Instance.__proto__) // 指向类Es6Parent的原型
    console.log(Es6Parent.prototype) // 类Es6Parent的原型
    console.log(Es6Instance.constructor === Es6Parent) // 实例的构造函数等于类Es6Parent
    console.log(Es6Instance.__proto__ === Es6Parent.prototype) // 实例的原型链等于类Es6Parent的原型
```
####es6类解析

常量`Es6Instance`由类`Es6Parent`实例化而成.打印后发现其包含了`name`属性,而未找到`sayName`属性.但是在`__proto__`
中发现了`sayName`属性和`constructor`属性,其中`constructor`属性的值指向了类`Es6Parent`.
由此可见类`Es6Parent`中定义的都是该类`prototype`(原型)的属性,而其中的`constructor`属性(构造函数)是指向类本身,并且
该`constructor`函数中定义的都是实例对象的属性.
   
##es5
 ```ecmascript 6
    function Es5Parent(name) {
       this.name = name;
    }
    Es5Parent.prototype.sayName = function () {
    
    }
    const Es5Instance = new Es5Parent('li');
    console.log(Es5Instance)
    console.log(Es5Instance.constructor)
    console.log(Es5Instance.__proto__)
    console.log(Es5Parent.prototype)
    console.log(Es5Instance.constructor === Es5Parent);
    console.log(Es5Instance.__proto__ === Es5Parent.prototype);
```

####es5类解析

常量`Es5Instance`由函数`Es5Parent`实例化而成.打印后发现其也只包含了`name`属性,而未找到`sayName`属性.但是在`__proto__`
中发现了`sayName`属性和`constructor`属性,其中`constructor`属性的值指向了`Es5Parent`函数.由此可见`Es5Parent`函数中定义
的是实例对象的属性.而`prototype`属性中定义的都是`__proto__`(实例原型链)中的属性.



### 相同之处
    
    不多说,看了上面的打印以及说明发现好像一样的.
    
### 不同之处

1.`es6`由关键字`class`定义; `es5`是函数定义.
2.`es6`类创建的实例的构造函数(`constructor`)是指向类本身而不是类中定义的`constructor`函数,那就说明了一个问题,类中定义的`constructor`函数只是
在实例化的时候默认调用了该函数,该函数本身并不代表什么,简单来说该函数就是个工具人;`es5`函数创建的实例的构造函数(`constructor`)也指向函数本身,也就是
其本身就相当于`es6`类中的`constructor`函数.
3.从上面的对比可以看出其实`es6`就是将`es5`创建类的过程定义在一个块中,将这个块命名为类的名称,将原本的类函数用`constructor`命名,并将实例的构造函数
指向变为类本身.


### es5实现es6

```ecmascript 6
    function Es5Parent(name) {
       this.name = name;
    }
    Object.setPrototypeOf(Es5Parent.prototype, {
        constructor: Es5Parent,
        sayName () {}
    })
    console.log(new Es5Parent('li'))
```

### es5实现es6的继承

```ecmascript 6
    class parent {
        constructor (name) {
            this.name = name;
            this.sayName();
        }
        sayName () {}
    }
    class child extends parent {
        constructor (name) {
            super(name);
        }
    }
    console.log(child.__proto__ === parent);
    console.log(child.prototype.__proto__ === parent.prototype);
    /* ------------------------------------------------------- */
    function parent1 (name) {
        this.name = name;
        this.sayName();
    }
    parent1.prototype = {
        constructor: parent1,
        sayName () {}
    }
    function child1(name) {
        parent1.call(this, name);
    }
    Object.setPrototypeOf(child1.prototype, parent1.prototype);
    Object.setPrototypeOf(child1, parent1);
    child1.prototype.constructor = child1;
```
















