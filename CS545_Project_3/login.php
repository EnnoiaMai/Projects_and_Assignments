<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

# Function to show that the password inputted was incorrect
function show_password_error() {
    global $show_empty_msg;
    return ($show_empty_msg) ? "" : "The password is incorrect.";
}

# Function to repopulate password field if user had failed to login
function show_password() {
    global $show_empty_msg;
    return ($show_empty_msg) ? "" : $_POST['reportPassword'];
}

?>

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
            <h1>Roster Report Sign In</h1>
        </div>

        <div id="login_div">
            <h2>Sign In</h2>
            <form action="report.php" method="post">

                <div class="flex_column_container">
                    <label for="report_password">Password</label>
                    <input type="text" id="report_password" name="reportPassword" value="<?php echo show_password();?>" autofocus>
                </div>

                <div id="login_error">
                    <p><?php echo show_password_error();?></p>
                </div>

                <div class="flex_block">
                    <div id="button_containers_reset">
                        <input type="reset" id="reset_button" value="Clear">
                    </div>
                    <div id="button_containers_submit">
                        <input type="submit" id="submit_button" value="Submit">
                    </div>
                </div>

            </form>
        </div>

    </body>
</html>
