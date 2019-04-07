
be('Gs6WkD85SxnL9f6MbHjjr30udF8iZAdy')

//  Setting Enums
var DISPLAY_ORDER = 
{
  random: "Random",
  views: "Views",
  // featured_date : "Featured Date"
}

var BEHANCE_ORDER = 
{
  featured_date: "Featured Date",
  appreciations: "Appreciations",
  views : "Views"
}

var ARTSTATION_SORTING = 
{
  trending: "Trending",
  latest: "Latest",
  picks : "Picks"
}

var ARTSTATION_MEDIUM = 
{
  all : "All",
  digital2d: "Digital 2D",
  digital3d: "Digital 3D",
  traditional2d : "Traditional 2D",
  traditional3d : "Traditional 3D"
}

var ARTSTATION_CATEGORY = 
{
  all : "All",
  concept_art: "Concept Art",
  animation: "Animation",
  archviz : "Archviz",
  architecture : "Architecture",
  characters : "Characters"
}

// Static Values
var s_initialNumImagesToLoad = 50;
var s_maxImagesToDisplay = 60;

var imagesToDisplayPerSource; // Match the amount of images grabbed by behance to evenly shuffle them
var contentLoads; // Index this to load new content
var artStationPreloadedCells; // Keep some cells preloaded if we don't want to display them all immediately
var behancePreloadedCells;
var displayCells;
var loadingSources;

function Init()
{
  loadingSources = 0;
  contentLoads = 1;
  artStationPreloadedCells = [];
  behancePreloadedCells = [];
}

Init();

function Cell(id, imgUrl, linkUrl, adult, date, featuredDate, views, previewImageURL, description, author, authorURL, title, showPreview)
{
  this.id = id;
  this.imgUrl = imgUrl;
  this.linkUrl = linkUrl;
  this.adult = adult;

  // Sorting
  this.date = date;  
  this.featuredDate = featuredDate;
  this.views = views;

  this.drawn = false;

  this.previewImageURL = previewImageURL;
  this.description = description;
  this.author = author;
  this.authorURL = authorURL;
  this.title = title;

  this.showPreview = showPreview;
}

function GetImages()
{
  loadingSources = artStationEnabled + behanceEnabled;

  imagesToDisplayPerSource = s_maxImagesToDisplay / loadingSources;

  console.log('GetImages : Page '+contentLoads+' From '+loadingSources+' Sources')

  if(artStationEnabled)
  {
    GetImagesArtStation(s_initialNumImagesToLoad);
  }

  if(behanceEnabled)
  {
    GetImagesBehance();
  }

  contentLoads++;
  
}

function DrawGrid()
{

  for (var i = 0; i <displayCells.length; i++) (function(i)
  {
    var cell = displayCells[i];

    if(cell.drawn == false)
    {
      cell.drawn = true;

      var div = document.createElement("div");
      div.setAttribute('class', 'cell');   
      
      var img = document.createElement("img");
      img.setAttribute('src', cell.imgUrl); 
      div.appendChild(img);

      div.onclick = function()
      {
        Preview(cell);
      }

      $(".grid").append(div);

      FadeIn();
      
    }
   
  })(i);

  IsScreenFilled();

}

function Preview(cell)
{
  console.log(cell);

  $('#preview').show();

  $('#preview-img').attr("src", cell.previewImageURL);

  $('#preview-title').text(cell.title);
  $('#preview-author').text(cell.author);

  $('#preview-close').click(function()
  {
    $('#preview').hide();
  });

  $('#preview-bg').click(function()
  {
    $('#preview').hide();
  });

  $('#preview-content').click(function()
  {
    window.location.href = cell.linkUrl;
  });

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
  [].forEach.call(document.querySelectorAll('img'), function(img) {
    // img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      $(img).fadeIn(750);
    };
  });
}

function GetImagesArtStation(numberToGet)
{  
  console.log(artStationPreloadedCells.length + ' Cells Precached For ArtStation');

  if(artStationPreloadedCells.length < imagesToDisplayPerSource)
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

    var artStationURL;    

    if(searchTerm)
    {
      artStationURL = 'https://www.artstation.com/api/v2/search/projects.json?direction=desc&show_pro_first=true&per_page=50';
      artStationURL += '&query='+searchTerm;
      //https://www.artstation.com/api/v2/search/projects.json?query=SEARCH%20TERM&page=1&per_page=50&sorting=relevance&pro_first=1&filters=%5B%5D
    }
    else
    {
      artStationURL = 'https://www.artstation.com/projects.json?direction=desc&show_pro_first=true';
      // artStationURL += 
    }

    if(artStationMedium != 'all')
    {
      artStationURL += '&medium='+artStationMedium;
    }

    if(artStationCategory != 'all')
    {
      artStationURL += '&category='+artStationCategory;
    }

    artStationURL += '&sorting='+artStationOrdering;

    artStationURL += '&page='+contentLoads;
    // artStationURL += '&medium=digital3d';
    // artStationURL += '&order=published_at';

    console.log(artStationURL);

    $.getJSON(artStationURL, function(data) {
        
      var results = data.data;

      console.log(results.length + ' Art Station Results');

      for (var i = 0; i < results.length; i++) 
      {
        var result = results[i];
        if(searchTerm)
        {
          NewArtStationCellSearch(artStationPreloadedCells, result); 
        }
        else
        {
          NewArtStationCell(artStationPreloadedCells, result); 
        }
      }

      console.log(artStationPreloadedCells.length + ' Cells Precached For Art Station After');      
    
      FinishedLoadingSource();
      
    }); 
  }  
  else
  {
    FinishedLoadingSource();
  }
}

function FinishedLoadingSource()
{
  loadingSources--;
  console.log('Loading : '+loadingSources);
  DrawGridIfLoaded();
}

function NewArtStationCellSearch(array, result)
{
  //console.log(result);

  var cell = new Cell(
    "ArtStation"+result.id, 
    result.smaller_square_cover_url, 
    result.url, 
    result.adult_content, 
    '', 
    '', // No featured equivalent for ArtStation
    50,
    result.smaller_square_cover_url,
    '',
    result.user.full_name,
    '',
    result.title,
    false);

    array.push(cell);
}

function NewArtStationCell(array, result)
{
  console.log(result);

  var cell = new Cell(
    "ArtStation"+result.id, 
    result.cover.thumb_url, 
    result.permalink, 
    result.adult_content, 
    result.published_at, 
    result.published_at, // No featured equivalent for ArtStation
    result.views_count,
    result.cover.small_square_url,
    '',
    result.user.full_name,
    '',
    result.title,
    false);

    array.push(cell);
}

function GetImagesBehance()
{
  console.log(behancePreloadedCells.length + ' Cells Precached For Behance Before');

  // q Free text query string.
  // sort The order the results are returned in. Possible values: featured_date (default), appreciations, views, comments, published_date.
  // timeLimits the search by time. Possible values: all (default), today, week, month.
  // fieldLimits the search by creative field. Accepts a URL-encoded field name from the list of defined creative fields.
  // countryLimits the search by a 2-letter FIPS country code.
  // stateLimits the search by state or province name.
  // cityLimits the search by city name.
  // pageThe page number of the results, always starting with 1.
  // tagsLimits the search by tags. Accepts one tag name or a pipe-separated list of tag names.
  // color_hexLimit results to an RGB hex value (without #)
  // color_rangeHow closely to match the requested color_hex, in color shades (default:20) [0-255]
  // licenseFilter by creative license. Acronyms found here: http://creativecommons.org/licenses/

  if(behancePreloadedCells.length < imagesToDisplayPerSource)
  {
    // Using callbacks
    be.project.search(searchTerm, behanceOrdering, contentLoads, function success(results) {    
      
      console.log(results.projects.length + ' Behance Results');
      console.log(results.projects);


      for (var b = 0; b < results.projects.length; b++) 
      {
          var project = results.projects[b];
          var imgURL = project.covers['404'] != undefined ? project.covers['404'] : project.covers['original'];          
          var featuredOn = project.features != undefined ? project.features[0].featured_on : project.published_on;
         
          console.log(project);

         try
         {

          var cell = new Cell(
            "Behance"+project.id, 
            imgURL, 
            project.url, 
            project.mature_content, 
            project.published_on, 
            featuredOn,
            project.stats.views,
            project.covers['original'],
            "",
            project.owners[0].display_name,
            project.owners[0].url,
            project.name,
            true
          );
        }

        catch (e)
        {
          console.log(e);
        }

        behancePreloadedCells.push(cell);            
         
      }   

      console.log(behancePreloadedCells.length + ' Cells Precached For Behance After');

      FinishedLoadingSource();

    }); 
  }  
  else
  {
    FinishedLoadingSource();
  }
}

function DrawGridIfLoaded()
{
  if(loadingSources == 0)
  {
    // Populate display cells with 48 from each array

    var artStationCellsNum  = Math.min(artStationPreloadedCells.length, imagesToDisplayPerSource);
    var behanceCellsNum     = Math.min(behancePreloadedCells.length, imagesToDisplayPerSource);

    displayCells = artStationPreloadedCells.splice(0, artStationCellsNum);
    displayCells = displayCells.concat(behancePreloadedCells.splice(0, behanceCellsNum));

    SortCells();
    DrawGrid();

    console.log(behancePreloadedCells.length + ' Remaining Cells Precached For Behance After Draw');
    console.log(artStationPreloadedCells.length + ' Remaining Cells Precached For ArtStation After Draw');
  }
}

function SortCells()
{
  if(totalOrdering == 'random')
  {
    shuffle(displayCells);
  }
  else if(totalOrdering == 'views')
  {
    displayCells.sort(function(a, b) { 
        return b.views - a.views;
    })
  }

}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
}

function ClearGrid()
{
  $(".grid").empty();
}

  // Infinite Scroll

  $(window).on('scroll', function() {
      var distFromBtm = 150;

      if($(window).scrollTop() + $(window).height() >= $('body')[0].scrollHeight-distFromBtm) {
        console.log('BOTTOM REACHED');
        GetImages();
      }
  })

  // Time

  $(document).ready(function()
  {

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