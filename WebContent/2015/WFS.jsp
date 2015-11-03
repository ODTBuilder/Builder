
<%@page import="java.util.Date"%>
<%@page import="java.io.BufferedWriter"%>
<%@page import="java.io.Writer"%>
<%@page import="java.io.OutputStreamWriter"%>
<%@page import="java.io.OutputStream"%>
<%@page import="org.apache.commons.io.IOUtils"%>
<%@page import="java.io.ByteArrayOutputStream"%>
<%@page import="java.util.zip.GZIPOutputStream"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.util.zip.GZIPInputStream"%>
<%@page import="java.io.StreamTokenizer"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="java.net.URL"%>
<%@page import="java.net.URLConnection"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.io.PrintWriter"%>
<%@ page language="java" %>
<%@ pagepageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<%
	
	URL url = null; 
	HttpURLConnection uc = null; 
	URLConnection urlcon = null;
	String _message = "";
	String strUrl = request.getParameter("url");
	String strName = request.getParameter("name");
	String strLayer = request.getParameter("layer");
	String strBbox = request.getParameter("bbox");
	String strSrs = request.getParameter("srs");
	try{
		
		//sending_data = "?"+param_name + "=" + param_value; //전송할 데이터(파라미터명=값) 
		//페이지 연결, 박스가 없으면 
		if(strBbox == null || strBbox == "" ){
			strBbox = "";
		}
		else{
			strBbox = "&bbox=" + strBbox;
		}
		
		if(strSrs == null || strSrs == "" ){
			strSrs = "";
		}
		else{
			strSrs = "&srsname=EPSG:" + strSrs;
		}
		
		
		String _url = strUrl + "?service=WFS&request=GetFeature&outputformat=application/json"+
		"&typename=" + strName + ":" + strLayer + strBbox + strSrs;
		System.out.println(_url);
		url = new URL(_url);
		urlcon = url.openConnection(); 
		uc = (HttpURLConnection)urlcon;
		//uc.setRequestProperty("Accept-Encoding", "gzip");
		
		//데이타 수신
/* 		GZIPOutputStream output = new GZIPOutputStream(new ByteArrayOutputStream());
    	IOUtils.copy(uc.getInputStream(), output);
    	
    	BufferedWriter _writer = new BufferedWriter(new OutputStreamWriter(output, "UTF-8")); */
    	
    	BufferedReader rd = new BufferedReader(new InputStreamReader(uc.getInputStream(),"UTF-8"));
    	_message = org.apache.commons.io.IOUtils.toString(rd);
    	//System.out.println(_message);
    	/* 
    	byte[] buffer = new byte[1024];
    	int byteCount = 0;
    	
    	while((byteCount = uc.getInputStream().read(buffer)) > 0){
    		output.write(buffer, 0, byteCount);
    		System.out.println(buffer);
    	}
    	out = output;
    	output.close(); */
    	Date date = new Date();
		System.out.println("[" + date.toLocaleString() + "] : End request WFS.");
		
	}catch(Exception e){
	e.printStackTrace();
	}
	finally{
		
	}
	
%>
<%=_message %>

