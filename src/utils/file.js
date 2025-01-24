import path from 'path'
import fs from 'fs'

export default {
  getAllFilePaths
}

export function getAllFilePaths(dir) {
  return _getAllFilePaths(dir, './', 5)
}

function _getAllFilePaths(filePath, localpath, deep) {
  if (deep === 0) {
    return [], []
  }

  let filePathResult = []
  let localPathResult = []

  // 读取目录中的所有文件和子目录
  fs.readdirSync(filePath).forEach(function (file) {
    const newFilePath = path.join(filePath, file)
    const newLocalPath = path.join(localpath, file)

    // 如果是目录，则递归读取该目录下的文件
    if (fs.statSync(newFilePath).isDirectory()) {
      const { filePathResult: _filrPath, localPathResult: _localPath } = _getAllFilePaths(
        newFilePath,
        newLocalPath,
        deep - 1
      )
      filePathResult = filePathResult.concat(_filrPath)
      localPathResult = localPathResult.concat(_localPath)
    } else {
      // 如果是文件，则直接加入结果数组
      filePathResult.push(newFilePath)
      localPathResult.push(newLocalPath)
    }
  })

  return {
    filePathResult,
    localPathResult
  }
}
