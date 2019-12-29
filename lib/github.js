const btoa = require("btoa-lite");
const Octokit = require("@octokit/rest");

module.exports = (owner, repo) => {
  const {
    GITHUB_TOKEN
  } = process.env;

  const clientWithAuth = new Octokit({
    auth: GITHUB_TOKEN
  });
  const getContent = async (path) => {
    return await clientWithAuth.repos.getContents({
        owner,
        repo,
        path
    });
  }
  const add = async (path, message, content) => {
    let fileContent = {}
    try {
      fileContent = await getContent(path);
    } catch (err) {
      fileContent = {};
    }
    const { data = {} } = fileContent;
    const { sha = false } = data;
    const updateObj = { owner, repo, path, message, content };
    if (sha) {
      updateObj.sha = sha;
    }
    await clientWithAuth.repos.createOrUpdateFile(updateObj)
  }
  const get = async (path) => {
    const response = await getContent(path);
    const { data } = response;
    const { content } = data;
    const buff = new Buffer(content, 'base64');
    return buff.toString('utf8');
  }
  const list = async (path) => {
    return await clientWithAuth.repos.getContents({
        owner,
        repo,
        path
    });
  }
  return {
    add,
    get,
    list
  }
}
