
//작성자 : 유승범
//내용 : CORS (Cross-Origin Resource Sharing) 관련 부분 (XML 리퀘스트 생성)
//속성 부분 불러오는데 사용함.

function requestCORS(url, method, params){
	var req = new XMLHttpRequest();
	var mainpage =  location.protocol + "//"+  location.host;
	url = mainpage + "/test/builder/db/" + "getDatabaseUsingJSON.jsp?"; //실행 JAVA URL
	//파라미터 세팅
	url += "host=" + params.host + "&";
	url += "port=" + params.port + "&";
	url += "account=" + params.account + "&";
	url += "id=" + params.id + "&";
	url += "pass=" + params.pass + "&";
	url += "tname=" + params.tname + "&";
	url += "geom=" + params.geom;
	
	console.warn("requestCORS() : Connection Database -  attr_postGIS.js");
	console.log(url);

	//Feature detection for CORS
	if ('withCredentials' in req) {
	 req.open('post', url, true);
	 // Just like regular ol' XHR
	 req.onreadystatechange = function() {
	     if (req.readyState === 4) {
	         if (req.status >= 200 && req.status < 400) {
	        	notify("success", "데이터베이스 연결성공.");
	        	console.warn("parsing JSON");
	        	//JSON 파싱하는 루틴
	        	var jsonStr = req.responseText;	        	
	            var jsonObj = eval('('+jsonStr+')');
	            //console.log(jsonObj);
	            
	        	//JSON 오브젝트를 JavaScript 오브젝트로 변환
	        	var schemas = [];
	        	var attributes = [];
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
	        	 notify("error", "연결되지 않았습니다.");
	         }
	     }
	 };
	 req.send();
	}	
}


function makeAttributesWithJSON(_schema, _attributes){
	//schema = [sch1, sch2,...] 구조를 가진다.
	//attribute = [[attr1, attr2,...], [attrA, attrB,...]] 구조를 가진다.
	
	var datas = [];
	for(var i in _schema){
		datas.push(_schema[i]);
	}
	
	for(var j in _attributes){
		datas.push(_attributes[j]);
	}
	
	return datas;
}
