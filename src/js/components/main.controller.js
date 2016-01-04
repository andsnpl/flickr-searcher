import angular from 'angular';

angular.module('flks')
  .factory('preload', [
    '$q', '$document', '$timeout',
    function ($q, $document, $timeout) {
      // Function to preload images and return a promise.
      return function preload(photos) {
        // Map the photos into promises and collect their statuses with `all`.
        return $q.all(photos.map((photo) => {
          return $q((resolve, reject) => {
            let resolver = () => { resolve(photos); };

            // Create an img element that can load the image.
            let img = $document[0].createElement('img');
            img.addEventListener('load', () => {
              resolver();
            });
            img.src = photo.src;

            // Don't let any image take more than 5s.
            $timeout(resolver, 5000);
          });
        }));
      };
    }
  ])
  .controller('main', [
    '$scope', '$http', '$timeout', 'preload',
    function ($scope, $http, $timeout, preload) {
      let photoUrl = function (photo) {
        return `//farm${photo.farm}.staticflickr.com/${photo.server}/`
             + `${photo.id}_${photo.secret}.jpg`;
      };

      let deriveProp = function (prop, derive) {
        return function (obj) {
          obj[prop] = derive(obj);
          return obj;
        };
      };

      $scope.search = {
        submit: function (tag, form) {
          $scope.results = [];

          if (form.$invalid) {
            this.status = {
              searching: false,
              found: false,
              failure: false
            };
            return;
          }

          this.status = {
            searching: true,
            found: false,
            failure: false
          };
          $scope.lastSearchTag = tag;

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

              let photos = response.data.photos.photo
                .map(deriveProp('src', photoUrl));
              return preload(photos).then(() => { return photos; });
            })
            .then((photos) => {
              this.status = {
                searching: false,
                found: true,
                failure: false
              };

              this.tag = '';
              form.$setPristine();
              $scope.results = photos;
            })
            .catch((err) => {
              this.status = {
                searching: false,
                found: false,
                failure: true
              };

              $timeout(() => { this.status.failure = false; }, 3000);
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
