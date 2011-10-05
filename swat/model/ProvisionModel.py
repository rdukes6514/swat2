import sys
import time
import tempfile
import logging,logging.handlers

import samba
import samba.ntacls
from samba.credentials import DONT_USE_KERBEROS,Credentials
from samba.auth import system_session
from swat.model.base import *;

from samba.provision import (
	provision,
	FILL_FULL,
	FILL_NT4SYNC,
	FILL_DRS,
	ProvisioningError,
	)
from samba.dsdb import (
	DS_DOMAIN_FUNCTION_2000,
	DS_DOMAIN_FUNCTION_2003,
	DS_DOMAIN_FUNCTION_2008,
	DS_DOMAIN_FUNCTION_2008_R2,
	)

from samba.param import LoadParm

class ProvisionModel(BaseModel):

	def __init__(self,username,password):
		BaseModel.__init__(self,username,password);
		#if self.isAuthenticate():
		self.opts = Options();
		#self.creds = self.opts.get_credentials(self.opts.lp)
		self.creds = Credentials()
		self.creds.guess(self.opts.lp)
		self.creds.set_kerberos_state(DONT_USE_KERBEROS)
		self.session = system_session()

	def SetupDomain(self):
	
		#dom_for_fun_level
		result = True
		if self.opts.function_level is None:
			self.opts.dom_for_fun_level = DS_DOMAIN_FUNCTION_2003 #default
		elif self.opts.function_level == "2000":
			self.opts.dom_for_fun_level = DS_DOMAIN_FUNCTION_2000
		elif self.opts.function_level == "2003":
			self.opts.dom_for_fun_level = DS_DOMAIN_FUNCTION_2003
		elif self.opts.function_level == "2008":
			self.opts.dom_for_fun_level = DS_DOMAIN_FUNCTION_2008
		elif self.opts.function_level == "2008_R2":
			self.opts.dom_for_fun_level = DS_DOMAIN_FUNCTION_2008_R2
			
		if self.opts.blank:
			 self.opts.samdb_fill = FILL_NT4SYNC
		elif self.opts.partitions_only:
			 self.opts.samdb_fill = FILL_DRS

		self.opts.eadb = True
		if self.opts.use_xattrs == "yes":
			 self.opts.eadb = False
		elif self.opts.use_xattrs == "auto" and not self.opts.lp.get("posix:eadb"):
			 file = tempfile.NamedTemporaryFile()
			 try:
					samba.ntacls.setntacl(self.opts.lp, file.name,
						"O:S-1-5-32G:S-1-5-32", "S-1-5-32", "native")
					self.opts.eadb = False
			 except:
					logger.info("You are not root or your system do not support xattr, using tdb backend for attributes. "
							 "If you intend to use this provision in production, rerun the script as root on a system supporting xattrs.")
			 file.close()
		#logger.addHandler(logging.StreamHandler(sys.stdout))
		#if opts.quiet:
		#	logger.setLevel(logging.WARNING)
		#else:
		#	logger.setLevel(logging.INFO)
		
		# buffer debug messages so they can be sent with error emails
		#memory_handler = logging.handlers.MemoryHandler(1024*10)
		#memory_handler.setLevel(logging.DEBUG)
		# attach handlers
		msg = "data: start provision\n\n"
		response.write(msg);
		self.logger = logging.getLogger(__name__)
		LogOutput = ListBufferingHandler(1000);
		self.logger.addHandler(LogOutput)
		self.logger.setLevel(logging.WARNING)
		self.logger.setLevel(logging.INFO)

		
		try:
			provision(self.logger
					,self.session
					,self.creds
					, smbconf=self.opts.smbconf 
		#			,targetdir=self.opts.targetdir
					,samdb_fill=self.opts.samdb_fill
					,realm=self.opts.realm
					,domain=self.opts.domain,
		#			domainguid=self.opts.domain_guid, domainsid=self.opts.domain_sid,
		#			hostname=self.opts.host_name,
		#			hostip=self.opts.host_ip, hostip6=self.opts.host_ip6,
		#			ntdsguid=self.opts.ntds_guid,
		#			invocationid=self.opts.invocationid, 
					adminpass=self.opts.adminpass,
		#			krbtgtpass=self.opts.krbtgtpass, machinepass=self.opts.machinepass,
		#			dns_backend=self.opts.dns_backend,
		#			dnspass=self.opts.dnspass, root=self.opts.root, nobody=self.opts.nobody,
		#			wheel=self.opts.wheel, users=self.opts.users,
					serverrole=self.opts.server_role, dom_for_fun_level=self.opts.dom_for_fun_level,
		#			ldap_backend_extra_port=self.opts.ldap_backend_extra_port,
		#			ldap_backend_forced_uri=self.opts.ldap_backend_forced_uri,
		#			backend_type=self.opts.ldap_backend_type,
		#			ldapadminpass=self.opts.ldapadminpass, ol_mmr_urls=self.opts.ol_mmr_urls,
		#			slapd_path=self.opts.slapd_path, setup_ds_path=self.opts.setup_ds_path,
		#			nosync=self.opts.ldap_backend_nosync, ldap_dryrun_mode=self.opts.ldap_dryrun_mode,
					useeadb=self.opts.eadb, 
		#			next_rid=self.opts.next_rid,
					lp=self.opts.lp)
		#except ProvisioningError, e:
		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
				self.logger.warning('Error: %s :%s',e.args[1], e.args[0])
			else:
				self.logger.warning('Error: %s :%s',e.args, 0)
				self.SetError(e.args,0)
			result = False;
			import traceback
			TraceBackLines = traceback.format_exc().splitlines()
			for t in TraceBackLines:
					self.logger.warning('Error: %s',t)
		LogOutput.flush();
		msg = "data: end provision\n\n"
		response.write(msg);
		return result;

class Options:
	def __init__(self):
		self.function_level = None
		self.use_xattrs = "auto" 
		self.lp = LoadParm();
		self.lp.load_default();
		self.realm = self.lp.get('realm') #default
		self.domain = self.lp.get('workgroup') #default
		self.adminpass = ''
		self.smbconf = self.lp.configfile
		self.server_role = self.lp.get("server role") #default
		self.samdb_fill = FILL_FULL #default
		self.blank = False
		self.partitions_only = False
	
#take from http://www.java2s.com/Open-Source/Python/Log/Logging/logging-0.4.9.6/test/log_test11.py.htm
class ListBufferingHandler(logging.handlers.BufferingHandler):
	def __init__(self,capacity):
		logging.handlers.BufferingHandler.__init__(self, capacity)
		#self.setFormatter(logging.Formatter("%(asctime)s %(levelname)-5s %(message)s"))
		#self.logger = logging.getLogger()
		#strm_out = logging.StreamHandler(sys.__stdout__)
		#self.logger.addHandler(strm_out)
		#self.logger.setLevel(logging.INFO)

	#def emit(self, record):
		#logging.handlers.BufferingHandler.emit(self,record)
		#super(ListBufferingHandler, self).emit(record)
		#msg = "data: %s\n\n" % self.format(record)
		#response.write(msg);
		#self.logger.info(msg)
		

	def flush(self):
		if len(self.buffer) > 0:
			try:
				for record in self.buffer:
					msg = "data: %s\n\n" % self.format(record)
					response.write(msg);
			except:
				self.handleError(None)  # no record failed in particular
			#response.write('==============================================');
			self.buffer = []
			
