
be('Gs6WkD85SxnL9f6MbHjjr30udF8iZAdy')

// Static Values
var s_initialNumImagesToLoad = 50;

var searchTerm = '';
var sortMethod = '';
var behanceContentLoads = 1;

var cells;

function Init()
{
  cells = {};
}

Init();

function Cell(id, imgUrl, linkUrl, adult, date, views)
{
  this.id = id;
  this.imgUrl = imgUrl;
  this.linkUrl = linkUrl;
  this.adult = adult;

  // Sorting
  this.date = date;
  this.views = views;

  this.drawn = false;
}

function GetImages()
{
  
  GetImagesArtStation(s_initialNumImagesToLoad);
  // getImagesBehance();



  
}

function DrawGrid()
{
  for (var cellId in cells)
  {
    var cell = cells[cellId];

    if(cell.drawn == false)
    {
      cell.drawn = true;

      var cellHTML = '<div class = "cell"> <a href = '+cell.linkUrl+'> <img data-src=' + cell.imgUrl + '></a></img></div>';
      $(".grid").append(cellHTML);
      // $(".scroll").remove();    
      // var scrollToLoadCell = '<div class = "cell scroll"><span>&#9679; &#9679; &#9679;</span></div>';
      // $(".grid").append(scrollToLoadCell);

      FadeIn();
      // IsScreenFilled();
    }
   
  }
}

function IsScreenFilled()
{
  var gridHeight    = $(".grid").height();
  var windowHeight  = $(window).height();

  if (gridHeight < windowHeight ) 
  {    
    GetImages();
  }
}

function FadeIn()
{
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });
}

function GetImagesArtStation(numberToGet)
{  
    // https://www.artstation.com/random_project.json?&medium=digital2d&category=concept_art
    // Params
    // &randomize=true
    // &page=1
    // &category=concept_art | animation | archviz | architecture | characters
    // &medium=digital2d | digital3d | traditional2d | traditional3d
    // &sorting=trending | latest | picks
    // &direction=desc 
    // &q=search_term
    // &order=likes_count | published
    // &show_pro_first = true

    $.getJSON('https://www.artstation.com/projects.json', function(data) {
        
      var results = data.data;

      for (var i = 0; i < results.length; i++) 
      {
        var result = results[i];

        var cell = new Cell(
          result.id, 
          result.cover.thumb_url, 
          result.permalink, 
          result.adult_content, 
          result.published_at, 
          result.views_count);

        AddCell(cell);
      }
    
      DrawGrid();

    }); 
  
}

function AddCell(cell)
{
  // Only add if it doesn't exist
  if(cells[cell.id] == undefined)
  {
    cells[cell.id] = cell;
  }
}

function ClearGrid()
{
  $(".grid").empty();
}

function GetImagesBehance()
{
  // Using callbacks
  be.project.search(searchTerm, sortMethod, behanceContentLoads, function success(results) {    
    
    for (var i = 0; i < results.projects.length; i++) {

        var project = results.projects[i];
        var cell = new Cell('1', project.covers['404'], project.url);
        AddCell(cell);        
    }   

    DrawGrid();
    
    behanceContentLoads++;

  });

 
  
}

// function loadNewContent()
// {
//   behanceContentLoads++;
//   GetImages();
// }



$(document).ready(function()
{
  $( "#settings-button" ).click(function()
  {
    $("#settings-window").toggle();
    $( ".settings-btn" ).toggleClass('menu-open');
  });

  $("#search_term").on('keyup', function (e) {
      if (e.keyCode == 13) {

        var term = document.getElementById('search_term').value;      
        chrome.storage.sync.set({
          searchTerm: term
        });
        searchTerm = term;

        ClearGrid();
        GetImages();
      }
  });

  // Infinite Scroll

  // $(window).on('scroll', function() {
  //     if($(window).scrollTop() + $(window).height() >= $('body')[0].scrollHeight) {
  //       loadNewContent();
  //     }
  // })

  // Time

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