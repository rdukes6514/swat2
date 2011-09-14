DialogShareManager = {};

DialogShareManager = {
		show:function(data){
			
			if(data==null)return;

		
		var Spinner = new Ext.ux.form.SpinnerField({
			xtype: 'spinnerfield'
			,name: 'SpinAllow'
			,minValue: 1
			,value: 1
			,allowDecimals: true
			,decimalPrecision: 1
			,accelerate: true
			,width: 100
		});
		

																		
		var radio1 = false;
		var radio2 = false;

		if(data.max_users>-1){
			radio1 = false;
			radio2 = true;	
			Spinner.setValue(data.max_users);	
		}else{
			radio1 = true;
			radio2 = false;
			Spinner.disable();
			
		}
		
		var FormGeneral = new Ext.Panel({
			labelWidth: 50
			,labelAlign: 'left'
			,height: 250
			//,width: '100%'
			,frame:true
            ,bodyStyle: 'x-window-body'
            ,border: false
			,items: [{
						layout: 'form'
						,items: [
								{
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "IdShareName"
									,value:data.name 
									,name: "name"
									,fieldLabel: "<b>Name</b>"
									,width: '95%'								
								}
								,{
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "IdPath"
									,value:data.path 
									,name: "path"
									,fieldLabel: "<b>Path</b>"
									,width: '95%'
								}
								,{
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "IdComment"
									,value:data.comment 
									,name: "comment"
									,fieldLabel: "<b>Comment</b>"
									,width: '95%'
								}
								,{	
									xtype: 'fieldset'
									,title: 'User Limit'
									,hideLabel:true
									,items: [
												{
													xtype : "radio"
													,hideLabel:true
													,name : "radiob"
													,boxLabel:'<b>Maximum allowed</b>'
													,checked: radio1
													,handler:function(radio,checked){
														if(checked){
															Spinner.disable(); 
														} 
													}
												}
												,{  
													xtype: "compositefield",
													hideLabel:true,
													border        : false,  
													items:[ 
															{
																xtype : "radio"
																,hideLabel:true
																,name : "radiob"
																,boxLabel:'<b>Allow this number of users&nbsp;&nbsp;&nbsp;&nbsp;</b>'
																,checked: radio2
																,handler:function(radio,checked){
																	if(checked){
																		 Spinner.enable(); 
																	} 
																}
															}
															,Spinner
														]  
												}																								
												
											]
								}	
						]
				}]
			
			});
	 
		
            		
			var tabs = new Ext.TabPanel({
			activeTab: 0,
			items: [
					{
						title: 'General'
						//,html: 'Another one'
						,items: [FormGeneral]
					}
				]
			});	 

			
			var WindowShareManager = new Ext.Window({
					title: sprintf('%s properties',data.name.capitalize())
					,modal:true
					,labelWidth: 75
					,width:380
					,height:365
					,frame: true
					,bodyStyle: 'padding:5px 5px 5px 5px'
					,layout: 'form'
					,items: [tabs]
						,buttons: [
								{
									text: 'Ok',
									//formBind: true,
									handler:function(){
										
									
										
										params={
												name:data.name
										}
										
										//var form = new Ext.form.FormPanel({id:'idSendForm',url:''});
											
										//SendForm(form,WindowShareManager,'User/UpdateUser',params)
										//UserController.SendData('Group/UpdateGroup',params,WindowShareManager);
									}
								}, {
									text: 'Cancel',
									handler: function () {
										WindowShareManager.close();
									}
								}
					]			
			});



			
			WindowShareManager.show();			
			WindowShareManager.center();
			
		
		}
}

