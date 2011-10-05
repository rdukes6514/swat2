import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from swat.lib.base import BaseController, render , jsonpickle
from swat.model.base import BaseModel

log = logging.getLogger(__name__)

class MainController(BaseController):

	def	index(self):
		response.headers['Content-type'] = 'text/html; charset=utf-8'
		#language = request.params.get("language",self.language).strip();
		c.language = self.language;
		c.title = self.Lang.PageTitle
		c.auth = False
		base = BaseModel();
		c.WorkGroup = None
		c.Realm = None
		if base.WorkGroup.strip() != '':
			c.WorkGroup = base.WorkGroup
			c.Realm = base.Realm
			
		if self._check_session():
			c.auth = True
			c.DnsDomain = session['DnsDomain'];
			c.RootDSE = session['RootDSE'];
			c.SambaVersion = session['SambaVersion'];
			c.language = session['language'];
			c.AuthRemote = str(base.AuthRemote).lower()
		return render('/index.html')

