function saveObject(name, obj) {
    if(typeof(Storage) !== "undefined") {
        localStorage[name] = JSON.stringify(obj);
    } else {
        throw "ERROR: LocalStorage unsupported";
    }
}

function loadObject(name) {
    if(typeof(Storage) !== "undefined") {
        return JSON.parse(localStorage[name]);
    } else {
        throw "ERROR: LocalStorage unsupported";
    }
}

