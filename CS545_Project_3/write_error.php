<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

# This file redirects user to a generic error page. Pass in the message as a
# parameter to print out the error. Pass in the redirect link to redirect the
# user back to the previous page.
function write_error($message) {
print <<<ENDBLOCK
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Sign In Error</title>
        <link rel="stylesheet" href="report.css">
    </head>
    <body>
        <div id="sign_in_error_div">
            <h1>ERROR</h1>
            <p>$message</p>
            <div>
                <a href="index.html">Exit</a>
            </div>
        </div>
    </body>
</html>
ENDBLOCK;
}
?>
