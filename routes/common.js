const config = require('config');

function validKey(query_data) {
    var api_key_name = "api_key";
    var api_key_value =config.get('api_key');

    if (typeof query_data == "object" && query_data[api_key_name] == api_key_value) {
        return true;
    } else {
        return false;
    }
}

/*split genres with 2 elements/pair
Example:
Input: [ 10749, 18, 35 ]
Output: [ [ 10749, 18 ], [ 10749, 35 ], [ 18, 35 ] ]
* */
function createGenreFilter(list) {
    var result = [];
    if(Array.isArray(list) && list.length) {
        for (let i=0; i<(list.length - 1); i++) {
            for (let j=1; j<list.length; j++) {
                if(i != j) result.push([list[i], list[j]]);
            }
            result.push();
        }
    }
    return result;
}

exports.validKey= validKey;
exports.createGenreFilter= createGenreFilter;