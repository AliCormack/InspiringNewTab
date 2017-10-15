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
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    searchTerm: '',
    sortMethod: 'featured_date',
    timeEnabled:true,
    dateEnabled:true
  }, function(items) {
    document.getElementById('search_term').value = items.searchTerm;
    document.getElementById('sort_method').value = items.sortMethod;
    document.getElementById('time_enabled').checked = items.timeEnabled;
    document.getElementById('date_enabled').checked = items.dateEnabled;

    updateDateTimeHTML(items.timeEnabled, items.dateEnabled);
  });
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