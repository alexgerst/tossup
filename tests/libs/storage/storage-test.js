function testBool() {
    var value = true;
    saveObject('value', value);
    assert(value, loadObject('value'));
}

function testInt() {
    var value = 9;
    saveObject('value', value);
    assert(value, loadObject('value'));
}

function testDouble() {
    var value = 54.31;
    saveObject('value', value);
    assert(value, loadObject('value'));
}

function testString() {
    var value = "Hello, World!"
    saveObject('value', value);
    assert(value, loadObject('value'));
}

function testArray() {
    var value = [false, 4, 43.98, "Boogie Woogie"]
    saveObject('value', value);
    assert(value, loadObject('value'));
}

function runTests() {
    console.log("Starting LocalStorage test...");
    testBool();
    testInt();
    testDouble();
    testString();
    testArray();
    console.log("LocalStorage test complete");
}

