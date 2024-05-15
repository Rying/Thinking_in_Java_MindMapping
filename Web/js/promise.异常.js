async function errorFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('eeee'))
    }, 1000)
  })
}

const promise = errorFunction()

const promises = []
promises.push(promise)

async function errorHandler() {
  try {
    await promise
  } catch (error) {
    console.log('handle error:')
  }

}
errorHandler()
async function consumePromise() {
  try {
    await promises[0]
  } catch (error) {
    console.log("consumePromise")
  }
}

consumePromise()
