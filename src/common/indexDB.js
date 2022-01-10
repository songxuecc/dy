const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB
const dbVersion = 2
// 打开数据库
var request = indexedDB.open('HHGJ', dbVersion)
var db

const storeName = 'custom_prices'
const createObjectStore = function (dataBase) {
  console.log('数据库创建成功')
  dataBase.createObjectStore(storeName, { keyPath: 'id' })
}

request.onsuccess = function (event) {
  db = request.result

  // Interim solution for Google Chrome to create an objectStore. Will be deprecated
  if (db.setVersion) {
    if (db.version !== dbVersion) {
      var setVersion = db.setVersion(dbVersion)
      setVersion.onsuccess = function () {
        createObjectStore(db)
      }
    }
  }
  console.log('数据库打开成功')
}

request.onupgradeneeded = function (event) {
  db = event.target.result
  if (!db.objectStoreNames.contains(storeName)) {
    createObjectStore(db)
  }
}
request.onerror = function (event) {
  console.log('数据库打开报错', event)
}

// 读取数据
export function read (storeName) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName])
    var objectStore = transaction.objectStore(storeName)
        // objectStore.get()方法用于读取数据，参数是主键的值
    var request = objectStore.get(1)

    request.onerror = function (event) {
      reject(new Error('事务失败'))
    }

    request.onsuccess = function (event) {
      if (request.result) {
        const {id, ...rest} = request.result
        resolve(rest)
      } else {
        console.log('未获得数据记录')
        resolve({})
      }
    }
  })
}

// 新增数据
export function add (storeName, data) {
  return new Promise((resolve, reject) => {
    var request = db.transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .add({ id: 1, ...data })

    request.onsuccess = function (event) {
      console.log('数据写入成功')
      resolve(true)
    }

    request.onerror = function (event) {
      console.log('数据写入失败')
      reject(new Error('数据写入失败'))
    }
  })
}

export function update (storeName, data) {
  return new Promise((resolve, reject) => {
    var request = db.transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .put({ id: 1, ...data })

    request.onsuccess = function (event) {
      console.log('数据更新成功')
      resolve(true)
    }

    request.onerror = function (event) {
      console.log('数据更新失败')
      reject(new Error('数据更新失败'))
    }
  })
}

// 删除数据
export function remove (storeName) {
  return new Promise((resolve, reject) => {
    var request = db.transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .delete(1)

    request.onsuccess = function (event) {
      console.log('数据删除成功')
      resolve(true)
    }

    request.onerror = function (event) {
      console.log('删除数据失败')
      reject(new Error('删除数据失败'))
    }
  })
}
