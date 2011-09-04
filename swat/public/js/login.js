Ext.ux.swat.Config = {}

Ext.ux.swat.Login = Ext.extend(Ext.Window,{
	
	
	initComponent: function()
	{
		Ext.QuickTips.init();
		//this.renderTo = "login";
		this.title = "Login into the Samba Web Administration Tool";
		this.layout = "border";
		this.draggable =false;
		this.closable =false;
		this.resizable =true;
		this.height = 255;
		this.width = 450;
		this.iconCls = "loginWindow";
		this.modal = true;
		this.mainFieldWidth = 310;
		
		this.langCombo = new Ext.form.ComboBox({
			fieldLabel: "Language",
			name: "language",
			store: new Ext.data.SimpleStore({
				fields: ['language'],
				data: ['English', 'Español'],
				expandData: true
			}),
			displayField: 'language',
			value: 'English',
			triggerAction: 'all',
			mode: 'local',
			readOnly: true,
			forceSelection: true,
			width: this.mainFieldWidth
		});
		
		this.userField = new Ext.form.TextField({
			fieldLabel: "Username"
			,name: "username"
			,width: this.mainFieldWidth
			,style: "margin:10px 0px 0px 0px;"
			,labelStyle: "margin: 10px 0px 0px 0px;"
			,allowBlank: false
			
		});
		
		this.pwField = new Ext.form.TextField({
			fieldLabel: "Password"
			,name: "password"
			,inputType: "password"
			,width: this.mainFieldWidth
			,allowBlank: false
		});
		
		this.LoginPanel = new Ext.Panel({
			region: 'north',
			//width:	300,
			//height: 120,
			html: '<center><br/><img src="./images/samba-logo.png" /><br/><br/></center>'
		});
		
		this.LoginForm = new Ext.FormPanel({
			region: 'center'
			,frame: true
			,border: false
			,url: "Login"
			,buttonAlign: "right"
			,monitorValid:true
			,items: [
				this.userField
				,this.pwField
				,this.langCombo
			]
			,buttons:[{
						formBind: true,
						xtype: "tbbutton",
						text: "Login",
						handler: function()
						{
							this.checkLogin();
						},
						scope: this,
						icon: "./images/ok.png",
						cls: "x-btn-text-icon"
			}]
			,keys:({
				  key: Ext.EventObject.ENTER  ,
				  fn: this.checkLogin,
				  scope: this
			})
			

		});
		

		this.items = [this.LoginPanel, this.LoginForm];
		
		//this.buttons = [];
		
		
		Ext.ux.swat.Login.superclass.initComponent.apply(this, arguments);
		
		
	},
	
	disableFields: function(which)
	{
		if(which==true)
		{
			this.userField.setDisabled(true);
			this.pwField.setDisabled(true);
		}
		else
		{
			this.userField.setDisabled(false);
			this.pwField.setDisabled(false);
		}
	},
	
	checkLogin: function()
	{

		this.setDisabled(true);
		
		this.LoginForm.getForm().submit({
			success: function(form, response) {
				//self.location.href = "index.php?lang="+this.langCombo.getValue(); 
									  //var obj = Ext.decode(response.responseText);
									  console.dir(response);
									  if(response.result.success == true){
											location.href='/';
											
											//Config;
											Ext.ux.swat.Config.DnsDomain =   response.result.DnsDomain;
											Ext.ux.swat.Config.RootDSE =   response.result.RootDSE;
											Ext.ux.swat.Config.SambaVersion =   response.result.SambaVersion;
											this.close();
											
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
											this.close();
									  } else {
											//Ext.Msg.alert('Login Failed!', obj.msg); 
											this.setDisabled(false);
											Ext.Msg.show({title: "Error", msg: "Wrong username or password!", buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR });
									  }				
			},
			failure: function(form, response){
				Ext.Msg.show({title: "Error", msg: "Wrong username or password!", buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR });
				this.setDisabled(false);
			},
			scope: this
	    });
		
	}
});

Ext.onReady(function(){
	new Ext.ux.swat.Login().show();
});
