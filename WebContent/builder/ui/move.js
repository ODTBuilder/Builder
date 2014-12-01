/*
 * 
 *  이동 관련
 * 
 * 
 * 
 *  선택 이름 :olControlSelectGroup
 *  이동 이름 :olControlMoveGroup 
 */

//수정 가능한 레이어 이름을 보관하는 전역변수
var layernames = [];
var deltax;
var deltay;

function selectGroups(){
	
	var tempLayer = getLayerByNameInMap_MOVE("TEMP_LAYER", true);
	
	console.log(tempLayer);
	if(tempLayer == null){
		//벡터가 선언되어 있지 않아 컨트롤을 등록할 필요가 없음
		notify("warning","생성되어 있는 이미지 레이어가 없습니다.");
		return;
	}

	removeControlByDisplayClass("olControlSelectGroup");
	var selectControl = new OpenLayers.Control.SelectFeature(getMapLayers(layernames),
			{
				displayClass:"olControlSelectGroup",
				box:true,
				multiple:true,
				onSelect: function(_feature){
					//임시 레이어 생성 (없으면 생성함)
					var tempLayer = getLayerByNameInMap_MOVE("TEMP_LAYER",false);
					var original_layer = getLayerByNameInMap_MOVE(_feature.layer.name, false);
					var BEFORE = {original:original_layer.name, feature:_feature};
					tempLayer.BEFORE.push(BEFORE);
					tempLayer.addFeatures(_feature);
				},
				onUnselect:function(_feature){
					notify("","unselected");
					this.deactivate();
					//removeControlByDisplayClass("olControlSelectGroup");
				}
			});
	map.addControl(selectControl);
	selectControl.activate();
}

function moveGroups(){
	removeControlByDisplayClass("olControlMoveGroup");		//자기 자신 소멸시킴
	var tempLayer = getLayerByNameInMap_MOVE("TEMP_LAYER", true);
	
	console.log(tempLayer);
	if(tempLayer == null){
		//벡터가 선언되어 있지 않아 컨트롤을 등록할 필요가 없음
		notify("warning","생성되어 있는 이동 가능 레이어가 없습니다.");
		return;
	}
	
	var moveControl = new OpenLayers.Control.DragFeature(getLayerByNameInMap_MOVE("TEMP_LAYER",false),
			{
				displayClass:"olControlMoveGroup",
				onStart:function(_feature, _pixel){
					//var tempLayer = getLayerByNameInMap_MOVE("TEMP_LAYER",false);
					var tempLayer = _feature.layer;
					//처음점 저장
					tempLayer.POSITION.x = _pixel.x;
					tempLayer.POSITION.y = _pixel.y;
					console.warn("debug");
					console.log(tempLayer.POSITION);
				},
				onDrag:function(_feature, _pixel){
					//선택된 객체는 항상 이동가능 레이어에 들어 있어야 한다.
					var tempLayer = _feature.layer;
					var res = map.getResolution();
					var position = tempLayer.POSITION;
					var _x = res*(_pixel.x - position.x);
					var _y = res*(position.y - _pixel.y);
					var features = tempLayer.features;
					for(var i in features){
						if(features[i] != _feature){
							features[i].geometry.move(_x, _y);
							tempLayer.drawFeature(features[i]);
						}
					}
					console.log(tempLayer);
					tempLayer.redraw();
					tempLayer.POSITION.x = _pixel.x;
					tempLayer.POSITION.y = _pixel.y;				
				},
				onComplete: function(_feature, pixel){
					//원래대로 돌려놓는다.
					
					
					
					
					
					//원래 레이어로 이동시킨다.
					var before = tempLayer.BEFORE;
					for(var i in before){
						var originalLayer = getLayerByNameInMap_MOVE(before[i].original, false);
						if(originalLayer.length > 1){
							console.warn("이름이 중복된 레이어가 존재합니다. 0번째 레이어로 강제 입력 합니다.");
						}
						else if(originalLayer.length == 0){
							notify("error","입력할 레이어가 존재하지 않습니다.");
							map.removeLayer(tempLayer);
							this.deactivate();
							removeControlByDisplayClass("olControlMoveGroup");
						}
						
						console.log(before[i]);
						var selectControls = getControlsByDisplayclass_MOVE("olControlSelectGroup");
						for(var i in selectControls){
							selectControls[i].onUnselect(before[i].feature);
						}
						
						originalLayer.drawFeature(before[i].feature);
					}
					
					
					//모든 Select 컨트롤을 삭제한다.
					var selectControls = getControlsByDisplayclass_MOVE("olControlSelectGroup");
					for(var i in selectControls){
						selectControls[i].onUnselect();
						selectControls[i].deactivate();
						map.removeControl(selectControls[i]);
					}
					
					notify("success","이동 완료");
					map.removeLayer(tempLayer);
					
					console.log(map);
					this.deactivate();
					
					
				}
				
			});
	map.addControl(moveControl);
	moveControl.activate();
}


function getMapLayers(_layernames){
	var result = [];
		for(var i in _layernames){
			var results = map.getLayersByName(_layernames[i]);
			for(var j in results){
				result.push(results[j]);
			}
		}
	return result;
}

function getMapLayer(_layername){
	var result = null;
	result = map.getLayersByName(_layername);
	return result;
}

 
function getLayerByNameInMap_MOVE(_name, _ismoveref){
	var resultLayers = map.getLayersByName(_name);
	
	var result = null;
	if(resultLayers.length > 0){
		result = resultLayers[0];
	}
	else{
		//결과가 없으면 생성함.
		result= new OpenLayers.Layer.Vector(_name);
		//원래 없는 변수인 ImageLayer를 생성하여 저장함
		if(_ismoveref == true){
			//저장될 포인트 정보
			result.BEFORE = [];
			result.POSITION = {x:0, y:0};
		}
	}
	map.addLayer(result);
	return result;
}


function getControlsByDisplayclass_MOVE(_displayclass){
	var mapcontrols = map.controls;
	var results = [];
	for(var i in mapcontrols){
		if(mapcontrols[i].displayClass == _displayclass){
			results.push(mapcontrols[i]);
		}
	}
	return results;
}