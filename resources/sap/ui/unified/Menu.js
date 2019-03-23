/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/Control","sap/ui/Device","sap/ui/core/Popup","./MenuItemBase","./library","sap/ui/core/library","sap/ui/unified/MenuRenderer","sap/ui/dom/containsOrEquals","sap/ui/thirdparty/jquery","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/events/ControlEvents","sap/ui/events/PseudoEvents","sap/ui/events/checkMouseEnterOrLeave"],function(e,t,i,o,n,s,r,a,p,u,h,f,l,d,c){"use strict";var g=o.Dock;var m=r.OpenState;var y=t.extend("sap.ui.unified.Menu",{metadata:{interfaces:["sap.ui.core.IContextMenu"],library:"sap.ui.unified",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},ariaDescription:{type:"string",group:"Accessibility",defaultValue:null},maxVisibleItems:{type:"int",group:"Behavior",defaultValue:0},pageSize:{type:"int",group:"Behavior",defaultValue:5}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.unified.MenuItemBase",multiple:true,singularName:"item"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{itemSelect:{parameters:{item:{type:"sap.ui.unified.MenuItemBase"}}}}}});(function(s){y.prototype.bCozySupported=true;y._DELAY_SUBMENU_TIMER=300;y._DELAY_SUBMENU_TIMER_EXT=400;y.prototype.init=function(){var e=this;this.bOpen=false;this.oOpenedSubMenu=null;this.oHoveredItem=null;this.oPopup=null;this._bOpenedAsContextMenu=false;this.fAnyEventHandlerProxy=u.proxy(function(e){var t=this.getRootMenu();if(t!=this||!this.bOpen||!this.getDomRef()||e.type!="mousedown"&&e.type!="touchstart"){return}t.handleOuterEvent(this.getId(),e)},this);this.fOrientationChangeHandler=function(){e.close()};this.bUseTopStyle=false};y.prototype._setCustomEnhanceAccStateFunction=function(e){this._fnCustomEnhanceAccStateFunction=e};y.prototype.enhanceAccessibilityState=function(e,t){var i=typeof this._fnCustomEnhanceAccStateFunction==="function";return i?this._fnCustomEnhanceAccStateFunction(e,t):t};y.prototype.exit=function(){if(this.oPopup){this.oPopup.detachClosed(this._menuClosed,this);this.oPopup.destroy();delete this.oPopup}l.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){u(s).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false}this._resetDelayedRerenderItems();this._detachResizeHandler()};y.prototype.invalidate=function(e){if(e instanceof n&&this.getDomRef()){this._delayedRerenderItems()}else{t.prototype.invalidate.apply(this,arguments)}};y.prototype.onBeforeRendering=function(){this._resetDelayedRerenderItems()};y.prototype.onAfterRendering=function(){if(this.$().parent().attr("id")!="sap-ui-static"){f.error("sap.ui.unified.Menu: The Menu is popup based and must not be rendered directly as content of the page.");this.close();this.$().remove()}var e=this.getItems();for(var t=0;t<e.length;t++){if(e[t].onAfterRendering&&e[t].getDomRef()){e[t].onAfterRendering()}}if(this.oHoveredItem){this.oHoveredItem.hover(true,this)}v(this)};y.prototype.onThemeChanged=function(){if(this.getDomRef()&&this.getPopup().getOpenState()===m.OPEN){v(this);this.getPopup()._applyPosition(this.getPopup()._oLastPosition)}};y.prototype.setPageSize=function(e){return this.setProperty("pageSize",e,true)};y.prototype.addItem=function(e){this.addAggregation("items",e,!!this.getDomRef());this._delayedRerenderItems();return this};y.prototype.insertItem=function(e,t){this.insertAggregation("items",e,t,!!this.getDomRef());this._delayedRerenderItems();return this};y.prototype.removeItem=function(e){this.removeAggregation("items",e,!!this.getDomRef());this._delayedRerenderItems();return this};y.prototype.removeAllItems=function(){var e=this.removeAllAggregation("items",!!this.getDomRef());this._delayedRerenderItems();return e};y.prototype.destroyItems=function(){this.destroyAggregation("items",!!this.getDomRef());this._delayedRerenderItems();return this};y.prototype._delayedRerenderItems=function(){if(!this.getDomRef()){return}this._resetDelayedRerenderItems();this._discardOpenSubMenuDelayed();this._itemRerenderTimer=setTimeout(function(){var e=this.getDomRef();if(e){var t=sap.ui.getCore().createRenderManager();a.renderItems(t,this);t.flush(e);t.destroy();this.onAfterRendering();this.getPopup()._applyPosition(this.getPopup()._oLastPosition)}}.bind(this),0)};y.prototype._resetDelayedRerenderItems=function(){if(this._itemRerenderTimer){clearTimeout(this._itemRerenderTimer);delete this._itemRerenderTimer}};y.prototype._detachResizeHandler=function(){if(this._hasResizeListener){i.resize.detachHandler(this._handleResizeChange,this);this._hasResizeListener=false}};y.prototype.open=function(e,t,o,n,r,a,p){if(this.bOpen){return}b(this,true);this.oOpenerRef=t;this.bIgnoreOpenerDOMRef=false;this.getPopup().open(0,o,n,r,a||"0 0",p||"_sapUiCommonsMenuFlip _sapUiCommonsMenuFlip",true);this.bOpen=true;i.resize.attachHandler(this._handleResizeChange,this);this._hasResizeListener=true;var h=this.getDomRef();u(h).attr("tabIndex",0).focus();if(e){this.setHoveredItem(this.getNextSelectableItem(-1))}l.bindAnyEvent(this.fAnyEventHandlerProxy);if(i.support.orientation&&this.getRootMenu()===this){u(s).bind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=true}};y.prototype._handleResizeChange=function(){this.getPopup()._applyPosition(this.getPopup()._oLastPosition)};y.prototype.openAsContextMenu=function(t,i){var o,n,s,r,a;i=i instanceof e?i.getDomRef():i;if(t instanceof u.Event){a=u(i).offset();o=t.pageX-a.left;n=t.pageY-a.top;this._iX=t.clientX;this._iY=t.clientY}else{o=t.offsetX||0;n=t.offsetY||0;this._iX=t.left||0;this._iY=t.top||0}s=sap.ui.getCore().getConfiguration().getRTL();r=g;if(s){o=i.clientWidth-o}this._bOpenedAsContextMenu=true;this.open(true,i,r.BeginTop,r.BeginTop,i,o+" "+n,"fit")};y.prototype._handleOpened=function(){var e,t,i,o,n,r,a,p,h,f;if(!this._bOpenedAsContextMenu){return}e=this.$();t=u(s);i=this._iX;o=this._iY;n=t.scrollLeft()+t.width();r=t.scrollTop()+t.height();a=sap.ui.getCore().getConfiguration().getRTL();p=false;h=e.width();f=e.height();if(o+f>r){o=o-f;p=true}if(a){if(n-i+h>n){i=n-(i+h);p=true}else{i=n-i;p=true}}else{if(i+h>n){i=i-h;p=true}}this._bOpenedAsContextMenu=false;p&&this.oPopup.setPosition("begin top","begin top",t,i+" "+o,"flip")};y.prototype.close=function(){if(!this.bOpen||y._dbg){return}this._discardOpenSubMenuDelayed();b(this,false);delete this._bFixed;l.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){u(s).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false}this.bOpen=false;this.closeSubmenu();this.setHoveredItem();u(this.getDomRef()).attr("tabIndex",-1);this.getPopup().close(0);this._detachResizeHandler();this._resetDelayedRerenderItems();this.$().remove();this.bOutput=false;if(this.isSubMenu()){this.getParent().getParent().oOpenedSubMenu=null}};y.prototype._menuClosed=function(){if(this.oOpenerRef){if(!this.bIgnoreOpenerDOMRef){try{this.oOpenerRef.focus()}catch(e){f.warning("Menu.close cannot restore the focus on opener "+this.oOpenerRef+", "+e)}}this.oOpenerRef=undefined}};y.prototype.onclick=function(e){this.selectItem(this.getItemByDomRef(e.target),false,!!(e.metaKey||e.ctrlKey));e.preventDefault();e.stopPropagation()};y.prototype.onsapnext=function(e){if(e.keyCode!=h.ARROW_DOWN){if(this.oHoveredItem&&this.oHoveredItem.getSubmenu()&&this.checkEnabled(this.oHoveredItem)){this.openSubmenu(this.oHoveredItem,true)}return}var t=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getNextSelectableItem(t));e.preventDefault();e.stopPropagation()};y.prototype.onsapnextmodifiers=y.prototype.onsapnext;y.prototype.onsapprevious=function(e){if(e.keyCode!=h.ARROW_UP){if(this.isSubMenu()){this.close()}e.preventDefault();e.stopPropagation();return}var t=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getPreviousSelectableItem(t));e.preventDefault();e.stopPropagation()};y.prototype.onsappreviousmodifiers=y.prototype.onsapprevious;y.prototype.onsaphome=function(e){this.setHoveredItem(this.getNextSelectableItem(-1));e.preventDefault();e.stopPropagation()};y.prototype.onsapend=function(e){this.setHoveredItem(this.getPreviousSelectableItem(this.getItems().length));e.preventDefault();e.stopPropagation()};y.prototype.onsappagedown=function(e){if(this.getPageSize()<1){this.onsapend(e);return}var t=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;t+=this.getPageSize();if(t>=this.getItems().length){this.onsapend(e);return}this.setHoveredItem(this.getNextSelectableItem(t-1));e.preventDefault();e.stopPropagation()};y.prototype.onsappageup=function(e){if(this.getPageSize()<1){this.onsaphome(e);return}var t=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;t-=this.getPageSize();if(t<0){this.onsaphome(e);return}this.setHoveredItem(this.getPreviousSelectableItem(t+1));e.preventDefault();e.stopPropagation()};y.prototype.onsapselect=function(e){this._sapSelectOnKeyDown=true;e.preventDefault();e.stopPropagation()};y.prototype.onkeyup=function(e){if(this.oHoveredItem&&u(e.target).prop("tagName")!="INPUT"){var t=this.oHoveredItem.getDomRef();u(t).attr("tabIndex",0).focus()}if(!this._sapSelectOnKeyDown){return}else{this._sapSelectOnKeyDown=false}if(!d.events.sapselect.fnCheck(e)){return}this.selectItem(this.oHoveredItem,true,false);e.preventDefault();e.stopPropagation()};y.prototype.onsapbackspace=function(e){if(u(e.target).prop("tagName")!="INPUT"){e.preventDefault()}};y.prototype.onsapbackspacemodifiers=y.prototype.onsapbackspace;y.prototype.onsapescape=function(e){this.close();e.preventDefault();e.stopPropagation()};y.prototype.onsaptabnext=y.prototype.onsapescape;y.prototype.onsaptabprevious=y.prototype.onsapescape;y.prototype.onmouseover=function(e){if(!i.system.desktop){return}var t=this.getItemByDomRef(e.target);if(!this.bOpen||!t){return}if(this.oOpenedSubMenu&&p(this.oOpenedSubMenu.getDomRef(),e.target)){return}this.setHoveredItem(t);if(c(e,this.getDomRef())){if(!i.browser.msie&&!i.browser.edge){this.getDomRef().focus()}}if(i.browser.msie){this.getDomRef().focus()}this._openSubMenuDelayed(t)};y.prototype._openSubMenuDelayed=function(e){if(!e){return}this._discardOpenSubMenuDelayed();this._delayedSubMenuTimer=setTimeout(function(){this.closeSubmenu();if(!e.getSubmenu()||!this.checkEnabled(e)){return}this.setHoveredItem(e);this.openSubmenu(e,false,true)}.bind(this),e.getSubmenu()&&this.checkEnabled(e)?y._DELAY_SUBMENU_TIMER:y._DELAY_SUBMENU_TIMER_EXT)};y.prototype._discardOpenSubMenuDelayed=function(e){if(this._delayedSubMenuTimer){clearTimeout(this._delayedSubMenuTimer);this._delayedSubMenuTimer=null}};y.prototype.onmouseout=function(e){if(!i.system.desktop){return}if(c(e,this.getDomRef())){if(!this.oOpenedSubMenu||!(this.oOpenedSubMenu.getParent()===this.oHoveredItem)){this.setHoveredItem(null)}this._discardOpenSubMenuDelayed()}};y.prototype.onsapfocusleave=function(e){if(this.oOpenedSubMenu||!this.bOpen){return}this.getRootMenu().handleOuterEvent(this.getId(),e)};y.prototype.handleOuterEvent=function(e,t){var o=false,n=i.support.touch||i.system.combi;this.bIgnoreOpenerDOMRef=false;if(t.type=="mousedown"||t.type=="touchstart"){if(n&&(t.isMarked("delayedMouseEvent")||t.isMarked("cancelAutoClose"))){return}var s=this;while(s&&!o){if(p(s.getDomRef(),t.target)){o=true}s=s.oOpenedSubMenu}}else if(t.type=="sapfocusleave"){if(n){return}if(t.relatedControlId){var s=this;while(s&&!o){if(s.oOpenedSubMenu&&s.oOpenedSubMenu.getId()==t.relatedControlId||p(s.getDomRef(),u(document.getElementById(t.relatedControlId)).get(0))){o=true}s=s.oOpenedSubMenu}}if(!o){this.bIgnoreOpenerDOMRef=true}}if(!o){this.close()}};y.prototype.getItemByDomRef=function(e){var t=this.getItems(),i=t.length;for(var o=0;o<i;o++){var n=t[o],s=n.getDomRef();if(p(s,e)){return n}}return null};y.prototype.selectItem=function(e,t,o){if(!e||!(e instanceof n&&this.checkEnabled(e))){return}var s=e.getSubmenu();if(!s){this.getRootMenu().close()}else{if(!i.system.desktop&&this.oOpenedSubMenu===s){this.closeSubmenu()}else{this.openSubmenu(e,t)}}e.fireSelect({item:e,ctrlKey:o});this.getRootMenu().fireItemSelect({item:e})};y.prototype.isSubMenu=function(){return this.getParent()&&this.getParent().getParent&&this.getParent().getParent()instanceof y};y.prototype.getRootMenu=function(){var e=this;while(e.isSubMenu()){e=e.getParent().getParent()}return e};y.prototype.getMenuLevel=function(){var e=1;var t=this;while(t.isSubMenu()){t=t.getParent().getParent();e++}return e};y.prototype.getPopup=function(){if(!this.oPopup){this.oPopup=new o(this,false,true,false);this.oPopup.setDurations(0,0);this.oPopup.attachClosed(this._menuClosed,this);this.oPopup.attachOpened(this._handleOpened,this)}return this.oPopup};y.prototype.setHoveredItem=function(e){if(this.oHoveredItem){this.oHoveredItem.hover(false,this)}if(!e){this.oHoveredItem=null;u(this.getDomRef()).removeAttr("aria-activedescendant");return}this.oHoveredItem=e;e.hover(true,this);this._setActiveDescendant(this.oHoveredItem);this.scrollToItem(this.oHoveredItem)};y.prototype._setActiveDescendant=function(e){if(sap.ui.getCore().getConfiguration().getAccessibility()&&e){var t=this;t.$().removeAttr("aria-activedescendant");setTimeout(function(){if(t.oHoveredItem===e){t.$().attr("aria-activedescendant",t.oHoveredItem.getId())}},10)}};y.prototype.openSubmenu=function(e,t,i){var n=e.getSubmenu();if(!n){return}if(this.oOpenedSubMenu&&this.oOpenedSubMenu!==n){this.closeSubmenu()}if(this.oOpenedSubMenu){this.oOpenedSubMenu._bFixed=i&&this.oOpenedSubMenu._bFixed||!i&&!this.oOpenedSubMenu._bFixed;this.oOpenedSubMenu._bringToFront()}else{this.oOpenedSubMenu=n;var s=o.Dock;n.open(t,this,s.BeginTop,s.EndTop,e,"0 0")}};y.prototype.closeSubmenu=function(e,t){if(this.oOpenedSubMenu){if(e&&this.oOpenedSubMenu._bFixed){return}if(t){this.oOpenedSubMenu.bIgnoreOpenerDOMRef=true}this.oOpenedSubMenu.close();this.oOpenedSubMenu=null}};y.prototype.scrollToItem=function(e){var t=this.getDomRef(),i=e?e.getDomRef():null;if(!i||!t){return}var o=t.scrollTop,n=i.offsetTop,s=u(t).height(),r=u(i).height();if(o>n){t.scrollTop=n}else if(n+r>o+s){t.scrollTop=Math.ceil(n+r-s)}};y.prototype._bringToFront=function(){u(document.getElementById(this.getPopup().getId())).mousedown()};y.prototype.checkEnabled=function(e){return e&&e.getEnabled()&&this.getEnabled()};y.prototype.getNextSelectableItem=function(e){var t=null;var i=this.getItems();for(var o=e+1;o<i.length;o++){if(i[o].getVisible()&&this.checkEnabled(i[o])){t=i[o];break}}if(!t){for(var o=0;o<=e;o++){if(i[o].getVisible()&&this.checkEnabled(i[o])){t=i[o];break}}}return t};y.prototype.getPreviousSelectableItem=function(e){var t=null;var i=this.getItems();for(var o=e-1;o>=0;o--){if(i[o].getVisible()&&this.checkEnabled(i[o])){t=i[o];break}}if(!t){for(var o=i.length-1;o>=e;o--){if(i[o].getVisible()&&this.checkEnabled(i[o])){t=i[o];break}}}return t};y.prototype.setRootMenuTopStyle=function(e){this.getRootMenu().bUseTopStyle=e;y.rerenderMenu(this.getRootMenu())};y.rerenderMenu=function(e){var t=e.getItems();for(var i=0;i<t.length;i++){var o=t[i].getSubmenu();if(o){y.rerenderMenu(o)}}e.invalidate();e.rerender()};y.prototype.focus=function(){if(this.bOpen){t.prototype.focus.apply(this,arguments);this._setActiveDescendant(this.oHoveredItem)}};y.prototype.isCozy=function(){if(!this.bCozySupported){return false}if(this.hasStyleClass("sapUiSizeCozy")){return true}if(r(this.oOpenerRef)){return true}if(r(this.getParent())){return true}return false};function r(e){if(!e){return false}e=e.$?e.$():u(e);return e.closest(".sapUiSizeCompact,.sapUiSizeCondensed,.sapUiSizeCozy").hasClass("sapUiSizeCozy")}function b(e,t){var i=e.getParent();if(i&&i instanceof n){i.onSubmenuToggle(t)}}function v(e){var t=e.getMaxVisibleItems(),i=document.documentElement.clientHeight-10,o=e.$();if(t>0){var n=e.getItems();for(var s=0;s<n.length;s++){if(n[s].getDomRef()){i=Math.min(i,n[s].$().outerHeight(true)*t);break}}}if(o.outerHeight(true)>i){o.css("max-height",i+"px").toggleClass("sapUiMnuScroll",true)}else{o.css("max-height","").toggleClass("sapUiMnuScroll",false)}}
/*!
	 * The following code is taken from
	 * jQuery UI 1.10.3 - 2013-11-18
	 * jquery.ui.position.js
	 *
	 * http://jqueryui.com
	 * Copyright 2013 jQuery Foundation and other contributors; Licensed MIT
	 */function I(e){var t=u(s);e.within={element:t,isWindow:true,offset:t.offset()||{left:0,top:0},scrollLeft:t.scrollLeft(),scrollTop:t.scrollTop(),width:t.width(),height:t.height()};e.collisionPosition={marginLeft:0,marginTop:0};return e}var S={fit:{left:function(e,t){var i=t.within,o=i.isWindow?i.scrollLeft:i.offset.left,n=i.width,s=e.left-t.collisionPosition.marginLeft,r=o-s,a=s+t.collisionWidth-n-o,p;if(t.collisionWidth>n){if(r>0&&a<=0){p=e.left+r+t.collisionWidth-n-o;e.left+=r-p}else if(a>0&&r<=0){e.left=o}else{if(r>a){e.left=o+n-t.collisionWidth}else{e.left=o}}}else if(r>0){e.left+=r}else if(a>0){e.left-=a}else{e.left=Math.max(e.left-s,e.left)}},top:function(e,t){var i=t.within,o=i.isWindow?i.scrollTop:i.offset.top,n=t.within.height,s=e.top-t.collisionPosition.marginTop,r=o-s,a=s+t.collisionHeight-n-o,p;if(t.collisionHeight>n){if(r>0&&a<=0){p=e.top+r+t.collisionHeight-n-o;e.top+=r-p}else if(a>0&&r<=0){e.top=o}else{if(r>a){e.top=o+n-t.collisionHeight}else{e.top=o}}}else if(r>0){e.top+=r}else if(a>0){e.top-=a}else{e.top=Math.max(e.top-s,e.top)}}},flip:{left:function(e,t){var i=t.within,o=i.offset.left+i.scrollLeft,n=i.width,s=i.isWindow?i.scrollLeft:i.offset.left,r=e.left-t.collisionPosition.marginLeft,a=r-s,p=r+t.collisionWidth-n-s,u=t.my[0]==="left"?-t.elemWidth:t.my[0]==="right"?t.elemWidth:0,h=t.at[0]==="left"?t.targetWidth:t.at[0]==="right"?-t.targetWidth:0,f=-2*t.offset[0],l,d;if(a<0){l=e.left+u+h+f+t.collisionWidth-n-o;if(l<0||l<Math.abs(a)){e.left+=u+h+f}}else if(p>0){d=e.left-t.collisionPosition.marginLeft+u+h+f-s;if(d>0||Math.abs(d)<p){e.left+=u+h+f}}},top:function(e,t){var i=t.within,o=i.offset.top+i.scrollTop,n=i.height,s=i.isWindow?i.scrollTop:i.offset.top,r=e.top-t.collisionPosition.marginTop,a=r-s,p=r+t.collisionHeight-n-s,u=t.my[1]==="top",h=u?-t.elemHeight:t.my[1]==="bottom"?t.elemHeight:0,f=t.at[1]==="top"?t.targetHeight:t.at[1]==="bottom"?-t.targetHeight:0,l=-2*t.offset[1],d,c;if(a<0){c=e.top+h+f+l+t.collisionHeight-n-o;if(e.top+h+f+l>a&&(c<0||c<Math.abs(a))){e.top+=h+f+l}}else if(p>0){d=e.top-t.collisionPosition.marginTop+h+f+l-s;if(e.top+h+f+l>p&&(d>0||Math.abs(d)<p)){e.top+=h+f+l}}}},flipfit:{left:function(){S.flip.left.apply(this,arguments);S.fit.left.apply(this,arguments)},top:function(){S.flip.top.apply(this,arguments);S.fit.top.apply(this,arguments)}}};u.ui.position._sapUiCommonsMenuFlip={left:function(e,t){if(u.ui.position.flipfit){u.ui.position.flipfit.left.apply(this,arguments);return}t=I(t);S.flipfit.left.apply(this,arguments)},top:function(e,t){if(u.ui.position.flipfit){u.ui.position.flipfit.top.apply(this,arguments);return}t=I(t);S.flipfit.top.apply(this,arguments)}}})(window);return y});