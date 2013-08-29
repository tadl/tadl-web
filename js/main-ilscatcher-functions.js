function loadmore() {
    pagecount++;
    state = History.getState();
    var searchquery = state.data.query;
    var mediatype = state.data.mt;
    var available = state.data.avail;
    var loc = state.data.location;
    $('#loadmoretext').empty().append(loadingmoreText).trigger("create");
    $('#loadmoretext').trigger("create");
    $.get(ILSCATCHER_INSECURE_BASE + "/main/searchjson.json?utf8=%E2%9C%93&q=" + searchquery + "&mt=" + mediatype + "&p=" + pagecount + "&avail=" + available + "&loc=" + loc, function(data) {
        var results = data.message
        if (state.data.action === "getsearch" && state.data.query === searchquery && state.data.mt === mediatype && state.data.avail === available && state.data.location === loc)  {
            if (results != "no results") {
                var template = Handlebars.compile($('#results-template').html());
                var info = template(data);
                $('#first_column_content').append(info).promise().done(function() {
                    $('#loadmoretext').empty().append(loadmoreText);
                    $('#loadmoretext').trigger("create");
                    $("#login_form").slideUp("fast");
                });
            } else {
                $('#loadmoretext').html("No Further Results");
            }
        }
    });
}

function getsearch(query, mt, avail, location) {
    var searchquery = query;
    var available = avail;
    var mediatype = mt;
    var loc = location;
    linked_search = "true";
    if (available === "true") {
        $('#available').prop('checked', true);
    } else {
        $('#available').prop('checked', false);
    }
    $("#mediatype").val(decodeURIComponent(mt));
    $("#term").val(decodeURIComponent(searchquery));
    $("#location").val(decodeURIComponent(loc));
    var newstate = 'search/'+searchquery+'/'+mediatype+'/'+available+'/'+loc; 
    var action = {action:"getsearch", query:searchquery, mt:mediatype, avail:available, location:loc, state:newstate}
    History.pushState(action, psTitle + "Search", newstate);
    getResults();
}



function getResults() {      
    cleanhouse();
    $('.load_more').show();
    $('#loadmoretext').empty().append(loadingmoreText).trigger("create");
    pagecount = 0;
    var searchquery = encodeURIComponent($('#term').val());
    var mediatype = encodeURIComponent($('#mediatype').val());
    var loc = $('#location').val();
    loctext = document.getElementById("location").options[document.getElementById('location').selectedIndex].text;
    if (document.getElementById('available').checked) {
        var available = "true";
        var availablemsg = "ONLY AVAILABLE";
    } else {
        var available = "false";
        var availablemsg = "";
    }
    var newstate = 'search/'+searchquery+'/'+mediatype+'/'+available+'/'+loc; 
    if (linked_search != "true") {
        var action = {action:"getsearch", query:searchquery, mt:mediatype, avail:available, location:loc, state:newstate}
        History.pushState(action, psTitle + "Search", newstate);
    }
    $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/searchjson.json?utf8=%E2%9C%93&q=" + searchquery + "&mt=" + mediatype +"&avail=" + available + "&loc=" + loc, function(data) {
        var results = data.message;
        state = History.getState();
        linked_search = "false";
        if (state.data.state === newstate) {
            if (results != "no results") {
                var template = Handlebars.compile($('#results-template').html());
                var info = template(data);
                $('#first_column_content_content').replaceWith(info);
                $('#loadmoretext').empty().append(loadmoreText);
                $('#loadmoretext').trigger("create");
                var mediatypedecode = decodeURIComponent(mediatype);
                $('#search-params').html('Searching for '+ searchquery +' in ' + mediatypedecode + ' at ' + loctext + ' ' + availablemsg + '. <a onclick="openSearch_options()">options...</a>');
            } else {
                $('#first_column_content_content').replaceWith("No Results");
                $('.load_more').hide();
            }
        } 
    });
}

function logged_in() {
    var username = window.localStorage.getItem('username');
    if (username) {
        return true;
    } else {
        return false;
    }
}

function logout() {
    $("#login_form").html('Username: <input type="text" id="username" /><br /> Password: <input type="password" id="pword" /><br /><button id="login" onclick="login()">Login</button><span id="login_msg"></span>'); 
    window.localStorage.clear();
    home(); //probably something else here
}

function showmore(record_id) {
    var record_id = record_id;
    var e = document.getElementById(record_id);
    if (e.style.display === 'none') {
        if (!$.trim($('#'+ record_id).html()).length) {
            $('#'+ record_id +'-loading').html(loadingmoreText).trigger("create");
            $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/itemdetails.json?utf8=%E2%9C%93&record_id=" + record_id, function(data) {
                var results = data.message;
                var template = Handlebars.compile($('#more_details-template').html());
                var info = template(data);
                $('#'+ record_id).html(info).promise().done(function() {
                    $('#'+ record_id +'-loading').empty();
                });
                $('#'+ record_id).css('display', 'block');
                $('#showmore-' + record_id).css('display', 'none');
            });
        } else {
            $('#'+ record_id).css('display', 'block');
        }
    } else {
        $('#'+ record_id).css('display', 'none');
    }
}

function viewitem(record_id) {
    cleanhouse();
    state = History.getState();
    $('.load_more').show();
    $('#loadmoretext').empty().append(loadingmoreText).trigger("create");
    $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/itemdetails.json?utf8=%E2%9C%93&record_id=" + record_id, function(data) {
        var template = Handlebars.compile($('#result-details-template').html());
        var info = template(data);
        if (state.data.action === "viewitem") {
            $('#results').html(info).promise().done(function() {
                $('#loadmoretext').empty();
            });
            $('#'+ record_id).css('display', 'block');
        }
    });
}

// not sure what this is for. It might be something I left half-done and has been replaced
function loaditem(record_id) {    
    var record_id = record_id;
    var action = {action:"viewitem", record_id:record_id}
    var newstate = 'item/' + record_id;
    History.pushState(action, 'Featured Item ' + record_id, newstate);
}

function showshelf(record_id) {
    var record_id = record_id;
    var e = document.getElementById(record_id +'shelf');
    if (e.style.display === 'none') {
        if (!$.trim($('#'+ record_id +'shelf').html()).length) {
            $('#'+ record_id +'-loading').html(loadingmoreText).trigger("create");
            $.getJSON(ILSCATCHER_INSECURE_BASE + "/main/itemonshelf.json?utf8=%E2%9C%93&record_id=" + record_id, function(data) {
                var results = data.message;
                var template = Handlebars.compile($('#shelf-template').html());
                var info = template(data);
                $('#'+ record_id +'shelf').html(info).promise().done(function() {
                    $('#'+ record_id +'-loading').empty();
                });
                $('#'+ record_id +'shelf').css('display', 'block');
            });
        } else {
            $('#'+ record_id +'shelf').css('display', 'block');
        }
    } else {
        $('#'+ record_id +'shelf').css('display', 'none');
    }
}

function pre_hold(record_id) {
    var record_id = record_id;
    link_id = '#place_hold_' + record_id;
    if (logged_in()) {
        $(link_id).html('Requesting hold...');
        $(link_id).css('color', 'green');
        hold(record_id);
    } else {
        $(link_id).html('Log in to place hold');
        $(link_id).addClass('hold_login_first');
        $("#login_form").slideDown("fast");
    }
}

function reset_hold_links() {
    $(".hold_login_first").each(function() {
        $(this).removeClass('hold_login_first');
        $(this).html('Place Hold');
    });
}

function hold(record_id) {
    var record_id = record_id;
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/hold.json?u='+ username +'&pw=' + password + '&record_id=' + record_id, function(data) {
        var message = data[':message'];
        var success = false;
        var button_id = '#place_hold_' + record_id;
        if (message == 'Hold was successfully placed') {
            success = true;
        }
        if (message) {
            $(button_id).html(message);
        } else {
            $(button_id).html('Unable to place hold.');
        }
        $(button_id).css('color', (success) ? 'green' : 'red');
    });
    window.setTimeout(partB,5000);
}

function partB() {
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/login.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#logedin-template').html());
        var info = template(data);
        $('#login_form').html(info);
    });
}

function login() {
    var username = $('#username').val();
    var password = $('#pword').val();
    if (typeof(username) !== 'undefined' && username != '' && typeof(password) !== 'undefined' && password != '') {
        window.localStorage.setItem('username', username);
        window.localStorage.setItem('password', password);
        login_and_fetch_dash(username, password);
    }
}

function login_and_fetch_dash(username, password) {
    var username = username;
    var password = password;
    if (typeof(username) == 'undefined' || typeof(password) == 'undefined') {
        username = window.localStorage.getItem('username');
        password = window.localStorage.getItem('password');
    }
    if (typeof(username) !== 'undefined' && username != '' && username !== null
        && typeof(password) !== 'undefined' && password != '' && password !== null) {
        if ($('#pword').length != 0) {
            $('#login_form').html('Logging in...');
        }
        if ($('#login').length != 0) {
            $('#login').prop("onclick", null);
            $('#login').html('Refreshing...');
        }
        $.getJSON(ILSCATCHER_BASE + '/main/login.json?u='+ username +'&pw=' + password, function(data) {
            if (data['status'] == 'error') {
                $("#login_form").html('Username: <input type="text" id="username" /><br /> Password: <input type="password" id="pword" /><br /><button id="login" onclick="login()">Login</button><span id="login_msg"></span>'); 
    			window.localStorage.clear();
                $('#login_msg').html('Error logging in.');
            } else {
                render_dash(data);
                reset_hold_links();
            }
        });
    } else {
        $("#login_form").html('Username: <input type="text" id="username" /><br /> Password: <input type="password" id="pword" /><br /><button id="login" onclick="login()">Login</button><span id="login_msg"></span>'); 
        window.localStorage.clear();
    }
}

function render_dash(data) {
    var data = data;
    var template = Handlebars.compile($('#logedin-template').html());
    var info = template(data);
    $('#login_form').html(info);
}

function showcheckouts() { 
    cleanhouse();
    var action = {action:"showcheckouts"}
    History.pushState(action, "Your Checkedout Items", "checkout");   
    $('.load_more').show();
    $('#loadmoretext').empty().append(loadingmoreText).trigger("create");
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password');
    state = History.getState();
    $.getJSON(ILSCATCHER_BASE + '/main/showcheckouts.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#showcheckedout-template').html());
        var info = template(data);
        if (state.data.action === "showcheckouts") { 
            $('#results').html(info);
            $('.load_more').hide();
        }
    });
}

function pre_cancelhold(element, hold_id) {
    var element = element;
    var hold_id = hold_id;
    var confirm_text = 'Tap to Cancel Hold';
    var canceling_text = 'Canceling hold...';
    $(element).css('color', 'red');
    $(element).html(confirm_text);
    $(element).prop("onclick", null);
    $(element).on("click", function(event) {
        $(this).off('click');
        $(this).html(canceling_text);
        cancelhold(hold_id);
    });
}

function cancelhold(hold_id) {
    var hold_id = hold_id;
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password');
    $.getJSON(ILSCATCHER_BASE + '/main/cancelhold.json?u='+ username +'&pw=' + password + '&hold_id=' + hold_id, function(data) {
        $('#hold_' + hold_id).remove();
    });
}

function showholds() {
    cleanhouse();
    var action = {action:"showholds"}
    History.pushState(action, "Your Holds", "holds"); 
    $('.load_more').show();
    $('#loadmoretext').empty().append(loadingmoreText).trigger("create");
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password'); 
    state = History.getState();
    $.getJSON(ILSCATCHER_BASE + '/main/showholds.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#showholds-template').html());
        var info = template(data);
        $('#results').show();
        if (state.data.action === "showholds") {
            $('#results').html(info);
            $('.load_more').hide(); 
        }
    });   
}

function showpickups() {
    cleanhouse();
    var action = {action:"showpickups"}
    History.pushState(action, "Ready for Pickup", "pickup"); 
    $('.load_more').show();
    $('#loadmoretext').empty().append(loadingmoreText).trigger("create");   
    var username = window.localStorage.getItem('username');
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password'); 
    state = History.getState();
    $.getJSON(ILSCATCHER_BASE + '/main/showpickups.json?u='+ username +'&pw=' + password, function(data) {
        var template = Handlebars.compile($('#showholds-template').html());
        var info = template(data);
        if (state.data.action === "showpickups") {
            $('#results').html(info);
            $('.load_more').hide(); 
        }
    });
}

function renew(element, circulation_id, barcode) {
    var element = element;
    var circ_id = circulation_id;
    var bc = barcode;
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password');
    $(element).css('color','red');
    $(element).html('Renewing...');
    $.getJSON(ILSCATCHER_BASE + '/main/renew.json?u='+ username +'&pw=' + password + '&circ_id=' + circ_id + '&bc=' + bc, function(data) {
        var template = Handlebars.compile($('#renew-template').html());
        var info = template(data);
        $('#'+ bc +'').html(info);
    });
}


function showcard() {
    cleanhouse();
    var action = {action:"showcard"}
    History.pushState(action, "Your Card", "card"); 
    $('.load_more').show();
    $('#loadmoretext').empty().append(loadingmoreText).trigger("create");
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password'); 
    state = History.getState();
    $.getJSON(ILSCATCHER_BASE + '/main/showcard.json?u='+ username +'&pw=' + password, function(data) {
        if (state.data.action === "showcard") {   
            var card = data.barcode;
            $('.load_more').hide();
            $('#results').empty().append('<div class="shadow result"><div id="barcodepage"><div class="barcode"><div id="bcTarget"></div></div><div class="barcodelogo"><div class="bclogoTarget"><img src="img/clean-logo-header.png" alt="" /></div></div><div class="clearfix"></div></div></div>');
            $("#bcTarget").barcode(card, "code128", {barWidth:2, barHeight:80, fontSize:12}); 
        }
    });
}
