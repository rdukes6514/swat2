
function SendForm(Form,MainWindow,url,params){
	
	if(typeof(Form) == 'undefined') return false;  
	if(typeof(MainWindow) == 'undefined') return false;
	if(typeof(url) == 'undefined') return false;
	if(typeof(params) == 'undefined') return false;
	if(typeof(params.account) == 'undefined') return false;
	
	
	
    Form.getForm().submit({
        url: url,
        params: params
        , success: function (form, action) {
            if(!action.result.success){
				Ext.Msg.alert(lang.information,action.result.msg,MainWindow.close());
				return false;
            }

            MainWindow.close();
            Ext.getCmp('GridObjectBrowser').store.load();
            
        }, failure: function (form, action) {

            switch (action.failureType) {
				case Ext.form.Action.CLIENT_INVALID:
					Ext.Msg.alert(lang.error,lang.FormInvalidValues,MainWindow.close());
				break;
				case Ext.form.Action.CONNECT_FAILURE:
					Ext.Msg.alert(lang.error,lang.CommunicationFailed,MainWindow.close());
                break;
				case Ext.form.Action.SERVER_INVALID:
					Ext.Msg.alert(lang.error, action.result.msg,MainWindow.close());
                break;
				default:
					Ext.Msg.alert(lang.error, action.result.msg,MainWindow.close());                                        
				
                }

        }
    });	
}                            