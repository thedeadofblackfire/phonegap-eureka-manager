var BASE_URL = 'https://vendor.eureka-platform.com';
var ENV = 'production';
if (window.location.hostname == 'ebox.phonegap.local') {
    BASE_URL = 'http://eureka.vendor';
    ENV = 'dev';
}
var API = BASE_URL+'/api/mobile';

/* ------------- */   
/* LOCAL STORAGE */
/* ------------- */     
function DB(key) {
   var store = window.localStorage;
   return {
      get: function() {
         //window.localStorage.getItem('user_lat');
         return JSON.parse(store[key] || '{}');   
      },
      put: function(data) {
         store[key] = JSON.stringify(data);
         //window.localStorage.setItem('user_lat', LatitudeCarteClick);
      }
   }
}

/* ------------- */   
/* NATIVE AJAX   */
/* ------------- */     
function sendRequest(url,callback,postData) {
	//var req = createXMLHTTPObject();
    var req = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();

	if (!req) return;
	var method = (postData) ? "POST" : "GET";
	req.open(method,url,true);
	req.setRequestHeader('User-Agent','XMLHTTP/1.0');
	if (postData)
		req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) {
//			alert('HTTP error ' + req.status);
			return;
		}
		callback(req);
	}
	if (req.readyState == 4) return;
	req.send(postData);
}
/*
//http://www.quirksmode.org/js/xmlhttp.html
var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i=0;i<XMLHttpFactories.length;i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}
*/
function postAsync(url, data, callback) {
      var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = doNothing;
          callback(xhr, xhr.status);
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
      json_data = encodeURIComponent(JSON.stringify(data));
      xhr.send(json_data);
}



function postJsonAsync(url, data, callback) {
      var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          xhr.onreadystatechange = doNothing;
          callback(JSON.parse(xhr.responseText));
        }
      };

      xhr.open('POST', url, true);
      //xhr.setRequestHeader('User-Agent','XMLHTTP/1.0');
      //xhr.setRequestHeader('X-Test', 'one');
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      //xhr.setRequestHeader("Content-type","application/json");
      //xhr.setRequestHeader("Accesskey","sPyAg3nT#");
      
      json_data = encodeURIComponent(JSON.stringify(data));
      xhr.send(wcFwk.getAsUriParameters(data));
}
        
function getJsonAsync(url, data, callback) {
      var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
      /*
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            //done
            json_data = JSON.parse(xhr.responseText);          
            return json_data;
          }
        };
      */
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = doNothing;
          callback(xhr, xhr.status);
        }
      };

      xhr.open('GET', url, true);
      xhr.setRequestHeader("Content-type","application/json");
      json_data = JSON.stringify(data);      
      xhr.send(json_data);
}
    
function getJsonSync(url) {
      var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();                
      xhr.open('GET', url, false);
      xhr.send(null);            
      if (xhr.status === 200) {          
          json_data = JSON.parse(xhr.responseText);          
          return json_data;
      }                   
      //return JSON.parse('{}');       
}

function doNothing() {}

/* ------------- */   
/* Ebox          */
/* ------------- */  
var appEbox = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        appEbox.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    takePicture: function() {
      navigator.camera.getPicture( function( imageURI ) {
        alert( imageURI );
      },
      function( message ) {
        alert( message );
      },
      {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
      });
    },
    
    takeScannerDatamatrix: function() {
      // alert('takeScanner DATA_MATRIX');
      cordova.plugins.barcodeScanner.scan(
          function (result) {
              alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          }, 
          function (error) {
              alert("Scanning failed: " + error);
          }
       );
    },
    
    takeScannerCode: function() {
      // alert('takeScanner CODE_128');
      cordova.plugins.barcodeScanner.scan(
          function (result) {
              alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          }, 
          function (error) {
              alert("Scanning failed: " + error);
          }
       );
    }
};
