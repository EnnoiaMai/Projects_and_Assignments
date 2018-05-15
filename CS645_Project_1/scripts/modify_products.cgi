# Nguyen, Thuc
# jadrn025
# Project #1
# Spring 2018

use DBI;
use CGI;
use CGI::Session;
use CGI::Carp qw(fatalsToBrowser);
use File::Basename;

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

################################## CONSTANTS ###################################
$CGI::POST_MAX = 1024 * 3000;
my $upload_dir = '/home/jadrn025/public_html/proj1/product_images';
my $safe_filename_chars = "a-zA-Z0-9_.-";
################################################################################

my $product_form = $q->param('productForm');
my $response = '';

# Some params may be undefined but grab them anyway
my $sku = $q->param('sku');
my $manufacturer_id = $q->param('manufacturerID');
my $category = $q->param('category');
my $vendor = $q->param('vendor');
my $description = $q->param('description');
my $features = $q->param('features');
my $cost = $q->param('cost');
my $retail = $q->param('retail');
my $quantity = $q->param('quantity');
my $image_file_name = $q->param('productImage');

############################### MODIFY DATABASE  ###############################
my $host = "";
my $port = "";
my $database = "";
my $username = "";
my $password = "";
my $database_source = "dbi:mysql:$database:$host:$port";

my $dbh = DBI->connect($database_source, $username, $password) or die 'Cannot connect to database';

# Set up query statements depending on what form was sent
my $query_statement = '';
my $affected_rows;
my $sth;
if ($product_form eq 'new') {
    unless ($image_file_name) {
        die "There was a problem uploading the image, most likely due to file size";
    }
    uploadImage();
    $query_statement = "INSERT INTO product (sku, manufacturerID, catID, venID, description, features, cost, retail, quantity, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    $sth = $dbh->prepare($query_statement);
    $affected_rows = $sth->execute($sku, $manufacturer_id, $category, $vendor, $description, $features, $cost, $retail, $quantity, $image_file_name) or die $sth->errstr;
}
elsif ($product_form eq 'edit') {
    if ($image_file_name eq "undefined") {
        $query_statement = "UPDATE product INNER JOIN category ON product.catID=category.id INNER JOIN vendor ON product.venID=vendor.id SET manufacturerID=?, category.id=?, vendor.id=?, description=?, features=?, cost=?, retail=?, quantity=? WHERE sku=?;";
        $sth = $dbh->prepare($query_statement);
        $affected_rows = $sth->execute($manufacturer_id, $category, $vendor, $description, $features, $cost, $retail, $quantity, $sku) or die $sth->errstr;
    } else {
        uploadImage();

        # Delete the previous file with the SKU
        # $query_statement = "SELECT image FROM product WHERE sku='$sku';";
        # $sth = $dbh->prepare($query_statement);
        # $sth->execute();
        # my $old_image_file;
        # while (my @row = $sth->fetchrow_array) {
        #     $old_image_file = $row[0];
        # }
        # my $file_to_delete = $upload_dir . "/" . $old_image_file;
        # unlink($file_to_delete);

        $query_statement = "UPDATE product INNER JOIN category ON product.catID=category.id INNER JOIN vendor ON product.venID=vendor.id SET manufacturerID=?, category.id=?, vendor.id=?, description=?, features=?, cost=?, retail=?, quantity=?, image=? WHERE sku=?;";
        $sth = $dbh->prepare($query_statement);
        $affected_rows = $sth->execute($manufacturer_id, $category, $vendor, $description, $features, $cost, $retail, $quantity, $image_file_name, $sku) or die $sth->errstr;
    }
}
elsif ($product_form eq 'delete') {
    # Delete the previous file with the SKU
    $query_statement = "SELECT image FROM product WHERE sku='$sku';";
    $sth = $dbh->prepare($query_statement);
    $sth->execute();
    my $old_image_file;
    while (my @row = $sth->fetchrow_array) {
        $old_image_file = $row[0];
    }
    my $file_to_delete = $upload_dir . "/" . $old_image_file;
    unlink($file_to_delete);

    $query_statement = "DELETE FROM product WHERE sku='$sku';";
    $sth = $dbh->prepare($query_statement);
    $affected_rows = $sth->execute();
}
else {
    die 'productForm param not sent';
}

# my $affected_rows = $sth->rows;
if ($affected_rows > 0) {
    $response = 'ok';
}
elsif ($affected_rows == 0) {
    $response = 'failed';
}
else {
    $response = 'error';
}

$sth->finish();
$dbh->disconnect();

################################# UPLOAD IMAGE #################################
sub uploadImage {
    my ($name, $path, $extension) = fileparse($image_file_name, '\..*');
    my $timestamp = getTimestamp();
    $image_file_name = $sku . $timestamp . $extension;
    # $image_file_name = $name . $extension;
    # $image_file_name =~ s/ //;
    # if ($image_file_name !~ /^([$safe_filename_chars]+)$/) {
    #     die "There was an invalid character in the filename.";
    # }
    # $image_file_name = untaint();

    # Get a handle on the uploaded image
    my $file_handle = $q->upload("productImage");
    unless ($file_handle) {
        die "Invalid handle: $file_handle";
    }

    # Save the file
    open UPLOADFILE, ">$upload_dir/$image_file_name" or die "Error, cannot save the file. file name is $image_file_name, name is $name, path is $path, extension is $extension";
    binmode UPLOADFILE;
    while (<$file_handle>) {
        print UPLOADFILE $_;
    }
    close UPLOADFILE;
}

# Required because mod-perl runs with -T (taint mode),
# thus the filename is insecure and disallowed unless untainted.
# Return values from a regular expression match are untainted.
# sub untaint {
#     if ($image_file_name =~ m/^(\w+)$/) {
#         die "Tainted filename";
#     }
#     return $1;
# }

sub getTimestamp {
    my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime();
    my $timestamp = sprintf("%04d%02d%02d%02d%02d%02d", $year + 1900, $mon + 1, $mday, $hour, $min, $sec);
    return $timestamp;
}

print "Content-type: text/html\n\n";
print "$response";
