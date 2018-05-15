# Nguyen, Thuc
# jadrn025
# Project #1
# Spring 2018

use DBI;
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

# Query the database to determine if duplicate exists.
my $sku = $q->param('sku');

my $host = "";
my $port = "";
my $database = "";
my $username = "";
my $password = "";
my $database_source = "dbi:mysql:$database:$host:$port";

my $dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to database';
my $query_statement = "SELECT sku FROM product WHERE sku='$sku';";

my $sth = $dbh->prepare($query_statement);
$sth->execute();
my $number_of_rows = $sth->rows;

$sth->finish();
$dbh->disconnect();

print "Content-type: text/html\n\n";
if ($number_of_rows == 0) {
    print "ok";
} else {
    print "duplicate";
}
