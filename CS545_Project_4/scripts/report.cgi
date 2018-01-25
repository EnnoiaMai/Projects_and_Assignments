# Nguyen, Thuc
# jadrn041
# Project #4
# Fall 2017

use DBI;

my @sales_report_array;
my @products_array;

# Connect to jadrn041 database and get the sku, date, and quantity from sales_report table
my $host = "";
my $port = "";
my $database = "";
my $username = "";
my $password = "";
my $database_source = "dbi:mysql:$database:$host:$port";

my $dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to the database';
my $sth = $dbh->prepare("SELECT sku, date, quantity FROM sales_report order by sku;");
$sth->execute();

while (my @row=$sth->fetchrow_array()) {
    push(@sales_report_array, \@row);
}

$sth->finish();
$dbh->disconnect();

# Then connect to the proj4 database and get the sku, price, and cost from products table
$host = "";
$port = "";
$database = "";
$username = "";
$password = "";
$database_source = "dbi:mysql:$database:$host:$port";

$dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to the database';
$sth = $dbh->prepare("SELECT sku, cost, retail FROM products order by sku;");
$sth->execute();

while (my @row=$sth->fetchrow_array()) {
    push(@products_array, \@row);
}

$sth->finish();
$dbh->disconnect();

# Build the string to populate the table
my $table_string = '';
# If the sales_report_array is 0, overwrite the string to show the error.
my $sales_report_array_size = @sales_report_array;
if ($sales_report_array_size == 0) {
    $table_string = '<p>There are no products to show for the Sales Report.</p>';
}
else {
    $table_string = '<h2>Sales Report</h2><table><tr><th>SKU</th><th>Date</th><th>Quantity</th><th>Sales/Revenue</th><th>Profit</th></tr>';
    my $total_revenue = 0;
    my $total_profit = 0;
    foreach my $sale (@sales_report_array) {
        # Find the product that matches the one in the sales report
        foreach my $product (@products_array) {
            if ($sale->[0] eq $product->[0]) {
                my $sku = $sale->[0];
                my $date = $sale->[1];
                my $quantity = $sale->[2];
                my $price = $product->[2];
                my $cost = $product->[1];

                my $revenue = sprintf("%.2f", $quantity * $price);
                my $profit = sprintf("%.2f", ($quantity * ($price - $cost)));
                $total_revenue += $revenue;
                $total_profit += $profit;

                $table_string .= "<tr><td>$sku</td><td>$date</td><td>$quantity</td><td>\$$revenue</td><td>\$$profit</td></tr>";
            }
        }
    }
    $total_revenue = sprintf("%.2f", $total_revenue);
    $total_profit = sprintf("%.2f", $total_profit);
    $table_string .= "<tr><th colspan=\"3\">Grand Total</th><th><p>Sales:</p><p>\$$total_revenue</p></th><th><p>Profit:</p><p>\$$total_profit</p></th></tr>";
    $table_string .= '</table>';
}

print "Content-type: text/html\n\n";

print <<END_CONTENT;
<!DOCTYPE html>
<!--
Nguyen, Thuc
jadrn041
Project #4
Fall 2017
-->
<html>
    <head>
        <meta charset="utf-8">
        <title>Report</title>
        <link rel="stylesheet" href="/~jadrn041/proj4/css/menu.css">
        <link rel="stylesheet" href="/~jadrn041/proj4/css/report.css">
        <link rel="stylesheet" href="/~jadrn041/proj4/css/footer.css">
        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/~jadrn041/proj4/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/~jadrn041/proj4/js/update_cookie.js"></script>
    </head>
    <body>
        <!-- MENU -->
        <div id="menu">
            <div id="menu_cart">
                <a href="/~jadrn041/proj4/html/orderonlinecheckout.html">
                    <img src="/~jadrn041/proj4/images/cart_inverted_icon.png" alt="Cart">
                </a>
                <a href="/~jadrn041/proj4/html/orderonlinecheckout.html"></a>
            </div>
            <div id="menu_icon">
                <h2>Bertha's Deluxe Chocolates</h2>
                <!-- <img src="" alt=""> -->
            </div>
            <div id="menu_links">
                <ul>
                    <li><a href="/~jadrn041/proj4/index.html">Home</a></li>
                    <li><a href="/~jadrn041/proj4/html/products.html">Products</a></li>
                    <li><a href="/~jadrn041/proj4/html/orderonlinecheckout.html">Order Online</a></li>
                    <li><a href="/~jadrn041/proj4/html/about.html">About Us</a></li>
                    <li><a href="/~jadrn041/proj4/html/contact.html">Contact</a></li>
                </ul>
            </div>
        </div>

        <div id="content">
END_CONTENT
print "$table_string";
print <<END_CONTENT;
        </div>

        <div id="footer">
            <div id="links_container">
                <ul>
                    <li><a href="/~jadrn041/proj4/html/contact.html">Contact Us</a></li>
                    <li><a href="https://www.google.com/maps/place/See's+Candies/@37.5952152,-122.5062083,17z/data=!3m1!4b1!4m5!3m4!1s0x808f7a9d3006c5b1:0x38c3c5257517863f!8m2!3d37.5952152!4d-122.5040196?hl=en-US">Link to Map</a></li>
                    <li><a href="/~jadrn041/proj4/html/orderonlinecheckout.html">Shopping Cart</a></li>
                </ul>
            </div>
            <p>Copyright &copy; 2017 Bertha's Deluxe Chocolates, Inc. All Rights Reserved.</p>
        </div>

    </body>
</html>
END_CONTENT
