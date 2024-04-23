// N!中5的个数
const getFiveCounts = (n) => {
  let res = 0
  if (n < 5) return res;
  for (let i = 5; i <= n; i += 5) {
    let j = i
    while (j % 5 === 0) {
      res++
      j = j / 5
    }
  }
  return res
}

// z = N / 5 + N / 5**2 + N / 5**3...直到 5**? > N
const getFiveCounts1 = (n) => {
  let res = 0, denominator = 5
  let countOfFives = Math.floor(n / denominator)
  while (countOfFives > 0) {
    res += countOfFives
    denominator *= 5
    countOfFives = Math.floor(n / denominator)
  }
  return res
}
// 计算阶乘
const calcFactorial = (n) => {
  let res = 1
  while (n > 0) {
    res *= n
    n--
  }
  return res
}

