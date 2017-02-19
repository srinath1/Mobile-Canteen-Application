angular.module('starter.controllers', ['youtube-embed','ionic.contrib.ui.tinderCards','ngCordova','ngResource'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader,  $log ) {
  
  // Enter your site url here. You must have the WP-API v2 installed on this site. Leave /wp-json/wp/v2/ at the end.
  var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

  // $rootScope.callback = '_jsonp=JSON_CALLBACK';

})

.controller('SettingsCtrl', function($scope, Settings) {
  $scope.settings = Settings.getSettings();

  // Watch deeply for settings changes, and save them
  // if necessary
  $scope.$watch('settings', function(v) {
    Settings.save();
  }, true);

  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

})


.controller('PostCtrl', function($scope,$cordovaSocialSharing, $stateParams, DataLoader, $ionicLoading,  $sce, CacheFactory, $log, Bookmark, $timeout ) {
	var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';
	

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = root1 + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // $scope.comments = $scope.post._embedded['replies'][0];

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPost();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  }
  //sharing
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };

})
 .controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})

.controller('PostsCtrl', function( $scope, $http, $cordovaSocialSharing, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

$ionicLoading.show({
                template: 'Loading .....',
				duration: 3000
            });
  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
 

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };
    
})

.controller('BookmarksCtrl', function( $scope, $http, DataLoader, $timeout, $rootScope, $log, Bookmark, CacheFactory ) {

  $scope.$on('$ionicView.enter', function(e) {

    if ( ! CacheFactory.get('postCache') ) {
      CacheFactory.createCache('postCache');
    }

    var postCache = CacheFactory.get( 'postCache' );

    if ( ! CacheFactory.get('bookmarkCache') ) {
      CacheFactory.createCache('bookmarkCache');
    }

    var bookmarkCacheKeys = CacheFactory.get( 'bookmarkCache' ).keys();

    $scope.posts = [];
  
    angular.forEach( bookmarkCacheKeys, function( value, key ) {
      var newPost = postCache.get( value );
      $scope.posts.push( newPost );
    });

  });
    
})
//newyoutube-my channel
.controller('newyoutube', function($scope, $ionicModal,$http,$ionicLoading,$ionicHistory){
 $ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            });
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
$scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    };
    $scope.videos = [];
	

   
$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
	console.log($scope.videos);
	});
	$scope.doRefresh = function () {
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
		
			
		});
	}
	
	$scope.$broadcast('scroll.refreshComplete');
	})
	//youtube search
	
	
	.controller('youtubevideos', function($scope, $http,$ionicLoading,$ionicHistory){
	 $ionicLoading.show({
                template: 'Loading...... ',
				duration: 3000
            });
			$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
  $scope.videos = [ ];
  $scope.searchInput = { };

  $scope.search = function(){
    $scope.videos = [];
    $scope.youtubeParams = {
        key: 'AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo',
        type: 'video',
        maxResults: '10',
        part: 'id,snippet',
        fields:'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
        q: $scope.searchInput
      }

    $http.get('https://www.googleapis.com/youtube/v3/search', {params:$scope.youtubeParams}).success(function(response){
      angular.forEach(response.items, function(child){
      $scope.videos.push(child);
      });
    });
  }
  $scope.playerVars = {
  rel: 0,
  showinfo: 0,
  modestbranding: 0,
}
})



	
	//team eurest
	.controller("TeamCtrl", function($scope,$sce,$ionicLoading) {
	 $ionicLoading.show({
                template: 'Loading .....',
				duration: 5000
            });
var FIREBASE_URL= 'https://mynewtv.firebaseio.com';
var ref = new Firebase(FIREBASE_URL);
    ref.once("value", function(snapshot){
 var list=[];
 list.Data =snapshot.val();
  $scope.limitsize=100;
console.log(list);
var jokes=[];
//team eurest
$scope.Names=list.Data;
$scope.list2=[];
angular.forEach($scope.Names,function(value,key){

$scope.list2.push(value)
$scope.list2.splice(23);


});


var names1=$scope.Names;
$scope.names2=names1.Month;
//jokes
$scope.mngmt=list.Data;
var jokes=$scope.mngmt;
$scope.names4=jokes.management;
//quotes
$scope.quotes1=list.Data;
var quotes2=$scope.quotes1;
$scope.quotes3=quotes2.quotes;









})
})
//instagram
.controller('ApiCtrl',function($scope, $http, $q, $cordovaSocialSharing) {

  $scope.init = function(){
    $scope.getImages()
    .then(function(res){
      // success
      console.log('Images: ',res)
      $scope.imageList = res.data;
    }, function(status){
      // err
      console.log('Error: ', status)
    })
  }

  $scope.getImages = function(){
    var defer = $q.defer();
    var url = "https://api.instagram.com/v1/users/3194446479/media/recent?access_token=3194446479.1677ed0.923d6de449fe4066832e74275947a1f2&callback=JSON_CALLBACK";
    $http.jsonp(url)
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;
  }

  $scope.init();
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the image', null, null, null);
    };
})
//example controller
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})

	.controller('todoCtrl', ['$scope', function($scope) {
  // Initialize the todo list array
    //if local storage is null save the todolist to local storage
    if (localStorage.getItem("mytodos") == null)
    {
 		$scope.todoList = [ {todoText:'Create app', done:false} ];
       localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    }else
    {
        //set the todolist from local storage
        $scope.todoList = angular.fromJson(localStorage.getItem("mytodos"));
    }



// Add an item function
    $scope.todoAdd = function() {
      //check to see if text has been entered, if not exit
        if ($scope.todoInput == null || $scope.todoInput == ''){return;}

        //if there is text add it to the array
        $scope.todoList.push({todoText:$scope.todoInput, done:false});

        //clear the textbox
        $scope.todoInput = "";

        //resave the list to localstorage
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    $scope.remove = function() {
      //copy list
        var oldList = $scope.todoList;
        //clear list
        $scope.todoList = [];
        //cycle through list
        angular.forEach(oldList, function(x) {
          //add any non-done items to todo list
            if (!x.done) $scope.todoList.push(x);
        });
        //update local storage
         localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    //The Update function
    //This waits 100ms to store the data in local storage
    $scope.update = function() {
    //update local storage 100 ms after the checkbox is clicked to allow it to process
    setTimeout(function(){
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));
    },100)


    }

}])



//feedback
.controller('feedbackCtrl', function ($scope,$cordovaSocialSharing) {
 $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, null);
    };

$scope.model = {
		sounds:[
		
			{
				'Name': 'Mr.Peter',
				'image': 'img/denmark.png',
				'Designation': 'CanteenChef',
				'info':'For general services,complaints & feedback',
				'Tel': '12345678'
			},
			{
				'Name': 'Mr.John',
				'image': 'img/denmark.png',
				'Designation': 'CantineSouchef',
				'info':'For quality & buffet services,complaints & feedback',
				'Tel': '234567893'
			},
			{
				'Name': 'Mr.David',
				'image': 'img/denmark.png',
				'Designation': 'Opvask',
				'info':'For issues regarding plates/glasses etc',
				'Tel': '91437000'
			}
			
			
		
	
	]
	};
	
})
//sendmail

.controller('SendMailCtrl', function($scope) {
	$scope.sendMail = function(){
		$cordovaEmailComposer.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				$cordovaEmailComposer.open({
					to:      'srinath.erp@gmail.com',
					cc:      'dk53@@gmail.com',
					// bcc:     ['john@doe.com', 'jane@doe.com'],
					subject: 'Greetings',
					body:    'How are you? Nice greetings from IonFullApp'
				});
			}
		);
	};
})

 
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})
	
//chart
 .controller("ChartCtrl", function($scope) {
 

 
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
 
})
//search ctrl
  .controller('SearchCtrl', function($scope,dataFactory) {
	   var url1='posts?filter[tag]=';

	$scope.posts = [];
	$scope.page = 1;
	$scope.form = {};

	$scope.search = function(){
		dataFactory.httpRequest(url1 + $scope.form.search).then(function(data) {
			$scope.posts = data;

			
			$scope.page++;
		});
	}
})

//store
.controller('ProductsController', [
	'$scope', '$state','Products', function(
	$scope, $state, Products) {
		$scope.items = [];
		$scope.times = 0 ;
		$scope.postsCompleted = false;
		// load more content function
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.times = $scope.times + 1;
				$scope.postsCompleted = true;
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		// pull to refresh buttons
		$scope.doRefresh = function(){
			$scope.times = 0 ;
			$scope.items = [];
			$scope.postsCompleted = false;
			$scope.getPosts();
			$scope.$broadcast('scroll.refreshComplete');
		}
	}
])
/*   product controller  */
.controller('ProductController', [
	'$scope', '$stateParams', 'Products', function(
	$scope, $stateParams, Products) {	
		var product_id = $stateParams.productId;
		$scope.selected_ = {};
		$scope.items = [];
		$scope.details = true;
		// looping though all data and get particular product
		$scope.selectProduct = function(p){
			p.forEach(function(data) {
			    if(data._id == product_id){
			    	$scope.selected_ = data;

			    }
			});
		}
		// get all posts // try some function to get a single produt from server
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.selectProduct($scope.items);
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		$scope.getPosts();
		$scope.changeRev = function(){
			if($scope.details == true){
				$scope.details = false;
			} else {
				$scope.details = true;
			}
		}
	}

])
//flickr
.controller('FlickrCtrl', function($scope,$ionicLoading,$state,Flickr){
	$ionicLoading.show();

	// Getting Photosets Detail from Flickr Service
	Flickr.getPhotoSets().then(function(result){
		$scope.photoList = result.data.photosets.photoset;
		$ionicLoading.hide();
	});

	// Opening Album
	$scope.openAlbum = function(photoset_id) {
    	$state.go('app.album',{id: photoset_id });
    };

})
.controller('AlbumCtrl', function($scope,$ionicLoading,$stateParams,Flickr) {
	$ionicLoading.show();
		$scope.id = $stateParams.id;
		$scope.photoList = [];

		// Getting List of Photos from a Photoset
		Flickr.getPhotos($scope.id).then(function(result){
			$ionicLoading.hide();
			console.log(result);
			$scope.photos = result.data.photoset.photo;
			$scope.title = result.data.photoset.title;

			angular.forEach($scope.photos, function(photo,key) {
				var id = photo.id;
				var secret = photo.secret;
				Flickr.getInfo(id,secret).then(function(result) {
					$scope.photoList.push({sizes: result[0].data, info: result[1].data});
					console.log($scope.photoList);

				});
			});

		});
})


/* Features Controller */
.controller('FeaturesCtrl', ['$scope', 'Features', function($scope, Features) {
	$scope.items = Features.items;
}])



//months menu controller
.controller('MenuController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start,
		
       
      }
      return temp
    }),
    textColor: 'black',
	color:'blue',
	textSize:'50cm'
	
	
	
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 600,
       editable: false,
	   aspectRatio: 2,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
	   
     }
   }
})


//Eurest Event controller
.controller('EuresteventController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start
       
      }
      return temp
    }),
    textColor: 'black'
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 500,
       editable: true,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
     }
   }
})




	



//
.controller('SettingsCtrl', function($scope, SettingsService) {
  $scope.settings = SettingsService;  
})






.controller('astroPostsCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate,$ionicHistory, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
$ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            })
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  })
var root1 = 'http://eurestcanteen.in/astro/wp-json/wp/v2/';


  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
  

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;
	 

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });
	
     

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {
  

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {
	  

        angular.forEach( response.data, function( value, key ) {
		
          $scope.posts.push(value);
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		  
        });
		
		

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		
        }
      }, function(response) {
        $scope.moreItems = false;
		
        $log.error(response);
      });

     
      

    }, 1000);
	
	

  }
  //again load more
  
		
	

  $scope.moreDataExists = function() {
   
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      
    
    }, 1000);
      
  };
   
})





	


//quiz


.controller('faqCtrl', function($scope, $timeout) {
  $scope.faqArr = [
    {
    question: 'A milkman has two empty jugs: a three gallon jug and a five gallon jug.  How can he measure exactly one gallon without wasting any milk?',
    answer: 'The milkman filled the three gallon jug, and then emptied the contents into the five gallon jug.  He then filled the three gallon jug again, and continued to fill the five gallon jug until it was full.  The milk remaining in the three gallon jug was precisely one gallon.'
  },
  {
    question: 'You are in the dark, and on the floor there are six shoes of three colors, and a heap of twenty-four socks, black and brown.  How many socks and shoes must you take into the light to be certain that you have a matching pair of socks and a matching pair of shoes?',
    answer: 'Three socks and four shoes would guarantee that you would have a matching pair of each.  Since there are only two colors of socks, it doesnt matter how many are in the heap, as long as you take at least three, you are certain to have two of the same.  As for the shoes, you must pick four, because selecting only three could result in one shoe in each of the three colors! '
  },
  {
    question: 'Assume 9 is twice 5; how will you write 6 times 5 in the same system of notation?',
    answer: 'The answer is 27.  Once you assume that 9 is twice 5, you conclude that 5 = 4.5 (9/2).  Therefore, 6 times 4.5 is 27. '
  },
  {
    question: 'Suppose there are twin brothers; one which always tells the truth and one which always lies.  What single yes/no question could you ask to either brother to figure out which one is which?',
    answer: 'The key to this logic problem, is to find a question that the two brothers would answer differently, and that difference would therefore identify the two from each other.  The lying brother would answer the above question "yes."  The truthful brother would answer the same question "no."  '
  },
  {
    question: 'A king wants his daughter to marry the smartest of 3 extremely intelligent young princes, and so the kings wise men devised an intelligence test.The princes are gathered into a room and seated, facing one another, and are shown 2 black hats and 3 white hats. They are blindfolded, and 1 hat is placed on each of their heads, with the remaining hats hidden in a different room.The king tells them that the first prince to deduce the color of his hat without removing it or looking at it will marry his daughter. A wrong guess will mean death. The blindfolds are then removed.You are one of the princes. You see 2 white hats on the other princes heads. After some time you realize that the other princes are unable to deduce the color of their hat, or are unwilling to guess. What color is your hat?',


    answer: 'The king would not select two white hats and one black hat. This would mean two princes would see one black hat and one white hat. You would be at a disadvantage if you were the only prince wearing a black hat.If you were wearing the black hat, it would not take long for one of the other princes to deduce he was wearing a white hat.If an intelligent prince saw a white hat and a black hat, he would eventually realize that the king would never select two black hats and one white hat. Any prince seeing two black hats would instantly know he was wearing a white hat. Therefore if a prince can see one black hat, he can work out he is wearing white.	Therefore the only fair test is for all three princes to be wearing white hats. After waiting some time just to be sure, you can safely assert you are wearing a white hat. '
  },
  {
    question: 'Five pirates have obtained 100 gold coins and have to divide up the loot. The pirates are all extremely intelligent, treacherous and selfish (especially the captain).The captain always proposes a distribution of the loot. All pirates vote on the proposal, and if half the crew or more go "Aye", the loot is divided as proposed, as no pirate would be willing to take on the captain without superior force on their side.If the captain fails to obtain support of at least half his crew (which includes himself), he faces a mutiny, and all pirates will turn against him and make him walk the plank. The pirates start over again with the next senior pirate as captain.What is the maximum number of coins the captain can keep without risking his life?',
    answer: 'The captain says he will take 98 coins, and will give one coin to the third most senior pirate and another coin to the most junior pirate. He then explains his decision in a manner like this... If there were 2 pirates, pirate 2 being the most senior, he would just vote for himself and that would be 50% of the vote, so he obviously going to keep all the money for himself.If there were 3 pirates, pirate 3 has to convince at least one other person to join in his plan. Pirate 3 would take 99 gold coins and give 1 coin to pirate 1. Pirate 1 knows if he does not vote for pirate 3, then he gets nothing, so obviously is going to vote for this plan.If there were 4 pirates, pirate 4 would give 1 coin to pirate 2, and pirate 2 knows if he does not vote for pirate 4, then he gets nothing, so obviously is going to vote for this plan.As there are 5 pirates, pirates 1 & 3 had obviously better vote for the captain, or they face choosing nothing or risking death. '
  }
  ];
  
  $scope.showOrDont = function(index) {
    if(index !== $scope.show) {
      $scope.show = index;
    } else {
      $scope.show=undefined;
    }
  };
  
})

 //wiki
.controller("wikiController", ["$scope","$window", "searchResults", function($scope,$window, searchResults) {
    $scope.reset = function() {
        if($scope.content) $scope.content = '';
        if($scope.results) $scope.results = '';
    };

    $scope.check = function() {
        if ($scope.content === "" || !$scope.content) return false;
        return true;
    }

    
    $scope.getResults = function(){
        if($scope.check()) {
            searchResults.get($scope.content).then(function(data){
                $scope.results = data.data.query.pages;
                for(var page in $scope.results){
                    $scope.results[page].link = 'https://en.wikipedia.org/wiki/' + $scope.results[page].title; 
                }
            });
        }
    };

}])
.controller('qodQtr', function($scope, $http) {
$scope.myObj = {
       
        
        "margin" : "0px",
		"width":"100%",
		"height":"100%",
        
    }
  $http.get("http://quotes.rest/qod.json")
    .then(function(response) {
      $scope.qod = response.data.contents.quotes[0].quote;
      $scope.qod_author = response.data.contents.quotes[0].author;    
    });
})
//nutrisearch
 .controller('nutriCtrl', function($scope, nutriDataService,nutriDataServiceHTTP) {

  $scope.data = {searchKey:''};

  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    return (index % 2) === 0 ? 50 : 60;
  };

  /**
  *
  */
  $scope.doSearch = function() {
    console.debug("Searching for: " +  $scope.data.searchKey);

    if ( true ) {

      // use the $resource based service
      var promise = nutriDataService.getAll( { 
        'term' : $scope.data.searchKey, 
        'results':'0:50',      // <-- variable substitution
        //'fields':'item_name'    <-- you can specify field params
      }).$promise;
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response));
        $scope.items = _response.hits;
      });

    } else {
      // use the $http based service
      var promise = nutriDataServiceHTTP.getAll($scope.data.searchKey);
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response.data));
        $scope.items = _response.data.hits;
      });
    }
  };
})
/**
*
*/
//weather


.controller('weatherCtrl', function($scope, $http, $ionicPopup) {
  $scope.weatherCity = function(cityName){
         var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });
  }
  $scope.cityName= 'copenhagen';
   var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+$scope.cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });

  $scope.days= ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  $scope.dates=[];
  for(var i =0; i<7;i++){
     $scope.dates.push(new Date(Date.now()+(1000*86400*i)));
  }

    $scope.showDetails = function(index) {
      $scope.data = {}
      $scope.daily = index;
    console.log($scope.daily);
      // Custom popup
      $scope.myPopup = $ionicPopup.show({
          templateUrl: 'details.html',
          title: 'daily forecast',
          scope: $scope,
        });

      $scope.myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };
   $scope.closePopUp = function() {
      $scope.myPopup.close();
};

})

//recipe search
.controller('recipeController', function($scope, $http){
	$scope.getRecipes = function(){
		//alert();
		var recipeString = 'https://api.edamam.com/search?q=' + $('#search').val() + '&app_id=5e28d891&app_key=0f64478a1652306c913f25fbc520452a&app_id=5e28d891&app_key=0f64478a1652306c913f25fbc520452a&health=vegan';
		

		$http.get(recipeString)
		.then(function(recipeJSON){
			//$("#listArea").append(recipeJSON.data.hits[0].recipe.label);
			$scope.recipes = recipeJSON.data.hits;
			console.log(recipeJSON.data.hits[0]);
		});
	}
	
})







