// Settings

var searchTerm;
var timeEnabled;
var dateEnabled;
var tutorialViewed;
var artStationEnabled;
var behanceEnabled;
var totalOrdering;
var behanceOrdering;
var artStationOrdering;

// Defaults

var defaultSearchTerm = '';
var defaultSearchMethod = '';
var defaultTimeEnabled = true;
var defaultDateEnabled = true;
var defaultTutorialViewed = false;
var defaultArtStationEnabled = false;
var defaultBehanceEnabled = true;
var defaultTotalOrdering = DISPLAY_ORDER.Random; // TODO THIS IS WRONG NEED THE VARIABLE NAME NOT THE STRING
var defaultBehanceOrdering = BEHANCE_ORDER.featured_date;
var defaultArtstationOrdering = ARTSTATION_SORTING.latest;

// HTML

var behanceElement;
var artStationElement;
var searchTermElement;
var displayOrderDropdownElement;
var timeToggleElement;
var dateToggleElement;

// Saves options to chrome.storage.sync.
function save_options()
{
  UpdateHTML();

  searchTerm = searchTermElement.value;
  timeEnabled = timeToggleElement.value;
  dateEnabled = dateToggleElement.value; 

  chrome.storage.sync.set({
    searchTerm: searchTerm,
    timeEnabled: timeEnabled,
    dateEnabled: dateEnabled
  });

  updateDateTimeHTML();

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() 
{
  chrome.storage.sync.clear();

  chrome.storage.sync.get(
    {
    searchTerm: defaultSearchTerm,
    timeEnabled: defaultTimeEnabled,
    dateEnabled: defaultDateEnabled,
    tutorialViewed: defaultTutorialViewed,
    artStationEnabled : defaultArtStationEnabled,
    behanceEnabled : defaultBehanceEnabled,
    sorting : defaultTotalOrdering,
    behanceOrdering : defaultBehanceOrdering,
    artStationOrdering : defaultArtstationOrdering
  }, function(items) 
  {
    
    searchTerm = items.searchTerm;
    timeEnabled = items.timeEnabled;
    dateEnabled = items.dateEnabled;
    tutorialViewed = items.tutorialViewed;
    artStationEnabled = items.artStationEnabled;
    behanceEnabled = items.behanceEnabled;
    totalOrdering = items.sorting;
    behanceOrdering = items.behanceOrdering;
    artStationOrdering = items.artStationOrdering;
   
    console.log(items);

    behanceElement.checked    = behanceEnabled;
    artStationElement.checked = artStationEnabled;
    displayOrderDropdownElement       = totalOrdering;
    searchTermElement.value   = searchTerm;
    timeToggleElement.checked = timeEnabled;
    dateToggleElement.checked = dateEnabled;       

    updateDateTimeHTML();
    // addTutorialIfRequired(items.tutorialViewed);

    GetImages();
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

var s_SearchTermID = 'search_term';
var s_DisplayOrderID = 'display_order';
var s_BehanceOrderID = 'behance_order';
var s_ArtStationOrderID = 'artstation_order';

function UpdateHTML()
{
  behanceElement              = document.getElementById('behance_enabled');
  artStationElement           = document.getElementById('artstation_enabled');
  searchTermElement           = document.getElementById(s_SearchTermID);
  displayOrderDropdownElement = document.getElementById(s_DisplayOrderID);
  timeToggleElement           = document.getElementById('time_enabled');
  dateToggleElement           = document.getElementById('date_enabled');
}

function AddSearchTermDropdownElements(enum_var, dropdownElementId)
{
  for (const prop in enum_var) {
    $('#'+dropdownElementId).append($('<option>', {
      value: `${prop}`,
      text: `${enum_var[prop]}`
    }));
  }

}

$(document).ready(function()
{  
  UpdateHTML();
  

  $('#'+s_SearchTermID).on('input', function() {
      save_options();
  });
  $('#'+s_DisplayOrderID).on('input', function() {
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

  AddSearchTermDropdownElements(DISPLAY_ORDER, s_DisplayOrderID);
  AddSearchTermDropdownElements(BEHANCE_ORDER, s_BehanceOrderID);
  AddSearchTermDropdownElements(ARTSTATION_SORTING, s_ArtStationOrderID);

  restore_options();

});

