
//작성자 : 유승범
//내용 : CORS (Cross-Origin Resource Sharing) 관련 부분 (XML 리퀘스트 생성)
//속성 부분 불러오는데 사용함.

//출력 그리드 생성


function getAttributesPostGIS(url, method, params){
	var req = new XMLHttpRequest();
	/*var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/OpenSource20141219/builder/db/" + "getAttributesPostGIS.jsp?"; //실행 JAVA URL
	 */	
	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/getAttributesPostGIS.jsp?";
	url += "host=" + params.host + "&";
	url += "port=" + params.port + "&";
	url += "account=" + params.account + "&";
	url += "id=" + params.id + "&";
	url += "pass=" + params.pass + "&";
	url += "tname=" + params.tname + "&";
	url += "geom=" + params.geom;
	
	var tname = "";
	
	if(params.tname == "tst_table"){
		tname = "POLYGON Table";
	}
	
	if(params.tname == "tst_table_line"){
		tname = "LINE Table";
	}
	
	if(params.tname == "tst_table_point"){
		tname = "POINT Table";
	}
	
	console.warn("requestCORS() : Connection Database -  attr_postGIS.jsp");
	console.log(url);
	
	//Feature detection for CORS
	if ('withCredentials' in req) {
	 req.open('post', url, true);
	 // Just like regular ol' XHR
	 req.onreadystatechange = function() {
	     if (req.readyState === 4) {
	         if (req.status >= 200 && req.status < 400) {
	        	notify("success", "서버 연결성공.");
	        	console.warn("parsing JSON");
	        	//JSON 파싱하는 루틴
	        	var jsonStr = req.responseText;
	            var jsonObj = eval('('+jsonStr+')');
	            console.log(jsonObj);
	            
	            
	            if(jsonObj.length < 1){
	            	notify("error", "테이블 연결 실패");
	            	return;
	            }
	            
	        	//JSON 오브젝트를 JavaScript 오브젝트로 변환
	        	var schemas = [];
	        	//var attributes = [];
	        	var attribute = [];
	        	var isfirst = true;
	        	
	        	for(var i in jsonObj){
	        		var schema = [];
	        		var att_node = [];
	        			for(var name in jsonObj[i]){
	        				//스키마는 하나만 검출
	        				if(isfirst){
		        			schema.push(name);
	        				}
	        				//개별 노드
	        				att_node.push(jsonObj[i][name]);
		        		}
	        			isfirst = false;
	        			
	        		if(schema.length > 1){
	        			schemas.push(schema);
	        		}
	        		//Entity 개념
	        		attribute.push(att_node);
	        	}
	        	
	        	console.warn("JSON result");
	        	
	        	//출력 그리드 생성
	        	var data = [];
	        	data = makeAttributesWithJSON(schemas, attribute);
	        	
	        	/*$("#attr_grid").handsontable({
	        		data:data,
	        		minSpareRows:1,
	        		colHeaders: true,
	        		contextMenu: true
	        	});
	        	
	        	console.warn("JSON done");*/
	        	
	        	//다이얼로그 만드는 루틴
	    		var div = $("<div></div>");
	    		var style = $('<div></div>')
	    		.css({
	    			'maxWidth' : parseInt($(window).width() * 0.8) + 'px',
	    			'maxHeight' : parseInt($(window).height() * 0.8) + 'px',
	    			'overflow' : 'auto',
	    			/*'top' : '100px',*/
	    			'my' : "center, top",
	    			'at' : "center, top",
	    			'of' : $(window)
	    		}).appendTo(div);
	    		
	    		var dialog = div.dialog({
	    			open:function(){
	    			/*var container1 = document.createElement('div');
	    				container1.setAttribute("id", "table"+_id);*/
	    			},
	    			modal : false,
	    			width : '200px', //맨 처음엔 500px
	    			title : tname
	    		});
	    		
	    		//다이얼로그에 내용을 추가
	    		var grid = $("<div class='attr_grid'></div>");
	    		grid.handsontable({
	        		data:data,
	        		minSpareRows:1,
	        		colHeaders: true,
	        		contextMenu: true
	        	}).css({
	        		'height' : '100px',
	        	});
	    		grid.appendTo(dialog);
	    		grid.handsontable('render');
	    		dialog.dialog("open");
	    		
	        	console.warn("JSON done");

	         } else {
	             // Handle error case
	        	 notify("error", "연결되지 않았습니다.");
	         }
	     }
	 };
	 req.send();
	}	
}

var grid;

//TODO 선택된 feature의 속성데이터 가져오는 부분 
function getSelectedAttrPostGIS(_fid, _layer_name){
	var req = new XMLHttpRequest();
	
	/*var test_param = getParameter();
	var split_param = test_param.split(",");*/
	
	var host = "";
	var port = "";
	var db_name = "";
	var dbtable_name = "";
	var id = getCookie("id");
	var password = getCookie("password");
	
	var tname = "";
	
	//URL 파라미터 파싱하는 부분
	/*for(var i=0 ; i<split_param.length ; i++){
		switch(split_param[i]){
		case "host" : host = split_param[i+1]; break;
		case "port" : port = split_param[i+1]; break;
		case "db_name" : db_name = split_param[i+1]; break;
		case "dbtable_name" : dbtable_name = split_param[i+1]; break;
		}
	}*/
	
	/*var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/OpenSource20141219/builder/db/" + "getAttributesPostGIS.jsp?"; //실행 JAVA URL
	 */	//파라미터 세팅
	
	if(_layer_name == "VECTOR_POLYGON"){
		host = tst_tableObject.host;
		port = tst_tableObject.port;
		db_name = tst_tableObject.db_name;
		dbtable_name = tst_tableObject.dbtable_name;
		tname = "POLYGON Table";
	}
	
	if(_layer_name == "VECTOR_LINE"){
		host = tst_table_lineObject.host;
		port = tst_table_lineObject.port;
		db_name = tst_table_lineObject.db_name;
		dbtable_name = tst_table_lineObject.dbtable_name;
		tname = "LINE Table";
	}
	
	if(_layer_name == "VECTOR_POINT"){
		host = tst_table_pointObject.host;
		port = tst_table_pointObject.port;
		db_name = tst_table_pointObject.db_name;
		dbtable_name = tst_table_pointObject.dbtable_name;
		tname = "POINT Table";
	}
	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/getAttributesPostGIS.jsp?";
	url += "host=" + host + "&";
	url += "port=" + port + "&";
	url += "account=" + db_name + "&";
	url += "tname=" + dbtable_name + "&";
	url += "id=" + id + "&";
	url += "pass=" + password + "&";
	url += "fid=" + _fid + "&";
	//url += "geom=the_geom";
	url += "geom=geom";
	
	console.warn("requestCORS() : Connection Database -  attr_postGIS.jsp");
	console.log(url);

	//Feature detection for CORS
	if ('withCredentials' in req) {
	 req.open('post', url, true);
	 // Just like regular ol' XHR
	 req.onreadystatechange = function() {
	     if (req.readyState === 4) {
	         if (req.status >= 200 && req.status < 400) {
	        	notify("success", "공간데이터 선택");
	        	console.warn("parsing JSON");
	        	//JSON 파싱하는 루틴
	        	var jsonStr = req.responseText;	        	
	            var jsonObj = eval('('+jsonStr+')');
	            console.log(jsonObj);	            
	            
	            
	            if(jsonObj.length < 1){
	            	notify("error", "테이블 연결 실패");
	            	return;
	            }
	            
	        	//JSON 오브젝트를 JavaScript 오브젝트로 변환
	        	var schemas = [];
	        	//var attributes = [];
	        	var attribute = [];
	        	var isfirst = true;
	        	
	        	for(var i in jsonObj){
	        		var schema = [];
	        		var att_node = [];
	        			for(var name in jsonObj[i]){
	        				//스키마는 하나만 검출
	        				if(isfirst){
		        			schema.push(name);
	        				}
	        				//개별 노드
	        				att_node.push(jsonObj[i][name]);
		        		}
	        			isfirst = false;
	        			
	        		if(schema.length > 1){
	        			schemas.push(schema);
	        		}
	        		//Entity 개념
	        		attribute.push(att_node);
	        	}
	        	
	        	//console.log(schemas);
	        	//console.log(attribute);
	        	
	        	console.warn("JSON result");
	        	
	        	var data = [];
	        	
	        	data = makeAttributesWithJSON(schemas, attribute);
	        	
	        	console.log("dialog opend");
				/*var grid = $("<div class='attr_grid'></div>");
	    		grid.handsontable({
	        		data:data,
	        		minSpareRows:1,
	        		colHeaders: true,
	        		contextMenu: true
	        	}).css({
	        		'height' : '100px',
	        	});
	    		console.log(data);*/
	        	
	        	//다이얼로그 만드는 루틴
	    		var div = $("<div></div>");
	    		var style = $('<div></div>')
	    		.css({
	    			'maxWidth' : parseInt($(window).width() * 0.8) + 'px',
	    			'maxHeight' : parseInt($(window).height() * 0.8) + 'px',
	    			'overflow' : 'auto',
	    			/*'top' : '100px',*/
	    			'my' : "center, top",
	    			'at' : "center, top",
	    			'of' : $(window)
	    		}).appendTo(div);
	    		
	    		var dialog = div.dialog({
	    			open:function(){
	    			/*var container1 = document.createElement('div');
	    				container1.setAttribute("id", "table"+_id);*/
	    			},
	    			modal : false,
	    			width : '500px', //원래는 500px
	    			title : tname
	    		});
	    		
	    		//다이얼로그에 내용을 추가
	    		//var grid = $("<div class='attr_grid'></div>");
	    		grid = $("<div class='attr_grid'></div>");
	    		grid.handsontable({
	        		data:data,
	        		minSpareRows:1,
	        		colHeaders: true,
	        		contextMenu: true,
	        		afterChange: function(change, source){
	        			Tester(change, source);
	        		}
	        	}).css({
	        		'height' : '100px',
	        	});
	    		grid.appendTo(dialog);
	    		grid.handsontable('render');
	    		dialog.dialog("open");
	    		
	        	console.warn("JSON done");

	         } else {
	             // Handle error case
	        	 notify("error", "연결되지 않았습니다.");
	         }
	     }
	 };
	 req.send();
	}
}


//TODO 공간데이터를 DB에서 가져오는 함수
function getSpatialPostGIS(url, method, params){
	var req = new XMLHttpRequest();
	/*var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/OpenSource20141219/builder/db/" + "getSpatialPostGIS.jsp?"; //실행 JAVA URL
	 */	//파라미터 세팅
	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/getSpatialPostGIS.jsp?";
	url += "host=" + params.host + "&";
	url += "port=" + params.port + "&";
	url += "account=" + params.account + "&";
	url += "id=" + params.id + "&";
	url += "pass=" + params.pass + "&";
	url += "tname=" + params.tname + "&";
	url += "geom=" + params.geom;
	
	console.warn("requestCORS() : Connection Database -  getSpatialPostGIS.jsp");
	console.log(url);
	
	//Feature detection for CORS
	if ('withCredentials' in req) {
	 req.open('post', url, true);
	 // Just like regular ol' XHR
	 req.onreadystatechange = function() {
		 //var temp = [];
	     if (req.readyState === 4) {
	         if (req.status >= 200 && req.status < 400) {
	        	notify("success", "서버 연결성공.");
	        	//JSON 파싱하는 루틴
	        	var jsonStr = req.responseText;
	            var jsonObj = eval('('+jsonStr+')');
	            
	            if(jsonStr == ""){
	            	notify("error", "데이터베이스 연결실패!");
	            	return;
	            }
	            
	            notify("success", "데이터베이스 연결 성공!");
	            
	            switch(params.tname){
	            case "tst_table" : tst_tableObject.check = true;
	            	break;
	            case "tst_table_point" : tst_table_pointObject.check = true;
	            	break;
	            case "tst_table_line" : tst_table_lineObject.check = true;
	            	break;
	            case "kz_astana_districts" : tst_tableObject.check = true;
            		break;
	            case "kz_astana_streets" : tst_tableObject.check = true;
            		break;
	            case "kz_astana_water" : tst_tableObject.check = true;
            		break;
	            case "kz_astana_microdistricts" : tst_tableObject.check = true;
            		break;
	            case "kz_astana_quartals" : tst_tableObject.check = true;
            		break;
	            case "kz_astana_grass" : tst_tableObject.check = true;
            		break;
	            case "kz_astana_buildings" : tst_tableObject.check = true;
            		break;
            	
	            }
	            
	            if(jsonObj.length < 1){
	            	notify("error", "테이블 연결에 실패하였거나 데이터가 없습니다.");
	            	return;
	            }
	            
	            
	        	//JSON 오브젝트를 JavaScript 오브젝트로 변환
	            var features = [];
	            var geo_datas = [];
	            var isfirst = true;
	            
	            for(var i in jsonObj){
	            	var feature = [];
	            	var geo_data = [];
	            	
	            	for(var name in jsonObj[i]){
        				//스키마 검출
        				if(isfirst){
	        			feature.push(name);
        				}
        				//데이터 검출
        				geo_data.push(jsonObj[i][name]);
        				
	        		}
        			isfirst = false;
        			
        			if(feature.length >= 1){
        				features.push(feature);
        			}
        			geo_datas.push(geo_data);
        			
	            } //for(var i in jsonObj) 종료
	            
	            var layers = [];
	            for(var i in geo_datas) {
	            	var entity = [];
	            	var geoX = [];
		            var geoY = [];
		            var fid = geo_datas[i][1];  //카자흐스탄 자료 쓸 땐 이렇게
	            	var temp_geo_data = geo_datas[i][0];
	            	
	            	//var fid = geo_datas[i][0];   //원래 테스트하던 코드
	            	//var temp_geo_data = geo_datas[i][1];
	            	
	            	console.log(geo_datas);
	            	
	            	
	            	//다시 시작
	            	
	            	var start = temp_geo_data.lastIndexOf("(");
	            	var end = temp_geo_data.indexOf(")");
	            	temp_geo_data = temp_geo_data.slice(start+1, end);
	          
	            		//성공임
	            		//console.log(temp_geo_data);
	            		
	            		var points = temp_geo_data.split(',');
	            		//x y 형태로 구성
	            		for(var j in points){
	            			var point = points[j].split(' ');
	            			var node = {};
	            			node.x = point[0];
	            			node.y = point[1];
	            			entity.push(node);
	            		}
	            
	            		layers.push(entity);
	            		
	            		for(var i=0 ; i<entity.length ; i++){
	            			geoX.push(entity[i].x);
	            			geoY.push(entity[i].y);
	            		}
	            		
	            	switch(params.tname){
	            	case "tst_table" : drawPolygonByVector(fid, geoX, geoY); break;
	            	case "tst_table_point" : drawPointByVector(fid, geoX, geoY); break;
	            	case "tst_table_line" : drawLineByVector(fid, geoX, geoY); break;
	            	case "kz_astana_districts" : drawPolygonByVectorKz(fid, geoX, geoY); break;
		            case "kz_astana_streets" : drawLineByVectorKz(fid, geoX, geoY); break;
		            case "kz_astana_water" : drawPolygonByVectorKz(fid, geoX, geoY); break;
		            case "kz_astana_microdistricts" : drawPolygonByVectorKz(fid, geoX, geoY); break;
		            case "kz_astana_quartals" : drawPolygonByVectorKz(fid, geoX, geoY); break;
		            case "kz_astana_grass" : drawPolygonByVectorKz(fid, geoX, geoY); break;
		            case "kz_astana_buildings" : drawPolygonByVectorKz(fid, geoX, geoY); break;
	            	}
	            }
	            //console.log(layers);

	         } else {
	        	 notify("error", "연결되지 않았습니다.");
	         }
	     }
	 };
	 req.send();
	}	
}

//TODO DB의 데이터를 수정하는 함수 
function updateDatasInPostGIS(url, method, params){
	var req = new XMLHttpRequest();
	
	/*var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/OpenSource20141219/builder/db/" + "updateDatasInPostGIS.jsp?"; //실행 JAVA URL
	//파라미터 세팅
	 */	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/updateDatasInPostGIS.jsp?";
	url += "host=" + params.host + "&";
	url += "port=" + params.port + "&";
	url += "account=" + params.account + "&";
	url += "id=" + params.id + "&";
	url += "pass=" + params.pass + "&";
	
	//레이어를 받아오기 위한 변수 설정
	var point_layer;
	var line_layer;
	var polygon_layer;
	
	point_layer = map.getLayersByName("VECTOR_POINT");
	line_layer = map.getLayersByName("VECTOR_LINE");
	polygon_layer = map.getLayersByName("VECTOR_POLYGON");
	
	//각 레이어의 Features의 갯수를 가져옴
	
	var point_count = point_layer[0].features.length;
	var line_count = line_layer[0].features.length;
	var polygon_count = polygon_layer[0].features.length;
	
	//각 레이어들의 Features의 갯수만큼 배열을 생성
	
	var get_geometry_point = new Array(point_count);
	var get_geometry_line = new Array(line_count);
	var get_geometry_polygon = new Array(polygon_count);
	
	//DB에 저장하기 위한 좌표들을 저장하는 변수 생성
	var set_geometry_point = new Array(point_count);
	var set_geometry_line = new Array(line_count);
	var set_geometry_polygon = new Array(polygon_count);
	
	//각 레이어들의 Features의 geometry를 받아옴, OpenLayers.Geometry.Point 형식으로 가져온다.
	
	var save_point_data = new Array();
	
	for(var i=0 ; i<point_count ; i++){
		var pointer = point_layer[0].features[i].geometry.getVertices();
		var pointer_count = pointer.length;
		var point_info_name = "Point";
		var point_info_fid = point_layer[0].features[i].fid;
		
		get_geometry_point[i] = new Array(pointer_count);
		set_geometry_point[i] = new Array(pointer_count * 2 + 1); //x, y를 따로따로 받기위해 2배로 늘림
																  //+1은 Feature의 끝임을 알기 위해 해둔 여분의 공간
		for(var j=0 ; j<pointer_count ; j++){
			//point_info_name = "Point";
			//point_info_fid = point_layer[0].features[i].fid;
			var point_info_x = pointer[j].x.toString();
			var point_info_y = pointer[j].y.toString();
			save_point_data[j] = getPointObject(point_info_name, point_info_fid, point_info_x, point_info_y);
		}
		var send_info = JSON.stringify(save_point_data);
		console.log(send_info);
		req.open("POST", url, true);
		req.send(send_info);
		req.onreadystatechange = function() {
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	notify("success", "저장되었습니다.");
		         }
		         else{
		        	 notify("error", "ERROR");
		         }
		     }
		};
	}
	
	var save_line_data = new Array();
	
	for(var i=0 ; i<line_count ; i++){
		var pointer = line_layer[0].features[i].geometry.getVertices();
		var pointer_count = pointer.length;
		var line_info_name = "Line";
		var line_info_fid = line_layer[0].features[i].fid;
		
		get_geometry_line[i] = new Array(pointer_count);
		set_geometry_line[i] = new Array(pointer_count * 2 + 1);
		
		for(var j=0 ; j<pointer_count ; j++){
			//line_info_name = "Line";
			//line_info_fid = line_layer[0].features[i].fid;
			var line_info_x = pointer[j].x.toString();
			var line_info_y = pointer[j].y.toString();
			save_line_data[j] = getLineObject(line_info_name, line_info_fid, line_info_x, line_info_y);
		}
		var send_info = JSON.stringify(save_line_data);
		console.log(send_info);
		req.open("POST", url, true);
		req.send(send_info);
		req.onreadystatechange = function() {
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	notify("success", "저장되었습니다.");
		         }
		         else{
		        	 notify("error", "ERROR");
		         }
		     }
	};
}
	
	var save_polygon_data = new Array();
	
	for(var i=0 ; i<polygon_count ; i++){
		var pointer = polygon_layer[0].features[i].geometry.getVertices();
		var pointer_count = pointer.length;
		var polygon_info_name = "Polygon";
		var polygon_info_fid = polygon_layer[0].features[i].fid;
		
		get_geometry_polygon[i] = new Array(pointer_count);
		set_geometry_polygon[i] = new Array(pointer_count * 2 + 1);
		
		for(var j=0 ; j<pointer_count ; j++){
			//polygon_info_name = "Polygon";
			//polygon_info_fid = polygon_layer[0].features[i].fid;
			var polygon_info_x = pointer[j].x.toString();
			var polygon_info_y = pointer[j].y.toString();
			save_polygon_data[j] = getPolygonObject(polygon_info_name, polygon_info_fid, polygon_info_x, polygon_info_y);
		}
		var send_info = JSON.stringify(save_polygon_data);
		console.log(send_info);
		req.open("POST", url, true);
		req.send(send_info);
		req.onreadystatechange = function() {
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	notify("success", "저장되었습니다.");
		         }
		         else{
		        	 notify("error", "ERROR!");
		         }
		     }
		};
	}
}

//TODO DB에 데이터를 저장하는 함수
function setDatasInPostGIS(url, method, params){
	//alert("setDatasInPostGIS에 왔당!!");
	updateDatasInPostGIS("", "", params);
	
	var req = new XMLHttpRequest();
	
	/*var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/OpenSource20141219/builder/db/" + "setDatasInPostGIS.jsp?"; //실행 JAVA URL
	 */	//파라미터 세팅
	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/setDatasInPostGIS.jsp?";
	url += "host=" + params.host + "&";
	url += "port=" + params.port + "&";
	url += "account=" + params.account + "&";
	url += "id=" + params.id + "&";
	url += "pass=" + params.pass + "&";
	
	//레이어를 받아오기 위한 변수 설정
	var point_layer;
	var line_layer;
	var polygon_layer;
	
	point_layer = map.getLayersByName("USER_POINT");
	line_layer = map.getLayersByName("USER_LINE");
	polygon_layer = map.getLayersByName("USER_POLYGON");
	
	//각 레이어의 Features의 갯수를 가져옴 	
	var point_count = point_layer[0].features.length;
	var line_count = line_layer[0].features.length;
	var polygon_count = polygon_layer[0].features.length;
	
	//각 레이어들의 Features의 갯수만큼 배열을 생성
	
	var get_geometry_point = new Array(point_count);
	var get_geometry_line = new Array(line_count);
	var get_geometry_polygon = new Array(polygon_count);
	
	//DB에 저장하기 위한 좌표들을 저장하는 변수 생성
	var set_geometry_point = new Array(point_count);
	var set_geometry_line = new Array(line_count);
	var set_geometry_polygon = new Array(polygon_count);
	
	//각 레이어들의 Features의 geometry를 받아옴, OpenLayers.Geometry.Point 형식으로 가져온다.
	
	var save_point_data = new Array();
	
	for(var i=0 ; i<point_count ; i++){
		var pointer = point_layer[0].features[i].geometry.getVertices();
		var pointer_count = pointer.length;
		var point_info_name = "Point";
		var point_info_fid = point_layer[0].features[i].fid;
		
		get_geometry_point[i] = new Array(pointer_count);
		set_geometry_point[i] = new Array(pointer_count * 2 + 1); //x, y를 따로따로 받기위해 2배로 늘림
																  //+1은 Feature의 끝임을 알기 위해 해둔 여분의 공간
		for(var j=0 ; j<pointer_count ; j++){
			point_info_name = "Point";
			//point_info_fid = point_layer[0].features[i].fid;
			var point_info_x = pointer[j].x.toString();
			var point_info_y = pointer[j].y.toString();
			save_point_data[j] = getPointObject(point_info_name, point_info_x, point_info_y);
		}
		var send_info = JSON.stringify(save_point_data);
		console.log(send_info);
		req.open("POST", url, true);
		req.send(send_info);
		req.onreadystatechange = function() {
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	notify("success", "저장되었습니다.");
		         }
		         else{
		        	 notify("error", "ERROR");
		         }
		     }
		};
	}
	
	var save_line_data = new Array();
	
	for(var i=0 ; i<line_count ; i++){
		var pointer = line_layer[0].features[i].geometry.getVertices();
		var pointer_count = pointer.length;
		var line_info_name = "Line";
		//var line_info_fid = line_layer[0].features[i].fid;
		
		get_geometry_line[i] = new Array(pointer_count);
		set_geometry_line[i] = new Array(pointer_count * 2 + 1);
		
		for(var j=0 ; j<pointer_count ; j++){
			//line_info_name = "Line";
			//line_info_fid = line_layer[0].features[i].fid;
			var line_info_x = pointer[j].x.toString();
			var line_info_y = pointer[j].y.toString();
			save_line_data[j] = getLineObject(line_info_name, line_info_x, line_info_y);
		}
		var send_info = JSON.stringify(save_line_data);
		console.log(send_info);
		req.open("POST", url, true);
		req.send(send_info);
		req.onreadystatechange = function() {
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	notify("success", "저장되었습니다.");
		         }
		         else{
		        	 notify("error", "ERROR");
		         }
		     }
		};
	}
	
	var save_polygon_data = new Array();
	
	for(var i=0 ; i<polygon_count ; i++){
		var pointer = polygon_layer[0].features[i].geometry.getVertices();
		var pointer_count = pointer.length;
		var polygon_info_name = "Polygon";
		var polygon_info_fid = polygon_layer[0].features[i].fid;
		
		get_geometry_polygon[i] = new Array(pointer_count);
		set_geometry_polygon[i] = new Array(pointer_count * 2 + 1);
		
		for(var j=0 ; j<pointer_count ; j++){
			polygon_info_name = "Polygon";
			//polygon_info_fid = polygon_layer[0].features[i].fid;
			var polygon_info_x = pointer[j].x.toString();
			var polygon_info_y = pointer[j].y.toString();
			save_polygon_data[j] = getPolygonObject(polygon_info_name, polygon_info_x, polygon_info_y);
		}
		var send_info = JSON.stringify(save_polygon_data);
		console.log(send_info);
		req.open("POST", url, true);
		req.send(send_info);
		req.onreadystatechange = function() {
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	notify("success", "저장되었습니다.");
		         }
		         else{
		        	 notify("error", "ERROR!");
		         }
		     }
		};
	}
}

function getFidFeatures(url, method, _feature, feature_type){
	var req = new XMLHttpRequest();
	
	var test_param = getParameter();
	var split_param = test_param.split(",");
	
	var host = "";
	var port = "";
	var db_name = "";
	var id = getCookie("id");
	var password = getCookie("password");
	
	//URL 파라미터 파싱하는 부분
	for(var i=0 ; i<split_param.length ; i++){
		switch(split_param[i]){
		case "host" : host = split_param[i+1]; break;
		case "port" : port = split_param[i+1]; break;
		case "db_name" : db_name = split_param[i+1]; break;
		case "dbtable_name" : dbtable_name = split_param[i+1]; break;
		}
	}
	
	if(db_name == "" || dbtable_name == ""){
		return;
	}
	
	/*var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/OpenSource20141219/builder/db/" + "getFidFeatures.jsp?"; //실행 JAVA URL
	 */	//파라미터 세팅
	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/getFidFeatures.jsp?";
	url += "host=" + host + "&";
	url += "port=" + port + "&";
	url += "account=" + db_name + "&";
	url += "id=" + id + "&";
	url += "pass=" + password + "&";
	url += "feature_type=" + feature_type;
	
	req.open("POST", url, true);
	req.send();
	req.onreadystatechange = function() {
	     if (req.readyState === 4) {
	         if (req.status >= 200 && req.status < 400) {
	        	 var jsonStr = req.responseText;	        	
		         var jsonObj = eval('('+jsonStr+')');
		         switch(feature_type){
	            	case "Point" : setPointFeatureFid(_feature, jsonObj); break;
	            	case "Line" : setLineFeatureFid(_feature, jsonObj); break;
	            	case "Polygon" : setPolygonFeatureFid(_feature, jsonObj); break;
	            	}
	         }
	         else{
	        	 notify("error", "ERROR");
	         }
	     }
	};
}

//TODO Point 객체 정의 
function pointObject(name, geo_x, geo_y){
	this.name = name;
	this.geo_x = geo_x;
	this.geo_y = geo_y;
}

function getPointObject(name, geo_x, geo_y){
	return new pointObject(name, geo_x, geo_y);
}

//TODO Line 객체 정의
function lineObject(name, geo_x, geo_y){
	this.name = name;
	this.geo_x = geo_x;
	this.geo_y = geo_y;
}

function getLineObject(name, geo_x, geo_y){
	return new lineObject(name, geo_x, geo_y);
}

//TODO Polygon 객체 정의
function polygonObject(name, geo_x, geo_y){
	this.name = name;
	this.geo_x = geo_x;
	this.geo_y = geo_y;
}

function getPolygonObject(name, geo_x, geo_y){
	return new polygonObject(name, geo_x, geo_y);
}

//TODO MapBounds 객체 정의
//개발자 : 김종회
// 날자 : 2015-01-16

function mapBoundsObject(left, bottom, right, top){
	this.left = left;
	this.bottom = bottom;
	this.right = right;
	this.top = top;
}

function getMapBoundsObject(left, bottom, right, top){
	return new mapBoundsObject(left, bottom, right, top);
}

//속성표에 데이터를 입력하는 부분
function makeAttributesWithJSON(_schema, _attributes){
	//schema = [sch1, sch2,...] 구조를 가진다.
	//attribute = [[attr1, attr2,...], [attrA, attrB,...]] 구조를 가진다.
	
	var datas = [];
	for(var i in _schema){
		datas.push(_schema[i]);
	}
	
	/*for(var j in _attributes){
		datas.push(_attributes[j]);
	}*/
	
	for(attr_count in _attributes){
		datas.push(_attributes[attr_count]);
	}
	
	return datas;
}


//TODO Boundary내 객체 가져오기
//개발자 : 김종회
//날자 : 2015-01-20
function getDatasFromBounds(_map_bounds){
	var req = new XMLHttpRequest();
	
	var map_bounds = getMapBoundsObject(_map_bounds.left.toString(), _map_bounds.bottom.toString(), _map_bounds.right.toString(), _map_bounds.top.toString());
	var send_map_bounds = JSON.stringify(map_bounds);
	
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
	
	/*var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/OpenSource20141219/builder/db/" + "getSpatialFromBounds.jsp?"; //실행 JAVA URL
	 */	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/getSpatialFromBounds.jsp?";
	url += "host=" + host + "&";
	url += "port=" + port + "&";
	url += "account=" + db_name + "&";
	url += "tname=" + dbtable_name + "&";
	url += "id=" + id + "&";
	url += "pass=" + password + "&";
	url += "geom=the_geom";
	
	console.warn("requestCORS() : Connection Database -  getSpatialFromBounds.jsp");
	console.log(url);
	
	if ('withCredentials' in req) {
		 req.open('post', url, true);
		 // Just like regular ol' XHR
		 req.onreadystatechange = function() {
			 //var temp = [];
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	//notify("success", "데이터베이스 연결성공.");
		         }
		         var jsonStr = req.responseText;	        	
		            var jsonObj = eval('('+jsonStr+')');
		            console.log(jsonObj);
		            
		            if(jsonObj.length < 1){
		            	//notify("error", "테이블 연결 실패");
		            	var data = [];
			        	
			        	data = makeAttributesWithJSON("", "");
			        	
			        	$("#attr_grid").handsontable({
			        		data:data,
			        		minSpareRows:1,
			        		colHeaders: true,
			        		contextMenu: true
			        	});
		            	
		            	return;
		            }
		            
		        	//JSON 오브젝트를 JavaScript 오브젝트로 변환
		        	var schemas = [];
		        	//var attributes = [];
		        	var attribute = [];
		        	var isfirst = true;
		        	
		        	for(var i in jsonObj){
		        		var schema = [];
		        		var att_node = [];
		        			for(var name in jsonObj[i]){
		        				//스키마는 하나만 검출
		        				if(isfirst){
			        			schema.push(name);
		        				}
		        				//개별 노드
		        				att_node.push(jsonObj[i][name]);
			        		}
		        			isfirst = false;
		        			
		        		if(schema.length > 1){
		        			schemas.push(schema);
		        		}
		        		//Entity 개념
		        		attribute.push(att_node);
		        		attr_count++;
		        	}
		        	
		        	//console.log(schemas);
		        	//console.log(attribute);
		        	
		        	console.warn("JSON result");
		        	
		        	//출력 그리드 생성
		        	var data = [];
		        	
		        	data = makeAttributesWithJSON(schemas, attribute);
		        	
		        	$("#attr_grid").handsontable({
		        		data:data,
		        		minSpareRows:1,
		        		colHeaders: true,
		        		contextMenu: true
		        	});
		        	
		        	console.warn("JSON done");

		         } else {
		             // Handle error case
		        	 //notify("error", "연결되지 않았습니다.");
		         }
		     };
		 console.log(send_map_bounds);
		 req.send(send_map_bounds);
	}
	$("#mnu_attribute").dialog('open');
}

//TODO comment 날렸을 때 발생하는 부분(Test)
//개발자 : 김종회
function commentTest(fid){
	var req = new XMLHttpRequest();
	
	if(fid == ""){
		notify("error", "FID를 입력하지 않았습니다.");
		return;
	}
	
	var test_param = getParameter();
	var split_param = test_param.split(",");
	
	var host = "";
	var port = "";
	var db_name = "";
	var dbtable_name = "";
	var id = getCookie("id");
	var password = getCookie("password");
	
	//URL 파라미터 파싱하는 부분
	for(var i=0 ; i<split_param.length ; i++){
		switch(split_param[i]){
		case "host" : host = split_param[i+1]; break;
		case "port" : port = split_param[i+1]; break;
		case "db_name" : db_name = split_param[i+1]; break;
		case "dbtable_name" : dbtable_name = split_param[i+1]; break;
		}
	}
	
	if(db_name == "" || dbtable_name == ""){
		notify("error", "DB연결이 되지 않았습니다.");
		return;
	}
	
	var origin = location.origin;
	var pathname = location.pathname.split("/");
	var path = "/" + pathname[1];
	
	var url = origin + path; //localhost:8080/OpenSource20141219
	url += "/builder/db/getAttributesPostGIS.jsp?";
	url += "host=" + host + "&";
	url += "port=" + port + "&";
	url += "account=" + db_name + "&";
	url += "tname=" + dbtable_name + "&";
	url += "id=" + id + "&";
	url += "pass=" + password + "&";
	url += "fid=" + fid + "&";
	url += "geom=the_geom";
	
	console.log(url);
	
	if ('withCredentials' in req) {
		 req.open('post', url, true);
		 // Just like regular ol' XHR
		 req.onreadystatechange = function() {
		     if (req.readyState === 4) {
		         if (req.status >= 200 && req.status < 400) {
		        	//notify("success", "공간데이터 선택");
		        	console.warn("parsing JSON");
		        	//JSON 파싱하는 루틴
		        	var jsonStr = req.responseText;	        	
		            var jsonObj = eval('('+jsonStr+')');
		            console.log(jsonObj);	            
		            
		            if(jsonObj.length < 1){
		            	notify("error", "입력한 FID의 Feature가 존재하지 않습니다.");
		            	return;
		            }
		            
		            var geoX = [];
		            var geoY = [];
		            var temp_geo_data = jsonObj[0].the_geom;

		            var start = temp_geo_data.lastIndexOf("(");
		            var end = temp_geo_data.indexOf(")");
		            temp_geo_data = temp_geo_data.slice(start+1, end);

		            var points = temp_geo_data.split(',');

		            for(var j in points){
		            	var point = points[j].split(' ');
		            	/*var node = {};
		            	node.x = point[0];
		            	node.y = point[1];
		            	entity.push(node);*/
		            	
		            	geoX.push(point[0]);
		            	geoY.push(point[1]);
		            }
		            	            		
		            /*for(var i=0 ; i<entity.length ; i++){
		            	geoX.push(entity[i].x);
		            	geoY.push(entity[i].y);
		            }*/
		            
		            moveMap(geoX, geoY);

		         } else {
		             // Handle error case
		        	 notify("error", "연결되지 않았습니다.");
		         }
		     }
		 };
		 req.send();
		}
}