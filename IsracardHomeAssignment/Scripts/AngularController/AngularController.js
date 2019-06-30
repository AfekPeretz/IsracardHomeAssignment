myapp.controller('GitController', function ($scope, $http) {
    $scope.repoToSearch = '';
    $scope.nextPage = null;
    $scope.prevPage = null;
    $scope.firstPage = null;
    $scope.lastPage = null;
    $scope.saveRepo = function(page = null) {

        var uri = page ? page : `https://api.github.com/search/repositories?q=${$scope.repoToSearch}`;

        $http({
            method: 'GET',
            url: uri,
        }).then(function (response) {
            var data  = response.data;
            var items = data.items;
            var container = document.getElementById('items-container');
            container.innerHTML = " ";
            for (var i = 0; i < items.length; i++) {
                var card = document.createElement('div');
                card.classList.add('mycard');
                card.innerHTML =
                    items[i].full_name +
                    " <br/>" +
                    items[i].owner.avatar_url +
                    "<br/>" +
                    items[i].owner.html_url +
                    "<br/>";
                container.appendChild(card);

            }

            
            var pages = parseLinkHeader(response.headers().link);
            $scope.nextPage = pages && pages.next ? pages.next : null;
            $scope.prevPage = pages && pages.prev ? pages.prev : null;
            $scope.firstPage = pages && pages.first ? pages.first : null;
            $scope.lastPage = pages && pages.last ? pages.last : null;

       

        }).catch(function (err) {
            console.log(err);
        });

        function parseLinkHeader(header) {
            if (header.length === 0) {
                throw new Error("input must not be of zero length");
            }

            // Split parts by comma and parse each part into a named link
            return header.split(/(?!\B"[^"]*),(?![^"]*"\B)/).reduce((links, part) => {
                const section = part.split(/(?!\B"[^"]*);(?![^"]*"\B)/);
                if (section.length < 2) {
                    throw new Error("section could not be split on ';'");
                }
                const url = section[0].replace(/<(.*)>/, '$1').trim();
                const name = section[1].replace(/rel="(.*)"/, '$1').trim();

                links[name] = url;

                return links;
            }, {});
        }

        function printToScreen(response) {

            $scope.afek = response;

        }
        


    };
});


