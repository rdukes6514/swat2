/*
typedef  enum _SID_NAME_USE 
{ 
 SidTypeUser = 1, 
  SidTypeGroup, 
  SidTypeDomain, 
  SidTypeAlias, 
  SidTypeWellKnownGroup, 
  SidTypeDeletedAccount, 
  SidTypeInvalid, 
  SidTypeUnknown, 
  SidTypeComputer, 
  SidTypeLabel 
} SID_NAME_USE,  

SidTypeUser:  Indicates a user object. 
SidTypeGroup:  Indicates a group object.
SidTypeDomain:  Indicates a domain object. 
SidTypeAlias:  Indicates an alias object. 
SidTypeWellKnownGroup:  Indicates an object whose SID is invariant. 
SidTypeDeletedAccount:  Indicates an object that has been deleted. 
SidTypeInvalid:  This member is not used. 
SidTypeUnknown:  Indicates that the type of object could not be determined. For example, no 
object with that SID exists. 
SidTypeComputer:  This member is not used. 
SidTypeLabel:  This member is not used. 
*/

lsa_SidType = {
	SID_NAME_USE_NONE : 0,/* NOTUSED */
	SID_NAME_USER     : 1, /* user */
	SID_NAME_DOM_GRP  : 2, /* domain group */
	SID_NAME_DOMAIN   : 3, /* domain: don't know what this is */
	SID_NAME_ALIAS    : 4, /* local group */
	SID_NAME_WKN_GRP  : 5, /* well-known group */
	SID_NAME_DELETED  : 6, /* deleted account: needed for c2 rating */
	SID_NAME_INVALID  : 7, /* invalid account */
	SID_NAME_UNKNOWN  : 8, /* oops. */
	SID_NAME_COMPUTER : 9  /* machine */ 
}