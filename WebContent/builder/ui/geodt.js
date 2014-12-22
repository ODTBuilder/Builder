/*
 * 
 * 		베이스맵 버튼 이벤트 등록
 * 		Using jQuery, jQuerUI
 * 		개발자 : 유승범
 * 		2014.11.18
 * 
 */

function simple_alert(msg, title)
{
	$("#simple_alert").remove();
    //$('<div></div>').html(msg).dialog({dialogClass:'simple_alert'});
	fullmsg = '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"><strong>'+title+'</strong>'+msg;
	$('<div id="simple_alert" class="ui-state-error ui-corner-all"></div>').html(fullmsg).dialog();
    /*.animate({
    	backgroundColor: "#fff",
        color: "#000",
    },300);*/
}

function notify(type, msgs){
	var title;
	console.warn(msgs);
	switch(type){
	case 'white':
		title = "일반";
		break;
	case 'black':
		title = "일반";
		break;
	case 'error':
		title = "에러";
		break;
	case 'success':
		title = "성공";
		break;
	case 'warning':
		title = "경고";
		break;
	case 'info':
		title = "정보";
		break;
	default:
		title = "일반";
		type = 'white';
		break;
	}
	//style : 'white', 'black', 'error', 'success', 'warning', 'info'
	$.notify({
			title: title,
			text: msgs,
			image: "<img src='builder/img/icon/warning16x16.png'>"
		}, {
			position:"left top",
			style: 'metro',
			className: type,
			autoHide: true,
			autoHideDelay: 2000,
			clickToHide: true
	});
}


//기본지도 UI를 링크함
function add_basemap(ui_name, ui_class, ui_image, ui_subdlg, ui_func){
	var ui_id = "#"+ui_name;
	
	if(ui_image!= null){
		$(function() {
		    $( ui_id )
		      .button({
		    	  text:true,
		    	  icons:{primary: ui_image},
		    	  })
		      .click(function() {
		    	  console.log("evt:" + ui_id + ", " + ui_subdlg);
		    	  mnu_dialog_func(ui_subdlg);
		    	  //$(ui_subdlg).dialog('open');
		      });
		    $( ui_id ).tooltip();
		  });
	}
	else{
		$(function() {
		    $( ui_id )
		      .button({
		    	  text:true,
		    	  icons:{primary: ui_image}
		    	  })
		      .click(function() {
		    	  mnu_dialog_func(ui_subdlg);
		    	  //$(ui_subdlg).dialog('open');
		      });
		    $( ui_id ).tooltip();
		  });
	}
};


// TODO : 다이얼로그 메시지를 처리하는 부분
// PARAM : ui_btnID (전송한 버튼 ID) 
function dialog_message_onclick(ui_btnID){  
	switch(ui_btnID){
	
	//기본지도 입력 부분
	case "basemap_google":
		changeBaseLayer("google");
	break;	 
	case "basemap_osm":
		changeBaseLayer("openstreetmap");
	break;
	
	
	  //레스터 레이어 입력 부분
	case "mnu_rasterbtn_make" :
		  notify("info","레스터 이미지 생성");
		  makeRaster("builder/download/georeferencing.png");
		  break;
	case "mnu_rasterbtn_move" :
		notify("info","레스터 이동");
		moveRaster(true);
	break;
	case "mnu_rasterbtn_change" :
		notify("info","레스터 크기 변경");
		modifyRaster();
	break;
	case "mnu_rasterbtn_transparent" :
		notify("info","레스터 투명도 변경");
		$( "#mnu_rasterbtn_slider_name" ).toggle("highlight",{},200);
		$("#mnu_rasterbtn_slider_name" ).position({
		my:"center top",
		at:"center bottom",
		of:"#mnu_btnraster"
		});
	break;
	case "mnu_rasterbtn_delete" :
		notify("info","레스터 이미지 삭제");
		deleteRaster();
	break;
	//2014/11/27 김종회 (벡터 그리기)
	case "mnu_editbtn_navi":
		console.warn("벡터입력 - 이동버튼 이벤트");
		ol_AllControlsDown(true,true,true,true);
	break;
	case "mnu_editbtn_point":
		console.warn("벡터입력 - 점 생성 버튼 이벤트");
		ol_AllControlsDown(true,true,true,true);
		removeControl();
		drawPoint();
	break;
	case "mnu_editbtn_line":
		ol_AllControlsDown(true,true,true,true);
		removeControl();
		drawLine();
	break;
	case "mnu_editbtn_polygon":
		ol_AllControlsDown(true,true,true,true);
		removeControl();
		drawPolygon();
	break;
	//유승범, 수정하기 버튼
	case "mnu_modifybtn_select":
		notify("info","벡터 선택");
		ol_AllControlsDown(true,true,true,true);
		layernames.slice(0,layernames.length);		//데이터 삭제
		layernames.push("USER_POINT");
		layernames.push("USER_LINE");
		layernames.push("USER_POLYGON");
		selectGroups(layernames);
	break;
	// TODO 최토열 2014.11.27 벡터 수정
	case "mnu_modifybtn_change":
		notify("info","벡터 수정");
		ol_AllControlsDown(true,true,true,true);
		modifychange(); 
	break;
	case "mnu_modifybtn_move":
		notify("info","벡터 이동");
		ol_AllControlsDown(true,true,true,true);
		moveGroups();
	break;
	
	//그리기 UI 관련 버튼 세팅
	case "mnu_btndraw_2D":
		notify("","2D 버튼 선택");
		$(".mnu_btndraw_3Dset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_2D_editset").hide();		//편집셋은 숨김.
		$(".mnu_btndraw_2D_addset").hide();		//입력셋은 숨김.
		var radio_btn = $( "#mnu_btndraw_2Dset" );	
		radio_btn.toggle("highlight", {}, 200);		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw_2Dset" ).position({
			my:"center top",
			at:"left bottom",
			of:"#mnu_btndraw"
		});
		break;
	case "mnu_btndraw_2D_add":
		notify("","2D - 입력 선택");
		$(".mnu_btndraw_2D_editset").hide();		//편집셋은 숨김.
		$(".mnu_btndraw_3D_addset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_3D_editset").hide();		//편집셋은 숨김.
		var radio_btn = $( "#mnu_btndraw_2D_addset" );	
		radio_btn.toggle("highlight", {}, 200);		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw_2D_addset" ).position({
			my:"center top",
			at:"center bottom",
			of:"#mnu_btndraw_2Dset"
		});
		break;
	case "mnu_btndraw_2D_edit":
		notify("","2D - 입력 선택");
		$(".mnu_btndraw_2D_addset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_3D_addset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_3D_editset").hide();		//편집셋은 숨김.
		var radio_btn = $( "#mnu_btndraw_2D_editset" );	
		radio_btn.toggle("highlight", {}, 200);		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw_2D_editset" ).position({
			my:"center top",
			at:"center bottom",
			of:"#mnu_btndraw_2Dset"
		});
		break;
	//2D 수행 버튼 모음
	case "mnu_btndraw_2D_add_point":
		notify("success","2D - 입력 - 점 선택");
	break;
	case "mnu_btndraw_2D_add_line":
		notify("success","2D - 입력 - 선 선택");
	break;
	case "mnu_btndraw_2D_add_polygon":
		notify("success","2D - 입력 - 면 선택");
	break;
	case "mnu_btndraw_2D_add_holepolygon":
		notify("success","2D - 입력 - 홀 선택");
	break;	
	case "mnu_btndraw_2D_edit_move":
		notify("success","2D - 수정 - 이동 선택");
	break;
	case "mnu_btndraw_2D_edit_modify":
		notify("success","2D - 수정 - 편집 선택");
	break;
	case "mnu_btndraw_2D_delete":
		notify("success","2D - 삭제 선택");
	break;
	
	
	//그리기 UI 관련 버튼 세팅
	case "mnu_btndraw_3D":
		notify("","3D 버튼 선택");
		
		$(".mnu_btndraw_2Dset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_3D_editset").hide();		//편집셋은 숨김.
		$(".mnu_btndraw_3D_addset").hide();		//입력셋은 숨김.
		
		var radio_btn = $( "#mnu_btndraw_3Dset" );	
		radio_btn.toggle("highlight", {}, 200);		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw_3Dset" ).position({
			my:"center top",
			at:"right bottom",
			of:"#mnu_btndraw"
		});
		break;
	case "mnu_btndraw_3D_add":
		notify("","3D - 입력 선택");
		
		$(".mnu_btndraw_3D_editset").hide();		//편집셋은 숨김.
		$(".mnu_btndraw_2D_addset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_2D_editset").hide();		//편집셋은 숨김.
		
		var radio_btn = $( "#mnu_btndraw_3D_addset" );	
		radio_btn.toggle("highlight", {}, 200);		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw_3D_addset" ).position({
			my:"center top",
			at:"center bottom",
			of:"#mnu_btndraw_3Dset"
		});
		break;
	case "mnu_btndraw_3D_edit":
		notify("","3D - 입력 선택");
		
		$(".mnu_btndraw_3D_addset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_2D_addset").hide();		//입력셋은 숨김.
		$(".mnu_btndraw_2D_editset").hide();		//편집셋은 숨김.
		
		var radio_btn = $( "#mnu_btndraw_3D_editset" );	
		radio_btn.toggle("highlight", {}, 200);		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw_3D_editset" ).position({
			my:"center top",
			at:"center bottom",
			of:"#mnu_btndraw_3Dset"
		});
		break;
	//3D 수행 버튼 모음
	case "mnu_btndraw_3D_add_point":
		notify("success","3D - 입력 - 점 선택");
	break;
	case "mnu_btndraw_3D_add_line":
		notify("success","3D - 입력 - 선 선택");
	break;
	case "mnu_btndraw_3D_add_polygon":
		notify("success","3D - 입력 - 면 선택");
	break;
	case "mnu_btndraw_3D_add_holepolygon":
		notify("success","3D - 입력 - 홀 선택");
	break;
	case "mnu_btndraw_3D_add_extrude":
		notify("success","3D - 입력 - 돌출 선택");
	break;	
	case "mnu_btndraw_3D_edit_move":
		notify("success","3D - 수정 - 이동 선택");
	break;
	case "mnu_btndraw_3D_edit_modify":
		notify("success","3D - 수정 - 편집 선택");
	break;
	case "mnu_btndraw_3D_delete":
		notify("success","3D - 삭제 선택");
	break;
	
		
		
		
	default:
		alert(ui_btnID);
	break;
	}
}



// TODO 상단 메뉴바 버튼 모음
//상단 메뉴바 버튼을 눌렀을 때 발생하는 이벤트 모음
function mnu_dialog_func(ui_func){

	ol_AllControlsDown(true,true,true,true);
	switch(ui_func){
	case "#mnu_basemap":
		//기본지도 상단메뉴를 눌렀을 때
		
		$(ui_func).dialog('open');
		break;
	case "#mnu_database":
		hideAllButtonSet("#mnu_btndatabase");
		var radio_btn = $( "#mnu_btndatabase" );	
		radio_btn.toggle("highlight", {}, 200);		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndatabase" ).position({
			my:"center top",
			at:"center bottom",
			of:"#ui_menu_database"
		});
		
		break;
	case "#mnu_projection":
		//not1("프로젝션 기능을 제공합니다.");
		notify('warning', "프로젝션 기능을 제공합니다.");
		break;
	case "#mnu_draw":
		//벡터 그리기 버튼
		hideAllButtonSet("#mnu_btndraw");
		var radio_btn = $( "#mnu_btndraw" );	
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw" ).position({
			my:"center top",
			at:"center bottom",
			of:"#ui_menu_draw"
		});		
		radio_btn.toggle("highlight", {}, 200);
		//초기 (이동버튼)으로 변경하는 루틴
		break;
	case "#mnu_raster":
		//벡터 그리기 버튼
		hideAllButtonSet("#mnu_btnraster");			//다른 버튼을 전부 숨기기
		var radio_btn = $( "#mnu_btnraster" );
		radio_btn.toggle("highlight", {}, 200);
		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btnraster" ).position({
			my:"center top",
			at:"center bottom",
			of:"#ui_menu_raster"
		});
		//초기 (이동버튼)으로 변경하는 루틴
		$("#mnu_rasterbtn_make").prop('checked', true).button("refresh");
		break;		
	case "#mnu_attribute":
		hideAllButtonSet("#mnu_btnattribute");			//다른 버튼을 전부 숨기기
		var radio_btn = $( "#mnu_btnattribute" );
		radio_btn.toggle("highlight", {}, 200);
		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btnattribute" ).position({
			my:"center top",
			at:"center bottom",
			of:"#ui_menu_attributes"
		});
		
		
		//dbshow();
		break;
	/*case "#mnu_modify":
		hideAllButtonSet("#mnu_btnmodify");
		var radio_btn = $( "#mnu_btnmodify" );
		radio_btn.toggle("highlight", {}, 200);
		
		//버튼을 메뉴로 이동시키기
		$("#mnu_btnmodify" ).position({
			my:"center top",
			at:"center bottom",
			of:"#ui_menu_modify"
		});
		$("#mnu_modifybtn_move").prop('checked', true).button("refresh");
		break;*/
	case "#mnu_save":
		console.log("File Upload");
		$(ui_func).dialog('open');
		break;
	case "#mnu_file":
		//파일 업로드
		break;
	case "#mnu_config":
		//다이얼로그 오픈
		
		console.log(map);
		$(ui_func).dialog('open');
		
		break;
	}
}




function dbshow(){
	notify("info", "데이터베이스 연결 시도중.");
	var mainpage = location.host;
	console.log(mainpage);
	console.log(location.pathname);
	var param = makeDatabaseParameter("localhost", "5432", "tester", "postgres", "postgres", "testdb", "the_geom");
	requestCORS("","", param);
}


//작성자 : 유승범 (14-12-16)
//데이터베이스 파라미터를 만든다.
//_host : 서버 IP
//_port : 데이터베이스포트
//_account : 데이터베이스 계정 이름
//_id : 데이터베이스 ID
//_pass : 데이터베이스 비밀번호
//_tname : 접속할 데이터베이스 테이블
//_geom : 지오메트리 필드
function makeDatabaseParameter(_host, _port, _account, _id, _pass, _tname, _geom){
	var param = [];
	param.host = _host;
	param.port = _port;
	param.account = _account;
	param.id = _id;
	param.pass = _pass;
	param.tname = _tname;
	param.geom = _geom;
	return param;
}

//레스터 슬라이더에 관련된 함수
function callbackSlideRaster(_id, _ui){
	var value = _ui.value;
	var isCreated = setOpacityRaster(value);
	if(isCreated == false){
		notify("error","투명도를 조절할 수 없습니다.");
	}
}


function hideAllButtonSet(_exceptid){
	$(".mnu_btn").hide();
	
}

function attribute_test(){
	console.warn("test!!!");
	 
	//데이터 강제 입력
	
	//var attr_schema = [];
	 
	var attr_A001_schema = ["OBJECTID","UFID","S_TIME","E_TIME","STATUS","STATE"];
	var attr_B001_schema = ["OBJECTID","UFID","S_TIME","E_TIME","STATUS","명칭","구분","종류","용도","주기","층수","STATE"];
	var attr_D001_schema = ["OBJECTID","UFID","S_TIME","E_TIME","STATUS","명칭","구분","재질","상_하구분","연장","높이","STATE","상하구분"];
	var attr_H001_schema = ["OBJECTID","UFID","E_TIME","STATUS","구분","S_TIME","STATE"];
	
	
	var attr_A001_data = [
["323","0000A00100003238","2011-03-09","NOT","",""],
["324","0000A00100003249","2011-03-09","NOT","",""],
["325","0000A0010000325A","2011-03-09","NOT","",""],
["327","0000A00100003273","2011-03-09","NOT","",""],
["331","0000A00100003317","2011-03-09","NOT","",""],
["332","0000A00100003328","2011-03-09","NOT","",""],
	                      ];
	
	var attr_B001_data = [
["","1000377121785B00110000000000003766","2011-03-09","NOT","","","","주택외건물","공장","축복정밀","",""],
["","1000377121785B00110000000000003755","2011-03-09","NOT","","","","일반주택","주택","","",""],
["","1000377121785B00110000000000003744","2011-03-09","NOT","","","","일반주택","주택","","",""],
["","1000377121785B00110000000000003733","2011-03-09","NOT","","","","일반주택","주택","","",""],
["","1000377121785B00110000000000003722","2011-03-09","NOT","","","","일반주택","주택","","",""],
["","1000377121785B00110000000000003709","2011-03-09","NOT","","","","일반주택","주택","","",""],
["","1000377121785B00110000000000003698","2011-03-09","NOT","","","","일반주택","주택","","",""],
["","1000377121785B00110000000000003687","2011-03-09","NOT","","","","일반주택","주택","","",""]
	                      ];
	
	var attr_D001_data = [
["89","0000C00500000704","2011-03-09","NOT","","","제방","콘크리트","상단","39","0","",""],
["90","0000C0050000391A","2011-03-09","NOT","","","제방","콘크리트","상단","56","0","",""],
["91","0000C00500001086","2011-03-09","NOT","","","제방","콘크리트","상단","40","0","",""],
["92","0000C00500004124","2011-03-09","NOT","","","제방","콘크리트","상단","69","0","",""],
["93","0000C00500001468","2011-03-09","NOT","","","제방","콘크리트","상단","71","0","",""],
["94","0000C0050000229A","2011-03-09","NOT","","","제방","콘크리트","상단","41","0","",""],
["95","0000C00500000489","2011-03-09","NOT","","","제방","콘크리트","상단","37","0","",""],
["96","0000C00500002245","2011-03-09","NOT","","","제방","콘크리트","상단","115","0","",""],
["97","0000C0050000357C","2011-03-09","NOT","","","제방","콘크리트","상단","31","0","",""]
	                      ];
	
	var attr_H001_data = [
["0","1000","NOT","0","밭","2011-03-09",""],
["0","10003","NOT","","밭","2011-03-09",""],
["0","0","NOT","0","0","2011-03-09",""],
	                      ];
	
	var attr_Z001_data = [];
	var attr_layers = ["A001", "B001", "D001", "H001"];
	var attr_schema = [attr_A001_schema, attr_B001_schema, attr_D001_schema, attr_H001_schema]; 
	var attr_datas = [attr_A001_data, attr_B001_data, attr_D001_data, attr_H001_data];
	
	//layer -> ["A","B","C"];
	//schema = [["AS1","AS2",....],["BS1","BS2",....],["A1","CS2",....]];
	
	/*var out = makeTree(attr_layers, attr_schema);
	console.log(out);
	$("#attr_tree").html(out);
	$("#attr_tree").jstree().click(function(){
		//alert("clicked");
	});*/
	
	//make grid	
	var data = [];
	console.log(attr_schema);
	console.log(attr_datas);
	
	data = makeGridData(1, attr_schema, attr_datas);
	
	$("#attr_grid").handsontable({
		data:data,
		minSpareRows:1,
		colHeaders: true,
		contextMenu: true
	});
}


//레이어 숫자와 스키마 숫자는 일치가 되어야 한다.
function makeTree(_layer, _schema){
	if(_layer.length != _schema.length){
		//not1("레이어의 개수와 스키마의 개수가 일치하지 않습니다.");
	}
	var output;
	output = "<ul>\n";
	for(var i in _layer){
		output += "\t<li>" + _layer[i] + "\n\t<ul>\n";
		for(var j in _schema[i]){
			output += "\t\t<li class='child_node'>" + _schema[i][j] + "</li>\n";
		}		
		output += "\t</ul>\n\t</li>\n";
	}
	output += "</ul>";
	return output;
}

function makeGridData(_index, _schema, _datas){
	if(_datas.length != _schema.length){
		//not1("스키마의 개수와 데이터의 개수가 일치하지 않습니다.");
	}
	var data = [];
	
	data.push(_schema[_index]);
	for(var j in _datas){
		data.push(_datas[_index][j]);
	}
	
	console.log(data);
	
	
	return data;
} 


//HTML의 Element에 Remove 콜을 할 수 있게 하는 루틴
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


