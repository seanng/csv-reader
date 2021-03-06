/*jshint esversion: 6 */
const express = require('express'),
       { db } = require('./db/config.js'),
         app  = express(),
         port = 3000;


require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

app.listen(port, () => {
  console.log('Server listening on port ' + port);
  db.sync({force:false});

});
