function saveSpinScore(name, score) {
    saveScore(name, score, 'spinScores');
}

function saveHeightScore(name, score) {
    saveScore(name, score, 'heighScores');
}

function saveScore(name, score, dbName) {
    spinScores = loadObject(dbName);
    var newScore = {
        name: name,
        score: score
    };
    spinScores.push(newScore);
    saveObject(dbName, spinScores);
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
