this["terse"] = this["terse"] || {};
this["terse"]["templates"] = this["terse"]["templates"] || {};

this["terse"]["templates"]["group"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id=\"html\">\r\n	<div class=\"module\">\r\n		<div class=\"toolbar\">\r\n			<h3>HTML</h3>\r\n		</div>\r\n		<textarea></textarea>\r\n	</div>\r\n</div>\r\n<div id=\"css\">\r\n	<div class=\"module\">\r\n		<div class=\"toolbar\">\r\n			<h3>CSS</h3>\r\n		</div>\r\n		<textarea></textarea>\r\n	</div>\r\n</div>\r\n<div id=\"js\">\r\n	<div class=\"module\">\r\n		<div class=\"toolbar\">\r\n			<h3>JS</h3>\r\n		</div>\r\n		<textarea></textarea>\r\n	</div>\r\n</div>\r\n<div id=\"result\">\r\n	<div class=\"module\">\r\n		<div class=\"toolbar\">\r\n			<h3>Result</h3>\r\n		</div>\r\n		<iframe></iframe>\r\n	</div>\r\n</div>";
  });

this["terse"]["templates"]["toolbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<ul>\r\n	<li class=\"link\">\r\n		<a id=\"link\" href=\"#\" target=\"_blank\"></a>\r\n	</li>\r\n	<li class=\"update\">\r\n		<button id=\"update\" type=\"button\" class=\"btn btn-mini\">Update <i class=\"icon-refresh\"></i></button>\r\n	</li>\r\n	<li class=\"save\">\r\n		<button id=\"save\" type=\"button\" class=\"btn btn-primary btn-mini\">Save <i class=\"icon-save\"></i></button>\r\n	</li>\r\n</ul>";
  });