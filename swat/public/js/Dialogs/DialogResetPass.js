DialogResetPass = {};

DialogResetPass = {
		show:function(account,data){
			
			if(account==null)return;
			if(data==null)return;
			
		   var FormResetPass = new Ext.FormPanel({
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
							,items: [{
										xtype: "textfield"
										,labelAlign: 'left'
										,inputType: 'password'
										,id: "idpass1"
										,name: "pass1"
										,allowBlank: false
										,fieldLabel: lang.dialog.password
										,width: '95%'
									},{
										xtype: "PasswordMeter"
										,labelAlign: 'left'
										,id: "idpass2"
										,name: "pass2"
										,inputType: 'password'
										,fieldLabel: lang.dialog.password
										,allowBlank: false
										,width: '95%'
									},{
										xtype: 'fieldset'
										,title: ''
										,labelAlign: 'top'
										//collapsible: true
										,items: [{
													xtype:'checkbox'
													,fieldLabel: ''
													,boxLabel: lang.ForcePasswordChange
													,name: 'ForcePasswordChange'
													,checked : data.changepassword
													//,height: 30
												},{
													xtype: 'box'
													,id:'AccountStatusLabel'
													
													,autoEl: {
														//tag: 'blockquote'
														html: lang.ResetPasswordInfo1
													}												
												},{
													xtype: 'box'
													,autoEl: {
														tag: 'blockquote'
														,html: lang.ResetPasswordInfo2
													}												
												},{
													xtype:'checkbox'
													,fieldLabel: ''
													,boxLabel: lang.UnlockUserAccount
													,name: 'UnlockUserAccount'									
												}]									
									}]
					}]
                    ,buttons: [{
                        text: lang.save,
                        formBind: true,
                        handler:function(){
							var pass1 =  Ext.getCmp('idpass1').getValue();
							var pass2 =  Ext.getCmp('idpass2').getValue();
							var strength = Ext.getCmp('idpass2').getStrength();

							if (pass1 != pass2){
								Ext.Msg.alert('Error',lang.PasswordsNotMatch );
								return;
							}

							if (strength <= 60){
								Ext.Msg.alert('Error',lang.PasswordStrength);
								return;								
							}
							
							params={
								account:account
								,password:pass1
								,rid:data.rid
							}	
							
							
							SendForm(FormResetPass,WindowResetPass,'User/SetPassword',params)
						
                        }
                    }, {

                        text: lang.cancel,

                        handler: function () {

                            WindowResetPass.close();

                        }

                    }]
			});

			

			var WindowResetPass = new Ext.Window({
                    title: lang.ResetPassword 
                    ,modal:true
                    ,labelWidth: 75
                    ,frame: true
                    ,bodyStyle: 'padding:5px 5px 5px 5px'
                    ,layout: 'form'
                    ,items: [FormResetPass]
			});


			//top.render(WindowResetPass);
			
			WindowResetPass.show();			
			WindowResetPass.center();
		
		}
}