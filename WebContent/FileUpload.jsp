<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%@page import="com.oreilly.servlet.MultipartRequest" %>
<%@page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy" %>
<%@page import="java.io.*" %>
<%@page import="java.util.Date" %>
<%@page import="java.text.SimpleDateFormat" %>

<%

	request.setCharacterEncoding("UTF-8");
	int maxSize = 1024*1024*20;			//2G 로 제한함
	
	//업로드 된 실제 경로를 반환한다.
	String rootFolder = request.getSession().getServletContext().getRealPath("/");
	String savePath = rootFolder + "upload";
	
	// 업로드 파일명
    String uploadFile = "";
	
	//업로드 될 파일 이름
	String newFileName = "";
	
	int read = 0;
	byte[] buf = new byte[1024];			//파일 이름 최대 길이
	FileInputStream fin = null;
	FileOutputStream fout = null;
	
	//파일 전송시간
	long currentTime = System.currentTimeMillis();
	SimpleDateFormat simdf = new SimpleDateFormat("yyyyMMddhhmmss");		//201401011230 형태로 출력
	
	try{
		MultipartRequest multi = new MultipartRequest(request, savePath, maxSize, "UTF-8", new DefaultFileRenamePolicy());
		// 전송받은 parameter의 한글깨짐 방지
        String title = multi.getParameter("title");
        title = new String(title.getBytes("8859_1"), "UTF-8");
 
        // 파일업로드
        uploadFile = multi.getFilesystemName("uploadFile");
 
        // 실제 저장할 파일명(ex : 20140819151221.zip)
        newFileName = simdf.format(new Date(currentTime)) +"."+ uploadFile.substring(uploadFile.lastIndexOf(".")+1);
 
         
        // 업로드된 파일 객체 생성
        File oldFile = new File(savePath + uploadFile);
 
         
        // 실제 저장될 파일 객체 생성
        File newFile = new File(savePath + newFileName);
         
 
        // 파일명 rename
        if(!oldFile.renameTo(newFile)){
 
            // rename이 되지 않을경우 강제로 파일을 복사하고 기존파일은 삭제
 
            buf = new byte[1024];
            fin = new FileInputStream(oldFile);
            fout = new FileOutputStream(newFile);
            read = 0;
            while((read=fin.read(buf,0,buf.length))!=-1){
                fout.write(buf, 0, read);
            }
             
            fin.close();
            fout.close();
            oldFile.delete();
        }   
 
    }catch(Exception e){
        e.printStackTrace();
    }
%>
