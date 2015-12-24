var dbFilm  = false;
var titles = [];
var title;

function filmDetals(title, id, cover_url,genre,desc) {
    document.getElementById("img").innerHTML = '<img src="' + cover_url +  '" >';
    document.getElementById("title").innerHTML =  'Title: ' + title;
    document.getElementById("_id").innerHTML =  'ID: ' + id;
    document.getElementById("genre").innerHTML =  'Genres: ' + genre;
    document.getElementById("desc").innerHTML =  'Description:  ' + desc;
    dbFilm = true;
    //document.getElementsByClassName("selector").innerHTML
}
$(document).ready(function(){
    $('.carousel').slick({
        dots: false,
        infinite: false,
        variableWidth: true
    });
    $(".session-item").click(function (){
        if(!($(this).hasClass('selected'))){
            $(this).addClass('selected');
            $("<div class='flag'>selected</div>").prependTo($(this));
            titles.push($(this).children('.title').text());
            if(titles.length == 1){
                $(".selector").text('Add this sessions to database');
            }else{
                $(".selector").text('Associate ' + titles.length + " titles");
            }

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
        if(titles.length > 0){
            if(dbFilm){
                $('.popup-box, #blackout').fadeIn(300);
                $('#film').text(titles);
            }else
                alert('You need to choose film from database');
        }else
            alert('You need to choose some sessions!');
    });
    //$(".slick-slide").click(function(event){
    //    var g;
    //    g = $(".selected-film").children('#title').text();
    //    if(!addedRight){
    //        $("a.selector").append(textRight);
    //        addedRight = true
    //    }
    //});
    $(".popup-box-close").click(function(event){
        $(".popup-box").hide();
        $('#blackout').hide();
    });

});
