const fs = require('fs'),
      assert = require('assert'),
      csv = require("fast-csv"),
      mongo = require('mongodb'),
      zipcodes = require('zipcodes'),
      nconf = require('nconf');

nconf.file({ file: 'ingest-config.json' });

nconf.defaults({
  "mongodb": {
    //"uri": "mongodb://devctlvsse00273.iteclientsys.local:27017/eddm",
    "fraud-activity-collection": "fraud-activities"
  }
});

const dbUri      = nconf.get('mongodb:uri');
const collection = nconf.get('mongodb:fraud-activity-collection');
const file       = nconf.get('files:fraud-activity-csv-file');
//const file       = nconf.get('files:email-campaign-csv-file');
//const file       = nconf.get('files:chat-activity-csv-file');

var mongoClient = mongo.MongoClient;

var stream = fs.createReadStream(file);
var count = 0;

var insertDocument = function(db, item, callback) {

  var event_ts = new Date("1990-01-01T00:00:00");
  var created  = new Date();

  var user_agent_type_nm = "";
  if (item.user_agent_type_nm) {
    user_agent_nm = String(item.user_agent_type_nm);
  }

  try
  {
    event_ts = new Date(item.event_ts);
  }
  catch (error)
  {
    console.log("------ event_ts conversion exception: " + item._id);
  }

  db.collection(collection).insertOne(
    {
      "status"              : String(item.Status),
      "risk"                : Number(item.Risk),
      "userInternalId"      : String(item.User_Internal_ID),
      "account"             : String(item.Account),
      "session"             : String(item.Session),
      "riskFactor"          : String(item.Risk_Factor),
      "activity"            : String(item.Activity),
      "ipAddress"           : String(item.IP_Address),
      "ipType"              : String(item.IPType),
      "provider"            : String(item.Provider),
      "country"             : String(item.Country),
      "state"               : String(item.State),
      "city"                : String(item.City),
      "language"            : String(item.Language),
      "osBrowser"           : String(item.OSBrowser),
      "userAgent"           : String(item.User_Agent),
      "browserPlugins"      : String(item.Browser_Plugins),
      "screenResolution"    : String(item.Screen_Resolution),
      "timezoneOffset"      : String(item.Timezone_Offset),
      "acceptEncoding"      : String(item.Accept_Encoding),
      "httpCookie"          : String(item.HTTP_Cookie),
      "javaEnabled"         : String(item.Java_Enabled),
      "cookiesEnabled"      : String(item.Cookies_Enabled),
      "actor"               : String(item.Actor),
      "network"             : String(item.Network),
      "timeSinceLast"       : String(item.Time_since_last),
      "distanceFromLast"    : String(item.Distance_from_last),
      "riskBasedAuth"       : String(item.Risk_based_Auth),
      "transferStatus"      : String(item.Transfer_Status),
      "GMT"                 : String(item.GMT),
      "localTime"           : String(item.Local_time),
      "link"                : String(item.Link),
      "created"             : created
    },
    function(err, result) {
    assert.equal(err, null);
    console.log("doc " + String(item.IP_Address));
    callback();
  });
};

mongoClient.connect(dbUri, function(err, db) {
  assert.equal(null, err);

  csv
  .fromStream(stream, {headers : true, ignoreEmpty: true})
  .on("data", function(data){
     count++;
     insertDocument(db, data, function() {});
     //console.log(data);
  })
  .on("end", function(){
     // all rows have been inserted, so close the db connection
     db.close();
     console.log("");
     console.log("-----");
     console.log("count: " + count);
     console.log("done");
  });
});
