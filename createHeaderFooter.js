// Get the header element
// Load the header
const headerRequest = new XMLHttpRequest();
headerRequest.open('GET', 'components/header.html');
headerRequest.onload = function() {
    const header = document.querySelector('header');
    if (header) {
        header.outerHTML = headerRequest.responseText;
    }
};
headerRequest.send();

// Load the footer
const footerRequest = new XMLHttpRequest();
footerRequest.open('GET', 'components/footer.html');
footerRequest.onload = function() {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.outerHTML = footerRequest.responseText;
    }
};
footerRequest.send();


function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('open');
}