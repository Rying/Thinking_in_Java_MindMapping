/**
 * 链表的数据结构
 */
class Node {
  constructor(val, next) {
    this.val = val
    this._next = next
  }
  get next() {
    return this._next
  }
  set next(next) {
    this._next = next
  }
}

/**
 * 创建带哨兵节点的链表
 * @param {*} arr 
 * @returns 
 */
function createLink(arr) {
  const pHeader = new Node(null)
  let pCur = pHeader
  arr.forEach(element => {
    const node = new Node(element)
    pCur.next = node
    pCur = node
  });
  return pHeader
}

/**
 * 判断链表是否有环，如果有环，返回环的入口节点
 * 解法一：
 * 用一个容器存储之前遍历过的节点，有环，会遇到之前访问过的节点
 * 循环初始条件：pCur = pHeader
 * 转换条件：pCur = pCur.next
 * 该算法会有2a + b - 1的空间复杂度
 */
function existCircle(pHeader) {
  if (!pHeader) return null

  const iteredNodes = [pHeader]
  let pCur = pHeader.next
  while(pCur) {
    if (iteredNodes.find(item => item === pCur)) {
      return pCur
    }
    iteredNodes.push(pCur)
    pCur = pCur.next
  }
  return null
}

/**
 判断链表是否有环，如果有环，返回环的入口节点
 * 解法二：
 * 快慢指针法
 * 慢指针遍历步长为1，快指针遍历步长为2；快慢指针第一次相遇的时候，快指针遍历的节点数是慢指针的两倍。因此相遇节点到环的入口点的距离等于初始节点到环入口点的距离
 * 循环初始条件：slow = fast = pHeader
 * 转换条件：slow = slow.next;fast = fast.next.next
 * 结束条件：slow === fast || fast === undefined || fast.next === undefined
 */
function existCircle(pHeader) {
  if (!pHeader || !pHeader.next) return null
  let slow = pHeader.next, fast = pHeader.next.next
  while (slow !== fast && fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }
  if (!(fast && fast.next)) {
    return null
  }
  let pstart1 = pHeader, pstart2 = slow
  while(pstart1 !== pstart2) {
    pstart1 = pstart1.next
    pstart2 = pstart2.next
  }
  return pstart1
}

