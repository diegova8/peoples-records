// === Utils section start ===
// Get Parameters from URL
const getParameters = (paramName) => {
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.has(paramName)) return searchParams.get(paramName);
    return undefined;
}
// Validate email
const validateEmail = (email) => {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(String(email).toLowerCase());
}
// === Utils section end ===

const initHome = () => {
    const userEmailInput = $('#ltv-user-email');
    const searchButton = $('#search-action');
    let isEmailValid = false;

    const searchUser = () => {
        // Validate email on click
        toggleInputError();
        if (isEmailValid) {
            const userEmail = userEmailInput.val();
            window.location = '/search-results?email=' + userEmail;
        }
    }

    const toggleInputError = () => {
        if(isEmailValid) {
            userEmailInput.parent().removeClass('ltv-required');
        } else {
            // Shown email required alert
            userEmailInput.parent().addClass('ltv-required');
        }
    }
    
    const inputChangeText = () => {
        isEmailValid = validateEmail(userEmailInput.val());
        toggleInputError();
    }
    
    // Trigger search
    searchButton.click(searchUser);
    // Used keyup instead of keypress, because the first one wont trigger with backspace
    userEmailInput.on('keyup', inputChangeText);
}

const initResults = () => {
    let userRecords = undefined;
    // Get email value from url parameters
    const currentEmail = getParameters('email');
    
    const ltvResultsNumber = $('#ltv-results-number');
    const ltvResultsNameAge = $('#ltv-results-name-age');
    const ltvResultsDescription = $('#ltv-results-description');

    const updateRecords = () => {
        ltvResultsNumber.html(userRecords.lenght);
        ltvResultsNameAge.html(`${userRecords.first_name} ${userRecords.last_name}, 35`); // Age is not provided in the response
        ltvResultsDescription.html(`${userRecords.description}`);
    }
    
    const getUserRecords = () => {
        $.ajax({
            type: "GET",
            url: "https://ltv-data-api.herokuapp.com/api/v1/records.json?email=" + currentEmail,
            cache: false,
            beforeSend: () => {
                // // Hide containers to show loading spinner
                // $('#main-content').remove();
                // $('#loading-content').removeClass('d-none');
            },
            success: (data) => {
                userRecords = data;
                console.log(userRecords);
                updateRecords();
            },
        });
    }

    getUserRecords();
}

$(function() {
    if($("#ltv-page-home").length > 0) initHome();
    if($("#ltv-page-results").length > 0) initResults();
});