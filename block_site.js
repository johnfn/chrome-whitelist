// all or hacking
var whitelist_type = "all"; 

var fine_urls = { "google"              : "hacking" 
                , "youtube"             : "all"                      
                , "README"              : "all"                     
                , "420"                 : "all"                  
                , "givewell"            : "all"                       
                , "humble"              : "all"                     
                ,'facebook'             : "all"                      
                , "elacar"              : "all"                     
                , "songmeanings"        : "all"                           
                , "sfoutsidelands"      : "all"                             
                , "swift"               : "all"                    
                ,'stypi'                : "all"                   
                , "howtobeare"          : "all"                         
                , "exocomics"           : "all"                        
                , "goodreads"           : "all"                        
                , "meetup"              : "all"                     
                , "craigslist"          : "all"                         
                ,'rate'                 : "all"                  
                ,'hack'                 : "all"                  
                , "chocolat"            : "all"                       
                , "blog"                : "all"                   
                ,'smbc'                 : "all"                  
                ,'penny-ar'             : "all"                      
                , "bell-labs"           : "all"                        
                , "stalkerbot"          : "all"                         
                , "lisp"                : "all"                   
                , "clojure"             : "all"                      
                , "marcellos"           : "all"                        
                , "goose"               : "all"                    
                , "quora"               : "all"                    
                , "sicp"                : "all"                   
                , "groupon"             : "all"                      
                , "imdb"                : "all"                   
                , "mysql"               : "all"                    
                , "asana"               : "all"                    
                , "cause"               : "all"                    
                , "dustincurtis.com"    : "all"                               
                , "develop-online"      : "all"                             
                , "jline"               : "all"                    
                , "stackoverflow"       : "all"                            
                , "emacs"               : "all"                    
                , "750words"            : "all"                       
                , "oracle"              : "all"                     
                , "kickstarter"         : "all"                          
                ,'buttersafe'           : "all"                        
                , "stars.kripet"        : "all"                           
                , "rreverie"            : "all"                       
                , "ruby"                : "all"                   
                , "meganam"             : "all"                      
                , "taskpot"             : "all"                      
                , "topcoder"            : "all"                       
                , "eclipse"             : "all"                      
                , "sinatrarb"           : "all"                
                , "bowler"              : "all"             
                , "clojure"             : "all"                      
                , "wycatsnumber"        : "all"                           
                , "wikipedia"           : "all"                        
                , "tineye"              : "all"                     
                , "wikibook"            : "all"                       
                , "winfail"             : "all"                      
                , "vim"                 : "all"                  
                , "gmail"               : "all"                    
                , "github"              : "hacking"                     
                , "mockr"               : "all"                    
                , "grooveshark"         : "all"                          
                , "dropbox"             : "all"                      
                , "localhost"           : "all"                        
                , "flattr"              : "all"                     
                , "gutenberg"           : "all"                        
                , "slashdot"            : "all"                       
                , "go-hero"             : "all"                      
                , "alexa"               : "all"                    
                , "yelp"                : "all"                   
                , "dusan.fora"          : "all"                         
                , "weather"             : "all"                      
                , "wsoh"                : "all"                   
                , "ludum"               : "all"                    
                , "smogon"              : "all"                     
                , "socket"              : "all"                     
                , "milo"                : "all"                   
                , "rspec"               : "all"                    
                , "tornado"             : "all"                      
                , "lostgarden"          : "all"                         
                , "yuiblog"             : "all"                      
                , "yui"                 : "all"                  
                , "jquery"              : "all"                     
                , "crockford"           : "all"                        
                , "imgur"               : "all"                    
                , "adsafe"              : "all"                     
                , "projecteuler"        : "all"                           
                , "procrastinating"     : "all"                              
                , "dreamers"            : "all"                       
                , "canvas"              : "all"                     
                , "python"              : "all"                     
                , "stanford"            : "all"                       
                , "vgmaps"              : "all"                     
                , "apple"               : "all"                    
                , "asus"                : "all"                   
                , "zelda"               : "all"                    
                , "guitar"              : "all"                     
                , "911tabs"             : "all"                      
                , "sqlalchemy"          : "all"                         
                , "famfamfam"           : "all"                        
                , "pastebin"            : "all"                       
                , "etherpad"            : "all"                       
                };

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
  console.log($("whitelist_group"));

  var url = strip_http(document.URL);

  var whitelisted = []; 
  for (key in fine_urls){
    if (fine_urls[key] === whitelist_type || whitelist_type === "all"){
      whitelisted.push(key);
    }
  }

  /* If it's an okay URL, don't block it */

  for (var i=0; i<whitelisted.length; i++) {
    if (url.indexOf(whitelisted[i]) != -1) {
      unblock_links(); /* Unblock adjancent links too */
      return;
    }
  }

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
