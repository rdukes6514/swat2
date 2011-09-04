import base64
import time
from pylons import response
from swat.model.base import *;



class GroupModel(BaseModel):

	def __init__(self,username,password):
		BaseModel.__init__(self,username,password);
		self.group_list = []
		if self.isAuthenticate():
			self.sam_groups = self.toArray(self.samrpipe.EnumDomainGroups(self.domain_handle, 0, -1))
			for (rid, groupname) in self.sam_groups:
				group = self.GetGroup(rid)
				self.group_list.append(group)
		
	
	def GetGroupList(self):
		return self.group_list;
		
	def GetGroup(self, rid, group = None):
		group_handle = self.samrpipe.OpenGroup(self.domain_handle, security.SEC_FLAG_MAXIMUM_ALLOWED, rid)
		info = self.samrpipe.QueryGroupInfo(group_handle, 1)
		group = self.QueryInfoToGroup(info, group)
		group.rid = rid
		
		return group

	def QueryInfoToGroup(self, query_info, group = None):
		if (group == None):
			group = Group(self.GetLsaString(query_info.name), 
						  self.GetLsaString(query_info.description),  
						  0)
		else:
			group.name = self.GetLsaString(query_info.name)
			group.description = self.GetLsaString(query_info.description)
		
		return group
		
	def GetGroupUsers(self,gid):
		pass
		
	def GetUserGroups(self,rid):
		rid = int(rid);
		user_handle = self.samrpipe.OpenUser(self.domain_handle, security.SEC_FLAG_MAXIMUM_ALLOWED,rid)
		rids = self.samrpipe.GetGroupsForUser(user_handle).rids
		GroupList=[];
		for i in rids:
			rid = i.rid;
			group = self.GetGroup(i.rid);
			GroupList.append({'name':group.name,'rid':rid});
		return GroupList;
		


class Group:
	""" Support Class obtained from Calin Crisan's 2009 Summer of Code project
	Extensions to GTK Frontends
	
	See: http://github.com/ccrisan/samba-gtk
	
	"""
	def __init__(self, name, description, rid):
		self.name = name
		self.description = description
		self.rid = rid
