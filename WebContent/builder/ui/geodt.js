/*
 * 
 * 		베이스맵 버튼 이벤트 등록
 * 		Using jQuery, jQuerUI
 * 		개발자 : 유승범
 * 		2014.11.18
 * 
 */
var file_projection = "";

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
	case "basemap_daum":
		changeBaseLayer("daum");
		break;
	case "basemap_naver":
		changeBaseLayer("naver");
		break;
	
	  //레스터 레이어 입력 부분
	case "mnu_rasterbtn_make" :
		  notify("info","레스터 이미지 생성");
		  makeRaster("builder/download/wms.png");
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
		drawPoint("");
		break;
	case "mnu_editbtn_line":
		ol_AllControlsDown(true,true,true,true);
		removeControl();
		drawLine("");
		break;
	case "mnu_editbtn_polygon":
		ol_AllControlsDown(true,true,true,true);
		removeControl();
		drawPolygon("");
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
		removeControl();
		drawPoint("");
		break;
	case "mnu_btndraw_2D_add_line":
		notify("success","2D - 입력 - 선 선택");
		removeControl();
		drawLine("");
		break;
	case "mnu_btndraw_2D_add_polygon":
		notify("success","2D - 입력 - 면 선택");
		removeControl();
		drawPolygon("");
		break;
	case "mnu_btndraw_2D_add_holepolygon":
		notify("success","2D - 입력 - 홀 선택");
		break;	
	case "mnu_btndraw_2D_edit_move":
		notify("success","2D - 수정 - 이동 선택");
		break;
	case "mnu_btndraw_2D_edit_modify":
		removeControl();
		modifychange();
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
	case "mnu_databasebtn_add": //DB연결 -> 열기
		$("#mnu_database").dialog('open');
		break;
	case "dbconnect_tab_postgis_connect": //uitest.html -> 입력
		ConnPostDB();
		break;
	case "mnu_btnattribute_select":  //속성보기 -> 선택
		/*dbshow();
		$("#mnu_attribute").dialog('open');*/
		removeControl();
		selectFeature();
		break;
	case "mnu_btnattribute_view": //속성보기 -> 보기
		removeControl();
		show_attributes();
		//$("#mnu_attribute").dialog('open');
		break;
	case "mnu_databasebtn_save": //DB연결 -> 저장
		saveDatas();
		break;
	case "mnu_databasebtn_close": //DB연결 -> 닫기
		closePostDB();
		break;
	default:
		alert(ui_btnID);
		break;
	}
}

function closePostDB(){
	//console.log(location);
	var origin = location.origin;
	var path_name = location.pathname;
	
	var url = origin + path_name;
	
	location.href = url;
}

//TODO Feature 선택하는 부분
function selectFeature(){
	var point_layer = map.getLayersByName("USER_POINT");
	var line_layer = map.getLayersByName("USER_LINE");
	var polygon_layer = map.getLayersByName("USER_POLYGON");
	
	var vector_point_layer = map.getLayersByName("VECTOR_POINT");
	var vector_line_layer = map.getLayersByName("VECTOR_LINE");
	var vector_polygon_layer = map.getLayersByName("VECTOR_POLYGON");
	
	var select = new OpenLayers.Control.SelectFeature(
		[point_layer[0], line_layer[0], polygon_layer[0], vector_point_layer[0], vector_line_layer[0], vector_polygon_layer[0]],
		{ 
			toggle: false,
			multiple: false, hover: false,
			/*toggleKey: "ctrlKey",
			multipleKey: "shiftKey",*/
			box: true
			/*click: function(_feature){
				selectedFeature(_feature);
			}*/
		}
	);
	
	//select.
	
	/*var select_hover = new OpenLayers.Control.SelectFeature(
		[point_layer[0], line_layer[0], polygon_layer[0], vector_point_layer[0], vector_line_layer[0], vector_polygon_layer[0]],
		{
			multiple: false, hover: true
		}	
	);*/
	
	map.addControl(select);
	//map.addControl(select_hover);
	
	select.activate();
	select.onSelect = function(_feature){
		selectedFeature(_feature);
	};
	//select_hover.activate();
}

function selectedFeature(_feature){
	console.log("컴온!!");
	
	var fid = _feature.fid;
	var layer_name = _feature.layer.name;
	
	if(layer_name == "USER_POINT" || layer_name == "VECTOR_POINT"){
		getSelectedAttrPostGIS(fid, layer_name);
		//$("#mnu_attribute").dialog('open');
				
		//removeControl();
	}
	
	if(layer_name == "USER_LINE" || layer_name == "VECTOR_LINE"){
		getSelectedAttrPostGIS(fid, layer_name);
		//$("#mnu_attribute").dialog('open');
		//removeControl();
	}

	if(layer_name == "USER_POLYGON" || layer_name == "VECTOR_POLYGON"){
		getSelectedAttrPostGIS(fid, layer_name);
		//$("#mnu_attribute").dialog('open');
		
		//테스트 영역
		
		
		
		
		
		/*var pointdialog = $("<div id='dialog_"+ layer_name + "' class='dialog'></div>");		
		ptdialog.appendTo($(window));
		ptdialog.dialog("open");*/
		//removeControl();
	}
}

//TODO 속성데이터를 DB에 저장하기 위한 함수
function saveDatas(){
	notify("info", "데이터베이스 연결 시도중.");
	
	/*alert("현재 테스트 중입니다.");
	return;*/
	
	//var mainpage = location.host;
	
	/*var test_param = getParameter();
	var split_param = test_param.split(",");*/
	
	var host = "";
	var port = "";
	var db_name = "";
	var dbtable_name = "";
	var id = getCookie("id");
	var password = getCookie("password");
	
	//URL 파라미터 파싱하는 부분
	/*for(var i=0 ; i<split_param.length ; i++){
		switch(split_param[i]){
		case "host" : host = split_param[i+1]; break;
		case "port" : port = split_param[i+1]; break;
		case "db_name" : db_name = split_param[i+1]; break;
		case "dbtable_name" : dbtable_name = split_param[i+1]; break;
		}
	}*/
	
	if(tst_tableObject.check == true){
		host = tst_tableObject.host;
		port = tst_tableObject.port;
		db_name = tst_tableObject.db_name;
		dbtable_name = tst_tableObject.dbtable_name;
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		setDatasInPostGIS("","", param);
	}
	
	if(tst_table_pointObject.check == true){
		host = tst_table_pointObject.host;
		port = tst_table_pointObject.port;
		db_name = tst_table_pointObject.db_name;
		dbtable_name = tst_table_pointObject.dbtable_name;
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		setDatasInPostGIS("","", param);
	}
	
	if(tst_table_lineObject.check == true){
		host = tst_table_lineObject.host;
		port = tst_table_lineObject.port;
		db_name = tst_table_lineObject.db_name;
		dbtable_name = tst_table_lineObject.dbtable_name;
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		setDatasInPostGIS("","", param);
	}
	
	/*if(param.host == "" || param.port == "" || port.db_name == ""){
		notify("error", "먼저 DB에 연결을 해야합니다.");
		return;
	}*/
}

//TODO DB의 속성데이터를 보여주기 위한 함수
function show_attributes(){
	notify("info", "데이터베이스 연결 시도중.");
	
	var host = "";
	var port = "";
	var db_name = "";
	var dbtable_name = "";
	var id = getCookie("id");
	var password = getCookie("password");
	
	if(tst_tableObject.check == true){
		host = tst_tableObject.host;
		port = tst_tableObject.port;
		db_name = tst_tableObject.db_name;
		dbtable_name = tst_tableObject.dbtable_name;
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		getAttributesPostGIS("","", param);	
	}
	
	if(tst_table_pointObject.check == true){
		host = tst_table_pointObject.host;
		port = tst_table_pointObject.port;
		db_name = tst_table_pointObject.db_name;
		dbtable_name = tst_table_pointObject.dbtable_name;
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		getAttributesPostGIS("","", param);	
	}
	
	if(tst_table_lineObject.check == true){
		host = tst_table_lineObject.host;
		port = tst_table_lineObject.port;
		db_name = tst_table_lineObject.db_name;
		dbtable_name = tst_table_lineObject.dbtable_name;
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		getAttributesPostGIS("","", param);	
	}
}


//TODO DB의 Spatial Data를 보여주기 위한 함수
function show_spatial(_host, _port, _db_name, _dbtable_name, _id, _password){
	var host = "";
	var port = "";
	var db_name = "";
	var dbtable_name = "";
	var id = "";
	var password = "";
	
	host = _host;
	port = _port;
	db_name = _db_name;
	dbtable_name = _dbtable_name;
	id = _id;
	password = _password;
	
	var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
	getSpatialPostGIS("","",param);
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

//TODO PostGIS에 연결하기 위한 정보 보내는 함수
function ConnPostDB(){
	
	var input_host = document.getElementById("dbconnect_tab_postgis_host");
	var input_port = document.getElementById("dbconnect_tab_postgis_port");
	var input_db_name = document.getElementById("dbconnect_tab_postgis_sid");
	var input_dbtable_name = document.getElementById("dbconnect_tab_postgis_service");
	var input_id = document.getElementById("dbconnect_tab_postgis_id");
	var input_password = document.getElementById("dbconnect_tab_postgis_pass");
	  
	var host = input_host.value;
	var port = input_port.value;
	var db_name = input_db_name.value;
	var dbtable_name = input_dbtable_name.value;
	var id = input_id.value;
	var password = input_password.value;
	
	
	//location += "?host="+host+"&port="+port+"&db_name="+db_name+"&dbtable_name="+dbtable_name+"&id="+id+"&password="+password;*/
	
	setCookie("id", id, 1);
	setCookie("password", password, 1);
	
	if(dbtable_name == "tst_table" && tst_tableObject.check == true){
		notify("warning", dbtable_name + "에 이미 접속되어 있습니다.");
		return;
	}
	
	if(dbtable_name == "tst_table_line" && tst_table_lineObject.check == true){
		notify("warning", dbtable_name + "에 이미 접속되어 있습니다.");
		return;
	}
	
	if(dbtable_name == "tst_table_point" && tst_table_pointObject.check == true){
		notify("warning", dbtable_name + "에 이미 접속되어 있습니다.");
		return;
	}
	
	switch(dbtable_name){
	case "tst_table" : setTstTableObjcet(host, port, db_name, dbtable_name);
		break;
	case "tst_table_point" : setTstTablePointObject(host, port, db_name, dbtable_name);
		break;
	case "tst_table_line" : setTstTableLineObject(host, port, db_name, dbtable_name);
		break;
	case "kz_astana_districts" : setTstTableObjcet(host, port, db_name, dbtable_name);
		break;
    case "kz_astana_streets" : setTstTableLineObject(host, port, db_name, dbtable_name);
		break;
    case "kz_astana_water" : setTstTableObjcet(host, port, db_name, dbtable_name);
		break;
    case "kz_astana_microdistricts" : setTstTableObjcet(host, port, db_name, dbtable_name);
		break;
    case "kz_astana_quartals" : setTstTableObjcet(host, port, db_name, dbtable_name);
		break;
    case "kz_astana_grass" : setTstTableObjcet(host, port, db_name, dbtable_name);
		break;
    case "kz_astana_buildings" : setTstTableObjcet(host, port, db_name, dbtable_name);
		break;
	}
	
	if(host!="" && port!="" && db_name!=""){
		var id = getCookie("id");
		var password = getCookie("password");
		show_spatial(host, port, db_name, dbtable_name, id, password);
	}
	
	else{
		setCookie("id", '', -1);
		setCookie("password", '', -1);
	}

	//location.href = location.origin + location.pathname + "?host="+host+"&port="+port+"&db_name="+db_name+"&dbtable_name="+dbtable_name;
	
	//window.open("../uitest.html?host="+host+"&port="+port+"&db_name="+db_name+"&dbtable_name="+dbtable_name+"&id="+id+"&password="+password);
	//console.warn("location = " + location);
}


//TODO 각 테이블들의 객체 설정
function setTstTableObjcet(_host, _port, _db_name, _dbtable_name){
	tst_tableObject.host = _host;
	tst_tableObject.port = _port;
	tst_tableObject.db_name = _db_name;
	tst_tableObject.dbtable_name = _dbtable_name;
	tst_tableObject.check = false;
}

function setTstTablePointObject(_host, _port, _db_name, _dbtable_name){
	tst_table_pointObject.host = _host;
	tst_table_pointObject.port = _port;
	tst_table_pointObject.db_name = _db_name;
	tst_table_pointObject.dbtable_name = _dbtable_name;
	tst_table_pointObject.check = false;
}

function setTstTableLineObject(_host, _port, _db_name, _dbtable_name){
	tst_table_lineObject.host = _host;
	tst_table_lineObject.port = _port;
	tst_table_lineObject.db_name = _db_name;
	tst_table_lineObject.dbtable_name = _dbtable_name;
	tst_table_lineObject.check = false;
}

//TODO 쿠키 생성 & 삭제
function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}


// TODO 상단 메뉴바 버튼 모음
//상단 메뉴바 버튼을 눌렀을 때 발생하는 이벤트 모음
function mnu_dialog_func(ui_func){

	ol_AllControlsDown(true,true,true,true);
	switch(ui_func){
	case "#mnu_basemap":
		//기본지도 상단메뉴를 눌렀을 때
		
		$(ui_func).dialog('open'); //만들어진 다이얼로그를 만드는 것 (ui_func)는 이름이다. (즉 mnu_basemap임) 
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
	case "#mnu_layers":
		//not1("프로젝션 기능을 제공합니다.");
		notify('warning', "테스트!!!!!!!!!!!!");
		
		geodtjs.ui.createLayerDialog2("layerlist", "layerlist", geodtjs.map2d.map.layers);
		 
        
		break;
	case "#mnu_draw":
		//벡터 그리기 버튼
		/*hideAllButtonSet("#mnu_btndraw");
		var radio_btn = $( "#mnu_btndraw" );	
		//버튼을 메뉴로 이동시키기
		$("#mnu_btndraw" ).position({
			my:"center top",
			at:"center bottom",
			of:"#ui_menu_draw"
		});		
		radio_btn.toggle("highlight", {}, 200);
		//초기 (이동버튼)으로 변경하는 루틴
*/		
		geodtjs.ui.createEntityDialog();
		break;
	/*case "#mnu_draw":
		//벡터 그리기 버튼
		
		var radio_btn = $( "#mnu_btndraw2" );
		//버튼을 메뉴로 이동시키기
		radio_btn.css({
			'position' : 'absolute',
			
		});
		radio_btn.position({
			'my' : 'center top',
			'at' : 'center bottom',
			'of' : $('#ui_menu_draw'),
		});
		
		$("#mnu_btndraw2" ).position({
			//my:"center top",
			//at:"center bottom",
			of:"#ui_menu_draw"	
		});	
		radio_btn.toggle("highlight", {}, 200);
		//초기 (이동버튼)으로 변경하는 루틴
		break;*/
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
            var ui = geodtjs.ui;
            ui.create("canvasMap");
            
            var append = [];
			var formid = 'geodtjs_ui_uploadshp_' + "uploader";
			
			var div = $("<div id='" + formid + "'></div>");
			/* div.html("<from action='src/jsp/shpuploader.jsp' method='post' enctype='multipart/form-data'>"+
				"<input type='file' name='file' size='50'/>" +
				"<input type='submit' value='Upload File'/>" + 
			"</form>"); */
			
			var form = $("<from action='builder/file/shpuploader.jsp' method='post' enctype='multipart/form-data'>");
			var uploader = $("<input id='"+ formid + "_file' type='file' name='file' size='30'/>");
			var submit = $("<input type='submit' value='파일 업로드'/>");
			var projInfo = $("<div id='projection_information'></div>");
			var loadshp = $("<button> 업로드 파일 입력 </button>").attr('disabled', 'disabled');
			var progress = $("<div id='progress_fileuploader'></div>").progressbar();
			//var progresslabel = $("<div id='progress_label'>testing</div>");
			var projections = $("<button> 좌표체계 변환 </button>").attr('disabled', 'disabled');
			
			//상세 설정 (현재 표현 프로젝션을 표시)
			projInfo.css({'height':'50px'});
			projInfo.text("display Projection : " + geodtjs.map2d.displayprojection.projCode);
		
			//프로그래스바 설정
			progress.css({'width':'100%', 'height':'20px'});
			
			//붙이기
			//progresslabel.appendTo(progress);
                uploader.appendTo(form);
                submit.appendTo(form);                
                progress.appendTo(form);                
                projInfo.appendTo(form);
                projections.appendTo(form);
                loadshp.appendTo(form);
                form.appendTo(div);
                
            //이벤트 부분
            loadshp.click(function(){
               shpimport(filename, file_projection, progress);
            });
            
            projections.click(function(){
            	console.log("좌표체계 버튼 입력");
            	loadshp.removeAttr('disabled');
            	//ui.createProjectionDialog("좌표변환", "projection", map.layers, geodtjs.map2d.getProjNames());
            	ui.createProjectionSearcher("좌표변환", "projection", geodtjs.map2d.getProjNames());
            });

            submit.click(function(){
               console.log("submit clicked");

               if(!jQuery.ajax){
                   alert("ajax 없음");
               }
               //첨부 파일을 multipart / form-data로 처리하기 위한 부분
               var data = new FormData();
               $.each($("#"+formid+"_file")[0].files, function(i, file){
                   data.append('file-'+i, file);
			});
				
				$.ajax({
					url: 'builder/file/shpuploader.jsp',
					type: 'post',
					data : data,
					contentType : false,
					processData: false,
					success : function(data, textStatus, jqXHR){
						progress.progressbar("option", {value : true});
						progress.progressbar("value", 0);
						console.log("uploaded");
						var jsonStr = jqXHR.responseText;
			            var jsonObj = eval('('+jsonStr+')');
			            if(jsonObj.length < 1){
			            	notify("error", "테이블 연결 실패");
			            	return;
			            }
			            var progresslen =  50 / jsonObj.length;
			            for(var i in jsonObj){
			            	progress.progressbar("value", progresslen);
			            	if(typeof jsonObj[i].filename == 'string'){
				            	filename = jsonObj[i].filename;
			            	}
			            }
			            
			            //등록 대기 시간 설정
			            setTimeout(function(){
			            	progress.progressbar("value", 100);
			            	//loadshp.removeAttr('disabled');
			            	projections.removeAttr('disabled');
			            	alert("데이터가 등록 되었습니다.");
			            },3000);
			            
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						console.error("error in jsp");
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
						progress.progressbar("option", {value : true});
					}
				});
			});
			append.push(div);
			ui.createDialog('uploader', '파일 입력', append, 500);

            console.log(ui);
		break;
	case "#mnu_config":
		//다이얼로그 오픈
		console.log(map);
		break;
	}
}

//유승범 추가
/*
    SHP 파일 입력하는 부분
*/
function shpimport(_filename, _projection, _progress){
			//버튼이 눌렸을 때 발생하는 이벤트
			notify("info","shp 버튼 클릭");
			
			
			//shp file import (js-shapefile-to-geojson 사용)
			var parser = new OpenLayers.Format.GeoJSON();
			var step = 0;
			var count = 1;
			
			/*var div = $("<div id = 'dialog_progress' title='Converting'></div>");
			var label = $("<div class = 'progress-label'></div>");
			var progress = $("<div id = 'progress'></div>").progressbar({
				value:false,
				change :function(){
					label.text("Loading...");
				},
				complete :function(){
					label.text("Complete");
				}
				});
			label.appendTo(progress);
			progress.appendTo(dialog);
			var dialog = div.dialog({
				modal : true,
				width : '500px',
				title : "Converting"
				});
			dialog.dialog("open");*/
			
			var LayerStyle = OpenLayers.Util.extend({},
					OpenLayers.Feature.Vector.style['default']
					);
			LayerStyle.fillOpacity = 0.4;
			LayerStyle.fillColor = geodtjs.ui.getRandomColor();
			LayerStyle.graphicOpacity = 0.8;
			LayerStyle.strokeColor = geodtjs.ui.getRandomColor();
			LayerStyle.strokeWidth = 1;
			var stylemap = new OpenLayers.StyleMap(LayerStyle);
			
			

			
			var shplayer = new OpenLayers.Layer.File("vector_"+_filename, {
				projection: geodtjs.map2d.displayprojection,
				preFeatureInsert : function(_feature){
					_feature.geometry.transform
						(
								new OpenLayers.Projection(_projection),
								geodtjs.map2d.projection
						);
				},
				styleMap : stylemap
			});
			
			
			geodtjs.map2d.map.addLayer(shplayer);
			var shppath = _filename;
			console.log(_filename);
			
			var opts = {shp : shppath};
			var shapefile = new Shapefile(opts, function(data){
				console.log("data");
				var features = parser.read(data.geojson);
				step = 100 / features.length;
				shplayer.addFeatures(features);
				geodtjs.map2d.map.zoomToExtent(shplayer.getDataExtent());
				alert("파일 입력이 완료 되었습니다.");
			});
			
		}



function getParameter() {
    var strURL = location.search;
    var tmpParam = strURL.substring(1).split("&");
    if(strURL.substring(1).length > 0){
    	var param="";
        var Params = new Array();
        for(var i=0;i<tmpParam.length;i++){
            Params[i] = tmpParam[i].split("=") + ",";
            //return Params[1];
            param += Params[i];
        }
        return param;
     }
     return "";
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

//TODO 맵 이동 끝났을 때 실행
//개발자 : 김종회
function onMoveEnd(){
	//alert("움직였다 끝났지요 룰루~");
	var map_bounds = map.getExtent();
	getDatasFromBounds(map_bounds);
}


//HTML의 Element에 Remove 콜을 할 수 있게 하는 루틴
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}; 

//TODO 맵을 이동시키는 함수
//개발자 : 김종회
function moveMap(geoX, geoY){
	var sum_geoX = new Number();
	var sum_geoY = new Number();
	
	for(var i in geoX){
		sum_geoX += Number(geoX[i]);
	}
	
	for(var i in geoY){
		sum_geoY += Number(geoY[i]);
	}
	
	var avg_geoX = sum_geoX / geoX.length;
	var avg_geoY = sum_geoY / geoY.length;
	
	map.setCenter(new OpenLayers.LonLat(avg_geoX, avg_geoY));
}
