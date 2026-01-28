=== NextPress-GB-Components ===
* Description:       Package of Nextcomponents for Gutenberg Editor.
* Version:           1.0.0
* Requires at least: 6.7
* Requires PHP:      7.4
* Author:            Tarik Khairalla
* License:           GPL-2.0-or-later
* License URI:       https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain:       nextpress-gb-components

Every Block-Component is a CPT.

They are registred in ./register_cpts.php

use the wp-cli cmd:

**'wp post-type list'**

after installing the plugin on WordPress instance to check CPT-namens and other usfull information

or

**'docker exec -it wp-next-wordpress wp post-type list'**

if you are running WP in a docker container


Jedes Verzeichnis in /src stellt ein Block dar. Aufbau dieser wie in der Doku beschrieben.
Wird ein neuer angelegt, muss dieser noch in 'NextPress-GB-Components.php' registriert werden und ein CPT muss unter /CPTs angelegt werden.

Das Projekt kann mit wp-env entwickelt und debuggd werden
