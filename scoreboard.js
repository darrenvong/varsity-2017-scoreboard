document.addEventListener("DOMContentLoaded", function() {
  var uniBar = document.querySelector("#uni-score-bar");
  var hallamBar = document.querySelector("#hallam-score-bar");
  var scores = document.querySelectorAll(".varsity-score");
  setTimeout(function() {
    uniBar.classList.add("uni-animate");
    hallamBar.classList.add("hallam-animate");
    for (var i = 0; i < scores.length; i++) {
      scores[i].classList.add("score-animate");
    }
  }, 2000);
});
