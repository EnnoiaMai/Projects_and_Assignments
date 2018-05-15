<!DOCTYPE html>
<!--
Nguyen, Thuc
jadrn025
Project #2
Spring 2018
-->
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Browse Products</title>

        <link rel="stylesheet" href="/jadrn025/css/menu.css">
        <link rel="stylesheet" href="/jadrn025/css/browse.css">
        <link rel="stylesheet" href="/jadrn025/css/footer.css">

        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/jadrn025/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/jadrn025/js/menu_search.js"></script>
        <script type="text/javascript" src="/jadrn025/js/browse.js"></script>
    </head>
    <body>
        <%-- MENU --%>
        <%@ include file="menu.jsp" %>

        <div id="content">
            <div id="sidebar">
                <form name="productsFilterForm" method="get">
                    <p>Category</p>
                    <ul>
                        <li>
                            <label for="check_category_classics" class="checkbox_container">
                                <input type="checkbox" name="category" value="Classics" id="check_category_classics">
                                <span class="checkmark"></span>
                                Classics
                            </label>
                        </li>
                        <li>
                            <label for="check_category_laptop" class="checkbox_container">
                                <input type="checkbox" name="category" value="Laptop" id="check_category_laptop">
                                <span class="checkmark"></span>
                                Laptop
                            </label>
                        </li>
                        <li>
                            <label for="check_category_rolling" class="checkbox_container">
                                <input type="checkbox" name="category" value="Rolling" id="check_category_rolling">
                                <span class="checkmark"></span>
                                Rolling
                            </label>
                        </li>
                        <li>
                            <label for="check_category_travel" class="checkbox_container">
                                <input type="checkbox" name="category" value="Travel" id="check_category_travel">
                                <span class="checkmark"></span>
                                Travel
                            </label>
                        </li>
                        <li>
                            <label for="check_category_hiking" class="checkbox_container">
                                <input type="checkbox" name="category" value="Hiking" id="check_category_hiking">
                                <span class="checkmark"></span>
                                Hiking
                            </label>
                        </li>
                    </ul>
                    <hr>
                    <p>Vendor</p>
                    <ul>
                        <li>
                            <label for="check_vendor_adidas" class="checkbox_container">
                                <input type="checkbox" name="vendor" value="Adidas" id="check_vendor_adidas">
                                <span class="checkmark"></span>
                                Adidas
                            </label>
                        </li>
                        <li>
                            <label for="check_vendor_herschel" class="checkbox_container">
                                <input type="checkbox" name="vendor" value="Herschel" id="check_vendor_herschel">
                                <span class="checkmark"></span>
                                Herschel
                            </label>
                        </li>
                        <li>
                            <label for="check_vendor_highsierra" class="checkbox_container">
                                <input type="checkbox" name="vendor" value="High Sierra" id="check_vendor_highsierra">
                                <span class="checkmark"></span>
                                High Sierra
                            </label>
                        </li>
                        <li>
                            <label for="check_vendor_jansport" class="checkbox_container">
                                <input type="checkbox" name="vendor" value="Jansport" id="check_vendor_jansport">
                                <span class="checkmark"></span>
                                JanSport
                            </label>
                        </li>
                        <li>
                            <label for="check_vendor_thenorthface" class="checkbox_container">
                                <input type="checkbox" name="vendor" value="The North Face" id="check_vendor_thenorthface">
                                <span class="checkmark"></span>
                                The North Face
                            </label>
                        </li>
                    </ul>
                    <hr>
                    <p>Price</p>
                    <ul>
                        <li>
                            <label for="check_price_0_25" class="checkbox_container">
                                <input type="checkbox" name="price" value="0-25" id="check_price_0_25">
                                <span class="checkmark"></span>
                                $0 - $25
                            </label>
                        </li>
                        <li>
                            <label for="check_price_25_50" class="checkbox_container">
                                <input type="checkbox" name="price" value="25-50" id="check_price_25_50">
                                <span class="checkmark"></span>
                                $25 - $50
                            </label>
                        </li>
                        <li>
                            <label for="check_price_50_100" class="checkbox_container">
                                <input type="checkbox" name="price" value="50-100" id="check_price_50_100">
                                <span class="checkmark"></span>
                                $50 - $100
                            </label>
                        </li>
                        <li>
                            <label for="check_price_100_plus" class="checkbox_container">
                                <input type="checkbox" name="price" value="100+" id="check_price_100_plus">
                                <span class="checkmark"></span>
                                $100+
                            </label>
                        </li>
                    </ul>
                    <hr>
                    <p>Availability</p>
                    <ul>
                        <li>
                            <label for="check_availability_instock" class="checkbox_container">
                                <input type="checkbox" name="availability" value="instock" id="check_availability_instock">
                                <span class="checkmark"></span>
                                In Stock
                            </label>
                        </li>
                        <li>
                            <label for="check_availability_comingsoon" class="checkbox_container">
                                <input type="checkbox" name="availability" value="comingsoon" id="check_availability_comingsoon">
                                <span class="checkmark"></span>
                                Coming Soon
                            </label>
                        </li>
                    </ul>
                    <hr>
                </form>
            </div>

            <div id="products_grid">
            </div>
        </div>

        <%-- FOOTER --%>
        <%@ include file="footer.jsp" %>
    </body>
</html>
