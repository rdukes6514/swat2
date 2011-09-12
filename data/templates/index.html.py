# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 5
_modified_time = 1315849397.716399
_template_filename='/home/GSoC-SWAT/swat/templates/index.html'
_template_uri='/index.html'
_template_cache=cache.Cache(__name__, _modified_time)
_source_encoding='utf-8'
from webhelpers.html import escape
_exports = []


def render_body(context,**pageargs):
    context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        c = context.get('c', UNDEFINED)
        __M_writer = context.writer()
        # SOURCE LINE 1
        __M_writer(u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" \r\n\r\n\t"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> \r\n<html> \r\n<head> \r\n\t<title>')
        # SOURCE LINE 6
        __M_writer(escape(c.title))
        __M_writer(u'</title> \r\n  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n\t<link rel="shortcut icon" href="images/samba-logo.png" />\r\n    \r\n\t<style type="text/css">\r\n    #loading-mask{\r\n        position:absolute;\r\n        left:0;\r\n        top:0;\r\n        width:100%;\r\n        height:100%;\r\n        z-index:20000;\r\n        background-color:white;\r\n    }\r\n    #loading{\r\n        position:absolute;\r\n        left:45%;\r\n        top:40%;\r\n        padding:2px;\r\n        z-index:20001;\r\n        height:auto;\r\n    }\r\n    #loading a {\r\n        color:#225588;\r\n    }\r\n    #loading .loading-indicator{\r\n        background:white;\r\n        color:#444;\r\n        font:bold 13px tahoma,arial,helvetica;\r\n        padding:10px;\r\n        margin:0;\r\n        height:auto;\r\n    }\r\n    #loading-msg {\r\n        font: normal 10px arial,tahoma,sans-serif;\r\n    }\t\r\n\t</style>\r\n\t\r\n\t\r\n\t<link rel="stylesheet" type="text/css" href="./jslibs/resources/css/ext-all.css" />\r\n\t\r\n<!--\r\n\t<link rel="stylesheet" type="text/css" href="./jslibs/theme/xtheme-groupoffice.css"/>\r\n  <link rel="stylesheet" type="text/css" href="./jslibs/theme/style.css"/>\r\n-->\r\n\t<link rel="stylesheet" type="text/css" href="./jslibs/resources/css/RowEditor.css" />\r\n\t<link rel="stylesheet" type="text/css" href="./jslibs/resources/css/passwordmeter.css" />\r\n\t<link rel="stylesheet" type="text/css" href="./jslibs/resources/css/gridsearch.css" />\r\n\t<link rel="stylesheet" type="text/css" href="./jslibs/resources/css/ext-ux-wiz.css" />\r\n\t<link rel="stylesheet" type="text/css" href="./css/app.css" /> \r\n \r\n\t<!--\r\n\t<script type="text/javascript" src="./jslibs/adapter/ext/ext-base-debug.js"></script> \r\n\t<script type="text/javascript" src="./jslibs/ext-all-debug.js"></script> \r\n\t-->\r\n\t<script type="text/javascript" src="./jslibs/adapter/ext/ext-base.js"></script> \r\n\t<script type="text/javascript" src="./jslibs/ext-all.js"></script> \r\n\t<script type="text/javascript" src="./jslibs/locale/ext-lang-es.js"></script> \r\n\t<script type="text/javascript" src="./js/utils.js"></script> \r\n\t<script type="text/javascript" src="./js/webtoolkit.sprintf.js"></script> \r\n  <script>Ext.namespace(\'Ext.ux.swat\');</script>\r\n')
        # SOURCE LINE 67
        if c.auth == True:
            # SOURCE LINE 68
            __M_writer(u'\t\r\n\t<script type="text/javascript">\r\n\t\tExt.ux.swat.Config = {}\r\n\t\tExt.ux.swat.Config.DnsDomain = \'')
            # SOURCE LINE 71
            __M_writer(escape(c.DnsDomain))
            __M_writer(u"';\r\n\t\tExt.ux.swat.Config.RootDSE =   '")
            # SOURCE LINE 72
            __M_writer(escape(c.RootDSE))
            __M_writer(u"';\r\n\t\tExt.ux.swat.Config.SambaVersion =   '")
            # SOURCE LINE 73
            __M_writer(escape(c.SambaVersion))
            __M_writer(u'\';\r\n\t</script> \r\n\t\r\n\t\r\n\r\n\t\r\n\t<script type="text/javascript" src="./jslibs/CompositeField.js"></script>\r\n\t<script type="text/javascript" src="./jslibs/RowEditor.js"></script>\r\n\t<script type="text/javascript" src="./jslibs/CheckColumn.js"></script>\r\n\t<script type="text/javascript" src="./jslibs/PasswordMeter.js"></script>\r\n\t<script type="text/javascript" src="./jslibs/Ext.ux.grid.Search.js"></script>\r\n\r\n\r\n\t<script type="text/javascript" src="./jslibs/wizard/CardLayout.js"></script>\r\n\t<script type="text/javascript" src="./jslibs/wizard/Wizard.js"></script>\r\n\t<script type="text/javascript" src="./jslibs/wizard/Header.js"></script>\r\n\t<script type="text/javascript" src="./jslibs/wizard/Card.js"></script>\t\t\r\n\t\r\n\t<script type="text/javascript" src="./js/lsaflags.js"></script>\r\n\t\r\n\t<script type="text/javascript" src="./js/Dialogs/SendDialog.js"></script> \r\n\t<script type="text/javascript" src="./js/Dialogs/DialogResetPass.js"></script> \r\n\t<script type="text/javascript" src="./js/Dialogs/DialogUserManager.js"></script>\r\n\t<script type="text/javascript" src="./js/Dialogs/DialogNewUser.js"></script>  \r\n\t<script type="text/javascript" src="./js/Dialogs/DialogGroupManager.js"></script>\r\n\t<script type="text/javascript" src="./js/Dialogs/DialogNewGroup.js"></script>\r\n\r\n\t\r\n\t<script type="text/javascript" src="./js/UserController.js"></script> \r\n\t<script type="text/javascript" src="./js/GroupController.js"></script> \r\n\t<script type="text/javascript" src="./js/ContexMenu.js"></script> \r\n\t\r\n\t\r\n\t<script type="text/javascript" src="./js/application.js"></script> \r\n')
            # SOURCE LINE 107
        else:
            # SOURCE LINE 108
            __M_writer(u'\t<script type="text/javascript" src="./js/login.js"></script> \r\n')
            pass
        # SOURCE LINE 110
        __M_writer(u'</head> \r\n<body> \r\n\r\n\t<!--\r\n<div id="loading-mask" style=""></div>\r\n<div id="loading">\r\n    <div class="loading-indicator"><img src="./jslibs/resources/images/extanim32.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/>ADS Browser - <br /><span id="loading-msg"></span></div>\r\n</div>\r\n\t-->\r\n\r\n\t<!--\r\n    <script type="text/javascript" src="config.js"></script> \r\n\t-->\r\n\r\n\r\n</body> \r\n</html>\t')
        return ''
    finally:
        context.caller_stack._pop_frame()


