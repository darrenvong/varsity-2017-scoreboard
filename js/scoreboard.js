document.addEventListener("DOMContentLoaded", function() {

  /** Given the `points` scored out of the `total` points scored,
   * This ScoreBarWidthCalc 'class' function takes the points scored by Uni and Hallam, and
   * returns the functions which calculate the decimal percentage width of each side's
   * scorebar in the given `context`. 'context' defaults to "relative". (see explanation below)
   * Possible contexts:
   * - "relative": percentage width calculated is based on the total points scored by both sides
   * so far.
   * - "overall": percentage width calculated is based on the total points available out of
   * all Varsity events this year.
   *
   * If the "overall" context is given, then the number of points required to win Varsity should
   * be given in the 4th `pointsToWin` parameter.
   */
  function ScoreBarWidthCalc(uniScore, hallamScore, context, pointsToWin) {
    this.uniScore = uniScore;
    this.hallamScore = hallamScore;
    this.context = context || "relative";
    this.total = (this.context === "relative")? (this.uniScore + this.hallamScore) : (2 * pointsToWin);
  }

  ScoreBarWidthCalc.prototype = {
    // Percentage width calculated here is double its actual value since each bar's initial width is 50% (0.5)
    getUniWidth: function() { return (2 * this.uniScore / this.total).toFixed(2); },
    getHallamWidth: function() {return (2 * this.hallamScore / this.total).toFixed(2); }    
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

  var uniScore = +(document.getElementById("uni-score").textContent);
  var hallamScore = +(document.getElementById("hallam-score").textContent);
  var calculator = (document.querySelector("#win-info-text"))?
                      new ScoreBarWidthCalc(uniScore, hallamScore, "overall", 40) :
                      new ScoreBarWidthCalc(uniScore, hallamScore);

  var stylesheet = document.getElementById("scoreboard-style");
  stylesheet.textContent += ".uni-animate {" + prefixTransform("transform: scaleX(" + calculator.getUniWidth() + ");") + "}";
  stylesheet.textContent += ".hallam-animate {" + prefixTransform("transform: scaleX(" + calculator.getHallamWidth() + ");") + "}";

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
});
