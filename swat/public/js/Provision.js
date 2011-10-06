DialogProvisionWizard = {};

DialogProvisionWizard = {	
	show:function(){
	
		Ext.QuickTips.init();
		Ext.form.Field.prototype.msgTarget = 'side';
    	
    	
		Ext.apply(Ext.form.VTypes,{
			password: function(val, field){
				var AdminPass1 = Ext.getCmp('IdPass1');
				var AdminPass2 = Ext.getCmp('IdPass2');
				
				if(AdminPass2.getValue()!=AdminPass1.getValue()){
					AdminPass2.invalidText=lang.PasswordsNotMatch;
					AdminPass2.markInvalid();
					return false;
				} else if(AdminPass2.getStrength()<70){
					AdminPass2.invalidText=lang.PasswordStrength;
					AdminPass2.markInvalid();
					return false;
				} else {
					return true;
				}
			}
			//,passwordText: 'You are underage!', //mensaje de error
			//,passwordMask: /\.*/  //regexp para filtrar los caracteres permitidos
		});
    	
		var StoreServerRole = new Ext.data.ArrayStore({
				id: 0,
				fields: [
							'Id',
							'displayText'
				],
				data: [
						 [1, 'Domain controller']
						,[2, 'Member server']
						,[3, 'Standalone']
					]
			});
		
		var StoreFunctionLevel = new Ext.data.ArrayStore({
				id: 0,
				fields: [
							'Id',
							'displayText'
				],
				data: [
						[1, '2000']
						,[2, '2003']
						,[3, '2008']
						,[4, '2008_R2']
					]
			});	
			
		//Label Type the full DNS name for the new domain
		//(for example:samdom.example.com)
		
		var Realm = new Ext.form.TextField({
				fieldLabel:'Full DNS name for the new domain'
				,width: '85%'
				,allowBlank: false
				,regex:/([a-z]+([0-9]+)?\.([a-z]+([0-9]+)?))/
				,name:'Realm'
				,emptyText:'sample samdom.example.com'
				,id:"IdRealm"
			}); 
			
		if(Ext.ux.swat.Config.Realm.trim()!=''){
			Realm.setValue(Ext.ux.swat.Config.Realm);
		}
		
		

		var Domain = new Ext.form.TextField({
				fieldLabel:'Domain NetBIOS name'
				,width: '85%'
				,allowBlank: false
				,name:'Domain'
				,maxLength:15
				,regex:/[A-Z]+([0-9]+)?/
				,maskRe:/[A-Z0-9]+/
				,emptyText:'sample SAMDOM'
				,id:"IdDomain"
			}); 

		if(Ext.ux.swat.Config.Realm.trim()!=''){
			Domain.setValue(Ext.ux.swat.Config.WorkGroup);
		}
		
		Domain.on('focus',function(field){
			if(Realm.isValid(false)){
				var NetBiosName =  Realm.getValue().split('.')[0].toUpperCase();
				field.setValue(NetBiosName);
			}
		});			

		var ServerRole = new Ext.form.ComboBox({
			//url: '',
			name:'ServerRole',
			readOnly:true
			,typeAhead: true
			,fieldLabel:'Server role'
			,width: '85%'
			,triggerAction: 'all'
			,emptyText:'Seleccione Uno'
			,lazyRender:true
			,mode: 'local'
			,allowBlank: false
			,store: StoreServerRole
			,valueField: 'Id'
			,displayField: 'displayText'
			,listeners   : {  
				beforerender: function(combo){  
					combo.setValue(1);
				}
			}				
		});
		
		var FunctionLevel = new Ext.form.ComboBox({
			//url: '',
			name:'FunctionLevel',
			readOnly:true
			,typeAhead: true
			,fieldLabel:'Functional level'
			,width: '85%'
			,triggerAction: 'all'
			,emptyText:'Seleccione Uno'
			,lazyRender:true
			,mode: 'local'
			,allowBlank: false
			,store: StoreFunctionLevel
			,valueField: 'Id'
			,displayField: 'displayText'
			,listeners   : {  
				beforerender: function(combo){  
					combo.setValue(2);
				}
			}			
		});	


	/*--------------------------Form2----------------------*/
		
		var StoreSamdbFill = new Ext.data.ArrayStore({
				id: 0,
				fields: [
							'Id',
							'displayText'
				],
				data: [
						 [1, 'full']
						,[2, 'blank']
						,[3, 'partitions-only']
					]
			});

		var StoreUseXattrs = new Ext.data.ArrayStore({
				id: 0,
				fields: [
							'Id',
							'displayText'
				],
				data: [
						 [1, 'auto']
						,[2, 'yes']
						,[3, 'no']
					]
			});

		var SamdbFill = new Ext.form.ComboBox({
			//url: '',
			name:'SamdbFill',
			readOnly:true
			,typeAhead: true
			,fieldLabel:'Samdb operation'
			,width: '85%'
			,triggerAction: 'all'
			,emptyText:'Seleccione Uno'
			,lazyRender:true
			,mode: 'local'
			,allowBlank: false
			,store: StoreSamdbFill
			,valueField: 'Id'
			,displayField: 'displayText'
			,listeners   : {  
				beforerender: function(combo){  
					combo.setValue(1);
				}
			}			
		});	


		var UseXattrs = new Ext.form.ComboBox({
			//url: '',
			name:'UseXattrs',
			readOnly:true
			,typeAhead: true
			,fieldLabel:'Use extended file attributes'
			,width: '85%'
			,triggerAction: 'all'
			,emptyText:'Seleccione Uno'
			,lazyRender:true
			,mode: 'local'
			,allowBlank: false
			,store: StoreUseXattrs
			,valueField: 'Id'
			,displayField: 'displayText'
			,listeners   : {  
				beforerender: function(combo){  
					combo.setValue(1);
				}
			}			
		});	



	/*--------------------------Form3----------------------*/	
		
		//AdminPass
		 
		var AdminPass1 = new Ext.form.TextField({
				id:"IdPass1"
				,width: '85%'
				,allowBlank: false
				//,vtype:'password'
				,inputType: 'password'
				,name:'AdminPass1'
				//,value:''
				,fieldLabel: lang.dialog.password
			}); 


		var AdminPass2 = new Ext.ux.PasswordMeter({
				id:"IdPass2"
				,width: '85%'
				,allowBlank: false
				,vtype:'password'
				,inputType: 'password'
				,name:'AdminPass2'
				//,value:''
				,fieldLabel: lang.dialog.password
			}); 


		//AdminPass1.on('valid',this.OnValidatePassword);
		//AdminPass2.on('valid',this.OnValidatePassword);

	/*--------------------------Form4----------------------*/	
		DialogProvisionWizard.ProgressBar1 = new Ext.ProgressBar({
					   id:'IdProgressBar1'
					   ,fieldLabel:'Progress'
					   //,text:'Progress'
					   //,value:20
					   //,height:50
		});
		
			DialogProvisionWizard.HideFieldValidator = new Ext.form.TextField({
				name: 'HideFieldValidator'
				,id: 'IdHideFieldValidator'
				,hidden:true
				,regex:/[0-9]+/
				//,value:'aaaa'
			});
			
			//markInvalid( [String msg] )

			var statusPanel = new Ext.Panel({
				autoHeight : true,
				id:'IdStatusPanel',
				border : false,
				height: 400,
				//collapsed : true,
				frame:true,
				bodyStyle : {
					//marginTop : 40
				},
				items : [
					DialogProvisionWizard.ProgressBar1
					,DialogProvisionWizard.HideFieldValidator
					,{
							html:'<br>'
					}					
					/*,{
							html:'<br><textarea id="IdOutput" style="overflow: scroll;height:90%;width:100%;padding-left:10px;"></textarea>'
					}*/
					,{
					  id:"IdOutput",
					  xtype: 'textarea',
					  name: 'Output',
					  hidden: true,
					  hideLabel: true,
					  labelSeparator: '',
					  height: '100%',
					  width: '98%'
						  
					}
				]
			});				
			
		
		var wizard = new Ext.ux.Wiz({
		
			
			title : lang.DomainWizzard
			,closable:false
			,scope    : this		
			,headerConfig : {
				title : lang.DomainConfig    
			},
			
			cardPanelConfig : {
				defaults : {
					//baseCls    : 'x-small-editor'
					bodyStyle  : 'padding:20px 15px 5px 10px;background-color:#F6F6F6;'
					,border     : false    
					//,labelWidth: 80  
				}
			},   
			cards : [
			
				// first card with welcome message
				new Ext.ux.Wiz.Card({
					id:'form1'
					//,title : 'Informaci&oacute;n del Usuario'
					,monitorValid : true
					,defaults     : {
						labelStyle : 'font-size:11px'
					}              
					,items : [
						Realm
						,Domain
						,ServerRole
						,FunctionLevel
					]    
				})
				
				// second card with input fields last/firstname
			   ,new Ext.ux.Wiz.Card({
					id:'form2'
					//,title        : 'Datos del Servicio'
					,monitorValid : true
					,defaults     : {
						labelStyle : 'font-size:11px'
					}
					,items : [			
								SamdbFill
								,UseXattrs
						 ]    
				})
				
				// third card with input field email-address
				,new Ext.ux.Wiz.Card({
					id:'form3'
					//,title        : 'Informaci&oacute;n Personal',
					,monitorValid : true
					,defaults     : {
						labelStyle : 'font-size:11px'
					}
					,items : [
								AdminPass1
								,AdminPass2
					]
				    
				})          

				// fourth card with finish-message
				,new Ext.ux.Wiz.Card({
					title        : 'Finished!',
					monitorValid : true,
					items : [
						statusPanel
					]  
					
				})
			
			
			]
		});
		
		 wizard.on('cancel',this.OnCloseWindows);
		 wizard.on('close',this.OnCancel);	
		 
		 
		 
		/*wizard.on('finish',function(){
			DialogProvisionWizard.OnFinish();
		});*/
	
		wizard.on('finish',DialogProvisionWizard.OnFinish);
		//wizard.on('show',);
		// show the wizard
		wizard.show();
		
		Ext.getCmp('IdNextButton').on('click',function(){
			if(wizard.currentCard == 1) {
				//Ext.getCmp('IdCancelButton').setDisabled(true);
			}
					
			if(wizard.currentCard == 2) {
	
				//var t=setTimeout("alert('I am displayed after 3 seconds!')",3000)		
				var t=setTimeout("DialogProvisionWizard.Reconfigure()",100)		
			}
			
			if(wizard.currentCard == 3){
				Ext.getCmp('IdCancelButton').hide();
				Ext.getCmp('IdPreviousButton').hide();
			} /*else {
				Ext.getCmp('IdCancelButton').show();
			}*/

			if(wizard.currentCard == 3 && DialogProvisionWizard.CanClose==true){
				 DialogProvisionWizard.OnCloseWindows();
			}
			//console.log(wizard.currentCard);
		});
		
		var warning = true;
		window.onbeforeunload = function() { 
		  if (warning) {
			return lang.UnLoadText;
		  }
		}

		
		//
	}
	
	,OnCloseWindows:function(obj){
		if(DialogProvisionWizard.CanClose==true){
			window.onbeforeunload = null;
			Ext.Ajax.request({
				url: 'Login/logout',
				method : 'POST', 
				success: function(response, opts) {
					location.href='/';
				}
			});  
		}    
	}
	
	,OnCancel:function(obj){
		window.onbeforeunload = null;
		location.href = '/';
	}
	
	,OnFinish:function(wizard,data){
					DialogProvisionWizard.CanClose=false;
					DialogProvisionWizard.started =false;
					//console.dir(data);
					params = {
							 Realm:data.form1.Realm.toLowerCase()
							,Domain:data.form1.Domain
							,ServerRole:data.form1.ServerRole.toLowerCase()
							,FunctionLevel:data.form1.FunctionLevel
							,SamdbFill:data.form2.SamdbFill
							,UseXattrs:data.form2.UseXattrs
							,AdminPass:data.form3.AdminPass1
					}
					var url = '';
					var maxelements = params.length;
					

					for(i in params){
						url += i + '=' + params[i] + '&'
					}

					DialogProvisionWizard.WaitOutput(url,DialogProvisionWizard.ProgressBar1);
					DialogProvisionWizard.HideFieldValidator.setValue('AAA');

	}



	,WaitOutput	:function(data,ProgressBar){

		var eventSrc  = new EventSource('Provision/start?'+data);
		
		ProgressBar.wait({
		   interval: 500
		   ,increment: 10
		   ,text: lang.DomainConfiguring 
		   ,animate    :true
		});			
		eventSrc.addEventListener('open', function (event) {
			if(DialogProvisionWizard.started==false){
				DialogProvisionWizard.started = true;
			} else {
				ProgressBar.reset()
				ProgressBar.hide();
				DialogProvisionWizard.HideFieldValidator.setValue('00');
				DialogProvisionWizard.CanClose=true
				Ext.getCmp('IdOutput').show();
				eventSrc.close();
			}
		});
	  
		eventSrc.addEventListener('message', function (event) {
			//console.log("RECEIVED");
			append('IdOutput',event.data);
			ProgressBar.updateText(event.data);
		});
		
		function append(id,data){
			//elemento1 = document.createElement('p');
			//elemento1.innerHTML = '<b>'+data+'</b>';
			text = document.getElementById(id);
			//text.appendChild(elemento1);		
			text.value += data + '\n';
			text.scrollTop = text.scrollHeight;
		}	
	
	}
	
	,OnValidatePassword:function(field){
		
	}
	
	,Reconfigure:function(sender){
		
		Ext.DomHelper.applyStyles('IdStatusPanel',{  
			'width':'100%'  
			,'height':'225px'  
		});  

		Ext.DomHelper.applyStyles('IdOutput',{  
						'height':'200px'  
		}); 
	}
}	

Ext.onReady(DialogProvisionWizard.show,DialogProvisionWizard); 