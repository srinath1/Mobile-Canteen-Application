angular.module('starter.services', ['ngResource'])
/**
 * A simple example service that returns some data.
 */
.factory('DataLoader', function( $http, $log ) {

  return {
    get: function(url) {

      // Simple index lookup
      return $http.get( url );
    }
  }

})
//bookmark
.value('nutritionixConst', {
  'appId' :'8abbcd8e',
  'appKey' : '36e8d264537037ee7e832a41902ffe57'
})

.factory('Bookmark', function( CacheFactory ) {

  if ( ! CacheFactory.get('bookmarkCache') ) {
    CacheFactory.createCache('bookmarkCache');
  }

  var bookmarkCache = CacheFactory.get( 'bookmarkCache' );

  return {
    set: function(id) {
      bookmarkCache.put( id, 'bookmarked' );
    },
    get: function(id) {
      bookmarkCache.get( id );
      console.log( id );
    },
    check: function(id) {
      var keys = bookmarkCache.keys();
      var index = keys.indexOf(id);
      if(index >= 0) {
        return true;
      } else {
        return false;
      }
    },
    remove: function(id) {
      bookmarkCache.remove(id);
    }
  }

})
//localstorage
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])



	
//search data factory
.factory('dataFactory', function($http) {
var server ='http://eurestkantine.com/eurest/wp-json/wp/v2/';
	var myService = {
		httpRequest: function(url,method,params,dataPost,upload) {
			var passParameters = {};
			passParameters.url = server + url;

			if (typeof method == 'undefined'){
				passParameters.method = 'GET';
			}else{
				passParameters.method = method;
			}

			if (typeof params != 'undefined'){
				passParameters.params = params;
			}

			if (typeof dataPost != 'undefined'){
				passParameters.data = dataPost;
			}

			if (typeof upload != 'undefined'){
				passParameters.upload = upload;
			}

			var promise = $http(passParameters).then(function (response) {
				if(typeof response.data == 'string' && response.data != 1){
					//Give Notification
					return false;
				}
				return response.data;
			},function (response) {
				if ( response.status == 401 ){
					//Give Notification
				} else{
					//Give Notification
				}
			});
			return promise;
		}
	};
	return myService;
})
.factory('Products', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getPosts = function () {
		return $http(
			{
				method: 'GET', url:Config.ProductUrl
			}
		);
	}
  	return data;
}])
//BACK
.factory('backcallFactory', ['$state','$ionicPlatform','$ionicHistory','$timeout',function($state,$ionicPlatform,$ionicHistory,$timeout){

var obj={}
    obj.backcallfun=function(){
  
       $ionicPlatform.registerBackButtonAction(function () {
          if ($state.current.name == "app.posts") {
            var action= confirm("Do you want to Exit?");
             if(action){
                navigator.app.exitApp();
              }//no else here just if
      
      }else{
            $ionicHistory.nextViewOptions({
                 disableBack: true
                });
        $state.go('app.posts');
        //go to home page
     }
        }, 100);//registerBackButton
}//backcallfun
return obj;
}])
//photo
.factory('Photos',['$http', 'Config', function($http, Config) {
	var data = {};
	data.getPosts = function () {
		return $http(
			{
				method: 'GET', url:Config.PhotoUrl
			}
		);
	}
  	return data;
}])

//flickr
.value('Flickr_data',{
  key: '3be0b85707dbfae9843bcc9db4934bb6',
  endpoint: 'https://api.flickr.com/services/rest/',
  user_id : '141185596@N08'
})

.factory('Flickr', function($http,$q,Flickr_data){
	var result = {};

	// Getting List of Photoset in a user account.
	result.getPhotoSets = function() {
		var url = Flickr_data.endpoint + 
				  '?method=flickr.photosets.getList&api_key=' + Flickr_data.key +
				  '&user_id=' + Flickr_data.user_id +
				  '&format=json&nojsoncallback=1';

		console.log(url);
		return $http.get(url);
	};


	// Getting Photos of a photo set
	result.getPhotos = function(photoset_id) {
		var defer = $q.defer();

		var url = Flickr_data.endpoint + 
				  '?method=flickr.photosets.getPhotos&api_key=' + Flickr_data.key +
				  '&user_id=' + Flickr_data.user_id +
				  '&photoset_id=' + photoset_id +
				  '&format=json&nojsoncallback=1';

		
		// Getting the Photos from a photoset
		return $http.get(url)
	};

	result.getInfo = function(id, secret) {
		sizes =  Flickr_data.endpoint +
						   '?method=flickr.photos.getSizes&api_key=' + Flickr_data.key +
						   '&photo_id=' + id + '&format=json&nojsoncallback=1';

		info = Flickr_data.endpoint + 
						   '?method=flickr.photos.getInfo&api_key=' + Flickr_data.key +
						   '&photo_id=' + id + '&secret=' + secret +
						   '&format=json&nojsoncallback=1';
		return $q.all([
			$http.get(sizes),
			$http.get(info)
		]);	
	};

	return result;
})
//lundbeck   flickr images

.value('Flickr_data1',{
  key: 'f91c2992d774c50011292f926809f183',
  endpoint: 'https://api.flickr.com/services/rest/',
  user_id : '146459709@N02'
})

//feautres
.factory('Features', function(){
    var data = {};
    
    data.items = [
	{ 
            title: 'My Task',
            icon: 'ion-ios-list-outline',
            url: '#/app/todoapp'
        },
		
		{ 
            title: 'Are You Better Than A 7 Th  Grade',
            icon: 'ion-arrow-move',
            url: '#/app/quiz'
        },
		{ 
            title: 'Wikisearch',
            icon: 'ion-search',
            url: '#/app/wikisearch'
        },
		{ 
            title: 'Weather',
            icon: 'ion-ios-partlysunny',
            url: '#/app/weather'
        },
		{ 
            title: 'Check Calories',
            icon: 'ion-ios-nutrition',
            url: '#/app/nutrisearch'
        },
		
		
		
		
		 { 
            title: 'Youtube',
            icon: 'ion-social-youtube',
            url: '#/app/youtubevideos'
        },
		
		
	 
		{ 
            title: 'Astro',
            icon: 'ion-android-hand',
            url: '#/app/astro'
        },
		{ 
            title: 'Canteen Instagram Images',
            icon: 'ion-android-image',
            url: '#/app/lundbeckimages'
        },
		{ 
            title: 'Recipe Search',
            icon: 'ion-android-image',
            url: '#/app/recipesearch'
        }
		
		  
		 

		  
       
		
        
        
		
       
    ]; 
    
    return data;
})
.service('MonthsEvents',function($rootScope){
  var events=[]

  return {
    loadEvents:function(){
      events=[{
        title:'Danish Food',
        start:'2017-02-15'
      },{
        title:'Tomato Soup',
        start:'2017-03-16'
      },{
        title:'Salat',
        start:'2017-03-17'
      },{
        title:'Butter Chicken',
        start:'2017-13-18'
      },{
        title:'FishCurry',
        start:'2017-02-25'
      },{
        title:'Danish Cold Pasteries',
        start:'2017-03-27'
      },{
        title:'Hot Onion Soup',
        start:'2017-03-15'
      },{
        title:'Apples&Oranges',
        start:'2017-05-25'
      },{
        title:'Mushroom Soup',
        start:'2017-05-26'
      },{
        title:'Beef Roast',
        start:'2017-05-26'
      },{
        title:'Pasta',
        start:'2017-05-27'
      },
	  {
        title:'Sambar Rice',
        start:'2017-11-28'
      },
	  {
        title:'Fried Rice',
        start:'2017-03-29'
      },
	  {
        title:'Hyderabad Biryani',
        start:'2017-04-02'
      },
	  {
        title:'Chilli Chicken',
        start:'2017-04-03'
      },
	  {
        title:'Chicken 65',
        start:'2017-04-04'
      },
	  {
        title:'Lamb Rice',
        start:'2017-04-05'
      }]

      $rootScope.$broadcast('events_get')
    },

    getAllEvents:function(){
      return events
    },

    getEventsByDate:function(date){
      return events.filter(function(e){
        return e.start===date
      })
    }
  }
})
.service('MonthsEvents',function($rootScope){
  var events=[]

  return {
    loadEvents:function(){
      events=[{
        title:'Eurest day',
        start:'2016-11-15'
      },{
        title:'International day',
        start:'2016-11-215'
      },{
        title:'World Day',
        start:'2016-12-16'
      },{
        title:'Vegetarian day',
        start:'2016-11-217'
      },{
        title:'French day',
        start:'2016-11-25'
      },{
        title:'Denmark day',
        start:'2016-11-26'
      },{
        title:'Scanidavian day',
        start:'2016-11-227'
      },{
        title:'European day',
        start:'2016-05-25'
     },
	  {
        title:'Christmas day',
        start:'2016-12-25'
      }]

      $rootScope.$broadcast('events_get')
    },

    getAllEvents:function(){
      return events
    },

    getEventsByDate:function(date){
      return events.filter(function(e){
        return e.start===date
      })
    }
  }
})

//connectivity monitor
 .factory('ConnectivityMonitor', function ($rootScope, $cordovaNetwork, $state) {

            return {
                //Check network connection is online
                isOnline: function () {
                    if (ionic.Platform.isWebView()) {
                        return $cordovaNetwork.isOnline();
                    } else {
                        return navigator.onLine;
                    }
                },
                //Check network connection is offline
                ifOffline: function () {
                    if (ionic.Platform.isWebView()) {
                        return !$cordovaNetwork.isOnline();
                    } else {
                        return !navigator.onLine;
                    }
                },
                //Check the network connection status
                startWatching: function () {

                    if (ionic.Platform.isWebView()) {

                        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                            $state.go('app.home');
                        });

                        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                            $state.go('offline');
                        });

                    } else {

                        window.addEventListener("online", function (e) {
                            $state.go('app.home');
                        }, false);

                        window.addEventListener("offline", function (e) {
                            $state.go('offline');
                        }, false);
                    }
                }
            };
        })


         
       
       
//wikipidea
.factory("searchResults", function($http) {
    var config = {
        params: {
            format: "json",
            action: "query",
            prop: "extracts",
            exchars: "140",
            exlimit: "10",
            exintro: "",
            explaintext: "",
            rawcontinue: "",
            generator: "search",
            gsrlimit: "10",
            callback: "JSON_CALLBACK"
        }
    };
    var url = "https://en.wikipedia.org/w/api.php?";
    
    var results = {
        get: function(data) {
            config.params.gsrsearch = data;
            return $http.jsonp(url,config).then(function(rq){
                console.log(rq);
                return rq;
            });
        }
    };

    return results;
})
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})
//random quotes

//nutriservices
 .factory('nutriDataService', function( $resource, nutritionixConst){
  var aSearchObject = $resource('https://api.nutritionix.com/v1_1/search/:term',{term: '@term'},{
    getAll : {
      method : 'get',
      //isArray : true,
      params : {
        results  : ':results',
		appId : nutritionixConst.appId,
        appKey  :nutritionixConst.appKey,
        
        // brand_id:'513fbc1283aa2dc80c00001f',
        fields : ':fields',
      }
    }
  });
  return {
    /**
    * we can specify the params, the query string and the default fields
    * to turn in the query along with the result size
    */
    getAll : function(_params) {
      var defaultFields = 'brand_id,item_name,item_id,brand_name,nf_calories,nf_total_fat';

      if (!_params.fields) {
        _params.fields = defaultFields;
      }
      return aSearchObject.getAll(_params);             
    }
  }

})
/**
*
*/
  .factory('nutriDataServiceHTTP', function( $http, nutritionixConst){
  return {
    getAll : function(_key) {

      return $http.get('https://api.nutritionix.com/v1_1/search/' + _key,{
        'params' : {
          results  : '0:50',
		  appId : nutritionixConst.appId,
        appKey  :nutritionixConst.appKey,
        
          // brand_id:'513fbc1283aa2dc80c00001f',
          fields : 'brand_id,item_name,item_id,brand_name,nf_calories,nf_total_fat'
        }
      });
    }
  }
})

 
//stok

