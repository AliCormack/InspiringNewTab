
  be('Gs6WkD85SxnL9f6MbHjjr30udF8iZAdy')

var searchTerm = '';
var sortMethod = '';
var contentLoads = 1;

function getImages()
{
  // Using callbacks
  be.project.search(searchTerm, sortMethod, contentLoads, function success(results) {

    

    var newHTML = [];
    for (var i = 0; i < results.projects.length; i++) {

        var project = results.projects[i];

        newHTML.push(' <div class = "cell"> <a href = '+project.url+'> <img data-src=' + project.covers['404'] + '></a></img></div>');
    }
    $(".grid").append(newHTML.join(""));

    $(".scroll").remove();    
    var scrollToLoadCell = '<div class = "cell scroll"><span>&#9679; &#9679; &#9679;</span></div>';
    $(".grid").append(scrollToLoadCell);

    fadeIn();

    var div = $(".grid").height();
    var win = $(window).height();

    if (div < win ) {
      getImages();
    }

  });

 
  
}

function loadNewContent()
{
  contentLoads++;
  getImages();
}

function fadeIn()
{
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });
}

$(document).ready(function()
{
  $( "#settings-button" ).click(function()
  {
    $("#settings-window").toggle();
    $( ".settings-btn" ).toggleClass('menu-open');
  });

  // Infinite Scroll

  $(window).on('scroll', function() {
      if($(window).scrollTop() + $(window).height() >= $('body')[0].scrollHeight) {
        loadNewContent();
      }
  })

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m;

    var options = { weekday: 'long', month: 'long', day: 'numeric' };

    document.getElementById('date').innerHTML = today.toLocaleDateString('en-GB', options);

    t = setTimeout(function() {
      startTime()
    }, 500);
  }
  startTime();

});

// Tracking

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-108090048-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); 
  ga.type = 'text/javascript'; 
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  
  var s = document.getElementsByTagName('script')[0]; 
  s.parentNode.insertBefore(ga, s);
})();