
 	  /* 
	   *TODO CreateControl & DrawFeature
	   *개발자 : 김종회
	   *2014.11.27
	   *
	   *1차 수정 : 유승범
	   *입력된 이름으로 레이어를 그림
	   */

	function drawPoint(_name){
		
		if(_name == ""){
			_name = "USER_POINT";
		}

		var ptLayer = map.getLayersByName(_name);
		if(ptLayer.length < 1){
			throw notify("error","레이어가 존재하지 않습니다.");
		}
		var feature_type = "Point";
		   
		var pointctrl = new OpenLayers.Control.DrawFeature(
				ptLayer[0],OpenLayers.Handler.Point,
				{
					title:"point Feature",
					displayClass:"olControlDrawFeaturePoint",
					featureAdded : function(_feature){
						ptLayer[0]._addfeatures.push(_feature);
					}
					/*featureAdded:function(_feature){
					getFidFeatures("", "", _feature, feature_type);
					}*/
				}
		);
		
		map.addControl(pointctrl);
		pointctrl.activate();
	}
	
	function drawLine(_name){
		
		if(_name == ""){
			_name = "USER_LINE";
		}
		
		var lnLayer = map.getLayersByName(_name);
		if(lnLayer.length < 1){
			throw notify("error","레이어가 존재하지 않습니다.");
		}
		var feature_type = "Line";
		
		var linectrl = new OpenLayers.Control.DrawFeature(
				lnLayer[0], OpenLayers.Handler.Path,
				{
					title:"line Feature",
					displayClass:"olControlDrawFeatureLine",
					featureAdded : function(_feature){
						ptLayer[0]._addfeatures.push(_feature);
					}
					/*featureAdded:function(_feature){
						getFidFeatures("", "", _feature, feature_type);
					}*/
				}
		);
		
		map.addControl(linectrl);
		linectrl.activate();
	}
	
	function drawPolygon(_name){
		
		if(_name == ""){
			_name = "USER_POLYGON";
		}
		
		var polyLayer = map.getLayersByName(_name);
		if(polyLayer.length < 1){
			throw notify("error","레이어가 존재하지 않습니다.");
		}
		var feature_type = "Polygon";
		
		var polygonctrl = new OpenLayers.Control.DrawFeature(
				polyLayer[0], OpenLayers.Handler.Polygon,
				{
					title:"polygon Feature",
					displayClass:"olControlDrawFeaturePolygon",
					featureAdded : function(_feature){
						ptLayer[0]._addfeatures.push(_feature);
					},
					handlerOptions: {holeModifier: "altKey"},
					/*featureAdded:function(_feature){
						getFidFeatures("", "", _feature, feature_type);
					}*/
				}
		);
		
		map.addControl(polygonctrl);
		polygonctrl.activate();
	} 
	  /* 
	   *TODO ModifyControl
	   *개발자 : 최토열
	   *2014.11.27
	   */
	function modifychange() {
		var lnLayer = map.getLayersByName("USER_LINE");
		var polyLayer = map.getLayersByName("USER_POLYGON");
		var vectorLnLayer = map.getLayersByName("VECTOR_LINE");
		var vectorPolyLayer = map.getLayersByName("VECTOR_POLYGON");

		var modifyctrl = new OpenLayers.Control.ModifyFeature(
				null,
				{
					layers:[polyLayer[0],lnLayer[0],vectorLnLayer[0],vectorPolyLayer[0]],
					title : "modify Feature",
					displayClass : "olControlModifyFeature",
	
				}); 

		map.addControl(modifyctrl);
		modifyctrl.activate();
	}
	  /* 
	   *TODO RemoveControl
	   *개발자 : 김종회
	   *2014.11.27
	   */
	function removeControl(){
		   
		   var draw_controls = [];
		   var modify_controls = [];
		   var select_controls = [];
		   
		   draw_controls = map.getControlsByClass("OpenLayers.Control.DrawFeature");
		   modify_controls = map.getControlsByClass("OpenLayers.Control.ModifyFeature");
		   select_controls = map.getControlsByClass("OpenLayers.Control.SelectFeature");
		   
		   for(var i in draw_controls){
			   draw_controls[i].deactivate();
		   	   map.removeControl(draw_controls[i]);
		   }
		   
		   for(var i in modify_controls){
			   modify_controls[i].deactivate();
			   map.removeControl(modify_controls[i]);
		   }
		   
		   for(var i in select_controls){
			   select_controls[i].deactivate();
			   map.removeControl(select_controls[i]);
		   }
	}
	
	function drawPolygonByVector(_fid, _geoX, _geoY){
		var geoX = [];
		var geoY = [];
		var pointlist = [];
		var fid = _fid;
		geoX = _geoX;
		geoY = _geoY;
		
		if(geoX.length != geoY.length){
			notify("error", "DB의 정보를 잘못가져온 것 같습니다.");
			return;
		}
		
		for(var i in geoX){
			var point = new OpenLayers.Geometry.Point(geoX[i], geoY[i]);
			pointlist.push(point);
		}
		var linearRing = new OpenLayers.Geometry.LinearRing(pointlist);
		var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
		
		/*var vector_poly_layer = new OpenLayers.Layer.Vector("Vector Polygon Layer");
		map.addLayer(vector_poly_layer);
		vector_poly_layer.addFeatures([polygonFeature]);*/
		
		/*var vector_poly_layer = map.getLayersByName("USER_POLYGON");
		vector_poly_layer.push([polygonFeature]);
		var add_vector_polylayer = vector_poly_layer[0];
		map.addLayer(add_vector_polylayer);
		add_vector_polylayer.addFeatures([polygonFeature]);*/
		
		var vector_poly_layer = map.getLayersByName("VECTOR_POLYGON");
		vector_poly_layer.push([polygonFeature]);
		
		polygonFeature.fid = fid;
		
		var add_vector_polylayer = vector_poly_layer[0];
		map.addLayer(add_vector_polylayer);
		add_vector_polylayer.addFeatures([polygonFeature]);
		map.zoomToExtent(add_vector_polylayer.getDataExtent());
	}
	function drawPolygonByVectorKz(_fid, _geoX, _geoY){
		var geoX = [];
		var geoY = [];
		var pointlist = [];
		var fid = _fid;
		geoX = _geoX;
		geoY = _geoY;
		
		if(geoX.length != geoY.length){
			notify("error", "DB의 정보를 잘못가져온 것 같습니다.");
			return;
		}
		
		var sourceproj = new OpenLayers.Projection("EPSG:4326");
		var destproj = new OpenLayers.Projection("EPSG:900913");
		
		for(var i in geoX){
			var point = new OpenLayers.Geometry.Point(geoX[i], geoY[i]);
			pointlist.push(point);
		}
		var linearRing = new OpenLayers.Geometry.LinearRing(pointlist);
		var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]).transform(sourceproj, destproj));

		
		var vector_poly_layer = map.getLayersByName("VECTOR_POLYGON");
		vector_poly_layer.push([polygonFeature]);
		
		polygonFeature.fid = fid;
		
		var add_vector_polylayer = vector_poly_layer[0];
		map.addLayer(add_vector_polylayer);
		add_vector_polylayer.addFeatures([polygonFeature]);
		map.zoomToExtent(add_vector_polylayer.getDataExtent());
	}
	
	function drawPointByVector(_fid, _geoX, _geoY){
		var drawpoint = new OpenLayers.Geometry.Point(_geoX, _geoY);
		var pointFeature = new OpenLayers.Feature.Vector(drawpoint);
		var fid = _fid;
		
		/*var vectorLayer = new OpenLayers.Layer.Vector("Point Vector Layer");
		map.addLayer(vectorLayer);
		vectorLayer.addFeatures([pointFeature]);*/
		
		/*var vector_point_layer = map.getLayersByName("USER_POINT");
		vector_point_layer.push([pointFeature]);
		var add_vector_pointlayer = vector_point_layer[0];
		map.addLayer(add_vector_pointlayer);
		add_vector_pointlayer.addFeatures([pointFeature]);*/
		
		var vector_point_layer = map.getLayersByName("VECTOR_POINT");
		vector_point_layer.push([pointFeature]);
		
		pointFeature.fid = fid;
		
		var add_vector_pointlayer = vector_point_layer[0];
		map.addLayer(add_vector_pointlayer);
		add_vector_pointlayer.addFeatures([pointFeature]);
		map.zoomToExtent(add_vector_pointlayer.getDataExtent());
	}
	
	function drawLineByVector(_fid, _geoX, _geoY){
		var geoX = [];
		var geoY = [];
		var pointlist = [];
		var fid = _fid;
		geoX = _geoX;
		geoY = _geoY;
		
		if(geoX.length != geoY.length){
			notify("error", "DB의 정보를 잘못가져온 것 같습니다.");
			return;
		}
		
		for(var i in geoX){
			var point = new OpenLayers.Geometry.Point(geoX[i], geoY[i]);
			pointlist.push(point);
		}
		var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointlist));
		
		/*var vector_line_layer = new OpenLayers.Layer.Vector("Vector Line Layer");
		map.addLayer(vector_line_layer);
		vector_line_layer.addFeatures([lineFeature]);*/
		
		/*var vector_line_layer = map.getLayersByName("USER_LINE");
		vector_line_layer.push([lineFeature]);
		var add_vector_linelayer = vector_line_layer[0];
		map.addLayer(add_vector_linelayer);
		add_vector_linelayer.addFeatures([lineFeature]);*/
		
		var vector_line_layer = map.getLayersByName("VECTOR_LINE");
		vector_line_layer.push([lineFeature]);
		
		lineFeature.fid = fid;
		
		var add_vector_linelayer = vector_line_layer[0];
		map.addLayer(add_vector_linelayer);
		add_vector_linelayer.addFeatures([lineFeature]);
		map.zoomToExtent(add_vector_linelayer.getDataExtent());
	}
	
	function drawLineByVectorKz(_fid, _geoX, _geoY){
		var geoX = [];
		var geoY = [];
		var pointlist = [];
		var fid = _fid;
		geoX = _geoX;
		geoY = _geoY;
		
		if(geoX.length != geoY.length){
			notify("error", "DB의 정보를 잘못가져온 것 같습니다.");
			return;
		}
		
		var sourceproj = new OpenLayers.Projection("EPSG:4326");
		var destproj = new OpenLayers.Projection("EPSG:900913");
		
		for(var i in geoX){
			var point = new OpenLayers.Geometry.Point(geoX[i], geoY[i]).transform(sourceproj, destproj);
			pointlist.push(point);
		}
		var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointlist));
		
		vector_line_layer.addFeatures([lineFeature]);
		lineFeature.fid = fid;
		/*var add_vector_linelayer = vector_line_layer;
		add_vector_linelayer.push([lineFeature]);
		lineFeature.fid = fid;
		*/
		
		map.addLayer(vector_line_layer);
		//add_vector_linelayer.addFeatures([lineFeature]);
		map.zoomToExtent(vector_line_layer.getDataExtent());
	}
	
	//TODO Features FID 설정 & 가져오는 부분
	function setPointFeatureFid(_feature, datas){
		var get_fid = datas;
		var set_fid = get_fid[0].nextval;
		
		_feature.fid = set_fid;
	}
	
	function getPointFeatureFid(_feature, feature_type){
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
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		
		if(host == "" || port == "" || db_name == "" || dbtable_name == ""){
			return;
		}
		
		getFidFeatures("","", param, feature_type);
	}
	
	function setLineFeatureFid(_feature, datas){
		var get_fid = datas;
		var set_fid = get_fid[0].nextval;
		
		_feature.fid = set_fid;
	}
	
	function getLineFeatureFid(_feature, feature_type){
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
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		
		if(host == "" || port == "" || db_name == "" || dbtable_name == ""){
			return;
		}
		
		getFidFeatures("","", param, feature_type);
	}
	
	function setPolygonFeatureFid(_feature, datas){
		var get_fid = datas;
		var set_fid = get_fid[0].nextval;
		
		_feature.fid = set_fid;
	}
	
	function getPolygonFeatureFid(_feature, feature_type){
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
		
		var param = makeDatabaseParameter(host, port, db_name, id, password, dbtable_name, "the_geom");
		
		if(host == "" || port == "" || db_name == "" || dbtable_name == ""){
			return;
		}
		
		getFidFeatures("","", param, feature_type);
	}
	
	
	
	