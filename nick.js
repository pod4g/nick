(function(window) {

		var window = window,

		document = window.document,

		navigator = window.navigator,

		object = {},

		string = '',

		toString = {}.toString,
		
		undefined,

		// type = [],
		
		class2type = 'Object Number Boolean String Function',

		rword = /[^, ]+/g;

		space = '[\\s\\r\\n]+',

		lowerCase = string.toLowerCase,

		upperCase = string.toUpperCase,

		real = !0,

		fake = !1,

		tween = {
			linear: function(t, b, c, d) {
				return c * t / d + b;
			},
			bounce: {
				easeIn: function(t, b, c, d) {
					return c - tween.bounce.easeOut(d - t, 0, c, d) + b;
				},
				easeOut: function(t, b, c, d) {
					if ((t /= d) < (1 / 2.75)) {
						return c * (7.5625 * t * t) + b;
					} else if (t < (2 / 2.75)) {
						return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
					} else if (t < (2.5 / 2.75)) {
						return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
					} else {
						return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
					}
				},
				easeInOut: function(t, b, c, d) {
					if (t < d / 2) {
						return tween.bounce.easeIn(t * 2, 0, c, d) * .5 + b;
					} else {
						return tween.bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
					}
				}
			}
		},

		// 更精确地判断type。以对象的[[class]]属性作为判断的依据。
		type = function(data){

			var t = typeof data,s;
			
			if( data == null ) return data + '';

			return t === 'object' ? toString.call( obj ).slice( 8, -1 ).toLowerCase() : t;

		},

		// type = function(data) {
		// 	return null === data ? data + '' : 'object' == typeof data || 'function' == typeof data ? type[toString.call(data)] || 'object' : typeof data
		// },

		isWindow = function(window) {

			return null != window && window == window.window

		},

		isObject = function(object) {
			return type(object) == 'object'
		},

		isFloat = function(number) {

			return isNumber(number) && /\./.test(number);

		},
		isNick = function(object) {

			return object && object instanceof nick

		},

		isElement = function(object) {

			return object && (object.nodeType == 1 || object.nodeType === 9)

		},

		isArray = function(array) {

			return Array.isArray ? Array.isArray : type( array ) == 'array'
		},

		isNick = function(object) {

			return object && object instanceof nick

		},
		isString = function(string) {

			return type(string) == 'string'

		},
		isFunction = function(fun) {

			return type(fun) == 'function'

		},

		number = function(number, float) {

			number = (float ? parseFloat : parseInt)(number);

			return isNaN(number) ? 0 : number

		},
		int = function(num) {

			return number(num)

		},
		float = function(num) {

			return number(num, real)

		},

		trim = function(string, charlist) {

			return rtrim(ltrim(string, charlist), charlist)
		},

		ltrim = function(string, charlist, direction) {

			charlist = charlist ? charlist + '+' : '';

			return (string + '').replace(new RegExp((direction ? '' : '^') + (charlist || space) + (direction ? '$' : '')), '');

		},

		rtrim = function(string, charlist) {

			return ltrim(string, charlist, 1)

		},

		camelCase = function(string) {

			return (string + '').replace(/-\w/g, function(string) {

				return string.substr(1, 1).toUpperCase()
			})
		},

		inObject = function(search, array, type, index) {

			var result = index ? -1 : !1;

			each(array, function(i) {

				if (type ? search === this : search == this) return result = index ? i : real

			})

			return result
		},

		search = function(search, object, type) {

			return inObject(search, object, type, 1)

		},

		replaceUnitis = function(string) {

			return (string + '').replace(/(\d+)(px|rem|em|pt)?/ig, function(a, number, uniti) {

				return number + (uniti || 'px')
			})
		},

		each = function(object, callback) {

			if (!object || !callback || !callback.call) return this;

			var i = 0,

				length = object.length,

				returns;

			if (length !== undefined) {

				for (; i < length; i++) {

					if (object[i] == null) continue;

					returns = callback.call(object[i], i, object);

					if (returns !== undefined) return returns

				}

			} else {

				for (i in object) {

					if (object[i] == null || isWindow(object[i])) continue;

					returns = callback.call(object[i], i, object);

					if (returns !== undefined) return returns

				}
			}
		},

		argument = function(object, start, end) {

			if (!isObject(object)) return [];

			var argumentsArray = [],

				start = int(start),

				end = int(end) || object.length;

			for (var i = 0; i < object.length; i++) {

				if (i >= start && i <= end) argumentsArray.push(object[i])

			}

			return argumentsArray
		},
		merge = function() {

			if (arguments.length < 1) return arguments[0]

			var argumentArray = argument(arguments),

				target = argumentArray[0],

				cover = argumentArray[argumentArray.length - 1] === real,

				argumentArray = argumentArray.slice(1);

			each(argumentArray, function() {

				if (isArray(target) && isArray(this)) {

					target = target.concat(this)

				} else {

					each(this, function(i) {

						if (target[i] === undefined || cover) target[i] = this

					})
				}

			})

			return target
		},

		callback = function() {

			var arg = argument(arguments),

				fun = arg.shift(),

				context = arg.shift() || nick.window;

			if (isFunction(fun)) {

				return fun.apply(context, arg)

			} else if (isString(fun)) {

				var str = fun.split('.'),

					fun = context;

				each(str, function() {

					if (fun) fun = fun[this]
				});
				if (isFunction(fun)) {

					return fun.apply(context, arg)
				}
			}

		},
		css = function(element, style) {

			var element = element || '',

				style = isString(style) ? camelCase(style) : style,

				styleValue,

				notUntis = {

					zIndex: 0,
					opacity:0

				};

			if (element.style[style] !== undefined) {

				var currentStyle = element.currentStyle ? element.currentStyle : nick.window.getComputedStyle(element, null);

				return currentStyle[style]

			} else {

				each(style, function(i) {

					i = camelCase(i);

					if (element.style[i] !== undefined) {

						styleValue = this;

						if (!notUntis[i]) {

							styleValue = replaceUnitis(this)

						}

						element.style[i] = styleValue
					}
				})

			}

		},
		addQueue = function(callback, i, argumentArray) {

			if (!window.test) {
				window.test = [this]
			} else {
				window.test.push(this)
			}

			if (!this[i]) return this;

			var $this = this,

				element = $this[i];

			element.queue = element.queue || [];

			var queue = element.queue;

			if (!queue.length) {

				callback.apply(element, argumentArray)

			}

			queue.push({
				fn: callback,
				arg: argumentArray
			});

		},

		matchprop = function(attrs, element) {

			if (!element) return fake;

			var returns = real;

			each((attrs || '').split('&'), function() {

				if (this == '') return;

				var pattern = this.replace(/([\^\$])=/g, '$1').match(/^(.*?)([\^\$=])(.*)/),

					pattern = pattern || [],

					limit = pattern[2] || fake,

					key = pattern[1],

					value = pattern[3],

					value = key == 'className' ? '.*\\b' + value + '\\b.*?' : value,

					reg = new RegExp((limit == '$' ? '' : '^') + value + (limit == '^' ? '' : '$'), 'ig'),

					value = element[key] || '';

				if (!reg.test(value)) return returns = fake

			});

			return returns;

		},

		ID = /#.+/,

		CLASS = /\..+/,

		byId = function(id, context) {

			var fn = 'getElementById',

				id = id || '',

				tag = id.replace(/^(.+)?#.+/, '$1') || '',

				context = context[fn] ? context : nick.document,

				element = context[fn](id.replace(tag + '#', ''));

			return tag ? (element && element.tagName == tag.toUpperCase() ? [element] : '') : [element];

		},

		byTag = function(tag, context) {

			var elements = [],

				fun = 'getElementsByTagName';

			each(context && context.length ? context : [context], function() {

				var $this = this;

				each($this[fun] ? $this[fun](tag) : fake, function() {

					elements.push(this)
				})

			});

			return elements
		},

		byClass = function(name, context) {

			var fn = 'getElementByClassName',

				name = name || '',

				tag = name.replace(/^(.+)?\..+/, '$1') || '',

				name = name.replace(tag + '.', ''),

				elements = [];

			each(context && context.length ? context : [context], function() {

				var $this = this;

				each($this[fn] ? $this[fn](name) : byTag('*', [$this]), function() {

					var $this = this,

						matchTag = tag ? lowerCase.call(tag) == lowerCase.call($this.tagName) : real;

					if ($this[fn] && matchTag) {

						elements.push($this)

					} else {

						if (matchTag && inObject(name, $this.className.split(/\s+/))) {

							elements.push($this)
						}
					}

				});

			});

			return elements

		},

		parseSelector = function(selector) {

			return (selector || '').replace(/\./g, '&className=').replace(/#/, '&id=').replace(/^(\w+)&?/, 'tagName=$1&')
		},

		children = function(context, selector, relation, loop) { //定义查找元素的关系  默认为子节点，否则可以是下一兄弟或者后面所有兄弟

			var elements = [],
				type = 'nodeType';

			each(context.length ? context : [context], function() {

				var $this = this,

					nodes = relation == '>' ? $this.childNodes : [],

					attr = relation == '+' ? 'nextSibling' : relation == '-' ? 'previousSibling' : relation == '<' ? 'parentNode' : 'nextSibling';

				if (relation && relation != '>') {

					while ($this != null && (relation == '~' || loop ? real : $this != this ? $this.nodeType != 1 : real)) {

						$this = $this[attr];

						if ($this && $this[type] == 1 && (!selector ? real : matchprop(parseSelector(selector), $this)) && !inObject($this, elements)) {

							elements.push($this);

							if (loop) break;
						}

					}

				} else {

					each(nodes, function() {

						var $this = this;

						if ($this[type] == 1 && (!selector ? real : matchprop(parseSelector(selector), $this))) elements.push($this)
					})

				}
			});

			return elements;

		},

		find = function(selector, context) {

			var array = [];

			if (!isString(selector)) {

				if (isElement(selector)) return [selector];

				each(selector, function() {
					if (isElement(this)) array.push(this)
				});

				return array
			}

			each(selector.split(','), function() {

				var elements;

				each(this.split(/\s+/), function() {

					each(this.replace(/([\+>~])/g, ',$1').split(','), function() {

						var relation = this.match(/^([\+>~])/),

							relation = relation && relation[1] ? relation[1] : '',

							selector = this.replace(relation, ''),

							search = ID.test(selector) ? byId : CLASS.test(selector) ? byClass : byTag;

						each(selector.replace(/([^\(]):/g, '$1$:').split('$'), function() {

							var pattern = this.match(/^:(\w+)(.*)/),

								fun = pattern && pattern.length > 1 ? pattern[1] : '',

								filter = fun ? pattern[2].replace(/[\(\):]/g, '') : '',

								selector = this;
							//匹配出过渡函数则执行过滤，否则按常规方式查找元素。

							fun && elements[fun] ? elements[fun](filter || undefined) : relation ? elements = children(elements, selector, relation) : elements = search(selector, elements === undefined ? context : elements);
						});

					})
				});

				array = array.concat(elements);

			});

			return array;

		},

		first = function(start, len) {

			var $this = this;

			$this.splice(start === undefined ? 1 : start, len || this.length);

			return $this
		},

		last = function() {

			return this.first(0, this.length - 1)
		},

		gt = function(index) {
			return this.first(0, index + 1)
		},

		lt = function(index) {
			return this.first(index)
		},

		not = function(index) {
			return this.first(index == 'last' ? this.length - 1 : index == 'first' ? 0 : index, 1)
		},

		eq = function(index) {
			var index = int(index),

				$this = this,

				cur = $this.slice(index, index + 1);

			$this.splice(0, $this.length);

			if (cur.length) $this.push(cur[0]);

			return $this
		},
		
		hasClass = function(className){
				
			return new RegExp('\\b'+className+'\\b').test(this.className)
		},
		
		addClass = function(className){
			
			if(!hasClass.call(this,className))this.className+=' '+className
		},
		
		removeClass = function(className){
			
			var attr = 'className',
			
				$this = this;
				
				$this[attr] = $this[attr].replace(new RegExp('\\b'+className+'\\b'),'');
			
		}

		arrayPrototype = 'first,last,gt,lt,not,eq'.split(','),

		extend = function(object, callback, argumentsArray) {

			var returns = each(object, function(i) {

				return callback.apply(this, [i].concat(argument(argumentsArray)))

			});
			return returns === undefined || returns === fake ? object : returns

		},

		nick = function() {

			return new nick.fn.init(argument(arguments))

		};

	nick.fn = nick.prototype = {

			length: 0,

			init: function(argument) {

				return nick.fn.core.apply(this, argument)

			}
		},

		nick.fn.init.prototype = nick.fn,

		nick.extend = nick.fn.extend = function(object, cover) {

			if (!object) return this;

			for (var i in object) {

				if (!this[i] || cover) this[i] = object[i]
			}

			return this
		};

	
	nick.extend({

			window: window,
			document: document,
			type: type,
			number: number,
			int: int,
			float: float,
			trim: trim,
			ltrim: ltrim,
			rtrim: rtrim,
			camelCase: camelCase,
			// inObject: inObject,
			search: search,
			each: each,
			argument: argument,
			merge: merge,
			callback: callback,
			css: css,
			// 绑定 isObject isNumber isBoolean isString isFunction
			bindIs:function(){

				var self = this;

				class2type.replace( rword , function( klass ){

					self[ is + klass ] = function( t ){

						return type( t ) === klass.toLowerCase();

					}

				})

			}(),

			setWindow: function() {

				if (!this.isWindow(window)) return this;

				this.window = window,

					this.document = window.document,

					this.root = window.document.documentElement

			}

		}),
		
		each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function() {

			type['[object ' + this + ']'] = lowerCase.call(this)

			var name = this;

			nick['is' + name] = function(data) {

				return type(data) == lowerCase.call(name)
			}
		}),
		each([first, last, gt, lt, not, eq], function(i) {
			Array.prototype[arrayPrototype[i]] = this
		}),
		each('pop shift unshift slice sort reverse splice join concat push'.split(' '), function(i) {

			nick.fn[this] = Array.prototype[this];

		}),

		each('array,function,object,element,boolean,window,number'.split(','), function() {
			var $this = this;
			nick[camelCase('is-' + $this)] = function(object) {
				return type(object) == $this
			}
		}),

		each({
			after: 1,
			before: 1,
			append: 1,
			prepend: 1
		}, function(i) {
			nick.fn[i] = function() {
				return this.insertNode.apply(this, [i].concat(argument(arguments)));
			}
		}),

		each({
			first: first,
			last: last,
			eq: eq,
			gt: gt,
			lt: lt
		}, function(i) {

			nick.fn[i] = function() {

				var elements = merge([], this);

				elements[i].apply(elements, arguments);

				return nick().resetElement(elements)
			}
		}),

		each('touchstart touchmove touchend click dblclick mouseover mouseout mouseenter mouseleave focus blur mousemove mousedown load  resize unload mouseup reset keypress select change error scroll mousewheel'.split(' '), function() {
			var type = this;
			nick.fn[type] = function() {
				return this.on.apply(this, [type].concat(argument(arguments)))
			}
		});

	nick.fn.extend({

		context: nick.document,

		length: 0,
		queue: [],

		core: function(selector, context) {

			if (isElement(selector)) {

				this.push(selector)

				return this;
			}

			return this.find(selector, context || this.context)
		},

		find: function(selector, context) {

			var $this = this,

				context = context || ($this.length ? $this : $this.context);

			return this.resetElement(find(selector, context))
		},

		resetElement: function(elements) {

			this.splice(0, this.length),

				this.push.apply(this, isArray(elements) ? elements : [elements]);

			return this

		},

		css: function() {

			return extend(this, function(i, object) {

				return css(this, object)

			}, arguments)
		},

		animate: function() {

			var $self = this;

			return extend(this, function(i) {

				addQueue.call($self, function(i, css, options) {

					var options = merge({

							time: 0,

							callback: '',

							style: 'linear'

						}, options, real),

						$this = $self[i],

						count = time = int((int(options.time) || 600) / 15),

						count = 0,

						fun = isFunction(options.callback) ? options.callback : '',

						sid,

						currentStyles = {},

						subStyles = {},

						style = options.style,

						easeStyle = {};

					each(css, function(i) {

						if ($this.style[i] !== undefined) {

							currentStyles[i] = float(nick.css($this, i)),

								subStyles[i] = float(css[i]) - currentStyles[i],

								easeStyle[i] = 0;

						}

					});

					sid = setInterval(function() {

						count++;

						each(currentStyles, function(i) {

							easeStyle[i] = Math.ceil(callback(style, tween, count, currentStyles[i], subStyles[i], time));

							nick.css($this, easeStyle)

						});
						if (count > time) {

							clearInterval(sid);

							nick.css($this, css)

							var queue = $this.queue || [],

								arg = argument(queue ? queue[0].arg : [], 3);

							queue.shift();

							if (queue.length) queue[0].fn.apply($this, queue[0].arg)

							if (isFunction(options.callback)) options.callback.apply($this, [i].concat(arg));
						}

					}, 15);

				}, i, arguments)

			}, arguments)

		},

		children: function(selector,relation,loop) {
			return this.resetElement(children(this, selector,relation|| '>',loop))
		},

		next: function(selector, loop) {
			return this.children(selector,'+',loop)
		},
		prev: function(selector, loop) {
			return this.children(selector,'-',loop)
		},
		parent: function(selector, loop) {
			return this.children(selector,'<',loop)
		},
		insertNode: function() {

			var relation = {
				after: 1,
				before: 1
			};

			return extend(this, function(i, type, element) {
				//after与before 父级为父级否则为自己
				var $this = this,

					parent = relation[type] ? $this.parentNode : $this,

					html = isString(element),

					sibling = {
						after: 'nextSibling',
						prepend: 'firstChild',
						append: 'null',
						before: 'previousSibling'
					},
					//插入的位置根据节点关系来选择，位置不同则关系属性不同
					sibling = sibling[type] ? $this[sibling[type]] : parent,

					doc = nick.document;

				each(element && element.length && !html ? element : [element], function() {

					var node = this,
						//可能插入的元素是数组所以进行遍历。如果不是元素且是字符串则创建节点

						node = isElement(node) ? node : html ? doc.createElement('div') : '';

					if (html) {
						//将创建节点的内容设置为字符串并先隐藏
						node.innerHTML = this,
							node.style.display = 'none';
					}
					//插入节点
					parent.insertBefore(node, sibling || null);

					if (html) {
						//如果是字符串遍历节点
						each(node.childNodes, function() {
								//将每个节点克隆并插入父级
								parent.insertBefore(this.cloneNode(true), node)
									//克隆完毕将节点删除
							}),
							node.parentNode.removeChild(node);
					}
				});

			}, arguments)
		},
		attr: function() {

			return extend(this, function(i, json) {

				var $this = this;

				if (isString(json)) return $this.getAttribute(json) || $this[json];

				each(json, function(i) {

					i == 'innerHTML' || isString(this) ? $this[i] = this + '' : $this.setAttribute(i, this + '')

				})
			}, arguments)
		},
		html: function(html) {

			if (html === undefined) return this.attr('innerHTML');

			return extend(this, function(i, html) {

				var $this = this;

				try {

					$this.innerHTML = html;

				} catch (e) {

					var node = nick.document.createElement('div'),

						oldNode = $this.childNodes,

						i = oldNode.length - 1;

					node.innerHTML = html;

					while (i > -1) {
						oldNode[i].parentNode.removeChild(oldNode[i]);
						i--;
					}

					$this.appendChild(node),

						each(node.childNodes, function() {
							$this.appendChild(this.cloneNode(true))
						}),

						$this.removeChild(node)

				}

			}, arguments)
		},

		val: function(value) {
			return extend(this, function(i, value) {
				if (value === undefined) return this.value;
				this.value = value;
			}, arguments)
		},

		on: function() {

			var window = nick.window;

			return extend(this, function(i, type, fun, boolean) {

				var type = ltrim('' + type, 'on'),

					$this = this,

					arg = argument(arguments, 3),

					pre = '_events',

					listenter = 'addEventListener';

				if (!$this[pre]) $this[pre] = {};

				var events = $this[pre],

					eventsFunction = function(e) {

						e = e || window.event;

						e.target = e.target || e.srcElement;

						each(events[type], function() {

							if (this.apply($this, [e, i].concat(arg)) === fake) {

								!e.preventDefault || e.preventDefault();

								e.returnValue = fake
							}

						})
					};

				if (!events[type]) {

					events[type] = [fun];

					$this[listenter] ? $this[listenter](type, eventsFunction, boolean) : $this.attachEvent('on' + type, eventsFunction, boolean)

				} else {

					if (!inObject(fun, events[type])) events[type].push(fun)
				}

			}, arguments)
		},

		delEvent: function() {
			return extend(this, function(i, type, fun) {
				var $this = this,
					events = $this['_events'] || {},
					events = events[type],
					index = search(fun, events);
				if (events[index]) events.splice(index, 1)

			}, arguments)

		},

		remove: function() {
			return extend(this, function() {
				this.parentNode.removeChild(this)
			}, arguments)
		},
		
		hasClass:function(){
			return hasClass.apply(this[0],arguments)
		},
		
		addClass:function(){
			
			return extend(this,function(i,className){
				
				if(!hasClass.call(this,className))this.className+=' '+className
				
			},arguments)
			
		},
		
		removeClass:function(){
			
			return extend(this,function(i,className){
				removeClass.call(this,className)
			},arguments)
			
		},
		
		classToggle:function(){
			return extend(this,function(i,className){
				
				(hasClass.call(this,className) ? removeClass:addClass).call(this,className);
				
			},arguments)
			
		}

	});

	window.$ = window.nick = nick;

})(window)
