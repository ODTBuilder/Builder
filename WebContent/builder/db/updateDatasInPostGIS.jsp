<%-- <%@page import="org.json.simple.JSONArray"%> --%>

<%-- <%@page import="org.json.simple.JSONObject"%> --%>

<!-- org.json은 JSON의 추가적인 기능을 사용하기 위하여 다른 jar 파일 포함 -->
<%@page import="org.json.JSONObject"%>
<%@page import="org.json.JSONArray"%>

<%@page import="java.sql.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>

<%
String strId = request.getParameter("id");
String strPass = request.getParameter("pass");
String strHost = request.getParameter("host");
String strPort = request.getParameter("port");
String strAccount = request.getParameter("account");

/* String strId = "postgres";
String strPass = "postgres";
String strHost = "localhost";
String strPort = "5432";
String strAccount = "test1";
String strTableName = "tst_table";
String strGeomField = "the_geom"; */

ResultSet rs = null;				
ResultSetMetaData rsmt = null;		
Connection conn = null;				//커넥션
PreparedStatement pstmt = null;		//프리스테이트먼트
StringBuffer sb = new StringBuffer();
String json = null;
String line = null;

try{
	Class.forName("org.postgresql.Driver");
	String strConn = "jdbc:postgresql://" + strHost + ":" + strPort + "/" + strAccount;
	conn = DriverManager.getConnection(strConn, strId, strPass);
	
	System.out.println("strConn = " + strConn.toString());
	
	BufferedReader reader = request.getReader();
	
	System.out.println("reader = " + request.getReader().toString());
	
	while ((line = reader.readLine()) != null){
		sb.append(line);
		System.out.println("sb = " + sb.toString());
		}
	
	json = "{\"data\":" + sb.toString() + "}";
	System.out.println("json = " + json);
		
	JSONObject jsonObject = new JSONObject(json);
		
	JSONArray array = new JSONArray();	
	array = jsonObject.getJSONArray("data");
	
	String feature_type = "";
	String feature_fid = "";
	String[] geo_x = new String[array.length()];
	String[] geo_y = new String[array.length()];
	   		
	for(int i=0 ; i<array.length() ; i++){
		JSONObject jsonObj = new JSONObject(array.get(i).toString());
		System.out.println("get X = " + jsonObj.get("geo_x") + "	get Y =" + jsonObj.get("geo_y"));
		System.out.println("jsonObj = " + jsonObj);
		feature_type = (String)jsonObj.get("name");
		feature_fid = (String)jsonObj.get("fid");
		geo_x[i] = (String)jsonObj.get("geo_x");
		geo_y[i] = (String)jsonObj.get("geo_y");
		}
	
	System.out.println("");
	System.out.println("");
	
	System.out.println("geo_x = " + geo_x[0].toString()); //좌표가 String으로 출력된다.
	System.out.println("geo_y = " + geo_y[0].toString());
	System.out.println("feature_type = " + feature_type);
	
	
	/* --------------- Update ---------------- */
	
	if(feature_type.equals("Point")){
		String spatialQuery = "";
		
		spatialQuery = "update tst_table_point " ;
		spatialQuery += "set the_geom = ST_GeomFromText('POINT(";
		//spatialQuery += "values(" + feature_fid + ", " + "'테스트', ST_GeomFromText('POINT(" ;
		for(int i=0 ; i<array.length() ; i++){
			if(i+1 == array.length()){
				System.out.println("i+1 == array.length");
				spatialQuery += geo_x[i].toString() + " " + geo_y[i].toString();
			}
		}
		//spatialQuery += geo_x[0].toString() + " " + geo_y[0].toString();
		//Point는 시작점을 쿼리에 추가 안해도 됨
		spatialQuery += ")', 900913) ";
		spatialQuery += "where fid = " + feature_fid;
		
		System.out.println("update spatialQuery = " + spatialQuery);
		pstmt = conn.prepareStatement(spatialQuery);
		//rs = pstmt.executeQuery();
		int update_success_count = pstmt.executeUpdate();
		System.out.println("Update 개수 = " + update_success_count);
	}
	
	if(feature_type.equals("Line")){
		String spatialQuery = "";
		
		System.out.println("라인쪽 왔다");
		
		spatialQuery = "update tst_table_line " ;
		spatialQuery += "set the_geom = ST_GeomFromText('LINESTRING(";
		//spatialQuery += "values(" + feature_fid + ", '테스트', ST_GeomFromText('LINESTRING(";
		for(int i=0 ; i<array.length() ; i++){
			if(i+1 == array.length()){
				System.out.println("i+1 == array.length");
				spatialQuery += geo_x[i].toString() + " " + geo_y[i].toString();
			}
			
			else{
				spatialQuery += geo_x[i].toString() + " " + geo_y[i].toString() + ",";
			}
		}
		//spatialQuery += geo_x[0].toString() + " " + geo_y[0].toString();
		//Line은 시작점을 쿼리에 추가 안해도 됨
		spatialQuery += ")', 900913) ";
		spatialQuery += "where fid = " + feature_fid;
		
		System.out.println("update spatialQuery = " + spatialQuery);
		pstmt = conn.prepareStatement(spatialQuery);
		//rs = pstmt.executeQuery();
		int success_count = pstmt.executeUpdate();
		System.out.println("Update 개수 = " + success_count);
	}
	
	if(feature_type.equals("Polygon")){
		String spatialQuery = "";
		
		spatialQuery = "update tst_table " ;
		spatialQuery += "set the_geom = ST_GeomFromText('MULTIPOLYGON((("; 
		//spatialQuery += "values(" + feature_fid + ", '테스트', ST_GeomFromText('MULTIPOLYGON(((";
		for(int i=0 ; i<array.length() ; i++){
			spatialQuery += geo_x[i].toString() + " " + geo_y[i].toString() + ",";
		}
		spatialQuery += geo_x[0].toString() + " " + geo_y[0].toString();
		spatialQuery += ")))', 900913) ";
		spatialQuery += "where fid = " + feature_fid;
		
		System.out.println("update spatialQuery = " + spatialQuery);
		pstmt = conn.prepareStatement(spatialQuery);
		//rs = pstmt.executeQuery();
		int success_count = pstmt.executeUpdate();
		System.out.println("Update 개수 = " + success_count);
	}
	
	/* while(rs.next()){
		JSONObject obj = new JSONObject();
		for(int i = 1 ; i <= length ; i++){
			obj.put(rsmt.getColumnName(i).toString(),
					rs.getString(i).toString()
					);
			System.out.println("rs.getString(i).toString() = " + rs.getString(i).toString());
			index++;
		}
		
		aryobj.put(obj);
	} */
}

catch(Exception e){
	e.printStackTrace();
	out.println("테이블 연결에 실패하였습니다.");
	System.out.println("테이블 연결에 실패하였습니다.");
	System.out.println("에러 = " + e.getMessage());
}

finally{
	if(rs != null) try{rs.close();}catch(SQLException sqle){}
	if(pstmt != null) try{pstmt.close();}catch(SQLException sqle){}
	if(conn != null) try{conn.close();}catch(SQLException sqle){}
}

%><%-- <%=aryobj%> --%>