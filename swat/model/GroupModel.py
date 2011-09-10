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
		group.memberlist=self.GetGroupMembers(rid);
		
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
		
	def GetGroupMembers(self,gid):

		try:
			gid = int(gid);
			group_handle = self.samrpipe.OpenGroup(self.domain_handle, security.SEC_FLAG_MAXIMUM_ALLOWED,gid)
			Menbers = self.samrpipe.QueryGroupMember(group_handle)
			#attributes = Menbers.attributes
			#response.write(str(count));
			MenberList=[];
			if(Menbers.count>0):
				MembersLookup=self.samrpipe.LookupRids(self.domain_handle,Menbers.rids);
				
				#response.write(str(Menbers.rids)+"\n");
				#response.write(str(type(MembersLookup[1].ids))+"\n");
				#response.write(str(dir(MembersLookup[0].names)));
				#response.write(str(self.GetLsaString(i)));
				#response.write(str(dir(MembersLookup[0].names)));
				k=0;
				for i in MembersLookup[0].names:
					#response.write(self.GetLsaString(i)+' '+str(MembersLookup[1].ids[k])+' '+str(Menbers.rids[k]));
					member = Member(self.GetLsaString(i),Menbers.rids[k],MembersLookup[1].ids[k]);
					MenberList.append(member);
					k+=1
				
			#response.write(str(MembersLookup));
					
			#		count,
			#		
					#[out,ref]     lsa_Strings *names,
					#[out,ref]     samr_Ids *types
			#		);
					#group = self.GetGroup(i);
					#MenberList.append({'name':group.name,'rid':rid});
					#MenberList.append({'rid':i});


		except Exception,e:
			if(len(e.args)>1):
				self.SetError(e.args[1],e.args[0])
			else:
				self.SetError(e.args,0)
			self.SetError(e.args,0)
			
			return False;

		return MenberList;

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
		

	def AddGroupMember(self,GroupRid,NewRid):
		try:
			GroupRid =  int(GroupRid);
			NewRid =  int(NewRid);
			group_handle = self.samrpipe.OpenGroup(self.domain_handle, security.SEC_FLAG_MAXIMUM_ALLOWED,GroupRid)
			self.samrpipe.AddGroupMember(group_handle,NewRid, samr.SE_GROUP_ENABLED)
		except Exception,e:
				self.SetError(e.args[1],e.args[0])
				raise Exception(str(e.args));


	def DeleteGroupMember(self,GroupRid,RemoveRid):
		try:
			GroupRid =  int(GroupRid);
			RemoveRid =  int(RemoveRid);
			group_handle = self.samrpipe.OpenGroup(self.domain_handle, security.SEC_FLAG_MAXIMUM_ALLOWED,GroupRid);
			self.samrpipe.DeleteGroupMember(group_handle,RemoveRid);
		except Exception,e:
				self.SetError(e.args[1],e.args[0])
				raise Exception(str(e.args));

class Group:
	""" Support Class obtained from Calin Crisan's 2009 Summer of Code project
	Extensions to GTK Frontends
	
	See: http://github.com/ccrisan/samba-gtk
	
	"""
	def __init__(self, name, description, rid):
		self.name = name
		self.description = description
		self.rid = rid
		self.memberlist = []
		
class Member:
	def __init__(self, name,rid,type):
		self.name = name
		self.rid = rid
		self.type = type

