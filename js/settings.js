// Settings

var searchTerm;
var timeEnabled;
var dateEnabled;
var tutorialViewed;
var artStationEnabled;
var behanceEnabled;
var itchEnabled;
var behanceOrdering;
var artStationOrdering;
var seperateTab;

// Defaults

var defaultSearchTerm = '';
var defaultSearchMethod = '';
var defaultTimeEnabled = true;
var defaultDateEnabled = true;
var defaultTutorialViewed = false;
var defaultArtStationEnabled = true;
var defaultBehanceEnabled = true;
var defaultItchEnabled = true;
var defaultBehanceOrdering = 'featured_date';
var defaultArtstationMedium = 0;
var defaultArtstationOrdering = 'trending';
var defaultSeperateTab = false;

// HTML

var behanceElement;
var artStationElement;
var itchElement;

var searchTermElement;

var seperateTabElement;

var behanceOrderDropdownElement;

var artstationMediumDropdownElement;
var artstationOrderDropdownElement;

var timeToggleElement;
var dateToggleElement;

// Saves options to chrome.storage.sync.
function save_options()
{
  UpdateHTML();

  artStationEnabled = artStationElement.checked;
  behanceEnabled = behanceElement.checked;
  itchEnabled = itchElement.checked;

  searchTerm = searchTermElement.value;

  seperateTab = seperateTabElement.checked;

  behanceOrdering = behanceOrderDropdownElement.value;

  artStationMedium = artstationMediumDropdownElement.value;
  artStationOrdering = artstationOrderDropdownElement.value;
  
  timeEnabled = timeToggleElement.checked;
  dateEnabled = dateToggleElement.checked;  

  chrome.storage.sync.set({
    searchTerm: searchTerm,
    timeEnabled: timeEnabled,
    dateEnabled: dateEnabled,
    tutorialViewed: tutorialViewed,
    artStationEnabled : artStationEnabled,
    behanceEnabled : behanceEnabled,
    itchEnabled : itchEnabled,
    behanceOrdering : behanceOrdering,
    artStationMedium : artStationMedium,
    artStationOrdering : artStationOrdering,
    seperateTab : seperateTab
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
    itchEnabled : defaultItchEnabled,
    behanceOrdering : defaultBehanceOrdering,
    artStationMedium : defaultArtstationMedium,
    artStationOrdering : defaultArtstationOrdering,
    seperateTab : defaultSeperateTab
  }, function(items) 
  {
    
    searchTerm = items.searchTerm;
    timeEnabled = items.timeEnabled;
    dateEnabled = items.dateEnabled;
    
    artStationEnabled = items.artStationEnabled;
    behanceEnabled = items.behanceEnabled;
    itchEnabled = items.itchEnabled;
    behanceOrdering = items.behanceOrdering;
    artStationMedium = items.artStationMedium;
    artStationOrdering = items.artStationOrdering;

    seperateTab = items.seperateTab;

    tutorialViewed = items.tutorialViewed2;
   
    console.log(items);

    behanceElement.checked    = behanceEnabled;
    artStationElement.checked = artStationEnabled;
    itchElement.checked = itchEnabled;
    searchTermElement.value   = searchTerm;
    seperateTabElement.checked = seperateTab;
    timeToggleElement.checked = timeEnabled;
    dateToggleElement.checked = dateEnabled;    
    
    behanceOrderDropdownElement.value = behanceOrdering;
    
    artstationMediumDropdownElement.value = artStationMedium;
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
      "<br>"+
      "<p>Inspire sources its content from both <a href='https://www.behance.net/'>Behance.net</a> and <a href='https://www.artstation.com/'>ArtStation.com</a>. We hope you enjoy the gorgeous art and design fresh daily from around the web!</p>"+
      "<br>"+
      "<p>You can edit these image sources to your liking, specify a search term, and find many other customisation options via the preferences panel in the bottom right (&#9881;)</p><br> "+
       "<p>Any and all <a href='https://chrome.google.com/webstore/detail/inspire-gallery-new-tab/feldechheiacimdajbkleojednhpophc'>feedback</a> is welcome!</p><br>"+
      "<h2>New in V1.0</h2>"+
      "<ul>"+
      "<li><span>Support for new ArtStation APIs</span></li>"+
      "<li><span>Improved Grid Layout</span></li>"+
      "<li><span>More Artstation Mediums</span></li>"+
      "<li><span>Numerous Bug Fixes</span></li>"+
      "</ul>"+
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
var s_ItchEnabledID = 'itch_enabled';
var s_SearchTermID = 'search_term';
var s_SeperateTabID = 'seperate_tab';
var s_DisplayOrderID = 'display_order';
var s_BehanceOrderID = 'behance_order';
var s_ArtStationMediumID = 'artstation_medium';
var s_ArtStationOrderID = 'artstation_order';

function UpdateHTML()
{
  behanceElement              = document.getElementById(s_BehanceEnabledID);
  artStationElement           = document.getElementById(s_ArtStationEnabledID);
  itchElement                 = document.getElementById(s_ItchEnabledID);
  
  searchTermElement           = document.getElementById(s_SearchTermID);

  seperateTabElement          = document.getElementById(s_SeperateTabID);

  behanceOrderDropdownElement = document.getElementById(s_BehanceOrderID);

  artstationMediumDropdownElement = document.getElementById(s_ArtStationMediumID);
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
  $('#'+s_BehanceEnabledID).change(function() {
    save_options();
    refresh();
  });
  $('#'+s_ArtStationEnabledID).change(function() {
    save_options();
    refresh();
  });
  $('#'+s_ItchEnabledID).change(function() {
    save_options();
    refresh();
  });
  $('#'+s_SeperateTabID).change(function() {
    save_options();
  });
  $('#'+s_BehanceOrderID).on('input', function() {
    save_options();
    refresh();
  });
  $('#'+s_ArtStationMediumID).on('input', function() {
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

  if(chrome.storage)
  {
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
  }

  AddSearchTermDropdownElements(DISPLAY_ORDER, s_DisplayOrderID);
  AddSearchTermDropdownElements(BEHANCE_ORDER, s_BehanceOrderID);
  AddSearchTermDropdownElements(ARTSTATION_MEDIUM, s_ArtStationMediumID);
  AddSearchTermDropdownElements(ARTSTATION_SORTING, s_ArtStationOrderID);

  restore_options();

});

