var BASE_URL = 'https://vendor.eureka-platform.com';
var ENV = 'production';
if (window.location.hostname == 'ebox.phonegap.local') {
    BASE_URL = 'http://eureka.vendor';
    ENV = 'dev';
}
var API = BASE_URL+'/api/mobile';

var dbAppUser = dbAppUser || wcFwk.DB("app_user");
var objUser = {};
var objProduction = {};

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
        
        // get automatically user from session
        objUser = dbAppUser.get();
		//objUser = window.sessionStorage.getItem('user');
		if (objUser) {
			//objUser = JSON.parse(objUser);	
			console.log('retrieved user: ', objUser);
		}     

        checkPreAuth();
        
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

jQuery(document).ready(function($){
    
    $(document).on('click', '.btn-logout', handleLogout);

	$(document).on('click', "#btnLogin", handleLoginForm);
	
    //$(document).on('pageinit', '#pageLogin', function(e) {
    $(document).on('pagebeforeshow', '#pageLogin', function(){  
		//$("#pageLogin").on("pageinit", function(e) {
        console.log('#pageLogin pageinit');
       // checkPreAuth();
    });
    
	$(document).on('pagebeforeshow', '#pageProductions', function(){  
		console.log('#pageProductions pagebeforeshow');	
		
          //var user = dbAppUser.get();
          //console.log(objUser);
          wcFwk.ajax_postJsonSync(API+'/getproductions', {office_seq: objUser.office.office_seq }, function(data) {
            //console.log(data);  
            if (data.items) { 
                objProduction = {};    
                for (var i = 0; i < data.items.length; i++) {
                    var obj = data.items[i];
                    objProduction[ obj.prod_number ] = obj;
                } 
             }
             console.log(objProduction);
             
             // build list
             loadProductionsList(objProduction);
          });
  
	
    });   
    
});


    /* 
     * mobile framework - Change Page
     * pageid = test.html or #changePage
     */
    function mofChangePage(pageid) {			
        $.mobile.changePage(pageid);
    }
    
    function mofProcessBtn(id, state) {
        if (state) {
            $(id).addClass("ui-state-disabled");
            //$(id).html('processing...');
        } else {
            $(id).removeClass("ui-state-disabled");
        }
    }
	
	function checkPreAuth() {
		console.log('checkPreAuth');	                  
		if(Object.keys(objUser).length == 0 && window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {		
			handleLogin(window.localStorage["username"], window.localStorage["password"]);
		}
	}

    function handleLoginForm() {
		console.log('handleLoginForm');			
		var form = $("#formLogin");  	
		//disable the button so we can't resubmit while we wait
		//$("#submitButton",form).attr("disabled","disabled");
		$("#btnLogin").attr("disabled","disabled");
		var u = $("#username", form).val();
		var p = $("#password", form).val();
        handleLogin(u,p);
    }
        
	function handleLogin(u,p) {
		console.log('handleLogin');		

        // show loading icon
       //$.mobile.showPageLoadingMsg();        
       //$.mobile.showPageLoadingMsg("b", "This is only a test", true);
   
		//var form = $("#loginForm");  	
		//disable the button so we can't resubmit while we wait
		//$("#submitButton",form).attr("disabled","disabled");
        mofProcessBtn("#btnLogin", true);

		if(u != '' && p!= '') {  
            $.mobile.loading('show');
			$.post(API+"/authlogin", {login:u,pass:p,rememberme:1}, function(res) {
				console.log(res);
                //$.mobile.hidePageLoadingMsg();
				if(res.success == true) {
					//store
					window.localStorage["username"] = u;
					window.localStorage["password"] = p; 			
					//window.sessionStorage["user_id"] = res.user.user_id; 
					//window.sessionStorage.setItem('user', JSON.stringify(res.user));
                    dbAppUser.put(res.user);

				    objUser = res.user;
                    
                    // launch the push notification center because it's required objUser
                    //push_onDeviceReady();
                    $.mobile.loading('hide');
					
                    mofProcessBtn("#btnLogin", false);
                    
                    mofChangePage('#pageProductions');
				} else {	
                    //Invalid Email Address/Password
					console.log(res.redirection_error);
					if (ENV == 'dev') {
						alert(res.redirection_error);
					} else {
						navigator.notification.alert(res.redirection_error, alertDismissed);
					}	
                    mofProcessBtn("#btnLogin", false);
			   }
			},"json");
		} else {        
			if (ENV == 'dev') {
				alert('You must enter a username and password');
			} else {				
				navigator.notification.alert("You must enter a username and password", alertDismissed);
			}
            mofProcessBtn("#btnLogin", false);
		}
		return false;
	}

	function handleLogout() {
		console.log('handleLogout');	
		
		$.getJSON(API+"/logout", function(res) {
			if (res.success) {
				window.localStorage.clear();  
				window.sessionStorage.clear();		
                
                mofChangePage('#pageLogin');
			}
		});
				
	}
    
    function alertDismissed() {
        // do something
    } 
    
    
    function loadProductionsList(data) {
        //var htmlUserList = templateChatUserList(data);
        
        var htmlList = '';
        //var title = 'You have no active chats';
        //if (data.online_user.length > 0) title = 'Your currently active chats';
                                            
        htmlList += '<ul id="chat_userlist" data-role="listview">';
        //htmlUserList += '<li data-role="list-divider" id="activechat_title">'+title+'</li>';
        $.each(data, function(k, v) {
            htmlList += generateLineProduction(v);            
        });
        htmlList += '</ul>';
        
        $('#container_productionlist').html(htmlList);

        $("#listview-content").trigger('create');  
          
    }
    
    function generateLineProduction(v) {
        //htmlUserList += '<li data-icon="false"><a href="#pageChatSession?id='+v.session_id+'" sid="'+v.session_id+'" data-theme="e">'+v.name+'<p>CA</p> <p class="ui-li-aside"><strong>'+formatDate(v.start_date)+'</strong></p> <span class="ui-li-count">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></a></li>';
        
        // statehttp://www.iconarchive.com/show/american-states-icons-by-custom-icon-design.html
        
        //var lg = '<img src="img/country/us.png" alt="United States" class="ui-li-icon">';
        var str = '<li><a href="#pageProd?id=' + v.prod_number + '">' + v.prod_number + ' <p>'+ v.f_name + ' ' + v.l_name +'</p></a></li>';

        //str += '><a href="#pageChatSession?id=' + v.session_id + '" sid="'+v.session_id+'" data-theme="e">' + lg + v.name + ' <p class="ui-li-aside">started at <strong>'+formatDate(v.start_date)+'</strong></p> <span class="ui-li-count">'+(parseInt(v.totalmsg) + parseInt(v.totalreply))+'</span></a></li>';

        return str;
    }

  	
