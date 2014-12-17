<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@ page import="java.io.File"%>
<%@ page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@ page import="java.util.List"%>
<%@ page import="org.apache.commons.fileupload.FileItem"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="java.io.IOException"%>

<%
 boolean isMultipart = ServletFileUpload.isMultipartContent(request);                   // multipart로 전송되었는가를 체크
 
  //File temporaryDir = new File("c:\\tmp\\");                                                 //업로드 된 파일의 임시 저장 폴더를 설정
  String tempdir = getServletContext().getRealPath("/upload/");
  String paths = "test!";
  
  out.println("<script>alert();</script>");
  out.println("<script>alert('" + tempdir + "');</script>");
  out.println("<script>console.log('" + paths + "');</script>");
%>


<!-- 완료 후 원래 상태로 복귀한다. -->
<script type="text/javascript">
//<![CDATA[
location.href = 'uitest.html';
//]]>
</script>