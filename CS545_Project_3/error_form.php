<!DOCTYPE html>
<!--
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
-->

<!--
error_form.php contains the HTML form to send back to the user when the validation
fails. This php file contains embedded php tags which calls the functions in
error_form_functions.php to populate the form with the correct error information
and to repopulate the form with the user's info, dynamically.
-->
<html>
    <head>
        <meta charset="utf-8">
        <title>Registration for SDSU Winter Marathon</title>
        <link rel="stylesheet" href="error_form.css">
    </head>
    <body id="registration_body">
        <div id="registration_menu">
            <div id="inner_menu">
                <div>
                    <a href="index.html">
                        <img id="back_button" src="back_button.png" alt="">
                    </a>
                </div>
                <h1>Registration</h1>
            </div>
        </div>

        <div id="registration_div">

            <form action="proj3_process_request.php" method="post" name="registrationForm" enctype="multipart/form-data" autocomplete="on">

                <!-- Runner's Image -->
                <div id="upload_div">
                    <label for="upload_image">Upload a picture (.jpeg, .png .bmp) of yourself</label>
                    <input type="file" id="upload_image" name="uploadImage" value="Upload" accept="image/*" autofocus>
                </div>
                <div id="error_image_div">
                    <p><?php echo test_error('image');?></p>
                </div>
                <div id="file_description">
                    <p><?php echo test_error_image('image');?></p>
                </div>

                <!-- IDENTIFICATION -->
                <div class="flex_block">
                    <div class="flex_column_container">
                        <label for="first_name_text_box">First Name</label>
                        <input type="text" size="24" id="first_name_text_box" name="firstName" value="<?php echo $first_name?>" maxlength="40">
                    </div>

                    <div class="flex_column_container">
                        <label for="middle_name_text_box">Middle Name</label>
                        <input type="text" size="24" id="middle_name_text_box" name="middleName" value="<?php echo $middle_name?>" maxlength="30">
                    </div>

                    <div class="flex_column_container">
                        <label for="last_name_text_box">Last Name</label>
                        <input type="text" size="24" id="last_name_text_box" name="lastName" value="<?php echo $last_name?>" maxlength="40">
                    </div>
                </div>
                <div id="error_names_div">
                    <p><?php echo test_error('name');?></p>
                </div>

                <!-- ADDRESS -->
                <div class="address_div">
                    <label for="address_text_box">Address</label>
                    <input type="text" id="address_text_box" name="address" value="<?php echo $address?>" maxlength="40">
                </div>

                <div class="flex_block">
                    <div class="flex_column_container">
                        <label for="city_text_box">City</label>
                        <input type="text" id="city_text_box" name="city" value="<?php echo $city?>" maxlength="20">
                    </div>

                    <div class="flex_column_container">
                        <label for="state_drop_down">State</label>
                        <div id="drop_down_container">
                            <select class="" id="state_drop_down" name="stateDropDown">
                                <option value="null" <?php echo test_selected('null');?>>---</option>
                                <option value="AL" <?php echo test_selected('AL');?>>Alabama</option>
                                <option value="AK" <?php echo test_selected('AK');?>>Alaska</option>
                                <option value="AZ" <?php echo test_selected('AZ');?>>Arizona</option>
                                <option value="AR" <?php echo test_selected('AR');?>>Arkansas</option>
                                <option value="CA" <?php echo test_selected('CA');?>>California</option>
                                <option value="CO" <?php echo test_selected('CO');?>>Colorado</option>
                                <option value="CT" <?php echo test_selected('CT');?>>Connecticut</option>
                                <option value="DE" <?php echo test_selected('DE');?>>Delaware</option>
                                <option value="FL" <?php echo test_selected('FL');?>>Florida</option>
                                <option value="GA" <?php echo test_selected('GA');?>>Georgia</option>
                                <option value="HI" <?php echo test_selected('HI');?>>Hawaii</option>
                                <option value="ID" <?php echo test_selected('ID');?>>Idaho</option>
                                <option value="IL" <?php echo test_selected('IL');?>>Illinois</option>
                                <option value="IN" <?php echo test_selected('IN');?>>Indiana</option>
                                <option value="IA" <?php echo test_selected('IA');?>>Iowa</option>
                                <option value="KS" <?php echo test_selected('KS');?>>Kansas</option>
                                <option value="KY" <?php echo test_selected('KY');?>>Kentucky</option>
                                <option value="LA" <?php echo test_selected('LA');?>>Louisiana</option>
                                <option value="ME" <?php echo test_selected('ME');?>>Maine</option>
                                <option value="MD" <?php echo test_selected('MD');?>>Maryland</option>
                                <option value="MA" <?php echo test_selected('MA');?>>Massachusetts</option>
                                <option value="MI" <?php echo test_selected('MI');?>>Michigan</option>
                                <option value="MN" <?php echo test_selected('MN');?>>Minnesota</option>
                                <option value="MS" <?php echo test_selected('MS');?>>Mississippi</option>
                                <option value="MO" <?php echo test_selected('MO');?>>Missouri</option>
                                <option value="MT" <?php echo test_selected('MT');?>>Montana</option>
                                <option value="NE" <?php echo test_selected('NE');?>>Nebraska</option>
                                <option value="NV" <?php echo test_selected('NV');?>>Nevada</option>
                                <option value="NH" <?php echo test_selected('NH');?>>New Hampshire</option>
                                <option value="NJ" <?php echo test_selected('NJ');?>>New Jersey</option>
                                <option value="NM" <?php echo test_selected('NM');?>>New Mexico</option>
                                <option value="NY" <?php echo test_selected('NY');?>>New York</option>
                                <option value="NC" <?php echo test_selected('NC');?>>North Carolina</option>
                                <option value="ND" <?php echo test_selected('ND');?>>North Dakota</option>
                                <option value="OH" <?php echo test_selected('OH');?>>Ohio</option>
                                <option value="OK" <?php echo test_selected('OK');?>>Oklahoma</option>
                                <option value="OR" <?php echo test_selected('OR');?>>Oregon</option>
                                <option value="PA" <?php echo test_selected('PA');?>>Pennsylvania</option>
                                <option value="RI" <?php echo test_selected('RI');?>>Rhode Island</option>
                                <option value="SC" <?php echo test_selected('SC');?>>South Carolina</option>
                                <option value="SD" <?php echo test_selected('SD');?>>South Dakota</option>
                                <option value="TN" <?php echo test_selected('TN');?>>Tennessee</option>
                                <option value="TX" <?php echo test_selected('TX');?>>Texas</option>
                                <option value="UT" <?php echo test_selected('UT');?>>Utah</option>
                                <option value="VT" <?php echo test_selected('VT');?>>Vermont</option>
                                <option value="VA" <?php echo test_selected('VA');?>>Virginia</option>
                                <option value="WA" <?php echo test_selected('WA');?>>Washington</option>
                                <option value="WV" <?php echo test_selected('WV');?>>West Virginia</option>
                                <option value="WI" <?php echo test_selected('WI');?>>Wisconsin</option>
                                <option value="WY" <?php echo test_selected('WY');?>>Wyoming</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex_column_container">
                        <label for="zip_code_text_box">Zip Code:</label>
                        <input type="text" id="zip_code_text_box" placeholder="#####" name="zipCode" value="<?php echo $zip_code?>" maxlength="5">
                    </div>
                </div>
                <div id="error_address_div">
                    <p><?php echo test_error('address');?></p>
                </div>

                <div class="flex_block">
                    <!-- PHONE NUMBER -->
                    <div class="flex_column_container">
                        <label for="phone_area">Primary Phone Number</label>
                        <div class="">
                            <input type="text" size="5" placeholder="(xxx)" maxlength="3" name="phoneArea" value="<?php echo $_POST['phoneArea']?>" id="phone_area">
                            <input type="text" size="3" placeholder="xxx" maxlength="3" name="phone3" value="<?php echo $_POST['phone3']?>">
                            <input type="text" size="4" placeholder="xxxx" maxlength="4" name="phone4" value="<?php echo $_POST['phone4']?>">
                        </div>
                    </div>

                    <!-- EMAIL ADDRESS -->
                    <div class="flex_column_container">
                        <label for="email_text_box">Email Address</label>
                        <input type="text" id="email_text_box" name="email" value="<?php echo $email?>">
                    </div>
                </div>
                <div class="flex_block">
                    <div class="flex_column_container_error" id="error_phone_div">
                        <p><?php echo test_error('phone_number');?></p>
                    </div>
                    <div class="flex_column_container_error" id="error_email_div">
                        <p><?php echo test_error('email');?></p>
                    </div>
                </div>

                <div class="flex_block">
                    <!-- DATE OF BIRTH -->
                    <div class="flex_column_container">
                        <label for="date_of_birth_text_box">Date of Birth</label>
                        <input type="text" id="date_of_birth_text_box" placeholder="mm/dd/yyyy" name="dateOfBirth" value="<?php echo $dob?>" maxlength="10">
                    </div>

                    <!-- GENDER -->
                    <div class="flex_column_container">
                        <label>Gender</label>
                        <div class="gender_row">
                            <div class="gender_row_container">
                                <input type="radio" id="gender_radio_male" name="genderRadio" value="male" <?php echo test_checked('male');?>>
                                <label for="gender_radio_male">Male</label>
                            </div>

                            <div class="gender_row_container">
                                <input type="radio" id="gender_radio_female" name="genderRadio" value="female" <?php echo test_checked('female');?>>
                                <label for="gender_radio_female">Female</label>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="flex_block">
                    <div class="flex_column_container_error" id="error_dob_div">
                        <p><?php echo test_error('dob');?></p>
                    </div>
                    <div class="flex_column_container_error" id="error_gender_div">
                        <p><?php echo test_error('gender');?></p>
                    </div>
                </div>

                <!-- MEDICAL CONDITIONS-->
                <div class="title_block">
                    <label for="medical_text_area">Medical Conditions</label>
                </div>
                <textarea id="medical_text_area" name="medicalTextArea" rows="8" maxlength="800"><?php echo $med_cond?></textarea>

                <!-- EXPERIENCE LEVEL -->
                <div class="title_block">
                    <label>Experience Level</label>
                </div>
                <div class="flex_block_row">
                    <div class="flex_row_container">
                        <input type="radio" id="exp_radio_novice" name="expRadio" value="novice" <?php echo test_checked('novice');?>>
                        <label for="exp_radio_novice">Novice</label>
                    </div>
                    <div class="flex_row_container">
                        <input type="radio" id="exp_radio_experienced" name="expRadio" value="experienced" <?php echo test_checked('experienced');?>>
                        <label for="exp_radio_experienced">Experienced</label>
                    </div>
                    <div class="flex_row_container">
                        <input type="radio" id="exp_radio_expert" name="expRadio" value="expert" <?php echo test_checked('expert');?>>
                        <label for="exp_radio_expert">Expert</label>
                    </div>
                </div>
                <div id="error_exp_div">
                    <p><?php echo test_error('experience');?></p>
                </div>

                <!-- AGE CATEGORY -->
                <div class="title_block">
                    <label>Age Category</label>
                </div>
                <div class="flex_block_row">
                    <div class="flex_row_container">
                        <input type="radio" id="age_radio_teen" name="ageRadio" value="teen" <?php echo test_checked('teen');?>>
                        <label for="age_radio_teen">Teen</label>
                    </div>
                    <div class="flex_row_container">
                        <input type="radio" id="age_radio_adult" name="ageRadio" value="adult" <?php echo test_checked('adult');?>>
                        <label for="age_radio_adult">Adult</label>
                    </div>
                    <div class="flex_row_container">
                        <input type="radio" id="age_radio_senior" name="ageRadio" value="senior" <?php echo test_checked('senior');?>>
                        <label for="age_radio_senior">Senior</label>
                    </div>
                </div>
                <div id="error_age_div">
                    <p><?php echo test_error('age');?></p>
                </div>

                <!-- Reset and Submit Button -->
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
