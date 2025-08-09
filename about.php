<?php
session_start();
include "header.php";
include "dbconnect.php";
include "navigation.php";
?>
<div id="about-page-main">
    <div id="high-quality-guarantee">
        <h1 class="about-h1">High-Quality Guarantee</h1>
        <br>
        <p>At [Your Company Name], we are committed to providing our customers with products 
        and services of the highest quality. Every item we offer is carefully selected, 
        tested, and reviewed to meet our strict standards. If a product or service does not 
        meet your expectations, we want to hear about it. Your satisfaction is our top 
        priority. Should you experience any issues with your purchase, we will work with you 
        to make it right—whether that means replacing the product, offering a suitable 
        alternative, or issuing a refund according to our refund policy. We stand behind 
        the quality of our offerings and are proud to guarantee your experience with us.</p>
    </div>
    <div class="gap"></div>
    <div id="privacy-policy">
        <h1 class="about-h1">Privacy Policy</h1>
        <br>
        <p>
        Your privacy is important to us. This Privacy Policy outlines how [Your Company Name] 
        collects, uses, and protects your personal information when you visit our website or 
        use our services.</p><h3>Information We Collect:</h3><p>We may collect personal information such as 
        your name, email address, phone number, payment details, and browsing behavior when 
        you interact with our website or make a purchase.
        </p><h3>How We Use Your Information:</h3><p>Your information is used to fulfill orders, improve our 
        services, respond to customer inquiries, send updates or promotional materials 
        (only if you have opted in), and ensure a secure experience.</p><h3>Data Protection:</h3><p>We 
        implement industry-standard security measures to safeguard your data. Your information
        will never be sold, traded, or shared with third parties without your consent, except
        as required by law or to complete a service you have requested. By using our site, you 
        consent to the terms outlined in this policy. For questions or concerns, please 
        contact us at [Your Contact Info].</p>
    </div>
    <div class="gap"></div>
    <div id="terms-of-service">
        <h1 class="about-h1">Terms of Service</h1>
        <br>
        <p>By accessing and using [Your Company Name]'s website and services, you agree to the 
        following terms: </p><h3>Use of Services:</h3><p>You agree to use our website and 
        services only for lawful purposes. You may not engage in any activity that interferes 
        with or disrupts the functionality of our site.</p><h3>Intellectual Property:</h3><p>
        All content on this site—including text, images, logos, and graphics—is the property 
        of [Your Company Name] and may not be used or reproduced without our written 
        permission. </p><h3>Limitation of Liability:</h3><p>[Your Company Name] is not liable 
        for any direct, indirect, incidental, or consequential damages resulting from your use 
        of our services or website.</p><h3>Modifications:</h3><p>We reserve the right to 
        update or change these Terms at any time. Continued use of our services after changes 
        have been posted constitutes your acceptance of the new terms. If you do not agree to 
        these terms, please refrain from using our services.</p>
    </div>
    <div class="gap"></div>
    <div id="refund-policy">
        <h1 class="about-h1">Refund Policy</h1>
        <br>
        <p>At [Your Company Name], we want you to be completely satisfied with your purchase.
        </p><h3>Eligibility for Refunds:</h3><p>Refunds are available within 21 days of 
        purchase for eligible products or services. Items must be unused, in original packaging, 
        and accompanied by proof of purchase.</p><h3>How to Request a Refund:</h3><p>To 
        initiate a refund, please contact our support team at [Your Contact Info] with your 
        order number and reason for the request. We will review your request and respond 
        promptly.</p><h3>Refund Method:</h3><p>Approved refunds will be issued to the original 
        method of payment within [X] business days (typically 5 to 10 business days).
        We reserve the right to deny refund requests that do not meet the terms outlined above.</p>
    </div>
</div>
<?php
include "footer.php";