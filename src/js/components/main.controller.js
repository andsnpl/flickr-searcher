import angular from 'angular';

angular.module('flks').controller('main', [
  '$scope', '$http',
  function ($scope, $http) {
    $scope.search = {
      submit: function (tag, form) {
        $http({
          url: 'https://api.flickr.com/services/rest',
          method: 'GET',
          responseType: 'json',
          params: {
            api_key: '466a3eab4dd6ef8e1145b5b085dcb024',
            method: 'flickr.photos.search',
            tags: tag,
            format: 'json',
            nojsoncallback: 1
          } })
          .then(function (response) {
            console.log(response.data);
          });
      },
      status: {
        searching: false,
        found: false,
        failure: false
      }
    };

    $scope.secret = '3a02a6d957860cc9';

    $scope.results = [];
  }
]);
