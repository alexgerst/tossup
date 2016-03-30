function saveObject(name, obj) {
    if(typeof(Storage) !== "undefined") {
        localStorage[name] = JSON.stringify(obj);
    } else {
        throw "ERROR: LocalStorage unsupported";
    }
}

function loadObject(name) {
    if(typeof(Storage) !== "undefined") {
        var object = localStorage[name];
        if(object !== undefined && object != '') {
            console.log(object);
            return JSON.parse(object);
        } else {
            return undefined;
        }
    } else {
        throw "ERROR: LocalStorage unsupported";
    }
}

