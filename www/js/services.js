angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Productions', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  /*
  var pets = [
    { id: '2013112717421001', title: 'EB13071000020 - ', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: '2013111516093612', title: 'Cats', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: 1, title: 'Dogs', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { id: 2, title: 'Turtles', description: 'Everyone likes turtles.' },
    { id: 3, title: 'Sharks', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }
  ];
  */
  
  var productions = {};

  /*
  var dbAppConfig = dbAppConfig || DB("app_config");
var CONFIG = dbAppConfig.get();
var ts = Math.round((new Date()).getTime() / 1000); // in seconds
if (Object.keys(CONFIG).length == 0 || (CONFIG.ts + 3600 < ts)) {  
   CONFIG = getJsonSync(API+"/ajax.php?m=getconfig");
   dbAppConfig.put(CONFIG);
}
*/

  wcFwk.ajax_postJsonSync(API+'/getproductions', {office_seq: '1002' }, function(data) {
    if (data.items) {       
        for (var i = 0; i < data.items.length; i++) {
            var obj = data.items[i];
            productions[ obj.prod_number ] = obj;
        } 
     }
     console.log(productions);
  });

  
  /*
  $http.post(API+'/getproductions', {'office_seq' => 1002, 'noCache': noCache }).success(function(data) {
    //$scope.phones = data;
    console.log(data);
    productions = data.items;
  });
  */
  
  /*
   $.ajax({
          dataType: "json",
          url: API+'/getproductions', 
          data: { 'key': key, 'noCache': noCache }, 
          async: false,
          success: function(data) {
              console.log(data);
              //console.log(JSON.parse(data || '{}'));
              return (data || '{}');
          }
          });
       */ 
  
  return {
    all: function() {
      return productions;
    },
    get: function(prodId) {
      // Simple index lookup
      return productions[prodId];
    }
  }
});
