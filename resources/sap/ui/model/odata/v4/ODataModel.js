/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ODataContextBinding","./ODataListBinding","./ODataMetaModel","./ODataPropertyBinding","./SubmitMode","./lib/_GroupLock","./lib/_Helper","./lib/_MetadataRequestor","./lib/_Parser","./lib/_Requestor","sap/base/assert","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/core/library","sap/ui/core/message/Message","sap/ui/model/BindingMode","sap/ui/model/Context","sap/ui/model/Model","sap/ui/model/odata/OperationMode","sap/ui/thirdparty/jquery","sap/ui/thirdparty/URI"],function(e,t,r,o,n,i,s,a,u,p,d,c,h,f,l,g,y,w,m,b,M){"use strict";var v=/^\w+$/,E="sap.ui.model.odata.v4.ODataModel",G=["$count","$expand","$filter","$levels","$orderby","$search","$select"],U=/^(\$auto(\.\w+)?|\$direct|\w+)$/,x=f.MessageType,O=[undefined,x.Success,x.Information,x.Warning,x.Error],I={messageChange:true},$={annotationURI:true,autoExpandSelect:true,earlyRequests:true,groupId:true,groupProperties:true,odataVersion:true,operationMode:true,serviceUrl:true,supportReferences:true,synchronizationMode:true,updateGroupId:true},k=["$apply","$count","$expand","$filter","$orderby","$search","$select"];var P=w.extend("sap.ui.model.odata.v4.ODataModel",{constructor:function(e){var t,o,i=sap.ui.getCore().getConfiguration().getLanguageTag(),s,u,d,c,h=this;w.apply(this);if(!e||e.synchronizationMode!=="None"){throw new Error("Synchronization mode must be 'None'")}s=e.odataVersion||"4.0";this.sODataVersion=s;if(s!=="4.0"&&s!=="2.0"){throw new Error("Unsupported value for parameter odataVersion: "+s)}for(u in e){if(!(u in $)){throw new Error("Unsupported parameter: "+u)}}d=e.serviceUrl;if(!d){throw new Error("Missing service root URL")}c=new M(d);if(c.path()[c.path().length-1]!=="/"){throw new Error("Service root URL must end with '/'")}if(e.operationMode&&e.operationMode!==m.Server){throw new Error("Unsupported operation mode: "+e.operationMode)}this.sOperationMode=e.operationMode;this.mUriParameters=this.buildQueryOptions(c.query(true),false,true);this.sServiceUrl=c.query("").toString();this.sGroupId=e.groupId;if(this.sGroupId===undefined){this.sGroupId="$auto"}if(this.sGroupId!=="$auto"&&this.sGroupId!=="$direct"){throw new Error("Group ID must be '$auto' or '$direct'")}this.checkGroupId(e.updateGroupId,false,"Invalid update group ID: ");this.sUpdateGroupId=e.updateGroupId||this.getGroupId();this.aLockedGroupLocks=[];this.mGroupProperties={};for(t in e.groupProperties){h.checkGroupId(t,true);o=e.groupProperties[t];if(typeof o!=="object"||Object.keys(o).length!==1||!(o.submit in n)){throw new Error("Group '"+t+"' has invalid properties: '"+o+"'")}}this.mGroupProperties=b.extend({$auto:{submit:n.Auto},$direct:{submit:n.Direct}},e.groupProperties);if(e.autoExpandSelect!==undefined&&typeof e.autoExpandSelect!=="boolean"){throw new Error("Value for autoExpandSelect must be true or false")}this.bAutoExpandSelect=e.autoExpandSelect===true;this.oMetaModel=new r(a.create({"Accept-Language":i},s,this.mUriParameters),this.sServiceUrl+"$metadata",e.annotationURI,this,e.supportReferences);this.oRequestor=p.create(this.sServiceUrl,{fetchEntityContainer:this.oMetaModel.fetchEntityContainer.bind(this.oMetaModel),fetchMetadata:this.oMetaModel.fetchObject.bind(this.oMetaModel),getGroupProperty:this.getGroupProperty.bind(this),lockGroup:this.lockGroup.bind(this),onCreateGroup:function(e){if(h.isAutoGroup(e)){sap.ui.getCore().addPrerenderingTask(h._submitBatch.bind(h,e,true))}},reportBoundMessages:this.reportBoundMessages.bind(this),reportUnboundMessages:this.reportUnboundMessages.bind(this)},{"Accept-Language":i},this.mUriParameters,s);if(e.earlyRequests){this.oMetaModel.fetchEntityContainer(true);this.initializeSecurityToken()}this.aAllBindings=[];this.sDefaultBindingMode=g.TwoWay;this.mSupportedBindingModes={OneTime:true,OneWay:true,TwoWay:true}}});P.prototype._submitBatch=function(e,t){var r,o,n=this;o=h.all(this.aLockedGroupLocks.map(function(t){return t.waitFor(e)}));r=o.isPending();if(r){c.info("submitBatch('"+e+"') is waiting for locks",null,E)}return Promise.resolve(o.then(function(){if(r){c.info("submitBatch('"+e+"') continues",null,E)}n.aLockedGroupLocks=n.aLockedGroupLocks.filter(function(e){return e.isLocked()});return n.oRequestor.submitBatch(e).catch(function(e){n.reportError("$batch failed",E,e);if(!t){throw e}})}))};P.prototype.attachEvent=function(e){if(!(e in I)){throw new Error("Unsupported event '"+e+"': v4.ODataModel#attachEvent")}return w.prototype.attachEvent.apply(this,arguments)};P.prototype.bindContext=function(t,r,o){return new e(this,t,r,o)};P.prototype.bindingCreated=function(e){this.aAllBindings.push(e)};P.prototype.bindingDestroyed=function(e){var t=this.aAllBindings.indexOf(e);if(t<0){throw new Error("Unknown "+e)}this.aAllBindings.splice(t,1)};P.prototype.bindList=function(e,r,o,n,i){return new t(this,e,r,o,n,i)};P.prototype.bindProperty=function(e,t,r){return new o(this,e,t,r)};P.prototype.bindTree=function(){throw new Error("Unsupported operation: v4.ODataModel#bindTree")};P.prototype.buildQueryOptions=function(e,t,r){var o,n=b.extend(true,{},e);function i(e,r,o){var n,s,a,p=e[r];if(!t||o.indexOf(r)<0){throw new Error("System query option "+r+" is not supported")}if((r==="$expand"||r==="$select")&&typeof p==="string"){p=u.parseSystemQueryOption(r+"="+p)[r];e[r]=p}if(r==="$expand"){for(a in p){s=p[a];if(s===null||typeof s!=="object"){s=p[a]={}}for(n in s){i(s,n,G)}}}else if(r==="$count"){if(typeof p==="boolean"){if(!p){delete e.$count}}else{switch(typeof p==="string"&&p.toLowerCase()){case"false":delete e.$count;break;case"true":e.$count=true;break;default:throw new Error("Invalid value for $count: "+p)}}}}if(e){for(o in e){if(o.indexOf("$$")===0){delete n[o]}else if(o[0]==="@"){throw new Error("Parameter "+o+" is not supported")}else if(o[0]==="$"){i(n,o,k)}else if(!r&&o.indexOf("sap-")===0){throw new Error("Custom query option "+o+" is not supported")}}}return n};P.prototype.checkDeferredGroupId=function(e){this.checkGroupId(e,true,"Invalid deferred group ID: ");if(this.isAutoGroup(e)||this.isDirectGroup(e)){throw new Error("Group ID is not deferred: "+e)}};P.prototype.checkGroupId=function(e,t,r){if(!t&&e===undefined||typeof e==="string"&&(t?v:U).test(e)){return}throw new Error((r||"Invalid group ID: ")+e)};P.prototype.createBindingContext=function(e,t){var r,o,n,i,s;function a(e){var t=e.indexOf("."),r=e.indexOf("/");return t>0&&(r<0||t<r)}if(arguments.length>2){throw new Error("Only the parameters sPath and oContext are supported")}if(t&&t.getBinding){throw new Error("Unsupported type: oContext must be of type sap.ui.model.Context, "+"but was sap.ui.model.odata.v4.Context")}i=this.resolve(e,t);if(i===undefined){throw new Error("Cannot create binding context from relative path '"+e+"' without context")}s=i.indexOf("#");if(s>=0){r=i.slice(0,s);n=i.slice(s+1);if(n[0]==="#"){n=n.slice(1)}else if(r.length>1&&n[0]!=="@"&&a(n)){return new y(this,i)}if(n[0]==="/"){n="."+n}o=this.oMetaModel.getMetaContext(r);return this.oMetaModel.createBindingContext(n,o)}return new y(this,i)};P.prototype.destroy=function(){this.oRequestor.destroy();this.oMetaModel.destroy();return w.prototype.destroy.apply(this,arguments)};P.prototype.destroyBindingContext=function(){throw new Error("Unsupported operation: v4.ODataModel#destroyBindingContext")};P.prototype.getAllBindings=function(){return this.aAllBindings};P.prototype.getContext=function(){throw new Error("Unsupported operation: v4.ODataModel#getContext")};P.prototype.getDependentBindings=function(e){return this.aAllBindings.filter(function(t){var r=t.getContext();return t.isRelative()&&(r===e||r&&r.getBinding&&r.getBinding()===e)})};P.prototype.getGroupId=function(){return this.sGroupId};P.prototype.getGroupProperty=function(e,t){switch(t){case"submit":if(e.startsWith("$auto.")){return n.Auto}return this.mGroupProperties[e]?this.mGroupProperties[e].submit:n.API;default:throw new Error("Unsupported group property: '"+t+"'")}};P.prototype.getMetaModel=function(){return this.oMetaModel};P.prototype.getObject=function(){throw new Error("Unsupported operation: v4.ODataModel#getObject")};P.prototype.getODataVersion=function(){return this.sODataVersion};P.prototype.getOriginalProperty=function(){throw new Error("Unsupported operation: v4.ODataModel#getOriginalProperty")};P.prototype.getProperty=function(){throw new Error("Unsupported operation: v4.ODataModel#getProperty")};P.prototype.getUpdateGroupId=function(){return this.sUpdateGroupId};P.prototype.hasPendingChanges=function(){return this.oRequestor.hasPendingChanges()};P.prototype.initializeSecurityToken=function(){this.oRequestor.refreshSecurityToken().catch(function(){})};P.prototype.isAutoGroup=function(e){return this.getGroupProperty(e,"submit")===n.Auto};P.prototype.isDirectGroup=function(e){return this.getGroupProperty(e,"submit")===n.Direct};P.prototype.isList=function(){throw new Error("Unsupported operation: v4.ODataModel#isList")};P.prototype.lockGroup=function(e,t,r){var o;if(t instanceof i){t.setGroupId(e);return t}o=new i(e,t,r,this.oRequestor.getSerialNumber());if(o.isLocked()){this.aLockedGroupLocks.push(o)}return o};P.prototype.refresh=function(e){this.checkGroupId(e);this.aBindings.slice().forEach(function(t){if(t.isRoot()){t.refresh(t.isSuspended()?undefined:e)}})};P.prototype.reportBoundMessages=function(e,t,r){var o="/"+e,n=[],i=[],a=this;Object.keys(t).forEach(function(e){t[e].forEach(function(t){var r=s.buildPath(o,e,t.target);n.push(new l({code:t.code,descriptionUrl:t.longtextUrl||undefined,message:t.message,persistent:t.transition,processor:a,target:r,technical:t.technical,type:O[t.numericSeverity]||x.None}))})});(r||[""]).forEach(function(e){var t=s.buildPath(o,e);Object.keys(a.mMessages||{}).forEach(function(e){if(e===t||e.startsWith(t+"/")||e.startsWith(t+"(")){i=i.concat(a.mMessages[e].filter(function(e){return!e.persistent}))}})});if(n.length||i.length){this.fireMessageChange({newMessages:n,oldMessages:i})}};P.prototype.reportError=function(e,t,r){var o=[],n,i,a=[];function u(e){var t={code:e.code,message:e.message,technical:e.technical};Object.keys(e).forEach(function(o){if(o[0]==="@"){if(o.endsWith(".numericSeverity")){t.numericSeverity=e[o]}else if(o.endsWith(".longtextUrl")&&r.requestUrl&&i){t.longtextUrl=s.makeAbsolute(e[o],r.requestUrl)}}});if(typeof e.target!=="string"){a.push(t)}else if(e.target[0]==="$"||!i){t.message=e.target+": "+t.message;a.push(t)}else{t.target=e.target;t.transition=true;o.push(t)}}if(r.canceled==="noDebugLog"){return}n=r.stack||r.message;if(n.indexOf(r.message)<0){n=r.message+"\n"+r.stack}if(r.canceled){c.debug(e,n,t);return}c.error(e,n,t);if(r.$reported){return}r.$reported=true;if(r.error){i=r.resourcePath&&r.resourcePath.split("?")[0];r.error["@.numericSeverity"]=4;r.error.technical=true;u(r.error);if(r.error.details){r.error.details.forEach(u)}if(o.length){this.reportBoundMessages(i,{"":o},[])}}else{r["@.numericSeverity"]=4;r.technical=true;u(r)}this.reportUnboundMessages(i,a)};P.prototype.reportUnboundMessages=function(e,t){var r=this;if(t&&t.length){this.fireMessageChange({newMessages:t.map(function(t){var o=t.longtextUrl;return new l({code:t.code,descriptionUrl:o&&e?s.makeAbsolute(o,r.sServiceUrl+e):undefined,message:t.message,persistent:true,processor:r,target:"",technical:t.technical,type:O[t.numericSeverity]||x.None})})})}};P.prototype.requestCanonicalPath=function(e){d(e.getModel()===this,"oEntityContext must belong to this model");return e.requestCanonicalPath()};P.prototype.resetChanges=function(e){e=e||this.sUpdateGroupId;this.checkDeferredGroupId(e);this.oRequestor.cancelChanges(e);this.aAllBindings.forEach(function(t){if(e===t.getUpdateGroupId()){t.resetInvalidDataState()}})};P.prototype.resolve=function(e,t){var r;if(e&&e[0]==="/"){r=e}else if(t){r=t.getPath();if(e){if(r.slice(-1)!=="/"){r+="/"}r+=e}}if(r&&r!=="/"&&r[r.length-1]==="/"&&r.indexOf("#")<0){r=r.slice(0,r.length-1)}return r};P.prototype.setLegacySyntax=function(){throw new Error("Unsupported operation: v4.ODataModel#setLegacySyntax")};P.prototype.submitBatch=function(e){var t=this;this.checkDeferredGroupId(e);this.oRequestor.addChangeSet(e);return new Promise(function(r){sap.ui.getCore().addPrerenderingTask(function(){r(t._submitBatch(e))})})};P.prototype.toString=function(){return E+": "+this.sServiceUrl};return P});