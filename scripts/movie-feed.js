$(function(){

    //HTML objects
    var $mainContent;
    var $searchTermTxt;
    var $searchMovieBtn;

    //Movie API url
    var movieUrl = "http://www.omdbapi.com/?";

    //init - setHTMLObjects
    var init = function(){
        var setHTMLObjects = function(){
            $mainContent = $("#mainContent");
            $searchTermTxt = $("#searchTermTxt");
            $searchMovieBtn = $("#searchMovieBtn");
        }();

        var setEvents = function(){
            $searchMovieBtn.on("click", function(){ //On click..
                var searchTerm = $searchTermTxt.val(); //..get value from input..
                getAjaxMovieFeed(movieUrl, searchTerm); //..and get search value out of API.
            });
        }();//end setEvents
    }();//end init

    //GET Ajax Movie feed
    function getAjaxMovieFeed(url, searchTerm){

        var movieConfig = {
            s: searchTerm, //Movie title to search for.
            type: "movie" //Type of result to return.
            //r: "json" //Data type to return. JSON is default.
        };

        $.getJSON(url, movieConfig)
            .done(function(resultJSONObject){
            showMovieFeed(resultJSONObject); //Send JSON result if search i success.
        })
            .fail(function(){
            console.log("Error"); //Show error-message in console if search fails.
        });
    }

    //Show movie feed
    function showMovieFeed(feed){

        //Add feedback if search results fails:
        if(feed.Response == "False"){
            alert(feed.Error + " Try again.");
            $searchTermTxt.val("");
        }

        //console.log(feed); //Test to show result i console.
        $mainContent.html(""); //Empty mainContent when new search.

        $(feed.Search).each(function(){ //For each JSON objekt

            //Set and get values from JSON object:
            var title = this.Title;
            var year = this.Year;
            var imgUrl = this.Poster;

            var $newArticle = $("<article>")
                .css("height", "600px");

            var $thumbnail = $("<div>")
                .addClass("thumbnail");

            var $caption = $("<div>")
                .addClass("caption");

            var $title = $("<h3>").html(title);
            var $year = $("<p>").html(year);

            var $imgUrl = $("<img>")
            .attr(
                {
                    src: imgUrl,
                    alt: title
                })
            .addClass("img-responsive");

            var $imgFails = $("<p>").html("Image is missing :(") //Feedback if image is missing.
                .css("color", "red");

            //Appending/put all elements to an article:
            $newArticle
                .append(
                $thumbnail
                .append(
                    $title,
                    $year,
                    $caption
                )
            );

            if(imgUrl == null || imgUrl == "N/A"){ //Add feedback if image is missing..
                $caption.append($imgFails);
            }else{
                $caption.append($imgUrl); //else; add the image.
            }

            $mainContent.append($newArticle); //Appending created articles to mainContent in index.html.
        });//end each loop

        $("article", $mainContent) //Goes faster to add class on articles outside of the loop.
            .addClass("col-sm-4");
    }
});
