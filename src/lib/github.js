const { Octokit } = require('@octokit/rest')
const btoa = require('btoa-lite')
const { download } = require('./download-img')

module.exports = (owner, repo) => {
  const {
    GITHUB_TOKEN,
  } = process.env

  const clientWithAuth = new Octokit({
    auth: GITHUB_TOKEN,
  })
  const getContent = async (path) => {
    return await clientWithAuth.repos.getContent({
      owner,
      repo,
      path,
    })
  }
  const remove = async (path, sha) => {
    clientWithAuth.repos.deleteFile({
      owner,
      repo,
      path,
      message: `Removing ${path}`,
      sha,
    })
  }
  const addImage = async (url, path) => {
    let image
    try {
      image = await download(url)
    } catch (err) {
      throw new Error('Cant download image')
    }

    try {
      await add(path, 'Upsert image', btoa(image))
      return path
    } catch (err) {
      console.log(err)
      throw new Error('Cant add image to repo')
    }
  }
  const move = async (path, newPath, newContent = false) => {
    console.log('DONT USE, not working as expected')
    let sha = false
    let content = ''
    const data = await getWithSha(path)
    if (!newContent) {
      sha = data.sha
      content = data.content
    }
    try {
      await remove(path, sha)
    } catch (err) {
      console.log('Error on remove: ', err)
      return
    }
    try {
      const insertObj = {
        owner,
        repo,
        path: newPath,
        message: `${path} -> ${newPath}`,
        content: newContent ? btoa(newContent) : content,
      }
      await clientWithAuth.repos.createOrUpdateFileContents(insertObj)
    } catch (err) {
      console.log('Error on add:', err)
    }
    return
  }
  const add = async (path, message, content, sha = false) => {
    const updateObj = { owner, repo, path, message, content }
    if (sha) {
      updateObj.sha = sha
    } else {
      let fileContent = {}
      try {
        fileContent = await getContent(path)
      } catch (err) {
        fileContent = {}
      }
      const { data = {} } = fileContent
      const { sha:foundSha = false } = data
      if (foundSha) {
        updateObj.sha = foundSha
      }
    }
    await clientWithAuth.repos.createOrUpdateFileContents(updateObj)
  }
  const getWithSha = async (path) => {
    const response = await getContent(path)
    const { data } = response
    const { content, sha } = data
    const buff = new Buffer(content, 'base64')
    return {
      data: buff.toString('utf8'),
      sha,
    }
  }
  const get = async (path, toUtf8 = true) => {
    const response = await getContent(path)
    const { data } = response
    const { content } = data
    const buff = new Buffer(content, 'base64')
    if (toUtf8) {
      return buff.toString('utf8')
    }
    return buff
  }
  const list = async (path) => {
    return await getContent(path)
  }
  return {
    add,
    addImage,
    getContent,
    getWithSha,
    remove,
    move,
    get,
    list,
  }
}
