/*JAVASCRIPT FILE
created on '11/15/2013'**/

//------- Some Guidlines --------//
//each origin gets 5 megabytes of storage by default
//if this quota is exceeded, the "QUOTA_EXCEEDED_ERR" exception will be thrown
//As of now, you cannot change this quota


function LocalTracker( options ) 
{
	//check that HTML5 local storage exists before building class
	if(typeof(Storage)!=="undefined"){}
	else { return console.warn('This Environment does not support HTML5 LocalStorage'); };


	//------- private properties --------//

	//required

	//optional default values
	var settings = 
	{
	     example : 0 //int: sample explanation if needed
	}

	//internal
	var sending = false;
	var self = this;
	

	//------- private methods --------//

	function updateSettings() {
		if (options) {
			var prop;
			for (prop in options) {
				if ( settings.hasOwnProperty(prop) ) settings[prop] = options[prop];
			}
		}
	}

	function storageChanged(e) {
		if (!e) e = window.event; //capture IE storage event
		var key = e.key;
		var oldValue = e.oldValue;
		var value = e.newValue;
		var url = e.url || e.uri; //some browser versions may use uri

		console.log('storageChanged');
	}


	//------- public methods --------//

	this.trackPage = function() {
		var url = window.location.href;
		var timeStamp = Date.now() || +new Date();
		var string = url + "," + timeStamp;
		localStorage['tp_'+localStorage.length] = string;
	}

	this.trackEvent = function( catagory, action, opt_value ) {

		var timeStamp = Date.now() || +new Date();
		var string = catagory + "," + action + "," + opt_value.toString() || "" + "," + timeStamp;
		localStorage['te_'+localStorage.length] = string;
	}

	this.clearTrackedEvents = function() {
		var prop;
		for (prop in localStorage) {
			if (prop.substring(0,3) == 'te_') localStorage.removeItem(prop);
		}
	}

	this.clearTrackedPages = function() {
		var prop;
		for (prop in localStorage) {
			if (prop.substring(0,3) == 'tp_') localStorage.removeItem(prop);
		}
	}

	this.sendToGA = function( gaObject ) {
		if (!sending) {
			sending = true;
		}
	}


	//------- getter setter methods --------//

	this.__defineGetter__('example', function() { return settings.example; });
	this.__defineSetter__('example', function(num) { settings.example = num; });


	//------- initial actions --------//

	updateSettings();

	if (window.addEventListener) {
		window.addEventListener("storage", storageChanged);
	} else {
		window.attachEvent("onstorage", storageChanged); // <IE9
	};
}
