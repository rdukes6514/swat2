import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

#from swat.lib.base import BaseController, render
from swat.lib.base import *
from swat.model.base import BaseModel

log = logging.getLogger(__name__)

class LoginController(BaseController):
	#@jsonify
	successOK = {'success': True}
	def index(self):
		response.headers['Content-type'] = 'text/javascript'
		if self._check_session():
			self.successOK = {'success': True,'RootDSE':session['RootDSE'],'DnsDomain':session['DnsDomain'],'SambaVersion':session['SambaVersion']}
			return json.dumps(self.successOK);
		#successERR = {'success': False, 'errors': { 'reason': 'Login failed. Try again.' }}		
		successERR = {'success': False, 'msg': 'Error de autenticaci&oacute;n','num':0}

		username = request.params.get("username", "").strip()
		password = request.params.get("password", "").strip()

		base = BaseModel(username,password);
		
		if(not base.isAuthenticate()):
			return json.dumps({'success': False, 'msg': 'Error de autenticaci&oacute;n','num':0}) 

		session['username'] = username;
		session['password'] = password;
		session['RootDSE'] = base.RootDSE;
		session['DnsDomain'] = base.DnsDomain;
		session['SambaVersion'] = base.SambaVersion;
		session['schemaNamingContext'] = base.schemaNamingContext;
		session.save();
		self.successOK = {'success': True,'RootDSE':base.RootDSE,'DnsDomain':base.DnsDomain}


		return json.dumps(self.successOK)
		
	def logout(self):
		# Clear all values in the session associated with the client
		session.clear()
		session.save()
		return json.dumps(self.successOK)


