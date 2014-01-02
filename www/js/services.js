angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Pets', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var pets = [
    { id: '2013112717421001', title: 'EB13071000020 - ', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: '2013111516093612', title: 'Cats', description: 'Furry little creatures. Obsessed with plotting assassination, but never following through on it.' },
    { id: 1, title: 'Dogs', description: 'Lovable. Loyal almost to a fault. Smarter than they let on.' },
    { id: 2, title: 'Turtles', description: 'Everyone likes turtles.' },
    { id: 3, title: 'Sharks', description: 'An advanced pet. Needs millions of gallons of salt water. Will happily eat you.' }
  ];
  
  var productions = {};

  var store = window.localStorage;
  var noCache = Date();  
  //'Accesskey': 'sPyAg3nT#',
  //wcFwk.ajax_postJsonAsync(API+'/getproductions', {office_seq: '1002', noCache: noCache }, function(data) {
  wcFwk.ajax_getJsonAsync(API+'/getproductions2', {office_seq: '1002' }, function(data) {
  });
  //var a = wcFwk.ajax_getJsonSync(API+'/getproductions2?office_seq=1002');
  //console.log(a);
  
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
      return pets;
    },
    get: function(petId) {
      // Simple index lookup
      return pets[petId];
    }
  }
});

/*
function DB(key) {
   var store = window.localStorage;

   var noCache = Date();
   var urlBase = $.trim(location.href).replace(/\/profile/g, "");
   //console.log(urlBase);
   
   return {
      get: function() {
        //return JSON.parse(store[key] || '{}')
        
        $.ajax({
          dataType: "json",
          url: urlBase+'/ajaxstoreget', 
          data: { 'key': key, 'noCache': noCache }, 
          async: false,
          success: function(data) {
              console.log(data);
              //console.log(JSON.parse(data || '{}'));
              return (data || '{}');
          }
          });
        
      },

      put: function(data) {
         store[key] = JSON.stringify(data)
      }
   }
}
*/