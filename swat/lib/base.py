"""The base Controller API

Provides the BaseController class for subclassing.
"""
import sys
import imp
import json
import jsonpickle

from pylons import c, cache, config, g, request, response, session
from pylons.controllers import WSGIController
from pylons.templating import render_mako as render
#import 

class BaseController(WSGIController):

	#def __new__(self):
	#	WSGIController.__new__(self)
	#	response.write('__new__');
		
	def __init__(self):
		response.headers['Content-type'] = 'text/javascript; charset=utf-8'
		#response.write(str(self.__class__));
		#language = request.params.get("language", "en").strip()
		language = config['language']
		import_string = "from swat.i18n.%s import Lang"%language
		exec import_string
		self.Lang = Lang;
		self.AuthErr = {"success": False, "msg": Lang.AuthError};
		self.successOK = {'success': True}
		
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
		#from en import Lang;
		if not 'username' in session:
			#response.write('False');
			return False;	
		return True;

	def __import__(self,name, globals=None, locals=None, fromlist=None):
		# Fast path: see if the module has already been imported.
		try:
			return sys.modules[name]
		except KeyError:
			pass

		# If any of the following calls raises an exception,
		# there's a problem we can't handle -- let the caller handle it.

		fp, pathname, description = imp.find_module(name)

		try:
			return imp.load_module(name, fp, pathname, description)
		finally:
			# Since we may exit via an exception, close fp explicitly.
			if fp:
				fp.close()
