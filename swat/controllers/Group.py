import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from swat.lib.base import BaseController, render,json
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
				,'icon':'group-icon'
				,'type':'group'
			});
		return json.dumps({"Nodos":self.ChildNodes});


