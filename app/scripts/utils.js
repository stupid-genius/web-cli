if(!String.prototype.format){
    String.prototype.format = function(){
      var args = arguments;
      return this.replace(/{{(\d+)}}/g, function(match, number){
        return args[number] || '';
      });
    };
}
function decodeHtml(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}
