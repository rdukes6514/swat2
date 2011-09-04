/*
Atomic - JavaScript Web 2.x Framework
Copyright (c) 2007 by Jonathan L. Brisbin <jon at jbrisbin dot com>
All rights reserved.

Includes some code:
Copyright 2001 Scott Andrew LePera
scott@scottandrew.com
http://www.scottandrew.com/xml-rpc

License: 
You are granted the right to use and/or redistribute this 
code only if this license and the copyright notice are included 
and you accept that no warranty of any kind is made or implied 
by the author.

--

The JavaScript code distributed with Atomic (the "Software") is licensed 
under the GNU (GPL) open source license version 3.

http://www.gnu.org/licenses/gpl.html

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details.
 */
var $X = function( xpath, obj ) { return Ext.DomQuery.select( xpath, obj ); }
var $XV = function( xpath, obj ) { return Ext.DomQuery.selectValue( xpath, obj ); }
Ext.namespace( "Atomic.util" );
Atomic.util.XMLRPC = function( options )
{
	this.setOptions = function( options )
	{
		for( var key in options ) {
			if( key == "url" || key == "method" ) {
				this[ key ] = options[ key ];
			}
		}
	}
	this.setOptions( options );
	// Events to comply with Ext.util.Observable
	this.events = {
		success: true,
		fault: true
	};
	// Various templates for creating the XML for the methodCall
	this.templates = new Ext.util.MixedCollection();
	this.templates.add( "methodCall", new Ext.MasterTemplate( '<methodCall><methodName>{methodName}</methodName><params><tpl name="param"><param><value>{paramValue}</value></param></tpl></params></methodCall>' ) );
	this.templates.add( "string", new Ext.Template( '<string>{value}</string>' ) );
	this.templates.add( "boolean", new Ext.Template( '<boolean>{value}</boolean>' ) );
	this.templates.add( "integer", new Ext.Template( '<int>{value}</int>' ) );
	this.templates.add( "double", new Ext.Template( '<double>{value}</double>' ) );
	this.templates.add( "date", new Ext.Template( '<dateTime.iso8601>{value}</dateTime.iso8601>' ) );
	this.templates.add( "base64", new Ext.Template( '<base64>{value}</base64>' ) );
	this.templates.add( "struct", '<struct><tpl name="value"><member><name>{name}</name><value>{value}</value></member></tpl></struct>' );
	this.templates.add( "array", '<array><data><tpl name="value"><value>{value}</value></tpl></data></array>' );
	this.templates.each( function( tmpl ) { if( tmpl.compile ) { tmpl.compile(); } } );
}
Ext.extend( Atomic.util.XMLRPC, Ext.util.Observable, {
	reset: function()
	{
		this.templates.each( function( tmpl ) { if( tmpl.reset ) { tmpl.reset(); } } );
	},
	getXMLRPCType: function( obj )
	{
		var type = typeof( obj );
		if( type == "number" ) {
			if( Math.round( obj ) == obj ) { 
				type = "int" 
			} else {
				type = "double";
			}
		} else if( type == "object" ) {
			var con = obj.constructor;
			if( con == Date ) {
				type = "date";
			} else if( con == Array ) {
				type = "array";
			} else {
				type = "struct";
			}
		}
		return type;
	},
	dateToISO8601: function( date )
	{
		var year = new String( 1900 + date.getYear() );
		var month = this.leadingZero( new String( 1 + date.getMonth() ) );
		var day = this.leadingZero( new String( date.getDate() ) );
		var time = this.leadingZero( new String( date.getHours() ) ) + ":" + this.leadingZero( new String( date.getMinutes() ) ) + ":" + this.leadingZero( new String( date.getSeconds() ) );
		var converted = year+month+day+"T"+time;
		return converted;
	},	
	leadingZero: function( n )
	{
		return (n.length==1?"0"+n:n);
	},
	getParameterXml: function( obj )
	{
		var type = this.getXMLRPCType( obj );
		var paramArgs = {};
		if( type && this.templates.containsKey( type ) ) {
			var param = this.templates.get( type );
			if( type == "struct" ) {
				param = new Ext.MasterTemplate( param );
				for( var key in obj ) { 
					var valueXml = this.getParameterXml( obj[key] );
					if( valueXml ) { param.add( "value", { name: key, value: valueXml } ); }
				}
			} else if( type == "array" ) {
				param = new Ext.MasterTemplate( param );
				Ext.each( obj, function( item )	{ 
					var valueXml = this.getParameterXml( item );
					param.add( "value", { value: valueXml } );	
				}, this );
			} else if( type == "boolean" ) {
				paramArgs = { value: ( obj ? "1" : "0" ) };
			} else if( type == "date" ) {
				paramArgs = { value: this.dateToISO8601( obj ) };
			} else {
				paramArgs = { value: obj };
			}
			return param.applyTemplate( paramArgs );
		} else {
			return false;
		}
	},
	addParameter: function( obj )
	{
		var paramXml = this.getParameterXml( obj );
		if( paramXml ) {
			// Add this parameter to the methodCall
			var methodCall = this.templates.get( "methodCall" );
			methodCall.add( "param", { paramValue: paramXml } );
		}
	},
	call: function( options, params )
	{
		if( options ) {	
			this.setOptions( options ); 
			Ext.each( options.params, function( item, index ) { this.addParameter( item ); }, this );
		}
		
		var methodCall = this.templates.get( "methodCall" );
		var xml = methodCall.applyTemplate( { methodName: this.method } );

		Ext.Ajax.defaultHeaders = { "Content-type": "text/xml" };
		Ext.Ajax.request( {
			timeout: (this.hasOwnProperty("timeout")?this.timeout:30000),
			params: {},
			url: this.url,
			callback: function( opts, success, xhr )
			{
				var xml = false;
				if( xhr && xhr.responseXML ) {
					xml = xhr.responseXML;
				}
				if( success && xml ) {
					if( xml.getElementsByTagName( "fault" ).length > 0 ) {
						var fault = new Atomic.util.XMLRPCFault();
						Ext.each( xml.getElementsByTagName( "member" ), function( obj, index )
						{
							var name = $XV( "name", obj );
							var value = $XV( "value/*", obj );
							switch( name ) {
								case "faultCode":
									fault.code = value;
									break;
								case "faultString":
									fault.message = value;
							}
						} );
						fault.xml = xml;
						this.fireEvent( "fault", xhr, fault );
					} else {
						this.fireEvent( "success", xhr, xml ); 
					}
				} else {
					var fault = new Atomic.util.XMLRPCFault( xhr.status, xhr.statusText );
					this.fireEvent( "fault", xhr, fault );
				}
			},
			xmlData: '<?xml version="1.0"?>' + xml,
			scope: this
		} );
	}
} );
/*
 XML-RPC Fault object, to encapsulate an error from the server.
 */
Atomic.util.XMLRPCFault = function( faultCode, faultMessage, xml )
{
	this.code = faultCode||0;
	this.message = faultMessage||"";
	this.xml = xml||false;
}