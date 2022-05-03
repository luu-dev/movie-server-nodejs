var express = require('express');
const config = require('config');
const model = require("./model");
const movie = model.model('movie');
const fetch = require('node-fetch');

function insert(query) {
const getMovie = 'https://api.themoviedb.org/3/search/movie?api_key=7110422e82d3a45a61db16eaa75f3810&query='+query+'&page=1';
fetch(getMovie).then(
    function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
        }

        // Examine the text in the response
        response.json().then(async function (data) {

            await movie.create(data.results);
            console.log(data.results);
        });
    }
)
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
}






