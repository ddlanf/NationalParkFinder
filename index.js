'use strict';

// put your own value below!
const apiKey = 'kV8ec6smzW8oMiCuWfHHvRHXsM8QCQuqIoymsMjh'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function displayResults(responseJson) {
    // if there are previous results, remove them
    console.log(responseJson.data[0].fullName);
   $('#js-error-message').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++){
      // for each video object in the items 
      //array, add a list item to the results 
      //list with the video title, description,
      //and thumbnail
      $('#results-list').prepend(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <p>URL: ${responseJson.data[i].url}</p>
        </li>`
      )};
    //display the results section  
    $('#results').removeClass('hidden');
};

function getNationalParks(query, maxResults=10) {
    const params = {
      api_key: apiKey,
      q: query,
      limit: maxResults,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        if(err.message === "Unable to get property 'fullName' of undefined or null reference"){
            $('#js-error-message').text("Oops!! No National Parks Found");
        }
        else {$('#js-error-message').text(`Something went wrong: ${err.message}`);}
      });
}


function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      const maxResults = $('#js-max-results').val();
      const searchTerms = searchTerm.split(",");
      checkStates(searchTerms);
      const splitSearches = [];
      let destributeSearch = maxResults%searchTerms.length;
      if(destributeSearch === 0){     
        for(let i = 0; i < searchTerms.length; i++){
          splitSearches[i] = maxResults/searchTerms.length;
        }
      }
      else{ 
        for(let i = 0; i < searchTerms.length; i++){
          splitSearches[i] = (maxResults-destributeSearch)/searchTerms.length + destributeSearch;
          if(destributeSearch !== 0){ destributeSearch--; }
        }
      }
      $('#results-list').empty();
      for(let i = 0; i < searchTerms.length; i++){
         getNationalParks(searchTerms[i], splitSearches[i]);
      }
    });
  }

  function checkStates(array){
   const notState = [];
    for(let i = 0; i < array.length; i++){
        if(allStates.includes(array[i].toLowerCase()) === false){
          notState.push(`${array[i]}`);
        }
    } 
    for(let i = 0; i < notState.length; i++){
          array.splice( array.indexOf(`${notState[i]}`), 1);
    }
  }

  $(watchForm);