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
		JSONArray _arjObj = new JSONArray();
		String findLayerName = strName + ":" + strLayer;
		StringBuffer sb = new StringBuffer();
		JSONArray aryobj = new JSONArray();
		/* System.out.println(strUrl);
		System.out.println(findLayerName); */
		
		try{
			String _url = strUrl+"?service=WFS&version=1.1.0&request=GetCapabilities";
			DocumentBuilderFactory dbFact = DocumentBuilderFactory.newInstance();
			DocumentBuilder dbilder = dbFact.newDocumentBuilder();
			Document doc = dbilder.parse(_url);
			//System.out.println(_url);
			
			doc.getDocumentElement().normalize();
			NodeList nlList = doc.getElementsByTagName("FeatureType");
			for(int i = 0 ; i < nlList.getLength() ; i++){
				Node pNode = nlList.item(i);
				NodeList pNodeList = pNode.getChildNodes();
				for(int j = 0 ; j < pNodeList.getLength() ; j++){
					Node pNodeListNode = pNodeList.item(j);
					if(pNodeListNode.getNodeName() == "Name"){
						Element pNodeListElem = (Element)pNodeListNode;
						String _rlt = pNodeListElem.getTextContent();
						if(_rlt.equals(findLayerName)){
							getAttr3(pNodeListNode, _arjObj);
						}
					}
					
				}
				
			}
			System.out.println("CAPA");
			return _arjObj;
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return _arjObj;
	}

public boolean getChildNodes(Node _node, JSONArray _arjObj){
	NodeList nlList= _node.getChildNodes();
	boolean _result = false;
	for(int i = 0 ; i < nlList.getLength() ; i++){
		Node nlListNode = nlList.item(i);
		JSONObject obj = new JSONObject();
		String _title = _node.getNodeName().replace(":", "")
				+"+"+nlListNode.getNodeName().replace(":", "");
		String _subText = nlListNode.getTextContent().replace(" ", ",");
		obj.put(_title, _subText);
		_arjObj.add(obj);
		System.out.println("{" +_node.getNodeName().replace(":", "")
				+"+"+nlListNode.getNodeName().replace(":", "")
				+":" + nlListNode.getTextContent().replace(" ", ",") + "}"
				);
		if(nlListNode.hasChildNodes()){
			_result = true;
		}
	}
	return _result;
}

public void getAttr3(Node _node, JSONArray _arjObj){
	Node _parent = _node.getParentNode();
	Node childNode = _parent.getFirstChild();
	while(childNode.getNextSibling() != null){
		childNode = childNode.getNextSibling();
		if(getChildNodes(childNode, _arjObj)){
			//System.out.println("-------------");
		}
		else{
			//System.out.println(childNode.getNodeName());
		}
	}
}



%><%=start(request.getParameter("url"), request.getParameter("name"), request.getParameter("layer"))%>
