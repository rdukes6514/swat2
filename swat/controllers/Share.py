import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from swat.lib.base import BaseController, render,json
from swat.model.ShareModel import ShareModel;

log = logging.getLogger(__name__)

class ShareController(BaseController):

	def __init__(self):
		BaseController.__init__(self)
		if self._check_session():
			self.model = ShareModel(session['username'],session['password']);
			self.ChildNodes = [];

	def index(self):
		Shares = self.model.GetShareList();
		for Share in Shares:
			#response.write(Share.Sharename+"<br>");
			Path = '-';
			if len(Share.get("path")) > 0:
				Path = Share.get("path");

			Comment = '-';
			if len(Share.get("comment")) > 0:
				Comment = Share.get("comment");
				
			self.ChildNodes.append({
				'sharename':Share.GetShareName()
				,'path':Path
				,'comment':Comment
				,'icon':'HD-icon'
				,'type':'share'
			});
		return json.dumps({"Nodos":self.ChildNodes});
