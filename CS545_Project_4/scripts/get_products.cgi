# Nguyen, Thuc
# jadrn041
# Project #4
# Fall 2017

# Based off of Prof. Riggin's code

use DBI;

my $host = "";
my $port = "";
my $database = "";
my $username = "";
my $password = "";
my $database_source = "dbi:mysql:$database:$host:$port";

# The database handler
my $dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to the database';

# Preparing the query SELECT statement
my $sth = $dbh->prepare("SELECT sku, category, title, short_description, long_description, cost, retail FROM products order by category;");

# Execute the query statement, with the results returned to this handler
$sth->execute();

# Serialize the string and send the single string back to the JS file that called this
# using AJAX
$serialized_string = "";
while (my @row=$sth->fetchrow_array()) {
    foreach $item (@row) {
        # Concatenate the item and the separator to the string to return
        $serialized_string .= $item . "|";
    }
    # Separate the records with a semicolon
    $serialized_string .= ";";
}

print "Content-type: text/html\n\n";
# Free up the resource
$sth->finish();

# End the connection to the database
$dbh->disconnect();
print $serialized_string;
