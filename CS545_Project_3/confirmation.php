<?php
/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

function formatted_phone_num() {
    global $phone_number;

    $return_num = substr_replace($phone_number, "-", 3, 0);
    $return_num2 = substr_replace($return_num, "-", 7, 0);
    return "$return_num2";
}

function test_medical_conditions() {
    global $med_cond;
    return ($med_cond) ? "<tr><td>Medical Conditions</td><td>$med_cond</td></tr>" : "";
}

?>


<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Registration Confirmation</title>
        <link rel="stylesheet" href="confirmation.css">
    </head>
    <body>
        <div id="confirmation_body">
            <h2>You have been successfully registered to participate in SDSU's Winter 2017 Half-Marathon!</h1>

            <div id="user_info_div">
                <p>The following information is what you have submitted for registration.</p>

                <div id="user_info_container">
                    <div id="image_container">
                        <img src="<?php echo $runners_image;?>" alt="">
                    </div>

                    <table>
                        <tr>
                            <td>Name</td>
                            <td><?php echo "$first_name $middle_name $last_name";?></td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td><?php echo "$address $city, $state $zip_code";?></td>
                        </tr>
                        <tr>
                            <td>Phone Number</td>
                            <td><?php echo formatted_phone_num();?></td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td><?php echo $email;?></td>
                        </tr>
                        <tr>
                            <td>Date of Birth</td>
                            <td><?php echo $dob;?></td>
                        </tr>
                        <tr>
                            <td>Gender</td>
                            <td><?php echo $gender?></td>
                        </tr>
                        <tr>
                            <td>Experience Level</td>
                            <td><?php echo $experience;?></td>
                        </tr>
                        <tr>
                            <td>Age Category</td>
                            <td><?php echo $age_category;?></td>
                        </tr>
                        <?php echo test_medical_conditions();?>
                    </table>
                </div>
                <!-- Reset and Submit Button -->
                <div class="flex_block">
                    <a href="index.html" id="link_home">Exit</a>
                </div>
            </div>

        </div>
    </body>
</html>
