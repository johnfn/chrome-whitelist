var fine_urls = [ "google"
                , "stackoverflow"
                , "gmail"
                , "github"
                , "grooveshark"
                , "localhost"
                , "flattr"
                ];

/* Simple wrapper functions around localStorage */

function set_item(key, value) {
  chrome.extension.sendRequest({cmd: "save", key: key, value: value});
}

function get_item(key, cb) {
  chrome.extension.sendRequest({cmd: "load", key: key}, function(response) {
    cb(response);
  });
}

function derp(){
  alert("Well, that's too bad!");
}

$("#a").live('click', derp);

/* Determine if URL starts with a domain, or is a relative path. 
 *
 * That was easier than I thought it would be... */
function starts_with_domain(url) {
  return url[0] != "/";
}

function strip_http(url){
  /* Remove http from URL */
  if (url.indexOf("http://") != -1){
    url = url.substr("http://".length);
  }
  return url;
}

/* Make all the links on this page unblocked. */
function unblock_links(){
  var links = /<a.*?href\s*=\s*["\']([^"\']+)[^>]*>.*?<\/a>/g;
  var domain = window.location.hostname;
  var html = document.body.innerHTML;

  var safe = [];
  while (true){
    var match = links.exec(html);
    if (!match) break;

    var new_url = match[1];
    if (!starts_with_domain(new_url)) {
      new_url = domain + new_url;
    }

    /* Store that this URL is fine in localStorage.
     *
     * TODO: May want to clean out localstorage at some point. */
    set_item(strip_http(new_url), true);
  }
}

/* If a URL is stupid, block it. */
function block_stupid_stuff(){

  var url = strip_http(document.URL);


  /* If it's an okay URL, don't block it */
  for (var i=0; i<fine_urls.length; i++) {
    if (url.indexOf(fine_urls[i]) != -1) {
      unblock_links(); /* Unblock adjancent links too */
      return;
    }
  }

  debugger;

  /* If we're one level of indirection from an okay URL, don't block it. */
  get_item(url, function(resp){
    if (resp) {
      return;
    }

    /* Alright, the URL isn't good or kinda good. Block it. */

    document.body.innerHTML = "<center> Nope. Back to work.<br><br> <a id='a' href='javascript:void(0)'> I want to derp.</a></center>";
  });
}

block_stupid_stuff();
