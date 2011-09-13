import logging
import base64
import time
from swat.model.base import *;
from samba.hostconfig import SharesContainer

log = logging.getLogger(__name__)

class ShareModel(BaseModel):
	__supported_backends = ('classic', 'ldb');
	def __init__(self,username,password):
		BaseModel.__init__(self,username,password);
		self.share_list = []
		self.server_unc = ''.join(['\\',self.server_address])
		
		#self.sam_shares = self.toArray(self.samrpipe.EnumDomainshares(self.domain_handle, 0, -1))
		
		#for (rid, sharename) in self.sam_shares:
		#	share = self.Getshare(rid)
		#	self.share_list.append(share)
		#log.debug("Configured backend is: " + self.lp.get("share backend") + " so the Class Name will be " + self.lp.get("share backend").title())


		#self.share_list = backend.GetShareList()

	def GetShareList(self):
		return self.share_list;

	def GetShare(share = None):
		return share


