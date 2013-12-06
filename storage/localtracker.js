/*JAVASCRIPT FILE
created on '11/15/2013'**/

//------- Some Guidlines --------//
//each origin gets 5 megabytes of storage by default
//if this quota is exceeded, the "QUOTA_EXCEEDED_ERR" exception will be thrown
//As of now, you cannot change this quota


function LocalTracker( options ) 
{
	//check that HTML5 local storage exists before building class
	if (! hasLocalStorage) { 
		console.warn('This Environment does not support HTML5 LocalStorage'); 
	};


	//------- private properties --------//

	//required

	//optional default values
	var settings = 
	{
	      id : "", //string: used as prefix to uniquely identify LocalStorage keys made by this Class Instance
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

	function hasLocalStorage() {
		return (typeof(Storage) !== "undefined"); 
	}

	//returns array of trackedEvent objects
	function getTrackedEvents() {
		var prop;
		var te = [];
		var length = settings.id.length;
		for (prop in localStorage) {
			if (prop.substring(0,length+3) == settings.id+'te_') {
				var string = localStorage.getItem(prop);
				var array = string.split(',');
				var obj = {
					"catagory" : array[0], 
					"action" : array[1],
					"value" : array[2],
					"timeStamp" : array[3]
				}
				te.push(obj);
			}
		}
		return te;
	}

	//returns array of trackedPage objects
	function getTrackedPages() {
		var prop;
		var tp = [];
		var length = settings.id.length;
		for (prop in localStorage) {
			if (prop.substring(0,length+3) == settings.id+'tp_') {
				var string = localStorage.getItem(prop);
				var array = string.split(',');
				var obj = {
					"url" : array[0], 
					"timeStamp" : array[1]
				}
				tp.push(obj);
			}
		}
		return tp;
	}

	function storageChanged(e) {
		if (!e) e = window.event; //capture IE storage event
		var key = e.key;
		var oldValue = e.oldValue;
		var value = e.newValue;
		var url = e.url || e.uri; //some browser versions may use uri

		console.log('storageChanged');
	}

	function sendToGACompleted(e) {
		//callback method when tracking has been sent to google analitics
		//if successful, remove tracked objects from LocalStorage
	}


	//------- public methods --------//

	this.trackPage = function() {
		if (! hasLocalStorage) return;

		var url = window.location.href;
		var timeStamp = Date.now() || +new Date();
		var string = url + "," + timeStamp;
		localStorage[settings.id+'tp_'+localStorage.length] = string;
	}

	this.trackEvent = function( catagory, action, opt_value ) {
		if (! hasLocalStorage) return;

		var timeStamp = Date.now() || +new Date();
		var value = opt_value || "";
		var string = catagory + "," + action + "," + value.toString() + "," + timeStamp;
		localStorage['te_'+localStorage.length] = string;
	}

	this.clearTrackedEvents = function() {
		if (! hasLocalStorage) return;

		var prop;
		var length = settings.id.length;
		for (prop in localStorage) {
			if (prop.substring(0,length+3) == settings.id+'te_') {
				localStorage.removeItem(prop);
			}
		}
	}

	this.clearTrackedPages = function() {
		if (! hasLocalStorage) return;

		var prop;
		var length = settings.id.length;
		for (prop in localStorage) {
			if (prop.substring(0,length+3) == settings.id+'tp_') {
				localStorage.removeItem(prop);
			}
		}
	}

	this.sendToGA = function( scriptURL ) {
		if (! hasLocalStorage) return;

		if (! sending) {
			sending = true;
			var json = { 
				"trackedPages" : getTrackedPages(), 
				"trackedEvents" : getTrackedEvents()
			};
			
			//send json object via ajax request to php script that lives on a server
			//php script forwards on to Google Analitics

			sending = false;
		}
	}


	//------- getter setter methods --------//

	this.__defineGetter__('id', function() { return settings.id; }); //read only
	//this.__defineSetter__('example', function(num) { settings.example = num; });


	//------- initial actions --------//

	updateSettings();

	if (window.addEventListener) {
		window.addEventListener("storage", storageChanged);
	} else {
		window.attachEvent("onstorage", storageChanged); // <IE9
	};
}
