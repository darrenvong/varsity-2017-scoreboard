<?php

function forge_varsity_get_current_score() {
  $score_query = new WP_Query(
    array(
        'post_type' => 'header_scoreboard',
        'posts_per_page' => 1
    )
  );
  $scores = array();
  if ( $score_query->have_posts() ):
    while ( $score_query->have_posts() ):
        $score_query->the_post();
        // shortcode comes from CustomPress plugin
        $scores['uni'] = esc_attr( do_shortcode('[ct id="_ct_text_5871c1bdb483b" property="value"]') );
        $scores['hallam'] = esc_attr( do_shortcode('[ct id="_ct_text_5871c263cdc2a" property="value"]') );
    endwhile;
  endif;
  wp_reset_postdata();
  
  return $scores;
}

function forge_varsity_get_sidebar_score_data() {
  $sidebar_query = new WP_Query( array('post_type' => 'side_scoreboard') );
  $score_data = array();
  if ( $sidebar_query->have_posts() ):
    $score_data["Uni"] = array();
    $score_data["Hallam"] = array();
    while ( $sidebar_query->have_posts() ):
      $sidebar_query->the_post();
      
      $point_winner = do_shortcode('[ct id="_ct_radio_5871c7613388e" property="value"]');
      $is_half_point = do_shortcode('[ct id="_ct_checkbox_5871c9a0400a5" property="value"]') === "Yes";
      $score_data[$point_winner][] = array(
        'sport' => esc_html( get_the_title() ),
        'is_half_point' => ( $is_half_point )? $point_winner."-half" : $point_winner."-full",
        'link' => esc_html( do_shortcode('[ct id="_ct_text_5871c88a5edcd" property="value"]') )
      );
      if ( !array_key_exists("points", $score_data[$point_winner]) ) {
        $score_data[$point_winner]["points"] = ($is_half_point)? 0.5 : 1.0;
      }
      else {
        $score_data[$point_winner]["points"] += ($is_half_point)? 0.5 : 1.0;
      }
    endwhile;
  endif;
  wp_reset_postdata();
  
  return $score_data;
}

function forge_varsity_scorebar_filler($actual_height) {
    echo "<div style='height: $actual_height;'></div>";
}

function forge_varsity_get_side_scorebar_output($score_data, $side) {
  // positive value if Uni is leading, negative if Hallam is leading, 0 if level on points
  $filler_height = ($score_data["Uni"]["points"] - $score_data["Hallam"]["points"]) * 40;
  $actual_height = abs($filler_height) . "px";
  ob_start();
  if ( $side === "Uni") {
    if ( $filler_height < 0 ) { forge_varsity_scorebar_filler( $actual_height ); }
  }
  else if ( $side === "Hallam" ) {
    if ( $filler_height > 0 ) { forge_varsity_scorebar_filler( $actual_height ); }
  }
  foreach ( $score_data[$side] as $_ => $event ):
    if ( $_ === "points") { continue; }
    if ( $event['link'] ): ?>
    <a href="<?= $event['link'] ?>">
    <?php endif; ?>
      <div class="<?= $event['is_half_point'] ?>"><?= $event['sport'] ?></div>
<?php
  endforeach;
    return ob_get_clean();
}

?>
