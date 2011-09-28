DialogNewGroup = {};

DialogNewGroup = {
		show:function(data){
		var iscopy = false;

		   if (typeof data == "undefined") {
			data = {
				description:''
			};
		   } else {
			iscopy = true;
		   }

		var oldmemberlist = '';
		
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
			
		   var FormNewGroup = new Ext.FormPanel({
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
							,height: '85%'
							,items: [
								{			
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "idGroupName"
									,name: "name"
									,allowBlank: false
									,fieldLabel: lang.dialog.name
									,width: '95%'
								},{			
									xtype: "textfield"
									,labelAlign: 'left'
									,id: "idDescription"
									,name: "description"
									,value:data.description
									//,allowBlank: false
									,fieldLabel: lang.dialog.description
									,width: '95%'
								},{
									xtype: 'box'
									,autoEl: {
										tag: 'hr'
									}												
								},Combo,{
									xtype: 'box'
									,autoEl: {
										//tag: 'select'
										//,multiple: 'true'
										//,id: 'memberlist'
										//,name: 'memberlist[]'
										html: '<select name="memberlist[]" id="memberlist" multiple="true" style="width: 100%; height: 150px;"></select>'
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

									}]
                    ,buttons: [{
                        text: lang.create,
                        formBind: true,
                        handler:function(){
							
						
                            memberlist=ExplodeListByComma('memberlist');															
							params={
									account:'a'
									//name:Ext.getCmp("idGroupName").getValue()
									//,description:Ext.getCmp("idDescription").getValue()
									,memberlist:memberlist
									//,iscopy:iscopy
							}
															
							/*if(iscopy){
								if(memberlist.trim()!=''){
									memberlist = memberlist.split(",");
								} else {
									memberlist = Array();
								}
								for (j in data.memberlist) {
									
									if(typeof(data.memberlist[j])=='object'){
										memberlist.push(data.memberlist[j].rid);	
									} 
								}


								params.memberlist=memberlist.toString();
								params.oldmemberlist='';
								
								params.iscopy=true;
							}*/

							
							
							SendForm(FormNewGroup,WindowNewGroup,'Group/AddGroup',params)
							
						
                        }
                    }, {

                        text: lang.close,

                        handler: function () {

                            WindowNewGroup.close();

                        }

                    }]
			}]});


		var WindowNewGroup = new Ext.Window({
                	title: lang.NewGroup
			,modal:true
			,width:380
		    	,height:365
                    	,labelWidth: 75
                    	,frame: true
                    	,bodyStyle: 'padding:5px 5px 5px 5px'
                    	,layout: 'form'
                    	,items: [FormNewGroup]
		});


			WindowNewGroup.on('render',function(w){
				setTimeout("ComboStore.load();",200);			
			});
			
			WindowNewGroup.on('beforeclose',function(w){
				MainAppW.MemberOfStore.load();
			});
						
			WindowNewGroup.show();			
			WindowNewGroup.center();
			
			var myMask = new Ext.LoadMask(WindowNewGroup.getEl());		
			
			//top.render(WindowNewGroup);
			ComboStore.on('load', function(Store,records,options){
						myMask.hide();
						//console.dir(records);
			});			
			
			ComboStore.on('beforeload', function(Store,options){
						myMask.show();
			});	
		
		}
}