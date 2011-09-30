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
		

	def LoadShareList(self):
		try:
			info_ctr = srvsvc.NetShareInfoCtr()
			info_ctr.level = 502
			(info_ctr, totalentries, self.resume_handle_share) = self.srvsvcpipe.NetShareEnum(self.server_unc, info_ctr,self.max_buffer,self.resume_handle_share)
			if totalentries != 0:
				ResourceList = info_ctr.ctr.array
				for i in ResourceList:
					share = self.Info502ToShare(i);
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

	def GetShare(self,name):
		if not self.isAuthenticate():
			self.SetError(self.Lang.NotAuth,0)
			return False;
		try:
			name = unicode(name)
			info = self.srvsvcpipe.NetShareGetInfo(self.server_unc, name, 502);
			share = self.Info502ToShare(info);
		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
			else:
				self.SetError(e.args,0)
			return False;
		return share

	def UpdateShare(self,share):
		if not self.isAuthenticate():
			self.SetError(self.Lang.NotAuth,0)
			return False;
		try:
			parm_error = 0x00000000
			share=share.ToShareInfo502();
			parm_error = self.srvsvcpipe.NetShareSetInfo(self.server_unc,share.name,502, share, parm_error);
			if(parm_error!=0x00000000):
				raise Exception(parm_error,"Error NetShareSetInfo");
		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
			else:
				self.SetError(e.args,0)
			return False;
		return True;

	def Info502ToShare(self,info):
		share = Share(info.name,info.path,info.type);
		share.comment = info.comment;
		share.current_users = info.current_users;
		share.max_users= info.max_users;
		share.password = info.password;
		share.permissions = info.permissions;
		#share.sd_buf = i.
		return share;

	def AddShare(self, name, path, comment=None):
		rid=-1;
		if not self.isAuthenticate():
			self.SetError(self.Lang.NotAuth,0)
			return False;
		try:
			#NetShareAdd(server_unc, level, info, parm_error)
			parm_error = 0x00000000
			info = srvsvc.NetShareInfo2()
			info.name = unicode(name)
			info.path = unicode(path)
			if comment is not None:
				info.comment = unicode(comment)
			ret = self.srvsvcpipe.NetShareAdd(self.server_unc,2,info,parm_error)
			if(parm_error!=0x00000000):
				raise Exception(parm_error,"Error NetShareAdd");
		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
				return False;
			else:
				self.SetError(e.args,0)
				return False;
		return True;

	def DeleteShare(self,name):
		rid=-1;
		if not self.isAuthenticate():
			self.SetError(self.Lang.NotAuth,0)
			return False;
		try:
				#NetShareDel(server_unc, share_name, reserved) -> None
				name = unicode(name)
				self.srvsvcpipe.NetShareDel(self.server_unc,name,0)
				
		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
				return False;
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
		self.permissions = 0 # reserved , has to defined to 0 as in MS-Srvs
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
