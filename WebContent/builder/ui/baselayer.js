function changeBaseLayer(_type){
	//타입은 스트링
	//google, openstreetmap, naver, daum, vworld
	//var extent = map.baseLayer.getExtent();
	var center = map.center;
	var zoom = map.zoom;
	console.log(zoom);
	if(isSameLayerType(map.baseLayer, _type)){
		notify("info","현재 선택된 맵이 Google Map 입니다.");
	}
	else{
		//전체를 돌면서 미리 생성된 레이어가 있는지 확인함.
		var baseLayer = null;
		for(var i in map.layers){
			//if(map.layers[i] instanceof OpenLayers.Layer.Google){
			if(isSameLayerType(map.baseLayer, _type)){
				//구글이 있는 경우
		
				baseLayer = map.layers[i];
			}
		}
		if(baseLayer == null){
			// 레이어가 없는 경우 생성함.
			baseLayer = setLayerType(_type);
			map.addLayer(baseLayer);
		}
		
		var originalBaseLayer = map.baseLayer;
		var bound = originalBaseLayer.getExtent();
		
		map.setLayerIndex(baseLayer, 0);
		map.baseLayer.setVisibility(false);
		map.baseLayer = baseLayer;
		baseLayer.isBaseLayer = true;
		baseLayer.setVisibility(true);
		map.zoomToExtent(bound);
		map.removeLayer(originalBaseLayer);
		console.log(map);
	}
}

function setLayerType(_type){
	var resultLayer = null;
	switch(_type){
	case "google":
		resultLayer = new OpenLayers.Layer.Google("Google Streets",{numZoomLevel : 19});
		break;
	case "openstreetmap":
		resultLayer = new OpenLayers.Layer.OSM();
		break;
	default:
		//내용이 없음.
		//resultLayer = new OpenLayers.Layer.Google("Google Streets",{numZoomLevel : 19});
		alert("not find");
		break;
	}
	
	return resultLayer;
}

function isSameLayerType(_layer, _type){
	var result = false;
	switch(_type){
	case "google":
		if(_layer instanceof OpenLayers.Layer.Google){
			result = true;
		}
		break;
	case "openstreetmap":
		if(_layer instanceof OpenLayers.Layer.OSM){
			result = true;
		}
		break;
		default:
			//디폴트는 구글로 세팅하고 있음
			if(_layer instanceof OpenLayers.Layer.Google){
				result = true;
			}
			break;
		return result;
	}
}