/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/test/Opa","sap/ui/test/OpaPlugin","sap/ui/test/PageObjectFactory","sap/ui/base/Object","sap/ui/test/launchers/iFrameLauncher","sap/ui/test/launchers/componentLauncher","sap/ui/core/routing/HashChanger","sap/ui/test/matchers/Matcher","sap/ui/test/matchers/AggregationFilled","sap/ui/test/matchers/PropertyStrictEquals","sap/ui/test/pipelines/ActionPipeline","sap/ui/test/_ParameterValidator","sap/ui/test/_OpaLogger","sap/ui/thirdparty/URI","sap/ui/base/EventProvider","sap/ui/qunit/QUnitUtils","sap/ui/test/autowaiter/_autoWaiter","sap/ui/dom/includeStylesheet","sap/ui/thirdparty/jquery","sap/ui/test/_OpaUriParameterParser"],function(e,t,n,r,i,o,a,s,u,c,p,f,h,l,d,g,v,w,m,y){"use strict";var x=h.getLogger("sap.ui.test.Opa5"),F=new t,_=new p,E="OpaFrame",W=new f({errorPrefix:"sap.ui.test.Opa5#waitFor"}),C=["visible","viewNamespace","viewName","viewId","fragmentId","autoWait"].concat(e._aConfigValuesForWaitFor),O=["check","error","success"].concat(e._aConfigValuesForWaitFor),b=[],P=new d;var A=y._getAppParams();var I=r.extend("sap.ui.test.Opa5",m.extend({},e.prototype,{constructor:function(){e.apply(this,arguments)}}));function L(){var t=this;var n={};var r=["source","timeout","autoWait","width","height"];if(arguments.length===1&&m.isPlainObject(arguments[0])){n=arguments[0]}else{var o=arguments;r.forEach(function(e,t){n[e]=o[t]})}if(n.source&&typeof n.source!=="string"){n.source=n.source.toString()}var a=new l(n.source?n.source:"");a.search(m.extend(a.search(true),e.config.appParams));var s=U();s.success=function(){M({source:a.toString(),width:n.width||e.config.frameWidth,height:n.height||e.config.frameHeight})};this.waitFor(s);var u=U();u.check=i.hasLaunched;u.timeout=n.timeout||80;u.errorMessage="unable to load the IFrame with the url: "+n.source;t.waitFor(u);var c=U();c.success=function(){t._loadExtensions(i.getWindow())};this.waitFor(c);var p=U();p.autoWait=n.autoWait||false;p.timeout=n.timeout||80;return this.waitFor(p)}I.prototype.iStartMyUIComponent=function t(n){var r=this;var i=false;n=n||{};var s=U();s.success=function(){var t=new l;t.search(m.extend(t.search(true),e.config.appParams));window.history.replaceState({},"",t.toString())};this.waitFor(s);var u=U();u.success=function(){var e=sap.ui.require.toUrl("sap/ui/test/OpaCss")+".css";w(e);a.getInstance().setHash(n.hash||"");o.start(n.componentConfig).then(function(){i=true})};this.waitFor(u);var c=U();c.errorMessage="Unable to load the component with the name: "+n.name;c.check=function(){return i};if(n.timeout){c.timeout=n.timeout}r.waitFor(c);var p=U();p.success=function(){r._loadExtensions(window)};this.waitFor(p);var f=U();f.autoWait=n.autoWait||false;f.timeout=n.timeout||80;return this.waitFor(f)};I.prototype.iTeardownMyUIComponent=function e(){var t=U();t.success=function(){o.teardown()};var n=U();n.success=function(){var e=new l;e.search(A);window.history.replaceState({},"",e.toString())};return m.when(this.waitFor(t),this.waitFor(n))};I.prototype.iTeardownMyApp=function(){var e=this;var t=U();t.success=function(){e._unloadExtensions(I.getWindow())};var n=U();n.success=function(){if(i.hasLaunched()){this.iTeardownMyAppFrame()}else if(o.hasLaunched()){this.iTeardownMyUIComponent()}else{var e="A teardown was called but there was nothing to tear down use iStartMyComponent or iStartMyAppInAFrame";x.error(e,"Opa");throw new Error(e)}}.bind(this);return m.when(this.waitFor(t),this.waitFor(n))};I.iStartMyAppInAFrame=L;I.prototype.iStartMyAppInAFrame=L;function S(){var e=U();e.success=function(){i.teardown()};return this.waitFor(e)}I.iTeardownMyAppFrame=S;I.prototype.iTeardownMyAppFrame=S;I.prototype.hasAppStartedInAFrame=function(){return i.hasLaunched()};I.prototype.hasUIComponentStarted=function(){return o.hasLaunched()};I.prototype.hasAppStarted=function(){return i.hasLaunched()||o.hasLaunched()};I.prototype.waitFor=function(n){var r=n.actions,o=e._createFilteredConfig(C),a;n=m.extend({},o,n);n.actions=r;W.validate({validationInfo:I._validationInfo,inputToValidate:n});var s=n.check,u=null,c=n.success,p,f;a=e._createFilteredOptions(O,n);a.check=function(){var e=!!n.actions||n.autoWait;var r=I._getAutoWaiter();r.extendConfig(n.autoWait);if(e&&r.hasToWait()){return false}var o=I.getPlugin();var a=m.extend({},n,{interactable:e});p=o._getFilteredControls(a,u);if(i.hasLaunched()&&m.isArray(p)){var c=[];p.forEach(function(e){c.push(e)});p=c}if(p===t.FILTER_FOUND_NO_CONTROLS){x.debug("Matchers found no controls so check function will be skipped");return false}if(s){return this._executeCheck(s,p)}return true};a.success=function(){var t=e._getWaitForCounter();if(r&&(p||!f)){_.process({actions:r,control:p})}if(!c){return}var i=[];if(p){i.push(p)}if(t.get()===0){x.timestamp("opa.waitFor.success");x.debug("Execute success handler");c.apply(this,i);return}var o=U();if(m.isPlainObject(n.autoWait)){o.autoWait=m.extend({},n.autoWait)}else{o.autoWait=n.autoWait}o.success=function(){c.apply(this,i)};this.waitFor(o)};return e.prototype.waitFor.call(this,a)};I.getPlugin=function(){return i.getPlugin()||F};I.getJQuery=function(){return i.getJQuery()||m};I.getWindow=function(){return i.getWindow()||window};I.getUtils=function(){return i.getUtils()||g};I.getHashChanger=function(){return i.getHashChanger()||a.getInstance()};I._getAutoWaiter=function(){return i._getAutoWaiter()||v};I.extendConfig=function(t){e.extendConfig(t);e.extendConfig({appParams:A});I._getAutoWaiter().extendConfig(t.autoWait)};I.resetConfig=function(){e.resetConfig();e.extendConfig({viewNamespace:"",arrangements:new I,actions:new I,assertions:new I,visible:true,autoWait:false,_stackDropCount:1});e.extendConfig({appParams:A})};I.getTestLibConfig=function(t){return e.config.testLibs&&e.config.testLibs[t]?e.config.testLibs[t]:{}};I.emptyQueue=e.emptyQueue;I.stopQueue=e.stopQueue;I.getContext=e.getContext;I.matchers={};I.matchers.Matcher=s;I.matchers.AggregationFilled=u;I.matchers.PropertyStrictEquals=c;I.createPageObjects=function(e){return n.create(e,I)};I.prototype._executeCheck=function(e,t){var n=[];t&&n.push(t);x.debug("Executing OPA check function on controls "+t);x.debug("Check function is:\n"+e);var r=e.apply(this,n);x.debug("Result of check function is: "+r||"not defined or null");return r};I.prototype.iWaitForPromise=function(t){var n={viewName:null,controlType:null,id:null,searchOpenDialogs:false,autoWait:false};return e.prototype._schedulePromiseOnFlow.call(this,t,n)};I.resetConfig();function M(t){var n=sap.ui.require.toUrl("sap/ui/test/OpaCss")+".css";w(n);var r=m.extend({},t,{frameId:E,opaLogLevel:e.config.logLevel});return i.launch(r)}function U(){return{viewName:null,controlType:null,id:null,searchOpenDialogs:false,autoWait:false}}m(function(){if(m("#"+E).length){M()}m("body").addClass("sapUiBody");m("html").height("100%")});I._validationInfo=m.extend({_stack:"string",viewName:"string",viewNamespace:"string",viewId:"string",fragmentId:"string",visible:"bool",matchers:"any",actions:"any",id:"any",controlType:"any",searchOpenDialogs:"bool",autoWait:"any"},e._validationInfo);I._getEventProvider=function(){return P};I.prototype._loadExtensions=function(t){var n=this;var r=e.config.extensions?e.config.extensions:[];var i=m.when(m.map(r,function(e){var r;var i=m.Deferred();t.sap.ui.require([e],function(o){r=new o;r.name=e;n._executeExtensionOnAfterInit(r,t).done(function(){I._getEventProvider().fireEvent("onExtensionAfterInit",{extension:r,appWindow:t});n._addExtension(r);i.resolve()}).fail(function(e){x.error(new Error("Error during extension init: "+e),"Opa");i.resolve()})});return i.promise()}));return this.iWaitForPromise(i)};I.prototype._unloadExtensions=function(e){var t=this;var n=m.when(m.map(this._getExtensions(),function(n){var r=m.Deferred();I._getEventProvider().fireEvent("onExtensionBeforeExit",{extension:n});t._executeExtensionOnBeforeExit(n,e).done(function(){r.resolve()}).fail(function(e){x.error(new Error("Error during extension init: "+e),"Opa");r.resolve()});return r.promise()}));this.iWaitForPromise(n)};I.prototype._addExtension=function(e){b.push(e)};I.prototype._getExtensions=function(){return b};I.prototype._executeExtensionOnAfterInit=function(e,t){var n=m.Deferred();var r=e.onAfterInit;if(r){r.bind(t)().done(function(){n.resolve()}).fail(function(t){n.reject(new Error("Error while waiting for extension: "+e.name+" to init, details: "+t))})}else{n.resolve()}return n.promise()};I.prototype._executeExtensionOnBeforeExit=function(e,t){var n=m.Deferred();var r=e.onBeforeExit;if(r){r.bind(t)().done(function(){n.resolve()}).fail(function(t){n.reject(new Error("Error while waiting for extension: "+e.name+" to exit, details: "+t))})}else{n.resolve()}return n.promise()};return I});