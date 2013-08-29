var ILSCATCHER_HOST = 'tadl-ilscatcher.herokuapp.com';
var ILSCATCHER_BASE = 'https://' + ILSCATCHER_HOST;
var ILSCATCHER_INSECURE_BASE = 'https://' + ILSCATCHER_HOST; /* we will actually use https here also */
var FEATURED_URL = 'https://www.tadl.org/mobile/export/items/json/featured';
var EVENTS_URL = 'https://www.tadl.org/mobile/export/events/json/all';
var NEWS_URL = 'https://www.tadl.org/export/news/json';
var LOCATIONS_BASE = 'https://www.tadl.org/mobile/export/locations';
var PLACEHOLDER_IMG = 'img/clocktower100.png';
var FACEBOOK_URL = 'https://graph.facebook.com/TraverseAreaDistrictLibrary/feed?access_token=CAAFh5Quq0YMBAENgjPYY9MY0y3cdiAMvXmLl6Fq3H4LDZBBZBukKlXFwWPq0xMLa6hqDrfxfGqvFpBlIZCjFKg0rKdd37qHLsjwcBve4UeZAQymPksV7ddAeZAJOyaeZC05WqlLzrVpOUQEtjiCZArjB6NMUHjvU90qXZAGEOESKDgZDZD';
var loadingmoreText = '<span class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOADING...</span>';
var logoutText = '<span class="loadmore"><img style="margin-right: 10px; margin-left: 10px;" src="img/ajax-loader-2.gif">LOGGING OUT...</span>';
var loadmoreText = '<a class="loadmore button" onclick="loadmore();">LOAD MORE RESULTS</a>';
var psTitle = "TADL Mobile | ";
var platform = 'web';
var version_id = '0';
var pagecount = {}
var state = {}
var linked_search = false;
