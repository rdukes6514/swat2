DialogNewUser = {};

DialogNewUser = {
		show:function(data){
		var iscopy = false;

		   if (typeof data == "undefined") {
			data = {
				fullname:''
				,description:''
				,changepassword:true
				,cannotchangepassword:false
				,passwordexpires:false
				,disable:false
			};
		   } else {
			iscopy = true;
		   }



			
		   var FormNewUser = new Ext.FormPanel({
				labelWidth: 75
				,labelAlign: 'left'
				,frame:true
				//,title: 'Restablecer contrase&ntilde;a'
				//,bodyStyle:'padding:5px 5px 0'
                		,bodyStyle: 'x-window-body'
                		,border: false
				,monitorValid:true
				,items: [{
							layout: 'form'
							,items: [
								{			
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "idUsername"
									,name: "username"
									,allowBlank: false
									,fieldLabel: "<b>Username</b>"
									,width: '95%'
								},{			
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "idFullname"
									,name: "fullname"
									,value:data.fullname
									//,allowBlank: false
									,fieldLabel: "<b>Fullname</b>"
									,width: '95%'
								},{			
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "idDescription"
									,name: "description"
									,value:data.description
									//,allowBlank: false
									,fieldLabel: "<b>Description</b>"
									,width: '95%'
								},{
									xtype: 'box'
									,autoEl: {
										tag: 'hr'
									}												
								},{			
									xtype: "textfield"
									,labelAlign: 'left'
									,inputType: 'password'
									,id: "idpass1"
									,name: "pass1"
									,allowBlank: false
									,fieldLabel: "<b>Password</b>"
									,width: '95%'
								},{
									xtype: "PasswordMeter"
									,labelAlign: 'left'
									,id: "idpass2"
									,name: "pass2"
									,inputType: 'password'
									,fieldLabel: "<b>Password</b>"
									,allowBlank: false
									,width: '95%'
								},{
									xtype:'checkbox'
									,hideLabel:true
									,fieldLabel: ''
									,id:'IdForcePasswordChange'
									,boxLabel: 'The user must change the password'
									,name: 'changepassword'
									,checked : data.changepassword
									//,height: 30
									,handler:function(checkbox,checked){
										if(checked){
											Ext.getCmp('IdPasswordExpires').disable();
											Ext.getCmp('IdCannotChangePassword').disable();											
										} else {
											Ext.getCmp('IdPasswordExpires').enable();
											Ext.getCmp('IdCannotChangePassword').enable();
										}
									}	
								},{
									xtype:'checkbox'
									,hideLabel:true
									,disabled:data.changepassword
									,fieldLabel: ''
									,id:'IdCannotChangePassword'
									,boxLabel: 'Cannot Change Password'
									,name: 'cannotchangepassword'
									,value:data.cannotchangepassword
									//,checked : true
									//,height: 30
									,handler:function(checkbox,checked){
										if(checked){
												Ext.getCmp('IdForcePasswordChange').disable();
										} else {
											if(Ext.getCmp('IdPasswordExpires').getValue()==false){
												Ext.getCmp('IdForcePasswordChange').enable();
											}
										}
									}
								},{
									xtype:'checkbox'
									,hideLabel:true
									,disabled:data.changepassword
									,fieldLabel: ''
									,id:'IdPasswordExpires'
									,boxLabel: 'Password never expires'
									,name: 'passwordexpires'
									,checked:data.passwordexpires
									//,checked : true
									//,height: 30
									,handler:function(checkbox,checked){
										if(checked){
												Ext.getCmp('IdForcePasswordChange').disable();
										} else {
											if(Ext.getCmp('IdCannotChangePassword').getValue()==false){
												Ext.getCmp('IdForcePasswordChange').enable();
											}
										}
									}
								},{
									xtype:'checkbox'
									,hideLabel:true
									,fieldLabel: ''
									,boxLabel: 'Disabled account'
									,name: 'disable'
									,checked:data.disable
									//,checked : true
									//,height: 30
								}			
								]
					}]
                    ,buttons: [{
                        text: 'Create',
                        formBind: true,
                        handler:function(){
							var pass1 =  Ext.getCmp('idpass1').getValue();
							var pass2 =  Ext.getCmp('idpass2').getValue();
							var strength = Ext.getCmp('idpass2').getStrength();

							if (pass1 != pass2){
								Ext.Msg.alert('Error','Las Contrase&ntilde;as no son iguales');
								return;
							}

							if (strength <= 60){
								Ext.Msg.alert('Error','La Contrase&ntilde;a es demasiado d&eacute;bil');
								return;								
							}
							
							params={	
								account:Ext.getCmp('idUsername').getValue()
								,password:pass1
								,iscopy:false
							}
							
							if(iscopy){
								grouplist = Array();
								for (j in data.grouplist) {
									
									if(typeof(data.grouplist[j])=='object'){
										grouplist.push(data.grouplist[j].rid);	
									} 
								}

								params.locked=data.locked;
								params.grouplist=grouplist.toString();
								params.homedir=data.homedir;
								params.logonscript=data.logonscript;
								params.maphomedirdrive=data.maphomedirdrive;
								params.profile=data.profile;
								params.iscopy=true;
							}

							
							
							SendForm(FormNewUser,WindowNewUser,'User/AddUser',params)
						
                        }
                    }, {

                        text: 'Close',

                        handler: function () {

                            WindowNewUser.close();

                        }

                    }]
			});


		var WindowNewUser = new Ext.Window({
                	title: 'New user'
			,modal:true
			,width:380
		    	,height:365
                    	,labelWidth: 75
                    	,frame: true
                    	,bodyStyle: 'padding:5px 5px 5px 5px'
                    	,layout: 'form'
                    	,items: [FormNewUser]
		});


			//top.render(WindowNewUser);
			
			WindowNewUser.show();			
			WindowNewUser.center();
		
		}
}