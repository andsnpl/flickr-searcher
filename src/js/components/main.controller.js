import angular from 'angular';

angular.module('flks').controller('main', [
  '$scope', '$http',
  function ($scope, $http) {
    $scope.search = {
      submit: function (tag, form) {
        this.status = {
          searching: true,
          found: false,
          failure: false
        };

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
          .then((response) => {
            if (response.status !== 200) {
              let err = new Error('Response not OK');
              err.response = response;
              throw err;
            }

            this.status = {
              searching: false,
              found: true,
              failure: false
            };

            $scope.results = response.data.photos.photo;
          })
          .catch((err) => {
            this.status = {
              searching: false,
              found: false,
              failure: true
            };
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
