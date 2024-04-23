/**
 * 问题：如果我们把二叉树看成一个图，父子节点之间的连线看成是双向的，我们姑且定义“距离”为两个节点之间边的个数。写一个程序求一棵二叉树中相距最远的两个节点之间的距离。
 * 对于任意一个节点，以该节点为根，假设这个根有K个孩子节点，那么相距最远的两个节点U和V之间的路径与这个根节点的关系有两种情况。
 * 1. 若路径经过根Root，则u和v是属于不同子树的，且它们都是该子树中到根节点最远的节点，否则跟它们的距离最远相矛盾。
 * 2. 如果路径不经过Root，那么它们一定属于根的K个子树之一。并且它们也是该子树中相距最远的两个顶点。
 * 因此，问题就可以转化为在子树上的解，从而能够利用动态规划来解决。
 * 假设子树k的最远距离表示为d(uk, vk)，子树k的父节点r，即子树r的最远距离为：r的所有子树(0<=i<=k)最远距离，以及距离r节点最远的两个节点的距离中距离的最大值
 * 子树r的最远距离 = max(max(...d(ui,vi)), d(ui, r) + d(vi, r) + 2)
 */

/**
 * 树节点的数据结构
 * 需要保存的信息：
 * - 此问题节点的值没有具象
 * - 节点左子树最远距离
 * - 节点右子树最远距离
 * - 左子树的根节点
 * - 右子树的根节点
 */
class Node {
  constructor(value) {
    this.value = value
    this.leftMax = 0
    this.rightMax = 0
    this.leftChild = null
    this.rightChild = null
  }
  static of(value) {
    return new Node(value)
  }
  withLeftChild(leftChild) {
    this.leftChild = leftChild
    return this
  }
  withRightChild(rightChild) {
    this.rightChild = rightChild
    return this
  }
  withValue(value) {
    this.value = value
    return this
  }
}

let maxDistance = 0
/**
 * 深度遍历树，递归过程
 */
function findMaxDistance(node) {
  if (!node) {
    return 0
  }
  let leftChildMaxDistance = rightChildMaxDistance = 0
  leftChildMaxDistance = findMaxDistance(node.leftChild)
  node.leftMax = (node.leftChild && Math.max(node.leftChild.leftMax + 1, node.leftChild.rightMax + 1)) || 0
  rightChildMaxDistance = findMaxDistance(node.rightChild)
  node.rightMax = (node.rightChild && Math.max(node.rightChild.leftMax + 1, node.rightChild.rightMax + 1)) || 0
  const currentNodeMax = Math.max(Math.max(leftChildMaxDistance, rightChildMaxDistance), node.leftMax + node.rightMax)
  if (currentNodeMax > maxDistance) {
    maxDistance = currentNodeMax
  }
  return maxDistance
}
/**
 * 构建树
 * nodes = [[[1,2],[[null, 4], null]], [3, [[2, 3], [null, [2, 3]]]]]
 */
function createTree(nodes) {
  if (!(nodes instanceof Array)) {
    return Node.of(nodes)
  }
  let nodeValue = 0, leftChild, rightChild
  if (nodes[0] !== null) {
    leftChild = createTree(nodes[0])
    nodeValue += leftChild.value
  }
  if (nodes[1] !== null) {
    rightChild = createTree(nodes[1])
    nodeValue += rightChild.value
  }
  return Node.of(nodeValue).withLeftChild(leftChild).withRightChild(rightChild)
}
/**
 * 总结：
 * 树数据结构的优点：
 * 容易保存之前遍历过的值，容易实现动态规划（我自己的理解）
 */