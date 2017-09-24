// Saves options to chrome.storage.sync.
function save_options()
{
  // var color = document.getElementById('color').value;
  // var likesColor = document.getElementById('like').checked;

  var term = document.getElementById('search_term').value;
  var sort = document.getElementById('sort_method').value;

  chrome.storage.sync.set({
    searchTerm: term,
    sortMethod : sort
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    searchTerm: 'featured_date',
    sortMethod: ''
  }, function(items) {
    document.getElementById('search_term').value = items.searchTerm;
    document.getElementById('sort_method').value = items.sortMethod;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',  save_options);
