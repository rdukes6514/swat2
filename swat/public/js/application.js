MainAppW=null;

Ext.ux.swat.MainWindowApp = Ext.extend(Ext.Window,{
	
	
	initComponent: function()
	{
		Ext.QuickTips.init();
		AppContexMenu.init();
		
		//this.renderTo = "login";
		this.title = 'Samba version '+Ext.ux.swat.Config.SambaVersion;
		this.layout = "border";
		this.draggable =false;
		this.closable =true;
		this.resizable =true;
		this.maximizable=true;
		this.height = 400;
		this.width = 800;
		this.iconCls = "MainWindow";
		this.modal = false;
		 
		
		//this.tbar=Ext.Toolbar();
		//this.mainFieldWidth = 310;
		
		
		this.LogoPanel = new Ext.Panel({
			region: 'north',
			//width:	300,
			//height: 120,
			html: '<center><br/><img src="./images/samba-logo.png" /><br/><br/></center>'
		});
		


		this.TreePanelBrowser = new Ext.tree.TreePanel({
				id: 'Browser/TreePanelBrowser'
		,width: 200
		,collapsible: true			
		,animate:true
		,region: 'west'
				//,border: false 
				,autoScroll:true
				//rootVisible:false,  
				,root: this.getTreeData()  
		});
        

				
		this.UserStore = new Ext.data.JsonStore({
		url: 'User'
		,root: 'Nodos'
		//,remoteSort:true
		,paramNames:{
			start : 'start'  // The parameter name which specifies the start row
			,limit : 'limit'  // The parameter name which specifies number of rows to return
			,sort : 'sort'    // The parameter name which specifies the column to sort on
			,dir : 'dir'       // The parameter name which specifies the sort direction
		}	
		,fields: [  
							'username'
							,'fullname'
							,'description'
							,'rid'
							,'changepassword'
							,'cannotchangepassword'
							,'passwordexpires'
							,'disable'
							,'locked'
							//,'grouplist'
							,'profile'
							,'logonscript'
							,'homedir'
							,'maphomedirdrive'
							,'icon'
							,'type'
						]
		});



		this.GroupStore = new Ext.data.JsonStore({
		url: 'Group'
		,root: 'Nodos'
		,paramNames:{
			start : 'start'  // The parameter name which specifies the start row
			,limit : 'limit'  // The parameter name which specifies number of rows to return
			,sort : 'sort'    // The parameter name which specifies the column to sort on
			,dir : 'dir'       // The parameter name which specifies the sort direction
		}		
		,fields: [  
						'name','description','rid'
						,'icon','type'
						]
		});
		//this.GroupStore.load();
		
		this.ShareStore = new Ext.data.JsonStore({
		url: 'Share'
		,root: 'Nodos'
		,paramNames:{
			start : 'start'  // The parameter name which specifies the start row
			,limit : 'limit'  // The parameter name which specifies number of rows to return
			,sort : 'sort'    // The parameter name which specifies the column to sort on
			,dir : 'dir'       // The parameter name which specifies the sort direction
		}		
		,fields: [  'comment','name','type'
					,'current_users','max_users','password'
					,'path','permissions','sd_buf'
					,'icon','type'
				]
		});        
                
		this.MemberOfStore = new Ext.data.JsonStore({
		url: 'Group/ListAll',
		root: 'Nodos',
		fields: [  
						'name','rid','type'
				]
		});		
		this.MemberOfStore.load();
		        
        var NameEditor = new Ext.form.TextField({allowBlank: false,name:'newusername'});
        
		/*NameEditor.on('change',function(UidEditor,newValue, oldValue){
					//oldusername = oldValue;
					console.log(newValue);
		});*/	
                
		this.UserColumnModel = new Ext.grid.ColumnModel([
			 new Ext.grid.RowNumberer(), new Ext.grid.CheckboxSelectionModel(),
			{
				header: 'Uid'
				,dataIndex: 'rid'
				,sortable: true
				,width: 50
				,editor : new Ext.form.TextField({readOnly:true})
			},{
				header: lang.username,
				renderer: function (value, metaData, record, rowIndex, colIndex, store) {
				//alert(record.data.icon);
				metaData.css = 'usuario';
				if (record.data.icon != '') {
					metaData.css = record.data.icon;
				}
				// metaData.value = 'ceo-icon';
				return '&nbsp;&nbsp;&nbsp;&nbsp;' + value + String.format('<img class="padding-img" src="{0}"/>', Ext.BLANK_IMAGE_URL);
				
				}
				,dataIndex: 'username'
				,sortable: true
				,width: 200
				,editor : NameEditor
			},{
				header: lang.description
				,dataIndex: 'description'
				,sortable: true
				,width: 600
				,editor : new Ext.form.TextField({name:'description'})
			}
            	]);        
            

		this.GroupColumnModel = new Ext.grid.ColumnModel([
		 new Ext.grid.RowNumberer(), new Ext.grid.CheckboxSelectionModel(),
			{
				header: 'Gid'
				,dataIndex: 'rid'
				,sortable: true
				,width: 50
				,editor : new Ext.form.TextField({readOnly:true})
			},{
				header: lang.name,
				renderer: function (value, metaData, record, rowIndex, colIndex, store) {
				//alert(record.data.icon);
				metaData.css = 'group-icon';
				if (record.data.icon != '') {
					metaData.css = record.data.icon;
				}
				return '&nbsp;&nbsp;&nbsp;&nbsp;' + value + String.format('<img class="padding-img" src="{0}"/>', Ext.BLANK_IMAGE_URL);
				
				}
				,dataIndex: 'name'
				,sortable: true
				,width: 200
				,editor : new Ext.form.TextField({allowBlank: false,name:'newname'})
			},{
				header: lang.description
				,dataIndex: 'description'
				,sortable: true
				,width: 600
				,editor : new Ext.form.TextField({name:'description'})
			}
            	]); 
            
		this.ShareColumnModel = new Ext.grid.ColumnModel([
		 	new Ext.grid.RowNumberer(), new Ext.grid.CheckboxSelectionModel(),
			{
				header: lang.name,
				renderer: function (value, metaData, record, rowIndex, colIndex, store) {
				//alert(record.data.icon);
				metaData.css = 'HD-icon';
				if (record.data.icon != '') {
					metaData.css = record.data.icon;
				}
				
				// metaData.value = 'ceo-icon';
				return '&nbsp;&nbsp;&nbsp;&nbsp;' + value + String.format('<img class="padding-img" src="{0}"/>', Ext.BLANK_IMAGE_URL);
				
				}
				,dataIndex: 'name'
				,sortable: true
				,width: 100
				,editor : new Ext.form.TextField({allowBlank: false,name:'newsharename'})
			},{
				header: lang.path
				,dataIndex: 'path'
				,sortable: true
				,width: 400
				,editor : new Ext.form.TextField({allowBlank: false,name:'path'})
			},{
				header: lang.comment
				,dataIndex: 'comment'
				,sortable: true
				,width: 600
				,editor : new Ext.form.TextField({name:'comment'})
			}
           	]); 

		this.RowEditor = new Ext.ux.grid.RowEditor({
			saveText: lang.update,
			cancelText: lang.cancel,
			clicksToEdit: 2,
			id: 'idRowEditor'
		});
		
		this.SearchBox = new Ext.ux.grid.Search({
			iconCls:'icon-zoom',
			align:'left',
			searchText:lang.search,
			minChars:3,
			autoFocus:false,
			iconCls: 'search',
			menuStyle:'radio'
		});


		this.GridObjectBrowser = new Ext.grid.EditorGridPanel({
			id: 'GridObjectBrowser'
			,region: 'center'
			,store: this.UserStore 
			,loadMask:true
			//,enableDragDrop: true
			// ,loadMask : Mascara,
			,plugins : [this.RowEditor,this.SearchBox]
			,sm:new Ext.grid.CheckboxSelectionModel()
			,cm:this.UserColumnModel
			,bbar: new Ext.PagingToolbar({
		
				displayInfo: true,
				displayMsg: lang.bbar.displayMsg,
				//emptyMsg: "No hay elementos",
				store: this.UserStore,
				pageSize: 18,
		
			}),
			border: false,
			stripeRows: true,
		}); 
               				
		//this.UserStore.load();
		
		
		
		
		
		var MainContainer = new Ext.Panel({
			id: 'MainContainer',
			// width : 425,
			// height : 250,
			collapsible: true,
			layout: 'fit',
			region: 'center',
			// title : 'Simple ListView <i>(0 items selected)</i>',
			items: this.GridObjectBrowser
		});
        
		//this.items = [this.LogoPanel,this.TreePanelBrowser,MainContainer];
		this.items = [this.TreePanelBrowser,MainContainer];
		
		//events 
		//this.GridObjectBrowser.addListener('cellcontextmenu',this.GridObjectBrowserOnCellContextMenu);
		this.GridObjectBrowser.addListener('rowcontextmenu',this.GridObjectBrowserOnRowContextMenu);
		this.on('close',this.OnCloseWindows);		
		this.RowEditor.on("afteredit",this.OnRowEditorAfterEdit);
		
		Ext.ux.swat.MainWindowApp.superclass.initComponent.apply(this, arguments);

		
		this.AddGroupBtn= {
			text: lang.NewGroup
			,iconCls: 'add'
			,handler: function () {
			       GroupController.NewGroup();
			}			
		};
			
		this.DomainWizzardBtn= {
			id:'IdDomainWizzardBtn'
			,text: lang.DomainWizzard
			,iconCls: 'add'
			,handler: function () {
				   location.href = '/Provision'
			}
		};
			
		this.AddShareBtn= {
			text: lang.AddShare
			,iconCls: 'add'
			,handler: function () {
				   ShareController.NewShare();
			}
		};
		
		this.AddUserBtn= {
			text: lang.NewUser
			,iconCls: 'add'
			,handler: function () {
			       UserController.NewUser();
			}
		};	

		this.DeleteUserBtn= {
			text: lang.remove
			,iconCls: 'add'
			,handler: function () {
				UserController.DeleteUserList();
			}
		};

		this.DeleteGroupBtn= {
			text: lang.remove
			,iconCls: 'add'
			,handler: function () {
				GroupController.DeleteGroupList();
			}
		};	

		this.DeleteShareBtn= {
			text: lang.remove
			,iconCls: 'add'
			,handler: function () {
				ShareController.DeleteShareList();
			}
		};		
	},
	getTreeData: function(){
		//here we are going to define the data
		return {
			text: 'Samba '+Ext.ux.swat.Config.SambaVersion
			,iconCls:'server-icon'
			,expanded:true
			,children:[
			{
				text:lang.SystemTools
				,iconCls:'system-icon'
				,expanded:true
				,children:[
				{
					text:lang.ShareManagement
					,iconCls:'share-icon'
					,expanded:true
					//,leaf:true
					,children:[
					{
						text:lang.ShareResources
						,iconCls:'sharefolder-icon'
						,leaf:true
						,listeners: {
								click: function () {
									Ext.getCmp('MainWindowApp').fillToolBarShares();
								}
						}							
					}]
				},{
					text:lang.UsersAndGroups
					,expanded:true
					,iconCls:'users-icon'
					//leaf:true
					,children:[
					{
						text:lang.users
						,iconCls:'user-icon'
						,leaf:true
						,listeners: {
								click: function () {
									Ext.getCmp('MainWindowApp').fillToolBarUsers();
								}
						}							
					},{
						text:lang.groups
						,iconCls:'groups-icon'
						,leaf:true
						,listeners: {
								click: function () {
									Ext.getCmp('MainWindowApp').fillToolBarGroups();
								}
						}									
					}]						
				}
				]
			}
			]
		}
	}
	
	,fillToolBarUsers:function(){
		var tb = this.getTopToolbar();
		tb.removeAll();
		var	btnbar  =[this.AddUserBtn,this.DeleteUserBtn,this.DomainWizzardBtn];
                
		tb.addField(btnbar);
		tb.doLayout();	
		this.CurrentStore=this.UserStore;
		this.CurrentStoreStr='UserStore';
		this.GridObjectBrowser.reconfigure(this.UserStore,this.UserColumnModel);
		this.GridObjectBrowser.getBottomToolbar().bindStore(this.UserStore);
		this.GridObjectBrowser.getStore().reload();

	}	
	
	,fillToolBarShares:function(){
		var tb = this.getTopToolbar();
		tb.removeAll();
		var	btnbar  =[this.AddShareBtn,this.DeleteShareBtn,this.DomainWizzardBtn];
                
		tb.addField(btnbar);
		tb.doLayout();	
		this.CurrentStore=this.ShareStore;
		this.CurrentStoreStr='ShareStore';
		this.GridObjectBrowser.reconfigure(this.ShareStore,this.ShareColumnModel);
		this.GridObjectBrowser.getBottomToolbar().bindStore(this.ShareStore);
		this.GridObjectBrowser.getStore().reload();

	}		
	
	,fillToolBarGroups:function(){
		var tb = this.getTopToolbar();
		tb.removeAll();
		var	btnbar  = [this.AddGroupBtn,this.DeleteGroupBtn,this.DomainWizzardBtn];

		tb.addField(btnbar);
		tb.doLayout();	
		this.CurrentStore=this.GroupStore;
		this.CurrentStoreStr='GroupStore';
		this.GridObjectBrowser.reconfigure(this.GroupStore,this.GroupColumnModel);
		this.GridObjectBrowser.getBottomToolbar().bindStore(this.GroupStore);
		this.GridObjectBrowser.getStore().reload();

		


	}
	,GridObjectBrowserOnCellContextMenu:function (obj,rowIndex,cellIndex,e) {


	}
	
	,GridObjectBrowserOnRowContextMenu:function (obj, rowIndex, e) {
			e.stopEvent();

            Ext.getCmp('idRowEditor').stopEditing();
            var coords = e.getXY();
            var row = obj.getStore().getAt(rowIndex);

            

            var sm = obj.getSelectionModel();
            
            if (!sm.isSelected(rowIndex)) {
                sm.selectRow(rowIndex);
                obj.fireEvent('rowclick', obj, rowIndex, e);
            }
            
            AppContexMenu.data = row;
			AppContexMenu.rowIndex=rowIndex;

            
            var type = obj.getStore().getAt(rowIndex).get('type');
            var disable = obj.getStore().getAt(rowIndex).get('disable');
            
            
            
            
            if(type == 'user') {
				
				if(disable){
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuDisableAccount').setText('Enable account');
				} else {
					AppContexMenu.UserContexMenu.items.get('IdUserContexMenuDisableAccount').setText('Disable account');
				}
				
  			    AppContexMenu.UserContexMenu.showAt([coords[0], coords[1]]);	

			} else if(type == 'share'){

	 
				
				AppContexMenu.ShareContexMenu.showAt([coords[0], coords[1]]);
				
				
			} else if (type == 'group'){
				AppContexMenu.GroupContexMenu.showAt([coords[0], coords[1]]);
			}	
			
					
				
	
	}
	
	,OnCloseWindows:function(){
							Ext.Ajax.request({
												url: 'Login/logout',
												method : 'POST', 
												success: function(response, opts) {
													location.href='/';
												}

							}); 
					
	}
	
	,OnRowEditorAfterEdit:function(roweditor, changes, record, rowIndex) {
		if(Ext.getCmp('MainWindowApp').CurrentStoreStr=='UserStore'){
			UserController.SendData('User/UpdateUser',changes);
		} else if (Ext.getCmp('MainWindowApp').CurrentStoreStr=='GroupStore'){
			GroupController.SendData('Group/UpdateGroup',changes);
		} else if(Ext.getCmp('MainWindowApp').CurrentStoreStr=='ShareStore'){
			GroupController.SendData('Share/UpdateShare',changes);
		} 
	}
});

Ext.onReady(function(){
	
	Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip'; 

	 var tb = new Ext.Toolbar({
		items: [
			{
				text: lang.DomainWizzard
			}
		]
	 });
	 
	
	 
	 MainAppW = new Ext.ux.swat.MainWindowApp({tbar:tb,id:'MainWindowApp'});
	 MainAppW.show();
	 MainAppW.maximize();
	 
	 if(Ext.ux.swat.Config.AuthRemote){
		//Ext.getCmp('IdDomainWizzardBtn').disable();
	 }
	 	
	 MainAppW.TreePanelBrowser.getRootNode().expand();
	 MainAppW.fillToolBarUsers();
	 
});
