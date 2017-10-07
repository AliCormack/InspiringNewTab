
  be('Gs6WkD85SxnL9f6MbHjjr30udF8iZAdy')

var searchTerm = '';
var sortMethod = '';
var contentLoads = 1;

chrome.storage.sync.get(['searchTerm', 'sortMethod'], function(items) {
    if(typeof items.searchTerm !== 'undefined') searchTerm = items.searchTerm;
    if(typeof items.sortMethod !== 'undefined') sortMethod = items.sortMethod;
    getImages();
})

function getImages()
{
  // Using callbacks
  be.project.search(searchTerm, sortMethod, contentLoads, function success(results) {

    var newHTML = [];
    for (var i = 0; i < results.projects.length; i++) {

        var project = results.projects[i];

        newHTML.push(' <div class = "cell"> <a href = '+project.url+'> <img data-src=' + project.covers['404'] + '></a></img></div>');
    }
    $(".grid").append(newHTML.join(""));

    $(".scroll").remove();    
    var scrollToLoadCell = '<div class = "cell scroll"><span>&#9679; &#9679; &#9679;</span></div>';
    $(".grid").append(scrollToLoadCell);

    fadeIn();

  });

  
}

function loadNewContent()
{
  contentLoads++;
  getImages();
}

function fadeIn()
{
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
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

  // Infinite Scroll

  $(window).on('scroll', function() {
      if($(window).scrollTop() + $(window).height() >= $('body')[0].scrollHeight) {
        loadNewContent();
      }
  })

});
