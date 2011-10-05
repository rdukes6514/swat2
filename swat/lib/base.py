"""The base Controller API

Provides the BaseController class for subclassing.
"""
import json
import jsonpickle

from pylons import c, cache, config, g, request, response, session
from pylons.controllers import WSGIController
from pylons.templating import render_mako as render
from pylons import config

class BaseController(WSGIController):


	def __init__(self):
		response.headers['Content-type'] = 'text/javascript; charset=utf-8'
		self.language = config['language']
		config['debug'] = False;
		self.language = language = request.params.get("language", self.language).strip()
		import_string = "from swat.i18n.%s import Lang"%self.language
		exec import_string
		self.Lang = Lang;
		self.AuthErr = {"success": False, "msg": self.Lang.AuthError};
		self.successOK = {'success': True}
		#response.write(self.__class__);
		
	def __call__(self, environ, start_response):
		"""Invoke the Controller"""
		# WSGIController.__call__ dispatches to the Controller method
		# the request is routed to. This routing information is
		# available in environ['pylons.routes_dict']
		return WSGIController.__call__(self, environ, start_response)

	def index(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
		else:	
			return json.dumps(self.successOK);

	def _check_session(self):
		if not 'username' in session:
			#response.write('False');
			return False;	
		return True;
