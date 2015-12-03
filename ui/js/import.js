function loadModule(module){
  document.write("<script src='ui/js/"+module+".js'><\/script>");
}
loadModule('browser-sync');
loadModule('bootstrap');
loadModule('shagginator');
$('import').each(function(key,elem){
  url = $(elem).attr('url');
  $.get(url).done(function(data){
    $(elem).html(data);
  });
});
