/* DOMContentLoaded event */
document.addEventListener("DOMContentLoaded", function () {
    const sectionLinks = document.querySelectorAll("#sidebar-nav a");   /* Selecting elements - Selects all anchor (<a>) elements within the #sidebar-nav*/
    const contentSections = document.querySelectorAll("section[id^='section']"); /* Selects all sections (<section>) with id attributes that start with "section." */

    /* Adding Event Listener - click event to each link */
    sectionLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();  /* prevents default behaviour of the anchor element*/
            const sectionId = this.getAttribute("href").substring(1) + "-content"; // retrives href attribute, Remove the "#" character and store sectionId
            toggleSection(sectionId); /* call toogleSection function*/
        });
    });

    toggleSection("section1-content");
    /* function responsible for controlling the visibility of content sections */
    function toggleSection(sectionId) {
        contentSections.forEach(function (section) { /* Loops through all content sections and set display to none - hiding content*/
            section.style.display = "none";
        });
        console.log(sectionId);
        /*if the selectedSection exist, it sets its display style property to block, making it visible */
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.style.display = "block";
        }
    }

 
});


/* UnCheck Radio Buttons*/
document.addEventListener("DOMContentLoaded", function () {
    const radioButtons = document.querySelectorAll('input[type="radio"]');

    radioButtons.forEach((radioButton) => {
        radioButton.addEventListener('click', (e) => {
            if (e.target.checked) {
                radioButtons.forEach((r) => {
                    if (r !== radioButton) {
                        r.checked = false;
                    }
                });
            }
        });
    });
});


// JavaScript to toggle code snippets
const codeBlocks = document.querySelectorAll('.example-code');

codeBlocks.forEach((codeBlock) => {
    codeBlock.addEventListener('click', () => {
        codeBlock.classList.toggle('active');
    });
});


const fontSample = document.getElementById('fontSample');
const poppinsBtn = document.getElementById('poppinsBtn');
const carterOneBtn = document.getElementById('carterOneBtn');

poppinsBtn.addEventListener('click', () => {
    fontSample.style.fontFamily = "'Poppins', Arial, Helvetica, sans-serif";
});

carterOneBtn.addEventListener('click', () => {
    fontSample.style.fontFamily = "'Carter One', Arial, Helvetica, sans-serif";
});


// JavaScript code to control the dialog
const dialogOverlay = document.getElementById('dialog-overlay');
const dialog = document.getElementById('dialog');
const closeButton = document.getElementById('close-button');
const confirmButton = document.getElementById('confirm-button');
const cancelButton = document.getElementById('cancel-button');

closeButton.addEventListener('click', () => {
    dialogOverlay.style.display = 'none';
});

confirmButton.addEventListener('click', () => {
    // Handle confirm action
});

cancelButton.addEventListener('click', () => {
    // Handle cancel action
});


 // JavaScript code to handle form submission
 const feedbackForm = document.querySelector('.feedback-form form');

 feedbackForm.addEventListener('submit', function (event) {
     event.preventDefault();
     
     // Here, you can collect form data and send it to the server for processing
     const formData = new FormData(feedbackForm);
     
     // Example: Log form data to the console
     for (const entry of formData.entries()) {
         console.log(entry[0] + ': ' + entry[1]);
     }
     
     // Reset the form or show a confirmation message
     feedbackForm.reset();
 });


 function openDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.style.display = "block"; // Show the dialog by setting display to "block"
    dialog.showModal();
}

function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.style.display = "none"; // Hide the dialog by setting display to "none"
    dialog.close();
}
