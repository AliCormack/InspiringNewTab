
  be('Gs6WkD85SxnL9f6MbHjjr30udF8iZAdy')

var searchTerm = '';
var sortMethod = '';

chrome.storage.sync.get(['searchTerm', 'sortMethod'], function(items) {
    if(typeof items.searchTerm !== 'undefined') searchTerm = items.searchTerm;
    if(typeof items.sortMethod !== 'undefined') sortMethod = items.sortMethod;
    getImages();
})

function getImages()
{
  // Using callbacks
  be.project.search(searchTerm, sortMethod, function success(results) {

    var newHTML = [];
    for (var i = 0; i < results.projects.length; i++) {

        var project = results.projects[i];

        newHTML.push(' <div class = "cell"> <a href = '+project.url+'> <img src=' + project.covers['404'] + '></a></img></div>');
    }
    $(".grid").html(newHTML.join(""));

  });
}




$(document).ready(function()
{
  $( "#settings-button" ).click(function()
  {
    if (chrome.runtime.openOptionsPage) {
      // New way to open options pages, if supported (Chrome 42+).
      chrome.runtime.openOptionsPage();
    } else {
      // Reasonable fallback.
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
});
