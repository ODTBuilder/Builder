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
String strAccount = request.getParameter("db_name");
String strTableName = request.getParameter("tname");
String strFid = request.getParameter("fid");
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
	
	if(strFeatureType.equals("Point")){
		String spatialQuery = "select * from " + strTableName + " where fid = " + strFid;
		System.out.println("spatialQuery = " + spatialQuery);
		
		pstmt = conn.prepareStatement(spatialQuery);
		rsmt = pstmt.getMetaData();
		
		//디버깅 출력문
		System.out.println("pstmt = " + pstmt);
		
		rs = pstmt.executeQuery();
		System.out.println("rs = " + rs.toString());
		
		int length = rsmt.getColumnCount();
		int index = 0;
		
		System.out.println("length =" + length);
		
		if(!rs.next()){
			System.out.println("찾는 fid가 없다.");
			JSONObject obj = new JSONObject();
			for(int i=1 ; i<=length ; i++){
				obj.put(rsmt.getColumnName(i).toString(),
						"no result"
						);
				System.out.println("rsmt.getColumnName(i) = " + rsmt.getColumnName(i).toString());
			}
			aryobj.add(obj);
		}
		
		while(rs.next()){
			System.out.println("여기 안탄다는거지?");
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
}

catch(Exception e){
	e.printStackTrace();
	out.println("테이블 연결에 실패하였습니다.");
	System.out.println("에러 = " + e.getMessage());
}

finally{
	if(rs != null) try{rs.close();}catch(SQLException sqle){}
	if(pstmt != null) try{pstmt.close();}catch(SQLException sqle){}
	if(conn != null) try{conn.close();}catch(SQLException sqle){}
}

%><%=aryobj%>