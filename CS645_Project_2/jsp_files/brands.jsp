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
        <title>Featured Brands</title>

        <link rel="stylesheet" href="/jadrn025/css/menu.css">
        <link rel="stylesheet" href="/jadrn025/css/brands.css">
        <link rel="stylesheet" href="/jadrn025/css/footer.css">

        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/jadrn025/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/jadrn025/js/menu_search.js"></script>
        <script type="text/javascript" src="/jadrn025/js/brands.js"></script>
    </head>
    <body>
        <%-- MENU --%>
        <%@ include file="menu.jsp" %>

        <div id="content">
            <div class="brand_container">
                <div>
                    <div>
                        <img src="/jadrn025/packback_images/logo_adidas.png" alt="Adidas">
                    </div>
                    <p>A brand in existence for over 90 years, Adidas is well-known for specializing in sportswear. However over the years, the brand has expanded to other accessories including bags and backpacks. The mixture between arts and sports shows through many of their products.</p>
                </div>
            </div>
            <div class="brand_container">
                <div>
                    <div>
                        <img src="/jadrn025/packback_images/logo_jansport_1.png" alt="JanSport">
                    </div>
                    <p>One of the world's largest backpack maker, JanSport presents a traditional, simple style to its products. Many of their backpacks have large main compartments with ample storage but may also include compartments for hydration and smaller essentials. The overall design, however, contributes to the products' durability.</p>
                </div>
            </div>
            <div class="brand_container">
                <div>
                    <div>
                        <img src="/jadrn025/packback_images/logo_herschel.jpg" alt="Herschel">
                    </div>
                    <p>Although the Herschel brand and company is young in its construction, their focus on providing hipster and retro backpacks have excelled as seen by the growing popularity of their products amongst consumers.</p>
                </div>
            </div>
            <div class="brand_container">
                <div>
                    <div>
                        <img src="/jadrn025/packback_images/logo_highsierra.png" alt="High Sierra">
                    </div>
                    <p>A lifestyle and outdoor company, High Sierra designs its feature-rich gear for any kind of trek or adventure. From the shoulder straps to the organized compartments, their backpacks are friendly and reliable for everyday use.</p>
                </div>
            </div>
            <div class="brand_container">
                <div>
                    <div>
                        <img src="/jadrn025/packback_images/logo_northface.png" alt="The North Face">
                    </div>
                    <p>An American outdoor company that specializes in outerwear and footwear aside from backpacks, The North Face along with JanSport is a leading backpack maker and seller. Their popularity arises from the numerous and different options the design of the bags offer. These backpacks are also known to be fitting and supportive to the wearer.</p>
                </div>
            </div>
        </div>

        <%-- FOOTER --%>
        <%@ include file="footer.jsp" %>
    </body>
</html>
