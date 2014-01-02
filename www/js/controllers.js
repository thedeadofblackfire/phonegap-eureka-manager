angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  // Main app controller, empty for the example
})

// A simple controller that fetches a list of data
.controller('PetsTabCtrl', function($scope, Productions) {
  // "Pets" is a service returning mock data (services.js)
  $scope.productions = Productions.all();

  $scope.$on('tab.shown', function() {
    // Might do a load here
  });
  $scope.$on('tab.hidden', function() {
    // Might recycle content here
  });
})

.controller('LoginCtrl',function($scope,$location,$http){
  $scope.myTitle = 'Page One';

  $scope.leftButtons = [
    { 
      type: 'button-positive',
      content: '<i class="icon ion-navicon"></i>',
      tap: function(e) {
      }
    }
  ];
  $scope.rightButtons = [
    { 
      type: 'button-clear',
      content: 'Edit',
      tap: function(e) {
        alert('coucou');
      }
    }
  ]
  
    $scope.login_error = '';
    $scope.login_success = '';

    /*
    $scope.LoginFormaction = function(user){
        alert($scope.user.emailLog);
        $scope.login_error = '';
        $scope.login_success = '';
        $http.post('login/validorin_login',{'logemails':$scope.user.emailLog,'logpasss':$scope.user.passLog}).success(function(data, status, headers, config) {
                if (data.msg != '')
                {
                    $scope.login_success='success';
                }
                else
                {
                    $scope.login_error='Invalid Email Address/Password';
                }
            }).error(function(data, status) {
                $scope.login_error='Invalid Email Address/Password';
            });
    }
    */
    
    $scope.LoginFormbut = function(){

        $scope.login_error = '';
        $scope.login_success = '';
        
        var emailLog=$scope.emailLog!=null?$scope.emailLog:'';
        var passLog=$scope.passLog!=null?$scope.passLog:'';
        //alert(emailLog+' '+passLog);
        if(emailLog!='' && passLog!='')
        {
            //alert($scope.emailLog);
            
            wcFwk.ajax_postJsonAsync(API+'/authlogin', {'logemails':$scope.emailLog,'logpasss':$scope.passLog}, function(data) {
                 if (data.success) {
                    console.log(data);
                    $scope.login_success='success';
                    $location.path('/productions');
                    
                 }
                 
              });
            
            /*
            $http.post('http://eureka.vendor/api/mobile/authlogin',{'logemails':$scope.emailLog,'logpasss':$scope.passLog}
            ).success(function(data, status, headers, config) {
                    if (data.msg != '')
                    {
                        $scope.login_success='success';
                    }
                    else
                    {
                        $scope.login_error='Invalid Email Address/Password';
                    }
                }).error(function(data, status) {
                    $scope.login_error='Invalid Email Address/Password';
                });
                */
        }
        else
        {
            $scope.login_error='Invalid Email Address/Password';
        }

    }


})

// A simple controller that shows a tapped item's data
.controller('PetCtrl', function($scope, $routeParams, Productions) {
  // "Pets" is a service returning mock data (services.js)
  $scope.prod = Productions.get($routeParams.prodId);
});
