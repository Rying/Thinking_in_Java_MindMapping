/**
 * 二叉树的三种遍历次序——前序、中序、后序
 * 重建二叉树：
 * 假设已经有了前序遍历和中序遍历的结果，希望通过一个算法重建这棵树。
 * 给定函数的定义如下：
 * rebuild(preOrderArray, InOrderArray, nTreeLen, root)
 * 例如
 * 前序遍历的结果：abdcef
 * 中序遍历的结果：dbaecf
 * 前序遍历：先访问当前节点，然后以前序访问左子树，右子树。
 * 中序遍历：先以中序遍历左子树，接着访问当前节点，然后以中序遍历右子树。
 * 后序遍历：首先遍历左子树，然后遍历右子树，最后访问根结点，在遍历左、右子树时，仍然先遍历左子树，然后遍历右子树，最后遍历根结点。
 * 根据前序遍历和中序遍历的特点，可以发现如下规律：
 * 前序遍历的每一个节点，都是当前子树的根节点。同时，以根节点为边界，就会把中序遍历的结果分为左子树和右子树
 */
function rebuild(preOrderArray, inOrderArray, nTreeLen) {
  if(!nTreeLen) {
    return null
  }
  const currentRoot = preOrderArray[0]
  const rootNode = Node.of(currentRoot)
  const rootIndex = inOrderArray.findIndex(v => v === currentRoot)
  const inOrderSubArrayLeft = inOrderArray.slice(0, rootIndex)
  const inOrderSubArrayRight = inOrderArray.slice(rootIndex+1)
  const leftSubTreeLength = inOrderSubArrayLeft.length
  const rightSubTreeLength = inOrderSubArrayRight.length
  const preOrderSubArrayLeft = preOrderArray.slice(1, leftSubTreeLength + 1)
  const preOrderSubArrayRight = preOrderArray.slice(leftSubTreeLength + 1, leftSubTreeLength + 1 + rightSubTreeLength)
  return rootNode
          .withLchild(rebuild(preOrderSubArrayLeft, inOrderSubArrayLeft, leftSubTreeLength))
          .withRchild(rebuild(preOrderSubArrayRight, inOrderSubArrayRight, rightSubTreeLength))
}
/**
 * 根据中序，后序结果，重建二叉树
 * 
 */

/**
 * 栈替换递归
 */
/**
 * 二叉树三种遍历的实现：
 * 算法实现
 */
const result = []
function preOrderIterate(node) {
  if (!node) return
  result.push(node.value)
  preOrderIterate(node.lchild)
  preOrderIterate(node.rchild)
}
function inOrderIterate(node) {
  if (!node) return
  inOrderIterate(node.lchild)
  result.push(node.value)
  inOrderIterate(node.rchild)
}
function postOrderIterate(node) {
  if (!node) return
  postOrderIterate(node.lchild)
  postOrderIterate(node.rchild)
  result.push(node.value)
}
/**
 * 递归转化为非递归实现。
 * 递归代码可读性会更好，但是执行效率会低于循环。
 * 递归实际上是栈的结构，函数调用栈。
 * 后进先出，也就是递归到最深的那一层调用会最先执行
 */
function preOrderIterate(node) {
  const parentStack = [] // 保存父节点推入顺序，后进先出（递归）
  const result = []
  let root = node
  while (root || parentStack.length) {
    while (root) {
      console.log(root.value)
      result.push(root.value)
      parentStack.push(root)
      root = root.lchild
    }
    root = parentStack.pop()
    root = root.rchild
  }
  return result
}

function inOrderIterate(node) {
  const nodeStack = []
  const result = []
  let root = node
  while(root || nodeStack.length) {
    while(root) {
      nodeStack.push(root)
      root = root.lchild
    }
    root = nodeStack.pop()
    result.push(root.value)
    root = root.rchild
  }
  return result
}
function postOrderIterate(node) {
  if (!node) return 
  const nodeStack = []
  const result = []
  let root = node
  while (root || nodeStack.length) {
    while (root) {
      if (!root.visited) {
        break
      } else {
        console.log('push stack:', root)
        nodeStack.push(root)
        root.visited = true
        root = root.lchild
      }
    }
    root = nodeStack[nodeStack.length - 1]
    console.log(root)
    if (!root.rchild || root.rchild.visited) {
      console.log('pop stack:', root)
      nodeStack.pop()
      result.push(root.value)
      root = nodeStack[nodeStack.length - 1]
    } else {
      root = root.rchild
      console.log('rchild:', root)
    }
  }
  return result
}
/**
 * 二叉树的层序遍历
 * 问题1: 给定一棵二叉树，要求按分层遍历该二叉树，即从上到下按层次访问该二叉树（每一层将单独输出一行），每一层要求访问的顺序为从左到右，并将节点依次编号。
 * 问题2: 写另外一个函数，打印二叉树中的某层次的节点（从左到右），其中根节点为第0层，函数原型为int PrintNodeAtLevel（Node*root，int level），成功返回1，失败则返回0。
 */
class Node {
  constructor(value) {
    this.value = value
    this.lchild = null
    this.rchild = null
    this.visited = false
  }
  static of(value) {
    return new Node(value)
  }
  visited() {
    this.visited = true
  }
  withLchild(lchild) {
    this.lchild = lchild
    return this
  }
  withRchild(rchild) {
    this.rchild = rchild
    return this
  }
}

/**
 * 问题二：
 * 打印二叉树某层的所有节点: printNodeAtLevel(Node node, level)
 * 假设要访问二叉树第k层节点，可以转化成访问以左右子节点为根节点的第k-1层节点 r(k) = l(k-1) + r(k-1)。
 * 每向下一层，传入的层数减1，直到传入的层数为0
 * 看这个结构，可以用递归实现
 */
/**
 * 为了转化成尾调用，提高算法效率，带入上一次结果。
 * js中尾调用的效率，近乎循环的效率。
 */
function printNodeAtLevel(node, level, lresult = '') {
  if(!node) { return lresult }
  if(!level) {
    return lresult + '' + node.value
  }
  return printNodeAtLevel(node.rchild, level - 1, printNodeAtLevel(node.lchild, level - 1))
}

/**
 * 问题一：
 * 如果知道二叉树总共有多少层，就可以用问题二的解法，分别打印1...depth层的所有节点。
 * 如果未知二叉树层数呢
 */
function printAllNodes(node, result='') {
}
