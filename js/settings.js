// Settings

var artStationEnabled = false;
var behanceEnabled = true;
var sorting = SORTING.RANDOM;
var sortMethod = '';
var searchTerm;
var timeEnabled = true;
var dateEnabled = true;

// Defaults

var defaultSearchTerm = '';
var defaultSearchMethod = '';
var defaultTimeEnabled = true;
var defaultDateEnabled = true;
var defaultTutorialViewed = false;

// HTML

var termElement;
var sortElement;
var timeElement;
var dateElement;

// Saves options to chrome.storage.sync.
function save_options()
{
  UpdateHTML();

  searchTerm = termElement.value;
  sortMethod = sortElement.value;
  timeEnabled = timeElement.value;
  dateEnabled = dateElement.value; 

  console.log(timeElement.value);

  chrome.storage.sync.set({
    searchTerm: searchTerm,
    sortMethod : sortMethod,
    timeEnabled: timeEnabled,
    dateEnabled: dateEnabled
  });

  updateDateTimeHTML();

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() 
{
  chrome.storage.sync.get(
    {
    searchTerm: defaultSearchTerm,
    sortMethod: defaultSearchMethod,
    timeEnabled: defaultTimeEnabled,
    dateEnabled: defaultDateEnabled,
    tutorialViewed: defaultTutorialViewed
  }, function(items) 
  {
    
    searchTerm = items.searchTerm;
    sortMethod = items.sortMethod
    timeEnabled = items.timeEnabled;
    dateEnabled = items.dateEnabled;
   
    console.log(items);

    termElement.value = searchTerm;
    sortElement.value = sortMethod;
    timeElement.checked = timeEnabled;
    dateElement.checked = dateEnabled;       

    updateDateTimeHTML();
    // addTutorialIfRequired(items.tutorialViewed);
  });
}

function addTutorialIfRequired(tutorialViewed)
{
  if(!tutorialViewed)
  {
    $("body").append("<div id='tutorial' class='tutorial'>"+
    "<div class='content'>"+
      "<h3>Welcome to </h3>"+
      "<img width=200 height=200 src='img/icon/Icon-Transparent-512.png'></img>"+
      "<h1>Inspire</h1>"+
      "<h2>New Tab Gallery</h2>"+
      "<h4>Beta v0.0.0.8</h4>"+
      "<br>"+
      "<p>We hope you enjoy the gorgeous art and design fresh daily from around the web every day! </p>"+
      "<br>"+
      "<p>Using the preferences panel in the bottom right you can configure the page to your interests. Simply enter a search term to see related artwork. You can also change the sorting of images, e.g. by date or views.</p>"+
      "<br>"+
      "<button id='close-tutorial-btn' type='button'>Thanks, got it!</button>"+
   "</div>"+
"</div>");

$( "#close-tutorial-btn" ).click(function()
{
  $( "#tutorial" ).remove();
  chrome.storage.sync.set({
    tutorialViewed: true,
  });
});

  }
}

function updateDateTimeHTML(timeEnabled, dateEnabled)
{
  // console.log(timeEnabled);

  if(timeEnabled == false)
  {
    $('#time').hide();
  }
  else{
    $('#time').show();
  }

  if(dateEnabled == false)
  {
    $('#date').hide();
  }
  else{
    $('#date').show();
  }

  if(timeEnabled == false && dateEnabled == false)
  {
    $('#time-and-date').hide();
  }
  else{
    $('#time-and-date').show();
  }
  
  
}

function UpdateHTML()
{
  termElement = document.getElementById('search_term');
  sortElement = document.getElementById('sort_method');
  timeElement = document.getElementById('time_enabled');
  dateElement = document.getElementById('date_enabled');
}

$(document).ready(function()
{  
  UpdateHTML();
  

  $('#search_term').on('input', function() {
      save_options();
  });
  $('#sort_method').on('input', function() {
    save_options();
  });
  $('#time_enabled').change( function() {
    save_options();
  });
  $('#date_enabled').change( function() {
    save_options();
  });

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

        // ClearGrid();
        GetImages();
      }
  });

  restore_options();

});

