angular.module('MoviesMap', ['ui.bootstrap'])


.controller('mainCtrl', function($scope, $http) {

	$scope.geolocation = [];

	// get Movies Based on Search Term

	$scope.getMovies = function(name) {
		return $http.get('/movie', {
				params: {
					movieName: name
				}
			})
			.then(function(result) {
				return result.data.movies.map(function(item) {
					return item;
				});
			})
	};
	//Get Locations Of the Movie
	$scope.getLatlang = function($item, $model, $label, $event) {
		$scope._id = $model._id;
		return $http.get('/movie/' + $scope._id).then(function(response) {
			console.log("get location Called")
			$scope.geolocation = angular.copy(response.data.movies);
		});
	}

})

.directive('map', function() {
	var link = function(scope, element, attrs) {
		var map, infoWindow;
		var markers = [];

		var startingPosition = new google.maps.LatLng(37.773972, -122.431297)

		// Map configuration

		var mapOptions = {
			center: startingPosition,
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: true
		};

		//Watch GeoLocation Changes and Set Markers

		scope.$watch('geolocation', function(newVal, oldVal) {
			clearMarkers();
			if (newVal != oldVal) {
				angular.forEach(newVal, function(movie) {
					if (movie.loc && movie.loc.length) {
						let title=movie.movieId.title;
						let location=movie.location;
						setMarker(map, new google.maps.LatLng(movie.loc[0], movie.loc[1]),"location" ,title );
					}
				});

			}
		}, true);

		//Clear All Marker that are already on the Map

		 function clearMarkers(){
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
			markers = [];
		}

		// initilize  Google Map

		function initMap() {
			if (map === void 0) {
				map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
			}
		}

		// Draw Marker on the Map
		function setMarker(map, position, title, content) {
			var marker;
			var markerOptions = {
				position: position,
				map: map,
				title: title,
				icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
			};

			marker = new google.maps.Marker(markerOptions);
			markers.push(marker); // add marker to array

			google.maps.event.addListener(marker, 'click', function() {
				if (infoWindow !== void 0) {
					infoWindow.close();
				}
				var infoWindowOptions = {
					content: content
				};

				infoWindow = new google.maps.InfoWindow(infoWindowOptions);
				infoWindow.open(map, marker);
			});
		}

		// call Init Function to Display map
		initMap();


	};
	return {
		restrict: 'EA',
		template: '<div></div>',
		replace: true,
		scope: {
			geolocation: '='
		},
		link: link
	};
});