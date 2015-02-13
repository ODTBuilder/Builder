<%@page import="org.json.simple.JSONObject"%>
<%@page import="org.json.simple.JSONArray"%>
<%@ page import="java.io.*,java.util.*, javax.servlet.*" %>
<%@ page import="javax.servlet.http.*" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.apache.commons.io.output.*" %>
<%@ page import="java.util.*" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
JSONArray aryobj = new JSONArray();	//결과값 저장소, 리턴값
File file ;
int maxFileSize = 50000 * 1024;
int maxMemSize = 50000 * 1024;
ServletContext context = pageContext.getServletContext();
String filePath = context.getInitParameter("file-upload");
// Verify the content type
String contentType = request.getContentType();
if ((contentType.indexOf("multipart/form-data") >= 0)) {
   DiskFileItemFactory factory = new DiskFileItemFactory();
   // maximum size that will be stored in memory
   factory.setSizeThreshold(maxMemSize);
   // Location to save data that is larger than maxMemSize.
   //factory.setRepository(new File("D:\\eGovFrameDev-3.1.1-32bit\\workspace\\test2\\WebContent\\test2\\test\\ \\upload"));
   factory.setRepository(new File("D:\\eGovFrameDev-3.1.1-32bit\\workspace\\test2\\WebContent\\test\\upload"));
   

   // Create a new file upload handler
   ServletFileUpload upload = new ServletFileUpload(factory);
   // maximum file size to be uploaded.
   upload.setSizeMax( maxFileSize );
   try{
      // Parse the request to get file items.
      List fileItems = upload.parseRequest(request);

      // Process the uploaded file items
      Iterator i = fileItems.iterator();

      while ( i.hasNext () ) 
      {
    	  
         FileItem fi = (FileItem)i.next();
         if ( !fi.isFormField () )	
         {
         // Get the uploaded file parameters
         String fieldName = fi.getFieldName();
         String fileName = fi.getName();
         boolean isInMemory = fi.isInMemory();
         long sizeInBytes = fi.getSize();
         // Write the file
         if( fileName.lastIndexOf("\\") >= 0 ){
         file = new File( filePath + 
         fileName.substring( fileName.lastIndexOf("\\"))) ;
         }else{
         file = new File( filePath + 
         fileName.substring(fileName.lastIndexOf("\\")+1)) ;
         }
         fi.write( file );
         if(file.getName() != ""){
        	 JSONObject obj = new JSONObject();
             obj.put("filename", file.getName());
             aryobj.add(obj);
         }
         }
      }
   }catch(Exception ex) {
      System.out.println(ex);
   }
}else{
}

%><%=aryobj%>
