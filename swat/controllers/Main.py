import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from swat.lib.base import BaseController, render

log = logging.getLogger(__name__)

class MainController(BaseController):

	def	index(self):
		response.headers['Content-type'] = 'text/html; charset=utf-8'
		if self._check_session():
			c.title = "Samba Web Administration Tool"
			c.auth = True
			c.DnsDomain = session['DnsDomain'];
			c.RootDSE = session['RootDSE'];
			c.SambaVersion = session['SambaVersion'];
			
		return render('/index.html')
