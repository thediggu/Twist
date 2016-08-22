var mainControllers = angular.module('mainControllers', []);



mainControllers.controller('myController', ['$scope', '$http', function($scope, $http) {
	$scope.title = 'Kickass Achievement';
	$scope.test = '';
	$scope.result = '';
	$scope.nodeSend = function() {
		$http
			.post('/values/test', {
				val: $scope.test
			})
			.success(function(data) {
				console.log(data);
				$scope.result = data;
			})
			.error(function(data) {
				console.log(data);
			});
	};
}]);

mainControllers.directive('binder', function() {
	return {
		scope: true
	};
});

mainControllers.controller('writeController', ['$scope', '$http', function($scope, $http) {

	var postid = '';
	var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for( var i = 0; i < 6; i += 1){
        var index = Math.floor(Math.random() * (36)) + 1;
        postid += characters[index];
    }
	$scope.section_counter = 1;
	$scope.continued_from = 'None';
	$scope.new_continued_from = 'None';
	$scope.sections = [{
		title: '-- Select --',
		section_id: ''
	}];
	$scope.selectedItem = $scope.sections[0];
	$scope.entries = [];
	$scope.newEntry = {
		section_id: '',
		title: '',
		desc: '',
		body: '',
		connected_to: ''
	};

	$scope.setIntro = function() {
		var el = document.getElementById("intro-details");
		el.style.display = 'none';
		$http({
			method: 'POST',
			url: '/values/save',
			data: {
				part: 'intro',
				userid: 'theDiggu',
				postid: postid,
				title: $scope.intro.title,
				desc: $scope.intro.desc
			}
		})
		.success(function(data) {
			console.log(data);
		});
	};

	$scope.newSave = function() {
		$scope.section_id = postid + '_SEC' + $scope.section_counter;
		$scope.newEntry.section_id = $scope.section_id;
		$scope.newEntry.connected_to = $scope.selectedItem.section_id;

		$scope.entries.push($scope.newEntry);
		$scope.sections.push({
			title: $scope.newEntry.title,
			section_id: $scope.section_id
		});

		console.log('Section ID: ' + $scope.section_id);
		console.log($scope.entries[($scope.entries.length - 1)]);
		$scope.selectedItem = $scope.sections[($scope.sections.length - 1)];
		$http({
			method: 'POST',
			url: '/values/save',
			data: {
				part: 'content',
				postid: postid,
				val: $scope.entries[($scope.entries.length - 1)]
			}
		})
		.success(function(data) {
			console.log(data);
		});
	};

	$scope.newAdd = function() {
		$scope.continued_from = $scope.selectedItem.title;
		$scope.new_continued_from = $scope.selectedItem.title;
		var element = document.getElementById("spanbind");
		angular.element(element).scope().$destroy();
		element.removeAttribute('id');
		$scope.newEntry = {
			section_id: '',
			title: '',
			desc: '',
			body: '',
			connected_to: ''
		};
		$scope.section_counter += 1;
	};

}]);