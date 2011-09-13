import logging
import base64
import time
from swat.model.base import *;
from samba.hostconfig import SharesContainer
from pylons import response

log = logging.getLogger(__name__)

class ShareModel(BaseModel):
	__supported_backends = ('classic', 'ldb');
	def __init__(self,username,password):
		BaseModel.__init__(self,username,password);
		self.share_list = []
		self.max_buffer = -1
		self.resume_handle_conn = 0x00000000
		self.resume_handle_share = 0x00000000
		if self.isAuthenticate():
			self.server_unc = ''.join(['\\',self.server_address])
			self.LoadShareList();
		
		#self.sam_shares = self.toArray(self.samrpipe.EnumDomainshares(self.domain_handle, 0, -1))
		
		#for (rid, sharename) in self.sam_shares:
		#	share = self.Getshare(rid)
		#	self.share_list.append(share)
		#log.debug("Configured backend is: " + self.lp.get("share backend") + " so the Class Name will be " + self.lp.get("share backend").title())


		#self.share_list = backend.GetShareList()
	def LoadShareList(self):
		try:
			info_ctr = srvsvc.NetShareInfoCtr()
			info_ctr.level = 502
			(info_ctr, totalentries, self.resume_handle_share) = self.srvsvcpipe.NetShareEnum(self.server_unc, info_ctr,self.max_buffer,self.resume_handle_share)
			if totalentries != 0:
				ResourceList = info_ctr.ctr.array
				for i in ResourceList:
				
					share = Share(i.name,i.path,i.type);
					share.comment = i.comment
					share.current_users = i.current_users
					share.max_users= i.max_users
					share.password = i.password
					share.permissions = i.permissions
					#share.sd_buf = i.
					
					self.share_list.append(share);
					#response.write(str(i.permissions)+'\n');
					#response.write(i.name+'\n');
				
		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
				return False;
			else:
				self.SetError(e.args,0)
				return False;
		return True;

	def GetShareList(self):
	
		return self.share_list;

	def GetShare(share = None):
		return share

	def UpdateShare(self,group):
		if not self.isAuthenticate():
			self.SetError('Usted no esta autenticado',0)
			return False;
		try:
			pass
		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
			else:
				self.SetError(e.args,0)
			return False;
		return True;

	def test(self):

		return self.share_list;
				
				
class Share:
	def __init__(self,name,path,stype):
		self.name = name
		self.comment = ""
		self.stype = stype
		self.current_users = 0x00000000
		self.max_users= 0xFFFFFFFF
		self.password = ""
		self.path = path
		self.permissions = 0
		self.sd_buf =  security.sec_desc_buf()


	def ToShareInfo502(self):
		share = srvsvc.NetShareInfo502()

		share.comment = unicode(self.comment)
		share.name = unicode(self.name)
		share.type = self.stype
		share.current_users = self.current_users
		share.max_users= self.max_users
		share.password = self.password
		share.path = self.path
		share.permissions = self.permissions
		share.sd_buf =  self.sd_buf

		return share
