    #Below is from __init__():
     
            binding = ["ncacn_np:%s", "ncacn_ip_tcp:%s", "ncalrpc:%s"][transport_type]
           
            self.pipe = samr.samr(binding % (server_address), credentials = creds)
            self.connect_handle = self.pipe.Connect2(None, security.SEC_FLAG_MAXIMUM_ALLOWED)
           
            #TODO: this is a test
            connection_info = samr.ConnectInfo1
            self.connect_other_handle = self.pipe.Connect5(None,
                                                           security.SEC_FLAG_MAXIMUM_ALLOWED,
                                                           1,
                                                           connection_info)
     
     
     
     
    #Below is from update_user():
     
            info = self.pipe.QueryUserInfo(user_handle, samr.UserControlInformation)
            if (user.must_change_password):
                info.acct_flags |= samr.ACB_PW_EXPIRED
            else:
                info.acct_flags &= ~samr.ACB_PW_EXPIRED
     
            if (user.password_never_expires):
                info.acct_flags |= samr.ACB_PWNOEXP
            else:
                info.acct_flags &= ~samr.ACB_PWNOEXP
               
            if (user.account_disabled):
                info.acct_flags |= samr.ACB_DISABLED
            else:
                info.acct_flags &= ~samr.ACB_DISABLED
     
            if (user.account_locked_out):
                info.acct_flags |= samr.ACB_AUTOLOCK
            else:
                info.acct_flags &= ~samr.ACB_AUTOLOCK
            self.pipe.SetUserInfo(user_handle, samr.UserControlInformation, info)
     
            #TODO: this is a test fix for the must_change_password bug
            if user.rid == 1035:
                info = self.pipe.QueryUserInfo(user_handle, samr.UserAllInformation)
                if (user.must_change_password):
                    info.acct_flags |= samr.ACB_PW_EXPIRED
                else:
                    info.acct_flags &= ~samr.ACB_PW_EXPIRED
                info.fields_present = samr.SAMR_FIELD_ACCT_FLAGS
               
                new_user_handle = self.pipe.OpenUser(self.domain_other_handle, security.SEC_STD_WRITE_DAC | security.SEC_STD_READ_CONTROL | samr.SAMR_USER_ACCESS_GET_GROUPS | samr.SAMR_USER_ACCESS_SET_PASSWORD | samr.SAMR_USER_ACCESS_GET_ATTRIBUTES | samr.SAMR_USER_ACCESS_SET_ATTRIBUTES | samr.SAMR_USER_ACCESS_SET_LOC_COM, user.rid)
                self.pipe.SetUserInfo(new_user_handle, samr.UserAllInformation, info)
                #self.pipe.SetUserInfo(user_handle, samr.UserAllInformation, info)
               
                info = self.pipe.QueryUserInfo(user_handle, samr.UserAllInformation)
                pass
#Below is from __init__():

        binding = ["ncacn_np:%s", "ncacn_ip_tcp:%s", "ncalrpc:%s"][transport_type]
        
        self.pipe = samr.samr(binding % (server_address), credentials = creds)
        self.connect_handle = self.pipe.Connect2(None, security.SEC_FLAG_MAXIMUM_ALLOWED)
        
        #TODO: this is a test
        connection_info = samr.ConnectInfo1
        self.connect_other_handle = self.pipe.Connect5(None, 
                                                       security.SEC_FLAG_MAXIMUM_ALLOWED, 
                                                       1, 
                                                       connection_info)




#Below is from update_user():

        info = self.pipe.QueryUserInfo(user_handle, samr.UserControlInformation)
        if (user.must_change_password):
            info.acct_flags |= samr.ACB_PW_EXPIRED
        else:
            info.acct_flags &= ~samr.ACB_PW_EXPIRED

        if (user.password_never_expires):
            info.acct_flags |= samr.ACB_PWNOEXP
        else:
            info.acct_flags &= ~samr.ACB_PWNOEXP
            
        if (user.account_disabled):
            info.acct_flags |= samr.ACB_DISABLED
        else:
            info.acct_flags &= ~samr.ACB_DISABLED

        if (user.account_locked_out):
            info.acct_flags |= samr.ACB_AUTOLOCK
        else:
            info.acct_flags &= ~samr.ACB_AUTOLOCK
        self.pipe.SetUserInfo(user_handle, samr.UserControlInformation, info)

        #TODO: this is a test fix for the must_change_password bug
        if user.rid == 1035:
            info = self.pipe.QueryUserInfo(user_handle, samr.UserAllInformation)
            if (user.must_change_password):
                info.acct_flags |= samr.ACB_PW_EXPIRED
            else:
                info.acct_flags &= ~samr.ACB_PW_EXPIRED
            info.fields_present = samr.SAMR_FIELD_ACCT_FLAGS
            
            new_user_handle = self.pipe.OpenUser(self.domain_other_handle, security.SEC_STD_WRITE_DAC | security.SEC_STD_READ_CONTROL | samr.SAMR_USER_ACCESS_GET_GROUPS | samr.SAMR_USER_ACCESS_SET_PASSWORD | samr.SAMR_USER_ACCESS_GET_ATTRIBUTES | samr.SAMR_USER_ACCESS_SET_ATTRIBUTES | samr.SAMR_USER_ACCESS_SET_LOC_COM, user.rid)
            self.pipe.SetUserInfo(new_user_handle, samr.UserAllInformation, info)
            #self.pipe.SetUserInfo(user_handle, samr.UserAllInformation, info)
            
            info = self.pipe.QueryUserInfo(user_handle, samr.UserAllInformation)
            pass