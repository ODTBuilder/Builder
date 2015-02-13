<%@page import="java.net.URLEncoder"%>
<%@page import="org.json.simple.JSONArray"%>
<%@page import="java.sql.*"%>
<%@page import="org.json.simple.JSONObject"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%

String strId = request.getParameter("id");
String strPass = request.getParameter("pass");
String strHost = request.getParameter("host");
String strPort = request.getParameter("port");
String strAccount = request.getParameter("account");
String strTableName = request.getParameter("tname");
String strGeomField = request.getParameter("geom");

strGeomField = "geom";  //카자흐스탄

//strGeomField = "the_geom";  //원래 테스트  

ResultSet rs = null;				//데이터 저장소
ResultSetMetaData rsmt = null;		//스키마 저장소
Connection conn = null;				//커넥션
PreparedStatement pstmt = null;		//프리스테이트먼트
JSONArray aryobj = new JSONArray();	//결과값 저장소

try{
	Class.forName("org.postgresql.Driver");
	String strConn = "jdbc:postgresql://" + strHost + ":" + strPort + "/" + strAccount;
	conn = DriverManager.getConnection(strConn, strId, strPass);
	
	System.out.println("strConn = " + strConn.toString());
	
	String spatialQuery = "select gid, st_astext(" + strGeomField + ")" + " from " + strTableName;
	//spatialQuery += " where ST_Intersects(ST_GeomFromText('POLYGON((71.3873 51.1930,71.3873 51.1700,71.4632 51.1700, 71.4632 51.1930, 71.3873 51.1930))',4326),geom)";
	
	//String spatialQuery = "select fid, st_astext(" + strGeomField + ")" + " from " + strTableName;
	System.out.println("spatialQuery = " + spatialQuery);
	
	pstmt = conn.prepareStatement(spatialQuery);
	rsmt = pstmt.getMetaData();
	
	//디버깅 출력문
	System.out.println("pstmt = " + pstmt);
	rs = pstmt.executeQuery();
	
	int length = rsmt.getColumnCount();
	int index = 0;
	
	while(rs.next()){
		JSONObject obj = new JSONObject();
		for(int i = 1 ; i <= length ; i++){
			obj.put(rsmt.getColumnName(i).toString(),
					rs.getString(i).toString()
					);
			//System.out.println("rs.getString(i).toString() = " + rs.getString(i).toString());
			index++;
		}
		aryobj.add(obj);
	}
}

catch(Exception e){
	e.printStackTrace();
	//out.println("");
	//obj.put("","");
	//aryobj.add(obj);
	System.out.println("에러 = " + e.getMessage());
}

finally{
	if(rs != null) try{rs.close();}catch(SQLException sqle){}
	if(pstmt != null) try{pstmt.close();}catch(SQLException sqle){}
	if(conn != null) try{conn.close();}catch(SQLException sqle){}
}

%><%=aryobj%>