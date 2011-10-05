import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect
import webhelpers.paginate

from swat.lib.base import BaseController, render,json
from swat.model.UserModel import UserModel,User;
from swat.model.GroupModel import GroupModel;
import samba
log = logging.getLogger(__name__)

class UserController(BaseController):
	iscopy=False;
	rid=-1;
	def __init__(self):
		BaseController.__init__(self)
		if self._check_session():
			self.model = UserModel(session['username'],session['password']);
			self.GroupModel = GroupModel(session['username'],session['password']);
			self.ChildNodes = [];
			
			if not 'UserPageStart' in session:
				session['UserPageStart']=0;
				session['UserPageLimit']=18;

	def index(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);

		
		start = int(request.params.get("start",session['UserPageStart']));
		limit = int(request.params.get("limit",session['UserPageLimit']));
		
		#session['UserPageStart']=start;
		#session['UserPageLimit']=limit;
		#session.save();
		
		query = request.params.get("query","");
		query = query.lower();
		fields = request.params.get("fields","");
		
		
		users = self.model.GetUserList();
		if query.strip() != '':
			if fields.count(',')>0:
				fields='username';
			
			if fields.strip() == '':
				fields='username';
				
			#if fields.strip() != '':
			#	fields='username';
			newuserlist = [];
			for user in users:
				#response.write(user.username+"<br>");
				#icon = 'usuario';
				
				if(user.account_disabled):
					icon = 'dusuario';
				
				if(fields=='rid'):
					if query.isdigit():
						query = int(query);
					
					if(user.rid!=query):
						continue;
				elif(fields=='username'):
					if(not user.username.lower().count(query)):
						continue;
				elif(fields=='description'):
					if(not user.description.lower().count(query)):
						continue;
				else:
					continue;
				
				newuserlist.append(user);

			del users
			users=newuserlist;
		
		total=len(users);		
		Page = webhelpers.paginate.Page(users, page=start, items_per_page=limit)

		for user in Page:
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

		return json.dumps({"Nodos":self.ChildNodes,'total':total});


	def AddUser(self):
		try:
			if not self._check_session():
				return json.dumps(self.AuthErr);	

			
			username = request.params.get("username","")
			password = request.params.get("password",samba.generate_random_password(7,15))		
			fullname = request.params.get("fullname","")
			description = request.params.get("description","")
			iscopy = request.params.get("iscopy","false")
			
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
								
			rid = self.model.AddUser(username);
			
			if rid == False:
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			
			if(iscopy!="false"):
				self.iscopy=True;
				self.rid=rid;
				self.UpdateUser();
			else:
				user = User(username,fullname,description,rid);
				
				user.must_change_password = changepassword;
				user.cannot_change_password = cannotchangepassword;
				user.password_never_expires = passwordexpires;
				user.account_disabled = disable;
				
				if not self.model.UpdateUser(user):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
	
				if(not self.model.SetPassword(username,password)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			
		
		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
		
		return json.dumps(self.successOK);
			
	
	def DeleteUser(self):
		try:
			if not self._check_session():
				return json.dumps(self.AuthErr);
			
			#rid = request.params.get("rid",-1)
			username = request.params.get("username","")
			if(not self.model.DeleteUser(username)):
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)			
			
		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
		return json.dumps(self.successOK)	

	def DeleteUserList(self):
		try:
			if not self._check_session():
				return json.dumps(self.AuthErr);
			
			#rid = request.params.get("rid",-1)
			UserList = request.params.get("UserList","")
			if(UserList.count(',')>0):
				UserList = UserList.split(',');
				for username in UserList:
					if(not self.model.DeleteUser(username)):
						raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			else:
				if(not self.model.DeleteUser(UserList)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
					
		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
		return json.dumps(self.successOK)	



	def SetPassword(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
			
		try:
			
			rid = request.params.get("rid",self.rid)
			username = request.params.get("account","")
			password = request.params.get("password",samba.generate_random_password(7,15))
			
			
			#response.write(password);
			if(self.model.isAuthenticate()):
				if(not self.model.SetPassword(username,password)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			
			UnlockUserAccount = request.params.get("UnlockUserAccount",False)
			if(UnlockUserAccount != False):
				if(not self.model.EnableAccount(rid,username,True)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			
			ForcePasswordChange = request.params.get("ForcePasswordChange","off").strip();
			if(ForcePasswordChange == "on"):
				if(not self.model.ForcePasswordChangeAtNextLogin(rid,username)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			else:
				if(not self.model.ForcePasswordChangeAtNextLogin(rid,username,False)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)

		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
		return json.dumps(self.successOK)

	def EnableAccount(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
		try:
			rid = request.params.get("rid",self.rid)
			username = request.params.get("username","")
			enable = request.params.get("enable","yes").strip();
			
			
			if(self.model.isAuthenticate()):
				if(enable == "yes"):
					enable=True
				else:
					enable=False
					
				if(not self.model.EnableAccount(rid,username,enable)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)

			else:
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
		return json.dumps(self.successOK)
		

	def UpdateUser(self):
			if not self._check_session():
				return json.dumps(self.AuthErr);
				
			try:

				username = request.params.get("username","");
				fullname = request.params.get("fullname","");
				description = request.params.get("description","");
				rid = request.params.get("rid",self.rid);

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
				#locked = True;
				user.account_locked_out = locked;
				user.profile_path = profile;
				user.logon_script = logonscript;
				user.homedir_path = homedir;
				user.map_homedir_drive = maphomedirdrive;
			
				#user.password = ""
				#,'grouplist':user.group_list
				#user.group_list = []
				#user.account_disabled = True;
				if not self.model.UpdateUser(user):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
				"""
				oldgrouplist = request.params.get("oldgrouplist","")
				grouplist = request.params.get("grouplist","")
				
				if(oldgrouplist.count(',')==0):
					if(oldgrouplist.isdigit()):
						number = int(oldgrouplist);
						oldgrouplist=list();
						oldgrouplist.append(number);
					else:
						oldgrouplist=list()
						oldgrouplist.append(513);
				else:
					oldgrouplist = oldgrouplist.split(',')
				
				if(grouplist.count(',')==0):
					if(grouplist.isdigit()):
						number = int(grouplist);
						grouplist=list();
						grouplist.append(number);
					else:
						grouplist=list()
						grouplist.append(513);
				else:
					grouplist = grouplist.split(',')
				
				groupdiff = set(oldgrouplist).difference(grouplist);
				
				for group_rid in groupdiff:
					self.GroupModel.DeleteGroupMember(group_rid,rid);
				
				groupdiff = set(grouplist).difference(oldgrouplist);
				for group_rid in groupdiff:
					self.GroupModel.AddGroupMember(group_rid,rid);
				"""
				##
				oldgrouplist = request.params.get("oldgrouplist","")
				grouplist = request.params.get("grouplist","")

				if(oldgrouplist.count(',')==0):
					if(oldgrouplist.isdigit()):
						number = int(oldgrouplist);
						oldgrouplist=list();
						oldgrouplist.append(number);
					else:
						oldgrouplist=list()
				else:
					oldgrouplist = oldgrouplist.split(',')
				
				oldgrouplist = map(int, oldgrouplist)

				if(grouplist.count(',')==0):
					if(grouplist.isdigit()):
						number = int(grouplist);
						grouplist=list();
						grouplist.append(number);
					else:
						grouplist=list()
				else:
					grouplist = grouplist.split(',')
				
				grouplist = map(int, grouplist)
				
				groupdiff = set(oldgrouplist).difference(grouplist);
						

						
				for group_rid in groupdiff:
					self.GroupModel.DeleteGroupMember(group_rid,rid);
					
				groupdiff = set(grouplist).difference(oldgrouplist);

						
				for group_rid in groupdiff:
					self.GroupModel.AddGroupMember(group_rid,rid);

			except Exception,e:
				if(self.iscopy):
					raise;
				if(len(e.args)>1):
					return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0], 'groupdiff':list(groupdiff), 'oldgrouplist':list(oldgrouplist), 'grouplist':list(grouplist)})
				else:
					return json.dumps({'success': False, 'msg': e.args,'num':-1, 'groupdiff':list(groupdiff), 'oldgrouplist':list(oldgrouplist), 'grouplist':list(grouplist)})

			if(self.iscopy):
				return True;
			#return json.dumps({'success': True, 'groupdiff':list(groupdiff), 'oldgrouplist':list(oldgrouplist), 'grouplist':list(grouplist)})
			return json.dumps(self.successOK)

	def test(self):
		#List = ['nada'];
		#List = self.model.GetUserGroups(500);
		#return json.dumps({"Nodos":List});
		#response.write(str(dir(self.model)));
		#user = User("test001","","",-1);
		try:
			for i in range(1,20):
				if not self.model.AddUser("test%s"%i):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
		except Exception,e:
				if self.model.LastErrorNumber !=0:
					num=self.model.LastErrorNumber
				return json.dumps({'success': False, 'msg': e.message,'num':num})
				
		return json.dumps(self.successOK)

