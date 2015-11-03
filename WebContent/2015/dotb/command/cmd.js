var redstart = "<span class='div-color-red'>";
var redend = "</span>";
var boldstart = "<b>";
var boldend = "</b>";
var newline = "</br>";

// 임시 저장소
var pTemp = null;

// aJax의 크로스 오리진 설정
$.ajaxSetup(
    {
	crossOrigin : true
    });

function loadBaseMap(_args) {
    // 아규먼트의 첫번째만 사용한다.
    var m_id = "content";
    var m_mapType = _args[0] || "";
    m_mapType = m_mapType.toLowerCase();
    var tilemap = null;
    var consolemsg = "";
    if (m_mapType == "osm") {
	tilemap = [ new ol.layer.Tile(
	    {
		name : "base_osm",
		_type : "BASE",
		source : new ol.source.OSM()
	    }) ];

	consolemsg = "Open Street Map";
    }
    else if (m_mapType == "bing") {
	tilemap = [ new ol.layer.Tile(
		    {
			name : "base_bing",
			_type : "BASE",
			source : new ol.source.BingMaps(
				    {
					// 임시 키, 오픈레이어스 사이트에서 퍼왔음.
					key : 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
					imagerySet : 'Aerial'
				    })
		    }) ];

	consolemsg = "Bing Map";
    }
    else {
	tilemap = [ new ol.layer.Tile(
	    {
		name : "base_mq",
		_type : "BASE",
		source : new ol.source.MapQuest(
		    {
			layer : 'osm'
		    })
	    }) ];

	consolemsg = "load Map Quest(Open Street Map)";
    }
    if (dotb.map == null) {

	var ol2d = new ol.Map(
	    {
		loadTilesWhileInteracting : true,
		controls : ol.control.defaults(
		    {
			attributionOptions : /** @type {olx.control.AttributionOptions} */
			(
			    {
				collapsible : false
			    })
		    }),
		layers : tilemap,
		target : m_id,
		view : new ol.View(
		    {
			center : ol.proj.transform([ 25, 20 ], 'EPSG:4326',
				'EPSG:900913'),
			zoom : 3
		    })
	    });

	// ol-cesium 프로젝트, 싱크로나이저 버그로 일단 사용 보류
	/*
	 * var ol3d = new olcs.OLCesium({map : ol2d}); var scene =
	 * ol3d.getCesiumScene(); dotb.map = ol3d; dotb.scene = scene;
	 */
	// ol3
	dotb.map = ol2d;
	dotb.scene = null;

    }
    else {
	/*
	 * var ol2d = dotb.map.getOlMap(); var group = ol2d.getLayerGroup(); var
	 * layers = group.getLayers(); layers.forEach(function(m_layer){
	 * if(m_mapType != m_layer.get("name")){ ol2d.removeLayer(m_layer);
	 * ol2d.addLayer(tilemap); } });
	 */
	var m_layers = dotb.map.getLayers().getArray();
	for ( var i in m_layers) {
	    if (m_layers[i].get("_type") == "BASE") {
		dotb.map.addLayer(tilemap[0]);
		dotb.map.removeLayer(m_layers[i]);
		return tilemap[0];
	    }
	}

	/*
	 * layers.getArray().forEach(function(m_layer) { if
	 * (m_layer.get("_type") == "BASE") { ol2d.addLayer(tilemap);
	 * ol2d.removeLayer(m_layer); return tilemap; } });
	 */
	/*
	 * layers.forEach(function(m_layer){ if(m_mapType !=
	 * m_layer.get("name")){ ol2d.removeLayer(m_layer);
	 * ol2d.addLayer(tilemap); } });
	 */
    }
    debMsg("Command : <b>map load</b></br> " + redstart + consolemsg + redend
	    + newline + "load on base map");
}
// 커맨드 펑션이 아님, 유저 함수임. (효율을 위하여)
function func_getOlLayerByName(_name) {
    /* var ol2d = dotb.map.getOlMap(); */
    var ol2d = dotb.map;
    var group = ol2d.getLayerGroup();
    var layers = group.getLayers();
    layers.forEach(function(m_layer) {
	if (_name != m_layer.get("name")) {
	    return m_layer;
	}
    });
    return null;
}

function getCommandList() {
    var cmdlist = dotb.cmd.list;
    var message = "Command List : [command] [subset]";
    for ( var i in cmdlist) {
	var cmdObj = cmdlist[i];
	message += "</br><b>[" + cmdObj.cmd + "]</b> <i>" + cmdObj.sub + "</i>";
    }
    debMsg(message);
}

function zoomin(_args) {

    var mapview = null;
    if (dotb.map != null) {
	// 지도가 필요함.

	/* mapview = dotb.map.getOlMap().getView(); */
	mapview = dotb.map.getView();
	var m_zoom = 1;
	if (_args.length == 0) {
	    var zoom = mapview.getZoom();
	    zoom = zoom + m_zoom;
	    mapview.setZoom(zoom);
	    debMsg("set ZOOM level is : <b>" + zoom + "</b>");
	}
	else {
	    // 숫자가 아니거나, 변수가 0이면 한 레벨만 증가한다.
	    mapview.setZoom(parseInt(_args[0]));
	    debMsg("set ZOOM level is : " + boldstart + _args[0] + boldend);
	}
    }
    else {
	debMsg("load map first.");
    }

}

function zoomout(_args) {
    var mapview = null;
    if (dotb.map != null) {
	// 지도가 필요함.
	/* mapview = dotb.map.getOlMap().getView(); */
	mapview = dotb.map.getView();
	var m_zoom = 1;
	if (_args.length == 0) {
	    var zoom = mapview.getZoom();
	    zoom = zoom - m_zoom;
	    mapview.setZoom(zoom);
	    debMsg("set ZOOM level is : " + boldstart + zoom + boldend);
	}
	else {
	    // 숫자가 아니거나, 변수가 0이면 한 레벨만 증가한다.
	    mapview.setZoom(parseInt(_args[0]));
	    debMsg("set ZOOM level is : " + boldstart + _args[0] + boldend);
	}
    }
    else {
	debMsg("load map first.");
    }
}

function convertBaseMap(_args) {
    // args : 3d, 2d (default : 2d)
    try {
	// 디폴트값은 2D
	var m_convertType = _args[0] || "2d";
	if (m_convertType == "2d") {
	    dotb.map.setEnabled(false);

	}
	else if (m_convertType == "3d") {
	    dotb.map.setEnabled(true);
	}
	else {
	    debMsg("Can not convert.");
	    throw "error in argument";
	}
	debMsg("Command : " + boldstart + "map convert " + boldend + newline
		+ "Convert " + redstart + m_convertType + redend + " Map");

    }
    catch (e) {
	debMsg("Can not convert." + e);
    }
}

function getWFSLayer2(_args) {
    var m_location = "http://" + _args[0];
    var m_namespace = _args[1];
    var m_layername = _args[2];
    var url = m_location
	    + "?service=WFS&version=1.1.0&request=GetFeature&outputformat=application/json&srsname=EPSG:3857&"
	    + "typename=" + m_namespace + ":" + m_layername;
    debMsg("Sending URL : " + newline + setBoldMessage(url));
    var vectorSource = new ol.source.Vector(
	{
	    format : new ol.format.GeoJSON(),
	    name : m_namespace + ":" + m_layername,
	    url : function(extent, resolution, projection) {
		return url + '&bbox=' + extent.join(',') + ',EPSG:3857';
	    },
	    strategy : ol.loadingstrategy.tile(ol.tilegrid.createXYZ(
		{
		    maxZoom : 19
		}))
	});
    var m_vector = new ol.layer.Vector(
	{
	    source : vectorSource,
	    style : new ol.style.Style(
		{
		    stroke : new ol.style.Stroke(
			{
			    color : 'rgba(0, 0, 255, 1.0)',
			    width : 2
			})
		})
	});
    dotb.map.addLayer(m_vector);
}

function CheckArgs(_args, _count) {
    if (_args.length < _count) {
	return false;
    }
    else {
	return true;
    }
}

function GetWFSFeautre(_args) {
    var origin = location.origin;
    var pathname = location.pathname.split("/");
    var path = "/" + pathname[1];
    var hostCapa = path + "/Capabilities2.jsp";
    var hostWFS = path + "/WFS.jsp";

    if (!CheckArgs(_args, 3)) {
	debMsg("Check argument : "
		+ setRedMessage("{wfs url}{wfs name space}{wfs layer name}"));
	return false;
    }

    // var url = "http://175.116.181.39:9990/geoserver/wfs";
    var url = _args[0];
    // var namespace = "kaz";
    var namespace = _args[1];
    // var layer = "kz_astana_water";
    var layer = _args[2];

    var m_location = hostCapa + "?url=" + url + "&name=" + namespace
	    + "&layer=" + layer;
    var m_location2 = hostWFS + "?url=" + url + "&name=" + namespace
	    + "&layer=" + layer;

    var vectorSource = new ol.source.Vector(
	{
	    format : new ol.format.GeoJSON(),
	    strategy : ol.loadingstrategy.tile(ol.tilegrid.createXYZ(
		{
		    maxZoom : 19
		}))
	});
    var m_vector = new ol.layer.Vector(
	{
	    source : vectorSource,
	    name : namespace + ":" + layer,
	    style : new ol.style.Style(
		{
		    stroke : new ol.style.Stroke(
			{
			    color : getRandomColor(),
			    width : 2
			})
		})
	});
    m_vector.setZIndex(10);
    dotb.map.addLayer(m_vector);

    $
	    .ajax(
		{
		    url : m_location,
		    type : "GET",
		    async : false,
		    success : function(_response) {

		    }
		})
	    .done(
		    function(data) {
			var jsonObj = eval(data);
			var bound = getBoundingBoxInGetCapabilities(jsonObj);
			log(bound);
			var bounds = [];
			var xpos = bound.min.x;
			var ypos = bound.min.y;
			// x를 0.5만큼 잘라 요청한다.
			var splitsize = 0.1;
			for (var i = 0; i < 20; i++) {
			    bounds[i] = [];
			    xpos = xpos + splitsize;
			    ypos = bound.min.y;
			    if (xpos >= bound.max.x) {
				break;
			    }
			    for (var j = 0; j < 20; j++) {
				if (ypos >= bound.max.y) {
				    break;
				}
				bounds[i][j] = ol.extent.createOrUpdate(xpos,
					ypos, xpos + splitsize, ypos
						+ splitsize);
				log(bounds[i][j]);
				/*
				 * bounds[i][j] = ol.proj.transformExtent(
				 * bounds[i][j], "EPSG:4326", "EPSG:3857");
				 */
				ypos += splitsize;
				var m_WFS = m_location2 + "&bbox="
					+ bounds[i][j].toString() + "&srs=3857";

				$
					.ajax(
					    {
						url : m_WFS,
						type : "GET",
						async : true,
						success : function(_response) {
						    var mp_geojsonFormat = new ol.format.GeoJSON();
						    var mp_features = mp_geojsonFormat
							    .readFeatures(_response);

						    m_vector
							    .getSource()
							    .addFeatures(
								    mp_features);
						},
						beforeSend : function() {
						    dotb.ui
							    .loaderStart("Loading...");
						}
					    });
			    }
			}

		    });

    /*
     * $.ajax( { url : m_location2, type : "GET", async : false, success :
     * function(_response) { var jsonObj = eval(_response); log(jsonObj); },
     * beforeSend : function() { // load your loading fiel here
     * dotb.ui.loaderStart("Loading..."); } }).done(function(data) {
     * setTimeout(function() { dotb.ui.loader.pBar.loaderEnd(); }, 1000); });
     */

}

/*******************************************************************************
 * getBoundingBoxInGetCapabilities(json object) 카타블리티에서 찾은 내용 중에, uppercase로
 * 사용하는 경우
 * 
 * @constructor RS.Ryu
 * @date 2015.11.02
 ******************************************************************************/
function getBoundingBoxInGetCapabilities(_json) {
    var obj = findObjectInGetCapabilities("boundingbox", _json);
    var boundingXY = [];
    for ( var i in obj) {
	// upper / lower 두 개를 가져온다.
	boundingXY[i] = obj[i].split(',');
	for ( var j in boundingXY[i]) {
	    boundingXY[i][j] = parseFloat(boundingXY[i][j]);
	}
    }

    var bound =
	{
	    min :
		{
		    x : boundingXY[0][1],
		    y : boundingXY[0][0]
		},
	    max :
		{
		    x : boundingXY[1][1],
		    y : boundingXY[1][0],
		}
	};
    return bound;
}

/*******************************************************************************
 * 카타블리티에서 필요한 내용을 찾음. (공용변수)
 * 
 * @constructor RS.Ryu
 * @date 2015.11.02
 ******************************************************************************/
function findObjectInGetCapabilities(_searchText, _json) {

    // 네임스페이스[숫자][바운딩박스 텍스트][upper/lower]
    // example : test:test_layer[4][boudingbox][0] = {0,0}, {}
    for ( var i in _json) {
	for ( var namespace in _json[i]) {
	    // 전체 제이슨 중에 바운딩 박스를 추출한다.
	    for ( var num in _json[i][namespace]) {
		// 네임스페이스
		for ( var btxt in _json[i][namespace][num]) {
		    // 텍스트를 찾음
		    if (btxt.toLowerCase().search(_searchText) > 0) {
			var obj = _json[i][namespace][num][btxt];
			// 순서대로 내용물을 리턴한다.
			return obj;
		    }
		}// btxt end
	    }// num end
	}// namespace end
    }
    // 찾는 것이 없음.
    return null;

}

/*******************************************************************************
 * WFS 레이어를 입력하는 루틴 (픽스코드)
 * 
 * @constructor RS.Ryu
 * @date 2015.10.26
 ******************************************************************************/

function getWFSLayer(_args) {
    try {

	var m_location = "http://" + _args[0];
	var m_namespace = _args[1];
	var m_layername = _args[2];
	var url = m_location
		+ "?service=WFS&version=1.1.0&request=GetFeature&outputformat=application/json&srsname=EPSG:3857&"
		+ "typename=" + m_namespace + ":" + m_layername;wfs 
	debMsg("Sending URL : " + newline + setBoldMessage(url));

	var data =
	    {
		'service' : 'WFS',
		'version' : '1.1.0',
		'request' : 'GetFeature',
		'outputformat' : 'application/json',
		'srsname' : 'EPSG:3857',
		'typename' : m_namespace + ":" + m_layername,
	    };
	// 보내기 전, 프리필터에서 제이슨으로 세팅
	$
		.ajax(
		    {
			url : m_location,
			dataType : 'json',
			data : data,
			crossDomain : true,
			success : function(_response) {
			    try {
				var mp_geojsonFormat = new ol.format.GeoJSON();
				var mp_features = mp_geojsonFormat
					.readFeatures(_response);
				var mp_layername = mp_features[0].getId()
					.split(".")[0];
				var mp_vectorLayer = func_getOlLayerByName(mp_layername);

				var mp_source = new ol.source.Vector(
				    {
					features : mp_features
				    });
				var m_ol2d = dotb.map;
				if (mp_vectorLayer == null) {
				    mp_vectorLayer = new ol.layer.Vector(
						{
						    name : mp_layername,
						    _type : "WFS",
						    source : mp_source,
						    style : new ol.style.Style(
								{
								    stroke : new ol.style.Stroke(
										{
										    color : getRandomColor(),
										    width : 1
										}),
								    fill : new ol.style.Fill(
										{
										    color : getRandomColor(),
										    opacity : 0.5
										})
								})
						});
				}
				mp_vectorLayer.setZIndex(10);
				m_ol2d.addLayer(mp_vectorLayer);
				var m_extent = ol.geom.Polygon
					.fromExtent(mp_source.getExtent());
				dotb.map.getView().fit(m_extent,
					dotb.map.getSize());
				debMsg("SUCCESS! : load layer "
					+ setBoldMessage(setRedMessage(mp_layername))
					+ newline
					+ mp_source.getExtent().toString());
			    }
			    catch (e) {
				deb(e);
				debMsg(e.toString());
			    }
			}

		    });

    }
    catch (e) {
	debMsg("ERROR!" + e);
    }
}



/**
 * 레이어 리스트를 출력하는 기능 (오픈레이어스)
 * 
 * @constructor RS.Ryu
 * @date 2015.10.27
 */
function getLayerList(_args) {
    var m_layers = dotb.map.getLayers().getArray();
    var m_return = [];
    var m_msg = "get Layer List : " + setRedMessage(m_layers.length)
	    + " layers" + newline;
    for ( var i in m_layers) {
	if (m_layers[i].get("style") == undefined) {
	    m_msg += "name : " + setBoldMessage(m_layers[i].get("name"))
		    + " type : " + setBoldMessage(m_layers[i].get("_type"))
		    + newline;

	}
	else {
	    m_msg += "name : <span color='"
		    + m_layers[i].getStyle().getStroke().getColor() + "'>"
		    + setBoldMessage(m_layers[i].get("name")) + "</span>"
		    + " type : " + setBoldMessage(m_layers[i].get("_type"))
		    + newline;
	}
	m_return.push(
	    {
		name : m_layers[i].get("name"),
		type : m_layers[i].get("_type")
	    });

    }
    debMsg(m_msg);
}
/**
 * wms 테스트
 * 
 * */
function test(_args){
	loadBaseMap([]);
	getWMSLayer(["demo.boundlessgeo.com/geoserver/wms", "ne", "ne"]);
    
}

/*******************************************************************************
 * WMS 레이어를 입력하는 루틴 (픽스코드)
 * 
 * @constructor RS.Ryu
 * @date 2015.10.26
 ******************************************************************************/
function getWMSLayer(_args) {

    var m_location = "http://" + _args[0];
    var m_namespace = _args[1];
    var m_layername = _args[2];
    var m_name = m_namespace + ":" + m_layername;

    var m_layer = func_getOlLayerByName(m_name);
    var wmsSource = null;
    if (m_layer == null) {
	wmsSource = new ol.source.ImageWMS(
	    {
		url : m_location,
		params :
		    {
			'LAYERS' : m_name
		    },
		serverType : 'geoserver',
		crossOrigin : ''
	    });
    }
    else {
	throw "Layer already exist.";
    }

    var wmsLayer = new ol.layer.Image(
	{
	    source : wmsSource,
	    _type : "WMS",
	    name : m_name
	});

    var m_view = dotb.map.getView();
    var m_size = dotb.map.getSize();
    
    wmsLayer.setZIndex(5);
    dotb.map.addLayer(wmsLayer);
    

}

function getCenterPoint(_args) {
    var m_msg = setBoldMessage("Get CenterPoint") + newline;
    try {
	var m_center = dotb.map.getView().getCenter();
	m_msg += setRedMessage(m_center.toString());
    }
    catch (e) {
	debMsg(m_msg + e.toString());
	err(e.toString());
    }
    finally {
	debMsg(m_msg);
    }
}

/**
 * 벡터 레이어를 등록하는 코드
 * 
 * @param type,
 *                name
 * @constructor RS.Ryu
 * @date 2015.10.26
 */
function createVectorLayer(_args) {
    var m_msg = setBoldMessage("Create Vector Layer");

    try {
	var m_vectorname = _args[0];
	var m_type = _args[1];
	if (m_vectorname == "" || m_vectorname == null
		|| m_vectorname == undefined)
	{
	    throw "Need Vector name";
	}

	if (func_getOlLayerByName(m_vectorname) == null) {
	    var olLayer = new ol.layer.Vector(
		{
		    name : m_vectorname,
		    _type : m_type,
		});
	    olLayer.setZIndex(1);
	    dotb.map.addLayer(olLayer);
	}
	else {
	    throw "Vector name already exists.";
	}

    }
    catch (e) {
	err(e.toString());
    }
    finally {

    }
}

/**
 * 공용 변수를 설정한다.
 * 
 * @constructor RS.Ryu
 * @date 2015.10.28
 */

function setTempValue(_args) {
    try {
	pTemp = _args[0];
	debMsg("Temp Value : " + setBoldMessage(setRedMessage(pTemp)));
    }
    catch (e) {
	deb(e);
	debMsg(e.toString());
    }
}

/**
 * 공용 변수를 설정한다.
 * 
 * @constructor RS.Ryu
 * @date 2015.10.28
 */

function getTempValue(_args) {
    try {
	debMsg("Temp Value : " + setBoldMessage(setRedMessage(pTemp)));
    }
    catch (e) {
	deb(e);
	debMsg(e.toString());
    }
}

/**
 * 공통코드, 메시지 앞*뒤에 굵게 변한시켜준다. (단어를 입력하면 <b>_단어</b> 형태로 변형함.)
 * 
 * @constructor RS.Ryu
 * @date 2015.10.26
 */
function setBoldMessage(_msg) {
    return boldstart + _msg + boldend;
}
/**
 * 공통코드, 메시지를 빨갛게 변환한다. (단어를 입력하면 <span class='div-color-red'>_단어</span> 형태로
 * 변형함.)
 * 
 * @constructor RS.Ryu
 * @date 2015.10.26
 */
function setRedMessage(_msg) {
    return redstart + _msg + redend;
}

/*******************************************************************************
 * 공통코드, 랜덤한 컬러를 생성한다.
 * 
 * @constructor RS.Ryu
 * @date 2015.10.27
 ******************************************************************************/

function getRandomColor() {
    var letters = '456789ABC'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
	color += letters[Math.floor(Math.random() * letters.length)];
    }
    console.log(color);
    return color;
}
