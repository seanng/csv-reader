(function() {
  angular.module('csvReader.services.formatter', [])
  .factory('formatMessage', () => {

    const formatMessage = (query, response) => `
      <div class="row">
        <div class="col-xs-6">
          Object Type:
        </div>
        <div class="col-xs-6">
          ${query.objType}
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6">
          Object ID:
        </div>
        <div class="col-xs-6">
          ${query.objId}
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6">
          UNIX Timestamp:
        </div>
        <div class="col-xs-6">
          ${query.timestamp*1}
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6">
          Formatted Time:
        </div>
        <div class="col-xs-6">
          ${moment(query.timestamp*1).format("MMM DD YYYY, hh:mm:ss")}
        </div>
      </div>
      <br /><br />
      The Object State was: <br />
      ${response.data.stateAttributes}
    `

    return formatMessage;
  })
})()