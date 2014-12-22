/*
 * 
 * 
 * move.html (뷰어 관련)
 * UI의 이벤트 리스너를 정의한다.
 * 
 * 
 */


/*
var dt = {
		version:"alpha 1",
		map:null,
		ui:null
		};

dt.map.prototype = {
		ol:null,
		builder:null
};

dt.ui.prototype = {
		dialogs:null,
		panels:null,
};
*/

function dtMenuBtnDown(_type, _id){
	//메뉴버튼을 눌렀을 때 발생되는 이벤트
		switch(_type){
		case "dialog":
			break;
		}
}

function dt_ui_update_geominfo(_tabdiv, _text){
	$("#geometryinfo").text(output);
}

function dt_ui_update_attrinfo(_tabdiv, _text){
	$("#attributesinfo").text(output);
}

function dt_ui_update_layerinfo(_tabdiv, _text){
	$("#layerinfo").text(output);
}

function dt_ui_add_menubutton(ui_name, ui_image){
	if(ui_image!=null){		
		$(function() {
		    $( ui_name )
		      .button({
		    	  text:false,
		    	  icons:{primary: ui_image}
		    	  })
		      .click(function() {
		    	  var output;
		    	  output = ui_name + " is selected";
		    	  console.log(output);
		    	  /**/
		        
		      })
		  });
		
	}
	else{
		$(function() {
		    $( ui_name )
		      .button()
		      .click(function() {
		        alert( "Running the last action" + ui_name );
		      })
		  });
	} 
}