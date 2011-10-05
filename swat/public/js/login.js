Ext.ux.swat.Login = Ext.extend(Ext.Window,{
	
	
	initComponent: function()
	{
		Ext.QuickTips.init();
		//this.renderTo = "login";
		this.title = document.title;
		this.layout = "border";
		this.draggable =false;
		this.closable =false;
		this.resizable =true;
		this.height = 255;
		this.width = 450;
		this.iconCls = "loginWindow";
		this.modal = true;
		this.mainFieldWidth = 310;
		

		
		var LangArray = new Array();
		LangArray.push(new Array('en','English'));
		LangArray.push(new Array('es','Español'));

		this.langDomain = new Ext.form.ComboBox({
			fieldLabel: lang.dialog.domain
			,name: "domain"
			,id: "iddomain"
			,typeAhead:true
			,hiddenName: 'domain'
			,store: DomainArray
			,valueField:'id'
			,displayField: 'domain'
			//,value: 'English'
			,triggerAction: 'all'
			,mode: 'local'
			,readOnly: true
			,forceSelection: true
			,width: this.mainFieldWidth
			,listeners   : {  
				beforerender: function(combo){  
					combo.setValue('WorkGroup');
					//console.log(Ext.ux.swat.Config.language);
				}
			}				
		});
		
		this.langCombo = new Ext.form.ComboBox({
			fieldLabel: lang.dialog.language
			,name: "language"
			,id: "idlanguage"
			,typeAhead:true
			,hiddenName: 'language'
			,store: LangArray
			,valueField:'id'
			,displayField: 'language'
			//,value: 'English'
			,triggerAction: 'all'
			,mode: 'local'
			,readOnly: true
			,forceSelection: true
			,width: this.mainFieldWidth
			,listeners   : {  
				beforerender: function(combo){  
					combo.setValue(Ext.ux.swat.Config.language);
					//console.log(Ext.ux.swat.Config.language);
				}
			}				
		});
		
		temp = {};
		temp.OldSelectValue = '';
		this.langCombo.on('select', function(){
			var SelectValue = this.langCombo.getValue().trim();
			//console.log('1:'+temp.OldSelectValue +' 2:'+SelectValue);
			if(SelectValue!=''){
				document.location='?language='+SelectValue;
			}	
		}, this);

		/*
		this.langCombo.on('change',function(combo, newValue, oldValue){
                    console.log("Old Value: " + oldValue);
                    console.log("New Value: " + newValue);
        });
        
		this.langCombo.on('beforeselect',function (combo,record,index ) {
			temp.OldSelectValue = record.data.field2.trim();
		});*/
		
		
		this.userField = new Ext.form.TextField({
			fieldLabel: lang.dialog.username
			,name: "username"
			,width: this.mainFieldWidth
			,style: "margin:10px 0px 0px 0px;"
			,labelStyle: "margin: 10px 0px 0px 0px;"
			,allowBlank: false
			
		});
		
		this.pwField = new Ext.form.TextField({
			fieldLabel: lang.dialog.password
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
				,this.langDomain
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
									  
									  if(response.result.success == true){
									  
											if(this.langDomain.getValue().trim()=='Local'){
												//alert(this.langDomain.getValue().trim());
												location.href='Provision';
											} else {
												location.href='/';
											}
											

									  } else {
										try{
											Ext.Msg.show({title: "Error", msg: response.result.msg, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR });
										} catch(e) {
											Ext.Msg.show({title: "Error", msg: lang.ServerError, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR });
										}
										this.setDisabled(false);
									  }				
			},
			failure: function(form, response){
				try{
					Ext.Msg.show({title: "Error", msg: response.result.msg, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR });
				} catch(e) {
					Ext.Msg.show({title: "Error", msg: lang.ServerError, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR });
				}
				this.setDisabled(false);
			},
			scope: this
	    });
		
	}
});

//take from extjs/examples/shared/examples.js
Ext.SimpleMsg = function(){
    var msgCt;

    function createBox(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:createBox(title, s)}, true);
            m.slideIn('t').pause(20).ghost("t", {remove:true});
        },

        init : function(){
            /*
            var t = Ext.get('exttheme');
            if(!t){ // run locally?
                return;
            }
            var theme = Cookies.get('exttheme') || 'aero';
            if(theme){
                t.dom.value = theme;
                Ext.getBody().addClass('x-'+theme);
            }
            t.on('change', function(){
                Cookies.set('exttheme', t.getValue());
                setTimeout(function(){
                    window.location.reload();
                }, 250);
            });*/

            var lb = Ext.get('lib-bar');
            if(lb){
                lb.show();
            }
        }
    };
}();

Ext.onReady(function(){

	if(Ext.ux.swat.Config.Realm.trim()=='' && Ext.ux.swat.Config.WorkGroup=='WORKGROUP'){
		Ext.SimpleMsg.msg(lang.information,lang.SetupDomain);
	}
	
	new Ext.ux.swat.Login().show();
});
