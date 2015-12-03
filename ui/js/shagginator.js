function loadDashboard(){
  $.get('ui/p/dashboard.htm').done(function(data){
    $('.page-content').html(data);
  });
  series.forEach(function(seriesID){
    getInfoAboutShow(seriesID, function(info){
      drawTile(info, 'showOnDashboard')
    });
  });
}
function getInfoAboutShow(seriesID, callback){
  if(seriesID !== null)
    $.get("http://api.tvmaze.com/shows/"+seriesID)
    .done(callback);
}
function drawTile(info, where){
  switch(where){
    case 'showOnDashboard':
        console.log(info);
        var image = "https://placeholdit.imgix.net/~text?txtsize=37&txt=No+image+here&w=640&h=1000&txttrack=0";
        if(null !== info.image){
          var image = info.image.original;
        }
        var name  = info.name;
        var id  = info.id;
        var shortSummary  = info.summary.replace(/<(?:.|\n)*?>/gm, '').slice(0,80);
        var summary  = info.summary.replace(/<(?:.|\n)*?>/gm, '');
        $('.content-holder').append(
            '<div class="col-md-3 col-sm-6 hero-feature" style="height:600px">'+
            '<div class="thumbnail">'+
            '<img src="'+image+'" alt="">'+
            '<div class="caption">'+
            '<h3>'+name+'</h3>'+
            '<p title="'+summary+'">'+shortSummary+'...</p>'+
            '<p>'+
            '<button onclick="delFromFav('+id+')" class="btn btn-warning">Delete from favorite</button>'+
            '<button onclick="loadSeries('+id+')" class="btn btn-default">More Info</button>'+            '</p>'+
            '</div>'+
            '</div>'+
            '</div>'
        );
        break;
    case 'showEpisodeOfSeries':
        var image = "https://placeholdit.imgix.net/~text?txtsize=37&txt=No+image+here&w=640&h=1000&txttrack=0";
        var name  = info.show.name+ " S"+(info.season<10 ? "0"+info.season : info.season)+"E"+(info.number < 10 ? "0"+info.number:info.number);
        if( null !== info.show.image){
          var image = info.show.image.original;
        }
        var id  = info.id;
        var showID  = info.show.id;
        var summary  = info.summary.replace(/<(?:.|\n)*?>/gm, '');
        $('.content-holder').append(
            '<div class="col-md-3 col-sm-6 hero-feature" style="height:600px">'+
            '<div class="thumbnail">'+
            '<img src="'+image+'" alt="">'+
            '<div class="caption">'+
            '<h3>'+name+'</h3>'+
            '<div class="row">'+
            '<button onclick="addToFav('+showID+')" class="btn btn-info">Add to favorite!</button>'+
            '</div>'+
            '<p>'+
            '<div class="row">'+
            '<button onclick="watch('+id+')" class="btn btn-warning">Watch</button>'+
            '<button onclick="loadSeries('+showID+')" class="btn btn-default">More Info</button>'+
            '</div>'+
            '</p>'+
            '</div>'+
            '</div>'+
            '</div>'
        );
        break;
  }
}
function getDateSeries(today, callback){
  $('.content-holder > div').remove();
  if(typeof today !== "string"){
    date = today.getFullYear()+'-'+(today.getMonth() < 10  ? "0"+today.getMonth():today.getMonth())+'-'+ (today.getDate() < 10  ? "0"+today.getDate():today.getDate());
  }else{
    date = today;
  }
  $.get('http://api.tvmaze.com/schedule?date='+date).done(callback);
}
function loadYesterdayShows(){
  var today = new Date();
  today.setDate(today.getDate() - 1); //here we are actually traveling through time
  getDateSeries(today, showSeriesForDay);
}
function loadTodayShows(){
  var today = new Date();
  getDateSeries(today, showSeriesForDay);
  return false;
}
function loadTomorrowShows(){
  var today = new Date();
  today.setDate(today.getDate() + 1); //here we are actually traveling through time
  getDateSeries(today, showSeriesForDay);
}
function showSeriesForDay(dataReceived)
{
  dataReceived.forEach(function(episode){
    drawTile(episode, 'showEpisodeOfSeries');
  });
}
function getFavoriteSeries(callback){
  $('.content-holder > div').remove();
  window.series = JSON.parse(localStorage.getItem('series') || "[]") ;
  callback();
}
function addToFav(id){
  var series = JSON.parse(localStorage.getItem('series') || "[]") ;
  window.asdasdajsdj = series;
  series.push(id);
  series = JSON.stringify(series);
  localStorage.setItem('series', series);
}
function delFromFav(id){
  var series = JSON.parse(localStorage.getItem('series') || "[]");
  var position = series.indexOf(id);
  if(position !== -1 ){
    delete(series[position]);
  }
  series = JSON.stringify(series);
  localStorage.setItem('series', series);
  getFavoriteSeries(loadDashboard)
}
$(document).ready(function(){
  setTimeout(function(){
    $('#datepicker').on('input',function(event){
      var target = event.target || event.srcElement;
      var date = target.value;
      getDateSeries(date, showSeriesForDay);
    });
  },1000)
});
