<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>GeoDT™ for web (가제), Alpha build</title>

<!-- <link rel="stylesheet" type="text/css" href="Sample_ModifyObject.css"> -->
<!-- 오픈 레이어스 세팅 -->
<script src="includes/OL2/OpenLayers.js"></script>
<link rel="stylesheet" type="text/css" href="includes/OL2/theme/default/style.css">
<!-- GOOGLE MAP -->
<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
<!-- jQuery 세팅 -->
<script src='includes/jQuery/jquery-1.11.1.js'></script>
<!-- jQueryUI 세팅 -->
<script src='includes/jQueryUI/jquery-ui.js'></script>
<link rel="stylesheet" type="text/css" href="includes/jQueryUI/theme/start/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="includes/jQueryUI/theme/start/theme.css">


<!-- Custom Setting  -->
<script src='builder/ui/init.jquery.js'></script>
<script src='builder/ui/geodt.js'></script>
<script src='builder/ui/raster.js'></script>
<script src='builder/ui/move.js'></script>
<script src='builder/ui/draw.js'></script>
<!-- 속성 출력부분 추가 -->
<script src='builder/ui/attr_PostGIS.js'></script>
<!-- 기본지도 변경 루틴 추가 -->
<script src='builder/ui/baselayer.js'></script>
<script src='includes/proj4js/proj4js-combined.js'></script>

<!-- jsTree library -->
<script src='includes/jsTree/jstree.js'></script>
<link rel="stylesheet" type="text/css" href="includes/jsTree/themes/default/style.css">

<!-- handsontable library -->
<script src='includes/handsontable/jquery.handsontable.full.js'></script>
<link rel="stylesheet" type="text/css" href="includes/handsontable/jquery.handsontable.full.css">

<!-- NOTIFY plugin -->
<script src='includes/notifyjs/notify.js'></script>
<script src='includes/notifyjs/styles/metro/notify-metro.js'></script>
<link rel="stylesheet" type="text/css" href="includes/notifyjs/styles/metro/notify-metro.css">

<!-- 수정하기위한 라이브로리 추가 -->
<script src = 'includes/ModifyFeature-tools.js'></script>


<style>
html, body{
	height:100%;
	margin:0px;
	border-spacing:0px;
	width:(($(window).width()) - 10)+'px'
}
table {
		border:0px;
		border-spacing:0px;
		margin:0px;
		/* font-size: 80%; */
		padding: 0px;
		width:100%;
		height:100%;
		border-collapse: collapse;
	}
	table.main_table td:empty{
	display:none;
	}
	table.main_table td{
	padding:0px;
	}
	
	.basemap-submenu {
    position: absolute;
    left: 100;
    bottom: -500;
  }
  .ui-widget{
  	font-size:100%;
  }
  
  .ui-tooltip{
  	padding:3px;
  	border:2px;
  	margin:1px;
  	font-size:100%;
  }
  
  .behind_codes{
  font-size:100%;
  }
  
  .dialog{
  position:relative;
  }
  
  	.mnu_btnrasterset{
  	position:absolute;
  	}
  	
  	.mnu_btn{
  	position:absolute;
  	font-size:80%;
  	}
 
  	/* .mnu_btnedit_point{
  	background:#0078ae url("builder/img/icon/line_p.png") repeat-x;
  	font-size:30%;
  	 } */
  	 
  	 #wrap{width: 400px;margin: 0 auto; }
  	 
  	 img.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/* 트리 데이터 */
.child_node{
font-size:70%;
}

.attr_grid{
font-size:70%;
}

  
</style>

<script>

//다이얼로그 미리 생성하기
$(document).ready(function(){
	
	var mnu_list = [];
	mnu_list.push("#mnu_basemap");
	mnu_list.push("#mnu_database");
	mnu_list.push("#mnu_projection");
	mnu_list.push("#mnu_draw");
	mnu_list.push("#mnu_raster");	
	mnu_list.push("#mnu_modify");
	mnu_list.push("#mnu_save");
	mnu_list.push("#mnu_file");
	mnu_list.push("#mnu_config");
	
	
	for(var i in mnu_list){
		/* 다이얼로그 1 */
		$(mnu_list[i]).dialog({
	        autoOpen: false,
	        draggable: false,
	        width: 'auto',
	        modal: false
	        /* buttons: {
	            "Close": function () {
	                $(this).dialog('destroy').remove()
	            }
	        } */
	    });
	}
	
	
	//속성 다이얼로그 생성하기
	
	$("#mnu_attribute").dialog({
        autoOpen: false,
        draggable: true,
        width: 550,
        modal: false
        /* buttons: {
            "Close": function () {
                $(this).dialog('destroy').remove()
            }
        } */
    	});
});


window.onresize = function(event){
	$("#canvasMap").css({
		//'height':(($(window).height()) - 50)+'px',
		'width':(($(window).width())-2) + 'px'
		});
	$("#table_head").css({
		'width':(($(window).width())-15) + 'px'
	});
	$("#table_foot").css({
		'width':(($(window).width())-15) + 'px'
	});
	$("#table_body").css({
		'width':(($(window).width())-15) + 'px'
	});
	$("ui_input").css({
		'width':(($(window).width())-150) + 'px'
	});
}


  </script>


</head>
<body id="main_body">
<table id="main_table" class = "main_table" >
	<thead id="table_head">
		<tr>
		<!-- 헤드부분 관련 데이터 세팅 -->
			<td style="width:125px; height:25px">Main Banner</td>
			<td colspan=3>
				<div id="ui_menu_toolbar" class="ui-widget-header ui-cornel-all" align="right" style="font-size:75%; width:100%">
				<button id="ui_menu_basemap" title="기본지도">기본지도</button>
				<button id="ui_menu_database" title="DB연결">DB연결</button>
				<button id="ui_menu_projection" title="좌표변환">좌표변환</button>
				<button id="ui_menu_draw" title="그리기">그리기</button>
				<button id="ui_menu_raster" title="레스터입력">그림입력</button>
				<button id="ui_menu_attributes" title="속성보기">속성보기</button>
				<!-- <button id="ui_menu_modify" title="수정하기">수정하기</button> -->
				<!-- <button id="ui_menu_save" title="저장하기">저장하기</button> -->
				<button id="ui_menu_file" title="파일입력">파일입력</button>
				<button id="ui_menu_config" title="Config">환경설정</button>
				</div>
			</td>
		</tr>
	</thead>
	<tbody id="table_body">
		<tr>
			<td colspan=3 style="height:100%!important">
				<!-- 지도 영역 -->
				<div id="canvasMap" class="ajaxCanvasMap" style="width:100%; background-color: #ffffff"></div>
			</td>
		</tr>
	</tbody>
	<tfoot id="table_foot">
	<tr height=20>
	<td>command :</td>
	<td><input id="ui_input" style="width:100%; height:15px;"></td>
	<td style="width:250px;" align="right"><span id="creadit" class="behind_codes" title="dev: RS Ryu(chief), TY Choi(sub), JH Kim(coder)">GeoDT™ for web, Alpha build</span></td>
	</tr>
	</tfoot>
</table>




<!-- 다이얼로그 영역 -->
<div id="mnu_basemap" class="'dialog" title="기본지도" style="padding:3px;">

<style>
	.basemap_labels{
	width:250px;
	}
</style>
<script>
$(function() {
    $( "#radio" ).buttonset();
    $('#radio input[type=radio]').change(function(){
    	dialog_message_onclick(this.id);
    });
  });
</script>
<form>
  <div id="radio">
    <input type="radio" id="basemap_google" name="radio" class="radio_set"><label for="basemap_google" class="basemap_labels">Google Maps</label></br>
    <input type="radio" id="basemap_osm" name="radio" class="radio_set"><label for="basemap_osm" class="basemap_labels">OpenStreetMap</label></br>
    <input type="radio" id="basemap_daum" name="radio" class="radio_set"><label for="basemap_daum" class="basemap_labels">Naver</label></br>
    <input type="radio" id="basemap_naver" name="radio" class="radio_set"><label for="basemap_naver" class="basemap_labels">Daum</label>
  </div>
</form>
	
	
	<!-- <iframe src="builder/ui.basemap.html" style="width:270px; height:130px; border:0px; align:middle;"></iframe> -->
</div>
<div id="mnu_database" class="'dialog" title="DB연결" style="padding:3px;">
<!-- <iframe src="builder/ui.dbconnect.html" style="width:620px; height:230px; border:0px; align:middle;"></iframe> -->
</div>
<div id="mnu_projection" class="'dialog" title="좌표변환">
<!-- <iframe src="builder/ui.dbconnect.html" style="width:290px; height:150px; border:0px; align:middle;"></iframe> -->
</div>
<div id="mnu_draw" class="'dialog" title="벡터입력">
<!-- <iframe src="builder/ui.dbconnect.html" style="width:290px; height:150px; border:0px; align:middle;"></iframe> -->
</div>
<div id="mnu_raster" class="'dialog" title="그림삽입">
<iframe src="builder/ui.dbconnect.html" style="width:290px; height:150px; border:0px; align:middle;"></iframe>
</div>
<div id="mnu_attribute" class="'dialog" title="속성보기" style="padding:3px; height:500px;">
	<table style="">
		<tr>
		<td style="width:150px; height:500px; vertical-align:top;">
			<!-- 트리 입력 부분 -->
			<div id="attr_tree" class="attr_tree" ></div>
		</td>
		<td style="width:500px; height:500px; vertical-align:top;">
			<div id="attr_grid" class="attr_grid" ></div>
		</td>
		</tr>
	</table>
	<!-- <iframe src="builder/ui.attribute.html" style="width:500px; height:250px; border:0px; align:middle;"></iframe> -->
</div>
<div id="mnu_modify" class="'dialog" title="수정하기">
<iframe src="builder/ui.dbconnect.html" style="width:290px; height:150px; border:0px; align:middle;"></iframe>
</div>
<div id="mnu_save" class="'dialog" title="저장하기">
	<!-- <form action="FileUpload.jsp" name="fileForm" enctype="multiple/form-data" mathod="POST"> -->
	<form action="apachefileupload.jsp" name="fileForm" enctype="multiple/form-data" mathod="POST">
		<input type="file" name="uploadFile" id="uploadFile">
		<input type="submit" value="업로드">
	</form>
<!-- <iframe src="builder/ui.dbconnect.html" style="width:290px; height:150px; border:0px; align:middle;"></iframe> -->
</div>
<div id="mnu_file" class="'dialog" title="파일입력">
<iframe src="builder/ui.dbconnect.html" style="width:290px; height:150px; border:0px; align:middle;"></iframe>
</div>
<div id="mnu_config" class="'dialog" title="환경설정">
<!-- <iframe src="builder/ui.dbconnect.html" style="width:290px; height:150px; border:0px; align:middle;"></iframe> -->
<iframe src="builder/ui.raster.html" style="width:400px; height:300px; border:0px; align:middle;"></iframe>
</div>



<!-- 수정하기 버튼 모음 -->
<form>
	  <div id="mnu_btnmodify" class="mnu_btn mnu_btnmodifyset">
	    <input type="radio" id="mnu_modifybtn_select" name="radio" class="mnu_radiobtn"><label for="mnu_modifybtn_select" class="mnu_modifybtn_select">벡터선택</label>
	    <input type="radio" id="mnu_modifybtn_move" name="radio" class="mnu_radiobtn"><label for="mnu_modifybtn_move" class="mnu_btnmodify_move">벡터이동</label>
	    <input type="radio" id="mnu_modifybtn_delete" name="radio" class="mnu_radiobtn"><label for="mnu_modifybtn_delete" class="mnu_btnmodify_delete">벡터삭제</label>
	    <input type="radio" id="mnu_modifybtn_change" name="radio" class="mnu_radiobtn"><label for="mnu_modifybtn_change" class="mnu_btnmodify_change">벡터수정</label>
	  </div>
</form>


<!-- 레스터 입력 버튼 모음 -->
<form>
	  <div id="mnu_btnraster" class="mnu_btn mnu_btnrasterset">
	    <input type="radio" id="mnu_rasterbtn_make" name="radio" class="mnu_radiobtn"><label for="mnu_rasterbtn_make" class="mnu_btnraster_make">생성</label>
	    <input type="radio" id="mnu_rasterbtn_move" name="radio" class="mnu_radiobtn"><label for="mnu_rasterbtn_move" class="mnu_btnraster_move">이동</label>
	    <input type="radio" id="mnu_rasterbtn_change" name="radio" class="mnu_radiobtn"><label for="mnu_rasterbtn_change" class="mnu_btnraster_change">수정</label>
	    <input type="radio" id="mnu_rasterbtn_transparent" name="radio" class="mnu_radiobtn"><label for="mnu_rasterbtn_transparent" class="mnu_btnraster_transparent">투명</label>
	    <input type="radio" id="mnu_rasterbtn_delete" name="radio" class="mnu_radiobtn"><label for="mnu_rasterbtn_delete" class="mnu_btnraster_delete">삭제</label>	    
	  </div>
</form>

<!-- 투명 슬라이더 -->
<div id="mnu_rasterbtn_slider_name"  style="width:250px;height:15px;">
<table style="width:250px;">
	<tr>
		<td>투명도설정</td>
		<td><div id="mnu_rasterbtn_slider" style="width:150px;height:15px;"></div></td>
	</tr>
</table>
</div>

<!-- 데이터베이스 버튼 모음 -->
<form>
	  <div id="mnu_btndatabase" class="mnu_btn mnu_btndatabaseset">
	    <input type="radio" id="mnu_databasebtn_add" name="radio" class="mnu_radiobtn"><label for="mnu_databasebtn_add" class="mnu_databasebtn_add">열기</label>
	    <input type="radio" id="mnu_databasebtn_close" name="radio" class="mnu_radiobtn"><label for="mnu_databasebtn_close" class="mnu_btndatabase_close">닫기</label>
	    <input type="radio" id="mnu_databasebtn_save" name="radio" class="mnu_radiobtn"><label for="mnu_databasebtn_save" class="mnu_btndatabase_save">저장</label>	    
	  </div>
</form>


<!-- 그리기 버튼 모음 -->
<form>
	  <div id="mnu_btndraw" class="mnu_btn mnu_btndrawset">
	    <input type="radio" id="mnu_btndraw_2D" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D" class="mnu_btndraw_2D">2D</label>
	    <input type="radio" id="mnu_btndraw_3D" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D" class="mnu_btndraw_2D">3D</label>
	  </div>
</form>

<!-- 2D 버튼 모음 (입력,변경,삭제) -->
<form>
	  <div id="mnu_btndraw_2Dset" class="mnu_btn mnu_btndrawset mnu_btndrawset mnu_btndraw_2Dset">
	    <input type="radio" id="mnu_btndraw_2D_add" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_add" class="mnu_btndraw_2D_add">입력</label>
	    <input type="radio" id="mnu_btndraw_2D_edit" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_edit" class="mnu_btndraw_2D_edit">변경</label>
	    <input type="radio" id="mnu_btndraw_2D_delete" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_delete" class="mnu_btndraw_2D_delete">삭제</label>	    
	  </div>
</form>
<!-- 2D 입력 버튼 모음 (점형, 선형, 면형) -->
<form>
	  <div id="mnu_btndraw_2D_addset" class="mnu_btn mnu_btndrawset mnu_btndrawset mnu_btndraw_2Dset mnu_btndraw_2D_addset">
	    <input type="radio" id="mnu_btndraw_2D_add_point" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_add_point" class="mnu_btndraw_2D_add_point">점</label>
	    <input type="radio" id="mnu_btndraw_2D_add_line" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_add_line" class="mnu_btndraw_2D_add_line">선</label>
	    <input type="radio" id="mnu_btndraw_2D_add_polygon" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_add_polygon" class="mnu_btndraw_2D_add_polygon">면</label>
	    <input type="radio" id="mnu_btndraw_2D_add_holepolygon" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_add_holepolygon" class="mnu_btndraw_2D_add_holepolygon">홀</label>
	  </div>
</form>

<!-- 2D 변경 버튼 모음 () -->
<form>
	  <div id="mnu_btndraw_2D_editset" class="mnu_btn mnu_btndrawset mnu_btndrawset mnu_btndraw_2Dset mnu_btndraw_2D_editset">
	    <input type="radio" id="mnu_btndraw_2D_edit_move" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_edit_move" class="mnu_btndraw_2D_edit_move">이동</label>
	    <input type="radio" id="mnu_btndraw_2D_edit_modify" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_2D_edit_modify" class="mnu_btndraw_2D_edit_modify">수정</label>
	  </div>
</form>



<!-- 3D 버튼 모음 (입력,변경,삭제) -->
<form>
	  <div id="mnu_btndraw_3Dset" class="mnu_btn mnu_btndrawset mnu_btndrawset mnu_btndraw_3Dset">
	    <input type="radio" id="mnu_btndraw_3D_add" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_add" class="mnu_btndraw_3D_add">입력</label>
	    <input type="radio" id="mnu_btndraw_3D_edit" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_edit" class="mnu_btndraw_3D_edit">변경</label>
	    <input type="radio" id="mnu_btndraw_3D_delete" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_delete" class="mnu_btndraw_3D_delete">삭제</label>	    
	  </div>
</form>

<!-- 3D 버튼 모음 (점, 선, 면, 돌출) -->
<form>
	  <div id="mnu_btndraw_3D_addset" class="mnu_btn mnu_btndrawset mnu_btndrawset mnu_btndraw_3Dset mnu_btndraw_3D_addset">
	    <input type="radio" id="mnu_btndraw_3D_add_point" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_add_point" class="mnu_btndraw_3D_add_point">점</label>
	    <input type="radio" id="mnu_btndraw_3D_add_line" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_add_line" class="mnu_btndraw_3D_add_line">선</label>
	    <input type="radio" id="mnu_btndraw_3D_add_polygon" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_add_polygon" class="mnu_btndraw_3D_add_polygon">면</label>	    
	    <input type="radio" id="mnu_btndraw_3D_add_holepolygon" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_add_holepolygon" class="mnu_btndraw_3D_add_holepolygon">홀</label>
	    <input type="radio" id="mnu_btndraw_3D_add_extrude" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_add_extrude" class="mnu_btndraw_3D_add_extrude">돌출</label>
	  </div>
</form>

<!-- 3D 버튼 모음 (이동, 수정) -->
<form>
	  <div id="mnu_btndraw_3D_editset" class="mnu_btn mnu_btndrawset mnu_btndrawset mnu_btndraw_3Dset mnu_btndraw_3D_editset">
	    <input type="radio" id="mnu_btndraw_3D_edit_move" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_edit_move" class="mnu_btndraw_3D_edit_move">입력</label>
	    <input type="radio" id="mnu_btndraw_3D_edit_modify" name="radio" class="mnu_radiobtn"><label for="mnu_btndraw_3D_edit_modify" class="mnu_btndraw_3D_edit_modify">변경</label>
	  </div>
</form>


<!-- 속성보기 모음 (선택, 보기, 저장) -->
<form>
	  <div id="mnu_btnattribute" class="mnu_btn mnu_btnattributeset mnu_btnattributeset" >
	    <input type="radio" id="mnu_btnattribute_select" name="radio" class="mnu_radiobtn"><label for="mnu_btnattribute_select" class="mnu_btnattribute_select">선택</label>
	    <input type="radio" id="mnu_btnattribute_view" name="radio" class="mnu_radiobtn"><label for="mnu_btnattribute_view" class="mnu_btnattribute_view">보기</label>
	    <input type="radio" id="mnu_btnattribute_save" name="radio" class="mnu_radiobtn"><label for="mnu_btnattribute_save" class="mnu_btnattribute_save">저장</label>
	  </div>
</form>

<script type = "text/javascript">
var map;
var pointLayer;
var lineLayer;
var polygonLayer;
var TempLayer;
var entityCount;

var controls = [];


	init();
	function init(){
		//'width':($(window).width())+'px'
		$("#canvasMap").css({
			'height':(($(window).height()) - 50)+'px'
			
			});
		entityCount = 0;		//동적 DIV 생성 개수 카운터
		
		var ui_menu_buttons = [];
		
		setTabs();
		addOLMap();
		/* $("#mnu_btnedit" ).position({
			my:"right top",
			at:"right bottom",
			of:"#ui_menu_toolbar"
		}); */
		
		
		//메뉴이름,메뉴 아이콘 이름(css 참조) 순서		
		add_basemap("ui_menu_basemap", ".ui_class_basemap","ui-icon-script", "#mnu_basemap", "ui_menu_basemap");
		add_basemap("ui_menu_database", ".ui_menu_database","ui-icon-plusthick", "#mnu_database", "ui_menu_database");
		add_basemap("ui_menu_projection", ".ui_menu_projection","ui-icon-transferthick-e-w", "#mnu_projection", "ui_menu_projection");
		add_basemap("ui_menu_draw", ".ui_menu_draw","ui-icon-pencil", "#mnu_draw", "ui_menu_draw");
		add_basemap("ui_menu_raster", ".ui_menu_raster","ui-icon-image", "#mnu_raster", "ui_menu_raster");
		add_basemap("ui_menu_attributes", ".ui_menu_attributes","ui-icon ui-icon-info", "#mnu_attribute", "ui_menu_attributes");
		/* add_basemap("ui_menu_modify", ".ui_menu_modify","ui-icon-wrench", "#mnu_modify", "ui_menu_modify"); */
		add_basemap("ui_menu_save", ".ui_menu_save",".ui-icon-disk", "#mnu_save", "ui_menu_save");
		add_basemap("ui_menu_file", ".ui_menu_file","ui-icon-folder-open", "#mnu_file", "ui_menu_file");
		add_basemap("ui_menu_config", ".ui_menu_config","ui-icon-gear", "#mnu_config", "ui_menu_config");
		
		//지원되지 않는 기능 표시하기
		$("#ui_input").click(function(evt){
			//not1("지금은 지원되지 않습니다.<br><b>Beta build</b>에 지원 예정");
			notify("error", "지금은 지원되지 않습니다.<br><b>Beta build</b>에 지원 예정");
		});
	}
	
	function addmenubuttons(ui_menu_buttons){
		
		var btns = [];
		
		for(var i in ui_menu_buttons){
			console.log(ui_menu_buttons[i][0]);
			dt_ui_add_menubutton(ui_menu_buttons[i][0], ui_menu_buttons[i][1]);
			/* $(ui_menu_buttons[i][0]).button().click(
				function(){
					alert(ui_menu_buttons[i][0]);
				}
			); */
		}
	}
	
	function setTabs(){
		var _height = window.innerHeight;
		$("#ui_tab").tabs({collapsible: true});
		
	}
	
	function setTooltips(){
		$("#ui_tab").tooltip();
		$("#creadit").tooltip();
	}
	
	function addOLMap(){
		
		//OpenLayers.ProxyHost = "proxy.jsp";
		//프로젝션 설정
		var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
		var toProjection   = new OpenLayers.Projection("EPSG:900913");
		

		/* map = new OpenLayers.Map('canvasMap',
				{
					projection: toProjection,//바꿀좌표체계정의
					displayProjection: fromProjection,
					zoom: 18,
					'sphericalMercator': true,
		            'maxExtent': new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
				}
		); */
		
		map = new OpenLayers.Map('canvasMap', {
			projection: toProjection,//바꿀좌표체계정의
			displayProjection: fromProjection,
			zoom: 19
		});
		
		//add Google Map
		 var google = new OpenLayers.Layer.Google(
					"Google Streets",
					{numZoomLevels: 19}
					);
		map.addLayer(google);

		//WMS Layer
		/* var dblayer = new OpenLayers.Layer.WMS(
			"SAMPLE",
			"http://localhost:8090/geoserver/wms",
			{
		  		'layers': 'A001',
				transparent:true,
		     	},
			{
				isBaseLayer: false
			});
		
		map.addLayer(dblayer);
		
		var dblayer2 = new OpenLayers.Layer.WMS(
				"SAMPLE2",
				"http://localhost:8090/geoserver/wms",
				{
			  		'layers': 'B001',
					transparent:true,
			     	},
				{
					isBaseLayer: false
				});
			
			map.addLayer(dblayer2); */
		
				
		//set center position
		 var bounds = new OpenLayers.Bounds(
				14242881.317416, 4484570.60066,
				14243238.227328, 4484764.6790522
				//14243238.327328, 4484764.6790522
				);
		 
		//set Layer
		pointLayer = new OpenLayers.Layer.Vector("USER_POINT");
		var lineLayer = new OpenLayers.Layer.Vector("USER_LINE");
		var polygonLayer = new OpenLayers.Layer.Vector("USER_POLYGON"/*, {renderers: renderer}*/);
		
		map.addLayer(pointLayer);	
		map.addLayer(lineLayer);
		map.addLayer(polygonLayer);	
		map.zoomToExtent(bounds);
		var pointctrl = new OpenLayers.Control.MousePosition();
		map.addControl(pointctrl);
		pointctrl.activate();
		console.log(map);
		ol_AllControlsDown(true,true,true,true);
	}
	

	
	
	function ol_AllControlsDown(_isNavigate, _isZoom, _isArgparser, _isAttributions){
		console.log("Controls Down");
		var mapcontrols = map.controls;
		for(var i in mapcontrols){
			if(i == 0){
				if(_isNavigate == false){
					//네비게이션 기능 끄기
					console.warn("navigate");
					mapcontrols[i].deactivate();
				}
			}
			else if(i == 1){
				if(_isZoom == false){
					//??? 기능 끄기
					console.warn("_isZoom");
					mapcontrols[i].deactivate();
				}
			}
			else if((i == 2)){
				if(_isArgparser == false){
					//_isArgparser 기능 끄기
					console.warn("_isArgparser");
					mapcontrols[i].deactivate();
				}
			}
			else if((i == 3)){
				if(_isAttributions == false){
					//??? 기능 끄기
					console.warn("_isAttributions");
					mapcontrols[i].deactivate();
				}
			}
			else if((i == 4)){
				
			}
			else {
				//다끄기
				console.log(i);
				mapcontrols[i].deactivate();
			}
		}
		
	}
</script>
</body>
</html>