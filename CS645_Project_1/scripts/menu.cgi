# Nguyen, Thuc
# jadrn025
# Project #1
# Spring 2018

use CGI;
use CGI::Session;
use CGI::Carp qw(fatalsToBrowser);

my $q = new CGI;
my $cookie_sid = $q->cookie('jadrn025SID');
my $session = new CGI::Session(undef, $cookie_sid, {Directory=>'/tmp'});
my $sid = $session->id;

if ($cookie_sid ne $sid) {
# Redirect the user to error.html and denies access to the menu page.
print <<END_CONTENT;
Content-type: text/html

<html>
    <head>
        <meta http-equiv="refresh" content="0; url=http://jadran.sdsu.edu/~jadrn025/proj1/html/error.html"/>
    </head>
    <body>
    </body>
</html>
END_CONTENT
exit;
}

# If the session ids do match, then print out the menu
open INFILE, "</srv/www/cgi-bin/jadrn025/menu.txt" or die "Cannot open file.";
my @file_lines = <INFILE>;
close INFILE;
foreach $line (@file_lines) {
    print "$line";
}
