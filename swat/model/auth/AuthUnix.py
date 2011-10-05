import PAM ,sys,pwd
from swat.model.auth.AuthBase import AuthBase

class AuthUnix(AuthBase):
	def __init__(self,user,password,Lang):
		AuthBase.__init__(self,user,password,Lang)
		self.service = 'passwd'
		self.PamAuth = PAM.pam()
		self.PamAuth.start(self.service)
		self.PamAuth.set_item(PAM.PAM_USER, self.user)
		self.PamAuth.set_item(PAM.PAM_CONV, self._pam_conv)


	def Autenticate(self):
		authenticated = False

		try:
			user_info = pwd.getpwnam(self.user)
			if (user_info.pw_uid !=0):
				raise Exception(self.Lang.OnlyAllowRoot)
			self.PamAuth.authenticate()
			self.PamAuth.acct_mgmt()
		except PAM.error, (resp, code):
			self.SetError(resp,code)
			self.logger.info('PAM.error')
		except Exception,e:
			if(len(e.args)>1):
				self.logger.info("%s %s" % (e.args[1],e.args[0]))
				self.SetError(e.args[1],e.args[0])
			else:
				self.logger.info("%s " % (e.args[0]))
				self.SetError(e.args,0)
		else:
			authenticated = True
		return authenticated

	def _pam_conv(self,auth,query_list, userData):
		resp = []
		for i in range(len(query_list)):
			query, type = query_list[i]
			if type == PAM.PAM_PROMPT_ECHO_ON:
				resp.append((self.user, 0))
			elif type == PAM.PAM_PROMPT_ECHO_OFF:
				resp.append((self.password, 0))
			elif type == PAM.PAM_PROMPT_ERROR_MSG or type == PAM.PAM_PROMPT_TEXT_INFO:
				resp.append(('', 0))
			else:
				return None

		return resp
		

