let lookup = {};
var airports = [];
var airlines = [];

$.getJSON("../data/meta/lookup_all.json", function(json) {
  lookup = json;
  airlines = Object.keys(lookup["airlines_to_airline_codes"]);
  airports = Object.keys(lookup["airports_to_airport_codes"]);
  for (let i = 0; i < airports.length; i++) {
    let airport = airports[i];
    let code = lookup["airports_to_airport_codes"][airport];
    airports[i] = airport + " (" + code + ")";
  }
  autocomplete(document.getElementById("origin"), airports);
  autocomplete(document.getElementById("destination"), airports);
  autocomplete(document.getElementById("airline"), airlines);
});

$(window).resize(function() {
  let h = $(document).height();
  var jumbo = $("body");
  jumbo.height(h);
});
$(document).ready(function() {
  $("#form").submit(function(e) {
    e.preventDefault();
    const date = new Date($("#date").val());
    let str = $("#origin").val();
    const origin = str.substring(
      str.lastIndexOf("(") + 1,
      str.lastIndexOf(")")
    );
    str = $("#destination").val();
    const dest = str.substring(str.lastIndexOf("(") + 1, str.lastIndexOf(")"));
    const airline = lookup["airlines_to_airline_codes"][$("#airline").val()];
    let url =
      "/predict/?date=" +
      date.toISOString() +
      "&origin=" +
      origin +
      "&dest=" +
      dest +
      "&airline=" +
      airline;
    console.log(url);
    let key = origin + "_" + dest;
    if (!(key in lookup["airport_codes_to_route_time"][date.getMonth()])) {
      alert("Route/Airline incompatibility!");
    } else {
      window.location.href = url;
    }
  });

  let h = $(document).height();
  var jumbo = $("body");
  jumbo.height(h);

  function easeOutCubic(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }
  function easeInOutQuad(x, t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t + b;
    } else {
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    }
  }

  let fps = 60,
    duration = 15, // seconds
    start = 120, // pixel
    finish = 210,
    distance = finish - start,
    increment = distance / (duration * fps),
    position = start,
    time = 0,
    sub = false;

  function changeAngle() {
    time += 1 / fps;
    if (sub) {
      position =
        finish -
        (easeInOutQuad((time * 100) / duration, time, start, finish, duration) -
          start);
    } else {
      position = easeInOutQuad(
        (time * 100) / duration,
        time,
        start,
        finish,
        duration
      );
    }
    if (position <= start && sub == true) {
      time = 0;
      sub = false;
    }
    if (position >= finish && sub == false) {
      time = 0;
      sub = true;
    }
    jumbo.css({
      background:
        "linear-gradient(" +
        position +
        "deg,rgba(25,84,123,1) 0%, rgba(255,232,195, 1) 100%)"
    });
  }

  setInterval(changeAngle, 1000 / fps);
});

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    let added = 0;
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].toUpperCase().includes(val.toUpperCase()) && added < 8) {
        added += 1;
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = arr[i];
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          let loc = this.getElementsByTagName("input")[0].value;
          if (loc.indexOf(":") > 0) {
            loc =
              loc.substring(0, loc.indexOf(":")) +
              " " +
              loc.substring(loc.indexOf("("), loc.length);
          }
          inp.value = loc;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
