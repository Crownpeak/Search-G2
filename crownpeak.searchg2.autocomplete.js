/*!
// ------------------------------------------------------------------------
// (C) CROWNPEAK TECHNOLOGY.
// ------------------------------------------------------------------------

// THIS SOFTWARE IS PROVIDED "AS-IS," WITHOUT ANY EXPRESS OR IMPLIED WARRANTY. 

// IN NO EVENT SHALL CROWNPEAK TECHNOLOGY BE HELD LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THE SOFTWARE.

// THIS SOFTWARE IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL, BUT WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. 
// THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS (INCLUDING BOTH CROWN PEAK TECHNOLOGY 
// AND THE VARIOUS THIRD PARTY COPYRIGHT HOLDERS PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, 
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU, THE USER. 
// SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING 
// WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE 
// (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS),
// EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
// Version: 1.0.2
*/

function CrownPeakAutocomplete(control, options) {
	var self = this;

	// Properties that get passed in
	var _keyTimeout = 250;
	var _mouseTimeout = 3000;
	var _minLength = 3;
	var _highlightStart = "<b>";
	var _highlightEnd = "</b>";
	var _callbacks = {
		"opening": null,
		"opened": null,
		"selected": null,
		"closing": null,
		"closed": null
	};

	var _cps = new CrownPeakSearch("www.crownpeak.com");
	var _enabled = false;
	var _control = null;
	var _keyTimer = null;
	var _mouseTimer = null;
	var _popup = null;
	var _selectedIndex = -1;
	var _lastSearch = "";
	var _lastResult = null;

	parseArguments(control, options);

	function parseArguments(control, options) {
		if (typeof control === "string") control = document.getElementById(control);
		_control = control;
		if (options) {
			if (options.collection) _cps.collection(options.collection);
			if (options.timeout || options.timeout == 0) _keyTimeout = options.timeout;
			if (options.mouseTimeout || options.mouseTimeout == 0) _mouseTimeout = options.mouseTimeout;
			if (options.minLength || options.minLength == 0) _minLength = options.minLength;
			if (options.highlightStart) _highlightStart = options.highlightStart;
			if (options.highlightEnd) _highlightEnd = options.highlightEnd;
			if (options.opening) _callbacks.opening = options.opening;
			if (options.opened) _callbacks.opened = options.opened;
			if (options.selected || options.callback) _callbacks.selected = options.selected || options.callback;
			if (options.closing) _callbacks.closing = options.closing;
			if (options.closed) _callbacks.closed = options.closed;
		}
	}

	// Cross-browser (IE6+) way to add event handlers
	function myAttachEvent(el, ev, fn) {
		if (el.attachEvent)
			el.attachEvent("on" + ev, fn);
		else if (el.addEventListener)
			el.addEventListener(ev, fn, false);
	}

	// Cross-browser (IE6+) way to remove event handlers
	function myDetachEvent(el, ev, fn) {
		if (el.detachEvent)
			el.detachEvent("on" + ev, fn);
		else if (el.removeEventListener)
			el.removeEventListener(ev, fn);
	}

	// Initialize the awesome
	function initInternal() {
		myAttachEvent(document, "mouseup", documentMouseUpHandler);
		enableInternal(true);
	}

	// Enable or disable autocomplete functionality
	function enableInternal(enabled) {
		if (enabled && !_enabled) {
			// Going from disabled to enabled
			clearKeyTimer();
			myAttachEvent(_control, "keyup", controlKeyUpHandler);
			myAttachEvent(_control, "keydown", controlKeyDownHandler);
			myAttachEvent(_control, "blur", controlBlurHandler);
			myAttachEvent(_control, "click", controlClickHandler);
		}
		else if (!enabled && _enabled) {
			// Going from enabled to disabled
			removePopup();
			myDetachEvent(_control, "keyup", controlKeyUpHandler);
			myDetachEvent(_control, "keydown", controlKeyDownHandler);
			myDetachEvent(_control, "blur", controlBlurHandler);
			myDetachEvent(_control, "click", controlClickHandler);
		}
		_enabled = enabled;
	}

	// Create the autocomplete popup
	function createPopup() {
		if (!_popup) {
			_popup = document.createElement("ul");
			_popup.className = "autocomplete-popup";
			// Size and position the popup appropriately
			_popup.style.top = _control.offsetTop + _control.offsetHeight + "px";
			_popup.style.left = _control.offsetLeft + "px";
			_popup.style.minWidth = _control.offsetWidth + "px";
			myAttachEvent(_popup, "mouseup", autocompleteMouseUpHandler);
			myAttachEvent(_popup, "mouseover", autocompleteMouseOverHandler);
			myAttachEvent(_popup, "mouseout", autocompleteMouseOutHandler);
			callback("opening", _popup);
			_control.offsetParent.appendChild(_popup);
		}
		_selectedIndex = -1;
	}

	// Set the content on the autocomplete popup
	function setPopup(content) {
		if (!content) {
			removePopup();
		} else {
			createPopup();
			_popup.innerHTML = content;
			callback("opened", _popup);
		}
	}

	// Remove the autocomplete popup
	function removePopup() {
		clearKeyTimer();
		clearMouseTimer();
		if (_popup) {
			callback("closing", _popup);
			_popup.parentElement.removeChild(_popup);
			callback("closed", _popup);
			_popup = null;
		}
	}

	// Set the selected autocomplete item to be number n
	function setSelected(n) {
		if (_popup && _enabled && _selectedIndex != n) {
			var items = _popup.children;
			for (var i = 0, len = items.length; i < len; i++) {
				var item = items[i];
				if (i == n && item.className !== "selected") {
					item.className = "selected";
				}
				else if (item.className === "selected") {
					item.className = "";
				}
			}
			_selectedIndex = n;
		}
	}

	// Move the selected autocomplete item forward (down) by c items
	// Handles wrapping round and starting again at the other end
	function moveSelected(c) {
		if (_popup) {
			var n = _selectedIndex + c;
			var items = _popup.children;
			if (n < 0) n = items.length - 1;
			else if (n >= items.length) n = 0;
			setSelected(n);
		}
	}

	function clearKeyTimer() {
		if (_keyTimer) {
			window.clearTimeout(_keyTimer);
			_keyTimer = null;
		}
	}

	function resetKeyTimer() {
		clearKeyTimer();
		if (_enabled) {
			_keyTimer = window.setTimeout(keyTimerTick, _keyTimeout);
		}
	}

	// The key press timer has run out
	function keyTimerTick() {
		_keyTimer = null;
		if (_enabled) {
			if (_control.value && _control.value.length && _control.value.length >= _minLength) {
				// We have enough to do a search now
				var text = _control.value;
				if (text != _lastSearch) {
					// If we search for multiple words then we only want suggestions for the last one
					// ... so we need a prefix and a suffix
					var prefix = text.replace(/[ ]+$/, ""); // remove trailing spaces
					var suffix = text;
					var index = prefix.lastIndexOf(" ");
					if (index >= 0) {
						suffix = prefix.substr(index + 1);
						prefix = prefix.substr(0, index + 1);
					} else {
						prefix = "";
					}

					// Autocomplete on just the last word
					_cps.autocomplete(suffix.toLocaleLowerCase ? suffix.toLocaleLowerCase() : suffix.toLowerCase())
						.done(function (data) {
							var html = [];
							var re = new RegExp(suffix);
							if (data.suggestions && data.suggestions.length) {
								// Build suggestions with our prefix and the suggestion
								for (var i = 0, len = data.suggestions.length; i < len; i++) {
									var s = data.suggestions[i];
									html.push("<li><a href=\"#\" data-text=\"" + escape(prefix + s) + "\">" + s.replace(re, _highlightStart + prefix + suffix + _highlightEnd) + "</a></li>");
								}
							}
							// Record the last result to save time later
							_lastResult = html.join("");
							setPopup(_lastResult);
						});
					_lastSearch = text;
				}
			} else {
				// Too short, or no value, so clear the popup
				removePopup();
			}
		}
	}

	function autocompleteMouseUpHandler(event) {
		var e = event.target || event.srcElement;
		if (e) {
			while (e && e.tagName && e.tagName != "A") e = e.parentElement;
			var text = getData(e);
			removePopup();
			if (text) callback("selected", text);
		}
		event.cancelBubble = true;
		event.returnValue = false;
		return false;
	}

	function autocompleteMouseOverHandler() {
		clearMouseTimer();
	}

	function autocompleteMouseOutHandler() {
		resetMouseTimer();
	}

	function clearMouseTimer() {
		if (_mouseTimer) {
			window.clearTimeout(_mouseTimer);
			_mouseTimer = null;
		}
	}

	function resetMouseTimer() {
		clearMouseTimer();
		if (_enabled) {
			_mouseTimer = window.setTimeout(mouseTimerTick, _mouseTimeout);
		}
	}

	// The mouse movement timer expired, so we can remove the popup now
	function mouseTimerTick() {
		removePopup();
	}

	function controlBlurHandler() {
		// TODO: how much time is enough to leave before we can remove the popup?
		window.setTimeout(function () { removePopup(); }, 100);
	}

	function controlClickHandler(event) {
		if (!_popup && _control.value == _lastSearch && _lastResult) {
			// Redisplay the last result, for if the popup had closed and they want to reopen
			_selectedIndex = -1;
			setPopup(_lastResult);
			if (event.cancelable) event.preventDefault(true);
			return false;
		}
	}

	function controlKeyUpHandler(event) {
		if (event.keyCode !== 13 && event.keyCode !== 40 && event.keyCode !== 38 && event.keyCode !== 27) {
			resetKeyTimer();
		}
	}

	function controlKeyDownHandler(event) {
		if (event.keyCode === 40) {
			// Cursor down
			if (!_popup && _control.value == _lastSearch && _lastResult) {
				// Redisplay the last result, for if the popup had closed and they want to reopen
				_selectedIndex = -1;
				setPopup(_lastResult);
			} else {
				moveSelected(1);
			}
		}
		else if (event.keyCode === 38) {
			// Cursor up
			moveSelected(-1);
		}
		else if (event.keyCode === 27 && _popup) {
			// Escape
			removePopup();
			if (event.cancelable) event.preventDefault(true);
			return false;
		}
		else if (event.keyCode === 13) {
			// Return
			if (_popup && _selectedIndex >= 0) {
				var items = _popup.children;
				for (var i = 0, len = items.length; i < len; i++) {
					if (items[i].className === "selected") {
						var text = getData(items[i].children[0]);
						callback("selected", text);
					}
				}
				removePopup();
			}
		}
	}

	function documentMouseUpHandler() {
		// The user released the mouse button, so we can close the popup
		if (_popup) {
			removePopup();
		}
	}

	// Helper to get the data-text attribute value from the chosen control
	function getData(el) {
		return unescape(el.getAttribute("data-text"));
	}

	// Helper to call a callback function
	function callback(callbackName, data) {
		var cb = _callbacks[callbackName];
		if (cb && cb.call) cb.call(cb, data);
	}

	// Getters and setters would be nice, but in the meantime...
	this.collection = function (value) { if (value !== undefined) _cps.collection(value); return _cps.collection(); };
	this.popup = function () { return _popup; }

	/// <summary>
	/// Initialize the autocomplete functionality, and enable it
	/// </summary>
	/// <param name="control">The control that will receive the autocomplete functionality extension</param>
	/// <param name="options">An options object containing parameters for the autocomplete functionality</param>
	this.init = function (control, options) {
		parseArguments(control, options);
		initInternal();
	};
	/// <summary>
	/// Enable the autocomplete functionality
	/// </summary>
	/// <param name="enabled">True (default) to enable autocomplete, or false to disable</param>
	this.enable = function(enabled) {
		if (enabled != null && enabled !== undefined)
			enableInternal(enabled);
		else
			enableInternal(true);
	};
	/// <summary>
	/// Disable the autocomplete functionality
	/// </summary>
	this.disable = function() {
		enableInternal(false);
	};
	/// <summary>
	/// Hide the autocomplete popup if it is displayed
	/// </summary>
	this.hide = function () {
		removePopup();
	}
}