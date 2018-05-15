# Nguyen, Thuc
# jadrn025
# Project #1
# Spring 2018

use CGI;
use CGI::Session;
use CGI::Carp qw(fatalsToBrowser);
use Crypt::Password;

my $q;
if (authenticate()) {
    proceed_to_menu();
} else {
    proceed_to_error();
}

# Check to see if the username and password matches any of the
# username-password pairs in 'passwords.dat'.
sub authenticate {
    $q = new CGI;
    my $username = $q->param('username');
    my $password = $q->param('password');

    open INFILE, "</srv/www/cgi-bin/jadrn025/passwords.dat" or die "Cannot open file.";
    my @file_lines = <INFILE>;
    close INFILE;

    my $is_valid_user = 0;
    foreach $line (@file_lines) {
        chomp $line;
        my ($stored_user, $stored_password) = split /=/, $line;
        if ($stored_user eq $username && check_password($stored_password, $password)) {
            $is_valid_user = 1;
            last;
        }
    }
    return $is_valid_user;
}

# Creates a new session and puts the sessionID into the cookie. Then
# prints out the contents of menu.html on success of authenticating the user.
sub proceed_to_menu {
    # Always start a new session when logging in
    my $session = new CGI::Session(undef, undef, {Directory=>'/tmp'});
    $session->expires('+1d');
    my $cookie = $q->cookie(jadrn025SID=> $session->id);
    print $q->header(-cookie=>$cookie);

print <<END_CONTENT;
<html>
    <head>
        <meta http-equiv="refresh" content="0; url=/perl/jadrn025/menu.cgi"/>
    </head>
    <body>
    </body>
</html>
END_CONTENT
}

# Redirects the user to error.html and denies access to the menu page.
sub proceed_to_error {
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
}
