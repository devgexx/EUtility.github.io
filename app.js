/*
writen by g3xx (c) 2017
modify if u want !!
*/
var app = angular.module('emailApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
 $routeProvider.when('/', {
        templateUrl: 'templates/index.html',
        controller: 'IndexCtrl'
    }).when('/split-mail', {
        templateUrl: 'templates/split.html',
        controller : 'splitCtrl'
    }).when('/grab-mail', {
        templateUrl: 'templates/grab.html',
        controller: 'GrabCtrl'
    }).when('/merge-mail', {
        controller: 'GrabCtrl',
        templateUrl: 'templates/merge.html'
    }).when('/merge-mailkey', {
        controller: 'GrabCtrl',
        templateUrl: 'templates/mailkey.html'
    }).when('/remove-duplicate', {
        controller: 'IndexCtrl',
        templateUrl: 'templates/duplicate.html'
    }).when('/sorter', {
        controller: 'sortCtrl',
        templateUrl: 'templates/sort.html'
    }).otherwise({redirectTo : '/'});
    $locationProvider.html5Mode({enabled: true, requireBase: false});
}]);

app.run(function($rootScope,$location) {
  $rootScope.act = function(path) {
          return ($location.path() === path) ? 'is-active' : '';
    };
  $rootScope.help = function() {
          alert("The site or the authors are not responsible for any misuse of the information.");
    };
});

app.filter("totalin", function(){
   return function(item){
     if (item !== undefined){
         for(var x = 0; x < item.length; x++){
            item[x][1] = item[x][1].join('\n');
         }
      } 
   }
});

app.directive('faker',function($timeout,$parse) {
  return {
    link: function(scope, element, attrs,  ctrl) {
       scope.textString = '';
       scope.textMail = '';
       scope.textgrab = '';
       scope.usermail = '';
       scope.userpass = '';  
       scope.userkey = '';  
      var where = attrs.faker;
       $timeout(function(){           
        switch (where){
            case 'index':
                 for(var i =0; i < 10; i++)
                    scope.textString += faker.name.firstName()+" : "+faker.phone.phoneNumberFormat()+" : "+faker.internet.domainName()+ " : "+faker.commerce.department() +" : "+faker.address.country()+"\n";        
            break;
            case 'mail':
                for(var i =0; i < 10; i++)
                    scope.textMail += faker.internet.email()+"\n";        
            break;
            case 'grab':
              for(var i =0; i < 10; i++)
                    scope.textgrab += faker.lorem.sentences()+" "+faker.internet.email()+"\n";
            break;
            case 'merge':
              for(var i =0; i < 10; i++){
                    scope.usermail += faker.internet.email()+"\n";
                    scope.userpass += faker.internet.password()+"\n";
             }
            break;
            case 'key':
              for(var i =1; i < 10; i++){
                    var k = Math.random().toString(36).substr(2, 5);
                    scope.usermail += faker.internet.email()+":"+k+"\n";
                    scope.userkey += k+":"+ faker.internet.password() +"\n";
             }
                
            break;
        }
       
    
      }, 100);
      
     }
  }
});

app.controller('IndexCtrl',function($scope){
        $scope.world = "hellow";
        $scope.tampil = false;
        $scope.run = function(tmps){
            $scope.tampil = true;
            var r = tmps.split('\n');
            $scope.obj = [];  
            angular.forEach(r, function(str,z) {
                    var s =  str.split(':');  
                    for( var i = 0; i < s.length; i++ ) {
                        if($scope.obj[i] == undefined)
                            $scope.obj[i] = [s[i]]; 
                        else
                             $scope.obj[i].push(s[i]);
                    } 
            });
        }
        $scope.hide = function(){
            $scope.tampil = false;
        }

        $scope.rem = function(tmp){
            var x = tmp.split('\n');
            var t = 0;
            $scope.z = [];
            //$scope.textString = $scope.z;
            angular.forEach(x, function(item) {
                if( $scope.z.indexOf(item) === -1) {
                      $scope.z.push(item);
                }else{
                    $scope.t = t++;
                }
            });
            $scope.textString = $scope.z.join('\n');
            console.log( $scope.z);
        }

    
});

app.controller('splitCtrl',function($scope,totalinFilter){
        $scope.tampil = false;
        $scope.split = function(tmp){
            $scope.tampil = true;
            $scope.fix=[
             ['Microsoft', [] ],
             ['Yahoo', [] ],
             ['Gmail', [] ],
             ['Other', [] ]
         ];
          
            var i = tmp.split('\n');
            angular.forEach(i, function(str) {
                var fix = str.toLowerCase().split('@'); 
                var fax = fix[1].split('.')[0];
                var mic =["hotmail","live","msn","passport","outlook", "windowslive"]; 
                if(mic.indexOf(fax) != -1 ){
                     $scope.fix[0][1].push(str); 
                }else if(fax == "yahoo" || fax == "ymail" || fax == "rocketmail"){ 
                    $scope.fix[1][1].push(str);
                }else if(fax == "gmail" || fax == "googlemail") { 
                    $scope.fix[2][1].push(str);
                } else { 
                    $scope.fix[3][1].push(str);
               }
            });
            console.log($scope.fix);
            totalinFilter($scope.fix);
        }
        $scope.total = function(x){
            return x.split('\n').length;
        }
        $scope.hide = function(){
            $scope.fix =[];
            $scope.tampil = false;
        }
});

app.controller('GrabCtrl',function($scope){
    $scope.tampil = false;
    $scope.grab =function(tmp){
        $scope.tampil = true;
        var x= tmp.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        $scope.hasil = x.join("\n");
    }
    $scope.merge = function(x,z){
        var a = x.split('\n');
        var b = z.split('\n');
        var hasil = [];
        $scope.tampil = true;
        angular.forEach(a, function(str,i) { 
            hasil.push(str +" : "+ b[i]);
        });
        $scope.hasil = hasil.join("\n");
    }

    $scope.hasher = function(x,z){
        var a = x.split('\n');
        var b = z.split('\n');
        var hasil = [];
        $scope.tampil = true;
        angular.forEach(b, function(str,i) {
            var c = str.split(':'); 
            for (var ii=0; ii<a.length - 1; ii++){
                var d = a[ii].split(':');
                if (d[1].toLowerCase() === c[0].toLowerCase() )
                    hasil.push(d[0] +" : "+ c[1]);
            }
        });
        $scope.hasil = hasil.join("\n");
    }

});

app.controller('sortCtrl',function($scope,$filter){

    $scope.order = function (order,x) {
        var z = order.split('\n');
        switch(x) {
           case "a":
             var tmp = $filter('orderBy')(z);
           break;
           case "b":
             var tmp = $filter('orderBy')(z,'-');
           break;
           case "c":
             var tmp = $filter('orderBy')(z,'length');
           break;
           case "d":
             var tmp = $filter('orderBy')(z,'-length');
           break;
        }
        
        $scope.textString = tmp.join("\n");
    }
});