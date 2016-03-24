function assert(expected, actual) {
    if (JSON.stringify(expected) != JSON.stringify(actual)) {
        console.log('=== ASSERTION FAILED ===\nExpected:\n' + JSON.stringify(expected) + '\nActual:\n' + JSON.stringify(actual));
    }
}
