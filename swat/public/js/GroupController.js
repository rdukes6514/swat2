Ext.ns("GroupController");

GroupController = {
 
			NewGroup:function(){
				DialogNewGroup.show();
			}

			,RenameGroup:function(rowIndex){
				//MainAppW.RowEditor.startEditing(rowIndex, false);
			}



			,CopyGroup:function(data){
				if(data==null) return;
				//DialogNewUser.show(data);
			}
	
			
			,DeleteGroup:function(rid,group){
				ParamsObj = {
					rid:rid
					,username:username
				}
				//GroupController.SendData('User/DeleteUser',ParamsObj);
			}

			,DeleteGroupList:function(){
				/*var seleccionados = Ext.getCmp('GridObjectBrowser').getSelectionModel().getSelections();
				var RemoveList = Array();

				Ext.each(seleccionados, function (record) {
					RemoveList.push(record.data['name']);	
				});

				ParamsObj = {
					UserList:RemoveList.toString()
				}
				//console.log(RemoveList.toString());
				if(RemoveList.length>0){
					GroupController.SendData('User/DeleteUserList',ParamsObj);
				}*/
			}

            
            
            ,Manage:function(group,data){
				DialogGroupManager.show(data);
            }
            
            
            ,SendData:function(url,params,MainWindow){
            
					Ext.Ajax.request({
										url: url,
										method : 'POST', 
										success: function(response, opts) {

												var Return = Ext.decode(response.responseText);
												
												if(!Return.success){
													Ext.Msg.alert('<b>Error</b>',Return.msg);
													return false;
												} 
												
												Ext.getCmp('GridObjectBrowser').store.load();
												
												if(typeof(MainWindow) != 'undefined') {
													MainWindow.close();
												}	
										

										},

										failure: function(response, opts) {
												ErrorMsg = 'status code ' + response.status;
												Ext.Msg.alert('<b>Error</b>',ErrorMsg);
										},
										params: params
					});            
            
            }
            
}

/*


    def newgroup(self, groupname, groupou=None, grouptype=None,
                 description=None, mailaddress=None, notes=None, sd=None):
        """Adds a new group with additional parameters

        :param groupname: Name of the new group
        :param grouptype: Type of the new group
        :param description: Description of the new group
        :param mailaddress: Email address of the new group
        :param notes: Notes of the new group
        :param sd: security descriptor of the object
        
        def deletegroup(self, groupname):
        
    def add_remove_group_members(self, groupname, listofmembers,
                                  add_members_operation=True):
        """Adds or removes group members

        :param groupname: Name of the target group
        :param listofmembers: Comma-separated list of group members
        :param add_members_operation: Defines if its an add or remove
            operation
        """        
*/