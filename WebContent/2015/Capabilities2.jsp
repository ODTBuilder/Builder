<%@page import="org.json.simple.JSONObject"%>
<%@page import="org.json.simple.JSONArray"%>
<%@page import="javax.xml.ws.Response"%>
<%@page import="java.util.ArrayList"%>
<%@ page import="org.w3c.dom.*"%>
<%@ page import="javax.xml.parsers.*"%>
<%@page import="java.net.URLConnection"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="java.net.URL"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%!




	
	public JSONArray start(String strUrl, String strName, String strLayer){
	
		JSONObject outputobj = new JSONObject();
		String findLayerName = strName + ":" + strLayer;
		StringBuffer sb = new StringBuffer();
		JSONArray aryobj = new JSONArray();
		
		try{
			String _url = strUrl+"?service=WFS&version=1.1.0&request=GetCapabilities";
			DocumentBuilderFactory dbFact = DocumentBuilderFactory.newInstance();
			DocumentBuilder dbilder = dbFact.newDocumentBuilder();
			Document doc = dbilder.parse(_url);			
			doc.getDocumentElement().normalize();
			
			//피처타입에 관련된 이름을 가져온다.
			NodeList nlList = doc.getElementsByTagName("FeatureType");
			for(int i = 0 ; i < nlList.getLength() ; i++){
				Node pNode = nlList.item(i);
				NodeList pNodeList = pNode.getChildNodes();
				for(int j = 0 ; j < pNodeList.getLength() ; j++){
					Node pNodeListNode = pNodeList.item(j);
					
					//노드이름을 비교하여 원하는 레이어에 가져온다.
					if(pNodeListNode.getNodeName() == "Name"){
						Element pNodeListElem = (Element)pNodeListNode;
						String _rlt = pNodeListElem.getTextContent();
						if(_rlt.equals(findLayerName)){
							//찾는 이름으로 키값 생성
							outputobj.put(findLayerName, getAttr3(pNodeListNode));
							aryobj.add(outputobj);
						}
					}
					
				}
				
			}
			System.out.println("CAPABILITIES RUN : " + strUrl + ", " +strName + ", " + strLayer);
			return aryobj;
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return aryobj;
	}


//찾은 노드의 차일드 내용을 입력한다.
public JSONObject getChildNodes(Node _node){
	NodeList nlList= _node.getChildNodes();
	boolean _result = false;
	JSONObject pObj = new JSONObject();
	JSONArray pArray = new JSONArray();
	for(int i = 0 ; i < nlList.getLength() ; i++){
		Node nlListNode = nlList.item(i);
		
		/* String _title = _node.getNodeName().replace(":", "")
				+"+"+nlListNode.getNodeName().replace(":", ""); */
		String _subText = nlListNode.getTextContent().replace(" ", ",");
		JSONObject obj = new JSONObject();
		pObj.put(i, _subText);
		pArray.add(obj);
	}
	return pObj;
}

//노드의 하부에 데이터를 세팅한다.
public JSONArray getAttr3(Node _node){
	Node _parent = _node.getParentNode();
	Node childNode = _parent.getFirstChild();
	JSONArray pArray = new JSONArray();
	while(childNode.getNextSibling() != null){
		childNode = childNode.getNextSibling();
		JSONObject pObj = new JSONObject();
		pObj.put(childNode.getNodeName(), getChildNodes(childNode));
		pArray.add(pObj);

	}
	return pArray;
}



%><%=start(request.getParameter("url"), request.getParameter("name"), request.getParameter("layer"))%>
