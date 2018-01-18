<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

$show_empty_msg= false;
# If no data was sent to this file, show the login page and exit
if (empty($_POST)) {
    $show_empty_msg = true;
    include 'login.php';
    exit;
}

# Read each password entry as a line
$password = $_POST['reportPassword'];
$password_is_valid = false;
$raw_content = file_get_contents('passwords.txt');
$password_entry = explode("\n", $raw_content);

# Explode each line to remove what was before '='. Check if encrypted passwords match
foreach ($password_entry as $entry) {
    $parts = explode('=', $entry);
    if (crypt($password, $parts[1]) === $parts[1]) {
        $password_is_valid = true;
        break;
    }
}
# If no passwords match what was encrypted, show login page and exit
if (!$password_is_valid) {
    $show_empty_msg = false;
    include 'login.php';
    exit;
}

# Otherwise, generate the report
include 'database_functions.php';

function generate_report() {
    # Get a connection to the database
    $database = start_db_connection();

    # Query commands and generation of data for each age category
    $sql_query = "SELECT runners_image, last_name, first_name, dob, experience FROM marathon_runners WHERE age_category='teen' ORDER BY last_name";
    $result = mysqli_query($database, $sql_query);
    create_table_category($result, 'Teens');

    $sql_query = "SELECT runners_image, last_name, first_name, dob, experience FROM marathon_runners WHERE age_category='adult' ORDER BY last_name";
    $result = mysqli_query($database, $sql_query);
    create_table_category($result, 'Adults');

    $sql_query = "SELECT runners_image, last_name, first_name, dob, experience FROM marathon_runners WHERE age_category='senior' ORDER BY last_name";
    $result = mysqli_query($database, $sql_query);
    create_table_category($result, 'Seniors');

    # End the connection to the database
    end_db_connection($database);
}

# Takes a result-set as a parameter and creates the table rows and data for
# each age category
function create_table_category($result, $category) {
    # If $result is empty, return
    if (!$result) {
        return;
    }

    $category_rows = "<tr><th colspan='5'>$category</tr><tr><td>Runner's Image</td><td>Last Name</td><td>First Name</td><td>Age</td><td>Experience Level</td></tr>";

    while ($record = mysqli_fetch_assoc($result)) {
        $category_rows .= "<tr>";
        foreach ($record as $field_key => $field_value) {
            # If field key is runner's image, get the picture from server
            if ($field_key == 'runners_image') {
                $UPLOAD_DIR = 'runners_image_dir';
                $category_rows .= "<td><img src=\"$UPLOAD_DIR/$field_value\" alt=\"\"></td>";
            }
            # If field key is age, format to display age at time record was accessed
            elseif ($field_key == 'dob') {
                $date_today = date("m/d/y");
                $difference = date_diff(date_create($field_value), date_create($date_today));
                $age = $difference->format('%y');
                $category_rows .= "<td>$age</td>";
            }
            # Else, dislay the field value
            else {
                $category_rows .= "<td>$field_value</td>";
            }
        }
        $category_rows .= "</tr>\n";
    }
    mysqli_free_result($result);
    echo $category_rows;
}
?>

<!-- Header similar to login.php but generates the report instead of login box-->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Roster Report</title>
        <link rel="stylesheet" href="report.css">
        <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> -->
        <script src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script src="report.js"></script>
    </head>
    <body>
        <div id="report_menu">
            <div id="back_button_div">
                <img id="back_button" src="back_button.png" alt="">
            </div>
            <h1>Roster Report</h1>
        </div>

        <div id="report_body">
            <table>
                <?php generate_report();?>
            </table>
        </div>

    </body>
</html>
