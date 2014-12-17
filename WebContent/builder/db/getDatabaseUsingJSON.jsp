<%@page import="java.net.URLEncoder"%>
<%@page import="org.json.simple.JSONArray"%>
<%@page import="java.sql.*"%>
<%@page import="org.json.simple.JSONObject"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%


/* String strId = request.getParameter("id");
String strPass = request.getParameter("pass");
String strHost = request.getParameter("host");
String strPort = request.getParameter("port");
String strAccount = request.getParameter("account");
String strTableName = request.getParameter("tname");
String strGeomField = request.getParameter("geom");
 */


String strId = "postgres";
String strPass = "postgres";
String strHost = "localhost";
String strPort = "5432";
String strAccount = "tester";
String strTableName = "testdb";
String strGeomField = "the_geom";


ResultSet rs = null;							//데이터 저장소
ResultSetMetaData rsmt = null;			//스키마 저장소
Connection conn = null;					//커넥션
PreparedStatement pstmt = null;			//프리스테이트먼트
JSONArray aryobj = new JSONArray();	//결과값 저장소

try{	
	Class.forName("org.postgresql.Driver");
	String strConn = "jdbc:postgresql://" + strHost + ":" + strPort + "/" + strAccount;
	conn = DriverManager.getConnection(strConn,strId,strPass);
	//Statement stmt = conn.createStatement();

	//
	
	//스키마 받아오는 루틴
	String schemaQuery = "select * from " + strTableName;
	pstmt = conn.prepareStatement(schemaQuery);
	rsmt = pstmt.getMetaData();		//메타데이터 세팅
	
	//쿼리 생성
	String dataQuery = "select ";
	for(int j = 1 ; j <= rsmt.getColumnCount() ; j++){
		if(rsmt.getColumnName(j).toString().equalsIgnoreCase(strGeomField)){
			dataQuery +=  "ST_AsText(" + rsmt.getColumnName(j).toString() + ")";
		}
		else{
			dataQuery += rsmt.getColumnName(j).toString();
		}
		
		if(j != rsmt.getColumnCount())
		{
			dataQuery += ",";
		}
	}
	
	dataQuery += " from " + strTableName;
	
	//지오메트리 필드를 적용한 스키마 받아오는 루틴
	pstmt = conn.prepareStatement(dataQuery);
	
	rs = pstmt.executeQuery();
	//rsmt = pstmt.getMetaData();		//메타데이터 세팅
	
	int length = rsmt.getColumnCount();
	int index = 0;
	while(rs.next()){
		JSONObject obj = new JSONObject();	//JSON 저장소
		for(int i = 1 ; i <= length ; i++){			
			obj.put(rsmt.getColumnName(i).toString(),
					//URLEncoder.encode(rs.getString(i).toString(),"EUC-KR")
					rs.getString(i).toString()
					);
			index++;
		}
/* 		out.print(obj);
		out.flush();			//출력함
 */	
 		aryobj.add(obj);
	}	
	//out.println(aryobj.toString());
	//out.flush();			//출력함
	
}
catch(Exception e){
	e.printStackTrace();
	out.println("테이블 연결에 실패 하였습니다.");
}finally{
	//자원 해제 부분
	if(rs != null) try{rs.close();}catch(SQLException sqle){}
	if(pstmt != null) try{pstmt.close();}catch(SQLException sqle){}
	if(conn != null) try{conn.close();}catch(SQLException sqle){}
}

%><%=aryobj%>