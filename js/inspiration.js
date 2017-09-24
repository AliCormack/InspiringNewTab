
  be('Gs6WkD85SxnL9f6MbHjjr30udF8iZAdy')
  // .project.search('cats')
  // .then(function success(results) {
  //   console.log(results);
  // }, function failure(error) {
  //   console.error(error);
  // });

  // Using callbacks
  be.project.search('games', function success(results) {



    var newHTML = [];
    for (var i = 0; i < results.projects.length; i++) {

        var project = results.projects[i];

        newHTML.push(' <div class = "cell"> <a href = '+project.url+'> <img src=' + project.covers['404'] + '></a></img></div>');
    }
    $(".grid").html(newHTML.join(""));

  });
