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
            window.location.href = '/search-results?email=' + userEmail;
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

    const updateRecords = () => {

        // Collected elements that will be updated with API data
        const ltvResultsNumber = $('#ltv-results-number');
        const ltvResultsText = $('#ltv-results-text');
        const ltvResultsNameAge = $('#ltv-results-name-age');
        const ltvResultsDescription = $('#ltv-results-description');
        const ltvResultsEmail = $('#ltv-results-email');
        const ltvResultsAddress = $('#ltv-results-address');
        const ltvResultsPhones = $('#ltv-results-phones');
        const ltvResultsRelatives = $('#ltv-results-relatives');
        
        // Elements updated with the API data
        ltvResultsNumber.html("1 Result");
        ltvResultsText.html("Look at the result below to see the details of the person you’re searched for.")
        ltvResultsNameAge.html(`${userRecords.first_name} ${userRecords.last_name}, 35`); // Age is not provided in the response
        ltvResultsDescription.html(`${userRecords.description}`);
        ltvResultsEmail.html(`${userRecords.email}`);
        ltvResultsAddress.html(`${userRecords.address}`);
        userRecords.phone_numbers.map( (phone, index) => {
            ltvResultsPhones.append(`<a href="tel:+${phone}" key="${index}">${phone}</a>`);
        });
        userRecords.relatives.map( (relative, index) => {
            ltvResultsRelatives.append(`<p>${relative}</p>`);
        });
    }
    
    const getUserRecords = () => {
        $.ajax({
            type: "GET",
            url: "https://ltv-data-api.herokuapp.com/api/v1/records.json?email=" + currentEmail,
            cache: false,
            success: (data) => {
                userRecords = data;
                const ltvLoadingContent = $('#ltv-loading-content');
                const ltvSearchResults = $('#ltv-search-results');
                const ltvResultsTittle = $('#ltv-results-tittle');
                const ltvResultsCard = $('#ltv-results-card');

                ltvLoadingContent.addClass('d-none');
                ltvSearchResults.removeClass('d-none');
                if(!$.isEmptyObject(userRecords)){
                    updateRecords();
                    ltvResultsTittle.removeClass('ltv-no-results')
                } else {
                    ltvResultsCard.removeClass('d-flex').addClass('d-none');
                }
            },
        });
    }
    getUserRecords();
}

$(function() {
    // On home page it will load initHome to handle the email search
    if($("#ltv-page-home").length > 0) initHome();
    // on search results page it will load initHome (for a possible new search) and initResults for data fetching
    if($("#ltv-page-results").length > 0) {
        initHome();
        initResults();
    }
});