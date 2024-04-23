/**
 * 解法三
 * 对于栈来讲，Push和Pop操作都是在栈顶完成的，所以很容易维护栈中的最大值
 */

class stack {
  constructor(n = 10) {
    this.maxN = n
    this.stackItem = new Array(n)
    this.stackTop = -1
    this.maxStackItemIndex = -1
    this.link2NextMaxItem = new Array(n)
  }

  //入栈
  push(x) {
    const currentIndex = this.stackTop + 1
    if (currentIndex >= this.maxN) return
    this.stackTop = currentIndex
    this.stackItem[this.stackTop] = x
    if (x > this.max()) {
      this.link2NextMaxItem[this.stackTop] = this.maxStackItemIndex
      this.maxStackItemIndex = this.stackTop
    } else {
      this.link2NextMaxItem[this.stackTop] = -1;
    }
  }

  // 出栈
  pop() {
    let res
    if (this.stackTop < 0) return
    res = this.stackItem[this.stackTop]
    if (this.stackTop === this.maxStackItemIndex) {
      this.maxStackItemIndex = this.link2NextMaxItem[this.stackTop]
    }
    this.stackItem[this.stackTop] = undefined
    this.stackTop--;
    return res
  }

  empty() {
    return this.stackTop < 0
  }

  max() {
    if (this.maxStackItemIndex >= 0) {
      return this.stackItem[this.maxStackItemIndex]
    } else {
      return -Infinity
    }
  }
}

/** 栈的数据结构实现队列
 * 使用A,B栈
 * 栈是后进先出，队列是先进先出
 * A栈负责数据推出
 * B栈负责数据推入
 * 当A栈数据空了，将B栈的数据推入A栈，由于先从B栈（后推入B栈的数据）出来的数据先进入A栈，A栈的进入顺序和B栈的进入顺序是相反的，就能实现先进先出
 */
class queue {
  constructor() {
    this.stackA = new stack(10)
    this.stackB = new stack(10)
  }
  maxValue(x, y) {
    return x > y ? x : y
  }
  max() {
    return this.maxValue(this.stackA.max(), this.stackB.max())
  }
  push(x) {
    this.stackB.push(x)
  }
  pop() {
    if (this.stackA.empty()) {
      while (!this.stackB.empty()) {
        this.stackA.push(this.stackB.pop())
      }
    }
    return this.stackA.pop()
  }
}
