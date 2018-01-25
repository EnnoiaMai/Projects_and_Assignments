# Nguyen, Thuc
# jadrn041
# Project #4
# Fall 2017

use DBI;
use CGI;
use CGI::Cookie;
use CGI::Carp qw(fatalsToBrowser);
use Time::Piece;

# Print the cookie to the header first
$q = new CGI;
my $cookie_value = $q->cookie('jadrn041');
my $cookie = $q->cookie(-name=>'jadrn041',-value=>'',-path=>'/');
print $q->header(-cookie=>$cookie);

my $host = "";
my $port = "";
my $database = "";
my $username = "";
my $password = "";
my $database_source = "dbi:mysql:$database:$host:$port";

my $dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to the database';
my $sth = $dbh->prepare("SELECT sku, date, quantity FROM sales_report order by sku;");
$sth->execute();

$date_now = localtime->mdy('/');

# Holds reference to arrays [sku, date, quantity]
my @sales_products;
while (my @row=$sth->fetchrow_array()) {
    push(@sales_products, \@row);
}
# Get and split the value of the cookie into an array of [sku, quantity]
my @users_products = split('\|\|', $cookie_value);
foreach my $product (@users_products) {
    my ($sku, $quantity) = split('\|', $product);

    my $found = 0;
    foreach my $sales (@sales_products) {
        if ($sales->[0] eq $sku) {
            my $old_quantity = $sales->[2];
            my $new_quantity = $old_quantity + $quantity;
            my $update = $dbh->prepare("UPDATE sales_report SET date='$date_now', quantity='$new_quantity' WHERE sku='$sku';");
            $update->execute();
            $found = 1;
        }
    }
    if ($found == 0) {
        my $rows = $dbh->do("INSERT INTO sales_report VALUES('$sku', '$date_now', '$quantity');");
    }
}

$sth->finish();
$dbh->disconnect();
print 'success';
