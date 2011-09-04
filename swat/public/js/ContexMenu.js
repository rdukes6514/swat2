AppContexMenu={};
AppContexMenu={
	UserContexMenu : null
	,BuiltinContexMenu : null
	,OUContexMenu : null
	,ContainerContexMenu : null
	,show : false	
	,data : null
	
	,init:function(){
	
            this.UserContexMenu = new Ext.menu.Menu({

                id: 'UserContexMenu'

                ,items: [
							{
								text: 'Copiar ...'


								,handler: this.OnContexMenuCopyClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Agregar a un grupo'


								,handler: this.OnContexMenuAddUserClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Deshabilitar cuenta'
								,id:'IdUserContexMenuDisableAccount'

								,handler: this.OnUserContexMenuDisableAccountClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Restablecer contrase&ntilde;a'


								,handler: this.OnUserContexMenuResetPassClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Eliminar'
								,id:'IdUserContexMenuDelete'

								,handler: this.OnContexMenuDeleteClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Cambiar nombre'
								,id:'IdUserContexMenuChangeName'

								,handler: this.OnContexMenuRenameClick

								//,iconCls: 'edit_user'

							}, '-', {

								text: 'Propiedades'


								,handler: this.OnUserContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });   
            
            
            
            this.ShareContexMenu = new Ext.menu.Menu({

                id: 'ContainerContexMenu',

                items: [
                
							{
								text: 'Delegar control'
								,handler: this.OnContexMenuDelegateControlClick
							},{
								text: 'Mover...'
								,id:'IdContainerContexMenuMove'

								,handler: this.OnContexMenuMoveClick

								//,iconCls: 'edit_user'

							},{
								text: 'Buscar'

								,handler: this.OnContexMenuSearchClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Eliminar'
								,id:'IdContainerContexMenuDelete'

								,handler: this.OnContexMenuDeleteClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Cambiar nombre'
								,id:'IdContainerContexMenuChangeName'

								,handler: this.OnContexMenuRenameClick

								//,iconCls: 'edit_user'

							}, {

								text: 'Actualizar'

								,handler: this.OnContexMenuUpdateClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Propiedades'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            });  
            
            
            this.GroupContexMenu = new Ext.menu.Menu({

                id: 'GroupContexMenu',

                items: [
							{
								text: 'Agregar a un grupo'
								//,id:'IdContexMenuUpdate'
								,handler: this.OnContexMenuAddToGroupClick
							},{

								text: 'Eliminar'
								,id:'IdGroupContexMenuDelete'

								,handler: this.OnContexMenuDeleteClick

								//,iconCls: 'edit_user'

							},{

								text: 'Cambiar nombre'
								,id:'IdGroupContexMenuRename'

								,handler: this.OnContexMenuRenameClick

								//,iconCls: 'edit_user'

							},'-', {

								text: 'Propiedades'
								//,id:'IdBuiltinContexMenuProperties'

								,handler: this.OnContexMenuPropertyClick

								//,iconCls: 'edit_user'

							}
						]	

            }); 
	
	}

	,OnContexMenuCopyClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}

	,OnContexMenuCutClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuMoveClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuDeleteClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuRenameClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuSearchClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuUpdateClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnUserContexMenuDisableAccountClick : function(item,event){
		//console.dir(item);
		//console.dir(event);
		var rid = AppContexMenu.data.json.rid;
		var account = AppContexMenu.data.json.username;
		var disable = AppContexMenu.data.json.disable;
		if(disable){
			UserController.EnableAccount(rid,account,true);
		} else {
			UserController.EnableAccount(rid,account,false);
		}
		
	}


	,OnUserContexMenuResetPassClick : function(item,event){
		
		var data = AppContexMenu.data.json;
		var account = data.username;
		
		UserController.SetPassword(account,data);
		
	}


	,OnContexMenuDelegateControlClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnUserContexMenuPropertyClick : function(item,event){

		var data = AppContexMenu.data.json;
		var account = data.username;
		UserController.ManageUser(account,data);

	}

	,OnContexMenuPropertyClick : function(item,event){


	}

	,OnContexMenuAddPcClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddGroupClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddInetOrgPersonClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddContactClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddPrinterClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddUserClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}


	,OnContexMenuAddShareFolderClick : function(item,event){
		alert('Unimplemented');
	 console.dir(item);
	 console.dir(event);
	}	
	
	,OnContexMenuChangeDomainClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuChangeDomainControllerClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuRaiseDomainFunctionalLevelClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuMasterOperationClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}
	,OnContexMenuAddToGroupClick: function(item,event){
			alert('Unimplemented');
		 console.dir(item);
		 console.dir(event);
	}	
};