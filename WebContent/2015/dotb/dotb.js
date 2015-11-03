/**
 * 공통코드
 */
function log(_msg) {
    console.log(_msg);
}
function deb(_msg) {
    console.debug(_msg);
}
function err(_msg) {
    console.error(_msg);
}

var w =
    {};
w.width = 0;
w.height = 0;
window.onresize = wresize;
function wresize() {
    w.width = $(window).width();
    w.height = $(window).height();
}

/**
 * RGB 코드를 Hex 코드로 변경하는 루틴
 * 
 * @developer RS.Ryu
 * @date : 2015.10.16
 */
function rgb2hex(rgb, _idx) {
    if (rgb.search("rgb") == -1) {
	return rgb;
    }
    else {
	rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
	function hex(x) {
	    return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	_idx = _idx || -1;
	if (_idx == -1) {
	    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}
	else {
	    return hex(rgb[_idx]);
	}
    }
}

/**
 * 원형
 */

var dotb =
    {};

dotb.map = null;
dotb.scene = null;
dotb.ui = null;
dotb.control = null;
dotb.msg = null;
dotb.result = null;
dotb.editlayer = null;

/**
 * 에디트 레이어를 정의한다.
 * 
 * @contructor RS.Ryu
 * @date 2015.10.26
 */
editlayer =
    {
	layer : null,
	name : "",
	getlayer : function() {
	    return this.layer;
	},
	getlayername : function() {
	    var m_msg = "getlayername : ";
	    try {
		if (this.name == "") {
		    m_msg = this.layer.get("layer");
		    return this.layer.get("layer");
		}
	    }
	    catch (e) {
		err(e.toString());
		throw e.toString();
	    }
	    finally {
		debMsg(m_msg);
		// return null;
	    }
	},
	setlayer : function(_layer) {
	    try {

	    }
	    catch (e) {

	    }
	    finally {

	    }
	}
    };
dotb.editlayer = editlayer;

dotb.constructor = function() {

    console.log("DOTB!");
};

var msg =
    {};
msg.en =
    {};
msg.en.NeedValue = "Need Value : ";
msg.en.CheckType = "Check params type : ";
msg.en.Number = "Number";
msg.en.String = "String";
msg.en.Function = "Function";
msg.en.Object = "Object";
msg.en.CreateCmd = " Command has been entered successfully ";
msg.en.NeedCmd = "Need Command : ";
msg.en.NeedSubset = "Need command subset : ";
msg.en.CannotFindCommand = "Can not find command : check 'cmd list'";
dotb.msg = msg;

/**
 * 히스토리를 저장하는 부분 (sessionStorage 사용)
 * 
 * @developer RS.Ryu
 * @date : 2015.10.20
 */

var result =
    {
	cursor : 0,
	history : 0,
	debugCountDivId : "cmdpannel_debug_count",
	debugConsoleId : "cmdpannel_body",
	create : function() {
	    sessionStorage.setItem('count', 0);
	    this.cursor = 0;
	},
	insert : function(_cmd) {
	    if (sessionStorage.count) {
		this.cursor = parseInt(sessionStorage.count) + 1;
		sessionStorage.setItem('count', this.cursor);
		sessionStorage.setItem(this.cursor, _cmd);
		// 디버그 창에 내용을 쓴다.
		$("#" + this.debugCountDivId).text(this.cursor);
		// 맨 하단으로 유지한다.
		$("#" + this.debugConsoleId).scrollTop(
			$("#" + this.debugConsoleId)[0].scrollHeight);
		this.history = this.cursor;
	    }
	},
	get : function(_key) {
	    return sessionStorage.getItem(_key);
	},

    };
dotb.result = result;

/**
 * 커맨드를 정의하는 부분 (cmd.js)
 * 
 * @developer RS.Ryu
 * @date : 2015.10.19 ~ 2015.10.20
 */

var cmd =
    {
	// 커맨드는 항상 lists 변수에 저장되어야 한다.
	list : [],
	isCmd : function(_cmd) {
	    // cmd.lists에 있는 내용이면 참을 반환
	    for ( var i in this.lists) {
		if (_cmd == lists) {
		    return true;
		}
	    }
	    return false;
	},

	// 명령어 생성이 되면 참, 아니면 거짓을 반환한다.
	// 명령어는 커맨드, 서브셋으로 구성되며, 실행은 커맨드+서브셋이 결합된 형태여야 한다.
	createCmd : function(_cmd, _subset, _func) {
	    if (_cmd == "" || _cmd === undefined || _cmd == null
		    || _cmd === "String")
	    {
		err("명령어가 필요합니다.");
	    }
	    if (_subset == "" || _subset === undefined || _subset == null
		    || _subset === "object")
	    {
		err("서브셋이 필요합니다.");
	    }
	    if (this.isCmd(_cmd) == false) {
		// 커맨드가 없으면 생성함.
		deb(_cmd + msg.en.CreateCmd);
		this.list;
		this.list.push(
		    {
			cmd : _cmd,
			sub : _subset,
			func : _func
		    });
		ui.debugConsole.html(ui.debugConsole.html()
			+ "</br><span class='div-color-red'>Create : " + _cmd
			+ " " + _subset + "</span>");
		deb("Create Command " + _cmd + " " + _subset);
	    }
	    return true;
	},
	excuteCmd : function(_cmdline) {
	    // 명령어 실행시 모든 문자를 소문자로 변경한다. (대소문자 문제 해결하기 위함)
	    // _cmdline = _cmdline.toLowerCase();
	    try {
		var cmdObj = this.getCmdObject(this.getCmd(_cmdline)
			.toLowerCase());
		for ( var i in cmdObj) {
		    if (cmdObj[i]["subset"] == this.getSubset(_cmdline)
			    .toLowerCase())
		    {
			// 커맨드와 서브셋이 일치한 함수를 실행시킨다.
			cmdObj[i]["func"](this.getArgs(_cmdline));
			result.insert(_cmdline);
			ui.debugConsole.html(ui.debugConsole.html()
				+ "</br>Command : " + _cmdline);
			return true;
		    }
		}
		// 명령어가 없는 경우
		ui.debugConsole.html(ui.debugConsole.html()
			+ "</br>Command : <span class='div-color-red'>"
			+ _cmdline + "</span>");
		debMsg("<b>" + _cmdline + "</b></br>"
			+ msg.en.CannotFindCommand);
		return false;
	    }
	    catch (e) {
		// 문제가 발생한 경우
		ui.debugConsole.html(ui.debugConsole.html()
			+ "</br>Command : <span class='div-color-red'>"
			+ _cmdline + "</span>");
		debMsg("<b>" + _cmdline + "</b></br>"
			+ msg.en.CannotFindCommand + newline + e.toString());
	    }

	},
	parseCmd : function(_cmdline) {
	    // 3개로 분리한다. (명령어, 서브셋, 아규먼트)
	    var commands = _cmdline.split(" ");
	    var cmd = commands[0];
	    var subset = commands[1];
	    var arguments = "";
	    for ( var i in commands) {
		if (i >= 2) {
		    arguments += commands[i];
		    if (i != commands.length - 1) {
			// 스페이스가 빠져 있으므로 추가한다.
			arguments += " ";
		    }
		}
	    }
	    /*
	     * deb("cmd : " + cmd); deb("subset : " + subset); deb("arguments : " +
	     * arguments);
	     */

	    return true;
	},
	getCmd : function(_cmdline) {
	    var commands = _cmdline.split(" ");
	    return commands[0];
	},
	getCmdObject : function(_cmd) {
	    // 커맨드를 넣으면 해당 서브셋과 기타 내용을 리턴한다.
	    var result = [];
	    for ( var i in this.list) {
		if (this.list[i].cmd == _cmd) {
		    // 명령어가 일치하는 경우임.
		    var returnValue =
			{
			    subset : this.list[i].sub,
			    func : this.list[i].func
			};
		    result.push(returnValue);
		}
	    }
	    return result;
	},
	getSubset : function(_cmdline) {
	    var commands = _cmdline.split(" ");
	    return commands[1];
	},
	getArgs : function(_cmdline) {
	    var commands = _cmdline.split(' ');
	    var arguments = [];
	    if (commands.length <= 2) {
		// 아규먼트가 없거나 명령어 완성이 덜 된 경우
		return "";
	    }
	    var m_args = "";
	    for ( var i in commands) {
		if (i >= 2) {
		    m_args += commands[i];
		}
	    }

	    // 공용변수 분리 루틴 추가 (2015.10.28, Rs.Ryu)
	    var m_tempArgs = m_args.split('$');
	    var m_argFields = m_args.split('{');
	    for ( var i in m_argFields) {
		// 처음 아규먼트는 빈칸임 (split 특징)
		if (i >= 1) {
		    var m_idx = m_argFields[i].indexOf("}");
		    if (m_idx != -1) {
			// } 문자가 없는 경우를 제외하고, 나머지를 잘라 넣어준다.
			arguments.push(m_argFields[i].substr(0, m_idx));
		    }
		}
	    }

	    /*
	     * for ( var i in commands) { if (i >= 2) { // 아규먼트는 배열로 받는다.
	     * arguments.push(commands[i]); } }
	     */
	    return arguments;
	},

    };
dotb.cmd = cmd;

/**
 * UI 템플릿을 정의하는 부분
 * 
 * @developer RS.Ryu
 * @date : 2015.10.16
 */

var ui =
    {
	// 디버그 (명령어만 저장한다)
	debugConsole : null,
	debugCount : null,
	// 디버그 메시지 창 (저장하지 않고 메시지만 출력한다)
	debugMessage : null,
	headers :
	    {
		header : null,
		buttons : [],
		addMenu : function(_align, _width, _text, _onClick) {
		    if (_width <= 0) {
			throw msg.en.NeedValue + "width";
		    }
		    if ((_align != "left") && (_align != "right")
			    && (_align != "center"))
		    {
			throw msg.en.CheckType + "left, " + "right, "
				+ "center";
		    }
		    var _idx = this.buttons.length;
		    var btnId = "header_btn" + _idx;
		    var btn = $("<div id='header_menu" + _idx
			    + "'><span class='div-ui-menu-span'>" + _text
			    + "</span></div>");
		    btn.removeAttr("style");
		    btn.addClass("dotb-ui-menu-div");
		    btn.mouseenter(function() {
			// 마우스가 오버랩시 색상을 변경함.

		    });
		    this.header.append(btn);
		    btn.css(
			{
			    width : _width + 'px',
			    height : $(this.header).height(),
			});
		    if (_onClick !== undefined) {
			// 함수가 있으면 실행한다.
			btn.click(_onClick);
		    }
		    this.buttons.push(btn);
		    return btn;
		},
		addSubMenu : function(_parent, _height) {
		    var parentId = _parent.val('id')[0].attributes
			    .getNamedItem('id').value;
		    var subId = parentId + "_sub";
		    var submenu = $("<div id='" + subId
			    + "' class='div-ui-menu-sub'></div>");
		    submenu.css(
			{
			    width : w.width,
			    height : _height
			});
		    var parentmenu = $("#" + parentId);
		    parentmenu.click(function() {
			parentmenu.toggleClass("div-ui-menu-sub-color");
			submenu.slideToggle("fast", function() {
			});
		    });
		    submenu.hide();
		    this.header.append(submenu);
		    return submenu;
		},
		addSubButton : function(_text, _type, _img) {

		},

	    },

	// 커맨드 바를 추가한다.
	addCommandBar : function() {
	    var cmdbar = $("<div id='cmdbar'></div>");
	    cmdbar.addClass("div-ui-cmdbar");
	    cmdbar.addClass("input-group");
	    $("body").append(cmdbar);

	    // 커맨드 패널 추가 (콘솔 역할을 함)
	    var cmdpannel = $("<div id='cmdpannel'></div>");
	    cmdpannel.addClass("panel panel-default");
	    cmdpannel.addClass("div-ui-cmdbar-pannel");
	    cmdbar.append(cmdpannel);

	    var cmdpannel_header = $("<div id='cmdpannel_header'></div>");
	    cmdpannel_header.addClass("panel-heading");
	    cmdpannel_header.addClass("div-ui-cmdbar-pannel-header");
	    cmdpannel.append(cmdpannel_header);
	    var spanConsole = $("<span>Console </span>");
	    spanConsole.addClass("label label-default");
	    spanConsole.addClass("div-ui-cmdbar-pannel-debug ");
	    cmdpannel_header.append(spanConsole);

	    var spanHistory = $("<span>History </span>");
	    spanHistory.addClass("label label-primary");
	    spanHistory
		    .addClass("div-ui-cmdbar-pannel-debug div-ui-cmdbar-pannel-history");
	    cmdpannel_header.append(spanHistory);
	    var spanNum = $("<span id='cmdpannel_debug_count'></span>");
	    spanNum.addClass("badge");
	    spanHistory.append(spanNum);

	    // 커맨드를 표시할 부분
	    var cmdpannel_body = $("<div id='cmdpannel_body'></div>");
	    cmdpannel_body.addClass("panel-body");
	    cmdpannel_body.addClass("div-ui-cmdbar-pannel-body");
	    cmdpannel.append(cmdpannel_body);
	    this.debugConsole = cmdpannel_body;

	    // 디버그 메시지 창 관련 패널 설정
	    var cmddebug = $("<div id='cmddebug'></div>");
	    cmddebug.addClass("panel panel-default");
	    cmddebug.addClass("div-ui-debugbar");
	    $(cmdbar).append(cmddebug);
	    var cmddebug_header = $("<div id='cmddebug_header'></div>");
	    cmddebug_header.addClass("panel-heading");
	    cmddebug_header.addClass("div-ui-cmdbar-pannel-header");
	    cmddebug.append(cmddebug_header);
	    var cmddebug_span = $("<span>Debug </span>");
	    cmddebug_span.addClass("label label-warning");
	    cmddebug_span.addClass("div-ui-cmdbar-pannel-debug");
	    cmddebug_span.addClass("div-color-black");
	    cmddebug_header.append(cmddebug_span);

	    // 디버그 내용을 표시할 부분
	    var cmddebug_body = $("<div id='cmddebug_body'>");
	    cmddebug_body.addClass("panel-body div-ui-debugbar-body");
	    cmddebug.append(cmddebug_body);
	    this.debugMessage = cmddebug_body;

	    /* //커맨드 패널 중, 이 부분에서 출력할 내용을 결정함. */
	    var inputbar = $("<input id='cmdbar_input' type='text' placeholder='commands subset arguments'>");
	    inputbar.addClass("form-control");
	    cmdbar.append(inputbar);

	    $(document)
		    .keydown(
			    function(e) {
				$("#cmdpannel_body").scrollTop(
					$("#cmdpannel_body")[0].scrollHeight);
				switch (e.which)
				{
				    case 13: // enter
					if ($("#cmdbar")[0].style.display == ""
						|| $("#cmdbar")[0].style.display == "none")
					{
					    log("cmd is not run.");
					}
					else {
					    // 명령어가 없는 경우는 실행하지 않는다.
					    if ($("#cmdbar_input").val() != "")
					    {
						// 명령어가 있는 경우에
						// 커맨드에 추가한다.
						if (!cmd.excuteCmd($(
							"#cmdbar_input").val()))
						{
						    // 명령어가
						    // 실제
						    // cmd.list에
						    // 들어있지
						    // 않은 경우
						    // debMsg(msg.en.CannotFindCommand);

						}
						$("#cmdbar_input").val("");
					    }
					}
					$("#cmdbar_input").focus();
					break;
				    case 192: // ~ 표시
					// '~'가 눌렸을 경우
					cmdbar.slideToggle("fast", function() {
					    deb(cmdbar);
					    // 이전 입력된 내용을 지운다.
					    $("#cmdbar_input").val("");
					    $("#cmdbar_input").focus();
					});
					break;
				    /*
				     * case 37: // left deb("left " + e.which);
				     * 
				     * break;
				     */

				    case 38: // up
					deb("up " + e.which);
					$("#cmdbar").show();
					// 히스토리에 있는 내용을 가져와 input 필드에 쓴다.
					var history = dotb.result
						.get(dotb.result.history);
					$("#cmdbar_input").val(history);
					$("#cmdbar_input").focus();
					if (dotb.result.history > 1) {
					    dotb.result.history -= 1;
					}
					break;

				    /*
				     * case 39: // right deb("right " +
				     * e.which); break;
				     */

				    case 40: // down
					deb("down " + e.which);
					$("#cmdbar").show();
					// 히스토리에 있는 내용을 가져와 input 필드에 쓴다.
					var history = dotb.result
						.get(dotb.result.history);
					$("#cmdbar_input").val(history);
					$("#cmdbar_input").focus();
					if (dotb.result.history < dotb.result.cursor)
					{
					    dotb.result.history += 1;
					}
					break;

				    default:
					return; // exit this handler for
					// other keys
				}
				$("#cmdpannel_body").scrollTop(
					$("#cmdpannel_body")[0].scrollHeight);
				e.preventDefault(); // prevent the default
				// action
				// (scroll / move caret)
			    });

	    /*
	     * $("body").keypress(function(_evt){
	     * 
	     * if(_evt.keyCode == 13){ //엔터키가 눌렸을 경우 (커맨드가 보이지 않는 경우에는 커맨드 입력을
	     * 받지 않는다.) if($("#cmdbar")[0].style.display == "" ||
	     * $("#cmdbar")[0].style.display == "none"){ log("cmd is not run."); }
	     * else{ //명령어가 없는 경우는 실행하지 않는다. if($("#cmdbar_input").val() != ""){
	     * //명령어가 있는 경우에 커맨드에 추가한다.
	     * if(!cmd.excuteCmd($("#cmdbar_input").val())){ //명령어가 실제 cmd.list에
	     * 들어있지 않은 경우 debMsg(msg.en.CannotFindCommand); }
	     * $("#cmdbar_input").val(""); } } $("#cmdbar_input").focus(); }
	     * if(_evt.keyCode == 96){ //'~'가 눌렸을 경우 cmdbar.slideToggle("fast",
	     * function(){ deb(cmdbar); //이전 입력된 내용을 지운다.
	     * $("#cmdbar_input").val(""); $("#cmdbar_input").focus(); }); }
	     * if(_evt.keyCode == )
	     * $("#cmdpannel_body").scrollTop($("#cmdpannel_body")[0].scrollHeight);
	     * });
	     */
	    cmdbar.hide();
	},

	content : null,
	footer : null,
	getHeight : function(_arry) {
	    var totalHeight = 0;
	    if (_arry != null) {
		totalHeight += _arry.height();
	    }
	    return totalHeight;
	},
	getHeadersHeight : function() {
	    var totalHeight = this.getHeight(this.headers.header);
	    return totalHeight;
	},
	getFooterHeight : function() {
	    var totalHeight = this.getHeight(this.footer);
	    return totalHeight;
	},

	/**
	 * 높이 계산시 사용하는 함수
	 * 
	 * @developer RS.Ryu
	 * @date : 2015.10.16
	 */
	calcHeight : function() {
	    return $(window).height() - this.getHeadersHeight()
		    - this.getFooterHeight();
	},
	getHeaders : function(_idx) {
	    _idx = idx || -1;
	    if (_idx == -1) {
		return this.headers.header;
	    }
	    else {
		return this.headers.header(_idx);
	    }
	},
	getFooter : function(_idx) {
	    _idx = idx || -1;
	    if (_idx == -1) {
		return this.footer;
	    }
	    else {
		return this.footer(_idx);
	    }
	},

	/**
	 * 자동 생성하기
	 * 
	 * @developer RS.Ryu
	 * @date : 2015.10.16
	 */
	contentHeight : 0,

	addHeader : function(_height) {
	    _height = _height || "50";
	    var naviTemp = $("<div id='header'>");

	    $("body").append(naviTemp);
	    naviTemp.removeAttr("style");
	    naviTemp.css(
		{
		    height : _height + 'px',
		});
	    naviTemp.addClass("dotb-ui-header");
	    this.headers.header = naviTemp;
	    deb("ui.addHeader");
	},

	/**
	 * 콘텐츠 부분 세팅
	 */
	addContent : function(_height) {

	    _height = _height || this.calcHeight();
	    ;
	    var contentTemp = $("<div id='content'></div>");
	    contentTemp.addClass("div-ui-content");
	    contentTemp.css(
		{
		    height : _height + 'px',
		});
	    $("body").append(contentTemp);
	    this.content = contentTemp;
	    deb("ui.addContent");
	},

	/**
	 * 하단 부분 세팅
	 */
	addFooter : function(_height) {
	    _height = _height || "50";
	    var footerTemp = $("<div id='footer'></div>");
	    footerTemp.css(
		{
		    width : '100%',
		    bottom : '0px',
		    left : '0px',
		    position : 'absolute',
		    height : _height + 'px',

		});
	    $("body").append(footerTemp);
	    this.footer = footerTemp;
	    deb("ui.addFooter");
	},
	loader :
	    {
		loader : null,
		dialog : null,
		content : null,
		header : null,
		body : null,
		bar : null,
	    },
	addLoader : function() {
	    var pLoader = $("<div id='pLoader'></div>");
	    pLoader.addClass("modal js-loading-bar");
	    $("body").append(pLoader);
	    this.loader.loader = pLoader;

	    var pDialog = $("<div id='pDialog'></div>");
	    pDialog.addClass("modal-dialog");
	    $(pLoader).append(pDialog);
	    this.loader.dialog = pDialog;

	    var pContent = $("<div id='pContent'></div>");
	    pContent.addClass("modal-content");
	    $(pDialog).append(pContent);
	    this.loader.content = pContent;

	    var pHeader = $("<div id='pHeader'></div>");
	    pHeader.addClass("modal-header");
	    $(pContent).append(pHeader);
	    this.loader.header = pHeader;

	    var pBody = $("<div id='pBody'></div>");
	    pBody.addClass("modal-body");
	    $(pHeader).append(pBody);
	    this.loader.body = pBody;

	    var pBar = $("<div id='pBar' role='progressbar'></div>");
	    pBar.addClass("progress progress-popup progress-bar-warning");
	    $(pBody).append(pBar);
	    this.loader.bar = pBar;

	    deb("ui.addLoader");
	},
	loaderStart : function(_headerContent) {
	    this.loader.loader.modal('show');
	    this.loader.dialog.addClass('modal-sm');
	},
	loaderEnd : function() {
	    this.loader.loader.modal('hide');
	}
    };
dotb.ui = ui;

function debMsg(_html) {
    ui.debugMessage.html(_html);
}
