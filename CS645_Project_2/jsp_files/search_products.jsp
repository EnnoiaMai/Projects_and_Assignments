<!DOCTYPE html>
<%--
Nguyen, Thuc
jadrn025
Project #2
Spring 2018
--%>

<%
    String searchResultsHTML = (String) request.getAttribute("searchResults");
%>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Search</title>

        <link rel="stylesheet" href="/jadrn025/css/menu.css">
        <link rel="stylesheet" href="/jadrn025/css/search.css">
        <link rel="stylesheet" href="/jadrn025/css/footer.css">

        <script type="text/javascript" src="http://jadran.sdsu.edu/jquery/jquery.js"></script>
        <script type="text/javascript" src="/jadrn025/js/shopping_cart.js"></script>
        <script type="text/javascript" src="/jadrn025/js/menu_search.js"></script>
        <script type="text/javascript" src="/jadrn025/js/search.js"></script>
    </head>
    <body>
        <%-- MENU --%>
        <%@ include file="menu.jsp" %>

        <div id="content">
            <div id="products_grid">
                <% out.print(searchResultsHTML); %>
            </div>
        </div>

        <%-- FOOTER --%>
        <%@ include file="footer.jsp" %>
    </body>
</html>
