
/*
 * 
 * 지오레퍼런싱 관련 기능 모음
 * 제작자 : 유승범
 * 제작일 : 2014-11-24,25 
 * 
 * */



//						"builder/download/Raster.png"
function makeRaster(path){
	//이미지 레이어 등록 및 그리기
	//1. make polygon (벡터 레이어)
	var imgVecLayer = getLayerByNameInMap("IMAGE_VECTOR_LAYER", true);
	
	//컨트롤 중복 등록을 막기 위하여 삭제함
	var controls = getControlsByDisplayclass("olControlDrawRaster");
	if(controls.length > 0){
		for(var i in controls){
			map.removeControl(controls[i]);
		}
		notify("warning", "이미 등록되어 있는 컨트롤을 삭제합니다.");
	}
	
	//새 컨트롤 등록, Image 레이어를 계속 생성함. (벡터 레이어에 해당 이미지 레이어 저장)
	var imgDrawControl = new OpenLayers.Control.DrawFeature(
			imgVecLayer, OpenLayers.Handler.RegularPolygon,  {
				handlerOptions: {
                    sides: 4,
                    irregular: true
                },
				displayClass:"olControlDrawRaster",
				featureAdded:function(feature){
				var bound = feature.geometry.bounds;
				var layerName = feature.id;
				var imgLayer = new OpenLayers.Layer.Image(layerName,
						path,
						bound,
						new OpenLayers.Size(0,0),
						{
							'isBaseLayer' : false,
							'alwaysInRange':true,
							opacity:0.7
						}
						);
				map.addLayer(imgLayer);
				//이미지 레이어 저장()
				//features 번호와 ImageLayer변수의 개수는 같아야 한다.
				imgVecLayer.ImageLayer.push(imgLayer);
				notify("success", "이미지 레이어 입력 완료");
				ol_AllControlsDown(true,true,true,true);
				}
		    }
		);
	map.addLayer(imgVecLayer);
	map.addControl(imgDrawControl);
	imgDrawControl.activate();
}



//이미지 레이어를 이동하게 하는 부분
//
function moveRaster(_isImageDragging){
	var imgVecLayer = getLayerByNameInMap("IMAGE_VECTOR_LAYER", false);
	if(imgVecLayer == null){
		//벡터가 선언되어 있지 않아 컨트롤을 등록할 필요가 없음
		notify("warning","생성되어 있는 이미지 레이어가 없습니다.");
		return;
	}
	
	
	removeControlByDisplayClass("olControlDragRaster");
	var dragControl;
	//드래그 컨트롤을 생성한다. (벡터를 움직여 이미지를 attach하는 방식
	dragControl = new OpenLayers.Control.DragFeature(getLayerByNameInMap("IMAGE_VECTOR_LAYER", false),
			{
				displayClass: "olControlDragRaster",
				onDrag:function(_feature, pixel){
					var imgLayer = getImageLayerByVectorName("IMAGE_VECTOR_LAYER", _feature);
					//실제 좌표를 이미지로 반영한다.
					imgLayer.extent = _feature.geometry.bounds;
					if(_isImageDragging == true){
						imgLayer.redraw();
					}
				},
				onComplete: function(_feature, pixel){
					var imgLayer = getImageLayerByVectorName("IMAGE_VECTOR_LAYER",_feature);
					imgLayer.redraw();
					this.deactivate();
					removeControlByDisplayClass("olControlDragRaster");
					notify("success","이동 완료");
				}
			}
			);
	
	map.addControl(dragControl);
	dragControl.activate();
}


//레스터 크기 수정 (수정과 이동이 가능하게 변경함)
function modifyRaster(){
	var imgVecLayer = getLayerByNameInMap("IMAGE_VECTOR_LAYER", false);
	if(imgVecLayer == null){
		//벡터가 선언되어 있지 않아 컨트롤을 등록할 필요가 없음
		notify("warning","생성되어 있는 이미지 레이어가 없습니다.");
		return;
	}
	
	//수정 컨트롤	
	removeControlByDisplayClass("olControlModifyRaster");
	var modifyControl;
	modifyControl = new OpenLayers.Control.ModifyFeature(getLayerByNameInMap("IMAGE_VECTOR_LAYER", false),
			{
				displayClass: "olControlModifyRaster",
				onModification:function(_feature){
					var imgLayer = getImageLayerByVectorName("IMAGE_VECTOR_LAYER", _feature);
					imgLayer.extent = _feature.geometry.bounds;
					imgLayer.redraw();
				},
				onModificationEnd:function(_feature){
					var imgLayer = getImageLayerByVectorName("IMAGE_VECTOR_LAYER", _feature);
					
					imgLayer.extent = _feature.geometry.bounds;
					imgLayer.redraw();
					this.deactivate();
					
					removeControlByDisplayClass("olControlModifyRaster");
					notify("success", "수정 완료");
				}
			});
	//모드 리셋
	modifyControl.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
	//리사이즈만 허용
	modifyControl.mode |= OpenLayers.Control.ModifyFeature.RESIZE;

	//컨트롤 등록
	map.addControl(modifyControl);
	modifyControl.activate();
}


//벡터 이름으로 이미지 레이어를 찾는 루틴
function getImageLayerByVectorName(_vectorname, _feature){
	var result = null;
	var imgVecLayer = getLayerByNameInMap(_vectorname, false);
	if(imgVecLayer == null){
		return null;
	}
	var index = getIndexFeatureInLayer(_feature, imgVecLayer);
	result = imgVecLayer.ImageLayer[index];
	return result;
}

function removeControlByDisplayClass(_displayclass){
	var controls = getControlsByDisplayclass(_displayclass);
	if(controls.length > 0){
		for(var i in controls){
			map.removeControl(controls[i]);
		}
		notify("success", "이미 등록되어 있는 컨트롤(들)을 삭제합니다.");
	}
}


//투명도 조절 기능
function setOpacityRaster(_value){
	var imgVecLayer = getLayerByNameInMap("IMAGE_VECTOR_LAYER", false);
	if(imgVecLayer == null){
		//벡터가 선언되어 있지 않아 컨트롤을 등록할 필요가 없음
		notify("error","생성되어 있는 이미지 레이어가 없습니다.");
		return false;
	}
	var images = imgVecLayer.ImageLayer;
	for(var i in images){
		images[i].opacity = _value/100;
		images[i].redraw();
	}
	imgVecLayer.setOpacity(_value/100);
	imgVecLayer.redraw();
	return true;
}

//레스터를 삭제하는 루틴
function deleteRaster(){
	notify("black","레스터 삭제");
	var imgVecLayer = getLayerByNameInMap("IMAGE_VECTOR_LAYER", false);
	if(imgVecLayer == null){
		//벡터가 선언되어 있지 않아 컨트롤을 등록할 필요가 없음
		notify("warning","생성되어 있는 이미지 레이어가 없습니다.");
		return;
	}
	
	//수정 컨트롤	
	removeControlByDisplayClass("olControlDeleteRaster");
	var deleteControl;
	
	deleteControl = new OpenLayers.Control.SelectFeature(getLayerByNameInMap("IMAGE_VECTOR_LAYER", false),
			{
				displayClass:"olControlDeleteRaster",
				toggle:true,
				mutiple:false,
				onUnselect: function(_feature){
					
					//이미지 삭제
					var imgLayers = map.getLayersByName(_feature.id);
					var imgVecLayer = _feature.layer;					
					if(imgLayers.length > 0){
						for(var i in imgLayers){
							for(var j in imgVecLayer.ImageLayer){
								if(imgVecLayer.ImageLayer[j].name == _feature.id){
									//이미지 레이어 삭제
									map.removeLayer(imgLayers[i]);
									//이미지 레이어 링크 삭제
									imgVecLayer.ImageLayer.splice(j,1);
								}
							}
						}
					}
					
					//벡터 삭제
					imgVecLayer.removeFeatures([_feature]);
					//map.removeLayer(imgLayer);
					imgVecLayer.redraw();
					this.deactivate();
					
					removeControlByDisplayClass("olControlDeleteRaster");
					notify("success", "삭제 완료");
					
				}
			}
			);
	map.addControl(deleteControl);
	deleteControl.activate();
}


function getIndexFeatureInLayer(_feature, _layer){
	var layerfeatures = _layer.features;
	for(var i in layerfeatures){
		var feature = layerfeatures[i];
		if(feature == _feature){
			return i;
		}
	}
}

function getIndexFeature(_feature){
	var layer = _feature.layer;
	var layerfeatures = layer.features;
	for(var i in layerfeatures){
		var feature = layerfeatures[i];
		if(feature == _feature){
			return i;
		}
	}
		return 0;
}




//이름으로 레이어를 찾는다 (없으면 생성함)
//Raster 레이어인 경우 ImageLayer항목을 새로 만든다.
//null 리턴이 안되고 있음.
function getLayerByNameInMap(_name, _isgeoref){
	var imgLayers = map.getLayersByName(_name);
	var result = null;
	if(imgLayers.length > 0){
		result = imgLayers[0];
	}
	else{
		//결과가 없으면 생성함.
		result= new OpenLayers.Layer.Vector(_name);
		//원래 없는 변수인 ImageLayer를 생성하여 저장함
		if(_isgeoref == true){
			result.ImageLayer = [];
		}
		
	}
	return result;
}


//디스플레이 클래스로 컨트롤을 찾는 루틴
function getControlByDisplayclass(_displayclass){
	var mapcontrols = map.controls;
	for(var i in mapcontrols){
		if(mapcontrols[i].displayClass == _displayclass){
			return(mapcontrols[i]);
		}
	}
	return null;
}

function getControlsByDisplayclass(_displayclass){
	var mapcontrols = map.controls;
	var results = [];
	for(var i in mapcontrols){
		if(mapcontrols[i].displayClass == _displayclass){
			results.push(mapcontrols[i]);
		}
	}
	return results;
}
