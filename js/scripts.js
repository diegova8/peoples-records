// jQuery function for document ready
$(function() {
    // Code to run when the document is ready.
    const searchUser = () => {

        //get email input value
        const userEmail = $('#ltv-user-email').val();

        $.ajax({
            type: "GET",
            url: "https://ltv-data-api.herokuapp.com/api/v1/records.json?email=" + userEmail,
            cache: false,
            success: function(data){
               console.log(data.email);
            },
          });
    }
    
    //get button selector with jQuery
    const searchButton = $('#search-action');
    
    searchButton.click(() => {                                                                                                                                                                
        searchUser();
    });
});