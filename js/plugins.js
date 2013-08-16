// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function noop() {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

// Place any jQuery/helper plugins in here.
/*!     * jQuery Form Plugin * version: 2.87 (20-OCT-2011) * @requires jQuery v1.3.2 or later *
 * Examples and documentation at: http://malsup.com/jquery/form/ * Dual licensed under the MIT and GPL licenses: *   http://www.opensource.org/licenses/mit-license.php                                                                                  *   http://www.gnu.org/licenses/gpl.html        */
;(function($) {
	/*
	 Usage Note:
	 -----------
	 Do not use both ajaxSubmit and ajaxForm on the same form.  These
	 functions are intended to be exclusive.  Use ajaxSubmit if you want
	 to bind your own submit handler to the form.  For example,

	 $(document).ready(function() {
	 $('#myForm').bind('submit', function(e) {
	 e.preventDefault(); // <-- important
	 $(this).ajaxSubmit({
	 target: '#output'
	 });
	 });
	 });

	 Use ajaxForm when you want the plugin to manage all the event binding
	 for you.  For example,

	 $(document).ready(function() {
	 $('#myForm').ajaxForm({
	 target: '#output'
	 });
	 });

	 When using ajaxForm, the ajaxSubmit function will be invoked for you
	 at the appropriate time.
	 */

	/**
	 * ajaxSubmit() provides a mechanism for immediately submitting
	 * an HTML form using AJAX.
	 */
	$.fn.ajaxSubmit = function(options) {
		// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
		if (!this.length) {
			log('ajaxSubmit: skipping submit process - no element selected');
			return this;
		}

		var method, action, url, $form = this;

		if (typeof options == 'function') {
			options = { success: options };
		}

		method = this.attr('method');
		action = this.attr('action');
		url = (typeof action === 'string') ? $.trim(action) : '';
		url = url || window.location.href || '';
		if (url) {
			// clean url (don't include hash vaue)
			url = (url.match(/^([^#]+)/)||[])[1];
		}

		options = $.extend(true, {
			url:  url,
			success: $.ajaxSettings.success,
			type: method || 'GET',
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
		}, options);

		// hook for manipulating the form data before it is extracted;
		// convenient for use with rich editors like tinyMCE or FCKEditor
		var veto = {};
		this.trigger('form-pre-serialize', [this, options, veto]);
		if (veto.veto) {
			log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
			return this;
		}

		// provide opportunity to alter form data before it is serialized
		if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
			log('ajaxSubmit: submit aborted via beforeSerialize callback');
			return this;
		}

		var traditional = options.traditional;
		if ( traditional === undefined ) {
			traditional = $.ajaxSettings.traditional;
		}

		var qx,n,v,a = this.formToArray(options.semantic);
		if (options.data) {
			options.extraData = options.data;
			qx = $.param(options.data, traditional);
		}

		// give pre-submit callback an opportunity to abort the submit
		if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
			log('ajaxSubmit: submit aborted via beforeSubmit callback');
			return this;
		}

		// fire vetoable 'validate' event
		this.trigger('form-submit-validate', [a, this, options, veto]);
		if (veto.veto) {
			log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
			return this;
		}

		var q = $.param(a, traditional);
		if (qx)
			q = ( q ? (q + '&' + qx) : qx );

		if (options.type.toUpperCase() == 'GET') {
			options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
			options.data = null;  // data is null for 'get'
		}
		else {
			options.data = q; // data is the query string for 'post'
		}

		var callbacks = [];
		if (options.resetForm) {
			callbacks.push(function() { $form.resetForm(); });
		}
		if (options.clearForm) {
			callbacks.push(function() { $form.clearForm(options.includeHidden); });
		}

		// perform a load on the target only if dataType is not provided
		if (!options.dataType && options.target) {
			var oldSuccess = options.success || function(){};
			callbacks.push(function(data) {
				var fn = options.replaceTarget ? 'replaceWith' : 'html';
				$(options.target)[fn](data).each(oldSuccess, arguments);
			});
		}
		else if (options.success) {
			callbacks.push(options.success);
		}

		options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
			var context = options.context || options;   // jQuery 1.4+ supports scope context
			for (var i=0, max=callbacks.length; i < max; i++) {
				callbacks[i].apply(context, [data, status, xhr || $form, $form]);
			}
		};

		// are there files to upload?
		var fileInputs = $('input:file', this).length > 0;
		var mp = 'multipart/form-data';
		var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

		// options.iframe allows user to force iframe mode
		// 06-NOV-09: now defaulting to iframe mode if file input is detected
		if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
			// hack to fix Safari hang (thanks to Tim Molendijk for this)
			// see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
			if (options.closeKeepAlive) {
				$.get(options.closeKeepAlive, function() { fileUpload(a); });
			}
			else {
				fileUpload(a);
			}
		}
		else {
			// IE7 massage (see issue 57)
			if ($.browser.msie && method == 'get' && typeof options.type === "undefined") {
				var ieMeth = $form[0].getAttribute('method');
				if (typeof ieMeth === 'string')
					options.type = ieMeth;
			}
			$.ajax(options);
		}

		// fire 'notify' event
		this.trigger('form-submit-notify', [this, options]);
		return this;


		// private function for handling file uploads (hat tip to YAHOO!)
		function fileUpload(a) {
			var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
			var useProp = !!$.fn.prop;

			if (a) {
				if ( useProp ) {
					// ensure that every serialized input is still enabled
					for (i=0; i < a.length; i++) {
						el = $(form[a[i].name]);
						el.prop('disabled', false);
					}
				} else {
					for (i=0; i < a.length; i++) {
						el = $(form[a[i].name]);
						el.removeAttr('disabled');
					}
				};
			}

			if ($(':input[name=submit],:input[id=submit]', form).length) {
				// if there is an input with a name or id of 'submit' then we won't be
				// able to invoke the submit fn on the form (at least not x-browser)
				alert('Error: Form elements must not have name or id of "submit".');
				return;
			}

			s = $.extend(true, {}, $.ajaxSettings, options);
			s.context = s.context || s;
			id = 'jqFormIO' + (new Date().getTime());
			if (s.iframeTarget) {
				$io = $(s.iframeTarget);
				n = $io.attr('name');
				if (n == null)
					$io.attr('name', id);
				else
					id = n;
			}
			else {
				$io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
				$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
			}
			io = $io[0];


			xhr = { // mock object
				aborted: 0,
				responseText: null,
				responseXML: null,
				status: 0,
				statusText: 'n/a',
				getAllResponseHeaders: function() {},
				getResponseHeader: function() {},
				setRequestHeader: function() {},
				abort: function(status) {
					var e = (status === 'timeout' ? 'timeout' : 'aborted');
					log('aborting upload... ' + e);
					this.aborted = 1;
					$io.attr('src', s.iframeSrc); // abort op in progress
					xhr.error = e;
					s.error && s.error.call(s.context, xhr, e, status);
					g && $.event.trigger("ajaxError", [xhr, s, e]);
					s.complete && s.complete.call(s.context, xhr, e);
				}
			};

			g = s.global;
			// trigger ajax global events so that activity/block indicators work like normal
			if (g && ! $.active++) {
				$.event.trigger("ajaxStart");
			}
			if (g) {
				$.event.trigger("ajaxSend", [xhr, s]);
			}

			if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
				if (s.global) {
					$.active--;
				}
				return;
			}
			if (xhr.aborted) {
				return;
			}

			// add submitting element to data if we know it
			sub = form.clk;
			if (sub) {
				n = sub.name;
				if (n && !sub.disabled) {
					s.extraData = s.extraData || {};
					s.extraData[n] = sub.value;
					if (sub.type == "image") {
						s.extraData[n+'.x'] = form.clk_x;
						s.extraData[n+'.y'] = form.clk_y;
					}
				}
			}

			var CLIENT_TIMEOUT_ABORT = 1;
			var SERVER_ABORT = 2;

			function getDoc(frame) {
				var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
				return doc;
			}

			// take a breath so that pending repaints get some cpu time before the upload starts
			function doSubmit() {
				// make sure form attrs are set
				var t = $form.attr('target'), a = $form.attr('action');

				// update form attrs in IE friendly way
				form.setAttribute('target',id);
				if (!method) {
					form.setAttribute('method', 'POST');
				}
				if (a != s.url) {
					form.setAttribute('action', s.url);
				}

				// ie borks in some cases when setting encoding
				if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
					$form.attr({
						encoding: 'multipart/form-data',
						enctype:  'multipart/form-data'
					});
				}

				// support timout
				if (s.timeout) {
					timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
				}

				// look for server aborts
				function checkState() {
					try {
						var state = getDoc(io).readyState;
						log('state = ' + state);
						if (state.toLowerCase() == 'uninitialized')
							setTimeout(checkState,50);
					}
					catch(e) {
						log('Server abort: ' , e, ' (', e.name, ')');
						cb(SERVER_ABORT);
						timeoutHandle && clearTimeout(timeoutHandle);
						timeoutHandle = undefined;
					}
				}

				// add "extra" data to form if provided in options
				var extraInputs = [];
				try {
					if (s.extraData) {
						for (var n in s.extraData) {
							extraInputs.push(
								$('<input type="hidden" name="'+n+'" />').attr('value',s.extraData[n])
									.appendTo(form)[0]);
						}
					}

					if (!s.iframeTarget) {
						// add iframe to doc and submit the form
						$io.appendTo('body');
						io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
					}
					setTimeout(checkState,15);
					form.submit();
				}
				finally {
					// reset attrs and remove "extra" input elements
					form.setAttribute('action',a);
					if(t) {
						form.setAttribute('target', t);
					} else {
						$form.removeAttr('target');
					}
					$(extraInputs).remove();
				}
			}

			if (s.forceSync) {
				doSubmit();
			}
			else {
				setTimeout(doSubmit, 10); // this lets dom updates render
			}

			var data, doc, domCheckCount = 50, callbackProcessed;

			function cb(e) {
				if (xhr.aborted || callbackProcessed) {
					return;
				}
				try {
					doc = getDoc(io);
				}
				catch(ex) {
					log('cannot access response document: ', ex);
					e = SERVER_ABORT;
				}
				if (e === CLIENT_TIMEOUT_ABORT && xhr) {
					xhr.abort('timeout');
					return;
				}
				else if (e == SERVER_ABORT && xhr) {
					xhr.abort('server abort');
					return;
				}

				if (!doc || doc.location.href == s.iframeSrc) {
					// response not received yet
					if (!timedOut)
						return;
				}
				io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

				var status = 'success', errMsg;
				try {
					if (timedOut) {
						throw 'timeout';
					}

					var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
					log('isXml='+isXml);
					if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
						if (--domCheckCount) {
							// in some browsers (Opera) the iframe DOM is not always traversable when
							// the onload callback fires, so we loop a bit to accommodate
							log('requeing onLoad callback, DOM not available');
							setTimeout(cb, 250);
							return;
						}
						// let this fall through because server response could be an empty document
						//log('Could not access iframe DOM after mutiple tries.');
						//throw 'DOMException: not available';
					}

					//log('response detected');
					var docRoot = doc.body ? doc.body : doc.documentElement;
					xhr.responseText = docRoot ? docRoot.innerHTML : null;
					xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
					if (isXml)
						s.dataType = 'xml';
					xhr.getResponseHeader = function(header){
						var headers = {'content-type': s.dataType};
						return headers[header];
					};
					// support for XHR 'status' & 'statusText' emulation :
					if (docRoot) {
						xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
						xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
					}

					var dt = (s.dataType || '').toLowerCase();
					var scr = /(json|script|text)/.test(dt);
					if (scr || s.textarea) {
						// see if user embedded response in textarea
						var ta = doc.getElementsByTagName('textarea')[0];
						if (ta) {
							xhr.responseText = ta.value;
							// support for XHR 'status' & 'statusText' emulation :
							xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
							xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
						}
						else if (scr) {
							// account for browsers injecting pre around json response
							var pre = doc.getElementsByTagName('pre')[0];
							var b = doc.getElementsByTagName('body')[0];
							if (pre) {
								xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
							}
							else if (b) {
								xhr.responseText = b.textContent ? b.textContent : b.innerText;
							}
						}
					}
					else if (dt == 'xml' && !xhr.responseXML && xhr.responseText != null) {
						xhr.responseXML = toXml(xhr.responseText);
					}

					try {
						data = httpData(xhr, dt, s);
					}
					catch (e) {
						status = 'parsererror';
						xhr.error = errMsg = (e || status);
					}
				}
				catch (e) {
					log('error caught: ',e);
					status = 'error';
					xhr.error = errMsg = (e || status);
				}

				if (xhr.aborted) {
					log('upload aborted');
					status = null;
				}

				if (xhr.status) { // we've set xhr.status
					status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
				}

				// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
				if (status === 'success') {
					s.success && s.success.call(s.context, data, 'success', xhr);
					g && $.event.trigger("ajaxSuccess", [xhr, s]);
				}
				else if (status) {
					if (errMsg == undefined)
						errMsg = xhr.statusText;
					s.error && s.error.call(s.context, xhr, status, errMsg);
					g && $.event.trigger("ajaxError", [xhr, s, errMsg]);
				}

				g && $.event.trigger("ajaxComplete", [xhr, s]);

				if (g && ! --$.active) {
					$.event.trigger("ajaxStop");
				}

				s.complete && s.complete.call(s.context, xhr, status);

				callbackProcessed = true;
				if (s.timeout)
					clearTimeout(timeoutHandle);

				// clean up
				setTimeout(function() {
					if (!s.iframeTarget)
						$io.remove();
					xhr.responseXML = null;
				}, 100);
			}

			var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
				if (window.ActiveXObject) {
					doc = new ActiveXObject('Microsoft.XMLDOM');
					doc.async = 'false';
					doc.loadXML(s);
				}
				else {
					doc = (new DOMParser()).parseFromString(s, 'text/xml');
				}
				return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
			};
			var parseJSON = $.parseJSON || function(s) {
				return window['eval']('(' + s + ')');
			};

			var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

				var ct = xhr.getResponseHeader('content-type') || '',
					xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
					data = xml ? xhr.responseXML : xhr.responseText;

				if (xml && data.documentElement.nodeName === 'parsererror') {
					$.error && $.error('parsererror');
				}
				if (s && s.dataFilter) {
					data = s.dataFilter(data, type);
				}
				if (typeof data === 'string') {
					if (type === 'json' || !type && ct.indexOf('json') >= 0) {
						data = parseJSON(data);
					} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
						$.globalEval(data);
					}
				}
				return data;
			};
		}
	};

	/**
	 * ajaxForm() provides a mechanism for fully automating form submission.
	 *
	 * The advantages of using this method instead of ajaxSubmit() are:
	 *
	 * 1: This method will include coordinates for <input type="image" /> elements (if the element
	 *	is used to submit the form).
	 * 2. This method will include the submit element's name/value data (for the element that was
	 *	used to submit the form).
	 * 3. This method binds the submit() method to the form for you.
	 *
	 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
	 * passes the options argument along after properly binding events for submit elements and
	 * the form itself.
	 */
	$.fn.ajaxForm = function(options) {
		// in jQuery 1.3+ we can fix mistakes with the ready state
		if (this.length === 0) {
			var o = { s: this.selector, c: this.context };
			if (!$.isReady && o.s) {
				log('DOM not ready, queuing ajaxForm');
				$(function() {
					$(o.s,o.c).ajaxForm(options);
				});
				return this;
			}
			// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
			log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
			return this;
		}

		return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
			if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
				e.preventDefault();
				$(this).ajaxSubmit(options);
			}
		}).bind('click.form-plugin', function(e) {
				var target = e.target;
				var $el = $(target);
				if (!($el.is(":submit,input:image"))) {
					// is this a child element of the submit el?  (ex: a span within a button)
					var t = $el.closest(':submit');
					if (t.length == 0) {
						return;
					}
					target = t[0];
				}
				var form = this;
				form.clk = target;
				if (target.type == 'image') {
					if (e.offsetX != undefined) {
						form.clk_x = e.offsetX;
						form.clk_y = e.offsetY;
					} else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
						var offset = $el.offset();
						form.clk_x = e.pageX - offset.left;
						form.clk_y = e.pageY - offset.top;
					} else {
						form.clk_x = e.pageX - target.offsetLeft;
						form.clk_y = e.pageY - target.offsetTop;
					}
				}
				// clear form vars
				setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
			});
	};

	// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
	$.fn.ajaxFormUnbind = function() {
		return this.unbind('submit.form-plugin click.form-plugin');
	};

	/**
	 * formToArray() gathers form element data into an array of objects that can
	 * be passed to any of the following ajax functions: $.get, $.post, or load.
	 * Each object in the array has both a 'name' and 'value' property.  An example of
	 * an array for a simple login form might be:
	 *
	 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
	 *
	 * It is this array that is passed to pre-submit callback functions provided to the
	 * ajaxSubmit() and ajaxForm() methods.
	 */
	$.fn.formToArray = function(semantic) {
		var a = [];
		if (this.length === 0) {
			return a;
		}

		var form = this[0];
		var els = semantic ? form.getElementsByTagName('*') : form.elements;
		if (!els) {
			return a;
		}

		var i,j,n,v,el,max,jmax;
		for(i=0, max=els.length; i < max; i++) {
			el = els[i];
			n = el.name;
			if (!n) {
				continue;
			}

			if (semantic && form.clk && el.type == "image") {
				// handle image inputs on the fly when semantic == true
				if(!el.disabled && form.clk == el) {
					a.push({name: n, value: $(el).val()});
					a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
				}
				continue;
			}

			v = $.fieldValue(el, true);
			if (v && v.constructor == Array) {
				for(j=0, jmax=v.length; j < jmax; j++) {
					a.push({name: n, value: v[j]});
				}
			}
			else if (v !== null && typeof v != 'undefined') {
				a.push({name: n, value: v});
			}
		}

		if (!semantic && form.clk) {
			// input type=='image' are not found in elements array! handle it here
			var $input = $(form.clk), input = $input[0];
			n = input.name;
			if (n && !input.disabled && input.type == 'image') {
				a.push({name: n, value: $input.val()});
				a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
			}
		}
		return a;
	};

	/**
	 * Serializes form data into a 'submittable' string. This method will return a string
	 * in the format: name1=value1&amp;name2=value2
	 */
	$.fn.formSerialize = function(semantic) {
		//hand off to jQuery.param for proper encoding
		return $.param(this.formToArray(semantic));
	};

	/**
	 * Serializes all field elements in the jQuery object into a query string.
	 * This method will return a string in the format: name1=value1&amp;name2=value2
	 */
	$.fn.fieldSerialize = function(successful) {
		var a = [];
		this.each(function() {
			var n = this.name;
			if (!n) {
				return;
			}
			var v = $.fieldValue(this, successful);
			if (v && v.constructor == Array) {
				for (var i=0,max=v.length; i < max; i++) {
					a.push({name: n, value: v[i]});
				}
			}
			else if (v !== null && typeof v != 'undefined') {
				a.push({name: this.name, value: v});
			}
		});
		//hand off to jQuery.param for proper encoding
		return $.param(a);
	};

	/**
	 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
	 *
	 *  <form><fieldset>
	 *	  <input name="A" type="text" />
	 *	  <input name="A" type="text" />
	 *	  <input name="B" type="checkbox" value="B1" />
	 *	  <input name="B" type="checkbox" value="B2"/>
	 *	  <input name="C" type="radio" value="C1" />
	 *	  <input name="C" type="radio" value="C2" />
	 *  </fieldset></form>
	 *
	 *  var v = $(':text').fieldValue();
	 *  // if no values are entered into the text inputs
	 *  v == ['','']
	 *  // if values entered into the text inputs are 'foo' and 'bar'
	 *  v == ['foo','bar']
	 *
	 *  var v = $(':checkbox').fieldValue();
	 *  // if neither checkbox is checked
	 *  v === undefined
	 *  // if both checkboxes are checked
	 *  v == ['B1', 'B2']
	 *
	 *  var v = $(':radio').fieldValue();
	 *  // if neither radio is checked
	 *  v === undefined
	 *  // if first radio is checked
	 *  v == ['C1']
	 *
	 * The successful argument controls whether or not the field element must be 'successful'
	 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
	 * The default value of the successful argument is true.  If this value is false the value(s)
	 * for each element is returned.
	 *
	 * Note: This method *always* returns an array.  If no valid value can be determined the
	 *	   array will be empty, otherwise it will contain one or more values.
	 */
	$.fn.fieldValue = function(successful) {
		for (var val=[], i=0, max=this.length; i < max; i++) {
			var el = this[i];
			var v = $.fieldValue(el, successful);
			if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
				continue;
			}
			v.constructor == Array ? $.merge(val, v) : val.push(v);
		}
		return val;
	};

	/**
	 * Returns the value of the field element.
	 */
	$.fieldValue = function(el, successful) {
		var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
		if (successful === undefined) {
			successful = true;
		}

		if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
			(t == 'checkbox' || t == 'radio') && !el.checked ||
			(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
			tag == 'select' && el.selectedIndex == -1)) {
			return null;
		}

		if (tag == 'select') {
			var index = el.selectedIndex;
			if (index < 0) {
				return null;
			}
			var a = [], ops = el.options;
			var one = (t == 'select-one');
			var max = (one ? index+1 : ops.length);
			for(var i=(one ? index : 0); i < max; i++) {
				var op = ops[i];
				if (op.selected) {
					var v = op.value;
					if (!v) { // extra pain for IE...
						v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
					}
					if (one) {
						return v;
					}
					a.push(v);
				}
			}
			return a;
		}
		return $(el).val();
	};

	/**
	 * Clears the form data.  Takes the following actions on the form's input fields:
	 *  - input text fields will have their 'value' property set to the empty string
	 *  - select elements will have their 'selectedIndex' property set to -1
	 *  - checkbox and radio inputs will have their 'checked' property set to false
	 *  - inputs of type submit, button, reset, and hidden will *not* be effected
	 *  - button elements will *not* be effected
	 */
	$.fn.clearForm = function(includeHidden) {
		return this.each(function() {
			$('input,select,textarea', this).clearFields(includeHidden);
		});
	};

	/**
	 * Clears the selected form elements.
	 */
	$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
		var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
		return this.each(function() {
			var t = this.type, tag = this.tagName.toLowerCase();
			if (re.test(t) || tag == 'textarea' || (includeHidden && /hidden/.test(t)) ) {
				this.value = '';
			}
			else if (t == 'checkbox' || t == 'radio') {
				this.checked = false;
			}
			else if (tag == 'select') {
					this.selectedIndex = -1;
				}
		});
	};

	/**
	 * Resets the form data.  Causes all form elements to be reset to their original value.
	 */
	$.fn.resetForm = function() {
		return this.each(function() {
			// guard against an input with the name of 'reset'
			// note that IE reports the reset function as an 'object'
			if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
				this.reset();
			}
		});
	};

	/**
	 * Enables or disables any matching elements.
	 */
	$.fn.enable = function(b) {
		if (b === undefined) {
			b = true;
		}
		return this.each(function() {
			this.disabled = !b;
		});
	};

	/**
	 * Checks/unchecks any matching checkboxes or radio buttons and
	 * selects/deselects and matching option elements.
	 */
	$.fn.selected = function(select) {
		if (select === undefined) {
			select = true;
		}
		return this.each(function() {
			var t = this.type;
			if (t == 'checkbox' || t == 'radio') {
				this.checked = select;
			}
			else if (this.tagName.toLowerCase() == 'option') {
				var $sel = $(this).parent('select');
				if (select && $sel[0] && $sel[0].type == 'select-one') {
					// deselect all other options
					$sel.find('option').selected(false);
				}
				this.selected = select;
			}
		});
	};

	// expose debug var
	$.fn.ajaxSubmit.debug = false;

	// helper fn for console logging
	function log() {
		if (!$.fn.ajaxSubmit.debug)
			return;
		var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
		if (window.console && window.console.log) {
			window.console.log(msg);
		}
		else if (window.opera && window.opera.postError) {
			window.opera.postError(msg);
		}
	};

})(jQuery);


/*! jQuery Validation Plugin - v1.10.0 - 9/7/2012   * https://github.com/jzaefferer/jquery-validation * Copyright (c) 2012 Jörn Zaefferer; Licensed MIT, GPL */
(function($) {

	$.extend($.fn, {
		// http://docs.jquery.com/Plugins/Validation/validate
		validate: function( options ) {

			// if nothing is selected, return nothing; can't chain anyway
			if (!this.length) {
				if (options && options.debug && window.console) {
					console.warn( "nothing selected, can't validate, returning nothing" );
				}
				return;
			}

			// check if a validator for this form was already created
			var validator = $.data(this[0], 'validator');
			if ( validator ) {
				return validator;
			}

			// Add novalidate tag if HTML5.
			this.attr('novalidate', 'novalidate');

			validator = new $.validator( options, this[0] );
			$.data(this[0], 'validator', validator);

			if ( validator.settings.onsubmit ) {

				this.validateDelegate( ":submit", "click", function(ev) {
					if ( validator.settings.submitHandler ) {
						validator.submitButton = ev.target;
					}
					// allow suppressing validation by adding a cancel class to the submit button
					if ( $(ev.target).hasClass('cancel') ) {
						validator.cancelSubmit = true;
					}
				});

				// validate the form on submit
				this.submit( function( event ) {
					if ( validator.settings.debug ) {
						// prevent form submit to be able to see console output
						event.preventDefault();
					}
					function handle() {
						var hidden;
						if ( validator.settings.submitHandler ) {
							if (validator.submitButton) {
								// insert a hidden input as a replacement for the missing submit button
								hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
							}
							validator.settings.submitHandler.call( validator, validator.currentForm, event );
							if (validator.submitButton) {
								// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
								hidden.remove();
							}
							return false;
						}
						return true;
					}

					// prevent submit for invalid forms or custom submit handlers
					if ( validator.cancelSubmit ) {
						validator.cancelSubmit = false;
						return handle();
					}
					if ( validator.form() ) {
						if ( validator.pendingRequest ) {
							validator.formSubmitted = true;
							return false;
						}
						return handle();
					} else {
						validator.focusInvalid();
						return false;
					}
				});
			}

			return validator;
		},
		// http://docs.jquery.com/Plugins/Validation/valid
		valid: function() {
			if ( $(this[0]).is('form')) {
				return this.validate().form();
			} else {
				var valid = true;
				var validator = $(this[0].form).validate();
				this.each(function() {
					valid &= validator.element(this);
				});
				return valid;
			}
		},
		// attributes: space seperated list of attributes to retrieve and remove
		removeAttrs: function(attributes) {
			var result = {},
				$element = this;
			$.each(attributes.split(/\s/), function(index, value) {
				result[value] = $element.attr(value);
				$element.removeAttr(value);
			});
			return result;
		},
		// http://docs.jquery.com/Plugins/Validation/rules
		rules: function(command, argument) {
			var element = this[0];

			if (command) {
				var settings = $.data(element.form, 'validator').settings;
				var staticRules = settings.rules;
				var existingRules = $.validator.staticRules(element);
				switch(command) {
				case "add":
					$.extend(existingRules, $.validator.normalizeRule(argument));
					staticRules[element.name] = existingRules;
					if (argument.messages) {
						settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
					}
					break;
				case "remove":
					if (!argument) {
						delete staticRules[element.name];
						return existingRules;
					}
					var filtered = {};
					$.each(argument.split(/\s/), function(index, method) {
						filtered[method] = existingRules[method];
						delete existingRules[method];
					});
					return filtered;
				}
			}

			var data = $.validator.normalizeRules(
				$.extend(
					{},
					$.validator.metadataRules(element),
					$.validator.classRules(element),
					$.validator.attributeRules(element),
					$.validator.staticRules(element)
				), element);

			// make sure required is at front
			if (data.required) {
				var param = data.required;
				delete data.required;
				data = $.extend({required: param}, data);
			}

			return data;
		}
	});

	// Custom selectors
	$.extend($.expr[":"], {
		// http://docs.jquery.com/Plugins/Validation/blank
		blank: function(a) {return !$.trim("" + a.value);},
		// http://docs.jquery.com/Plugins/Validation/filled
		filled: function(a) {return !!$.trim("" + a.value);},
		// http://docs.jquery.com/Plugins/Validation/unchecked
		unchecked: function(a) {return !a.checked;}
	});

	// constructor for validator
	$.validator = function( options, form ) {
		this.settings = $.extend( true, {}, $.validator.defaults, options );
		this.currentForm = form;
		this.init();
	};

	$.validator.format = function(source, params) {
		if ( arguments.length === 1 ) {
			return function() {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.validator.format.apply( this, args );
			};
		}
		if ( arguments.length > 2 && params.constructor !== Array  ) {
			params = $.makeArray(arguments).slice(1);
		}
		if ( params.constructor !== Array ) {
			params = [ params ];
		}
		$.each(params, function(i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
		});
		return source;
	};

	$.extend($.validator, {

		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			validClass: "valid",
			errorElement: "label",
			focusInvalid: true,
			errorContainer: $( [] ),
			errorLabelContainer: $( [] ),
			onsubmit: true,
			ignore: ":hidden",
			ignoreTitle: false,
			onfocusin: function(element, event) {
				this.lastActive = element;

				// hide error label and remove error class on focus if enabled
				if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
					if ( this.settings.unhighlight ) {
						this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
					}
					this.addWrapper(this.errorsFor(element)).hide();
				}
			},
			onfocusout: function(element, event) {
				if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
					this.element(element);
				}
			},
			onkeyup: function(element, event) {
				if ( event.which === 9 && this.elementValue(element) === '' ) {
					return;
				} else if ( element.name in this.submitted || element === this.lastActive ) {
					this.element(element);
				}
			},
			onclick: function(element, event) {
				// click on selects, radiobuttons and checkboxes
				if ( element.name in this.submitted ) {
					this.element(element);
				}
				// or option elements, check parent select in that case
				else if (element.parentNode.name in this.submitted) {
					this.element(element.parentNode);
				}
			},
			highlight: function(element, errorClass, validClass) {
				if (element.type === 'radio') {
					this.findByName(element.name).addClass(errorClass).removeClass(validClass);
				} else {
					$(element).addClass(errorClass).removeClass(validClass);
				}
			},
			unhighlight: function(element, errorClass, validClass) {
				if (element.type === 'radio') {
					this.findByName(element.name).removeClass(errorClass).addClass(validClass);
				} else {
					$(element).removeClass(errorClass).addClass(validClass);
				}
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
		setDefaults: function(settings) {
			$.extend( $.validator.defaults, settings );
		},

		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			maxlength: $.validator.format("Please enter no more than {0} characters."),
			minlength: $.validator.format("Please enter at least {0} characters."),
			rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
			range: $.validator.format("Please enter a value between {0} and {1}."),
			max: $.validator.format("Please enter a value less than or equal to {0}."),
			min: $.validator.format("Please enter a value greater than or equal to {0}.")
		},

		autoCreateRanges: false,

		prototype: {

			init: function() {
				this.labelContainer = $(this.settings.errorLabelContainer);
				this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
				this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
				this.submitted = {};
				this.valueCache = {};
				this.pendingRequest = 0;
				this.pending = {};
				this.invalid = {};
				this.reset();

				var groups = (this.groups = {});
				$.each(this.settings.groups, function(key, value) {
					$.each(value.split(/\s/), function(index, name) {
						groups[name] = key;
					});
				});
				var rules = this.settings.rules;
				$.each(rules, function(key, value) {
					rules[key] = $.validator.normalizeRule(value);
				});

				function delegate(event) {
					var validator = $.data(this[0].form, "validator"),
						eventType = "on" + event.type.replace(/^validate/, "");
					if (validator.settings[eventType]) {
						validator.settings[eventType].call(validator, this[0], event);
					}
				}
				$(this.currentForm)
					.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
						"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
						"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
						"[type='week'], [type='time'], [type='datetime-local'], " +
						"[type='range'], [type='color'] ",
						"focusin focusout keyup", delegate)
					.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

				if (this.settings.invalidHandler) {
					$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
				}
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/form
			form: function() {
				this.checkForm();
				$.extend(this.submitted, this.errorMap);
				this.invalid = $.extend({}, this.errorMap);
				if (!this.valid()) {
					$(this.currentForm).triggerHandler("invalid-form", [this]);
				}
				this.showErrors();
				return this.valid();
			},

			checkForm: function() {
				this.prepareForm();
				for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
					this.check( elements[i] );
				}
				return this.valid();
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/element
			element: function( element ) {
				element = this.validationTargetFor( this.clean( element ) );
				this.lastElement = element;
				this.prepareElement( element );
				this.currentElements = $(element);
				var result = this.check( element ) !== false;
				if (result) {
					delete this.invalid[element.name];
				} else {
					this.invalid[element.name] = true;
				}
				if ( !this.numberOfInvalids() ) {
					// Hide error containers on last error
					this.toHide = this.toHide.add( this.containers );
				}
				this.showErrors();
				return result;
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
			showErrors: function(errors) {
				if(errors) {
					// add items to error list and map
					$.extend( this.errorMap, errors );
					this.errorList = [];
					for ( var name in errors ) {
						this.errorList.push({
							message: errors[name],
							element: this.findByName(name)[0]
						});
					}
					// remove items from success list
					this.successList = $.grep( this.successList, function(element) {
						return !(element.name in errors);
					});
				}
				if (this.settings.showErrors) {
					this.settings.showErrors.call( this, this.errorMap, this.errorList );
				} else {
					this.defaultShowErrors();
				}
			},

			// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
			resetForm: function() {
				if ( $.fn.resetForm ) {
					$( this.currentForm ).resetForm();
				}
				this.submitted = {};
				this.lastElement = null;
				this.prepareForm();
				this.hideErrors();
				this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
			},

			numberOfInvalids: function() {
				return this.objectLength(this.invalid);
			},

			objectLength: function( obj ) {
				var count = 0;
				for ( var i in obj ) {
					count++;
				}
				return count;
			},

			hideErrors: function() {
				this.addWrapper( this.toHide ).hide();
			},

			valid: function() {
				return this.size() === 0;
			},

			size: function() {
				return this.errorList.length;
			},

			focusInvalid: function() {
				if( this.settings.focusInvalid ) {
					try {
						$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
							.filter(":visible")
							.focus()
							// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
							.trigger("focusin");
					} catch(e) {
						// ignore IE throwing errors when focusing hidden elements
					}
				}
			},

			findLastActive: function() {
				var lastActive = this.lastActive;
				return lastActive && $.grep(this.errorList, function(n) {
					return n.element.name === lastActive.name;
				}).length === 1 && lastActive;
			},

			elements: function() {
				var validator = this,
					rulesCache = {};

				// select all valid inputs inside the form (no submit or reset buttons)
				return $(this.currentForm)
					.find("input, select, textarea")
					.not(":submit, :reset, :image, [disabled]")
					.not( this.settings.ignore )
					.filter(function() {
						if ( !this.name && validator.settings.debug && window.console ) {
							console.error( "%o has no name assigned", this);
						}

						// select only the first element for each name, and only those with rules specified
						if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
							return false;
						}

						rulesCache[this.name] = true;
						return true;
					});
			},

			clean: function( selector ) {
				return $( selector )[0];
			},

			errors: function() {
				var errorClass = this.settings.errorClass.replace(' ', '.');
				return $( this.settings.errorElement + "." + errorClass, this.errorContext );
			},

			reset: function() {
				this.successList = [];
				this.errorList = [];
				this.errorMap = {};
				this.toShow = $([]);
				this.toHide = $([]);
				this.currentElements = $([]);
			},

			prepareForm: function() {
				this.reset();
				this.toHide = this.errors().add( this.containers );
			},

			prepareElement: function( element ) {
				this.reset();
				this.toHide = this.errorsFor(element);
			},

			elementValue: function( element ) {
				var type = $(element).attr('type'),
					val = $(element).val();

				if ( type === 'radio' || type === 'checkbox' ) {
					return $('input[name="' + $(element).attr('name') + '"]:checked').val();
				}

				if ( typeof val === 'string' ) {
					return val.replace(/\r/g, "");
				}
				return val;
			},

			check: function( element ) {
				element = this.validationTargetFor( this.clean( element ) );

				var rules = $(element).rules();
				var dependencyMismatch = false;
				var val = this.elementValue(element);
				var result;

				for (var method in rules ) {
					var rule = { method: method, parameters: rules[method] };
					try {

						result = $.validator.methods[method].call( this, val, element, rule.parameters );

						// if a method indicates that the field is optional and therefore valid,
						// don't mark it as valid when there are no other rules
						if ( result === "dependency-mismatch" ) {
							dependencyMismatch = true;
							continue;
						}
						dependencyMismatch = false;

						if ( result === "pending" ) {
							this.toHide = this.toHide.not( this.errorsFor(element) );
							return;
						}

						if( !result ) {
							this.formatAndAdd( element, rule );
							return false;
						}
					} catch(e) {
						if ( this.settings.debug && window.console ) {
							console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method", e);
						}
						throw e;
					}
				}
				if (dependencyMismatch) {
					return;
				}
				if ( this.objectLength(rules) ) {
					this.successList.push(element);
				}
				return true;
			},

			// return the custom message for the given element and validation method
			// specified in the element's "messages" metadata
			customMetaMessage: function(element, method) {
				if (!$.metadata) {
					return;
				}
				var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
				return meta && meta.messages && meta.messages[method];
			},

			// return the custom message for the given element and validation method
			// specified in the element's HTML5 data attribute
			customDataMessage: function(element, method) {
				return $(element).data('msg-' + method.toLowerCase()) || (element.attributes && $(element).attr('data-msg-' + method.toLowerCase()));
			},

			// return the custom message for the given element name and validation method
			customMessage: function( name, method ) {
				var m = this.settings.messages[name];
				return m && (m.constructor === String ? m : m[method]);
			},

			// return the first defined argument, allowing empty strings
			findDefined: function() {
				for(var i = 0; i < arguments.length; i++) {
					if (arguments[i] !== undefined) {
						return arguments[i];
					}
				}
				return undefined;
			},

			defaultMessage: function( element, method) {
				return this.findDefined(
					this.customMessage( element.name, method ),
					this.customDataMessage( element, method ),
					this.customMetaMessage( element, method ),
					// title is never undefined, so handle empty string as undefined
					!this.settings.ignoreTitle && element.title || undefined,
					$.validator.messages[method],
					"<strong>Warning: No message defined for " + element.name + "</strong>"
				);
			},

			formatAndAdd: function( element, rule ) {
				var message = this.defaultMessage( element, rule.method ),
					theregex = /\$?\{(\d+)\}/g;
				if ( typeof message === "function" ) {
					message = message.call(this, rule.parameters, element);
				} else if (theregex.test(message)) {
					message = $.validator.format(message.replace(theregex, '{$1}'), rule.parameters);
				}
				this.errorList.push({
					message: message,
					element: element
				});

				this.errorMap[element.name] = message;
				this.submitted[element.name] = message;
			},

			addWrapper: function(toToggle) {
				if ( this.settings.wrapper ) {
					toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
				}
				return toToggle;
			},

			defaultShowErrors: function() {
				var i, elements;
				for ( i = 0; this.errorList[i]; i++ ) {
					var error = this.errorList[i];
					if ( this.settings.highlight ) {
						this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
					}
					this.showLabel( error.element, error.message );
				}
				if( this.errorList.length ) {
					this.toShow = this.toShow.add( this.containers );
				}
				if (this.settings.success) {
					for ( i = 0; this.successList[i]; i++ ) {
						this.showLabel( this.successList[i] );
					}
				}
				if (this.settings.unhighlight) {
					for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
						this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
					}
				}
				this.toHide = this.toHide.not( this.toShow );
				this.hideErrors();
				this.addWrapper( this.toShow ).show();
			},

			validElements: function() {
				return this.currentElements.not(this.invalidElements());
			},

			invalidElements: function() {
				return $(this.errorList).map(function() {
					return this.element;
				});
			},

			showLabel: function(element, message) {
				var label = this.errorsFor( element );
				if ( label.length ) {
					// refresh error/success class
					label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

					// check if we have a generated label, replace the message then
					if ( label.attr("generated") ) {
						label.html(message);
					}
				} else {
					// create label
					label = $("<" + this.settings.errorElement + "/>")
						.attr({"for":  this.idOrName(element), generated: true})
						.addClass(this.settings.errorClass)
						.html(message || "");
					if ( this.settings.wrapper ) {
						// make sure the element is visible, even in IE
						// actually showing the wrapped element is handled elsewhere
						label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
					}
					if ( !this.labelContainer.append(label).length ) {
						if ( this.settings.errorPlacement ) {
							this.settings.errorPlacement(label, $(element) );
						} else {
							label.insertAfter(element);
						}
					}
				}
				if ( !message && this.settings.success ) {
					label.text("");
					if ( typeof this.settings.success === "string" ) {
						label.addClass( this.settings.success );
					} else {
						this.settings.success( label, element );
					}
				}
				this.toShow = this.toShow.add(label);
			},

			errorsFor: function(element) {
				var name = this.idOrName(element);
				return this.errors().filter(function() {
					return $(this).attr('for') === name;
				});
			},

			idOrName: function(element) {
				return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
			},

			validationTargetFor: function(element) {
				// if radio/checkbox, validate first element in group instead
				if (this.checkable(element)) {
					element = this.findByName( element.name ).not(this.settings.ignore)[0];
				}
				return element;
			},

			checkable: function( element ) {
				return (/radio|checkbox/i).test(element.type);
			},

			findByName: function( name ) {
				return $(this.currentForm).find('[name="' + name + '"]');
			},

			getLength: function(value, element) {
				switch( element.nodeName.toLowerCase() ) {
				case 'select':
					return $("option:selected", element).length;
				case 'input':
					if( this.checkable( element) ) {
						return this.findByName(element.name).filter(':checked').length;
					}
				}
				return value.length;
			},

			depend: function(param, element) {
				return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
			},

			dependTypes: {
				"boolean": function(param, element) {
					return param;
				},
				"string": function(param, element) {
					return !!$(param, element.form).length;
				},
				"function": function(param, element) {
					return param(element);
				}
			},

			optional: function(element) {
				var val = this.elementValue(element);
				return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
			},

			startRequest: function(element) {
				if (!this.pending[element.name]) {
					this.pendingRequest++;
					this.pending[element.name] = true;
				}
			},

			stopRequest: function(element, valid) {
				this.pendingRequest--;
				// sometimes synchronization fails, make sure pendingRequest is never < 0
				if (this.pendingRequest < 0) {
					this.pendingRequest = 0;
				}
				delete this.pending[element.name];
				if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
					$(this.currentForm).submit();
					this.formSubmitted = false;
				} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
					$(this.currentForm).triggerHandler("invalid-form", [this]);
					this.formSubmitted = false;
				}
			},

			previousValue: function(element) {
				return $.data(element, "previousValue") || $.data(element, "previousValue", {
					old: null,
					valid: true,
					message: this.defaultMessage( element, "remote" )
				});
			}

		},

		classRuleSettings: {
			required: {required: true},
			email: {email: true},
			url: {url: true},
			date: {date: true},
			dateISO: {dateISO: true},
			number: {number: true},
			digits: {digits: true},
			creditcard: {creditcard: true}
		},

		addClassRules: function(className, rules) {
			if ( className.constructor === String ) {
				this.classRuleSettings[className] = rules;
			} else {
				$.extend(this.classRuleSettings, className);
			}
		},

		classRules: function(element) {
			var rules = {};
			var classes = $(element).attr('class');
			if ( classes ) {
				$.each(classes.split(' '), function() {
					if (this in $.validator.classRuleSettings) {
						$.extend(rules, $.validator.classRuleSettings[this]);
					}
				});
			}
			return rules;
		},

		attributeRules: function(element) {
			var rules = {};
			var $element = $(element);

			for (var method in $.validator.methods) {
				var value;

				// support for <input required> in both html5 and older browsers
				if (method === 'required') {
					value = $element.get(0).getAttribute(method);
					// Some browsers return an empty string for the required attribute
					// and non-HTML5 browsers might have required="" markup
					if (value === "") {
						value = true;
					}
					// force non-HTML5 browsers to return bool
					value = !!value;
				} else {
					value = $element.attr(method);
				}

				if (value) {
					rules[method] = value;
				} else if ($element[0].getAttribute("type") === method) {
					rules[method] = true;
				}
			}

			// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
			if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
				delete rules.maxlength;
			}

			return rules;
		},

		metadataRules: function(element) {
			if (!$.metadata) {
				return {};
			}

			var meta = $.data(element.form, 'validator').settings.meta;
			return meta ?
				$(element).metadata()[meta] :
				$(element).metadata();
		},

		staticRules: function(element) {
			var rules = {};
			var validator = $.data(element.form, 'validator');
			if (validator.settings.rules) {
				rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
			}
			return rules;
		},

		normalizeRules: function(rules, element) {
			// handle dependency check
			$.each(rules, function(prop, val) {
				// ignore rule when param is explicitly false, eg. required:false
				if (val === false) {
					delete rules[prop];
					return;
				}
				if (val.param || val.depends) {
					var keepRule = true;
					switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
					}
					if (keepRule) {
						rules[prop] = val.param !== undefined ? val.param : true;
					} else {
						delete rules[prop];
					}
				}
			});

			// evaluate parameters
			$.each(rules, function(rule, parameter) {
				rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
			});

			// clean number parameters
			$.each(['minlength', 'maxlength', 'min', 'max'], function() {
				if (rules[this]) {
					rules[this] = Number(rules[this]);
				}
			});
			$.each(['rangelength', 'range'], function() {
				if (rules[this]) {
					rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
				}
			});

			if ($.validator.autoCreateRanges) {
				// auto-create ranges
				if (rules.min && rules.max) {
					rules.range = [rules.min, rules.max];
					delete rules.min;
					delete rules.max;
				}
				if (rules.minlength && rules.maxlength) {
					rules.rangelength = [rules.minlength, rules.maxlength];
					delete rules.minlength;
					delete rules.maxlength;
				}
			}

			// To support custom messages in metadata ignore rule methods titled "messages"
			if (rules.messages) {
				delete rules.messages;
			}

			return rules;
		},

		// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
		normalizeRule: function(data) {
			if( typeof data === "string" ) {
				var transformed = {};
				$.each(data.split(/\s/), function() {
					transformed[this] = true;
				});
				data = transformed;
			}
			return data;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
		addMethod: function(name, method, message) {
			$.validator.methods[name] = method;
			$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
			if (method.length < 3) {
				$.validator.addClassRules(name, $.validator.normalizeRule(name));
			}
		},

		methods: {

			// http://docs.jquery.com/Plugins/Validation/Methods/required
			required: function(value, element, param) {
				// check if dependency is met
				if ( !this.depend(param, element) ) {
					return "dependency-mismatch";
				}
				if ( element.nodeName.toLowerCase() === "select" ) {
					// could be an array for select-multiple or a string, both are fine this way
					var val = $(element).val();
					return val && val.length > 0;
				}
				if ( this.checkable(element) ) {
					return this.getLength(value, element) > 0;
				}
				return $.trim(value).length > 0;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/remote
			remote: function(value, element, param) {
				if ( this.optional(element) ) {
					return "dependency-mismatch";
				}

				var previous = this.previousValue(element);
				if (!this.settings.messages[element.name] ) {
					this.settings.messages[element.name] = {};
				}
				previous.originalMessage = this.settings.messages[element.name].remote;
				this.settings.messages[element.name].remote = previous.message;

				param = typeof param === "string" && {url:param} || param;

				if ( this.pending[element.name] ) {
					return "pending";
				}
				if ( previous.old === value ) {
					return previous.valid;
				}

				previous.old = value;
				var validator = this;
				this.startRequest(element);
				var data = {};
				data[element.name] = value;
				$.ajax($.extend(true, {
					url: param,
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					success: function(response) {
						validator.settings.messages[element.name].remote = previous.originalMessage;
						var valid = response === true || response === "true";
						if ( valid ) {
							var submitted = validator.formSubmitted;
							validator.prepareElement(element);
							validator.formSubmitted = submitted;
							validator.successList.push(element);
							delete validator.invalid[element.name];
							validator.showErrors();
						} else {
							var errors = {};
							var message = response || validator.defaultMessage( element, "remote" );
							errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
							validator.invalid[element.name] = true;
							validator.showErrors(errors);
						}
						previous.valid = valid;
						validator.stopRequest(element, valid);
					}
				}, param));
				return "pending";
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/minlength
			minlength: function(value, element, param) {
				var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
				return this.optional(element) || length >= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
			maxlength: function(value, element, param) {
				var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
				return this.optional(element) || length <= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
			rangelength: function(value, element, param) {
				var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
				return this.optional(element) || ( length >= param[0] && length <= param[1] );
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/min
			min: function( value, element, param ) {
				return this.optional(element) || value >= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/max
			max: function( value, element, param ) {
				return this.optional(element) || value <= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/range
			range: function( value, element, param ) {
				return this.optional(element) || ( value >= param[0] && value <= param[1] );
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/email
			email: function(value, element) {
				// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
				return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/url
			url: function(value, element) {
				// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
				return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/date
			date: function(value, element) {
				return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
			dateISO: function(value, element) {
				return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/number
			number: function(value, element) {
				return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/digits
			digits: function(value, element) {
				return this.optional(element) || /^\d+$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
			// based on http://en.wikipedia.org/wiki/Luhn
			creditcard: function(value, element) {
				if ( this.optional(element) ) {
					return "dependency-mismatch";
				}
				// accept only spaces, digits and dashes
				if (/[^0-9 \-]+/.test(value)) {
					return false;
				}
				var nCheck = 0,
					nDigit = 0,
					bEven = false;

				value = value.replace(/\D/g, "");

				for (var n = value.length - 1; n >= 0; n--) {
					var cDigit = value.charAt(n);
					nDigit = parseInt(cDigit, 10);
					if (bEven) {
						if ((nDigit *= 2) > 9) {
							nDigit -= 9;
						}
					}
					nCheck += nDigit;
					bEven = !bEven;
				}

				return (nCheck % 10) === 0;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
			equalTo: function(value, element, param) {
				// bind to the blur event of the target in order to revalidate whenever the target field is updated
				// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
				var target = $(param);
				if (this.settings.onfocusout) {
					target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
						$(element).valid();
					});
				}
				return value === target.val();
			}

		}

	});

	// deprecated, use $.validator.format instead
	$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function(settings, _, xhr) {
			var port = settings.port;
			if (settings.mode === "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function(settings) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if (mode === "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function( original, fix ){
			$.event.special[fix] = {
				setup:function() {
					this.addEventListener( original, handler, true );
				},
				teardown:function() {
					this.removeEventListener( original, handler, true );
				},
				handler: function(e) {
					var args = arguments;
					args[0] = $.event.fix(e);
					args[0].type = fix;
					return $.event.handle.apply(this, args);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	}
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));

/*! * jQuery Cycle Plugin (with Transition Definitions) * Examples and documentation at: http://jquery.malsup.com/cycle/ * Copyright (c) 2007-2010 M. Alsup  * Version: 2.9999.8 (26-OCT-2012) * Dual licensed under the MIT and GPL licenses.  * http://jquery.malsup.com/license.html * Requires: jQuery v1.3.2 or later */
;(function($, undefined) {
	"use strict";

	var ver = '2.9999.8';

	// if $.support is not defined (pre jQuery 1.3) add what I need
	if ($.support === undefined) {
		$.support = {
			opacity: !($.browser.msie)
		};
	}

	function debug(s) {
		if ($.fn.cycle.debug)
			log(s);
	}
	function log() {
		if (window.console && console.log)
			console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
	}
	$.expr[':'].paused = function(el) {
		return el.cyclePause;
	};


	// the options arg can be...
	//   a number  - indicates an immediate transition should occur to the given slide index
	//   a string  - 'pause', 'resume', 'toggle', 'next', 'prev', 'stop', 'destroy' or the name of a transition effect (ie, 'fade', 'zoom', etc)
	//   an object - properties to control the slideshow
	//
	// the arg2 arg can be...
	//   the name of an fx (only used in conjunction with a numeric value for 'options')
	//   the value true (only used in first arg == 'resume') and indicates
	//	 that the resume should occur immediately (not wait for next timeout)

	$.fn.cycle = function(options, arg2) {
		var o = { s: this.selector, c: this.context };

		// in 1.3+ we can fix mistakes with the ready state
		if (this.length === 0 && options != 'stop') {
			if (!$.isReady && o.s) {
				log('DOM not ready, queuing slideshow');
				$(function() {
					$(o.s,o.c).cycle(options,arg2);
				});
				return this;
			}
			// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
			log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
			return this;
		}

		// iterate the matched nodeset
		return this.each(function() {
			var opts = handleArguments(this, options, arg2);
			if (opts === false)
				return;

			opts.updateActivePagerLink = opts.updateActivePagerLink || $.fn.cycle.updateActivePagerLink;

			// stop existing slideshow for this container (if there is one)
			if (this.cycleTimeout)
				clearTimeout(this.cycleTimeout);
			this.cycleTimeout = this.cyclePause = 0;
			this.cycleStop = 0; // issue #108

			var $cont = $(this);
			var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
			var els = $slides.get();

			if (els.length < 2) {
				log('terminating; too few slides: ' + els.length);
				return;
			}

			var opts2 = buildOptions($cont, $slides, els, opts, o);
			if (opts2 === false)
				return;

			var startTime = opts2.continuous ? 10 : getTimeout(els[opts2.currSlide], els[opts2.nextSlide], opts2, !opts2.backwards);

			// if it's an auto slideshow, kick it off
			if (startTime) {
				startTime += (opts2.delay || 0);
				if (startTime < 10)
					startTime = 10;
				debug('first timeout: ' + startTime);
				this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts.backwards);}, startTime);
			}
		});
	};

	function triggerPause(cont, byHover, onPager) {
		var opts = $(cont).data('cycle.opts');
		if (!opts)
			return;
		var paused = !!cont.cyclePause;
		if (paused && opts.paused)
			opts.paused(cont, opts, byHover, onPager);
		else if (!paused && opts.resumed)
			opts.resumed(cont, opts, byHover, onPager);
	}

	// process the args that were passed to the plugin fn
	function handleArguments(cont, options, arg2) {
		if (cont.cycleStop === undefined)
			cont.cycleStop = 0;
		if (options === undefined || options === null)
			options = {};
		if (options.constructor == String) {
			switch(options) {
			case 'destroy':
			case 'stop':
				var opts = $(cont).data('cycle.opts');
				if (!opts)
					return false;
				cont.cycleStop++; // callbacks look for change
				if (cont.cycleTimeout)
					clearTimeout(cont.cycleTimeout);
				cont.cycleTimeout = 0;
				if (opts.elements)
					$(opts.elements).stop();
				$(cont).removeData('cycle.opts');
				if (options == 'destroy')
					destroy(cont, opts);
				return false;
			case 'toggle':
				cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
				checkInstantResume(cont.cyclePause, arg2, cont);
				triggerPause(cont);
				return false;
			case 'pause':
				cont.cyclePause = 1;
				triggerPause(cont);
				return false;
			case 'resume':
				cont.cyclePause = 0;
				checkInstantResume(false, arg2, cont);
				triggerPause(cont);
				return false;
			case 'prev':
			case 'next':
				opts = $(cont).data('cycle.opts');
				if (!opts) {
					log('options not found, "prev/next" ignored');
					return false;
				}
				$.fn.cycle[options](opts);
				return false;
			default:
				options = { fx: options };
			}
			return options;
		}
		else if (options.constructor == Number) {
			// go to the requested slide
			var num = options;
			options = $(cont).data('cycle.opts');
			if (!options) {
				log('options not found, can not advance slide');
				return false;
			}
			if (num < 0 || num >= options.elements.length) {
				log('invalid slide index: ' + num);
				return false;
			}
			options.nextSlide = num;
			if (cont.cycleTimeout) {
				clearTimeout(cont.cycleTimeout);
				cont.cycleTimeout = 0;
			}
			if (typeof arg2 == 'string')
				options.oneTimeFx = arg2;
			go(options.elements, options, 1, num >= options.currSlide);
			return false;
		}
		return options;

		function checkInstantResume(isPaused, arg2, cont) {
			if (!isPaused && arg2 === true) { // resume now!
				var options = $(cont).data('cycle.opts');
				if (!options) {
					log('options not found, can not resume');
					return false;
				}
				if (cont.cycleTimeout) {
					clearTimeout(cont.cycleTimeout);
					cont.cycleTimeout = 0;
				}
				go(options.elements, options, 1, !options.backwards);
			}
		}
	}

	function removeFilter(el, opts) {
		if (!$.support.opacity && opts.cleartype && el.style.filter) {
			try { el.style.removeAttribute('filter'); }
			catch(smother) {} // handle old opera versions
		}
	}

	// unbind event handlers
	function destroy(cont, opts) {
		if (opts.next)
			$(opts.next).unbind(opts.prevNextEvent);
		if (opts.prev)
			$(opts.prev).unbind(opts.prevNextEvent);

		if (opts.pager || opts.pagerAnchorBuilder)
			$.each(opts.pagerAnchors || [], function() {
				this.unbind().remove();
			});
		opts.pagerAnchors = null;
		$(cont).unbind('mouseenter.cycle mouseleave.cycle');
		if (opts.destroy) // callback
			opts.destroy(opts);
	}

	// one-time initialization
	function buildOptions($cont, $slides, els, options, o) {
		var startingSlideSpecified;
		// support metadata plugin (v1.0 and v2.0)
		var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
		var meta = $.isFunction($cont.data) ? $cont.data(opts.metaAttr) : null;
		if (meta)
			opts = $.extend(opts, meta);
		if (opts.autostop)
			opts.countdown = opts.autostopCount || els.length;

		var cont = $cont[0];
		$cont.data('cycle.opts', opts);
		opts.$cont = $cont;
		opts.stopCount = cont.cycleStop;
		opts.elements = els;
		opts.before = opts.before ? [opts.before] : [];
		opts.after = opts.after ? [opts.after] : [];

		// push some after callbacks
		if (!$.support.opacity && opts.cleartype)
			opts.after.push(function() { removeFilter(this, opts); });
		if (opts.continuous)
			opts.after.push(function() { go(els,opts,0,!opts.backwards); });

		saveOriginalOpts(opts);

		// clearType corrections
		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($slides);

		// container requires non-static position so that slides can be position within
		if ($cont.css('position') == 'static')
			$cont.css('position', 'relative');
		if (opts.width)
			$cont.width(opts.width);
		if (opts.height && opts.height != 'auto')
			$cont.height(opts.height);

		if (opts.startingSlide !== undefined) {
			opts.startingSlide = parseInt(opts.startingSlide,10);
			if (opts.startingSlide >= els.length || opts.startSlide < 0)
				opts.startingSlide = 0; // catch bogus input
			else
				startingSlideSpecified = true;
		}
		else if (opts.backwards)
			opts.startingSlide = els.length - 1;
		else
			opts.startingSlide = 0;

		// if random, mix up the slide array
		if (opts.random) {
			opts.randomMap = [];
			for (var i = 0; i < els.length; i++)
				opts.randomMap.push(i);
			opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
			if (startingSlideSpecified) {
				// try to find the specified starting slide and if found set start slide index in the map accordingly
				for ( var cnt = 0; cnt < els.length; cnt++ ) {
					if ( opts.startingSlide == opts.randomMap[cnt] ) {
						opts.randomIndex = cnt;
					}
				}
			}
			else {
				opts.randomIndex = 1;
				opts.startingSlide = opts.randomMap[1];
			}
		}
		else if (opts.startingSlide >= els.length)
			opts.startingSlide = 0; // catch bogus input
		opts.currSlide = opts.startingSlide || 0;
		var first = opts.startingSlide;

		// set position and zIndex on all the slides
		$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
			var z;
			if (opts.backwards)
				z = first ? i <= first ? els.length + (i-first) : first-i : els.length-i;
			else
				z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
			$(this).css('z-index', z);
		});

		// make sure first slide is visible
		$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
		removeFilter(els[first], opts);

		// stretch slides
		if (opts.fit) {
			if (!opts.aspect) {
				if (opts.width)
					$slides.width(opts.width);
				if (opts.height && opts.height != 'auto')
					$slides.height(opts.height);
			} else {
				$slides.each(function(){
					var $slide = $(this);
					var ratio = (opts.aspect === true) ? $slide.width()/$slide.height() : opts.aspect;
					if( opts.width && $slide.width() != opts.width ) {
						$slide.width( opts.width );
						$slide.height( opts.width / ratio );
					}

					if( opts.height && $slide.height() < opts.height ) {
						$slide.height( opts.height );
						$slide.width( opts.height * ratio );
					}
				});
			}
		}

		if (opts.center && ((!opts.fit) || opts.aspect)) {
			$slides.each(function(){
				var $slide = $(this);
				$slide.css({
					"margin-left": opts.width ?
						((opts.width - $slide.width()) / 2) + "px" :
						0,
					"margin-top": opts.height ?
						((opts.height - $slide.height()) / 2) + "px" :
						0
				});
			});
		}

		if (opts.center && !opts.fit && !opts.slideResize) {
			$slides.each(function(){
				var $slide = $(this);
				$slide.css({
					"margin-left": opts.width ? ((opts.width - $slide.width()) / 2) + "px" : 0,
					"margin-top": opts.height ? ((opts.height - $slide.height()) / 2) + "px" : 0
				});
			});
		}

		// stretch container
		var reshape = (opts.containerResize || opts.containerResizeHeight) && !$cont.innerHeight();
		if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
			var maxw = 0, maxh = 0;
			for(var j=0; j < els.length; j++) {
				var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
				if (!w) w = e.offsetWidth || e.width || $e.attr('width');
				if (!h) h = e.offsetHeight || e.height || $e.attr('height');
				maxw = w > maxw ? w : maxw;
				maxh = h > maxh ? h : maxh;
			}
			if (opts.containerResize && maxw > 0 && maxh > 0)
				$cont.css({width:maxw+'px',height:maxh+'px'});
			if (opts.containerResizeHeight && maxh > 0)
				$cont.css({height:maxh+'px'});
		}

		var pauseFlag = false;  // https://github.com/malsup/cycle/issues/44
		if (opts.pause)
			$cont.bind('mouseenter.cycle', function(){
				pauseFlag = true;
				this.cyclePause++;
				triggerPause(cont, true);
			}).bind('mouseleave.cycle', function(){
					if (pauseFlag)
						this.cyclePause--;
					triggerPause(cont, true);
				});

		if (supportMultiTransitions(opts) === false)
			return false;

		// apparently a lot of people use image slideshows without height/width attributes on the images.
		// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
		var requeue = false;
		options.requeueAttempts = options.requeueAttempts || 0;
		$slides.each(function() {
			// try to get height/width of each slide
			var $el = $(this);
			this.cycleH = (opts.fit && opts.height) ? opts.height : ($el.height() || this.offsetHeight || this.height || $el.attr('height') || 0);
			this.cycleW = (opts.fit && opts.width) ? opts.width : ($el.width() || this.offsetWidth || this.width || $el.attr('width') || 0);

			if ( $el.is('img') ) {
				// sigh..  sniffing, hacking, shrugging...  this crappy hack tries to account for what browsers do when
				// an image is being downloaded and the markup did not include sizing info (height/width attributes);
				// there seems to be some "default" sizes used in this situation
				var loadingIE	= ($.browser.msie  && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
				var loadingFF	= ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
				var loadingOp	= ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
				var loadingOther = (this.cycleH === 0 && this.cycleW === 0 && !this.complete);
				// don't requeue for images that are still loading but have a valid size
				if (loadingIE || loadingFF || loadingOp || loadingOther) {
					if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
						log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
						setTimeout(function() {$(o.s,o.c).cycle(options);}, opts.requeueTimeout);
						requeue = true;
						return false; // break each loop
					}
					else {
						log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
					}
				}
			}
			return true;
		});

		if (requeue)
			return false;

		opts.cssBefore = opts.cssBefore || {};
		opts.cssAfter = opts.cssAfter || {};
		opts.cssFirst = opts.cssFirst || {};
		opts.animIn = opts.animIn || {};
		opts.animOut = opts.animOut || {};

		$slides.not(':eq('+first+')').css(opts.cssBefore);
		$($slides[first]).css(opts.cssFirst);

		if (opts.timeout) {
			opts.timeout = parseInt(opts.timeout,10);
			// ensure that timeout and speed settings are sane
			if (opts.speed.constructor == String)
				opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed,10);
			if (!opts.sync)
				opts.speed = opts.speed / 2;

			var buffer = opts.fx == 'none' ? 0 : opts.fx == 'shuffle' ? 500 : 250;
			while((opts.timeout - opts.speed) < buffer) // sanitize timeout
				opts.timeout += opts.speed;
		}
		if (opts.easing)
			opts.easeIn = opts.easeOut = opts.easing;
		if (!opts.speedIn)
			opts.speedIn = opts.speed;
		if (!opts.speedOut)
			opts.speedOut = opts.speed;

		opts.slideCount = els.length;
		opts.currSlide = opts.lastSlide = first;
		if (opts.random) {
			if (++opts.randomIndex == els.length)
				opts.randomIndex = 0;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		}
		else if (opts.backwards)
			opts.nextSlide = opts.startingSlide === 0 ? (els.length-1) : opts.startingSlide-1;
		else
			opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

		// run transition init fn
		if (!opts.multiFx) {
			var init = $.fn.cycle.transitions[opts.fx];
			if ($.isFunction(init))
				init($cont, $slides, opts);
			else if (opts.fx != 'custom' && !opts.multiFx) {
				log('unknown transition: ' + opts.fx,'; slideshow terminating');
				return false;
			}
		}

		// fire artificial events
		var e0 = $slides[first];
		if (!opts.skipInitializationCallbacks) {
			if (opts.before.length)
				opts.before[0].apply(e0, [e0, e0, opts, true]);
			if (opts.after.length)
				opts.after[0].apply(e0, [e0, e0, opts, true]);
		}
		if (opts.next)
			$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,1);});
		if (opts.prev)
			$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,0);});
		if (opts.pager || opts.pagerAnchorBuilder)
			buildPager(els,opts);

		exposeAddSlide(opts, els);

		return opts;
	}

	// save off original opts so we can restore after clearing state
	function saveOriginalOpts(opts) {
		opts.original = { before: [], after: [] };
		opts.original.cssBefore = $.extend({}, opts.cssBefore);
		opts.original.cssAfter  = $.extend({}, opts.cssAfter);
		opts.original.animIn	= $.extend({}, opts.animIn);
		opts.original.animOut   = $.extend({}, opts.animOut);
		$.each(opts.before, function() { opts.original.before.push(this); });
		$.each(opts.after,  function() { opts.original.after.push(this); });
	}

	function supportMultiTransitions(opts) {
		var i, tx, txs = $.fn.cycle.transitions;
		// look for multiple effects
		if (opts.fx.indexOf(',') > 0) {
			opts.multiFx = true;
			opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
			// discard any bogus effect names
			for (i=0; i < opts.fxs.length; i++) {
				var fx = opts.fxs[i];
				tx = txs[fx];
				if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
					log('discarding unknown transition: ',fx);
					opts.fxs.splice(i,1);
					i--;
				}
			}
			// if we have an empty list then we threw everything away!
			if (!opts.fxs.length) {
				log('No valid transitions named; slideshow terminating.');
				return false;
			}
		}
		else if (opts.fx == 'all') {  // auto-gen the list of transitions
			opts.multiFx = true;
			opts.fxs = [];
			for (var p in txs) {
				if (txs.hasOwnProperty(p)) {
					tx = txs[p];
					if (txs.hasOwnProperty(p) && $.isFunction(tx))
						opts.fxs.push(p);
				}
			}
		}
		if (opts.multiFx && opts.randomizeEffects) {
			// munge the fxs array to make effect selection random
			var r1 = Math.floor(Math.random() * 20) + 30;
			for (i = 0; i < r1; i++) {
				var r2 = Math.floor(Math.random() * opts.fxs.length);
				opts.fxs.push(opts.fxs.splice(r2,1)[0]);
			}
			debug('randomized fx sequence: ',opts.fxs);
		}
		return true;
	}

	// provide a mechanism for adding slides after the slideshow has started
	function exposeAddSlide(opts, els) {
		opts.addSlide = function(newSlide, prepend) {
			var $s = $(newSlide), s = $s[0];
			if (!opts.autostopCount)
				opts.countdown++;
			els[prepend?'unshift':'push'](s);
			if (opts.els)
				opts.els[prepend?'unshift':'push'](s); // shuffle needs this
			opts.slideCount = els.length;

			// add the slide to the random map and resort
			if (opts.random) {
				opts.randomMap.push(opts.slideCount-1);
				opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
			}

			$s.css('position','absolute');
			$s[prepend?'prependTo':'appendTo'](opts.$cont);

			if (prepend) {
				opts.currSlide++;
				opts.nextSlide++;
			}

			if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
				clearTypeFix($s);

			if (opts.fit && opts.width)
				$s.width(opts.width);
			if (opts.fit && opts.height && opts.height != 'auto')
				$s.height(opts.height);
			s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
			s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

			$s.css(opts.cssBefore);

			if (opts.pager || opts.pagerAnchorBuilder)
				$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

			if ($.isFunction(opts.onAddSlide))
				opts.onAddSlide($s);
			else
				$s.hide(); // default behavior
		};
	}

	// reset internal state; we do this on every pass in order to support multiple effects
	$.fn.cycle.resetState = function(opts, fx) {
		fx = fx || opts.fx;
		opts.before = []; opts.after = [];
		opts.cssBefore = $.extend({}, opts.original.cssBefore);
		opts.cssAfter  = $.extend({}, opts.original.cssAfter);
		opts.animIn	= $.extend({}, opts.original.animIn);
		opts.animOut   = $.extend({}, opts.original.animOut);
		opts.fxFn = null;
		$.each(opts.original.before, function() { opts.before.push(this); });
		$.each(opts.original.after,  function() { opts.after.push(this); });

		// re-init
		var init = $.fn.cycle.transitions[fx];
		if ($.isFunction(init))
			init(opts.$cont, $(opts.elements), opts);
	};

	// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
	function go(els, opts, manual, fwd) {
		var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

		// opts.busy is true if we're in the middle of an animation
		if (manual && opts.busy && opts.manualTrump) {
			// let manual transitions requests trump active ones
			debug('manualTrump in go(), stopping active transition');
			$(els).stop(true,true);
			opts.busy = 0;
			clearTimeout(p.cycleTimeout);
		}

		// don't begin another timeout-based transition if there is one active
		if (opts.busy) {
			debug('transition active, ignoring new tx request');
			return;
		}


		// stop cycling if we have an outstanding stop request
		if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
			return;

		// check to see if we should stop cycling based on autostop options
		if (!manual && !p.cyclePause && !opts.bounce &&
			((opts.autostop && (--opts.countdown <= 0)) ||
				(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
			if (opts.end)
				opts.end(opts);
			return;
		}

		// if slideshow is paused, only transition on a manual trigger
		var changed = false;
		if ((manual || !p.cyclePause) && (opts.nextSlide != opts.currSlide)) {
			changed = true;
			var fx = opts.fx;
			// keep trying to get the slide size if we don't have it yet
			curr.cycleH = curr.cycleH || $(curr).height();
			curr.cycleW = curr.cycleW || $(curr).width();
			next.cycleH = next.cycleH || $(next).height();
			next.cycleW = next.cycleW || $(next).width();

			// support multiple transition types
			if (opts.multiFx) {
				if (fwd && (opts.lastFx === undefined || ++opts.lastFx >= opts.fxs.length))
					opts.lastFx = 0;
				else if (!fwd && (opts.lastFx === undefined || --opts.lastFx < 0))
					opts.lastFx = opts.fxs.length - 1;
				fx = opts.fxs[opts.lastFx];
			}

			// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
			if (opts.oneTimeFx) {
				fx = opts.oneTimeFx;
				opts.oneTimeFx = null;
			}

			$.fn.cycle.resetState(opts, fx);

			// run the before callbacks
			if (opts.before.length)
				$.each(opts.before, function(i,o) {
					if (p.cycleStop != opts.stopCount) return;
					o.apply(next, [curr, next, opts, fwd]);
				});

			// stage the after callacks
			var after = function() {
				opts.busy = 0;
				$.each(opts.after, function(i,o) {
					if (p.cycleStop != opts.stopCount) return;
					o.apply(next, [curr, next, opts, fwd]);
				});
				if (!p.cycleStop) {
					// queue next transition
					queueNext();
				}
			};

			debug('tx firing('+fx+'); currSlide: ' + opts.currSlide + '; nextSlide: ' + opts.nextSlide);

			// get ready to perform the transition
			opts.busy = 1;
			if (opts.fxFn) // fx function provided?
				opts.fxFn(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
			else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
				$.fn.cycle[opts.fx](curr, next, opts, after, fwd, manual && opts.fastOnEvent);
			else
				$.fn.cycle.custom(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		}
		else {
			queueNext();
		}

		if (changed || opts.nextSlide == opts.currSlide) {
			// calculate the next slide
			var roll;
			opts.lastSlide = opts.currSlide;
			if (opts.random) {
				opts.currSlide = opts.nextSlide;
				if (++opts.randomIndex == els.length) {
					opts.randomIndex = 0;
					opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
				}
				opts.nextSlide = opts.randomMap[opts.randomIndex];
				if (opts.nextSlide == opts.currSlide)
					opts.nextSlide = (opts.currSlide == opts.slideCount - 1) ? 0 : opts.currSlide + 1;
			}
			else if (opts.backwards) {
				roll = (opts.nextSlide - 1) < 0;
				if (roll && opts.bounce) {
					opts.backwards = !opts.backwards;
					opts.nextSlide = 1;
					opts.currSlide = 0;
				}
				else {
					opts.nextSlide = roll ? (els.length-1) : opts.nextSlide-1;
					opts.currSlide = roll ? 0 : opts.nextSlide+1;
				}
			}
			else { // sequence
				roll = (opts.nextSlide + 1) == els.length;
				if (roll && opts.bounce) {
					opts.backwards = !opts.backwards;
					opts.nextSlide = els.length-2;
					opts.currSlide = els.length-1;
				}
				else {
					opts.nextSlide = roll ? 0 : opts.nextSlide+1;
					opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
				}
			}
		}
		if (changed && opts.pager)
			opts.updateActivePagerLink(opts.pager, opts.currSlide, opts.activePagerClass);

		function queueNext() {
			// stage the next transition
			var ms = 0, timeout = opts.timeout;
			if (opts.timeout && !opts.continuous) {
				ms = getTimeout(els[opts.currSlide], els[opts.nextSlide], opts, fwd);
				if (opts.fx == 'shuffle')
					ms -= opts.speedOut;
			}
			else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
				ms = 10;
			if (ms > 0)
				p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.backwards); }, ms);
		}
	}

	// invoked after transition
	$.fn.cycle.updateActivePagerLink = function(pager, currSlide, clsName) {
		$(pager).each(function() {
			$(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
		});
	};

	// calculate timeout value for current transition
	function getTimeout(curr, next, opts, fwd) {
		if (opts.timeoutFn) {
			// call user provided calc fn
			var t = opts.timeoutFn.call(curr,curr,next,opts,fwd);
			while (opts.fx != 'none' && (t - opts.speed) < 250) // sanitize timeout
				t += opts.speed;
			debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
			if (t !== false)
				return t;
		}
		return opts.timeout;
	}

	// expose next/prev function, caller must pass in state
	$.fn.cycle.next = function(opts) { advance(opts,1); };
	$.fn.cycle.prev = function(opts) { advance(opts,0);};

	// advance slide forward or back
	function advance(opts, moveForward) {
		var val = moveForward ? 1 : -1;
		var els = opts.elements;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		if (opts.random && val < 0) {
			// move back to the previously display slide
			opts.randomIndex--;
			if (--opts.randomIndex == -2)
				opts.randomIndex = els.length-2;
			else if (opts.randomIndex == -1)
				opts.randomIndex = els.length-1;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		}
		else if (opts.random) {
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		}
		else {
			opts.nextSlide = opts.currSlide + val;
			if (opts.nextSlide < 0) {
				if (opts.nowrap) return false;
				opts.nextSlide = els.length - 1;
			}
			else if (opts.nextSlide >= els.length) {
				if (opts.nowrap) return false;
				opts.nextSlide = 0;
			}
		}

		var cb = opts.onPrevNextEvent || opts.prevNextClick; // prevNextClick is deprecated
		if ($.isFunction(cb))
			cb(val > 0, opts.nextSlide, els[opts.nextSlide]);
		go(els, opts, 1, moveForward);
		return false;
	}

	function buildPager(els, opts) {
		var $p = $(opts.pager);
		$.each(els, function(i,o) {
			$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
		});
		opts.updateActivePagerLink(opts.pager, opts.startingSlide, opts.activePagerClass);
	}

	$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
		var a;
		if ($.isFunction(opts.pagerAnchorBuilder)) {
			a = opts.pagerAnchorBuilder(i,el);
			debug('pagerAnchorBuilder('+i+', el) returned: ' + a);
		}
		else
			a = '<a href="#">'+(i+1)+'</a>';

		if (!a)
			return;
		var $a = $(a);
		// don't reparent if anchor is in the dom
		if ($a.parents('body').length === 0) {
			var arr = [];
			if ($p.length > 1) {
				$p.each(function() {
					var $clone = $a.clone(true);
					$(this).append($clone);
					arr.push($clone[0]);
				});
				$a = $(arr);
			}
			else {
				$a.appendTo($p);
			}
		}

		opts.pagerAnchors =  opts.pagerAnchors || [];
		opts.pagerAnchors.push($a);

		var pagerFn = function(e) {
			e.preventDefault();
			opts.nextSlide = i;
			var p = opts.$cont[0], timeout = p.cycleTimeout;
			if (timeout) {
				clearTimeout(timeout);
				p.cycleTimeout = 0;
			}
			var cb = opts.onPagerEvent || opts.pagerClick; // pagerClick is deprecated
			if ($.isFunction(cb))
				cb(opts.nextSlide, els[opts.nextSlide]);
			go(els,opts,1,opts.currSlide < i); // trigger the trans
			//		return false; // <== allow bubble
		};

		if ( /mouseenter|mouseover/i.test(opts.pagerEvent) ) {
			$a.hover(pagerFn, function(){/* no-op */} );
		}
		else {
			$a.bind(opts.pagerEvent, pagerFn);
		}

		if ( ! /^click/.test(opts.pagerEvent) && !opts.allowPagerClickBubble)
			$a.bind('click.cycle', function(){return false;}); // suppress click

		var cont = opts.$cont[0];
		var pauseFlag = false; // https://github.com/malsup/cycle/issues/44
		if (opts.pauseOnPagerHover) {
			$a.hover(
				function() {
					pauseFlag = true;
					cont.cyclePause++;
					triggerPause(cont,true,true);
				}, function() {
					if (pauseFlag)
						cont.cyclePause--;
					triggerPause(cont,true,true);
				}
			);
		}
	};

	// helper fn to calculate the number of slides between the current and the next
	$.fn.cycle.hopsFromLast = function(opts, fwd) {
		var hops, l = opts.lastSlide, c = opts.currSlide;
		if (fwd)
			hops = c > l ? c - l : opts.slideCount - l;
		else
			hops = c < l ? l - c : l + opts.slideCount - c;
		return hops;
	};

	// fix clearType problems in ie6 by setting an explicit bg color
	// (otherwise text slides look horrible during a fade transition)
	function clearTypeFix($slides) {
		debug('applying clearType background-color hack');
		function hex(s) {
			s = parseInt(s,10).toString(16);
			return s.length < 2 ? '0'+s : s;
		}
		function getBg(e) {
			for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
				var v = $.css(e,'background-color');
				if (v && v.indexOf('rgb') >= 0 ) {
					var rgb = v.match(/\d+/g);
					return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
				}
				if (v && v != 'transparent')
					return v;
			}
			return '#ffffff';
		}
		$slides.each(function() { $(this).css('background-color', getBg(this)); });
	}

	// reset common props before the next transition
	$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
		$(opts.elements).not(curr).hide();
		if (typeof opts.cssBefore.opacity == 'undefined')
			opts.cssBefore.opacity = 1;
		opts.cssBefore.display = 'block';
		if (opts.slideResize && w !== false && next.cycleW > 0)
			opts.cssBefore.width = next.cycleW;
		if (opts.slideResize && h !== false && next.cycleH > 0)
			opts.cssBefore.height = next.cycleH;
		opts.cssAfter = opts.cssAfter || {};
		opts.cssAfter.display = 'none';
		$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
		$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
	};

	// the actual fn for effecting a transition
	$.fn.cycle.custom = function(curr, next, opts, cb, fwd, speedOverride) {
		var $l = $(curr), $n = $(next);
		var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut;
		$n.css(opts.cssBefore);
		if (speedOverride) {
			if (typeof speedOverride == 'number')
				speedIn = speedOut = speedOverride;
			else
				speedIn = speedOut = 1;
			easeIn = easeOut = null;
		}
		var fn = function() {
			$n.animate(opts.animIn, speedIn, easeIn, function() {
				cb();
			});
		};
		$l.animate(opts.animOut, speedOut, easeOut, function() {
			$l.css(opts.cssAfter);
			if (!opts.sync)
				fn();
		});
		if (opts.sync) fn();
	};

	// transition definitions - only fade is defined here, transition pack defines the rest
	$.fn.cycle.transitions = {
		fade: function($cont, $slides, opts) {
			$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
			opts.before.push(function(curr,next,opts) {
				$.fn.cycle.commonReset(curr,next,opts);
				opts.cssBefore.opacity = 0;
			});
			opts.animIn	   = { opacity: 1 };
			opts.animOut   = { opacity: 0 };
			opts.cssBefore = { top: 0, left: 0 };
		}
	};

	$.fn.cycle.ver = function() { return ver; };

	// override these globally if you like (they are all optional)
	$.fn.cycle.defaults = {
		activePagerClass: 'activeSlide', // class name used for the active pager link
		after:            null,     // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
		allowPagerClickBubble: false, // allows or prevents click event on pager anchors from bubbling
		animIn:           null,     // properties that define how the slide animates in
		animOut:          null,     // properties that define how the slide animates out
		aspect:           false,    // preserve aspect ratio during fit resizing, cropping if necessary (must be used with fit option)
		autostop:         0,        // true to end slideshow after X transitions (where X == slide count)
		autostopCount:    0,        // number of transitions (optionally used with autostop to define X)
		backwards:        false,    // true to start slideshow at last slide and move backwards through the stack
		before:           null,     // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag)
		center:           null,     // set to true to have cycle add top/left margin to each slide (use with width and height options)
		cleartype:        !$.support.opacity,  // true if clearType corrections should be applied (for IE)
		cleartypeNoBg:    false,    // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
		containerResize:  1,        // resize container to fit largest slide
		containerResizeHeight:  0,  // resize containers height to fit the largest slide but leave the width dynamic
		continuous:       0,        // true to start next transition immediately after current one completes
		cssAfter:         null,     // properties that defined the state of the slide after transitioning out
		cssBefore:        null,     // properties that define the initial state of the slide before transitioning in
		delay:            0,        // additional delay (in ms) for first transition (hint: can be negative)
		easeIn:           null,     // easing for "in" transition
		easeOut:          null,     // easing for "out" transition
		easing:           null,     // easing method for both in and out transitions
		end:              null,     // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
		fastOnEvent:      0,        // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
		fit:              0,        // force slides to fit container
		fx:               'fade',   // name of transition effect (or comma separated names, ex: 'fade,scrollUp,shuffle')
		fxFn:             null,     // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
		height:           'auto',   // container height (if the 'fit' option is true, the slides will be set to this height as well)
		manualTrump:      true,     // causes manual transition to stop an active transition instead of being ignored
		metaAttr:         'cycle',  // data- attribute that holds the option data for the slideshow
		next:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for next slide
		nowrap:           0,        // true to prevent slideshow from wrapping
		onPagerEvent:     null,     // callback fn for pager events: function(zeroBasedSlideIndex, slideElement)
		onPrevNextEvent:  null,     // callback fn for prev/next events: function(isNext, zeroBasedSlideIndex, slideElement)
		pager:            null,     // element, jQuery object, or jQuery selector string for the element to use as pager container
		pagerAnchorBuilder: null,   // callback fn for building anchor links:  function(index, DOMelement)
		pagerEvent:       'click.cycle', // name of event which drives the pager navigation
		pause:            0,        // true to enable "pause on hover"
		pauseOnPagerHover: 0,       // true to pause when hovering over pager link
		prev:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for previous slide
		prevNextEvent:    'click.cycle',// event which drives the manual transition to the previous or next slide
		random:           0,        // true for random, false for sequence (not applicable to shuffle fx)
		randomizeEffects: 1,        // valid when multiple effects are used; true to make the effect sequence random
		requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
		requeueTimeout:   250,      // ms delay for requeue
		rev:              0,        // causes animations to transition in reverse (for effects that support it such as scrollHorz/scrollVert/shuffle)
		shuffle:          null,     // coords for shuffle animation, ex: { top:15, left: 200 }
		skipInitializationCallbacks: false, // set to true to disable the first before/after callback that occurs prior to any transition
		slideExpr:        null,     // expression for selecting slides (if something other than all children is required)
		slideResize:      1,        // force slide width/height to fixed size before every transition
		speed:            1000,     // speed of the transition (any valid fx speed value)
		speedIn:          null,     // speed of the 'in' transition
		speedOut:         null,     // speed of the 'out' transition
		startingSlide:    undefined,// zero-based index of the first slide to be displayed
		sync:             1,        // true if in/out transitions should occur simultaneously
		timeout:          4000,     // milliseconds between slide transitions (0 to disable auto advance)
		timeoutFn:        null,     // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
		updateActivePagerLink: null,// callback fn invoked to update the active pager link (adds/removes activePagerClass style)
		width:            null      // container width (if the 'fit' option is true, the slides will be set to this width as well)
	};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.73
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {
	"use strict";

	//
	// These functions define slide initialization and properties for the named
	// transitions. To save file size feel free to remove any of these that you
	// don't need.
	//
	$.fn.cycle.transitions.none = function($cont, $slides, opts) {
		opts.fxFn = function(curr,next,opts,after){
			$(next).show();
			$(curr).hide();
			after();
		};
	};

	// not a cross-fade, fadeout only fades out the top slide
	$.fn.cycle.transitions.fadeout = function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css({ display: 'block', 'opacity': 1 });
		opts.before.push(function(curr,next,opts,w,h,rev) {
			$(curr).css('zIndex',opts.slideCount + (rev !== true ? 1 : 0));
			$(next).css('zIndex',opts.slideCount + (rev !== true ? 0 : 1));
		});
		opts.animIn.opacity = 1;
		opts.animOut.opacity = 0;
		opts.cssBefore.opacity = 1;
		opts.cssBefore.display = 'block';
		opts.cssAfter.zIndex = 0;
	};

	// scrollUp/Down/Left/Right
	$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push($.fn.cycle.commonReset);
		var h = $cont.height();
		opts.cssBefore.top = h;
		opts.cssBefore.left = 0;
		opts.cssFirst.top = 0;
		opts.animIn.top = 0;
		opts.animOut.top = -h;
	};
	$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push($.fn.cycle.commonReset);
		var h = $cont.height();
		opts.cssFirst.top = 0;
		opts.cssBefore.top = -h;
		opts.cssBefore.left = 0;
		opts.animIn.top = 0;
		opts.animOut.top = h;
	};
	$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push($.fn.cycle.commonReset);
		var w = $cont.width();
		opts.cssFirst.left = 0;
		opts.cssBefore.left = w;
		opts.cssBefore.top = 0;
		opts.animIn.left = 0;
		opts.animOut.left = 0-w;
	};
	$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push($.fn.cycle.commonReset);
		var w = $cont.width();
		opts.cssFirst.left = 0;
		opts.cssBefore.left = -w;
		opts.cssBefore.top = 0;
		opts.animIn.left = 0;
		opts.animOut.left = w;
	};
	$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
		$cont.css('overflow','hidden').width();
		opts.before.push(function(curr, next, opts, fwd) {
			if (opts.rev)
				fwd = !fwd;
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
			opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
		});
		opts.cssFirst.left = 0;
		opts.cssBefore.top = 0;
		opts.animIn.left = 0;
		opts.animOut.top = 0;
	};
	$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
		$cont.css('overflow','hidden');
		opts.before.push(function(curr, next, opts, fwd) {
			if (opts.rev)
				fwd = !fwd;
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
			opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
		});
		opts.cssFirst.top = 0;
		opts.cssBefore.left = 0;
		opts.animIn.top = 0;
		opts.animOut.left = 0;
	};

	// slideX/slideY
	$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$(opts.elements).not(curr).hide();
			$.fn.cycle.commonReset(curr,next,opts,false,true);
			opts.animIn.width = next.cycleW;
		});
		opts.cssBefore.left = 0;
		opts.cssBefore.top = 0;
		opts.cssBefore.width = 0;
		opts.animIn.width = 'show';
		opts.animOut.width = 0;
	};
	$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$(opts.elements).not(curr).hide();
			$.fn.cycle.commonReset(curr,next,opts,true,false);
			opts.animIn.height = next.cycleH;
		});
		opts.cssBefore.left = 0;
		opts.cssBefore.top = 0;
		opts.cssBefore.height = 0;
		opts.animIn.height = 'show';
		opts.animOut.height = 0;
	};

	// shuffle
	$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
		var i, w = $cont.css('overflow', 'visible').width();
		$slides.css({left: 0, top: 0});
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		});
		// only adjust speed once!
		if (!opts.speedAdjusted) {
			opts.speed = opts.speed / 2; // shuffle has 2 transitions
			opts.speedAdjusted = true;
		}
		opts.random = 0;
		opts.shuffle = opts.shuffle || {left:-w, top:15};
		opts.els = [];
		for (i=0; i < $slides.length; i++)
			opts.els.push($slides[i]);

		for (i=0; i < opts.currSlide; i++)
			opts.els.push(opts.els.shift());

		// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
		opts.fxFn = function(curr, next, opts, cb, fwd) {
			if (opts.rev)
				fwd = !fwd;
			var $el = fwd ? $(curr) : $(next);
			$(next).css(opts.cssBefore);
			var count = opts.slideCount;
			$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
				var hops = $.fn.cycle.hopsFromLast(opts, fwd);
				for (var k=0; k < hops; k++) {
					if (fwd)
						opts.els.push(opts.els.shift());
					else
						opts.els.unshift(opts.els.pop());
				}
				if (fwd) {
					for (var i=0, len=opts.els.length; i < len; i++)
						$(opts.els[i]).css('z-index', len-i+count);
				}
				else {
					var z = $(curr).css('z-index');
					$el.css('z-index', parseInt(z,10)+1+count);
				}
				$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
					$(fwd ? this : curr).hide();
					if (cb) cb();
				});
			});
		};
		$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
	};

	// turnUp/Down/Left/Right
	$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,true,false);
			opts.cssBefore.top = next.cycleH;
			opts.animIn.height = next.cycleH;
			opts.animOut.width = next.cycleW;
		});
		opts.cssFirst.top = 0;
		opts.cssBefore.left = 0;
		opts.cssBefore.height = 0;
		opts.animIn.top = 0;
		opts.animOut.height = 0;
	};
	$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,true,false);
			opts.animIn.height = next.cycleH;
			opts.animOut.top   = curr.cycleH;
		});
		opts.cssFirst.top = 0;
		opts.cssBefore.left = 0;
		opts.cssBefore.top = 0;
		opts.cssBefore.height = 0;
		opts.animOut.height = 0;
	};
	$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,false,true);
			opts.cssBefore.left = next.cycleW;
			opts.animIn.width = next.cycleW;
		});
		opts.cssBefore.top = 0;
		opts.cssBefore.width = 0;
		opts.animIn.left = 0;
		opts.animOut.width = 0;
	};
	$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,false,true);
			opts.animIn.width = next.cycleW;
			opts.animOut.left = curr.cycleW;
		});
		$.extend(opts.cssBefore, { top: 0, left: 0, width: 0 });
		opts.animIn.left = 0;
		opts.animOut.width = 0;
	};

	// zoom
	$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,false,false,true);
			opts.cssBefore.top = next.cycleH/2;
			opts.cssBefore.left = next.cycleW/2;
			$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
			$.extend(opts.animOut, { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 });
		});
		opts.cssFirst.top = 0;
		opts.cssFirst.left = 0;
		opts.cssBefore.width = 0;
		opts.cssBefore.height = 0;
	};

	// fadeZoom
	$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,false,false);
			opts.cssBefore.left = next.cycleW/2;
			opts.cssBefore.top = next.cycleH/2;
			$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
		});
		opts.cssBefore.width = 0;
		opts.cssBefore.height = 0;
		opts.animOut.opacity = 0;
	};

	// blindX
	$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
		var w = $cont.css('overflow','hidden').width();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.animIn.width = next.cycleW;
			opts.animOut.left   = curr.cycleW;
		});
		opts.cssBefore.left = w;
		opts.cssBefore.top = 0;
		opts.animIn.left = 0;
		opts.animOut.left = w;
	};
	// blindY
	$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
		var h = $cont.css('overflow','hidden').height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.animIn.height = next.cycleH;
			opts.animOut.top   = curr.cycleH;
		});
		opts.cssBefore.top = h;
		opts.cssBefore.left = 0;
		opts.animIn.top = 0;
		opts.animOut.top = h;
	};
	// blindZ
	$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
		var h = $cont.css('overflow','hidden').height();
		var w = $cont.width();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.animIn.height = next.cycleH;
			opts.animOut.top   = curr.cycleH;
		});
		opts.cssBefore.top = h;
		opts.cssBefore.left = w;
		opts.animIn.top = 0;
		opts.animIn.left = 0;
		opts.animOut.top = h;
		opts.animOut.left = w;
	};

	// growX - grow horizontally from centered 0 width
	$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,false,true);
			opts.cssBefore.left = this.cycleW/2;
			opts.animIn.left = 0;
			opts.animIn.width = this.cycleW;
			opts.animOut.left = 0;
		});
		opts.cssBefore.top = 0;
		opts.cssBefore.width = 0;
	};
	// growY - grow vertically from centered 0 height
	$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,true,false);
			opts.cssBefore.top = this.cycleH/2;
			opts.animIn.top = 0;
			opts.animIn.height = this.cycleH;
			opts.animOut.top = 0;
		});
		opts.cssBefore.height = 0;
		opts.cssBefore.left = 0;
	};

	// curtainX - squeeze in both edges horizontally
	$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,false,true,true);
			opts.cssBefore.left = next.cycleW/2;
			opts.animIn.left = 0;
			opts.animIn.width = this.cycleW;
			opts.animOut.left = curr.cycleW/2;
			opts.animOut.width = 0;
		});
		opts.cssBefore.top = 0;
		opts.cssBefore.width = 0;
	};
	// curtainY - squeeze in both edges vertically
	$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,true,false,true);
			opts.cssBefore.top = next.cycleH/2;
			opts.animIn.top = 0;
			opts.animIn.height = next.cycleH;
			opts.animOut.top = curr.cycleH/2;
			opts.animOut.height = 0;
		});
		opts.cssBefore.height = 0;
		opts.cssBefore.left = 0;
	};

	// cover - curr slide covered by next slide
	$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
		var d = opts.direction || 'left';
		var w = $cont.css('overflow','hidden').width();
		var h = $cont.height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssAfter.display = '';
			if (d == 'right')
				opts.cssBefore.left = -w;
			else if (d == 'up')
				opts.cssBefore.top = h;
			else if (d == 'down')
					opts.cssBefore.top = -h;
				else
					opts.cssBefore.left = w;
		});
		opts.animIn.left = 0;
		opts.animIn.top = 0;
		opts.cssBefore.top = 0;
		opts.cssBefore.left = 0;
	};

	// uncover - curr slide moves off next slide
	$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
		var d = opts.direction || 'left';
		var w = $cont.css('overflow','hidden').width();
		var h = $cont.height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,true,true,true);
			if (d == 'right')
				opts.animOut.left = w;
			else if (d == 'up')
				opts.animOut.top = -h;
			else if (d == 'down')
					opts.animOut.top = h;
				else
					opts.animOut.left = -w;
		});
		opts.animIn.left = 0;
		opts.animIn.top = 0;
		opts.cssBefore.top = 0;
		opts.cssBefore.left = 0;
	};

	// toss - move top slide and fade away
	$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
		var w = $cont.css('overflow','visible').width();
		var h = $cont.height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr,next,opts,true,true,true);
			// provide default toss settings if animOut not provided
			if (!opts.animOut.left && !opts.animOut.top)
				$.extend(opts.animOut, { left: w*2, top: -h/2, opacity: 0 });
			else
				opts.animOut.opacity = 0;
		});
		opts.cssBefore.left = 0;
		opts.cssBefore.top = 0;
		opts.animIn.left = 0;
	};

	// wipe - clip animation
	$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
		var w = $cont.css('overflow','hidden').width();
		var h = $cont.height();
		opts.cssBefore = opts.cssBefore || {};
		var clip;
		if (opts.clip) {
			if (/l2r/.test(opts.clip))
				clip = 'rect(0px 0px '+h+'px 0px)';
			else if (/r2l/.test(opts.clip))
				clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
			else if (/t2b/.test(opts.clip))
					clip = 'rect(0px '+w+'px 0px 0px)';
				else if (/b2t/.test(opts.clip))
						clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
					else if (/zoom/.test(opts.clip)) {
							var top = parseInt(h/2,10);
							var left = parseInt(w/2,10);
							clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
						}
		}

		opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

		var d = opts.cssBefore.clip.match(/(\d+)/g);
		var t = parseInt(d[0],10), r = parseInt(d[1],10), b = parseInt(d[2],10), l = parseInt(d[3],10);

		opts.before.push(function(curr, next, opts) {
			if (curr == next) return;
			var $curr = $(curr), $next = $(next);
			$.fn.cycle.commonReset(curr,next,opts,true,true,false);
			opts.cssAfter.display = 'block';

			var step = 1, count = parseInt((opts.speedIn / 13),10) - 1;
			(function f() {
				var tt = t ? t - parseInt(step * (t/count),10) : 0;
				var ll = l ? l - parseInt(step * (l/count),10) : 0;
				var bb = b < h ? b + parseInt(step * ((h-b)/count || 1),10) : h;
				var rr = r < w ? r + parseInt(step * ((w-r)/count || 1),10) : w;
				$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
				(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
			})();
		});
		$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
		opts.animIn	   = { left: 0 };
		opts.animOut   = { left: 0 };
	};

})(jQuery);
