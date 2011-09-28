DialogShareManager = {};

DialogShareManager = {
		show:function(data,iscopy_or_new){
			
			var title = '';
			var name = '';
			if (typeof data == "undefined" || data == null) {
				data = {
					name:''
					,path:''
					,comment:''
					,max_users:-1
				};
				title = lang.NewShare;
		   } else {
				title = sprintf(lang.FormatProperties,data.name.capitalize());	
				name = data.name;
			}
		   
			if (typeof iscopy_or_new == "undefined") {
				iscopy_or_new = false
			} else if(iscopy_or_new){
				if(name.trim()!= ''){
					title = lang.CopyOf+name;
				}
				
				name = '';
			} 
			
		var txtname = new Ext.form.TextField({
			xtype: "textfield"
			,labelAlign: 'left'
			,id: "IdShareName"
			,value:name 
			,name: "name"
			,fieldLabel: lang.dialog.name
			,width: '95%'	
			,allowBlank: false							
		});
		
		
		var txtpath = new Ext.form.TextField({
			xtype: "textfield"
			,labelAlign: 'left'
			,id: "IdPath"
			,value:data.path 
			,name: "path"
			,fieldLabel: lang.dialog.path
			,width: '95%'
			,allowBlank: false
			/*,listeners: {
				'invalid': function(){
					alert('you changed the text of this input field');
				}	
			}*/			
		});		
		
		
		txtname.on('invalid',this.oninvalid);
		txtname.on('valid',this.onvalid);
		
		txtpath.on('invalid',this.oninvalid);
		txtpath.on('valid',this.onvalid);
		
				
		var Spinner = new Ext.ux.form.SpinnerField({
			xtype: 'spinnerfield'
			,name: 'SpinAllow'
			,minValue: 1
			,value: 1
			,allowDecimals: true
			,decimalPrecision: 1
			,accelerate: true
			,width: 70
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
								txtname
								,txtpath
								,{
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "IdComment"
									,value:data.comment 
									,name: "comment"
									,fieldLabel: lang.dialog.comment
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
													,id : "IdRadiobtn1"
													,name : "radiob"
													,boxLabel:lang.dialog.MaximumAllowed
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
																,boxLabel:lang.dialog.MaximumAllowedUser
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
						title: lang.general
						//,html: 'Another one'
						,items: [FormGeneral]
					}
				]
			});	 

			
			var WindowShareManager = new Ext.Window({
					title: title
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
									text: 'Ok'
									,id:'WindowShareManagerBtnOk'
									//formBind: true,
									,handler:function(){
										
										
										params={
												name:Ext.getCmp('IdShareName').getValue()
												,path:Ext.getCmp('IdPath').getValue()
										}
										
										length
										var comment = Ext.getCmp('IdComment').getValue();
										
										if(comment.trim()!=''){
											params.comment=comment;
										}
										
										if(Ext.getCmp('IdRadiobtn1').getValue()==false){
											params.max_users=Spinner.getValue();
										}
										
										//var form = new Ext.form.FormPanel({id:'idSendForm',url:''});
										//SendForm(form,WindowShareManager,'User/UpdateUser',params)
										if(iscopy_or_new){
											ShareController.SendData('Share/AddShare',params,WindowShareManager);
										} else {
											ShareController.SendData('Share/UpdateShare',params,WindowShareManager);
										}
									}
								}, {
									text: lang.cancel,
									handler: function () {
										WindowShareManager.close();
									}
								}
					]			
			});



			
			WindowShareManager.show();			
			WindowShareManager.center();
			
		
		}
	,oninvalid:function(Field,msg){
			Ext.getCmp('WindowShareManagerBtnOk').disable();
			
		}

	,onvalid:function(Field,msg){
			
			if(Ext.getCmp('IdShareName').isValid(false) && Ext.getCmp('IdPath').isValid(false)) {
				Ext.getCmp('WindowShareManagerBtnOk').enable();
			} else {
				Ext.getCmp('WindowShareManagerBtnOk').disable();
			}	
			
		}		
}

