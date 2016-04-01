function saveSpinScore(name, score) {
    saveScore(name, score, 'spinScores');
}

function saveHeightScore(name, score) {
    saveScore(name, score, 'heightScores');
}

function saveScore(name, score, dbName) {
    var scores = loadObject(dbName);
    if (scores === undefined || scores == '') {
        scores = [];
    }
    var newScore = {
        name: name,
        score: score
    };
    scores.push(newScore);
    saveObject(dbName, scores);
}

function getHeightScores() {
    scores = loadObject('heightScores');
    if (scores === undefined || scores == '') {
        return [];
    }
    scores.sort(compareScores);
    return scores;
}

function getSpinScores() {
    var scores = loadObject('spinScores');
    if (scores === undefined || scores == '') {
        scores = [];
    }
    scores.sort(compareScores);
    return scores;
}

function compareScores(a, b) {
    var aScore = parseInt(a.score);
    var bScore = parseInt(b.score);
    if (aScore < bScore) {
        return 1;
    } else if (aScore > bScore) {
        return -1;
    } else {
        return 0;
    }
}

