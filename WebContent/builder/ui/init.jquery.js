
$(function(){
	//그리기 버튼 셋
	$( "#mnu_btndraw" ).buttonset().hide();		//초기화시 숨기기
	$("#mnu_btndraw_2D").button({
		text:true

	});
	$("#mnu_btndraw_3D").button({
		text:true
	});
	$( "#mnu_btndraw input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	//2D 그리기 버튼 셋
	$( "#mnu_btndraw_2Dset" ).buttonset().hide();		//초기화시 숨기기
	//입력
	$("#mnu_draw_2D_add").button({
		text:true
	});
	//변경
	$("#mnu_btndraw_2D_modify").button({
		text:true
	});
	//삭제
	$("#mnu_btndraw_2D_delete").button({
		text:true
	});
	$( "#mnu_btndraw_2Dset input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	//2D 그리기 입력 버튼 셋
	$( "#mnu_btndraw_2D_addset" ).buttonset().hide();		//초기화시 숨기기
	//포인트
	$("#mnu_btndraw_2D_add_point").button({
		text:true
	});
	//라인
	$("#mnu_btndraw_2D_add_line").button({
		text:true
	});
	//폴리곤
	$("#mnu_btndraw_2D_add_polygon").button({
		text:true
	});
	//홀폴리곤
	$("#mnu_btndraw_2D_add_holepolygon").button({
		text:true
	});
	$( "#mnu_btndraw_2D_addset input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	//2D 수정 버튼 셋
	$( "#mnu_btndraw_2D_editset" ).buttonset().hide();		//초기화시 숨기기
	//이동
	$("#mnu_btndraw_2D_edit_move").button({
		text:true
	});
	//수정
	$("#mnu_btndraw_2D_edit_modify").button({
		text:true
	});
	$( "#mnu_btndraw_2D_editset input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	
	//3D 그리기 버튼 셋
	$( "#mnu_btndraw_3Dset" ).buttonset().hide();		//초기화시 숨기기
	//입력
	$("#mnu_draw_3D_add").button({
		text:true
	});
	//변경
	$("#mnu_btndraw_3D_modify").button({
		text:true
	});
	//삭제
	$("#mnu_btndraw_3D_delete").button({
		text:true
	});
	$( "#mnu_btndraw_3Dset input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	//3D 그리기 입력 버튼 셋
	$( "#mnu_btndraw_3D_addset" ).buttonset().hide();		//초기화시 숨기기
	//포인트
	$("#mnu_btndraw_3D_add_point").button({
		text:true
	});
	//라인
	$("#mnu_btndraw_3D_add_line").button({
		text:true
	});
	//폴리곤
	$("#mnu_btndraw_3D_add_polygon").button({
		text:true
	});
	//홀폴리곤
	$("#mnu_btndraw_3D_add_holepolygon").button({
		text:true
	});
	$( "#mnu_btndraw_3D_addset input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	//3D 수정 버튼 셋
	$( "#mnu_btndraw_3D_editset" ).buttonset().hide();		//초기화시 숨기기
	//이동
	$("#mnu_btndraw_3D_edit_move").button({
		text:true
	});
	//수정
	$("#mnu_btndraw_3D_edit_modify").button({
		text:true
	});
	$( "#mnu_btndraw_3D_editset input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	
	//수정하기 버튼셋 세팅
/*	$( "#mnu_btnmodify" ).buttonset().hide();
	$("#mnu_modifybtn_select").button({
		text:true,
		icons: {
	        primary: ".ui-icon-key"
	      }
	});
	$("#mnu_modifybtn_move").button({
		text:true,
		icons: {
	        primary: "ui-icon-extlink"
	      }
	});
	$("#mnu_modifybtn_delete").button({
		text:true,
		icons: {
	        primary: "ui-icon-trash"
	      }
	});
	$("#mnu_modifybtn_change").button({
		text:true,
		icons: {
	        primary: "ui-icon-refresh"
	      }
	});
	$( "#mnu_btnmodify input[type=radio]" ).change(function(){
		//dialog_message_onclick(this.id);
	});
	$( "#mnu_btnmodify input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});*/
	
	//레스터 버튼셋 세팅
	//$( "#mnu_btnraaster" ).buttonset().hide();		//초기화시 숨기기
	$( "#mnu_btnraster" ).buttonset().hide();
	$("#mnu_rasterbtn_make").button({
		text:true,
		icons: {
	        primary: "ui-icon-plusthick"
	      }
	});
	$("#mnu_rasterbtn_delete").button({
		text:true,
		icons: {
	        primary: "ui-icon-trash"
	      }
	});
	$("#mnu_rasterbtn_move").button({
		text:true,
		icons: {
	        primary: "ui-icon-arrow-4"
	      }
	});
	$("#mnu_rasterbtn_transparent").button({
		text:true,
		icons: {
	        primary: "ui-icon-triangle-2-n-s"
	      }
	});
	$("#mnu_rasterbtn_change").button({
		text:true,
		icons: {
	        primary: "ui-icon-arrow-4-diag"
	      }
	});
	$( "#mnu_btnraster input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	//슬라이더 세팅
	$( "#mnu_rasterbtn_slider" ).slider({
      range: "min",
      min: 0,
      max: 100,
      value: 70,
      slide: function( event, ui ) {
    	  //raster 투명도에 관련된 함수를 실행시킨다.
    	  callbackSlideRaster(this.id, ui);
      }
      });
	//$( "#mnu_rasterbtn_slider" ).hide();
	$( "#mnu_rasterbtn_slider_name" ).hide();
	
	//데이터베이스 버튼 세팅
	$( "#mnu_btndatabase" ).buttonset().hide();
	$("#mnu_databasebtn_add").button({
		text:true,
		icons: {
	        primary: "ui-icon-circle-plus"
	      }
	});
	$("#mnu_databasebtn_close").button({
		text:true,
		icons: {
	        primary: "ui-icon-circle-close"
	      }
	});
	$("#mnu_databasebtn_save").button({
		text:true,
		icons: {
	        primary: "ui-icon-circle-check"
	      }
	});
	$( "#mnu_btndatabase input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
	
	
	//속성 버튼 세팅
	$( "#mnu_btnattribute" ).buttonset().hide();
	$("#mnu_btnattribute_select").button({
		text:true,
		icons: {
	        primary: "ui-icon-key"
	      }
	});
	$("#mnu_btnattribute_view").button({
		text:true,
		icons: {
	        primary: "ui-icon-info"
	      }
	});
	$("#mnu_btnattribute_save").button({
		text:true,
		icons: {
	        primary: "ui-icon-circle-check"
	      }
	});
	$( "#mnu_btnattribute input[type=radio]" ).click(function(){
		dialog_message_onclick(this.id);
	});
});