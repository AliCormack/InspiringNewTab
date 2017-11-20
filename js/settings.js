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
var defaultArtStationEnabled = true;
var defaultBehanceEnabled = true;
var defaultTotalOrdering = 'random'; // TODO THIS IS WRONG NEED THE VARIABLE NAME NOT THE STRING
var defaultBehanceOrdering = 'featured_date';
var defaultArtstationMedium = 'all';
var defaultArtstationCategory = 'all';
var defaultArtstationOrdering = 'picks';

// HTML

var behanceElement;
var artStationElement;
var searchTermElement;
var displayOrderDropdownElement;

var behanceOrderDropdownElement;

var artstationMediumDropdownElement;
var artstationCategoryDropdownElement;
var artstationOrderDropdownElement;

var timeToggleElement;
var dateToggleElement;

// Saves options to chrome.storage.sync.
function save_options()
{
  UpdateHTML();

  artStationEnabled = artStationElement.checked;
  behanceEnabled = behanceElement.checked;
  searchTerm = searchTermElement.value;
  totalOrdering = displayOrderDropdownElement.value;

  behanceOrdering = behanceOrderDropdownElement.value;

  artStationMedium = artstationMediumDropdownElement.value;
  artStationCategory = artstationCategoryDropdownElement.value;
  artStationOrdering = artstationOrderDropdownElement.value;
  
  timeEnabled = timeToggleElement.checked;
  dateEnabled = dateToggleElement.checked;  
  
  console.log(displayOrderDropdownElement.value);

  chrome.storage.sync.set({
    searchTerm: searchTerm,
    timeEnabled: timeEnabled,
    dateEnabled: dateEnabled,
    tutorialViewed: tutorialViewed,
    artStationEnabled : artStationEnabled,
    behanceEnabled : behanceEnabled,
    totalOrdering : totalOrdering,
    behanceOrdering : behanceOrdering,
    artStationMedium : artStationMedium,
    artStationCategory : artStationCategory,
    artStationOrdering : artStationOrdering
  });

  updateDateTimeHTML();

}

function refresh()
{
  Init();
  ClearGrid();
  GetImages();
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() 
{
  // chrome.storage.sync.clear();

  chrome.storage.sync.get(
    {
    searchTerm: defaultSearchTerm,
    timeEnabled: defaultTimeEnabled,
    dateEnabled: defaultDateEnabled,
    tutorialViewed2: defaultTutorialViewed,
    artStationEnabled : defaultArtStationEnabled,
    behanceEnabled : defaultBehanceEnabled,
    totalOrdering : defaultTotalOrdering,
    behanceOrdering : defaultBehanceOrdering,
    artStationMedium : defaultArtstationMedium,
    artStationCategory : defaultArtstationCategory,
    artStationOrdering : defaultArtstationOrdering
  }, function(items) 
  {
    
    searchTerm = items.searchTerm;
    timeEnabled = items.timeEnabled;
    dateEnabled = items.dateEnabled;
    
    artStationEnabled = items.artStationEnabled;
    behanceEnabled = items.behanceEnabled;
    totalOrdering = items.totalOrdering;
    behanceOrdering = items.behanceOrdering;
    artStationMedium = items.artStationMedium;
    artStationCategory = items.artStationCategory;
    artStationOrdering = items.artStationOrdering;

    tutorialViewed = items.tutorialViewed2;
   
    console.log(items);

    behanceElement.checked    = behanceEnabled;
    artStationElement.checked = artStationEnabled;
    displayOrderDropdownElement.value = totalOrdering;
    searchTermElement.value   = searchTerm;
    timeToggleElement.checked = timeEnabled;
    dateToggleElement.checked = dateEnabled;    
    
    behanceOrderDropdownElement.value = behanceOrdering;
    
    artstationMediumDropdownElement.value = artStationMedium;
    artstationCategoryDropdownElement.value = artStationCategory;
    artstationOrderDropdownElement.value = artStationOrdering;

    updateDateTimeHTML();
    addTutorialIfRequired(tutorialViewed);

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
      "<h4>Beta v0.0.1</h4>"+
      "<br>"+
      "<p>Inspire sources its content from both <a href='https://www.behance.net/'>Behance.net</a> and <a href='https://www.artstation.com/'>ArtStation.com</a>. We hope you enjoy the gorgeous art and design fresh daily from around the web! </p>"+
      "<br>"+
      "<p>You can edit these image sources to your liking, and find many other customisation options via the preferences panel in the bottom right (&#9881;). A search term can be specified to show only what you're interested in, and the display order of images changed, for example. </p><br> "+
       "<p>Any and all <a href='https://chrome.google.com/webstore/detail/inspire-gallery-new-tab/feldechheiacimdajbkleojednhpophc'>feedback</a> is welcome!</p><br>"+
      "<button id='close-tutorial-btn' type='button'>Thanks, got it!</button>"+
   "</div>"+
"</div>");

$( "#close-tutorial-btn" ).click(function()
{
  $( "#tutorial" ).remove();
  chrome.storage.sync.set({
    tutorialViewed2: true,
  });
});

  }
}

function updateDateTimeHTML()
{

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

var s_BehanceEnabledID = 'behance_enabled';
var s_ArtStationEnabledID = 'artstation_enabled';
var s_SearchTermID = 'search_term';
var s_DisplayOrderID = 'display_order';
var s_BehanceOrderID = 'behance_order';
var s_ArtStationMediumID = 'artstation_medium';
var s_ArtStationCategoryID = 'artstation_category';
var s_ArtStationOrderID = 'artstation_order';

function UpdateHTML()
{
  behanceElement              = document.getElementById(s_BehanceEnabledID);
  artStationElement           = document.getElementById(s_ArtStationEnabledID);
  searchTermElement           = document.getElementById(s_SearchTermID);
  displayOrderDropdownElement = document.getElementById(s_DisplayOrderID);

  behanceOrderDropdownElement = document.getElementById(s_BehanceOrderID);

  artstationMediumDropdownElement = document.getElementById(s_ArtStationMediumID);
  artstationCategoryDropdownElement = document.getElementById(s_ArtStationCategoryID);
  artstationOrderDropdownElement = document.getElementById(s_ArtStationOrderID);

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
    refresh();
  });
  $('#'+s_BehanceEnabledID).change(function() {
    save_options();
    refresh();
  });
  $('#'+s_ArtStationEnabledID).change(function() {
    save_options();
    refresh();
  });
  $('#'+s_BehanceOrderID).on('input', function() {
    save_options();
    refresh();
  });
  $('#'+s_ArtStationMediumID).on('input', function() {
    save_options();
    refresh();
  });
  $('#'+s_ArtStationCategoryID).on('input', function() {
    save_options();
    refresh();
  });
  $('#'+s_ArtStationOrderID).on('input', function() {
    save_options();
    refresh();
  });

  $('#time_enabled').change( function() {
    save_options();
    updateDateTimeHTML();
  });
  $('#date_enabled').change( function() {
    save_options();
    updateDateTimeHTML();
  });

  $( "#settings-button" ).click(function()
  {
    $("#settings-window").toggle();
    $( ".settings-btn" ).toggleClass('menu-open');
  });

  $("#search_term").on('keyup', function (e) {
      if (e.keyCode == 13) {

        refresh();
      }
  });

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
  });

  AddSearchTermDropdownElements(DISPLAY_ORDER, s_DisplayOrderID);
  AddSearchTermDropdownElements(BEHANCE_ORDER, s_BehanceOrderID);
  AddSearchTermDropdownElements(ARTSTATION_MEDIUM, s_ArtStationMediumID);
  AddSearchTermDropdownElements(ARTSTATION_CATEGORY, s_ArtStationCategoryID);
  AddSearchTermDropdownElements(ARTSTATION_SORTING, s_ArtStationOrderID);

  restore_options();

});

