# Nguyen, Thuc
# jadrn025
# Project #1
# Spring 2018

use CGI;
use CGI::Session;
use CGI::Carp qw(fatalsToBrowser);

# Grab the existing sessionid from the cookie and get the session to delete it
my $q = new CGI;
my $session_id = $q->cookie("jadrn025SID") || undef;
my $session = new CGI::Session(undef, $session_id, {Directory=> '/tmp'});
$session->delete();

# Clobber the cookie then print cookie to the header (send cookie with session ID
# to the browser)
my $cookie = $q->cookie(jadrn025SID=> '');
print $q->header(-cookie=>$cookie);

print <<END_CONTENT;
<html>
    <head>
        <meta http-equiv="refresh" content="0; url=http://jadran.sdsu.edu/~jadrn025/proj1/html/logout.html"/>
    </head>
    <body>
    </body>
</html>
END_CONTENT
