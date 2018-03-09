document.addEventListener("DOMContentLoaded", function() {
  /** Given the `points` scored out of the `total` points scored,
   * creating a copy of ScoreBarWidthCalc using the below function, which takes the points scored by
   * Uni and Hallam, enable additional functions attached to the calculator "object" which calculate
   * the decimal percentage width of each side's scorebar in the given `context`. Additionally,
   * it also has a function which works out the points required to win based on the previous winner
   * provided. 'context' defaults to "relative" (see explanation below).
   * Possible contexts:
   * - "relative": percentage width calculated is based on the total points scored by both sides
   * so far.
   * - "overall": percentage width calculated is based on the total points available out of
   * all Varsity events this year.
   *
   * If the "overall" context is given, then the number of points available in the whole Varsity
   * event should be given in the 4th `total` parameter.
   */
  function ScoreBarWidthCalc(uniScore, hallamScore, context, total) {
    this.uniScore = uniScore;
    this.hallamScore = hallamScore;
    this.context = context || "relative";
    this.total = (this.context === "relative")? (this.uniScore + this.hallamScore) : total;
  }

  ScoreBarWidthCalc.prototype = {
    // Percentage width calculated here is double its actual value since each bar's initial width is 50% (0.5)
    getUniWidth: function() { return (2 * this.uniScore / this.total).toFixed(2); },
    getHallamWidth: function() {return (2 * this.hallamScore / this.total).toFixed(2); },
    getPointsToWin: function() {return (this.context === "overall")? (this.total / 2) + 0.5 : "Unknown";}
  };

  function prefixTransform(rule) {
    var prefixedRule = "";
    var splittedRule = rule.split(":");
    var prefixes = ["-webkit-", "-ms-"];
    for (var i = 0; i < prefixes.length; i++) {
      prefixedRule += prefixes[i]+splittedRule[0]+":"+splittedRule[1];
    }
    prefixedRule += rule;
    return prefixedRule;
  }
  
  function applyAnimation() {
    var uniBar = document.querySelector("#uni-score-bar");
    var hallamBar = document.querySelector("#hallam-score-bar");
    var scores = document.querySelectorAll(".varsity-score");
    var winner = document.querySelector(".varsity-winner");
    uniBar.classList.add("uni-animate");
    hallamBar.classList.add("hallam-animate");
    for (var i = 0; i < scores.length; i++) {
        scores[i].classList.add("score-animate");
    }
    if (winner) { winner.classList.add("winner-animate"); }
  }
  
  function appendWinnerBadge(uniScore, hallamScore, calculator) {
      var scoreboard = document.querySelector(".varsity-scoreboard");
      if (uniScore >= calculator.getPointsToWin()) {
          jQuery("<div class='varsity-winner uni-colour'>University of Sheffield Win</div>").appendTo(scoreboard);
      }
      else if (hallamScore >= calculator.getPointsToWin()) {
          jQuery("<div class='varsity-winner hallam-colour'>Sheffield Hallam Win</div>").appendTo(scoreboard);
      }
  }
  var totalPoints = +(document.querySelector(".varsity-scoreboard").dataset.overallPoints);
  var uniScore = +(document.getElementById("uni-score").textContent);
  var hallamScore = +(document.getElementById("hallam-score").textContent);
  var winInfoText = document.querySelector("#win-info-text");
  if (winInfoText) {
      var calculator = new ScoreBarWidthCalc(uniScore, hallamScore, "overall", totalPoints);
      winInfoText.textContent = calculator.getPointsToWin() + " To Win";
      appendWinnerBadge(uniScore, hallamScore, calculator);
  }
  else { var calculator = new ScoreBarWidthCalc(uniScore, hallamScore); }

  var stylesheet = document.getElementById("scoreboard-style");
  stylesheet.textContent += ".uni-animate {" + prefixTransform("transform: scaleX(" + calculator.getUniWidth() + ");") + "}";
  stylesheet.textContent += ".hallam-animate {" + prefixTransform("transform: scaleX(" + calculator.getHallamWidth() + ");") + "}";

  setTimeout(applyAnimation, 1500);
});
