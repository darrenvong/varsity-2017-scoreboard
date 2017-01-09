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
  $score_data["Uni"] = array();
  $score_data["Hallam"] = array();
  if ( $sidebar_query->have_posts() ):
    while ( $sidebar_query->have_posts() ):
      $sidebar_query->the_post();
      
      $point_winner = do_shortcode('[ct id="_ct_radio_5871c7613388e" property="value"]');
      $score_data[$point_winner][] = array(
        'sport' => esc_html( get_the_title() ),
        'is_half_point' => esc_html( do_shortcode('[ct id="_ct_checkbox_5871c9a0400a5" property="value"]') ),
        'link' => esc_html( do_shortcode('[ct id="_ct_text_5871c88a5edcd" property="value"]') )
      );
    endwhile;
  endif;
  wp_reset_postdata();
  
  return $score_data;
}
