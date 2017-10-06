
function dataGrid(params){

		$(params['vrenderTo']).empty();	
		  var tr=[];
	      var no;  
/*	      
		  tr.push("<div class='box-header'>");
			if(params['vbutton'][0] == "add"){		              
//			  tr.push("<a href='javascript:void(0)'  onclick='fnaddDataList(\""+'md_company'+"\")' class='btn btn-info btn-sm'><span class='glyphicon glyphicon-plus'></span> Add</a>");
			}									
			  tr.push("<input type='text' name='q' id='q' class='form-control' placeholder='Search...' style='width:200px;float:right;' ><button type='button' onClick='fnFind()' class='btn btn-info pull-right glyphicon glyphicon-search btn-sm'></button>");                
          tr.push("</div>");
*/        		
		tr.push("<table class='table  table-bordered table-hover'>")		
		    tr.push("<tbody>");		
		    tr.push("<tr  id='t_header' class='bg-aqua'>");
		    tr.push("<th width='1px'>No</th>");		    
		for (var i = 0; i < params['vheaders'].length; i++) {
			var mywidth = params['vfields'][i].split("/");			
		    tr.push("<th >"+params['vheaders'][i]+"</th>");		    					
		}		    
		    tr.push("<th style='width:10px;' colspan='2'>#</th>");		    		
		    tr.push("</tr>");		    
		    tr.push("</tbody>");		
		if(Number(params['vPage']) ==1 ){			
		no = 1 ;
		}
		else{
			no = 10 + Number(params['vPage']);			
		}    	
		for (var ii = 0; ii < params['json'].length; ii++) {
			tr.push("<tr>");
			tr.push("<td>" + no + "</td>");			
			for (var x = 0; x < params['vfields'].length; x++) {
					tr.push("<td>" + params['json'][ii][params['vfields'][x]] + "</td>");
			}		    			
				if(params['vbutton'][1] == "edit"){
					tr.push("<td><a  href='../../md_company/index/?m=edit&id="+params['json'][ii]['_id']+"'><span class='glyphicon glyphicon-edit'></span></a>");					
				}	
				if(params['vbutton'][2] == "delete"){
					tr.push("<td><a  href='javascript:void(0)'  onclick='fndeleteDataList(\""+params['json'][ii]['_id'] +"\")'><span class='glyphicon glyphicon-remove'></span></a></td>");					
				}							
				if(params['json'][ii]['approved'] != true){
					tr.push("<td><a  href='javascript:void(0)' class='btn btn-info btn-sm' onclick='fnApprove(\""+params['json'][ii]['_id'] +"\")'>Approve</a></td>");					
				}							
				else{
					tr.push("<td><a  href='javascript:void(0)'  class='btn btn-info btn-danger' onclick='fndisApprove(\""+params['json'][ii]['_id'] +"\")'>Disapprove</a></td>");					
				}							
				
			tr.push("</tr>");
		no++;	
		}
		tr.push("<tr>");		
		tr.push("</table>")		        		
		
		$(params['vrenderTo']).append($(tr.join('')));
}
function dataGrid2(params){

		$(params['vrenderTo']).empty();	
		  var tr=[];
	      var no;  
		tr.push("<table>")		
			tr.push("<tr>");		
		for (var ii = 0; ii < params['json'].length; ii++) {
					tr.push("<td class='hvr' align='center' width='50px'><a  href='../../md_claims/index/?m=detail&claim_id="+params['json'][ii]['_id']+"'><img src='/images/appr_reward.png' width='200px' height='200px' ></img><h2>"+params['json'][ii]['title']+"</h2><button class='btn btn-info btn-sm' ><i class='glyphicon glyphicon-time'></i> "+params['json'][ii]['status']+"</button></a></td>");										
		no++;	
		}
					tr.push("<td class='hvr' width='50px' align='center'><a  href='../../md_claims/index/?m=create'><img src='/images/disappr_rewards.png' width='200px' height='200px' ></img><h2>Add Claim</h2></a></td>");					
		
		tr.push("<tr>");		
		
		tr.push("</table>")		        		
		
		$(params['vrenderTo']).append($(tr.join('')));
}
function ClaimDetail(params){

		$(params['vrenderTo']).empty();	
		  var tr=[];
	      var no;  
		tr.push("<table>")		
			tr.push("<tr>");		
		for (var ii = 0; ii < params['json'].length; ii++) {
					tr.push("<td class='hvr' align='center' width='50px'><a  href='javascript:void(0)' onclick='fndisApprove(\""+params['json'][ii]['_id'] +"\")'><img src='/images/appr_reward.png' width='200px' height='200px' ></img><h2>"+params['json'][ii]['title']+"</h2><button class='btn btn-info btn-sm' ><i class='glyphicon glyphicon-time'></i> "+params['json'][ii]['status']+"</button></a></td>");										
		no++;	
		}
					tr.push("<td class='hvr' width='50px' align='center'><a  href='../../md_claims/index/?m=create'><img src='/images/disappr_rewards.png' width='200px' height='200px' ></img><h2>Add Claim</h2></a></td>");					
		
		tr.push("<tr>");		
		
		tr.push("</table>")		        		
		
		$(params['vrenderTo']).append($(tr.join('')));
}

function pagination(vTotalRows,vPage,vLimit){	    
	    var vCountPage;
		var PageLimit;	
		var MaxPage= vPage + 4;;		
        if(vPage < 5){            
            if( MaxPage <= Math.round(vTotalRows/vLimit) ) {    
                vCountPage = 5 ;
                vPageLimit = 1;                
            }
            else{                
                vCountPage = Math.round(vTotalRows/vLimit) ;
                vPageLimit = 1;            
            }        
        }
        else{
            if( MaxPage < Math.round(vTotalRows/vLimit) ) {                    
                vCountPage = Number(vPage) + 4 ;
                vPageLimit = Number(vPage)-1;                            
            }
            else{                
                vCountPage = Math.round(vTotalRows/vLimit) ;
                vPageLimit = vPage-1;                        
            }
        }	    
		$('#pagination').empty();		
		var tr=[];	    
		tr.push("<nav class='pull-right'>");
					tr.push("<ul class='pagination'>");
						tr.push("<li><a href='javascript:void(0)' onclick='fnloadDataList(1)'>|<</a></li>");                        
						for(i=vPageLimit;i<=vCountPage;i++){
							if(i == vPage){
							tr.push("<li  class='active'><a href='javascript:void(0)' onclick='fnloadDataList(" + i + ")'>" + i + "</a></li>");							
							}
							else{
							tr.push("<li><a href='javascript:void(0)' onclick='fnloadDataList(" + i + ")'>" + i + "</a></li>");															
							}
						}
						tr.push("<li><a href='javascript:void(0)' onclick='fnloadDataList("+Math.round(vTotalRows/vLimit)+")'>>|</a></li>");                        						
					    tr.push("<li><a href='#'>Total :" + vTotalRows + "</a></li>");                          						
					tr.push("</ul>");		
		tr.push("</nav>");
		$('#pagination').append($(tr.join('')));	    	
}

function form(params){
		var tr=[];	
              tr.push("<div class='box-body'>")
						  tr.push("<input type='hidden' class='form-control' id='_id' name='_id' value='"+params['vid']+"' >");						              
					for (var x = 0; x < params['vlabels'].length; x++) {
						var myfields = params['vfields'][x].split("/");
						tr.push("<div class='form-group'>");
						  tr.push("<label for='"+myfields[0]+"' class='col-sm-2 control-label'>"+params['vlabels'][x]+"</label>");
						  tr.push("<div class='col-sm-10'>");
						     if(params['vtype'] =='edit'){
								if(myfields[1] == 'select'){
								tr.push("<select class='form-control' id='"+myfields[0]+"' name='"+myfields[0]+"' value='"+params['vvalue'][x]+"' placeholder='"+params['vlabels'][x]+"' >"+params['vlabels'][x]+"</select>");
								}else{ 
								tr.push("<input type='"+myfields[1]+"' class='form-control' id='"+myfields[0]+"' name='"+myfields[0]+"' value='"+params['vvalue'][x]+"' placeholder='"+params['vlabels'][x]+"' >");
								}
							 }	
							 else{
								if(myfields[1] == 'select'){
								tr.push("<select type='text' class='form-control' id='"+myfields[0]+"' name='"+myfields[0]+"' value='"+params['vvalue'][x]+"' placeholder='"+params['vlabels'][x]+"' ></select>");
								}else{ 								 
								tr.push("<input type='"+myfields[1]+"' class='form-control' id='"+myfields[0]+"' name='"+myfields[0]+"'  placeholder='"+params['vlabels'][x]+"'  >");								 
								}
							 }	 
						  tr.push("</div>");
						tr.push("</div>");                						  
					}		
              tr.push("<div class='box-footer'>");
							tr.push("<a href='../../md_company/index/?m=data' type='button'  class='btn btn-info pull-left'>Cancel</a>");								              
						     if(params['vtype'] =='edit'){
								tr.push("<button type='button' name='submit' onClick='fnUpdate()' class='btn btn-info pull-right'>Update</button>");								
							 }	
							 else{
								tr.push("<button type='submit' name='submit' onClick='fnSave()' class='btn btn-info pull-right'>Save</button>");
							 }	                 
              tr.push("</div>");            
		$(params['vrenderTo']).append($(tr.join('')));  
}
