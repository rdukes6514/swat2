DialogGroupManager = {};

DialogGroupManager = {
		show:function(data){
			
			if(data==null)return;
			
			
		var oldmemberlist = '';
		

		var description = new Ext.form.TextField({
			xtype: "textfield"
			,labelAlign: 'left'
			,id: "iddescription"
			,value:data.description 
			,name: "description"
			,fieldLabel: lang.dialog.description
			,width: '95%'
		});
			
		
		
		ComboStore = new Ext.data.JsonStore({
		url: 'Group/List',
		root: 'Nodos',
		fields: [  
						'name','rid','type'
				]
		});

		
		

	
		var Combo = new Ext.form.ComboBox({
				xtype: "combo",
				name: "comboGroups",
				id: "idcomboGroups",
				forceSelection: false,
				store: ComboStore,
				//allowBlank: false,
				emptyText: '...',
				triggerAction: 'all',
				mode: 'local',
				displayField: 'name',
				//hiddenName: 'name',
				valueField: 'rid',
				//vtype: 'email',
				fieldLabel: lang.dialog.groups
				//,width: 250
				,anchor: "100%"
		});	
		

	
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
									xtype: "label"
									,html: sprintf('<img width="32" height="32" src="css/icons/user-group32.png"/><b>&nbsp;&nbsp;%s</b><br/><hr/>',data.name.capitalize())
								}
								,description
								,Combo
								,{
									xtype: 'box'
									,autoEl: {
										//tag: 'select'
										//,multiple: 'true'
										//,id: 'memberlist'
										//,name: 'memberlist[]'
										html: '<select name="memberlist[]" id="memberlist" multiple="true" style="width: 100%; height: 112px;"></select>'
										/*,style: {
											width: '95%'
											//,height: '100%'
											,height: 100
										}*/
									}
									,listeners: {
										'render': function () {
															
												//console.dir(data.memberlist);
												for (j in data.memberlist) {
													if(typeof(data.memberlist[j])=='object'){
														appendOptionLast('memberlist', data.memberlist[j].rid,data.memberlist[j].name,data.memberlist[j].type);
														
													}    
												}
												oldmemberlist=ExplodeListByComma('memberlist');
												
										}
													
									}
									,width: '100%'
									,height: '75%'
									},{
										xtype: 'tbbutton',
										text: lang.remove,
										handler: function () {
											removeOptionSelected('memberlist', 1);
										},style: 'float:right;padding-right: 5px;padding-top:2px;'
									},{
										xtype: 'tbbutton',
										text: lang.add,
										handler: function () {
											
											var idcomboGroups = Ext.getCmp('idcomboGroups');

											if (!idcomboGroups) return false;

											
											var texto = '';
											var valor = idcomboGroups.getValue();
											 
															
															
																						
											if (valor.trim != '') {
												var record = idcomboGroups.findRecord(idcomboGroups.valueField, valor);
												if(record){
													//console.dir(record)	;	
													var texto = record.get(idcomboGroups.displayField);					        
													if(texto.trim != ''){
														appendOptionLast('memberlist', valor, texto,record.json.type);
													}
												}
											}
														
												

										}
										,style: 'float:right;padding-right: 5px;padding-top:2px;'

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

			
			var WindowUserManager = new Ext.Window({
			title: sprintf(lang.FormatProperties,data.name.capitalize())
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
							text: lang.save,
							//formBind: true,
							handler:function(){
								
                            
                            	memberlist=ExplodeListByComma('memberlist');															
								params={
										description:description.getValue()
										,memberlist:memberlist
										,oldmemberlist:oldmemberlist
										,rid:data.rid
										,name:data.name
								}
								
								//var form = new Ext.form.FormPanel({id:'idSendForm',url:''});
								 	
								//SendForm(form,WindowUserManager,'User/UpdateUser',params)
								UserController.SendData('Group/UpdateGroup',params,WindowUserManager);
							}
						}, {
							text: lang.cancel,
							handler: function () {
								WindowUserManager.close();
							}
						}
			]			
			});


						
			WindowUserManager.on('render',function(w){
				setTimeout("ComboStore.load();",200);			
			});
			
			WindowUserManager.show();			
			WindowUserManager.center();
			
			var myMask = new Ext.LoadMask(WindowUserManager.getEl());		
			
			//top.render(WindowUserManager);
			ComboStore.on('load', function(Store,records,options){
						myMask.hide();
						//console.dir(records);
			});			
			
			ComboStore.on('beforeload', function(Store,options){
						myMask.show();
			});				
				
			
	
				

				
		
		}
}

