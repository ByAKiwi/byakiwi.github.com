$.domReady(function() {
  'use strict';
  
  var newFav = $.template('<a target="_blank" href="<%= referer %>" ' + 
    'title="<%= title %>" alt=""><img src="<%= image_url %>"></a>');
  
  var randomKiwi = function(size) {
    var colour = 'dark green red'.split(' ')[$.random(2)];
    return '//served.by-a.kiwi.nz/coded/badge-' + colour + '-' + size + '.png';
  };
  
  var loadIt = function() {
    this.className += ' loaded';
  };
  
  var imageLoaded = function(node) {
    var w = 'undefined' !== typeof node.clientWidth ? node.clientWidth : node.offsetWidth;
    var h = 'undefined' !== typeof node.clientHeight ? node.clientHeight : node.offsetHeight;
    return w + h > 0;
  };
  
  var toLoad = function(el) {
    if (imageLoaded(el)) {
      loadIt.call(el);
    } else {
      el.addEventListener('load', loadIt);
    }
  };
  
  $("img").forEach(toLoad);
  $.ajax({
    url: '//served.by-a.kiwi.nz/api/projects/coded',
    method: 'GET',
    type: 'json',
    crossOrigin: true,
    success: function(resp) {
      var html = $.reduce(resp.projects, function(memo, p) {
        if (/by-a\.kiwi\.nz/.test(p.referer)) {
          // Ignore ourselves
          return memo;
        }
        
        if (p.image_url === null) {
          p.image_url = randomKiwi(32);
        }
        
        if (p.title === null) {
          p.title = p.referer.replace(/^.+\/\//, '');
        }
        
        return memo + newFav(p);
      }, '');
      $('#favicons')[0].innerHTML = html;
      $('#favicons img').forEach(toLoad);
    }
  });
  
  var shiftColour = function() {
    var $filter = $('#colour_change')[0].children[0];
    var c = $.times(20, function () {
      return '0.' + $.random(9);
    }).join(' ');
    $filter.setAttribute('values', c);
  };
  setInterval(shiftColour, 1000);
});