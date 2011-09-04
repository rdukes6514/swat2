
import samba
import ldb
from samba.dcerpc import samr, security, lsa
from samba import credentials
from samba import param
from samba.auth import system_session
from samba.samdb import SamDB
from samba import version

#from  swat.lib.Logs import AppLog

class BaseModel:
	lp = param.LoadParm()
	lp.load_default()
	creds=None
	LdapConn=None
	auth_success=False
	_isLastErrorAvailable=False
	LastErrorStr='';
	LastErrorNumber=0;
	RootDSE='' 
	DnsDomain='' 
	SambaVersion='' 
	schemaNamingContext='' 
	#Log = AppLog();
	
	def __init__(self,username,password):
		self.username=username;
		self.password=password;
		if self._connect():
			self._GetBase();
			self._GetDomainNames();
			self._SetCurrentDomain(0);

	def _connect(self):
		try:
			
			self.creds = credentials.Credentials()
			self.creds.set_username(self.username)
			self.creds.set_password(self.password)
			#self.creds.set_domain("SAMDOM")
			self.creds.set_domain("")
			self.creds.set_workstation("")
			self.LdapConn = samba.Ldb("ldap://127.0.0.1",lp=self.lp,credentials=self.creds)
			self.samrpipe = samr.samr("ncalrpc:", self.lp, self.creds)
			#self.connect_handle = self.samrpipe.Connect(None, security.SEC_FLAG_MAXIMUM_ALLOWED)			
			self.connect_handle = self.samrpipe.Connect2(None, security.SEC_FLAG_MAXIMUM_ALLOWED)
		except ldb.LdbError, (num, msg):
			self.SetError(msg,num)
			return False;
		except Exception,e:
			self.SetError(e.message,0)
			return False;
		else:
			if not self.creds.is_anonymous():
				self.auth_success = True;
			else:
				self.SetError('No esta permitido el bindeo anonimo',0)
				return False;
				
		return True;
		
		
	def isAuthenticate(self):
		return self.auth_success;

	def _GetBase(self):
		if(self.isAuthenticate()):
			try:
				LdapSearchResult = self.LdapConn.search("", scope=ldb.SCOPE_BASE, attrs=["namingContexts", "defaultNamingContext", "schemaNamingContext","configurationNamingContext","ldapServiceName"])
				#self.RootDSE = LdapSearchResult[0]["defaultNamingContext"];
				self.RootDSE = str(self.LdapConn.get_root_basedn());
				self.DnsDomain = str(LdapSearchResult[0]["ldapServiceName"]).split(':')[0];
				self.schemaNamingContext = LdapSearchResult[0]["schemaNamingContext"][0];
				self.SambaVersion = version;
				
			except ldb.LdbError, (num, msg):
				self.SetError(msg,num)
				return False;
			except Exception,e:
				self.SetError(e.message,0)
				return False;
			else:
				return True;
		else:
			self.SetError('Error de autenticacion',0);
			return False;


	def _GetDomainNames(self):
		if (self.samrpipe == None): # not connected
			return None
		
		self.domain_name_list = []
		
		self.sam_domains = self.toArray(self.samrpipe.EnumDomains(self.connect_handle, 0, -1))
		for (rid, domain_name) in self.sam_domains:
			self.domain_name_list.append(self.GetLsaString(domain_name))
		
		return self.domain_name_list


	def _SetCurrentDomain(self, domain_index):
		self.domain = self.sam_domains[domain_index]
		self.domain_sid = self.samrpipe.LookupDomain(self.connect_handle, self.domain[1])
		self.domain_handle = self.samrpipe.OpenDomain(self.connect_handle, security.SEC_FLAG_MAXIMUM_ALLOWED, self.domain_sid)

	def close(self):
		if (self.samrpipe != None):
			self.samrpipe.Close(self.connect_handle)

	def SetError(self,message,number):
		self.LastErrorStr = message;
		self.LastErrorNumber = number;
		#self.Log.LogError(message);
		self._isLastErrorAvailable=True;
			
	def IHaveError(self):
		return self._isLastErrorAvailable;
	
	@staticmethod
	def toArray((handle, array, num_entries)):
		ret = []
		for x in range(num_entries):
			ret.append((array.entries[x].idx, array.entries[x].name))
		return ret

	@staticmethod
	def GetLsaString(str):
		return str.string
	
	@staticmethod
	def SetLsaString(str):
		lsa_string = lsa.String()
		lsa_string.string = unicode(str)
		lsa_string.length = len(str)
		lsa_string.size = len(str)
		
		return lsa_string
