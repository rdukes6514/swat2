Ext.ns("UserController");

UserController = {
  
   	    NewUser:function(){
			DialogNewUser.show();
	    }

   	    ,RenameUser:function(rowIndex){
			MainAppW.RowEditor.startEditing(rowIndex, false);
	    }



   	    ,CopyUser:function(data){
			if(data==null) return;
			DialogNewUser.show(data);
	    }
	
			
   	    ,DeleteUser:function(rid,username){
			ParamsObj = {
				rid:rid
				,username:username
			}
			UserController.SendData('User/DeleteUser',ParamsObj);
	    }

   	    ,DeleteUserList:function(){
	    	var seleccionados = Ext.getCmp('GridObjectBrowser').getSelectionModel().getSelections();
			var RemoveList = Array();

			Ext.each(seleccionados, function (record) {
				RemoveList.push(record.data['username']);	
			});

			ParamsObj = {
				UserList:RemoveList.toString()
			}
			//console.log(RemoveList.toString());
			if(RemoveList.length>0){
				UserController.SendData('User/DeleteUserList',ParamsObj);
			}
	    }


    
            ,EnableAccount: function(rid,username,enable) {
				enable= enable || false;
				if(enable) enable = 'yes';
				ParamsObj = {
						rid:rid
						,username:username
						,enable:enable
				}
				UserController.SendData('User/EnableAccount',ParamsObj);
            }

            ,ForcePasswordChangeAtNextLogin:function(rid,account){
				ParamsObj = {
						rid:rid
						,username:username
				}
				UserController.SendData('User/ForcePasswordChangeAtNextLogin',ParamsObj);            
            }
            
            ,SetPassword:function(account,data) {
                //force_change_at_next_login= force_change_at_next_login || false;
				DialogResetPass.show(account,data);
            }
            
            ,SetExpiry:function(rid,account,expiry,days) {
              expiry = expiry || false;
            }
            
            ,ManageUser:function(account,data){
				DialogUserManager.show(data);
            }
            
            
            ,SendData:function(url,params,MainWindow){
            
					Ext.Ajax.request({
										url: url,
										method : 'POST', 
										success: function(response, opts) {

												var Return = Ext.decode(response.responseText);
												
												if(!Return.success){
													Ext.Msg.alert(lang.BoldError,Return.msg);
													return false;
												} 
												
												Ext.getCmp('GridObjectBrowser').store.load();
												if(typeof(MainWindow) != 'undefined') {
													MainWindow.close();
												}	
										

										},

										failure: function(response, opts) {
												ErrorMsg = 'status code ' + response.status;
												Ext.Msg.alert(lang.BoldError,ErrorMsg);
										},
										params: params
					});            
            
            }
            
            
            ,Implement:function(){
            
            }            
            

}
