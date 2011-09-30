function loadjscssfile(filename){
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 //appendChild(fileref)
  document.getElementsByTagName("head")[0].appendChild(fileref)
}

Array.prototype.find = function(searchStr) {
  for (i=0; i<this.length; i++) {
      if (this[i]===searchStr) {
		return true;
    }
  }
  return false;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.trim = function () {

    return this.replace(/^\s+|\s+$/, '');

}

String.prototype.isAlpha =  function(){  
    var regEx = /^[a-zA-Z]+$/;  
    return this.match(regEx);  
}  

function ord (string) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   input by: incidence
    // *     example 1: ord('K');
    // *     returns 1: 75
    // *     example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
    // *     returns 2: 65536
    var str = string + '',
        code = str.charCodeAt(0);
    if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        var hi = code;
        if (str.length === 1) {
            return code; // This is just a high surrogate with no following low surrogate, so we return its value;
            // we could also throw an error as it is not a complete character, but someone may want to know
        }
        var low = str.charCodeAt(1);
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        return code; // This is just a low surrogate with no preceding high surrogate, so we return its value;
        // we could also throw an error as it is not a complete character, but someone may want to know
    }
    return code;
}

function ExplodeListByComma(idlist){
	var grouplist = "";
    var elSel = document.getElementById(idlist);
    if (elSel) {
        var count = elSel.options.length - 1;
        for (i = 0; i <= count; i++) {
         //optionList.push(elSel.options[i].value);
			grouplist+=elSel.options[i].value;
            if(i<count)grouplist+=',';
        }
    }
    return grouplist;
}   
                   
 function getJsonOfStore(store){
        var datar = new Array();
        var jsonDataEncode = "";
        var records = store.getRange();
        for (var i = 0; i < records.length; i++) {
            datar.push(records[i].data);
        }
        //jsonDataEncode = Ext.util.JSON.encode(datar);

        //return jsonDataEncode;
        return datar;
    }



function appendOptionLast(idselect, value, text,type) {

	var elOptNew = document.createElement('option');
	var errores = 0;
	type = type || lsa_SidType.SID_NAME_DOM_GRP;

	if (value && text) {



		if (value == -1) errores++;

		elOptNew.text = text;

		elOptNew.value = value;

		elOptNew.id = Ext.id(elOptNew, 'select');

		var elSel = document.getElementById(idselect);

		if (elSel) {



			var count = elSel.options.length - 1;



			for (i = 0; i <= count; i++) {

				if (elSel.options[i].value == value) errores++;

			}

			css='';
			
			if (errores == 0) {
				
				switch(type){
					case lsa_SidType.SID_NAME_USER:
						css='Listbox-user-icon';
					break;
					case lsa_SidType.SID_NAME_DOM_GRP:
						css='Listbox-group-icon';
					break;
					case lsa_SidType.SID_NAME_DOMAIN:
						css='Listbox-unknown-icon';
					break;
					case lsa_SidType.SID_NAME_ALIAS:
						css='Listbox-unknown-icon';
					break;
					case lsa_SidType.SID_NAME_WKN_GRP:
						css='Listbox-group-icon';
					break;
					case lsa_SidType.SID_NAME_DELETED:
						css='Listbox-unknown-icon';
					break;
					case lsa_SidType.SID_NAME_INVALID:
						css='Listbox-unknown-icon';
					break;
					case lsa_SidType.SID_NAME_UNKNOWN:
						css='Listbox-unknown-icon';
					break;
					case lsa_SidType.SID_NAME_COMPUTER:
						css='Listbox-pc-icon';
					break;
					default:
						css='Listbox-group-icon';
				}
	

				try {

					elSel.add(elOptNew, null); // standards compliant; doesn't work in IE

					Ext.get(elOptNew.id).addClass(css);

				} catch (ex) {

					elSel.add(elOptNew); // IE only

					Ext.get(elOptNew.id).addClass('Listbox-group-icon');

				}



			}
		}

	}

}

function removeOptionSelected(idselect) {

	var elSel = document.getElementById(idselect);

	if (elSel) {

		var i;

		for (i = elSel.length - 1; i >= 0; i--) {

			if (elSel.options[i].selected) {
				elSel.remove(i);

				if (!setSelected(idselect, i + 1)) {

					if (i != 0) {

						setSelected(idselect, i - 1);

					} else {

						setSelected(idselect, 0);

					}

				}

				break;

			}

		}

	}

}

function enableCmp(id) {

    var Cmp = Ext.getCmp(id);

    if (Cmp) {

        Cmp.enable();

    }

}

function setSelected(idselect, index) {

    var elSel = document.getElementById(idselect);

    if (elSel) {

        var i, count = 0;

        count = elSel.length - 1;

        for (i = 0; i <= count; i++) {

            if (i == index) {

                elSel.options[i].selected = true;

                return true;

            }

        }

    }

    return false;

}

function isset(variable_name) {
	try {
		if (typeof(eval(variable_name)) != 'undefined')
			if (eval(variable_name) != null)
				return true;
    } catch(e) { }
	return false;
}
