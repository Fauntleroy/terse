this["terse"] = this["terse"] || {};
this["terse"]["templates"] = this["terse"]["templates"] || {};

this["terse"]["templates"]["group"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id=\"files\">\r\n	<ul class=\"nav nav-tabs\">\r\n		<li class=\"active\"><a href=\"#html\">HTML</a></li>\r\n		<li><a href=\"#css\">CSS</a></li>\r\n		<li><a href=\"#js\">JS</a></li>\r\n	</ul>\r\n	<div class=\"tab-content\">\r\n		<div id=\"html\" class=\"tab-pane active\">\r\n			<textarea></textarea>\r\n		</div>\r\n		<div id=\"css\" class=\"tab-pane\">\r\n			<textarea></textarea>\r\n		</div>\r\n		<div id=\"js\" class=\"tab-pane\">\r\n			<textarea></textarea>\r\n		</div>\r\n	</div>\r\n</div>\r\n<div id=\"result\">\r\n	<iframe></iframe>\r\n</div>";
  });

this["terse"]["templates"]["toolbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<ul>\r\n	<li class=\"link\">\r\n		<a id=\"link\" href=\"#\" target=\"_blank\"></a>\r\n	</li>\r\n	<li class=\"update\">\r\n		<button id=\"update\" type=\"button\" class=\"btn btn-mini\">Update <i class=\"icon-refresh\"></i></button>\r\n	</li>\r\n	<li class=\"save\">\r\n		<button id=\"save\" type=\"button\" class=\"btn btn-primary btn-mini\">Save <i class=\"icon-save\"></i></button>\r\n	</li>\r\n</ul>";
  });