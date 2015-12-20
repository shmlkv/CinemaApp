function filmDetals(title, id, cover_url,genre,desc) {
    document.getElementById("img").innerHTML = '<img src="' + cover_url +  '" >';
    document.getElementById("title").innerHTML =  'Title: ' + title;
    document.getElementById("_id").innerHTML =  'ID: ' + id;
    document.getElementById("genre").innerHTML =  'Genres: ' + genre;
    document.getElementById("desc").innerHTML =  'Description:  ' + desc;
}

$(document).ready(function(){
    $('.carousel').slick({
        dots: false,
        infinite: false,
        variableWidth: true
});
});