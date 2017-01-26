const postHandler = require('../db/postController.js');
const { fetchHandler, queryHandler } = require('../db/getController.js')

const postData = (req, res) => {

  const callback = (postData) => {
    console.log('sending back an okay status', postData);
    res.status(201).send('okay.');
  }

  return postHandler(req.body, callback);
}

const getData = (req, res) => {

  const callback = (data) => {
    res.status(200).json(data)
  }

  if (req.query) {
    return queryHandler(req.query, callback)
  }

  return fetchHandler(callback);
}

module.exports = (app, express) => {
  app.route('/api')
    .post(postData)
    .get(getData)
}