app.controller('BallerController', function($scope, $http, wiki){

  String.prototype.capitalizeFirstLetter = function() { return this.charAt(0).toUpperCase() + this.slice(1); }

  //First NBA player
  $scope.searchText = {};
  $scope.searchText.name = 'LeBron James';

  //Second NBA player.
  $scope.search = {};
  $scope.search.name = 'Kobe Bryant';

  console.log("WIKI func");

  $scope.wiki = function(player, img){
    console.log("WIKI CALLED on ", player);
    wiki.get(player).success(function(data, status, headers, config) {
      console.log("WIKI success");
      var imageset = JSON.parse(data.body).query.pages;
      angular.forEach(imageset, function(image, index){
        console.log("each ", image);
        if (image) {
          angular.element(document.querySelector(img))
            .attr('src', image.original.source)
            // .attr('height', Math.floor(image.original.height/5))
            .attr('height', 100)
            // .attr('width', 75)
            // .attr('width', Math.floor(image.original.width/5));

        }
      });
    }).error(function(error) {
      console.log("WIKI failure", error);
    });
  };

  $scope.pics = function(){
    $scope.wiki($scope.searchText.name, '#picOne');
    $scope.wiki($scope.search.name, '#picTwo');
  };

  $scope.callDB = function() {

    $scope.pics();
/*==================================|
| This is the shortest path query   |
|==================================*/

    var query = 'MATCH (p1:Player { name:"' +
      $scope.searchText.name.toLowerCase() + '" })' + ',(p2:Player{ name:"' +
      $scope.search.name.toLowerCase() + '" }),' +
      ' p = shortestPath((p1)-[*]-(p2)) RETURN EXTRACT(n in nodes(p) | n.name), EXTRACT(n in nodes(p) | n.year), RELATIONSHIPS(p)';

/*==================================|
| This calls the server which goes  |
| to the DB and returns our query   |
|==================================*/

   $http({
     method:"POST",
     url: '/player',
     accepts: "application/json",
     datatype:"json",
     data: { "query" : query },
     error:function(jqxhr, textstatus, errorthrown){console.log("error",query,errorthrown)}
   }).then(function(response) {
     console.log(response.data.data);

/*==================================|
| This clears data and preps data   |
| for output.                       |
|==================================*/

     $scope.dataset = '';
      var answer = response.data.data[0][0];
      console.log("answer ", answer);
      var years = response.data.data[0][1];
      console.log('years ', years);
      for (var i = 0; i < answer.length; i++){
        if (i % 2 === 0) { answer[i] = answer[i].split(" ").map(function(a){return a.capitalizeFirstLetter(); }).join(" ") }
        else if (i === 1) { answer[i] = ' played in ' + answer[i].toUpperCase() + " (" + years[i] + ") with "; }
        else { answer[i] = ' who played in ' + answer[i].toUpperCase() + " (" + years[i] + ") with "; }
     }
     $scope.dataset = answer.join('');
    });
  }
})


/*==================================|
| This is a brand new picture       |
|  feature using wikipedia.         |
|==================================*/

.factory("wiki", ['$http', function ($http) {
    return {
        get: function (player) {
            return $http({
                method: 'GET',
                url: '/picture',
                params: {"player": player}
              })
            }
    };
}]);
