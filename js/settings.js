// Saves options to chrome.storage.sync.
function save_options()
{
  // var color = document.getElementById('color').value;
  // var likesColor = document.getElementById('like').checked;

  var term = document.getElementById('search_term').value;
  var sort = document.getElementById('sort_method').value;
  var time = document.getElementById('time_enabled').checked;
  var date = document.getElementById('date_enabled').checked;

  updateDateTimeHTML(time, date);

  chrome.storage.sync.set({
    searchTerm: term,
    sortMethod : sort,
    timeEnabled:time,
    dateEnabled:date
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    searchTerm: '',
    sortMethod: 'featured_date',
    timeEnabled:true,
    dateEnabled:true,
    tutorialViewed:false
  }, function(items) {
    document.getElementById('search_term').value = items.searchTerm;
    document.getElementById('sort_method').value = items.sortMethod;
    document.getElementById('time_enabled').checked = items.timeEnabled;
    document.getElementById('date_enabled').checked = items.dateEnabled;
    updateDateTimeHTML(items.timeEnabled, items.dateEnabled);

    searchTerm = items.searchTerm;
    sortMethod = items.sortMethod

    getImages();

    addTutorialIfRequired(items.tutorialViewed);
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
      "<h4>Beta v0.0.0.4</h4>"+
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

$(document).ready(function()
{
  restore_options();
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
});