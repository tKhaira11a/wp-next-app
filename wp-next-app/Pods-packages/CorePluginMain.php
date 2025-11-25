function register_next_components_query() {
  register_graphql_field( 'page', 'nextComponents', [
    'type' => ['list_of' => 'Next_component'],
    'description' => 'Sortierte Liste der Next Components einer Page',
    'resolve' => function( $source, $args, $context, $info ) {
                $post_id = $source->ID;
                $pods = pods('page', $post_id);
                if(!$pods) {
                        return null;
                }
                $related_ids = $pods->field('next_component', [
                        'output' => 'ids'
                ]);
                if(!$related_ids) {
                        return null;
                }
                $ordered_posts = [];
                foreach ($related_ids as $id) {
                        $post = get_post($id);
                        if ($post) {
                                $ordered_posts[] = new \WPGraphQL\Model\Post($post);
                        }
                }

                return $ordered_posts;
    }
  ]);
}
add_action('graphql_register_types', 'register_next_components_query');

function register_sorted_testimonial_list() {
  register_graphql_field('Animated_testimonials', 'sortedTestimonials', [
    'type' => ['list_of' => 'Testimonial'],
    'description' => 'Sortierte Liste der Testimonials',
    'resolve' => function($source, $args, $context, $info) {
      $post_id = $source->ID;
      $pods = pods('animated_testimonial', $post_id);

      if (!$pods) {
        return null;
      }

      $related_ids = $pods->field('testimonial_list', [
        'output' => 'ids'
      ]);

      if (empty($related_ids)) {
        return null;
      }

      $ordered_posts = [];
      foreach ($related_ids as $id) {
        $post = get_post($id);
        if ($post) {
          $ordered_posts[] = new \WPGraphQL\Model\Post($post);
        }
      }

      return $ordered_posts;
    }
  ]);
}

add_action('graphql_register_types', 'register_sorted_testimonial_list');

function register_sorted_product_list() {
  register_graphql_field('Hero_paralax', 'sortedProducts', [
    'type' => ['list_of' => 'Hero_paralax_product'],
    'description' => 'Sortierte Liste der Produkte im Hero Parallax',
    'resolve' => function($source, $args, $context, $info) {
      $post_id = $source->ID;
      $pods = pods('hero_paralax', $post_id); // Podname ohne 's' am Ende

      if (!$pods) {
        return null;
      }

      $related_ids = $pods->field('product_list', [
        'output' => 'ids'
      ]);

      if (empty($related_ids)) {
        return null;
      }

      $ordered_posts = [];
      foreach ($related_ids as $id) {
        $post = get_post($id);
        if ($post) {
          $ordered_posts[] = new \WPGraphQL\Model\Post($post);
        }
      }

      return $ordered_posts;
    }
  ]);
}

add_action('graphql_register_types', 'register_sorted_product_list');

function register_sorted_url_list() {
  register_graphql_field('Button_grid', 'sortedUrlList', [
    'type' => ['list_of' => 'List_item'],
    'description' => 'Sortierte Liste der URLs des Button Grids',
    'resolve' => function($source, $args, $context, $info) {
      $post_id = $source->ID;
      $pods = pods('button_grid', $post_id); // Podname ohne 's' am Ende

      if (!$pods) {
        return null;
      }

      $related_ids = $pods->field('list_item', [
        'output' => 'ids'
      ]);

      if (empty($related_ids)) {
        return null;
      }

      $ordered_posts = [];
      foreach ($related_ids as $id) {
        $post = get_post($id);
        if ($post) {
          $ordered_posts[] = new \WPGraphQL\Model\Post($post);
        }
      }

      return $ordered_posts;
    }
  ]);
}

add_action('graphql_register_types', 'register_sorted_url_list');

function register_sorted_slide_list() {
  register_graphql_field('Carousel', 'sortedSlides', [
    'type' => ['list_of' => 'Slide_data'],
    'description' => 'Sortierte Liste der Slides',
    'resolve' => function($source, $args, $context, $info) {
      $post_id = $source->ID;
      $pods = pods('carousel', $post_id); // Podname ohne 's' am Ende

      if (!$pods) {
        return null;
      }

      $related_ids = $pods->field('slides', [
        'output' => 'ids'
      ]);

      if (empty($related_ids)) {
        return null;
      }

      $ordered_posts = [];
      foreach ($related_ids as $id) {
        $post = get_post($id);
        if ($post) {
          $ordered_posts[] = new \WPGraphQL\Model\Post($post);
        }
      }

      return $ordered_posts;
    }
  ]);
}

add_action('graphql_register_types', 'register_sorted_slide_list');


function nextpress_admin_menu() {
        add_menu_page(
                'Nextpress Sub-Components',
                'Nextpress Sub-Components',
                'edit_posts',
                'nextpress',
                'shot_callback',
                'dashicons-archive',
                '30'
        );
}

add_action( 'admin_menu', 'nextpress_admin_menu' );

function shot_callback() {
        echo '<div></div>';
}