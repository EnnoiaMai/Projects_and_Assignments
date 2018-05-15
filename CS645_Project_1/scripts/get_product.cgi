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
# Redirects the user to error.html and denies access to the menu page.
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

# Query database to return product information
my $sku = $q->param('sku');
my $product_information = '';   # response to return

# Connect to database and execute sql statement, then disconnect from database
my $host = "";
my $port = "";
my $database = "";
my $username = "";
my $password = "";
my $database_source = "dbi:mysql:$database:$host:$port";

my $dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to database';
my $query_statement = "SELECT manufacturerID, category.name, vendor.name, description, features, cost, retail, quantity, image FROM product INNER JOIN category ON product.catID=category.id INNER JOIN vendor ON product.venID=vendor.id WHERE sku='$sku';";

my $sth = $dbh->prepare($query_statement);
$sth->execute();

# Either serialize string or turn it into json object
while (my @row = $sth->fetchrow_array()) {
    foreach $item (@row) {
        $product_information .= $item . "|";
    }
}
$sth->finish();
$dbh->disconnect();

$product_information = substr $product_information, 0, (length($product_information) - 1);
unless ($product_information) {
    $product_information = "invalid";
}

# Return the string as response to AJAX call
print "Content-type: text/html\n\n";
print "$product_information";
