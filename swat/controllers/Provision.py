import time
import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect
from swat.lib.base import BaseController, render , jsonpickle
from swat.model.base import BaseModel
from swat.model.ProvisionModel import ProvisionModel,ListBufferingHandler
#log = logging.getLogger(__name__)

class ProvisionController(BaseController):

#	def index(self):
#		response.headers['Content-type'] = 'text/html; charset=utf-8'
#		"""Serve a fully fledged HTML page"""
#		session['StartProvision'] = True;
#		session.save();
		#return '<script src="%s"></script>Loaded...%s' % (url.current(action='js'),time.strftime("%H:%M:%S", time.gmtime()))

	def index(self):
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
			c.AuthRemote = str(base.AuthRemote).lower();
		session['StartProvision'] = True;
		session.save();
		return render('/provision.html')
		


	def start(self):
		"""Implement a full-blown Event collector and dispatcher"""
		response.headers['content-type'] = 'text/event-stream'
		#response.headers['content-type'] = 'text/html'
		# Don't use this! It will append a charset=utf-8 and it won't work.
		#response.content_type = 'text/event-stream'
		response.status_int = 200
		self.model = ProvisionModel(None,None)
		self.logger = logging.getLogger(__name__)
		LogOutput = ListBufferingHandler(1000);
		self.logger.addHandler(LogOutput)
		self.logger.setLevel(logging.WARNING)
		self.logger.setLevel(logging.INFO)
		cad = time.strftime("%H:%M:%S", time.gmtime())

		if session['StartProvision'] == True:
			
			Realm=request.params.get("Realm",'')
			Domain=request.params.get("Domain",'')
			ServerRole=request.params.get("ServerRole",'')
			FunctionLevel=request.params.get("FunctionLevel",'')
			SamdbFill=request.params.get("SamdbFill",'full')
			UseXattrs=request.params.get("UseXattrs",'')
			AdminPass=request.params.get("AdminPass",'')
			
			
			self.model.opts.function_level = str(FunctionLevel)
			self.model.opts.use_xattrs = str(UseXattrs )
			self.model.opts.realm = str(Realm)
			self.model.opts.domain = str(Domain);
			self.model.opts.adminpass = str(AdminPass)
			self.model.opts.server_role = str(ServerRole)

			if SamdbFill == 'blank':
				self.model.opts.blank =  True
			if SamdbFill == 'partitions-only':
				self.model.opts.partitions_only = True
			
			self.model.SetupDomain()
			session['StartProvision'] = False;
			session.save();
		#else:
			#response.write("data: %s\n\n"%time.strftime("%H:%M:%S", time.gmtime()))
		#response.write("data: %s %s\n\n" % (time.strftime("%S", time.gmtime()), time.strftime("%H:%M:%S", time.gmtime())))
		#def go():
		#	for x in range(10):
		#		msg = "data: %s %s\n\n" % (x, time.strftime("%H:%M:%S", time.gmtime()))
		#		time.sleep(1)
		#		yield msg

		#return go()


