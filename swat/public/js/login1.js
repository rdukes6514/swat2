Ext.ns('login');
Config = {}
login.index = {
	init: function(){
	
	
	
	
		Ext.QuickTips.init();
		
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
										,fieldLabel: "<b>Contrase&ntilde;a</b>"
										,width: '95%'
									},{
										xtype: "PasswordMeter"
										,labelAlign: 'left'
										,id: "idpass2"
										,name: "pass2"
										,inputType: 'password'
										,fieldLabel: "<b>Contrase&ntilde;a</b>"
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
													,boxLabel: 'El usuario debe de cambiar la contrase&ntilde;a en el siguiente inicio de sessi&oacute;n'
													,name: 'ForcePasswordChange'									
													//,height: 30
												},{
													xtype: 'box'
													,id:'AccountStatusLabel'
													
													,autoEl: {
														//tag: 'blockquote'
														html: '<span style="font-size: small">&nbsp;&nbsp;&nbsp;El usuario ha de cerrar la sessi&oacute;n y volver a abrirla para que los cambios<br>&nbsp;&nbsp; tengan efecto.<br><br></span>'
													}												
												},{
													xtype: 'box'
													,autoEl: {
														tag: 'blockquote'
														,html: '<span style="font-size: small">Estado del bloqueo de cuenta en este controlador de dominio:</span>'
													}												
												},{
													xtype:'checkbox'
													,fieldLabel: ''
													,boxLabel: 'Desbloquear la cuenta de usuario'
													,name: 'UnlockUserAccount'									
												}]									
									}]
					}]
                    ,buttons: [{
                        text: 'Guardar',
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
								dn:dn
								,account:account
								,password:pass1
							}	
							//SendForm(FormResetPass,WindowResetPass,'User/SetPassword',params,true,false)
						
                        }
                    }]
			});

			

			var WindowResetPass = new Ext.Window({
                    title: 'Restablecer contrase&ntilde;a'
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
		
		var UserTextField = new Ext.form.TextField({
			fieldLabel:'Username',
			type:'textfield',
			name:'cmb-Tpl',
			allowBlank: false,
			emptyText:'Usuario...',
			triggerAction: 'all',
			displayField:'name'
		});
		
		var passw = new Ext.form.TextField({
			fieldLabel: 'Password',
			name: 'passw',
			id:'passw',
			//width:164,
			inputType: 'password',
			allowBlank: false,
			//blankText:'Este campo es obligatorio.',
			enableKeyEvents  : true,
/*			keypress: function(e, el) {
				var charCode = e.getCharCode();
				Ext.Msg.alert(charCode);
			}
*/			
                     listeners:   
                     {  
                         keypress: function(t,e)  
                         {  
                             if(e.getKey() == 13)  
                             {  
                                // Ext.get('server').focus(); 
                                //Ext.Msg.alert(e.getKey()); 
                                Enviar();
                             }  
                         }  
                     } 


		});
		
 
		
		
		var win=new Ext.Window({
			title: 'Login into the Samba Web Administration Tool',
			bodyStyle:'padding: 10px',		//alejamos los componentes de los bordes
			//width:320,
			//height:160,
			layout:'form',
			items: [UserTextField,passw],			
	    	 buttons: [{
				text: 'Login',
				handler:Enviar
			}] 
		});
		//Ext.MessageBox.wait('Cargando  Aplicación ...');
		
		win.show();

		function Enviar(){
				Ext.Ajax.request({
									url:"Login",
									params:{user:UserTextField.getValue(),password:passw.getValue()},
									/*callback:function(a,b,c){	
											if (c.responseText != 'OK'){
											Ext.Msg.alert('Login Failed',c.responseText);							
		//									alert(c.responseText);
											}else{
											var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando   ..."});
											myMask.show();
											document.location.href="index.php";
											}
									
								}*/
								   success: function(response, opts) {
									  var obj = Ext.decode(response.responseText);
									  if(obj.success == true){

											//Config;
											Config.DnsDomain =   obj.DnsDomain;
											Config.RootDSE =   obj.RootDSE;
											win.close();
											
											//Plugins
											loadjscssfile("./jslibs/RowEditor.js");
											loadjscssfile("./jslibs/CheckColumn.js");
											loadjscssfile("./jslibs/PasswordMeter.js");
											loadjscssfile("./jslibs/Ext.ux.grid.Search.js");

											//Wizard
											loadjscssfile("./jslibs/wizard/CardLayout.js");
											loadjscssfile("./jslibs/wizard/Wizard.js");
											loadjscssfile("./jslibs/wizard/Header.js");
											loadjscssfile("./jslibs/wizard/Card.js");		
											
											//Samba Flags
											loadjscssfile('js/flags.js');
											
											//Dialogs
											loadjscssfile("./js/Dialogs/SendDialog.js"); 											
											loadjscssfile("./js/Dialogs/DialogResetPass.js"); 											
											
											//Menus
											//loadjscssfile('js/ContexMenu.js');
											loadjscssfile('js/ContexMenu.js');
											
											//Controllers
											loadjscssfile('js/UserController.js');
											
											
											//Base App
											loadjscssfile('js/application.js');
											
									  } else {
											Ext.Msg.alert('Login Failed!', obj.msg); 
											 
									  }
									  
								   },
								   failure: function(response, opts) {
									  //console.log('server-side failure with status code ' + response.status);
								   }								
								
								
				});
		
		};
		
	}	
}

Ext.onReady(login.index.init);
