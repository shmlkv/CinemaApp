var selecteddbFilm  = false;
var titles = [];
var title;

function filmDetals(title, id, cover_url,genre,desc) {
    document.getElementById("img").innerHTML = '<img src="' + cover_url +  '" >';
    document.getElementById("title").innerHTML =  title;
    document.getElementById("_id").innerHTML =  'ID: ' + id;
    document.getElementById("genre").innerHTML =  'Genres: ' + genre;
    document.getElementById("desc").innerHTML =  'Description:  ' + desc;
    selecteddbFilm = true;
    dbFilm = {};
    dbFilm.title = title;
    dbFilm.img = cover_url;
    dbFilm.id = id;


}
$(document).ready(function(){
    $('.carousel').slick({
        dots: false,
        infinite: false,
        variableWidth: true
    });
    $(".session-item").click(function (){
        if(!($(this).hasClass('selected'))){
            session = {}
            $(this).addClass('selected');
            $("<div class='flag'>selected</div>").prependTo($(this));
            session.title = $(this).children('.title').text()
            session.img = $(this).children('img').attr('src');
            titles.push(session);
            if(titles.length == 1){
                $(".selector").text('Add this sessions to database as new film');
            }else
                $(".selector").text('Associate ' + titles.length + " titles");
        }else{
            $(this).removeClass('selected');
            $(this).children().remove('.flag');
            titles.splice(titles.indexOf($(this).children('.title').text()), 1);
            $(".selector").text('Associate ' + titles.length + " titles");
            if(!titles.length) {
                $(".selector").text('Select to associate');
            }
        }
    });
    $(".selector").click(function (){
        var sessiontitles =[];
        if(titles.length > 0){
            $('.popup-box-content').children().remove('.popup-box-left , .popup-box-right');
            if(selecteddbFilm){
                link = '../api/associateSessions?' + 'film_id=' + dbFilm.id;
                $('.popup-box, #blackout').fadeIn(300);
                $('<div class="popup-box-left">')
                    .append($('<img>').attr('src',dbFilm.img))
                    .append('<span class="title">' + dbFilm.title + '</span>')
                    .append('<span class="id">' + dbFilm.id + '</span>')
                    .prependTo('.popup-box-content');
                $('<div class="popup-box-right">').appendTo('.popup-box-content');

                titles.forEach(function (session, index) {
                    $('<div class="inline-session">') //+ index+1 + '. '+titleItem
                        .prepend($('<img>').attr('src',session.img))
                        .prepend($('<span class="title">').text(session.title))
                        .appendTo('.popup-box-content .popup-box-right');
                    sessiontitles.push(session.title);
                    link += '&assNames[]=' + session.title;
                });
                $('a.associate.btn').attr('href', link);
            }else
                alert('You need to choose film from database');
        }else
            alert('You need to choose some sessions!');
    });
    $('#blackout, .popup-box-close').click(function(event){
        $('.popup-box, #blackout').hide();
        $('.popup-box-content').children().remove('span.title');
    });
});
