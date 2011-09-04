import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from swat.lib.base import BaseController, render,json
from swat.model.UserModel import UserModel,User;
import samba
log = logging.getLogger(__name__)

class UserController(BaseController):

	def __init__(self):
		BaseController.__init__(self)
		if self._check_session():
			self.model = UserModel(session['username'],session['password']);
			self.ChildNodes = [];

	def index(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);

		users = self.model.GetUserList();
		for user in users:
			#response.write(user.username+"<br>");
			icon = 'usuario';
			if(user.account_disabled):
				icon = 'dusuario';


 

			self.ChildNodes.append({
				'username':user.username
				,'fullname':user.fullname
				#,'description':user.description if user.description.strip() != '' else '-'
				,'description':user.description 
				,'rid':user.rid
				,'changepassword':user.must_change_password
				,'cannotchangepassword':user.cannot_change_password
				,'passwordexpires':user.password_never_expires
				,'disable':user.account_disabled
				,'locked':user.account_locked_out
				,'grouplist':user.group_list
				,'profile':user.profile_path
				,'logonscript':user.logon_script
				,'homedir':user.homedir_path
				,'maphomedirdrive':user.map_homedir_drive
				,'icon':icon
				,'type':'user'
			});

		return json.dumps({"Nodos":self.ChildNodes});


	def SetPassword(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
			
		try:
			
			rid = request.params.get("rid",-1)
			username = request.params.get("account","")
			password = request.params.get("password",samba.generate_random_password(7,15))
			
			
			#response.write(password);
			if(self.model.isAuthenticate()):
				if(not self.model.SetPassword(username,password)):
					raise Exception(self.model.LastErrorStr);
			
			UnlockUserAccount = request.params.get("UnlockUserAccount",False)
			if(UnlockUserAccount != False):
				if(not self.model.EnableAccount(rid,username,True)):
					raise Exception(self.model.LastErrorStr);
			
			ForcePasswordChange = request.params.get("ForcePasswordChange","off").strip();
			if(ForcePasswordChange == "on"):
				if(not self.model.ForcePasswordChangeAtNextLogin(rid,username)):
					raise Exception(self.model.LastErrorStr);
			else:
				if(not self.model.ForcePasswordChangeAtNextLogin(rid,username,False)):
					raise Exception(self.model.LastErrorStr);

		except Exception,e:
				return json.dumps({'success': False, 'msg': e.message,'num':0})
		return json.dumps(self.successOK)

	def EnableAccount(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
		try:
			rid = request.params.get("rid",-1)
			username = request.params.get("username","")
			enable = request.params.get("enable","yes").strip();
			
			
			if(self.model.isAuthenticate()):
				if(enable == "yes"):
					enable=True
				else:
					enable=False
					
				if(not self.model.EnableAccount(rid,username,enable)):
					raise Exception(self.model.LastErrorStr);

			else:
				raise Exception(self.model.LastErrorStr);
		except Exception,e:
				return json.dumps({'success': False, 'msg': e.message,'num':0})
		return json.dumps({'success': True,'enable':enable})
		

	def UpdateUser(self):
			if not self._check_session():
				return json.dumps(self.AuthErr);
				
			try:

				username = request.params.get("username","");
				fullname = request.params.get("fullname","");
				description = request.params.get("description","");
				rid = request.params.get("rid",-1);

				changepassword = request.params.get("changepassword","false");
				if(changepassword!="false"):
					changepassword = True
				else:
					changepassword = False
					
				cannotchangepassword = request.params.get("cannotchangepassword","false");
				if(cannotchangepassword!="false"):
					cannotchangepassword = True
				else:
					cannotchangepassword = False
				
				passwordexpires = request.params.get("passwordexpires","false");
				if(passwordexpires!="false"):
					passwordexpires = True
				else:
					passwordexpires = False
					
				disable = request.params.get("disable","false");
				if(disable!="false"):
					disable = True
				else:
					disable = False
					
				locked = request.params.get("locked","false");
				if(locked!="false"):
					locked = True
				else:
					locked = False
					
				profile = request.params.get("profile","");
				logonscript = request.params.get("logonscript","");
				homedir = request.params.get("homedir","");
				maphomedirdrive = request.params.get("maphomedirdrive","");

				user = User(username,fullname,description,rid);

				
				user.must_change_password = changepassword;
				user.cannot_change_password = cannotchangepassword;
				user.password_never_expires = passwordexpires;
				user.account_disabled = disable;
				locked = True;
				user.account_locked_out = locked;
				user.profile_path = profile;
				user.logon_script = logonscript;
				user.homedir_path = homedir;
				user.map_homedir_drive = maphomedirdrive;
			
				#user.password = ""
				#,'grouplist':user.group_list
				#grouplist = request.params.get("grouplist",[])
				#user.group_list = []
				#user.account_disabled = True;
				if not self.model.UpdateUser(user):
					raise Exception(self.model.LastErrorStr);

			except Exception,e:
					return json.dumps({'success': False, 'msg': e.message,'num':0})
			return json.dumps(self.successOK)

	def test(self):
		#List = ['nada'];
		List = self.model.GetUserGroups(500);
		
		return json.dumps({"Nodos":List});
		#response.write(str(dir(self.model)));
