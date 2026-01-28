=== input ===
Contributors:      Tarik Khairalla
Tags:              block
Tested up to:      6.7
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Every Block-Component is a CPT.

They are registred in ./register_cpts.php

use the wp-cli cmd:

**'wp post-type list'**

after installing the plugin on WordPress instance to check CPT-namens and other usfull information

or

**'docker exec -it wp-next-wordpress wp post-type list'**

if you are running WP in a docker container
