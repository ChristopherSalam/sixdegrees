app.controller('BallerController', function($scope, $http, wiki){

  String.prototype.capitalizeFirstLetter = function() { return this.charAt(0).toUpperCase() + this.slice(1); }

  //First NBA player
  $scope.searchText = {};
  $scope.searchText.name = 'LeBron James';

  //Second NBA player.
  $scope.search = {};
  $scope.search.name = 'Kobe Bryant';

  window.wiki = function(player, img){
    console.log("WIKI CALLED on ", player);
    wiki.get(player).success(function(data, status, headers, config) {
      console.log("WIKI success");
      var imageset = JSON.parse(data.body).query.pages;
      angular.forEach(imageset, function(image, index){
        console.log("each ", image.original);
        angular.element(document.querySelector(img))
        .attr('src', image.original.source)
        .attr('height', Math.floor(image.original.height/10))
        .attr('width', Math.floor(image.original.width/10));
      });
    }).error(function(error) {
      console.log("WIKI failure", error);
    });
  };

  window.pics = function(){
    window.wiki($scope.searchText.name, '#picOne');
    window.wiki($scope.search.name, '#picTwo');
  };

  $scope.callDB = function() {

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

//       var ballerName = $scope.searchText.name.split(/[ ]+/).map(function(el){ return el.capitalizeFirstLetter()}).join('%20');

//       // console.log("ball",ballerName,ballerWiki);
//

//  window.wiki = function(){
      // var d = $q.defer();


      // $http.jsonp(ballerWiki).success(function(data, status, headers, config){
        // console.log("success", data, status, headers, config);
        // d.resolve(results);
      // }).error(function(error){
        // console.log("error", error);
        // d.reject(error);
      // });
      // return d.promise;
      // }



      // $http.jsonp(ballerWiki)
        //method:"GET",
        //url: ballerWiki,
        //accepts: "application/json",
        //datatype:"json",
        //error:function(data, status) { console.log(data || "Request failed"); }
      // )
      // .success(function(json) {
//
        // console.log("success", json);
//       //   $get({method: 'JSON', url: json.data}).then(function(json) {
//           // var wikitext = json.mobileview.sections[0].text;
//           $('#picBaller').hide().append(wikitext);
//           var img = $('#picBaller').find('.infobox img:first').attr('src');
//           $('#picBaller').show().html('<img style="height: 150px;  border-radius:75px" src="' + img + '"/>');
      // }).error(function(json) {
        // console.log("error", json);
      // });
    // };
//
//       // $.getJSON(ballerWiki, function(json) {
//       //     var wikitext = json.mobileview.sections[0].text;
//       //     $('#picBaller').hide().append(wikitext);
//       //     var img = $('#picBaller').find('.infobox img:first').attr('src');
//       //     $('#picBaller').show().html('<img style="height: 150px;  border-radius:75px" src="' + img + '"/>');
//       //   });
//     });
//   }
// });
