geodtjs.define = {
		menu : {},
		sub : {},
		msg : {},
};

//메뉴 관련 변수 세팅
geodtjs.define.menu.basemap = "기본";
geodtjs.define.menu.conndb = "DB";
geodtjs.define.menu.layers = "레이어";
geodtjs.define.menu.draw = "벡터";
geodtjs.define.menu.raster = "래스터";
geodtjs.define.menu.attributes = "속성";
geodtjs.define.menu.file = "파일";
geodtjs.define.menu.config = "설정";

//세부 내역 (기본지도)
geodtjs.define.menu.basemap.sub = {};
geodtjs.define.menu.basemap.sub.google = "구글지도";
geodtjs.define.menu.basemap.sub.osm = "오픈스트리트맵";
geodtjs.define.menu.basemap.sub.naver = "네이버";
geodtjs.define.menu.basemap.sub.daum = "다음";
geodtjs.define.menu.basemap.sub.vworld = "공간정보 오픈플랫폼";

//db연결
geodtjs.define.menu.conndb.sub = {};
geodtjs.define.menu.conndb.sub.open = "열기";
geodtjs.define.menu.conndb.sub.close = "닫기";
geodtjs.define.menu.conndb.sub.save = "저장";

//그리기 세부내역
geodtjs.define.menu.draw.sub = {};
geodtjs.define.menu.draw.sub.two = "2차원";
geodtjs.define.menu.draw.sub.three = "3차원";

//2차원 도형 세부내역
geodtjs.define.menu.draw.sub.two.sub = {};
geodtjs.define.menu.draw.sub.two.sub.make = "생성";
geodtjs.define.menu.draw.sub.two.sub.modify = "수정";
geodtjs.define.menu.draw.sub.two.sub.del = "삭제";

//2차원 도형 입력 세부내역
geodtjs.define.menu.draw.sub.two.sub.make.sub = {};
geodtjs.define.menu.draw.sub.two.sub.make.sub.point = "점";
geodtjs.define.menu.draw.sub.two.sub.make.sub.line = "선";
geodtjs.define.menu.draw.sub.two.sub.make.sub.polygon = "면";
geodtjs.define.menu.draw.sub.two.sub.make.sub.hole = "홀";

//2차원 도형 변경 세부 내역
geodtjs.define.menu.draw.sub.two.sub.modify.sub = {};
geodtjs.define.menu.draw.sub.two.sub.modify.sub.move = "이동";
geodtjs.define.menu.draw.sub.two.sub.modify.sub.modify = "수정";

//3차원 도형 세부내역
geodtjs.define.menu.draw.sub.three.sub = {};
geodtjs.define.menu.draw.sub.three.sub.make = "생성";
geodtjs.define.menu.draw.sub.three.sub.modify = "수정";
geodtjs.define.menu.draw.sub.three.sub.del = "삭제";

//3차원 도형 입력 세부내역
geodtjs.define.menu.draw.sub.three.sub.make.sub = {};
geodtjs.define.menu.draw.sub.three.sub.make.sub.point = "점";
geodtjs.define.menu.draw.sub.three.sub.make.sub.line = "선";
geodtjs.define.menu.draw.sub.three.sub.make.sub.polygon = "면";
geodtjs.define.menu.draw.sub.three.sub.make.sub.hole = "홀";
geodtjs.define.menu.draw.sub.three.sub.make.sub.extrude = "돌출";

//3차원 도형 변경 세부 내역
geodtjs.define.menu.draw.sub.three.sub.modify.sub = {};
geodtjs.define.menu.draw.sub.three.sub.modify.sub.move = "이동";
geodtjs.define.menu.draw.sub.three.sub.modify.sub.modify = "수정";

//그림입력
//geodtjs.define.menu.raster.make = "생성";
geodtjs.define.menu.raster.sub = {};
geodtjs.define.menu.raster.sub.make= "생성";
geodtjs.define.menu.raster.sub.move= "이동";
geodtjs.define.menu.raster.sub.modify = "수정";
geodtjs.define.menu.raster.sub.transparent = "투명";
geodtjs.define.menu.raster.sub.del = "삭제";
geodtjs.define.menu.raster.sub.transparent.sub = {};
geodtjs.define.menu.raster.sub.transparent.sub.opacity = "투명도";


//속성보기
geodtjs.define.menu.attributes.sub = {};
geodtjs.define.menu.attributes.sub.select = "선택";
geodtjs.define.menu.attributes.sub.view= "보기";
geodtjs.define.menu.attributes.sub.save = "저장";


//메시지 관련
var MESSAGE = geodtjs.define.msg;
geodtjs.define.msg.createEntityDialog = {};
geodtjs.define.msg.createEntityDialog.title = "편집 레이어 선택";
geodtjs.define.msg.createEntityDialog.closediv = " 편집";

geodtjs.define.msg.LAYER_TYPE_NOT_ALLOWED = "수정할 수 없는 레이어 타입입니다.";
geodtjs.define.msg.LAYER_TYPE_ALLOWED = "레이어 편집.";