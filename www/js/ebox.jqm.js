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
// it should work on local storage if no connection 
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
              if (result.format == 'DATA_MATRIX') {
                alert('Success: '+result.text);
                
                var reference = $('#scanner_reference').val();  
                if (result.text != '' && result.text == reference) {
                    $('#scanner_datamatrix').val(result.text);
                    $('#btn_scanner_datamatrix').removeClass('ui-btn-c');
                    $('#btn_scanner_datamatrix').addClass('ui-btn-b');
                    controlScanner();
                } else {
                    alert('Value not match with '+reference);
                    $('#btn_scanner_datamatrix').removeClass('ui-btn-b');
                    $('#btn_scanner_datamatrix').addClass('ui-btn-c');
                }
                                 
              } else {
                alert('Please scan the datamatrix on the header bag');
                $('#btn_scanner_datamatrix').removeClass('ui-btn-b');
                $('#btn_scanner_datamatrix').addClass('ui-btn-c');
              }
              /*
              alert("We got a datamatrix\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
                    */
          }, 
          function (error) {
              alert("Scanning failed: " + error);
              $('#btn_scanner_datamatrix').removeClass('ui-btn-b');
              $('#btn_scanner_datamatrix').addClass('ui-btn-c');
          }
       );
    },
    
    takeScannerCode: function() {
      // alert('takeScanner CODE_128');
      cordova.plugins.barcodeScanner.scan(
          function (result) {
              if (result.format == 'CODE_128') {
                alert('Success: '+result.text);
                
                var reference = $('#scanner_reference').val();  
                if (result.text != '' && result.text == reference) {
                    $('#scanner_code128').val(result.text);
                    $('#btn_scanner_code128').removeClass('ui-btn-c');
                    $('#btn_scanner_code128').addClass('ui-btn-b');
                    controlScanner();
                } else {
                    alert('Value not match with '+reference);
                    $('#btn_scanner_code128').removeClass('ui-btn-b');
                    $('#btn_scanner_code128').addClass('ui-btn-c');
                }                                
                                
              } else {
                alert('Please scan the barcode on the ebox');
                $('#btn_scanner_code128').removeClass('ui-btn-b');
                $('#btn_scanner_code128').addClass('ui-btn-c');
              }
              /*
              alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
               */
          }, 
          function (error) {
              alert("Scanning failed: " + error);
              $('#btn_scanner_code128').removeClass('ui-btn-b');
              $('#btn_scanner_code128').addClass('ui-btn-c');
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
    
	$(document).on('pagebeforeshow', '#pageList', function(){  
		console.log('#pageList pagebeforeshow');	
		
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
    
        
    // Listen for any attempts to call changePage().     
    $(document).bind( "pagebeforechange", function( e, data ) {

        // We only want to handle changePage() calls where the caller is
        // asking us to load a page by URL.
        if ( typeof data.toPage === "string" ) {
            //console.log(data);
        
            // We are being asked to load a page by URL, but we only
            // want to handle URLs that request the data for a specific
            // category.
            var url = $.mobile.path.parseUrl( data.toPage ),
                regex = /^#pageProd/;  
            
            if ( url.hash.search(regex) !== -1 ) {
                console.log(url);

                // We're being asked to display the items for a specific category.
                // Call our internal method that builds the content for the category
                // on the fly based on our in-memory category data structure.               
                loadProduction(url, data.options);

                // Make sure to tell changePage() we've handled this call so it doesn't have to do anything.
                e.preventDefault();                
            }
            
        }
    });


    function loadProduction(urlObj, options) {      
        var params = hashParams(urlObj.hash);
  
        var prodnumber = params['id'];
        if( !prodnumber ) {
          mofChangePage('#pageList');
          return
        };
        
        console.log('loadProduction '+prodnumber);
     
       // show loading icon
       $.mobile.loading('show'); 
       
       var res = objProduction[ prodnumber ];
       console.log(res);
       
       var pageSelector = urlObj.hash.replace( /\?.*$/, "" );
               
       var $page = $( pageSelector );
       var $header = $page.children( ":jqmData(role=header)" );
       $header.find( "h1" ).html('#'+prodnumber);
         
       /*         
       var chapterHTML = '';
       chapterHTML += 'toto';
       
       $content = $page.children( ":jqmData(role=main)" );
       $content.html(chapterHTML);
       */
       $('#scanner_datamatrix').val('');
       $('#scanner_code128').val('');
       $('#scanner_result').html('');
       var reference = res.device_serial+''+res.prod_number;       
       $('#scanner_reference').val(reference);
       $('#scanner_prodnumber').val(res.prod_number);
       $('#scanner_prodfileseq').val(res.prodfile_seq);
         
       options.dataUrl = urlObj.href;
       //options.changeHash = false;
       //console.log(options);                      

       // switch to the page we just modified.
       $.mobile.changePage( $page, options );          
                                   
    };

        
});


    // parse params in hash
	function hashParams(hash) {
		var ret = {};
	    var match;
	    var plus   = /\+/g;
	    var search = /([^\?&=]+)=([^&]*)/g;
	    var decode = function(s) { 
	    	return decodeURIComponent(s.replace(plus, " ")); 
	    };
	    while( match = search.exec(hash) ) ret[decode(match[1])] = decode(match[2]);
	    
	    return ret
	};
    
    
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
                    
                    mofChangePage('#pageList');
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
    
    function controlScanner() {
        var datamatrix = $('#scanner_datamatrix').val();
        var code128 = $('#scanner_code128').val();
        if (datamatrix != '' && code128 != '') {
            var reference = $('#scanner_reference').val();
            if (datamatrix == code128) {
                if (datamatrix == reference) {
                    $('#scanner_result').html('SUCCESS');
                    // call ajax here, it should be on local storage if no connection
                    
                    $.mobile.loading('show');
                    
                    var prodnumber = $('#scanner_prodnumber').val();
                    var obj = objProduction[ prodnumber ];
                                       
                    $.post(API+"/matchproduction", {prodfile_seq:obj.prodfile_seq, prod_number:obj.prod_number, driver_user_seq: objUser.user_id}, function(res) {
                        console.log(res);
                        
                        if(res.success == true) {
                                                                      
                            $.mobile.loading('hide');
                            
                            $('#scanner_result').append('<p>Save on server</p>');
                            
                            //mofProcessBtn("#btnLogin", false);
                            
                            //mofChangePage('#pageList');
                        } else {	
                            //Invalid Email Address/Password
                            console.log(res.message);
                            if (ENV == 'dev') {
                                alert(res.message);
                            } else {
                                navigator.notification.alert(res.message, alertDismissed);
                            }	
                            //mofProcessBtn("#btnLogin", false);
                       }
                    },"json");            
                    
                } else { 
                    $('#scanner_result').html('FAIL Barcodes are matched but not with the production number.');
                }
            } else {
                $('#scanner_result').html('FAIL Barcodes are not matched.');
            }
        }
    }

  	
