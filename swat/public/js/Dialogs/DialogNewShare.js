Ext.ns("DialogNewShare");

DialogNewShare = {
    show:function(data){
        var iscopy = false;
        if (typeof data == "undefined") {
            data = {foo:"foo"};
        } else {
            iscopy = true;
        }

        var FormNewShare = new Ext.FormPanel({
            labelWidth: 75,
            labelAlign: 'left',
            frame:true,
            bodyStyle: 'x-window-body',
            border: false,
            monitorValid:true,
            items: [{
                layout: 'form',
                items: [{
                    xtype: "textfield",
                    labelAlign: 'left',
                    id: "idSharename",
                    name: "sharename",
                    allowBlank: false,
                    fieldLabel: "<b>Share name</b>",
                    width: '95%'
                },{
                    xtype: "textfield",
                    labelAlign: 'left',
                    id: "idSharepath",
                    name: "sharepath",
                    allowBlank: false,
                    fieldLabel: "<b>Path</b>",
                    width: '95%'
                },{
                    xtype: "textfield",
                    labelAlign: 'left',
                    id: "idComment",
                    name: "sharecomment",
                    value:data.description,
                    //allowBlank: false,
                    fieldLabel: "<b>Comment</b>",
                    width: '95%'
                },{
					xtype: 'box'
					,autoEl: {
						//tag: 'hr'
						html:'<div  style="width: 100%; height: 180px;"></div>'
					}												
				}]
            }],
            buttons: [{
                text: 'Create',
                formBind: true,
                handler:function(){
                    params = {};
                    SendForm(FormNewShare,WindowNewShare,'Share/AddShare',params);
                },
            },{

                text: 'Close',
                handler: function () {
                    WindowNewShare.close();
                }
            }]
        });

        var WindowNewShare = new Ext.Window({
            title: 'New share',
            modal:true,
            width:380,
            height:365,
            labelWidth: 75,
            frame: true,
            bodyStyle: 'padding:5px 5px 5px 5px',
            layout: 'form',
            items: [FormNewShare]
        });

        WindowNewShare.show();
        WindowNewShare.center();
    }
}
