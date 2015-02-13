function isSameLayerName(_layername){
	for(var i in geodtjs.map2d.map.layers){
		if(geodtjs.map2d.map.layers[i].name == _layername){
			return geodtjs.map2d.map.layers[i];
		}
	}
	return null;
}
document.write("<script src='builder/define.menu.js'></script>");
document.write("<script src='builder/define.msg.js'></script>");

var geodtjs = {};
geodtjs.map2d = {
			projection : new OpenLayers.Projection("EPSG:900913"),
			displayprojection : new OpenLayers.Projection("EPSG:4326"),
			map : undefined,
			divid : "",
			
			//see define list : Proj4js / defs
			setProjList : function(){
				if(typeof Proj4js == "object"){
					this.projlist = Proj4js.defs;
					for(var i in this.projlist){
						this.projnames.push(i);
					}
				}
				else{
					this.projlist = undefined;
					this.projnames = [];
				}
			},
			projlist : undefined,
			projnames : [],
			getProjByName : function(_name){
				if(typeof this.projlist == "undefined"){
					this.setProjList();
				}
				return this.projlist[_name];
			},
			getProjNames : function(){
				if(typeof this.projlist == "undefined"){
					this.setProjList();
				}
				var rlt = [];
				for(var i in this.projlist){
					rlt.push(i);
				}
				return rlt;
			},
			//dataformat
			setWMSParams : function(_url, _wmslayer,_isbase){
				var param = {};
				param.url = _url;		//wms에 등록된 레이어 이름
				param.wmslayer = _wmslayer;		//wms에 등록된 레이어 이름
				param.isbaselayer = _isbase;		//true or false
				console.log(param);
				return param;  
			},
			
			/*
			 * 오픈 레이어스를 생성
			 * */
			create : function(_div){
				if(_div === "String") throw "<DIV> Tag name is not STRING format.";
				
				this.map = new OpenLayers.Map(_div, {
					projection: this.projection,
					displayprojection : this.displayprojection,
					zoom:19
				});
				this.divid = _div;
				
				$(document).ready(function(){
					resizeContent();
					$(window).resize(function(){
						resizeContent();
					});			
				});

				function resizeContent(){
					$("#openlayersmap").height($(window).height());
				}
			},
    setmap : function(olMap){
        this.map = olMap;
    },
			/*
			 * 기본지도를 입력함.
			 * */
			addbasemap : function(_basemap){
				if(!this.mapchecker())	throw "기본지도를 추가할 수 없습니다.";
				switch(_basemap){
				case "google":
					this.map.addLayer(new OpenLayers.Layer.Google("google",{type:google.maps.MapTypeId.ROADMAP,numZoomLevels:19}));
					break;
				case "osm":
					this.map.addLayer(new OpenLayers.Layer.OSM("osm"));
					break;
				}
			},
			
			/*
			 * 레이어를 추가함
			 * params는 wms 레이어일 때 필요함.
			 * */			
			addlayer:function(_type, _name, _params){
				var _layer;
				switch(_type){
				case "base":
					this.addbasemap(_name);
					console.log( _type + " 레이어가 등록 되었습니다.");
					break;
				case "vector" :
					_layer = new OpenLayers.Layer.Vector(_name);
					this.map.addLayer(_layer);
					console.log( _type + " 레이어가 등록 되었습니다.");
					this.layers.push(_layer);
					break;
				case "wms" :
					if(_params == null) throw "WMS 레이어 등록은 파라미터가 필수 요소입니다.";
					if(_params == undefined) throw "WMS 레이어 등록은 파라미터가 필수 요소입니다.";
					if(_params.wmslayer == undefined) throw "WMS 파라미터 params.wmslayer가 등록되지 않았습니다.";
					else if(_params.wmslayer == "") throw "WMS 파라미터 params.wmslayer의 레이어 이름이 없습니다.";
					else if(_params.url == "") throw "WMS 파라미터 param.url이 비어 있습니다.";
					if(_name == "") _name = "WMS_undefined";
					_layer = new OpenLayers.Layer.WMS(
						_name,
						_params.url,
						{
							'layers' : _params.wmslayer,
							transparent : true,
						},
						{
							isBaseLayer : _params.isbase
						}  
						);
					notify("success", _type + " 레이어가 등록 되었습니다.");
					
					this.map.addLayer(_layer);
					this.layers.push(_layer);
					break;
				case "database" :
					console.log( _type + " 레이어가 등록 되었습니다.");
					this.layers.push(_layer);
					break;
				}
				return _layer;
			},
			
			layers : [],
			
			/*
			 * 지도가 제대로 생성되어 있는지 확인하는 부분
			 * 추가가 필요함
			 * */
			mapchecker : function(){
				var checker = true;
				if(this.map == undefined){
					console.error(errmsg.MAPCHECKER_not_define_map);
					checker = false;
				}
				else if(this.divid == ""){
					console.error(errmsg.MAPCHECKER_not_define_divname);
					checker = false;
				}
				return checker;
			}

};


document.write("<script src='util.js'></script>");

geodtjs.ui = {

		mapid : "",
		create : function(_mapid){
			this.mapid = _mapid;
		},
		dialogs : [],
		ui : [],
		zindex : 9000,
		idname : "geodtjs_ui_",
		
		getZposition:function(){
			return this.zindex += 1;
		},
		
		addTextBar : function (_id, _top, _left){
			var mapelem = document.getElementById(this.mapid);
			
			var div = document.createElement('div');
			div.id = "geodtjs_ui_textbar_"+_id;
			div.name = "geodtjs_ui_textbar_"+_id;
			div.style.width = '50%';
			div.style.height = '30px';
			div.style.position = 'absolute';
			div.style.zIndex = this.getZposition();
			div.style.margin = "0 auto";
			div.style.left='25%';
			div.align = 'center';
			
			var textbar = document.createElement('input');
			textbar.id = _id;
			textbar.name = _id;
			textbar.type = "text";
			textbar.style.width = '100%';
			textbar.style.height = '100%';			
			//textbar.setAttribute("data-clear-btn", "true");
			div.appendChild(textbar);
			
			mapelem.appendChild(div);
		},
		
		/*
		 * 버튼 생성 
		 * */
		
		createButton: function(_id, _icon, _text, _func){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}
			var div = $("<div id = 'geodtjs_ui_button_"+ _id + "'></div>");
			div.position({
				'my' : 'right top',
				'at' : 'right top',
				//'of' : $("#"+this.mapid)
				'of' : $(window)
			});
			
			var poswidth = $(window).width();
			console.log(poswidth);
			
			div.css({
				'position' : 'absolute',
				'z-index' : this.getZposition(),
				'top' : this.mainbuttons.length * 80 + 'px',
				'left' : poswidth - 130 + 'px',
			}).appendTo($("#openlayersmap"));
			var button = $("<button>"+_text+"</button>").button({
				icons : {
					primary : "ui-icon-gear"			//icon
				},
				text : true
			}).click(_func);
			
			button.appendTo(div);
			this.mainbuttons.push(div);
			return div;
		},
		
		createButtonDialog: function(_id, _icon, _text, _func, _dialog){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}
			var div = $("<div id = 'geodtjs_ui_button_"+ _id + "'></div>");
		
			div.css({
				'position' : 'absolute',
				'z-index' : this.getZposition(),
			}).appendTo($(_dialog));
			var button = $("<button>"+_text+"</button>").button({
				icons : {
					primary : "ui-icon-gear"			//icon
				},
				text : true
			}).click(_func);
			
			button.appendTo(div);
			this.mainbuttons.push(div);
			return div;
		},
		
		createUploader: function(_id, _icon, _text, _func){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}

			return test;
		},
		
		mainbuttons : [],
		
		
		
		
		/*
		 * 다이얼로그 생성 루트
		 * */
		createDialog: function(_id, _title, _appends, _width){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}
			console.log("다이얼로그 생성");
			
			var dialogid = "geodtjs_ui_dialog_"+ _id;
			
			var div = $("<div id =  " + dialogid +"'></div>")
			.attr({
				id:dialogid,
				name:dialogid,
				});
			var style = $('<div></div>')
			.css({
				'maxWidth' : parseInt($(window).width() * 0.8) + 'px',
				'maxHeight' : parseInt($(window).height() * 0.8) + 'px',
				'z-index' : this.getZposition(),
				'overflow' : 'auto',
/*				'top' : '100px',*/
				'my' : "center, top",
				'at' : "center, top",
				'of' : $(window)
			}).appendTo(div);
			
			if(_appends instanceof Array){
				_appends[0].appendTo(div);
			}
			
			var dialog = div.dialog({
				open:function(){
					
				},
				modal : true,
				width : '500px',
				title : _title
			});
			
			dialog.dialog("open");
		},
		
		createDownloadDialog : function(){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}
			var dialogid = "geodtjs_ui_downdialog_"+ _id;
			var dialog = $("<div id = 'dialog' title='downloader'></div>");
			var label = $("<div class = 'progress-label'></div>");
			var progress = $("<div id = 'progress-label'></div>");
			var button = $("<button id = 'progress-button'></button>");
			dialog.append(label);
			dialog.append(progress);
			
			dialogButtons = [{
		        text: "Cancel Download",
		        click: closeDownload
		      }];
			
			progress.progressbar({
				value : false,
				change : function(){
					label.text("importing");
				},
				complete : function(){
					label.text("OK");
					dialog.dialog("option", "button", [{
						text : "Close",
						click : function(){
							dialog.dialog("option","buttons", "");
						},
					}]);
				}
			});
			
			dialog.dialog({
				autoOpen :false,
				closeOnEscape :false,
				resizable : false,
				buttons : dialogButtons,
			});
		},
		
		createLayerDialog : function(_title, _id, _layerlist){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}
			
			
			var dialogid = "geodtjs_ui_dialog_"+ _id;
			
			var div = $("<div id =  " + dialogid +"'></div>")
			.attr({
				id:dialogid,
				name:dialogid,
				});
			var style = $('<div></div>')
			.css({
				'maxWidth' : parseInt($(window).width() * 0.8) + 'px',
				'maxHeight' : parseInt($(window).height() * 0.8) + 'px',
				'z-index' : this.getZposition(),
				'overflow' : 'auto',
/*				'top' : '100px',*/
				'my' : "center, top",
				'at' : "center, top",
				'of' : $(window)
			}).appendTo(div);
			
			var dialog = div.dialog({
				open:function(){
					
				},
				modal : true,
				width : '500px',
				title : _title
			});
			var divid = this.idname + "layerdialog_" + _id;
			var layerlist = _layerlist;			
			//dialog 세팅
			var accordion = $("<div id = '" + divid + "' class='accordion'></div>");
			accordion.accordion({
				header : "> div > h3",
				collapsible: true,
			}).sortable({
				axis : "y",
				handle : "h3",
				stop : function(event, ui){
					ui.item.children("h3").triggerHandler("focusout");
					$(this).accordion("refresh");
					console.log($(this));
					},
				change: function(event, ui){
					console.log("onchange");
					var children = ui.item.context.nextSibling;
					console.log(ui.item.context.innerText + "->" + children.innerText);
				}
			});
			console.log(layerlist);
			for(var i = 0; i < layerlist.length ; i++){
				var divlist = $("<div class='group'></div>");
				var layerheader =  $("<h3></h3>");
				layerheader.text(layerlist[i].name);
				
				var layerdetail =  $("<div></div>");
				layerdetail.text("test accordion");
				//attach list
				layerheader.appendTo(divlist);
				layerdetail.appendTo(divlist);
				divlist.appendTo(accordion);
			}
			accordion.appendTo(div);
			accordion.accordion("refresh");
			
			//다이얼로그 
			dialog.dialog({
				beforeClose : function(evt, ui){
					console.warn("onClosed");
					console.log(ui);
				}
			});
			
			dialog.dialog("open");
		},
		
		createLayerDialog2 : function(_title, _id, _layerlist){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}
			
			
			var dialogid = "geodtjs_ui_dialog_"+ _id;
			
			var div = $("<div id =  " + dialogid +"'></div>")
			.attr({
				id:dialogid,
				name:dialogid,
				});
			/*var style = $('<div></div>')
			.css({
				'maxWidth' : parseInt($(window).width() * 0.8) + 'px',
				'maxHeight' : parseInt($(window).height() * 0.8) + 'px',
				'z-index' : this.getZposition(),
				'overflow' : 'auto',
				'top' : '100px',
				'my' : "center, top",
				'at' : "center, top",
				'of' : $(window),
				 'margin-left': 'auto',
				 'margin-right': 'auto',
			}).appendTo(div);*/
			
			var dialog = div.dialog({
				modal : true,
				width : '500px',
				title : _title
			});
			var divid = this.idname + "layerdialog_" + _id;
			var layerlist = _layerlist;
			
			/*
			 * insert buttons
			 * */
			
			
			var adddiv = $("<div id = 'geodtjs_ui_button_"+ _id + "'></div>").css({
				'margin-left' : 'auto',
				'margin-right' : 'auto',
				'text-align' : 'center'
			});
			var addbutton2 = $("<button id = '" + divid + "'>DB</button>").button({
				icons : {
					primary : "ui-icon-plus"			//icon
				},
				text : true
			}).click(function(){
				//DB 버튼을 눌렀을 때 레이어 이름을 정하는 다이얼로그 + 이벤트 실행
				var namediv = $("<div></div>");
				var namedialog = namediv.dialog();
				//내부 입력 필드
				var nameinput = $("<input id='geodtjs_ui_subdialog_dbname'></input>").css({
					'width' : '98%'
				});				
				nameinput.appendTo(namedialog);
				namedialog.dialog({
					modal : true,
					title : "레이어 이름 변경",
					beforeClose:function(){
						console.warn(nameinput[0].value + " - Database Layer Create");
						if(nameinput[0].value == ""){
							//Layer creation error
							notify("error","생성할 레이어 이름이 필요합니다.");
						}
						else if(isSameLayerName(nameinput[0].value) != null){
							notify("error","동일한 레이어 이름입니다. 다른 이름을 입력해 주세요.");
						}
						else{
							//layer creation success
							var newlayer = new OpenLayers.Layer.Database(nameinput[0].value);
							geodtjs.map2d.map.addLayer(newlayer);
							notify("success","레이어가 생성 되었습니다.");
						}
						dialog.dialog('close');
						
					},
					close:function(evt, ui){
						$(this).dialog('destroy').remove();
					},
				});
				
				namedialog.dialog("open");
				console.log("DB");
			});
			var addbutton3 = $("<button id = '" + divid + "'>VECTOR</button>").button({
				icons : {
					primary : "ui-icon-plus"			//icon
				},
				text : true
			}).click(function(){
				var namediv = $("<div></div>");
				var namedialog = namediv.dialog();
				//내부 입력 필드
				var desinput = $("<label>"+"insert layer name"+"</label>");
				var nameinput = $("<input id='geodtjs_ui_subdialog_dbname'></input>").css({
					'width' : '98%'
				});	
				var typeform = $("<form></form>");
				var typelabel = $("<label for='geodtjs_ui_subdialog_label'>"+"Select Vector Type"+"</label>");
				var typediv = $("<div id='geodtjs_ui_subdialog_radiodiv'></div>");
				var typepoint = $("<input type='radio' id='point' name='typesel'><label for='point'>point</label></input>");
				var typeline = $("<input type='radio' id='line' name='typesel'><label for='line'>line</label></input>");
				var typepolygon = $("<input type='radio' id='polygon' name='typesel'><label for='polygon'>polygon</label></input>");
				//var typenone = $("<input type='radio' id='varius'><label for='varius'>varius</label></input>");
				
				
				typepoint.click(function(e){
					$(this).attr("checked",true);
					typeline.attr("checked",false);
					typepolygon.attr("checked",false);
					console.log("wow!!!1");
				});
				typeline.click(function(e){
					$(this).attr("checked",true);
					typepoint.attr("checked",false);
					typepolygon.attr("checked",false);
					console.log("wow!!!2");
				});
				typepolygon.click(function(e){
					$(this).attr("checked",true);
					typepoint.attr("checked",false);
					typeline.attr("checked",false);
					console.log("wow!!!3");
				});
				
				
				typepoint.appendTo(typediv);
				typeline.appendTo(typediv);
				typepolygon.appendTo(typediv);
				//typenone.appendTo(typediv);
				typediv.buttonset();
				
				typelabel.appendTo(typeform);
				typediv.appendTo(typeform);
				
				typeform.appendTo(namedialog);
				desinput.appendTo(namedialog);
				nameinput.appendTo(namedialog);
				namedialog.dialog({
					modal : true,
					title : "레이어 이름 변경",
					beforeClose:function(){
						console.warn(nameinput[0].value + " - Database Layer Create");
						if(nameinput[0].value == ""){
							//Layer creation error
							notify("error","생성할 레이어 이름이 필요합니다.");
						}
						else if(isSameLayerName(nameinput[0].value) != null){
							notify("error","동일한 레이어 이름입니다. 다른 이름을 입력해 주세요.");
						}
						else{
							//layer creation success
							var newlayer = new OpenLayers.Layer.Vector(nameinput[0].value);
							
							if(typepoint.is(":checked")){
								newlayer._type = "POINT";
							}
							else if(typeline.is(":checked")){
								newlayer._type = "LINESTRING";
							}
							else if(typepolygon.is(":checked")){
								newlayer._type = "POLYGON";
							}
							console.log(newlayer);
							geodtjs.map2d.map.addLayer(newlayer);
							notify("success","레이어가 생성 되었습니다.");
						}
						dialog.dialog('close');
					},
					close:function(evt, ui){
						$(this).dialog('destroy').remove();
					},
				});
				
				namedialog.dialog("open");
				console.log("DB");
			});
			var addbutton4 = $("<button id = '" + divid + "'>RASTER</button>").button({
				icons : {
					primary : "ui-icon-plus",			//icon
				},
				text : true,
			}).click(function(){
				var namediv = $("<div></div>");
				var namedialog = namediv.dialog();
				//내부 입력 필드
				var nameinput = $("<input id='geodtjs_ui_subdialog_dbname'></input>").css({
					'width' : '98%'
				});				
				nameinput.appendTo(namedialog);
				namedialog.dialog({
					modal : true,
					title : "레이어 이름 변경",
					beforeClose:function(){
						console.warn(nameinput[0].value + " - Raster Layer Create");
						if(nameinput[0].value == ""){
							//Layer creation error
							notify("error","생성할 레이어 이름이 필요합니다.");
						}
						else if(isSameLayerName(nameinput[0].value) != null){
							notify("error","동일한 레이어 이름입니다. 다른 이름을 입력해 주세요.");
						}
						else{
							//layer creation success
							var newlayer = new OpenLayers.Layer.Raster(nameinput[0].value);
							geodtjs.map2d.map.addLayer(newlayer);
							notify("success","레이어가 생성 되었습니다.");
						}
						dialog.dialog('close');
					},
					close:function(evt, ui){
						$(this).dialog('destroy').remove();
					},
				});
				
				namedialog.dialog("open");
			});
			addbutton2.appendTo(adddiv);
			addbutton3.appendTo(adddiv);
			addbutton4.appendTo(adddiv);
			adddiv.appendTo(dialog);
			
			//레이어 리스트 출력
			var sortdiv = $("<ul></ul>").sortable({
				placeholder : "ui-state-highlight",
				update : function(){
					var ulayers = [];
					var ulayername = [];
					$(this).children().each(function(i){
						ulayername.push($(this).context.getAttribute('id'));
					});
					
					ulayername.reverse();
					console.log();
					for(var i in ulayername){
						var finder = geodtjs.map2d.map.getLayersByName(ulayername[i]);
						//reordering layer
						geodtjs.map2d.map.setLayerIndex(finder[0], i);
						ulayers.push(finder[0]);
					}
					geodtjs.map2d.map.layers = [];
					geodtjs.map2d.map.layers = ulayers;
				},	
			}).css({
				'list-style-type' : 'none',
				'vertical-align' : 'middle',
			});
			
			//레이어 리스트 확인
			for(var i = layerlist.length-1 ; i >= 0 ; i--){
				var lidiv = $("<li id='"+layerlist[i].name+"' class='ui-state-default'></li>").css({
					'padding' : '1px',
					'height' : '30px',
					'width' : '400px',
				});
				lidiv.text(layerlist[i].name);
				lidiv.appendTo(sortdiv);
				
				var deleteButton = $("<button></button>").button({
					icons : {
						primary : "ui-icon-minus"			//icon
					},
					text : false
				}).click(function(evt){
					//레이어 삭제 루틴
					if(confirm("레이어를 삭제 하시겠습니까?")){
						//Yes일때
						var delLayer = geodtjs.map2d.map.getLayersByName($(this).context.parentElement.id);
						if(delLayer.length >= 1){
							geodtjs.map2d.map.removeLayer(delLayer[0]);
							notify("success", "레이어를 삭제 하였습니다.");
							dialog.dialog("close");
						}
						else{
							notify("error", "해당하는 레이어를 찾지 못했습니다.")
						}
						
					}
					else{
						//No 일때
						notify("info","명령이 취소 되었습니다.");
					}
				}).css({
					'position' : 'absolute',
						'min-width' : '20px',
						'height' : '30px',
						'left' : '323px',
				}).appendTo(lidiv);
				
				//레이어 지오메트리 타입에 따른 아이콘 추가
				if(layerlist[i]._type == "POINT" || layerlist[i]._type == "Point"){
					var typeimg= $("<img src='builder/img/icon/PO.png'></img>").css({
						'position' : 'absolute',
						'min-width' : '30px',
						'height' : '20px',
						'left' : '365px',
					});
					typeimg.appendTo(lidiv);
				}
				else if(layerlist[i]._type == "LINESTRING" || layerlist[i]._type == "LineString"){
					var typeimg= $("<img src='builder/img/icon/LN.png'></img>").css({
						'position' : 'absolute',
						'min-width' : '30px',
						'height' : '20px',
						'left' : '365px',
					});
					typeimg.appendTo(lidiv);
				}
				else if(layerlist[i]._type == "POLYGON" || layerlist[i]._type == "Polygon"){
					var typeimg= $("<img src='builder/img/icon/PL.png'></img>").css({
						'position' : 'absolute',
						'min-width' : '30px',
						'height' : '20px',
						'left' : '365px',
					});
					typeimg.appendTo(lidiv);
				}
				else {
					var typeimg= $("<img src='builder/img/icon/VA.png'></img>").css({
						'position' : 'absolute',
						'min-width' : '30px',
						'height' : '20px',
						'left' : '365px',
					});
					typeimg.appendTo(lidiv);
				}
				
				//레이어 타입에 따른 아이콘 추가
				if(layerlist[i] instanceof OpenLayers.Layer.Vector){
					lidiv.css({
						'background' : "#0078ae url('includes/jQueryUI/theme/start/images/ui-bg_gloss-wave_75_2191c0_500x100.png') 50% 50% repeat-x",
					});
					var leftdiv= $("<img src='builder/img/icon/img_vector.png'></img>").css({
						'position' : 'absolute',
						'min-width' : '30px',
						'height' : '20px',
						'left' : '400px',
					});
					leftdiv.appendTo(lidiv);
				}
				else{
					//베이스레이어
					if(layerlist[i] instanceof OpenLayers.Layer.Google){
						lidiv.css({
							'background' : "#0078ae url('includes/jQueryUI/theme/start/images/ui-bg_gloss-wave_50_6eac2c_500x100.png') 50% 50% repeat-x",
						});
						var leftdiv = $("<img src='builder/img/icon/img_wms.png'></img>").css({
							'position' : 'absolute',
							'min-width' : '30px',
							'height' : '20px',
							'left' : '400px',
						});
						leftdiv.appendTo(lidiv);
					}
					else if(layerlist[i] instanceof OpenLayers.Layer.File){
						lidiv.css({
							'background' : "#0078ae url('includes/jQueryUI/theme/start/images/ui-bg_gloss-wave_75_2191c0_500x100.png') 50% 50% repeat-x",
						});
						var leftdiv = $("<img src='builder/img/icon/img_file.png'></img>").css({
							'position' : 'absolute',
							'min-width' : '30px',
							'height' : '20px',
							'left' : '400px',
						});
						leftdiv.appendTo(lidiv);
					}
					
					//이미지 관련
					else if(layerlist[i] instanceof OpenLayers.Layer.Raster){
						lidiv.css({
							'background' : "#0078ae url('includes/jQueryUI/theme/start/images/ui-bg_gloss-wave_45_e14f1c_500x100.png') 50% 50% repeat-x",
						});
						var leftdiv = $("<img src='builder/img/icon/img_image.png'></img>").css({
							'position' : 'absolute',
							'min-width' : '30px',
							'height' : '20px',
							'left' : '400px',
						});
						leftdiv.appendTo(lidiv);
					}
					else if(layerlist[i] instanceof OpenLayers.Layer.Image){
						lidiv.css({
							'background' : "#0078ae url('includes/jQueryUI/theme/start/images/ui-bg_gloss-wave_45_e14f1c_500x100.png') 50% 50% repeat-x",
						});
						var leftdiv = $("<img src='builder/img/icon/img_image.png'></img>").css({
							'position' : 'absolute',
							'min-width' : '30px',
							'height' : '20px',
							'left' : '400px',
						});
						leftdiv.appendTo(lidiv);
					}
					//데이터베이스 관련
					else if(layerlist[i] instanceof OpenLayers.Layer.Database){
						lidiv.css({
							'background' : "#0078ae url('includes/jQueryUI/theme/start/images/ui-bg_gloss-wave_75_2191c0_500x100.png') 50% 50% repeat-x",
						});
						var leftdiv = $("<img src='builder/img/icon/img_db.png'></img>").css({
							'position' : 'absolute',
							'min-width' : '30px',
							'height' : '20px',
							'left' : '400px',
						});
						leftdiv.appendTo(lidiv);
					}
					
					//WMS 관련
					else if(layerlist[i] instanceof OpenLayers.Layer.WMS){
						lidiv.css({
							'background' : "#0078ae url('includes/jQueryUI/theme/start/images/ui-bg_gloss-wave_50_6eac2c_500x100.png') 50% 50% repeat-x",
						});
						var leftdiv = $("<img src='builder/img/icon/img_wms.png'></img>").css({
							'position' : 'absolute',
							'min-width' : '30px',
							'height' : '20px',
							'left' : '400px',
						});
						leftdiv.appendTo(lidiv);
					}
				}
			}
			sortdiv.appendTo(dialog);
			sortdiv.disableSelection();
			
			
			dialog.dialog({
				beforeClose : function(evt, ui){
					/*console.warn("onClosed");
					console.log(ui);*/
					
				},
				close:function(evt, ui){
					$(this).dialog('destroy').remove();
				},
			});
			
			dialog.dialog("open");
		},
		
		createProjectionDialog : function(_title, _id, _layerlist, _projectionlist){
			if(typeof jQuery.ui == 'undefined'){
				throw "jQuery UI가 필요합니다.";
			}
			
			
			var dialogid = "geodtjs_ui_dialog_"+ _id;
			
			var div = $("<div id =  " + dialogid +"'></div>")
			.attr({
				id:dialogid,
				name:dialogid,
				});
			var style = $('<div></div>')
			.css({
				'maxWidth' : parseInt($(window).width() * 0.8) + 'px',
				'maxHeight' : parseInt($(window).height() * 0.8) + 'px',
				'z-index' : this.getZposition(),
				'overflow' : 'auto',
/*				'top' : '100px',*/
				'my' : "center, top",
				'at' : "center, top",
				'of' : $(window)
			}).appendTo(div);
			
			var dialog = div.dialog({
				open:function(){
					
				},
				modal : true,
				width : '500px',
				title : _title
			});
			var divid = this.idname + "layerdialog_" + _id;
			var layerlist = _layerlist;
			
			console.log(_layerlist);
			
			
			//레이어 버튼 생성
			for(var i = _layerlist.length-1 ; i >= 0 ;i--){
				var adddiv = $("<div id = 'geodtjs_ui_button_"+ _id + "'></div>");
				var addbutton1 = $("<button id = '" + divid + "'>"+ _layerlist[i].name +"</button>").button({
					icons : {
						primary : "ui-icon-plus"			//icon
					},
					text : true
				}).click(function(){
					//클릭시 생성되는 다이얼로그 내용
					var projdialog = $("<div class = 'ui-widget'></div>");
					var forms = $("<form></form>");
					var labels = $("<label for='proj'>Projection : </label>");
					console.log(geodtjs.map2d.projnames);
					//자동완성기능 (프로젝션 이름과 매칭한다.)
					var inputs = $("<input id = 'proj'></input>");
					inputs.autocomplete({
						source : geodtjs.map2d.projnames,
					});
					var button = $("<button>ok</input>");
					button.click(function(){
						console.log("OKOKOK");
					});
					/*labels.appendTo(forms);
					inputs.appendTo(forms);
					button.appendTo(forms);*/
					labels.appendTo(projdialog);
					inputs.appendTo(projdialog);
					button.appendTo(projdialog);
					//forms.appendTo(projdialog);
					
					var appends = [];
					appends.push(projdialog);
					
					geodtjs.ui.createDialog("Search1","Search2", appends, 500);
					
				});
				addbutton1.css({
					'width' : '100%',
					'font-size' : '90%'
					});
				addbutton1.appendTo(dialog);
			}
			
			dialog.dialog({
				beforeClose : function(evt, ui){
					console.warn("onClosed");
					console.log(ui);
				}
			});
			
			dialog.dialog("open");
		},
		
		createProjectionSearcher: function(_title, _id, _projlist){
			var projdialog = $("<div class = 'ui-widget'></div>");
			var forms = $("<form></form>");
			var labels = $("<label for='proj'>Projection : </label>");
			console.log(geodtjs.map2d.projnames);
			//자동완성기능 (프로젝션 이름과 매칭한다.)
			var inputs = $("<input id = 'proj'></input>");
			inputs.autocomplete({
				source : _projlist,
			});
			/*var button = $("<button>ok</input>");
			button.click(function(){
				console.log("OKOKOK");
			});*/
			/*labels.appendTo(forms);
			inputs.appendTo(forms);
			button.appendTo(forms);*/
			labels.appendTo(projdialog);
			inputs.appendTo(projdialog);
			//button.appendTo(projdialog);
			projdialog.dialog({
				beforeClose : function(evt, ui){
					console.warn("onClosed");
					console.log(inputs[0].value);
					file_projection = inputs[0].value; 
				}
			});
		},
		
		
		//레이어 창에 추가되는 버튼
		createAddLayerButton : function(_id, _dialog){
			var adddiv = $("<div id = 'geodtjs_ui_button_"+ _id + "'></div>");
			var addbutton = $("<button id = '" + _id + "'></button>").button({
				icons : {
					primary : "ui-icon-plus"			//icon
				},
				text : false
			}).click(function(){
				console.log("NOOOOO");
			});
			adddiv.appendTo(_dialog);
			return adddiv;
		},
		
		getRandomColor : function() {
		    var letters = '6789ABCDEF'.split('');
		    var color = '#';
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.floor(Math.random() * letters.length)];
		    }
		    console.log(color);
		    return color;
		},
		
		
		//생성을 눌렀을 때 생성되는 
		createEntityDialog: function(){
			console.log(geodtjs.define.msg);
			var layerdiv = $("<div></div>");
			_dialog = layerdiv.dialog({
				modal : true,
				title : geodtjs.define.msg.createEntityDialog.title,
				
			});
			var layerlist = geodtjs.map2d.map.layers.slice(0);
			layerlist.reverse();
			var sellayer;
			for(var i in layerlist){
				var adddiv = $("<div id = 'geodtjs_ui_button_"+ geodtjs.map2d.map.layers[i].name + "'></div>").css({
					'margin-left' : 'auto',
					'margin-right' : 'auto',
					'text-align' : 'center',
					});
				var addbutton = $("<button id = '" + geodtjs.map2d.map.layers[i].name + "'></button>").button().click(function(){
					var findlayer = geodtjs.map2d.map.getLayersByName($(this).context.getAttribute('id'));
					sellayer = findlayer[0];
					
					if(sellayer instanceof OpenLayers.Layer.Vector || sellayer instanceof OpenLayers.Layer.File || sellayer instanceof OpenLayers.Layer.Database){
						notify("success", MESSAGE.LAYER_TYPE_ALLOWED);
					}
					else{
						notify("error", MESSAGE.LAYER_TYPE_NOT_ALLOWED);
						return;
					}
					
					
					var closediv = $("<div id = "+$(this).context.getAttribute('id')+"></div>").css({
						
					});
					closediv.dialog({
						modal : false,
						width : '150px',
						title : $(this).context.getAttribute('id'),
						beforeClose : function(){
							removeControl();
						},
						close:function(evt, ui){
							$(this).dialog('destroy').remove();
						},
					}).css({
						'width' : '150px',
					});
					var widthsize = '30px';
					var heightsize = '30px';
					var addbuttons = [];
					addbuttons[0] = $("<button></button>").button({
						text : false,
						icons : {
							primary : "ui-icon-custom-point"
						}
					}).css({
						'width' : widthsize,
						'height' : heightsize}).appendTo(closediv).click(function(){
						removeControl();
						drawPoint(sellayer.name);
					});
					addbuttons[1] = $("<button></button>").button({
						text : false,
						icons : {
							primary : "ui-icon-custom-line"
						}
					}).css({
						'width' : widthsize,
						'height' : heightsize}).appendTo(closediv).click(function(){
						removeControl();
						drawLine(sellayer.name);
					});
					addbuttons[2] = $("<button></button>").button({
						text : true,
						icons : {
							primary : "ui-icon-custom-polygon"
						}
					}).css({
						'width' : widthsize,
						'height' : heightsize}).appendTo(closediv).click(function(){
						removeControl();
						drawPolygon(sellayer.name);
					});
					var stopbutton = $("<button></button>").button({
						text : false,
						icons : {
							primary : "ui-icon-stop"
						}
					}).css({
						'width' : widthsize,
						'height' : heightsize}).appendTo(closediv).click(function(){
						removeControl();
					});
					var copybutton = $("<button></button>").button({
						text : false,
						icons : {
							primary : "ui-icon-copy"
						}
					}).css({
						'width' : widthsize,
						'height' : heightsize}).appendTo(closediv).click(function(){
						alert("복사모드!");
					});
					var modifybutton = $("<button></button>").button({
						text : false,
						icons : {
							primary : "ui-icon-wrench"
						}
					}).css({
						'width' : widthsize,
						'height' : heightsize}).appendTo(closediv).click(function(){
						alert("편집모드!");
					});
					var modifybutton = $("<button></button>").button({
						text : false,
						icons : {
							primary : "ui-icon-minus"
						}
					}).css({
						'width' : widthsize,
						'height' : heightsize}).appendTo(closediv).click(function(){
						alert("삭제모드!");
					});
					
				if(sellayer._type == "POINT"){
					addbuttons[1].button("disable");
					addbuttons[2].button("disable");
				}
				else if(sellayer._type == "LINESTRING"){
					addbuttons[0].button("disable");
					addbuttons[2].button("disable");
				}
				else if(sellayer._type == "POLYGON"){
					addbuttons[0].button("disable");
					addbuttons[1].button("disable");
				}					

					closediv.dialog("open");
					_dialog.dialog("close");
				}).css({
					'width' : '250px',
					'min-height' : '30px',
				});
				

				addbutton.text(geodtjs.map2d.map.layers[i].name);
				addbutton.appendTo(adddiv);
				adddiv.appendTo(_dialog);
			}
			
			_dialog.dialog("open");
			
		},
		
		

		
		
};

//공용 유틸리티
/*Array.prototype.swap = function(x,y){
	var b = this[x];
	this[x] = this[y];
	this[y] = b;
	return this;
}*/