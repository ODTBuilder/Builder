
 /* 
	   *Todo CreateControl & DrawFeature
	   *개발자 : 김종회
	   *2014.11.27
	   */

function drawPoint(){

		var ptLayer = map.getLayersByName("USER_POINT");
		   
		var pointctrl = new OpenLayers.Control.DrawFeature(
				ptLayer[0],OpenLayers.Handler.Point,
				{
					title:"point Feature",
					displayClass:"olControlDrawFeaturePoint",
					featureAdded:function(_feature){
						console.log(_feature);
					}
				}
		);
		
		map.addControl(pointctrl);
		pointctrl.activate();
	}
	
	function drawLine(){
		
		var lnLayer = map.getLayersByName("USER_LINE");
		
		var linectrl = new OpenLayers.Control.DrawFeature(
				lnLayer[0], OpenLayers.Handler.Path,
				{
					title:"line Feature",
					displayClass:"olControlDrawFeatureLine"
				}
		);
		
		map.addControl(linectrl);
		linectrl.activate();
	}
	
	function drawPolygon(){
		
		var polyLayer = map.getLayersByName("USER_POLYGON");
		
		var polygonctrl = new OpenLayers.Control.DrawFeature(
				polyLayer[0], OpenLayers.Handler.Polygon,
				{
					title:"polygon Feature",
					displayClass:"olControlDrawFeaturePolygon",
					handlerOptions: {holeModifier: "altKey"}
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

		var modifyctrl = new OpenLayers.Control.ModifyFeature(polyLayer[0],
				{
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
		   
		   var controls = [];
		   
		   controls = map.getControlsByClass("OpenLayers.Control.DrawFeature");
		   
		   for(var i in controls){
		   		map.removeControl(controls[i]);
		   }
		   
	}