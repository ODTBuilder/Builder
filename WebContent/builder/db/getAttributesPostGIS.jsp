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
String strFid = request.getParameter("fid");


ResultSet rs = null;				//데이터 저장소
ResultSetMetaData rsmt = null;		//스키마 저장소
Connection conn = null;				//커넥션
PreparedStatement pstmt = null;		//프리스테이트먼트
JSONArray aryobj = new JSONArray();	//결과값 저장소

try{	
	Class.forName("org.postgresql.Driver");
	String strConn = "jdbc:postgresql://" + strHost + ":" + strPort + "/" + strAccount;
	conn = DriverManager.getConnection(strConn,strId,strPass);
	//Statement stmt = conn.createStatement();

	//스키마 받아오는 루틴
	String schemaQuery = "select * from " + strTableName;
	//String schemaQuery = "select fid, name from " + strTableName;
	
	System.out.println("scemaQuery = " + schemaQuery);
	
	pstmt = conn.prepareStatement(schemaQuery);
	rsmt = pstmt.getMetaData();		//메타데이터 세팅
	
	//쿼리 생성
	//String dataQuery = "select gid, name";
	String dataQuery = "select ";
	for(int j = 1 ; j <= rsmt.getColumnCount() ; j++){
		if(rsmt.getColumnName(j).toString().equalsIgnoreCase(strGeomField)){
			dataQuery +=  "ST_AsText(" + rsmt.getColumnName(j).toString() + ")";
			
			//디버깅용 출력
			System.out.println("dataQuery1 = " + dataQuery);
		}
		else{
			dataQuery += rsmt.getColumnName(j).toString();
			System.out.println("getColumnName = " + rsmt.getColumnName(j).toString());
		}
		
		System.out.println("j = " + j);
		System.out.println("rsmt_count = " + rsmt.getColumnCount());
		
		if(j != rsmt.getColumnCount())
		{
			dataQuery += ",";
		}
	}
	//dataQuery = dataQuery.substring(0, dataQuery.length() - 1);  카자흐스탄할 때 필요했음
	System.out.println("dataQuery1-1 = " + dataQuery);
	

	if(strFid == null){
		dataQuery += " from " + strTableName;
	}
	else{
		/* dataQuery += " from " + strTableName + " where fid = " + strFid; */
		dataQuery += " from " + strTableName + " where fid = " + strFid;
	}
	
	System.out.println("dataQuery2 = " + dataQuery);
	//지오메트리 필드를 적용한 스키마 받아오는 루틴
	pstmt = conn.prepareStatement(dataQuery);
	
	//디버깅 출력문
	System.out.println("pstmt = " + pstmt);
	
	rs = pstmt.executeQuery();
	rsmt = pstmt.getMetaData();		//메타데이터 세팅
	
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
 		/* out.print(obj);
		out.flush();			//출력함 */
 
 		aryobj.add(obj);
	}	
	//out.println(aryobj.toString());
	//out.flush();			//출력함
	
}
catch(Exception e){
	e.printStackTrace();
	//out.println("테이블 연결에 실패하였습니다.");
}
finally{
	//자원 해제 부분
	if(rs != null) try{rs.close();}catch(SQLException sqle){}
	if(pstmt != null) try{pstmt.close();}catch(SQLException sqle){}
	if(conn != null) try{conn.close();}catch(SQLException sqle){}
}

%><%=aryobj%>