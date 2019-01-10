/* 
 * Javascript BBCode Parser Config Options
 * @author Philip Nicolcev
 * @license MIT License
 */

var parserColors = [ 'gray', 'silver', 'white', 'yellow', 'orange', 'red', 'fuchsia', 'blue', 'green', 'black', '#cd38d9' ];

var parserTags = {
	'b': {
		openTag: function(params,content) {
			return '<b>';
		},
		closeTag: function(params,content) {
			return '</b>';
		}
	},
	'code': {
		openTag: function(params,content) {
			return '<code>';
		},
		closeTag: function(params,content) {
			return '</code>';
		},
		noParse: true
	},
	'color': {
		openTag: function(params,content) {
			var colorCode = params.substr(1) || "inherit";
			BBCodeParser.regExpAllowedColors.lastIndex = 0;
			BBCodeParser.regExpValidHexColors.lastIndex = 0;
			if ( !BBCodeParser.regExpAllowedColors.test( colorCode ) ) {
				if ( !BBCodeParser.regExpValidHexColors.test( colorCode ) ) {
					colorCode = "inherit";
				} else {
					if (colorCode.substr(0,1) !== "#") {
						colorCode = "#" + colorCode;
					}
				}
			}

			return '<span style="color:' + colorCode + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		}
	},
	'i': {
		openTag: function(params,content) {
			return '<i>';
		},
		closeTag: function(params,content) {
			return '</i>';
		}
	},
	'img': {
		openTag: function(params,content) {

			var myUrl = content;

			BBCodeParser.urlPattern.lastIndex = 0;
			if ( !BBCodeParser.urlPattern.test( myUrl ) ) {
				myUrl = "";
			}

			return '<img class="bbCodeImage" src="' + myUrl + '">';
		},
		closeTag: function(params,content) {
			return '';
		},
		content: function(params,content) {
			return '';
		}
	},
	'list': {
		openTag: function(params,content) {
			return '<ul>';
		},
		closeTag: function(params,content) {
			return '</ul>';
		},
		restrictChildrenTo: ["*", "li"]
	},
	'noparse': {
		openTag: function(params,content) {
			return '';
		},
		closeTag: function(params,content) {
			return '';
		},
		noParse: true
	},
	'quote': {
		openTag: function(params,content) {
			return '<blockquote>';
		},
		closeTag: function(params,content) {
			return '</blockquote>';
		}
	},
	's': {
		openTag: function(params,content) {
			return '<s>';
		},
		closeTag: function(params,content) {
			return '</s>';
		}
	},
	'size': {
		openTag: function(params,content) {
			var mySize = parseInt(params.substr(1),10) || 0;
			if (mySize < 10 || mySize > 20) {
				mySize = 'inherit';
			} else {
				mySize = mySize + 'px';
			}
			return '<span style="font-size:' + mySize + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		}
	},
	'u': {
		openTag: function(params,content) {
			return '<span style="text-decoration:underline">';
		},
		closeTag: function(params,content) {
			return '</span>';
		}
	},
	'url': {
		openTag: function(params,content) {

			var myUrl;

			if (!params) {
				myUrl = content.replace(/<.*?>/g,"");
			} else {
				myUrl = params.substr(1);
			}

			BBCodeParser.urlPattern.lastIndex = 0;
			if ( !BBCodeParser.urlPattern.test( myUrl ) ) {
				myUrl = "#";
			}

			BBCodeParser.urlPattern.lastIndex = 0;
			if ( !BBCodeParser.urlPattern.test( myUrl ) ) {
				myUrl = "";
			}

			return '<a href="' + myUrl + '">';
		},
		closeTag: function(params,content) {
			return '</a>';
		}
	},

	//COMUNIC ADD BEGIN

	'left': {
		openTag: function(params,content) {
			return '<p style="text-align: left;">';
		},
		closeTag: function(params,content) {
			return '</p>';
		}
	},

	'center': {
		openTag: function(params,content) {
			return '<p style="text-align: center;">';
		},
		closeTag: function(params,content) {
			return '</p>';
		}
	},

	'right': {
		openTag: function(params,content) {
			return '<p style="text-align: right;">';
		},
		closeTag: function(params,content) {
			return '</p>';
		}
	},

	'justify': {
		openTag: function(params,content) {
			return '<p style="text-align: justify;">';
		},
		closeTag: function(params,content) {
			return '</p>';
		}
	},

	'ul': {
		openTag: function(params,content) {
			return '<ul>';
		},
		closeTag: function(params,content) {
			return '</ul>';
		}
	},

	'ol': {
		openTag: function(params,content) {
			return '<ol>';
		},
		closeTag: function(params,content) {
			return '</ol>';
		}
	},

	'li': {
		openTag: function(params,content) {
			return '<li>';
		},
		closeTag: function(params,content) {
			return '</li>';
		}
	},

	'sup': {
		openTag: function(params,content) {
			return '<sup>';
		},
		closeTag: function(params,content) {
			return '</sup>';
		}
	},

	'sub': {
		openTag: function(params,content) {
			return '<sub>';
		},
		closeTag: function(params,content) {
			return '</sub>';
		}
	},

	'ltr': {
		openTag: function(params,content) {
			return '<div style="text-align: left;">';
		},
		closeTag: function(params,content) {
			return '</div>';
		}
	},

	'rtl': {
		openTag: function(params,content) {
			return '<div style="text-align: right;">';
		},
		closeTag: function(params,content) {
			return '</div>';
		}
	},


	'table': {
		openTag: function(params,content) {
			return '<table border="1" style="margin: auto;">';
		},
		closeTag: function(params,content) {
			return '</table>';
		}
	},

	'tr': {
		openTag: function(params,content) {
			return '<tr>';
		},
		closeTag: function(params,content) {
			return '</tr>';
		}
	},

	'td': {
		openTag: function(params,content) {
			return '<td>';
		},
		closeTag: function(params,content) {
			return '</td>';
		}
	},

	'hr': {
		openTag: function(params,content) {
			return '<hr />';
		},
		closeTag: function(params,content) {
			return '';
		},
		content: function(params, content){
			return '';
		}
	},

	//COMUNIC ADD END
};
