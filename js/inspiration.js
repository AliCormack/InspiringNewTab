
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
  community : "Community"
}

var ARTSTATION_MEDIUM = 
{
  0 : "All",
  1: "Digital 2D",
  2: "Digital 3D",
  14: "Mixed Media",
  6: "Animation",
  8: "Live Action CG/VFX",
  14: "Mixed Media",
  7: "Real-time",
  11: "Traditional Dry Media",
  10: "Traditional Ink",
  12: "Traditional Paint",
  13: "Traditional Sculpture",
  9: "3D Printing",
}

// Static Values
var s_initialNumImagesToLoad = 50;
var s_maxImagesToDisplay = 90;
var s_maxFromArtstation = 75;

var imagesToDisplayPerSource; // Match the amount of images grabbed by behance to evenly shuffle them
var contentLoads; // Index this to load new content
var artStationPreloadedCells; // Keep some cells preloaded if we don't want to display them all immediately
var behancePreloadedCells;
var itchPreloadedCells;
var displayCells;
var loadingSources;

function Init()
{
  loadingSources = 0;
  contentLoads = 1;
  artStationPreloadedCells = [];
  behancePreloadedCells = [];
  itchPreloadedCells = [];
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
  if(loadingSources > 0)
    return;

  loadingSources = artStationEnabled + behanceEnabled + itchEnabled;

  imagesToDisplayPerSource = Math.min(s_maxFromArtstation, s_maxImagesToDisplay / loadingSources);

  console.log('GetImages : Page '+contentLoads+' From '+loadingSources+' Sources')

  if(artStationEnabled)
  {
    GetImagesArtStation(s_initialNumImagesToLoad);
  }

  if(behanceEnabled)
  {
    GetImagesBehance();
  }
  
  if(itchEnabled)
  {
    GetImagesItch();
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
      //img.setAttribute('src', cell.imgUrl); 
      img.setAttribute('data-gifffer', cell.imgUrl); 
      div.appendChild(img);

      div.onclick = function(e)
      {
        console.log(e.which);
        window.open(cell.linkUrl, seperateTab ? "_blank" : "_self");
      }

      div.addEventListener("contextmenu", function(e) 
      {
        e.preventDefault();

        var rmenu = document.getElementById("rmenu");

        rmenu.className = "show";
        rmenu.style.left = e.pageX + 'px';
        rmenu.style.top = e.pageY + 'px';

        rmenu.onclick = function(e)
        {
          AddUrlToHide(cell.linkUrl);
        }
      });

     
      $(".grid").append(div);

      FadeIn();
      
    }
   
  })(i);

  IsScreenFilled();

  Gifffer();

  $(document).bind("click", function(event) {
    document.getElementById("rmenu").className = "hide";
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

// From https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function GetImagesItch()
{
  console.log(itchPreloadedCells.length + ' Cells Precached For Itch');

  if(itchPreloadedCells.length < imagesToDisplayPerSource)
  {
    var itchURL = "https://itch.io/games/new-and-popular.xml?page=";
    itchURL += contentLoads;

    $.ajax(
    {
      type: "GET",
      url: itchURL,
      dataType: "xml",
      success: function(data) 
      {
        var jsonData = xmlToJson(data);
        var results = jsonData.rss.channel.item;

        console.log(results.length + ' Itch Results');

        for (var i = 0; i < results.length; i++) 
        {
          var result = results[i];   
          //console.log(result);     
          NewItchCell(itchPreloadedCells, result); 
        }

        console.log(itchPreloadedCells.length + ' Cells Precached For Itch After');  

        FinishedLoadingSource();
      }
    });
  }
  else
  {
    FinishedLoadingSource();
  }
}

function ValidateCell(cell)
{
  if(urlsToHide.includes(cell.linkUrl))
  {
    return false;
  }
  return true;
}

function NewItchCell(array, result)
{
  if(result.imageurl)
  {
    var imgUrl = result.imageurl['#text'];

    if(imgUrl.length > 0)
    {
      var cell = new Cell(
        "Itch", 
        result.imageurl['#text'], 
        result.link['#text'], 
        false, 
        '', 
        '', // No featured equivalent for ArtStation
        0,
        result.imageurl['#text'],
        '',
        '',
        '',
        result.plainTitle['#text'],
        false);

        if(ValidateCell(cell))
        {
          array.push(cell);
        }
    }
  }
} 

function GetImagesArtStation(numberToGet)
{  
  console.log(artStationPreloadedCells.length + ' Cells Precached For ArtStation');

  if(artStationPreloadedCells.length < imagesToDisplayPerSource)
  {
    // See ArtstationAPI.txt for API details

    var artStationURL;    

    if(searchTerm)
    {
      artStationURL = 'https://www.artstation.com/api/v2/search/projects.json?';
      
      artStationURL += '&query='+searchTerm;
    
      artStationURL += '&sorting='+artStationOrdering2;
    }
    else
    {
      artStationURL = 'https://www.artstation.com/api/v2/community/explore/projects/';

      artStationURL += artStationOrdering2;
      artStationURL += ".json?";

      console.log(artStationURL);

      // Parameters

    }

    if(artStationMedium2 != 0) // 0 = All
    {
      artStationURL += '&medium_ids%5B%5D='+artStationMedium2;
    }

    artStationURL += '&direction=desc';

    artStationURL += "&per_page="+imagesToDisplayPerSource;

    artStationURL += "&show_pro_first=true";

    artStationURL += '&page='+contentLoads;

    console.log(artStationURL);

    $.getJSON(artStationURL, function(data) {
        
      var results = data.data;

      console.log(results.length + ' Art Station Results');

      for (var i = 0; i < results.length; i++) 
      {
        var result = results[i];        
        NewArtStationCell(artStationPreloadedCells, result); 
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
  console.log('Finished Loading Source : '+loadingSources);
  DrawGridIfLoaded();
}

function NewArtStationCell(array, result)
{
  // Don't add mature content
  if(result.hide_as_adult == false)
  {
    var cell = new Cell(
      "ArtStation"+result.id, 
      result.smaller_square_cover_url, 
      result.url, 
      result.hide_as_adult, 
      '', 
      '', // No featured equivalent for ArtStation
      0,
      result.smaller_square_cover_url,
      '',
      result.user.full_name,
      '',
      result.title,
      false);

      if(ValidateCell(cell))
      {
        array.push(cell);
      }
  }
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
      
      for (var b = 0; b < results.projects.length; b++) 
      {
          var project = results.projects[b];
          var imgURL = project.covers['404'] != undefined ? project.covers['404'] : project.covers['original'];          
          var featuredOn = project.features != undefined ? project.features[0].featured_on : project.published_on;

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

        if(ValidateCell(cell))
        {
          behancePreloadedCells.push(cell);
        }             
         
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
    var itchNum             = Math.min(itchPreloadedCells.length, imagesToDisplayPerSource);

    displayCells = artStationPreloadedCells.splice(0, artStationCellsNum);
    displayCells = displayCells.concat(behancePreloadedCells.splice(0, behanceCellsNum));
    displayCells = displayCells.concat(itchPreloadedCells.splice(0, itchNum));

    SortCells();
    DrawGrid();

    console.log(behancePreloadedCells.length + ' Remaining Cells Precached For Behance After Draw');
    console.log(artStationPreloadedCells.length + ' Remaining Cells Precached For ArtStation After Draw');
    console.log(itchPreloadedCells.length + ' Remaining Cells Precached For Itch After Draw');
  }
}

function SortCells()
{  
  // No timestamps for Artstation work, so just shuffle for now.
  shuffle(displayCells);
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