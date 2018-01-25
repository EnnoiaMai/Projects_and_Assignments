# Nguyen, Thuc
# jadrn041
# Project #4
# Fall 2017

use DBI;
use CGI;
use CGI::Cookie;
use CGI::Carp qw(fatalsToBrowser);
use Time::Piece;
use Time::Seconds;

# Print the cookie to the header first
$q = new CGI;
my $cookie_value = $q->cookie('jadrn041');
my $cookie = $q->cookie(-name=>'jadrn041',-value=>"$cookie_value",-path=>'/');
print $q->header(-cookie=>$cookie);

# All the variables passed from form as parameters
my $bill_first_name = $q->param('billFirstName');
my $bill_last_name = $q->param('billLastName');
my $bill_address = $q->param('billAddress');
my $bill_city = $q->param('billCity');
my $bill_state = $q->param('billState');
my $bill_zip_code = $q->param('billZipCode');
my $bill_phone_area = $q->param('billPhoneArea');
my $bill_phone_3 = $q->param('billPhone3');
my $bill_phone_4 = $q->param('billPhone4');
my $ship_first_name = $q->param('shipFirstName');
my $ship_last_name = $q->param('shipLastName');
my $ship_address = $q->param('shipAddress');
my $ship_city = $q->param('shipCity');
my $ship_state = $q->param('shipState');
my $ship_zip_code = $q->param('shipZipCode');
my $ship_phone_area = $q->param('shipPhoneArea');
my $ship_phone_3 = $q->param('shipPhone3');
my $ship_phone_4 = $q->param('shipPhone4');

my $checkbox_value = $q->param('shippingCheckbox');

my $radio_payment_type = $q->param('radioPaymentType');
my $card_number = $q->param('cardNumber');
$card_number = substr($card_number, 12, 4);

# Set up the esimated time of delivery
my $future_time = localtime() + (2 * ONE_WEEK);
my $future_date = $future_time->mdy('/');

# Set the shipping address depending on whether or not it was checked in client-side
my $shipping_address_text = '<p>Same as billing address</p>';
if ($q->param('shippingCheckbox') eq 'checked') {
    $shipping_address_text = "<p>$ship_first_name $ship_last_name</p><p>$ship_address</p><p>$ship_city, $ship_state $ship_zip_code</p><p>Phone: ($ship_phone_area) $ship_phone_3-$ship_phone_4</p>";
}

# Connect to the database to grab all the products
my $host = "";
my $port = "";
my $database = "";
my $username = "";
my $password = "";
my $database_source = "dbi:mysql:$database:$host:$port";

my $dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to the database';

my $sth = $dbh->prepare("SELECT sku, category, title, short_description, long_description, cost, retail FROM products order by category;");
$sth->execute();

my @all_products;
while (my @row=$sth->fetchrow_array()) {
    push(@all_products, \@row);
}
$sth->finish();
$dbh->disconnect();

# Get the sku and the quantity from the cookie to set up the table
my $table_string = '<table><tr><th>Product</th><th>Description</th><th>Quantity</th><th>Price</th></tr>';
my @users_products = split('\|\|', $cookie_value);
my $sub_total = 0;

foreach my $product (@users_products) {
    my ($sku, $quantity) = split('\|', $product);
    my $matching_record;
    foreach my $record (@all_products) {
        if ($record->[0] eq $sku) {
            $matching_record = $record;
        }
    }
    my $price = $matching_record->[6] * $quantity;
    $sub_total += $price;
    $table_string .= "<tr><td><img src=\"/~jadrn000/PROJ4_IMAGES/$sku\" alt=\"$matching_record->[2]\"></td><td>$matching_record->[2]</td><td><b>$quantity</b></td><td><b>$price</b></td></tr>";
}
$table_string .= '</table>';

# Calculate all the values for the order summary
my $cart_size = 0;
foreach my $product (@users_products) {
    my ($sku, $quantity) = split('\|', $product);
    $cart_size += $quantity;
}

my $tax_multiplier = 0.08;
my $shipping_fee = 2.00;

my $shipping = $shipping_fee * $cart_size;
my $tax = sprintf("%.2f", ($sub_total * $tax_multiplier));
my $total = sprintf("%.2f", ($sub_total + $shipping + $tax));
$sub_total = sprintf("%.2f", $sub_total);
$shipping = sprintf("%.2f", $shipping);

my $order_string = "<table><tr><td>Subtotal</td><td>\$$sub_total</td></tr><tr><td>Shipping *flat rate</td><td>\$$shipping</td></tr><tr><td>Tax</td><td>\$$tax</td></tr><tr><td>Total</td><td>\$$total</td></tr></table>";

# Print the html
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
        <title>Confirmation</title>
        <link rel="stylesheet" href="/~jadrn041/proj4/css/menu.css">
        <link rel="stylesheet" href="/~jadrn041/proj4/css/orderconfirmation.css">
        <link rel="stylesheet" href="/~jadrn041/proj4/css/footer.css">
        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/~jadrn041/proj4/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/~jadrn041/proj4/js/orderconfirmation.js"></script>
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
        <h2>Review Your Order</h2>
        <p>Please review and confirm that the following information is correct.</p>

        <div>
        <div>
            <div id="delivery_div">
                <div>
                    <div>
                        <h4>Estimated Delivery</h4>
END_CONTENT
print "<p>$future_date</p>";
print <<END_CONTENT;
                    </div>
                    <div>
                        <h4>Shipping Address</h4>
END_CONTENT
print "$shipping_address_text";
print <<END_CONTENT;
                    </div>
                </div>
                <div>
                    <div>
                        <h4>Payment</h4>
END_CONTENT
print "<p>$radio_payment_type ending in $card_number</p>";
print <<END_CONTENT;
                    </div>
                    <div>
                        <h4>Billing Address</h4>
END_CONTENT
print "<p>$bill_first_name $bill_last_name</p><p>$bill_address</p><p>$bill_city, $bill_state $bill_zip_code</p><p>Phone: ($bill_phone_area) $bill_phone_3-$bill_phone_4</p>";
print <<END_CONTENT;
                    </div>
                </div>
            </div>

            <div id="checkout_table_div">
END_CONTENT
print "$table_string";
print <<END_CONTENT;
            </div>
        </div>
        <div id="order_summary">
            <h3>Order Summary</h3>
            <div id="checkout_order_div">
END_CONTENT
print "$order_string";
print <<END_CONTENT;
            </div>
            <input type="button" name="" value="Place your order">
            <div id="success_div">
                <p>Your order was successfully placed! You will now be redirected to the homepage.</p>
            </div>
        </div>
        </div>
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
