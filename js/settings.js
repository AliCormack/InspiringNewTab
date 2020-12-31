// Settings

var searchTerm;
var timeEnabled;
var dateEnabled;
var tutorialViewed;
var artStationEnabled;
var behanceEnabled;
var itchEnabled;
var behanceOrdering;
var artStationOrdering2;
var seperateTab;
var urlsToHide = [];

// Defaults

var defaultSearchTerm = '';
var defaultSearchMethod = '';
var defaultTimeEnabled = true;
var defaultDateEnabled = true;
var defaultTutorialViewed = false;
var defaultArtStationEnabled = true;
var defaultBehanceEnabled = true;
var defaultItchEnabled = false;
var defaultBehanceOrdering = 'featured_date';
var defaultArtstationMedium = 0;
var defaultArtstationOrdering = 'trending';
var defaultSeperateTab = false;
var defaultUrlsToHide = [];

// HTML

var behanceElement;
var artStationElement;
var itchElement;

var searchTermElement;

var seperateTabElement;

var behanceOrderDropdownElement;

var artstationMediumDropdownElement;
var artstationOrderDropdownElement;

var resetHiddenElement;

var timeToggleElement;
var dateToggleElement;

function AddUrlToHide(url)
{
  urlsToHide.push(url);
  save_options();
  refresh();  
}

function ResetUrlsToHide()
{
  urlsToHide = [];
  save_options();
  refresh();
}

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

  artStationMedium2 = artstationMediumDropdownElement.value;
  artStationOrdering2 = artstationOrderDropdownElement.value;
  
  timeEnabled = timeToggleElement.checked;
  dateEnabled = dateToggleElement.checked;  

  save_chrome_storage();

  updateDateTimeHTML();

}

function save_chrome_storage()
{
  chrome.storage.sync.set({
    searchTerm: searchTerm,
    timeEnabled: timeEnabled,
    dateEnabled: dateEnabled,
    tutorialViewed: tutorialViewed,
    artStationEnabled : artStationEnabled,
    behanceEnabled : behanceEnabled,
    itchEnabled : itchEnabled,
    behanceOrdering : behanceOrdering,
    artStationMedium2 : artStationMedium2,
    artStationOrdering2 : artStationOrdering2,
    seperateTab : seperateTab,
    urlsToHide : urlsToHide
  });
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
    tutorialViewed4: defaultTutorialViewed,
    artStationEnabled : defaultArtStationEnabled,
    behanceEnabled : defaultBehanceEnabled,
    itchEnabled : defaultItchEnabled,
    behanceOrdering : defaultBehanceOrdering,
    artStationMedium2 : defaultArtstationMedium,
    artStationOrdering2 : defaultArtstationOrdering,
    seperateTab : defaultSeperateTab,
    urlsToHide : defaultUrlsToHide
  }, function(items) 
  {
    
    searchTerm = items.searchTerm;
    timeEnabled = items.timeEnabled;
    dateEnabled = items.dateEnabled;
    
    artStationEnabled = items.artStationEnabled;
    behanceEnabled = items.behanceEnabled;
    itchEnabled = items.itchEnabled;
    behanceOrdering = items.behanceOrdering;
    artStationMedium2 = items.artStationMedium2;
    artStationOrdering2 = items.artStationOrdering2;

    seperateTab = items.seperateTab;
    
    urlsToHide = items.urlsToHide;

    tutorialViewed = items.tutorialViewed4;
   
    console.log(items);

    behanceElement.checked    = behanceEnabled;
    artStationElement.checked = artStationEnabled;
    itchElement.checked = itchEnabled;
    searchTermElement.value   = searchTerm;
    seperateTabElement.checked = seperateTab;
    timeToggleElement.checked = timeEnabled;
    dateToggleElement.checked = dateEnabled;    
    
    behanceOrderDropdownElement.value = behanceOrdering;
    
    artstationMediumDropdownElement.value = artStationMedium2;
    artstationOrderDropdownElement.value = artStationOrdering2;

    updateDateTimeHTML();
    addTutorialIfRequired(tutorialViewed);

    GetImages();

    save_options();
  });
}

function addTutorialIfRequired(tutorialViewed)
{
  if(!tutorialViewed)
  {
    var tutorial_1_element = document.getElementById("tutorial_1");
    tutorial_1_element.classList.remove("hidden");
    $("#close-tutorial-1-btn").click(function()
    {      
      tutorial_1_element.classList.add("hidden");

      // Part 2
      var tutorial_2_element = document.getElementById("tutorial_2");
      tutorial_2_element.classList.remove("hidden");

      // Sources
      // Behance
      var tutorial_behance_enabled = document.getElementById("tutorial_behance_enabled");
      tutorial_behance_enabled.checked = behanceEnabled;
      tutorial_behance_enabled.addEventListener('change', (event) =>  
      {
        behanceEnabled = event.target.checked;
        save_chrome_storage();
        refresh();
      });

      // Behance
      var tutorial_artstation_enabled = document.getElementById("tutorial_artstation_enabled");
      tutorial_artstation_enabled.checked = artStationEnabled;
      tutorial_artstation_enabled.addEventListener('change', (event) =>  
      {
        artStationEnabled = event.target.checked;
        save_chrome_storage();
        refresh();
      });

      // Behance
      var v = document.getElementById("tutorial_itch_enabled");
      tutorial_itch_enabled.checked = itchEnabled;
      tutorial_itch_enabled.addEventListener('change', (event) =>  
      {
        itchEnabled = event.target.checked;
        save_chrome_storage();
        refresh();
      });
      
      $("#close-tutorial-2-btn").click(function()
      {  
        tutorial_2_element.classList.add("hidden");

        chrome.storage.sync.set({
          tutorialViewed4: true,
        });

        restore_options();
      });
    });

  }
}

function updateDateTimeHTML()
{
  if(timeEnabled == true)
  {
    $('#time').removeClass("hide");
  }
  else
  {
    $('#time').addClass("hide");
  }

  if(dateEnabled == true)
  {
    $('#date').removeClass("hide");
  }
  else
  {
    $('#date').addClass("hide");
  }

  if(timeEnabled == true || dateEnabled == true)
  {
    $('#time-and-date').removeClass("hide");
  }
  else
  {
    $('#time-and-date').addClass("hide");
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
var s_ResetHiddenID = 'reset_hidden';

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

  resetHiddenElement = document.getElementById(s_ResetHiddenID);
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
  
  $('#'+s_ResetHiddenID).click(function()
  {
    ResetUrlsToHide();
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

