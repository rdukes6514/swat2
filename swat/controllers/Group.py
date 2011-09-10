import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from swat.lib.base import BaseController, render,json,jsonpickle
from swat.model.GroupModel import GroupModel;


log = logging.getLogger(__name__)

class GroupController(BaseController):

	def __init__(self):
		BaseController.__init__(self)
		if self._check_session():
			self.model = GroupModel(session['username'],session['password']);
			self.ChildNodes = [];

	def index(self):
		groups = self.model.GetGroupList();
		for group in groups:
			self.ChildNodes.append({
				'name':group.name
				,'description':group.description
				,'rid':group.rid
				,'memberlist':group.memberlist
				,'icon':'group-icon'
				,'type':'group'
			});
		return jsonpickle.encode({"Nodos":self.ChildNodes},unpicklable=False);

	def List(self):
		from swat.model.UserModel import UserModel;
		
		if not self._check_session():
			return json.dumps(self.AuthErr);
			
		self.UserModel = UserModel(session['username'],session['password']);
		
		groups = self.model.GetGroupList();
		for group in groups:
			self.ChildNodes.append({
				'name':group.name
				,'rid':group.rid
				,'type':2
			});
			
		users = self.UserModel.GetUserList();
		for user in users:
			self.ChildNodes.append({
				'name':user.username
				,'rid':user.rid
				,'type':1
			});
			
		return jsonpickle.encode({"Nodos":self.ChildNodes},unpicklable=False);
	

	def test(self):
		rid = request.params.get("rid",512)
		List = [];
		List = self.model.GetGroupMembers(rid);
		if(List==False):
			return json.dumps({"err":self.model.LastErrorStr,"num":self.model.LastErrorNumber});
		
		response.write(str(len(List)))
		
			
		return jsonpickle.encode(List);
		
		#return json.dumps(List);

