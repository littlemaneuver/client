(function(d){var f={zIndex:1E3,type:"html",content:"",url:"",ajax:{},ajax_request:null,closeOnEsc:!0,closeOnOverlayClick:!0,overlay:{block:void 0,tpl:'<div class="arcticmodal-overlay"></div>',css:{backgroundColor:"#000",opacity:0.6}},container:{block:void 0,tpl:'<div class="arcticmodal-container"><table class="arcticmodal-container_i"><tr><td class="arcticmodal-container_i2"></td></tr></table></div>'},wrap:void 0,body:void 0,errors:{tpl:'<div class="arcticmodal-error arcticmodal-close"></div>',autoclose_delay:2E3,
ajax_unsuccessful_load:"Error"},openEffect:{type:"fade",speed:400},closeEffect:{type:"fade",speed:400},beforeOpen:d.noop,afterOpen:d.noop,beforeClose:d.noop,afterClose:d.noop,afterLoading:d.noop,errorLoading:d.noop},g=d(),j={isEventOut:function(a,b){var c=!0;d(a).each(function(){d(b.target).get(0)==d(this).get(0)&&(c=!1);0==d(b.target).closest("HTML",d(this).get(0)).length&&(c=!1)});return c}},e={transition:function(a,b,c,e){e=void 0==e?d.noop:e;switch(c.type){case "fade":"show"==b?a.fadeIn(c.speed,
e):a.fadeOut(c.speed,e);break;case "none":"show"==b?a.show():a.hide(),e()}},prepare_body:function(a,b){d(">*",a.body).show();d(".arcticmodal-close",a.body).click(function(){b.arcticmodal("close");return!1})},init_el:function(a,b){var c=a.data("arcticmodal");if(!c){c=b;c.overlay.block=d(c.overlay.tpl);c.overlay.block.css(c.overlay.css);c.container.block=d(c.container.tpl);c.body=d(".arcticmodal-container_i2",c.container.block);c.body.html(a.clone(!0));e.prepare_body(c,a);c.closeOnOverlayClick&&c.overlay.block.add(c.container.block).click(function(b){j.isEventOut(d(">*",
c.body),b)&&a.arcticmodal("close")});a.data("arcticmodal",c);g=g.add(a);d.proxy(h.show,a)();if("html"==c.type)return a;if(void 0!=c.ajax.beforeSend){var f=c.ajax.beforeSend;delete c.ajax.beforeSend}if(void 0!=c.ajax.success){var i=c.ajax.success;delete c.ajax.success}if(void 0!=c.ajax.error){var k=c.ajax.error;delete c.ajax.error}var l=d.extend(!0,{url:c.url,beforeSend:function(){f==void 0?c.body.html('<div class="arcticmodal-loading" />'):f(c,a)},success:function(b){a.trigger("afterLoading");c.afterLoading(c,
a,b);i==void 0?c.body.html(b):i(c,a,b);e.prepare_body(c,a)},error:function(){a.trigger("errorLoading");c.errorLoading(c,a);if(k==void 0){c.body.html(c.errors.tpl);d(".arcticmodal-error",c.body).html(c.errors.ajax_unsuccessful_load);d(".arcticmodal-close",c.body).click(function(){a.arcticmodal("close");return false});c.errors.autoclose_delay&&setTimeout(function(){a.arcticmodal("close")},c.errors.autoclose_delay)}else i(c,a)}},c.ajax);c.ajax_request=d.ajax(l);a.data("arcticmodal",c)}},init:function(a){a=
d.extend(!0,{},f,a);if(d.isFunction(this))if(void 0==a)d.error("jquery.arcticmodal: Uncorrect parameters");else if(""==a.type)d.error('jquery.arcticmodal: Don\'t set parameter "type"');else switch(a.type){case "html":if(""==a.content){d.error('jquery.arcticmodal: Don\'t set parameter "content"');break}var b=a.content;a.content="";return e.init_el(d(b),a);case "ajax":if(""==a.url){d.error('jquery.arcticmodal: Don\'t set parameter "url"');break}return e.init_el(d("<div />"),a)}else return this.each(function(){e.init_el(d(this),
a)})}},h={show:function(){var a=d(this),b=a.data("arcticmodal");if(b)return b.overlay.block.css("zIndex",f.zIndex++).hide(),b.container.block.css("zIndex",f.zIndex++).hide(),d("BODY").append(b.overlay.block),d("BODY").append(b.container.block),b.beforeOpen(b,a),a.trigger("beforeOpen"),"hidden"!=b.wrap.css("overflow")&&(b.wrap.data("arcticmodalOverflow",b.wrap.css("overflow")),b.wrap.css("overflow","hidden")),e.transition(b.container.block,"show",b.openEffect),e.transition(b.overlay.block,"show",b.openEffect,
function(){b.afterOpen(b,a);a.trigger("afterOpen")}),a;d.error("jquery.arcticmodal: Uncorrect call")},close:function(){if(d.isFunction(this))g.each(function(){d(this).arcticmodal("close")});else return this.each(function(){var a=d(this),b=a.data("arcticmodal");b?!1!==b.beforeClose(b,a)&&(a.trigger("beforeClose"),f.zIndex-=2,e.transition(b.overlay.block,"hide",b.closeEffect),e.transition(b.container.block,"hide",b.closeEffect,function(){b.afterClose(b,a);a.trigger("afterClose");b.overlay.block.remove();
b.container.block.remove();a.data("arcticmodal",null);d(".arcticmodal-container").length||b.wrap.data("arcticmodalOverflow")&&b.wrap.css("overflow",b.wrap.data("arcticmodalOverflow"))}),"ajax"==b.type&&b.ajax_request.abort(),g=g.not(a)):d.error("jquery.arcticmodal: Uncorrect call")})}};d(function(){f.wrap=d(document.all&&!document.querySelector?"html":"body")});d(document).bind("keyup.arcticmodal",function(a){var b=g.last();b.length&&b.data("arcticmodal").closeOnEsc&&27===a.keyCode&&b.arcticmodal("close")});
d.arcticmodal=d.fn.arcticmodal=function(a){if(h[a])return h[a].apply(this,Array.prototype.slice.call(arguments,1));if("object"===typeof a||!a)return e.init.apply(this,arguments);d.error("jquery.arcticmodal: Method "+a+" does not exist")}})(jQuery);