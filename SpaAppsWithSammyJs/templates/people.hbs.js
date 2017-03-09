var people = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table>\r\n    <tr>\r\n        <th>Name</th>\r\n    </tr>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.result : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</table>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "    <tr id=\"row"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n        <td>\r\n";
  stack1 = ((helpers.link || (depth0 && depth0.link) || helperMissing).call(depth0, (depth0 != null ? depth0.id : depth0), (depth0 != null ? depth0.name : depth0), {"name":"link","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "            <a class=\"btn btn-danger btn-sm\" href=\"#/remove/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">Delete Me</a>\r\n        </td>\r\n    </tr>\r\n";
},"3":function(depth0,helpers,partials,data) {
  return "";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "﻿";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.result : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});