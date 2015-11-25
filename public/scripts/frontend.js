function filmDetals(title, id, cover_url,genre,desc) {
    document.getElementById("img").innerHTML = '<img src="' + cover_url +  '" >';
    document.getElementById("title").innerHTML =  title;
    document.getElementById("_id").innerHTML =  id;
    document.getElementById("genre").innerHTML =  genre;
    document.getElementById("desc").innerHTML =  desc;
}