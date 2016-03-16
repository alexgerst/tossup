function saveScore(name, score) {

}

function getHeightScores() {
    var scores = [];
    var counter = 0;
    while ( counter < 10 ) {
        var score = {
            name: 'player ' + counter,
            score: counter * 2;
        };
        scores.push(score);
        counter++;
    }
    return scores;
}

function getSpinScores() {
    var scores = [];
    var counter = 0;
    while ( counter < 10 ) {
        var score = {
            name: 'player ' + counter,
            score: counter * 7;
        };
        scores.push(score);
        counter++;
    }
    return scores;
}
