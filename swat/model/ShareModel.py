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
		#self.sam_shares = self.toArray(self.samrpipe.EnumDomainshares(self.domain_handle, 0, -1))
		
		#for (rid, sharename) in self.sam_shares:
		#	share = self.Getshare(rid)
		#	self.share_list.append(share)
		log.debug("Configured backend is: " + self.lp.get("share backend") + " so the Class Name will be " + self.lp.get("share backend").title())

		if self.lp.get("share backend") in self.__supported_backends:
			self.__backend = "ShareBackend" + self.lp.get("share backend").title()
		else:
			log.error("Unsupported Backend (" + self.lp.get("share backend") + ")")

		if self.lp.get("share backend") in self.__supported_backends:
			backend = globals()["ShareBackend" + self.lp.get("share backend").title()](self.lp, {})

		self.share_list = backend.GetShareList()

	def GetShareList(self):
		return self.share_list;

	def GetShare(share = None):
		return share



class ShareBackend(object):
	""" ShareBackend """
	
	__param_prefix = "share_"
	
	def __init__(self, lp, params):
		""" """
		self._lp = lp
		self._params = self._clean_params(params)		

		self._share_list = []
		self.__error = {}

	def _clean_params(self, params):
		""" Copies all parameters starting with 'share_' in the current request
		object to a clean dictionary.
		
		All parameters submited through the form related to the share always
		use the prefix. This is so I can distinguish them from other random
		parameters that may be around.
		
		Keyword arguments:
		params -- contains the request.params object from Pylons
		
		"""
		clean_params = {}
		prefix_length = len(self.__param_prefix)
		
		for param in params:
			if param.startswith(self.__param_prefix):
				value = str(params.get(param))
				new_param = str(param[prefix_length:].replace('_', ' '))

				clean_params[new_param] = value

		return clean_params
	
	def _get_available_copy_name(self, to_copy):
		""" Checks the cached share_list for the nest available name to use for
		a copy operation.

		Keyword arguments:
		to_copy -- the original share name to be copies
		
		Returns:
		a new share name
		
		"""
		name = _("copy of") + " " + to_copy

		while self.share_name_exists(name):
			name = _("copy of") + " " + name

		return str(name)
	
	def GetShareList(self):
		""" Gets the Share list for the current Backend. """
		return self._share_list
	
	def GetShare(self, name):
		""" Gets a specific Share by its name from the _share_list member

		FIXME This method depends on the cached list from the backend when the
		Class if instantiated. It's only bad if we want to check on the state
		of the new object after it is altered; the new properties won't be
		reflected here.

		Keyword arguments:
		name -- The share name to search in the list
		
		Returns:
		A SambaShare object or None if the Share is not in the List
		
		"""
		for share in self._share_list:
			if share.GetShareName() == name:		
				return share

		return None
	
	def has_error(self):
		""" Checks if any errors have been set during in this Backend
		instance
		
		Returns:
		Boolean indicating if there are any errors set or not
		
		"""
		return len(self.__error['message']) == 0
	
	def _SetError(self, message, type='critical'):
		""" Sets the error message to indicate what has failed with the operation
		that was being done using this Backend
		
		Keyword arguments:
		message -- the error message
		type -- the type of error
		
		"""
		self.__error['message'] = message
		self.__error['type'] = type

	def GetErrorMessage(self):
		""" Gets the error message set in this instance.
		
		Returns:
		The message that was set in this instance
		
		"""
		if self.__error.has_key('message'):
			return self.__error['message']
		return ""
	
	def GetErrorType(self):
		""" Gets the error type set for the message in this instance
		
		Returns:
		The error type for the message that was set in this instance
		
		"""
		if self.__error.has_key('type'):
			return self.__error['type']
		return "critical"


class ShareBackendLdb(ShareBackend):
	""" ShareBackendLdb """
	
	__db_path = '/usr/local/samba/private/share.ldb'
	
	def __init__(self, lp, params, db_path=''):
		""" """
		super(ShareBackendLdb, self).__init__(lp, params)
		
		if len(db_path) > 0:
			self.__db_path = db_path
		
		self.__shares_db = ldb.Ldb()
		self.__shares_db.connect(self.__db_path)
		
		self.__populate_share_list()

	def __populate_share_list(self):
		""" Populate the share list using the LDB Backend.
		
		FIXME The root DN is always included in the returned list and I can't
		shake it off so for now this little hack will delete it from the list
		(it's always the last element)
		
		"""
		list = self.__shares_db.search(base="CN=SHARES", scope=ldb.SCOPE_SUBTREE)
		list = list[:len(list) - 1]
		
		for share in list:
			new_share = SambaShare()

			for k, v in share.items():
				if k == "dn":
					continue
				
				v = self.__shares_db.schema_format_value(k, v[0])
				new_share.add(k, v)
				
				if k == "name":
					new_share.SetShareName(v)
				
			self._share_list.append(new_share)
		
	def share_name_exists(self, name):
		""" Checks if a share exists in this Backend.
		
		Keyword arguments:
		name -- The share name to search in the list
		
		Returns:
		Boolean value indicating if the Share exists or not
		
		"""
		exists = False
		
		dn = "CN=" + str(name) + ",CN=Shares"
		share = self.__shares_db.search(base=dn, scope=ldb.SCOPE_SUBTREE)
		
		if share is not None and len(share) > 0:
			exists = True
		else:
			log.warning("Share " + name + " doesn't exist")
			
		return exists
	
	def __get_share_from_backend(self, name):
		""" Gets the share directly from the backend instead of getting it
		from the share_list cache
		
		Keyword arguments:
		name -- the share name to get from the backend
		
		Returns:
		The Share with its DN information and attributes or None if the share
		does not exists
		
		"""
		name = str(name).strip()
		
		dn = "CN=" + name + ",CN=Shares"
		share = self.__shares_db.search(base=dn, scope=ldb.SCOPE_SUBTREE)
		
		if share is not None and len(share) > 0:
			return share[0]
			
		return None
	
	def _get_available_copy_name(self, to_copy):
		""" Gets the first available Share name to use in a copy operation. We
		search LDB because if we selected multiple shares and use the normal
		share_name_exists the list in this instance would not be updated and we
		would get an error stating the the Share already exists.

		Keyword arguments:
		to_copy -- the original share name to be copies
		
		Returns:
		a new share name
		
		"""
		name = _("copy of") + " " + to_copy

		while self.share_name_exists(name):
			name = _("copy of") + " " + name

		return str(name)
		
	def store(self, name, is_new=False, old_name=''):
		""" Add/Save share information in LDB. If we are changing a Share's
		name we need to use old_name to specify the old name so the necessary
		renamings may be performed.
		
		Keyword arguments:
		name -- the name of the share to save the information
		is_new -- indicates if the share if new or not
		old_name -- the old share name (in case we are renaming)
		
		Returns:
		Sucess or insucess of the operation
		
		"""
		stored = False
		
		name = str(name).strip()
		old_name = str(old_name).strip()
		
		if not is_new and len(old_name) == 0:
			old_name = name
		
		try:
			if len(name) == 0:
				raise ShareError(_("You cannot add a Share with an empty name"))
				
			if not is_new and len(old_name) == 0:
				raise ShareError(_("You are modifying a Share name but the old name is missing"))
				
			if is_new and self.share_name_exists(name):
				raise ShareError(_("A Share with that name already exists"))
				
			if not is_new and not self.share_name_exists(old_name):
				raise ShareError(_("You are editing a Share that doesn't exist anymore"))

			dn = "CN=" + name + ",CN=Shares"
			old_dn = "CN=" + old_name + ",CN=Shares"

			# Rename the DN element before continuing
			if not is_new and name != old_name:
				self.__shares_db.rename(ldb.Dn(self.__shares_db, old_dn), dn)


			if is_new:
				share = ldb.Message(ldb.Dn(self.__shares_db, dn))
				share["name"] = ldb.MessageElement(name, \
												   ldb.CHANGETYPE_ADD, \
												   "name")
			else:
				share = self.__get_share_from_backend(name)
				
			modded_messages = ldb.Message(ldb.Dn(self.__shares_db, dn))
			
			if not is_new and name != old_name:
				modded_messages["name"] = ldb.MessageElement(name, \
															 ldb.FLAG_MOD_REPLACE, \
															 "name")
			
			# Replace existing attribute values
			for param, value in share.items():
				if param == "dn":
					continue
				
				if param in self._params:
					if len(self._params[param]) == 0:
						self._params[param] = []
					   
					modded_messages[param] = ldb.MessageElement(self._params[param], \
												  ldb.FLAG_MOD_REPLACE, param)
					del self._params[param]
	
			# Add the new attributes passed by the form
			for param, value in self._params.items():
				if len(value) > 0:
					modded_messages[param] = ldb.MessageElement(value, \
																ldb.CHANGETYPE_ADD, \
																param)
			if is_new:
				self.__shares_db.add(share)

			self.__shares_db.modify(modded_messages)
			stored = True
			
		except ShareError, error:
			self._SetError(error.message, error.type)
		except ldb.LdbError, error_message:
			self._SetError(_("Error copying Share: %s" % (error_message)), \
							"critical")

		return stored
	
	def delete(self, name):
		deleted = False

		#
		# FIXME the LDB class does not like this parameter because its type
		# is unicode instead of string so it need to be cast into a string.
		#
		name = str(name).strip()
		
		try:
			if len(name) == 0:
				raise ShareError(_("You did not specify a Share to remove"))

			if not self.share_name_exists(name):
				raise ShareError(_("The share you selected doesn't exist."))
			
			dn = "CN=" + name + ",CN=Shares"
			self.__shares_db.delete(ldb.Dn(self.__shares_db, dn))
			deleted = True
			
		except ShareError, error:
			self._SetError(error.message, error.type)
		except ldb.LdbError, error_message:
			self._SetError(_("Error copying Share: %s" % (error_message)), \
							"critical")

		return deleted

	def copy(self, name):
		""" Copy a share with a certain name on the selected backend
		
		FIXME There is no way outside this method to test if the copied share
		exsits.
		
		"""
		copied = False

		#
		# FIXME the LDB class does not like this parameter because its type
		# is unicode instead of string so it need to be cast into a string.
		#
		name = str(name).strip()

		try:
			if len(name) == 0:
				raise ShareError(_("You did not specify a Share to copy"), \
								 "critical")
					
			if self.share_name_exists(name):
				share = self.__get_share_from_backend(name)
			else:
				raise ShareError(_("The share you selected doesn't exist."))

			copy_name = self._get_available_copy_name(name)
			
			dn = "CN=" + name + ",CN=Shares"
			copy_dn = "CN=" + copy_name + ",CN=Shares"

			copy_share = ldb.Message(ldb.Dn(self.__shares_db, copy_dn))
			
			for param, value in share.items():
				if param == "dn":
					continue
				
				if param == "name":
					value = copy_name
				
				copy_share[param] = ldb.MessageElement(value, \
													   ldb.CHANGETYPE_ADD, \
													   param)
			
			self.__shares_db.add(copy_share)
			copied = True
			
		except ShareError, error:
			self._SetError(error.message, error.type)
		except ldb.LdbError, error_message:
			self._SetError(_("Error copying Share: %s" % (error_message)), \
							"critical")
			
		return copied
	
	def toggle(self, name=''):
		self._SetError(_("Unsupported Operation"), "critical")

class ShareBackendClassic(ShareBackend):
	""" Handles operations regarding the Classic Backend method to store share
	information. The classic method stores shares in the smb.conf file
	
	"""
	def __init__(self, lp, params):
		""" Constructor. Loads the smb.conf contents into a List to be used
		by each of the operations allowed by this backend
		
		TODO Don't load smb.conf content here. Most of the time is unncessary.
		
		Keyword arguments
		smbconf -- last smb.conf file loaded by the param module
		params -- request parameters passed by the share information form
		
		"""
		super(ShareBackendClassic, self).__init__(lp, params)
		
		self.__smbconf = self._lp.configfile
		
		self.__smbconf_content = []
		self.__load_smb_conf_content()
		
		self.__populate_share_list()

	def __populate_share_list(self):
		""" Populate a List containing the available Shares list in the
		selected backend.
		
		"""
		#for share_name in shares.SharesContainer(self._lp).keys():
		for share_name in SharesContainer(self._lp).keys():
			share = SambaShare(self._lp)
			share.SetShareName(share_name)
			
			self._share_list.append(share)

	def share_name_exists(self, name):
		""" Checks if a Share exists in the Classic Backend. We reload the
		configuration file to make sure no modifications occured since we last
		loaded the file.
		
		Keyword arguments:
		name -- the share name to check
		
		Returns:
		True of False indicating if the Share exists or not
		
		"""
		slp = param.LoadParm()
		slp.load(self._lp.configfile)
		
		#for share in shares.SharesContainer(slp).keys():
		for share in SharesContainer(slp).keys():
			if share == name:		
				return True

		log.warning("Share " + name + " doesn't exist")
		return False
	
	def store(self, name, is_new=False, old_name=''):
		""" Store a Share, either from an edit or add.
		
		Breaks down the current smb.conf to find the chosen section (if editing)
		and recreates that section with the new values. Maintains comments that
		may be around that section.
		
		If we are adding a new share it's just added to the end of the file
		
		Keyword arguments:
		name -- Specify the name of the share to store.
		is_new -- Indicates if it's a new share (or not)
		old_name -- The old name of the share. Used for already existing shares
		and when the name if being changed.
		
		Returns:
		A boolean value indicating if the share was stored correctly
		
		"""
		name = name.strip()
		old_name = old_name.strip()
		
		if not is_new and len(old_name) == 0:
			old_name = name
			
		stored = False
		section = []
		
		try:
			if len(name) == 0:
				raise ShareError(_("You cannot add a Share without a name"))
				
			if not is_new and len(old_name) == 0:
				raise ShareError(_("You are modifying a Share name but the old name is missing"))
				
			if is_new and self.share_name_exists(name):
				raise ShareError(_("You are trying to add a Share that already exists"))
			
			if not is_new:
				if self.share_name_exists(old_name):
					pos = self.__get_section_position(old_name)
					section = self.__smbconf_content[pos['start']:pos['end']]
					
					before = self.__smbconf_content[0:pos['start']]
					after = self.__smbconf_content[pos['end']:]
				else:
					#
					#   Have to break it here to avoid "tricks" downstairs :P
					#
					self._SetError(_("You are trying to save a Share\
									that doesn't exist"), "critical")
					return False
			else:
				before = self.__smbconf_content
				after = []
			
			new_section = self.__recreate_section(name, old_name, section)
			
			if self.__save_smbconf([before, new_section, after]):
				if self.__section_exists(name):
					stored = True
				else:
					self._SetError(_("Could not add/edit that Share. \
									  No idea why..."), "warning")
			
		except ShareError, error:
			self._SetError(error.message, error.type)

		return stored
	
	def delete(self, name):
		""" Deletes a share from the backend.
		
		Keyword arguments:
		name -- the name of the share to be deleted
		
		Returns:
		A boolean value indicating if the Share was deleted sucessfuly
		
		"""
		deleted = False
		name = name.strip()
		
		try:
			if len(name) == 0:
				raise ShareError(_("You did not specify a Share to be removed."))
				
			if not self.share_name_exists(name):
				raise ShareError(_("Can't delete a Share that doesn't exist!"))

			pos = self.__get_section_position(name)
			
			if pos['start'] == -1:
				raise ShareError(_("You did not specify a Share to be removed."))
	
			before = self.__smbconf_content[0:pos['start']]
			after = self.__smbconf_content[pos['end']:]
			
			if self.__save_smbconf([before, after]):
				if self.__section_exists(name):
					self._SetError(_("Could not delete that Share.\
									 The Share is still in the Backend.\
									 No idea why..."), "critical")
				else:
					deleted = True

		except ShareError, error:
			self._SetError(error.message, error.type)
		
		return deleted
	
	def copy(self, name):
		""" Copies a Share.
		
		Returns a boolean value indicating if the Share was copied sucessfuly
		
		BUG: Can't repeat the same share twice due to name conflict. If you try
		to copy 'test' once it will create 'copy of test'. If you try copy again
		it will fail because 'copy of test' already exists.
		
		"""
		copied = False
		name = name.strip()
		
		try:
			if len(name) == 0:
				raise ShareError(_("Can't copy Share with an empty name"))
				
			if not self.share_name_exists(name):
				raise ShareError(_("Did not duplicate Share because the original doesn't exist!"))
				
			new_name = self._get_available_copy_name(name)

			if self.share_name_exists(new_name):
				raise ShareError(_("Did not duplicate Share because the copy already exists!"))	   
			
			pos = self.__get_section_position(name)
			section = self.__smbconf_content[pos['start']:pos['end']]
			
			new_section = self.__recreate_section(new_name, None, section)
		
			before = self.__smbconf_content[0:pos['start']]
			after = self.__smbconf_content[pos['end']:]

			if self.__save_smbconf([before, section, new_section, after]):
				if self.__section_exists(new_name):
					copied = True
				else:
					self._SetError(_("Could not copy that Share. No idea why..."), "warning")

		except ShareError, error:
			self._SetError(error.message, error.type)

		return copied
	
	def toggle(self, name=''):
		self._SetError("Toggle Not Implemented", "warning")
		return False
	
	def __recreate_section(self, name, old_name, section):
		""" Recreate the section we are editing/adding with the new values
		
		Keyword arguments:
		name -- the name of the section
		section -- split list of the smb.conf contents containing just the
		information from the chosen section. to obtain the section "coordinates"
		call self.__get_section_position(name)
		
		Returns the new section to write to the backend
		
		"""
		import re
		
		if len(section) > 0 and old_name:
			new_section = []
			new_section.append(section[0].replace(old_name, name))
		else:
			new_section = ['\n[' + name + ']\n']
		
		#   Scan the current section in search for existing values. I could
		#   just dump the content of params but this will keep other things
		#   that the user might have written to the file; a comment on a param
		#   for example
		#
		for line in section[1:]:
			line_param = re.search("(.+)=(.+)", line)
			
			if line_param is not None:
				param = line_param.group(1).strip()
				value = line_param.group(2).strip()

				if param in self._params:
					if len(self._params[param]) > 0:
						line = "\t" + param + " = " + self._params[param] + "\n"
						del self._params[param]
					else:
						line = ""
				else:
					line = "\t" + param + " = " + value + "\n"
			
			new_section.append(line)
			
		#   Now we dump the params file.
		#   With the already handled key=>values deleted we can safely add all
		#   of the available parameters from the POST
		#
		#   TODO: Should we still write values if they are equal to the
		#   default? This would keep smb.conf cleaner.
		#
		for param, value in self._params.items():
			if len(value) > 0:
				line = "\t" + param + " = " + value + "\n"
				new_section.append(line)

		return new_section
	
	def __load_smb_conf_content(self):
		""" Loads the smb.conf into a List using readlines()
		
		Returns a boolean value indicating if the file's content was loaded or
		not.
		
		"""
		file_exists = False
		
		try:
			stream = open(self.__smbconf, 'r')
		except IOError:
			file_exists = False
		else:
			file_exists = True
			
		if file_exists:
			self.__smbconf_content = stream.readlines()
			stream.close()

		return file_exists
	
	def __section_exists(self, name):
		""" Checks if a section exists in the loaded smb.conf file. Also reloads
		the contents of the backend so we can always check against an updated
		copy without reloading LoadParm.
		
		I think it's better to reload param.LoadParm but I'll keep it like this
		for now :)
		
		Keyword arguments:
		name -- the share name
		
		Returns a Boolean value indicating if the section exists or not
		
		"""
		self.__load_smb_conf_content()
		
		exists = False
		position = -1
		
		try:
			position = self.__smbconf_content.index('[' + name + ']\n')
			exists = True
		except ValueError:
			self._SetError("Share doesn't exist!", "critical")
			position = -1
		
		return exists
		
	def __get_section_position(self, name):
		""" Gets the position (in terms of line numbers) of where the section
		we are handling starts and ends.
		
		Keyword arguments
		name -- the name of the current section. normally the share name we are
		taking care of
		
		Returns a dictionary containing the start and end line numbers.
		
		"""
		import re
		
		position = {}
		position['start'] = -1
		position['end'] = -1
		
		try:
			position['start'] = self.__smbconf_content.index('[' + name + ']\n')
		except ValueError:
			self._SetError("Share doesn't exist!", "critical")
			position['start'] = -1
			
			return position
		
		line_number = position['start'] + 1

		for line in self.__smbconf_content[line_number:]:
			m = re.search("\[(.+)\]", line)
			
			if m is not None:
				position['end'] = line_number - 1
				break
			
			line_number = line_number + 1
			
		if position['end'] == -1:
			position['end'] = len(self.__smbconf_content)

		return position
	
	def __save_smbconf(self, what):
		""" Saves the changes made to smb.conf
		
		Keyword arguments:
		what -- the stuff we are going to write to the backend
		
		"""
		import shutil
		import os
		
		written = False
		abort = False
		stream = None
		
		try:
			stream = open(self.__smbconf + ".new", 'w')

			if len(what) > 0:
				
				for area in what:
					for line in area:
						try:
							stream.write(line)
						except UnicodeEncodeError, msg:
							log.fatal("Can't write line; " + line + "; " + str(msg))
							self._SetError(_("Could not write data into the backend.") + " -- " + str(msg), "critical")
							abort = True
							break
						except Exception, msg:
							log.fatal("Can't write line; " + line + "; " + str(msg))
							self._SetError(_("Could not write data into the backend.") + " -- " + str(msg), "critical")
							abort = True
							break
					
					if abort:
						break
					
				if abort:
					log.warning("Did not write anything to the temporary file;")
				else:
					try:
						shutil.move(self.__smbconf, self.__smbconf + ".old")
						shutil.move(self.__smbconf + ".new", self.__smbconf)
					except IOError, msg:
						log.fatal("Can't replace old smb.conf; " + str(msg))
						self._SetError(_("Could not replace old backend configuration with new one") + " -- " + str(msg), "critical")
					except Exception, msg:
						log.fatal("Can't replace old smb.conf; " + str(msg))
						self._SetError(_("Could not replace old backend configuration with new one") + " -- " + str(msg), "critical")
					else:
						written = True
					
					try:	
						os.remove(self.__smbconf + ".new")
					except:
						log.warning("could not remove temporary save file")
			else:
				log.info("Nothing to write. Won't touch smb.conf")
				self._SetError(_("Nothing to write. Won't touch smb.conf") + " -- " + str(msg), "warning")
		except IOError, msg:
			log.fatal("can't write changes to temporary file; " + str(msg))
			self._SetError(_("Can't write changes to temporay file. Writing aborted!") + " -- " + str(msg), "critical")
		finally:
			stream.close()

		return written


class SambaShare(object):
	""" Stores Share information regardless of the backend. Due to the fact
	that both backend have their own way of accessing Shares, I created this
	class so that I can seamlessly handle both backends with the same code.
	
	FIXME There could be a fake 'name' parameter (when using get(...)) for the
	Classic Backend. It would have been useful for the tests :P
	
	"""
	def __init__(self, lp=None):
		""" """
		self.__share_name = ""
		self.__params = {}
		self.__lp = lp
		
	def is_classic(self):
		""" Checks if the current Share is of the Classic Backend.
		
		This method was created because the permissions parameter is returned
		as Decimal in the LDB Backend and Decimal in the Classic Backend but
		who knows; maybe it will be good to have in other situations.

		"""
		if self.__lp is not None:
			return True
		return False
		
	def add(self, key, value):
		""" Add a key-value pair for the current Share instance. This will
		map to a parameter
		
		Keyword arguments
		key -- The parameter name
		value -- The parameter value
		
		"""
		self.__params[key] = value
		
	def get(self, key):
		""" Gets the value for a specific parameter key.
		
		FIXME Due to the fact that the Classic (using LoadParm) backend does
		not specify the chosen parameters explicitly (like LDB) we need to
		specify the LoadParm instance for each Share instance. I suppose it
		would be better to load the chosen parameters for the Share and avoid
		this hack but that will be something to do later. For now I guess it's
		ok.
		
		Keyword arguments:
		key -- The parameter that we want the value from
		
		Returns:
		The parameter's value or an empty string if the parameter does not exist
		
		"""
		
		key = key.replace('-', ' ')
		
		if self.__lp  is not None:
			return self.__lp.get(key, self.__share_name)
		elif self.__params.has_key(key) == True:
			return self.__params[key]
			
		return ""
	
	def has_key(self, key):
		""" Checks if the current share as a certain parameter key. This will
		be used only in the LDB Backend when saving during the edit action.
		
		FIXME All those returns blergh :P
		
		Keyword arguments:
		key -- The parameter key that we want to check if it exists
		
		Returns:
		Boolean indicating if the parameter exists or not
		
		"""
		if self.__lp is not None:
			return False
		elif self.__params.has_key(key):
			return True
		else:
			return False
	
	def SetShareName(self, name):
		""" Set the share name for the current Share instance. This will allow
		us to not depend on a key-value pair for this important value.
		
		Keyword arguments:
		name -- The name of the Share
		
		"""
		self.__share_name = name
		
	def GetShareName(self):
		""" Gets the share name for the current Share instance.
		
		Returns:
		The share name of the current Share instance
		
		"""
		return self.__share_name

class ShareError(Exception):
	""" Just testing! """
	def __init__(self, message, type='critical'):
		Exception.__init__(self, message)
		self.type = type

