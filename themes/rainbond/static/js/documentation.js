$(function() {
  var selected = $(".sidemenu").find(".menu-item-selected");
  initOpen(selected);
  $(".canopen").on("click", function(event) {
    event.stopPropagation();
    var item_count = $(this).data("count");
    var current_heitht = $(this).height();
    var height = 36 * (item_count + 1);
    if (item_count > 0 && current_heitht < height) {
      $(this).height(height);
      $(this).find(".menu-toggle").css({ transform: "rotate(0deg)" });
    } else {
      $(this).height(36);
      $(this).find(".menu-toggle").css({ transform: "rotate(-90deg)" });
    }
  });
  $(".sidemenu-toggle").on("click", function() {
    if ($(this).parent().hasClass("sidemenu-open")) {
      $(this).parent().removeClass("sidemenu-open");
      $(this).find("img").attr({
        src:
          "https://img.alicdn.com/tfs/TB1E6apXHGYBuNjy0FoXXciBFXa-200-200.png"
      });
    } else {
      $(this).parent().addClass("sidemenu-open");
      $(this).find("img").attr({
        src:
          "https://img.alicdn.com/tfs/TB1I5itXQyWBuNjy0FpXXassXXa-200-200.png"
      });
    }
  });
  $("#bt-search").on("click", function() {
    handleSearch();
  });
  $("#bt-search-global").on("click", function() {
     var query = $(".search-ipt").val();
     window.location.href = "/docs/search/?query="+query
  });
  $(document).keyup(function(event) {
    if (event.keyCode == 13) {
      if ($(".search-box-global").length>0){
        var query = $(".search-ipt").val();
        window.location.href = "/docs/search/?query="+query
      }else{
        handleSearch();
      }
    }
  });
  if (getQueryVariable("query")) {
    if ($(".search-ipt").length > 0) {
      var query = getQueryVariable("query")
      $(".search-ipt").val(query);
      handleSearch();
    }
  }
});
function initOpen(item) {
  var parentLi = $(item).parent("ul").parent();
  if ($(parentLi).height() == 36 && $(parentLi).data("count") > 0) {
    $(parentLi).height(($(parentLi).data("count") + 1) * 36);
  }
  var p = $(parentLi).parent("ul").parent();
  if (p.length > 0) {
    initOpen(parentLi);
  }
}

function handleSearch() {
  if ($(".search-ipt").length > 0) {
    var query = $(".search-ipt").val();
    $(".search-list").loading();
    search(query, items => {
      $(".search-list").loading("stop")
      if (items && items.length > 0) {
        if (!$(".search-list").find(".tips").hasClass("hidden")) {
          $(".search-list").find(".tips").addClass("hidden");
        }
        var box = $(".search-list").find("ul");
        $(box).empty();
        if ($(box).hasClass("hidden")) {
          $(box).removeClass("hidden");
        }
        items.map(item => {
          var li = $("<li></li>");
          if (item.title) {
            li.append(
              '<h4><a href="' +
                item.url +
                '" class="links" target="_blank">' +
                item.title +
                "</a></h4>"
            );
          }
          if (item.description) {
            li.append('<p class="ct">' + item.description + "</p>");
          }
          $(box).append(li);
        });
      } else {
        if ($(".search-list").find(".tips").hasClass("hidden")) {
          $(".search-list").find(".tips").removeClass("hidden");
        }
        var box = $(".search-list").find("ul");
        $(box).empty();
      }
    });
  }
}

var client = algoliasearch("RITXU8D7M1", "821093c5255b7d4d40129bc13a12882f");
var index = client.initIndex("rainbond-v5.1");
index.setSettings({
  searchableAttributes: ["title,alternative_title", "content", "description"]
});
function search(term, response) {
  index.search(
    {
      query: term
    },
    function(err, re) {
      if (err) {
        console.log(err);
        return;
      }
      response(re.hits);
    }
  );
}

function getQueryVariable(key){
  var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}