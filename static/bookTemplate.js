(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['book'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <div class=\"book-times-read\">Read: "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"timesRead") || (depth0 != null ? lookupProperty(depth0,"timesRead") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"timesRead","hash":{},"data":data,"loc":{"start":{"line":15,"column":41},"end":{"line":15,"column":54}}}) : helper)))
    + " times</div>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <div class=\"book-image\">\r\n         <img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"image") || (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data,"loc":{"start":{"line":19,"column":19},"end":{"line":19,"column":28}}}) : helper)))
    + "\" alt=\"Book image for "
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":19,"column":50},"end":{"line":19,"column":59}}}) : helper)))
    + "\">\r\n      </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"book\" \r\n     data-title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":26}}}) : helper)))
    + "\" \r\n     data-author=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"author") || (depth0 != null ? lookupProperty(depth0,"author") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data,"loc":{"start":{"line":3,"column":18},"end":{"line":3,"column":28}}}) : helper)))
    + "\" \r\n     data-length=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"length") || (depth0 != null ? lookupProperty(depth0,"length") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"length","hash":{},"data":data,"loc":{"start":{"line":4,"column":18},"end":{"line":4,"column":28}}}) : helper)))
    + "\" \r\n     data-id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"_id") || (depth0 != null ? lookupProperty(depth0,"_id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"_id","hash":{},"data":data,"loc":{"start":{"line":5,"column":14},"end":{"line":5,"column":21}}}) : helper)))
    + "\"\r\n     data-timesread=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"timesRead") || (depth0 != null ? lookupProperty(depth0,"timesRead") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"timesRead","hash":{},"data":data,"loc":{"start":{"line":6,"column":21},"end":{"line":6,"column":34}}}) : helper)))
    + "\"\r\n     data-review=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"review") || (depth0 != null ? lookupProperty(depth0,"review") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"review","hash":{},"data":data,"loc":{"start":{"line":7,"column":18},"end":{"line":7,"column":28}}}) : helper)))
    + "\"\r\n     data-genre=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"genre") || (depth0 != null ? lookupProperty(depth0,"genre") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"genre","hash":{},"data":data,"loc":{"start":{"line":8,"column":17},"end":{"line":8,"column":26}}}) : helper)))
    + "\"\r\n     data-image=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"image") || (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data,"loc":{"start":{"line":9,"column":17},"end":{"line":9,"column":26}}}) : helper)))
    + "\">\r\n  <div class=\"book-contents\">\r\n    <div class=\"book-info-container\">\r\n      <span class=\"book-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":12,"column":31},"end":{"line":12,"column":40}}}) : helper)))
    + "</span> <span class=\"book-author\">by "
    + alias4(((helper = (helper = lookupProperty(helpers,"author") || (depth0 != null ? lookupProperty(depth0,"author") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data,"loc":{"start":{"line":12,"column":77},"end":{"line":12,"column":87}}}) : helper)))
    + "</span> \r\n    </div>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"timesRead") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":4},"end":{"line":16,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"image") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":4},"end":{"line":21,"column":11}}})) != null ? stack1 : "")
    + "  </div>\r\n</div>\r\n";
},"useData":true});
})();