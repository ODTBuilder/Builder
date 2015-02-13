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
String strFeatureType = request.getParameter("feature_type");

ResultSet rs = null;				//데이터 저장소
ResultSetMetaData rsmt = null;		//스키마 저장소
Connection conn = null;				//커넥션
PreparedStatement pstmt = null;		//프리스테이트먼트
JSONArray aryobj = new JSONArray();	//결과값 저장소

try{
	Class.forName("org.postgresql.Driver");
	String strConn = "jdbc:postgresql://" + strHost + ":" + strPort + "/" + strAccount;
	conn = DriverManager.getConnection(strConn, strId, strPass);
	String spatialQuery = "";
	
	if(strFeatureType.equals("Point")){
		spatialQuery = "select nextval('point_id')"; 	
	}
	
	if(strFeatureType.equals("Line")){
		spatialQuery = "select nextval('line_id')";
	}
	
	if(strFeatureType.equals("Polygon")){
		spatialQuery = "select nextval('polygon_id')";
	}
	
	System.out.println("spatialQuery = " + spatialQuery);
	
	pstmt = conn.prepareStatement(spatialQuery);
	rsmt = pstmt.getMetaData();
	
	//디버깅 출력문
	System.out.println("pstmt = " + pstmt);
	
	rs = pstmt.executeQuery();
	System.out.println("rs = " + rs.toString());
	
	int length = rsmt.getColumnCount();
	int index = 0;
	
	while(rs.next()){
		JSONObject obj = new JSONObject();
		for(int i = 1 ; i <= length ; i++){
			obj.put(rsmt.getColumnName(i).toString(),
					rs.getString(i).toString()
					);
			System.out.println("rs.getString(i).toString() = " + rs.getString(i).toString());
			index++;
		}
		aryobj.add(obj);
	}
}

catch(Exception e){
	e.printStackTrace();
	System.out.println("에러 = " + e.getMessage());
}

finally{
	if(rs != null) try{rs.close();}catch(SQLException sqle){}
	if(pstmt != null) try{pstmt.close();}catch(SQLException sqle){}
	if(conn != null) try{conn.close();}catch(SQLException sqle){}
}

%><%=aryobj%>