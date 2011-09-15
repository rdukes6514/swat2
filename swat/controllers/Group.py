import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from swat.lib.base import BaseController, render,json,jsonpickle
from swat.model.GroupModel import GroupModel,Group;
import webhelpers.paginate;

log = logging.getLogger(__name__)

class GroupController(BaseController):

	def __init__(self):
		BaseController.__init__(self)
		if self._check_session():
			self.model = GroupModel(session['username'],session['password']);
			self.ChildNodes = [];

	def index(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
			
		groups = self.model.GetGroupList();

		start = int(request.params.get("start",0));
		limit = int(request.params.get("limit",18));

		query = request.params.get("query","");
		query = query.lower();
		fields = request.params.get("fields","");

		if query.strip() != '':
			if fields.count(',')>0:
				fields='username';
			
			if fields.strip() == '':
				fields='username';
				
			#if fields.strip() != '':
			#	fields='username';
			newgrouplist = [];
			for group in groups:
				if(fields=='rid'):
					if query.isdigit():
						query = int(query);
					
					if(group.rid!=query):
						continue;
				elif(fields=='name'):
					if(not group.name.lower().count(query)):
						continue;
				elif(fields=='description'):
					if(not group.description.lower().count(query)):
						continue;
				else:
					continue;
				
				newgrouplist.append(group);

			del groups
			groups=newgrouplist;
		
		total=len(groups);		
		Page = webhelpers.paginate.Page(groups, page=start, items_per_page=limit)

		for group in Page:
			self.ChildNodes.append({
				'name':group.name
				,'description':group.description
				,'rid':group.rid
				,'memberlist':group.memberlist
				,'icon':'group-icon'
				,'type':'group'
			});
		return jsonpickle.encode({"Nodos":self.ChildNodes,'total':total},unpicklable=False);

	def List(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
			
		from swat.model.UserModel import UserModel;
		self.UserModel = UserModel(session['username'],session['password']);
		
		groups = self.model.GetGroupList();
		for group in groups:
			self.ChildNodes.append({
				'name':group.name
				,'rid':group.rid
				,'type':2
			});
			
		users = self.UserModel.GetUserList();
		for user in users:
			self.ChildNodes.append({
				'name':user.username
				,'rid':user.rid
				,'type':1
			});
			
		return jsonpickle.encode({"Nodos":self.ChildNodes},unpicklable=False);

	def ListAll(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);

		groups = self.model.GetGroupList();
		for group in groups:
			self.ChildNodes.append({
				'name':group.name
				,'rid':group.rid
				,'type':2
			});
		return jsonpickle.encode({"Nodos":self.ChildNodes},unpicklable=False);

	def AddGroup(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
		try:
			name = request.params.get("name","");
			description = request.params.get("description","");
			rid=self.model.AddGroup(name);
			if(rid==False):
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
				
			group = self.model.GetGroup(rid);
			if(group==False):
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			group.description=description;
			if(self.model.UpdateGroup(group)==False):
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			self._UpdateMenbers(rid);
			
		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
				
		
		return json.dumps(self.successOK);

	def UpdateGroup(self):
		if not self._check_session():
			return json.dumps(self.AuthErr);
		try:
			
			rid = int(request.params.get("rid",-1));
			name = request.params.get("name","");
			description = request.params.get("description","");
			group = self.model.GetGroup(rid);
			if(group==False):
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			
			group = Group(name,description,rid);
			if(self.model.UpdateGroup(group)==False):
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)

			self._UpdateMenbers(rid);
			
		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
				
		
		return json.dumps(self.successOK);

	def _UpdateMenbers(self,rid):
		if not self._check_session():
			return json.dumps(self.AuthErr);
			

		oldmemberlist = request.params.get("oldmemberlist","")
		memberlist = request.params.get("memberlist","")

		if(oldmemberlist.count(',')==0):
			if(oldmemberlist.isdigit()):
				number = int(oldmemberlist);
				oldmemberlist=list();
				oldmemberlist.append(number);
			else:
				oldmemberlist=list()
		else:
			oldmemberlist = oldmemberlist.split(',')
			
		if(memberlist.count(',')==0):
			if(memberlist.isdigit()):
				number = int(memberlist);
				memberlist=list();
				memberlist.append(number);
			else:
				memberlist=list()
		else:
			memberlist = memberlist.split(',')
			
		memberdiff = set(oldmemberlist).difference(memberlist);
				

				
		for member_rid in memberdiff:
			self.model.DeleteGroupMember(rid,member_rid);
			
		memberdiff = set(memberlist).difference(oldmemberlist);

				
		for member_rid in memberdiff:
			self.model.AddGroupMember(rid,member_rid);

	def DeleteGroup(self):
		try:
			if not self._check_session():
				return json.dumps(self.AuthErr);
			
			rid = request.params.get("rid",-1)
			if(not self.model.DeleteGroup(rid)):
				raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			
		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
		return json.dumps(self.successOK)	


	def DeleteGroupList(self):
		try:
			if not self._check_session():
				return json.dumps(self.AuthErr);
			
			GroupList = request.params.get("GroupList","")
			if(GroupList.count(',')>0):
				GroupList = GroupList.split(',');
				for rid in GroupList:
					if(not self.model.DeleteGroup(rid)):
						raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)
			else:
				if(not self.model.DeleteGroup(GroupList)):
					raise Exception(self.model.LastErrorNumber,self.model.LastErrorStr)

		except Exception,e:
			if(len(e.args)>1):
				return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
			else:
				return json.dumps({'success': False, 'msg': e.args,'num':-1})
		return json.dumps(self.successOK)	

	def test(self):
		#rid=self.model.AddGroup('testgrp');
		#if (rid):
		#	return response.write(str(rid));
		#else:
		#	return response.write(self.model.LastErrorStr);
		#response.write('test');
		#
		#try:
		#	rid = int(request.params.get("rid",-1));
		#	self._UpdateMenbers(rid);
			
		#except Exception,e:
		#	if(len(e.args)>1):
		#		return json.dumps({'success': False, 'msg': e.args[1],'num':e.args[0]})
		#	else:
		#		return json.dumps({'success': False, 'msg': e.args,'num':-1})
		#return jsonpickle.encode(self.model.GetGroup(rid));
		#group = self.model.GetGroup(1145)
		#if(group):
			#group.description='aaa';
			#response.write(group.name);
		#	if (self.model.UpdateGroup(group)):
		#		return jsonpickle.encode('ok');
		#	else:
		#		return jsonpickle.encode(self.model.LastErrorStr);
		#else:
		#	return jsonpickle.encode(self.model.LastErrorStr);
		
		#return json.dumps(List);

		for i in range(1,10):
			rid=self.model.AddGroup('grp0'+str(i));
		
