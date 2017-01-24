const { getHandler, postHandler } = require('../db/controllers.js');

const postData = (req, res) => {
  postHandler(req.body, ()=>{
    res.status(201).send('okay.')
  });
}

const getData = (req, res) => {
  console.log('query', req.params.query)
}

module.exports = (app, express) => {
  app.route('/api')
    .post(postData)
    .get(getData)
}