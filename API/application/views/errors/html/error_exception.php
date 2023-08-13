<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<div style="border:1px solid #990000;padding-left:20px;margin:0 0 10px 0;">

<h4>An uncaught Exception was encountered</h4>

<p>Type: <?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ echo get_class($exception); ?></p>
<p>Message: <?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ echo $message; ?></p>
<p>Filename: <?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ echo $exception->getFile(); ?></p>
<p>Line Number: <?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ echo $exception->getLine(); ?></p>

<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ if (defined('SHOW_DEBUG_BACKTRACE') && SHOW_DEBUG_BACKTRACE === TRUE): ?>

	<p>Backtrace:</p>
	<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ foreach ($exception->getTrace() as $error): ?>

		<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ if (isset($error['file']) && strpos($error['file'], realpath(BASEPATH)) !== 0): ?>

			<p style="margin-left:10px">
			File: <?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ echo $error['file']; ?><br />
			Line: <?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ echo $error['line']; ?><br />
			Function: <?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ echo $error['function']; ?>
			</p>
		<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ endif ?>

	<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ endforeach ?>

<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ endif ?>

</div>