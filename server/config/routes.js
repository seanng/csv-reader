const { postHandler } = require('../db/controllers.js');

const postData = (req, res) => {
  postHandler(req.body, (resultsArr)=>{
    console.log('sending back an okay status', resultsArr);
    res.status(201).send('okay.');
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