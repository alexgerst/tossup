// SensorTag object
var sensortag;

// Various variables
var tossMode = true;

var pressed = false;    // Button press indicator (default false)
var caught = true;      // Device caught indicator (default true)
var peaked = false;     // Apogee reached indicator (default false)

var prevAccel;          // Previous z-axis acceleration measurement

var acc_rate = 100; 	// Accelerometer sample rate in ms (1-1000)
var throw_level = 8;    // Lower bound for velocity change indicating a throw (large)
var catch_level = 2;    // Lower bound for velocity change indicating a catch (medium)
var peak_level = 0.05;  // Upper bound for velocity change indicating apogee reached (small)

var spinAcc = {x: [0], y: [0], z: [0]};      // An array containing each instance of acceleration data

var startTime = 0;      // Start time variable
var peakTime = 0;       // Apogee time variable
var caughtTime = 0;     // Catch time variable

// Score limits

var maxFactor = 1.5; // Multiplicitive factor for highest throw score (determines difficulty)

var maxThrow = 1895 * maxFactor;    // The highest throw
var minThrow = 184;     // The lowest throw

var maxSpin = 80;    // The highest spin
var minSpin = 1;      // the lowest spin

var maxScore = 1000; 	// The highest attainable score

// SensorTag characteristic id
var characteristicId = '00002a24-0000-1000-8000-00805f9b34fb';

// SensorTag connection variables
var attemptToConnect = false;   // Whether or not the user is currently attempting to connect
var connected = false;          // Whether or not a SensorTag is currently connected
var connecting = false;         // Whether or not the app is actively trying to connect
var readTimeout = null;         // Timeout for reading characteristics

function getTossMode() {
    return tossMode;
}

function setTossMode(value) {
    tossMode = value;
}

function getPressed() {
    return pressed;
}

function setPressed(value) {
    pressed = value;
}

function initializeSensorTag() {
    sensortag = evothings.tisensortag.createInstance(evothings.tisensortag.CC2650_BLUETOOTH_SMART);

    sensortag.statusCallback(statusHandler);
    sensortag.errorCallback(errorHandler);
    sensortag.accelerometerCallback(accelerometerHandler, acc_rate);
    sensortag.gyroscopeCallback(gyroscopeHandler, acc_rate);
    sensortag.keypressCallback(function(){}, 1000);
    sensortag.temperatureCallback(function(){}, 1000);
    sensortag.barometerCallback(function(){}, 1000);
    sensortag.magnetometerCallback(function(){}, 1000);
    sensortag.humidityCallback(function(){}, 1000);
    sensortag.luxometerCallback(function(){}, 1000);
}

function checkConnection(attemptToConnect) {
    if (sensortag && sensortag.device) {
        readTimeout = setTimeout(
            function() {
                connected = false;
            },
            400
        );

        try {
            sensortag.device.readCharacteristic(
                characteristicId,
                function() {
                    if (readTimeout != null) {
                        clearTimeout(readTimeout);
                    }
                    connected = true;
                },
                function() {
                    connected = false;
                }
            );
        } catch(e) {
          connected=false;
        }
    } else {
        connected = false;
    }

    if (attemptToConnect) {
        if (connected) {
            // set bluetooth-connected.png
            setBluetoothImg('ui/images/bluetooth-connected.png');
            console.log('checkConnection(): bluetooth-connected');
        } else {
            // set bluetooth-connecting.png
            setBluetoothImg('ui/images/bluetooth-connecting.png');
            console.log('checkConnection(): bluetooth-connecting');
            if (!connecting)
            {
                connecting = true;
                setTimeout(
                    function() {
                        connecting = false
                    },
                    5000
                );
                if (sensortag != null) {
                    sensortag.connectToNearestDevice();
                }
            }
        }
    } else {
        // set bluetooth-off.png
        setBluetoothImg('ui/images/bluetooth-off.png');
        console.log('checkConnection(): bluetooth-off');
        if (sensortag != null) {
            sensortag.disconnectDevice();
        }
    }
}

function statusHandler(status)
{
    console.log(status);

    if ('CONNECTED' == status)
    {
        if (readTimeout != null) {
            clearTimeout(readTimeout);
        }
        connected = true;
    }
    if ('EASYBLE_ERROR_DISCONNECTED' == status)
    {
        connected = false;
    }
}

function errorHandler(error) {
    console.log('Error: ' + error);
}

// Capture the acceleration data
function accelerometerHandler(data) {
    if (tossMode) {
        var values = sensortag.getAccelerometerValues(data);
        var x = values.x;
        var y = values.y;
        var z = values.z;

        // Get the total magnitude of acceleration on the device
        var total = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));

        if (pressed) {
            // Calculate and store change in velocity
            var velocityChange = Math.abs(total-prevAccel)/(acc_rate/1000);

            // When thrown
            if (caught && (velocityChange >= throw_level)) {
                startTime = (new Date()).getTime();
                caught = false;
                peaked = false;
                displayValue("scoreField", "Thrown");

                // When apogee reached
            } else if (!caught && !peaked && (velocityChange <= peak_level)) {
                peakTime = (new Date()).getTime() - startTime;
                peaked = true;
                displayValue("scoreField", "Peaked");

                // When caught (and apogee detected)
            } else if (!caught && peaked && (velocityChange >= catch_level)) {
                caughtTime = (new Date()).getTime() - startTime;
                caught = true;
                stopButtonPress(); // Don't wait for a button press
            } else if(!caught && peaked) {
              var time = ((new Date()).getTime() - startTime - peakTime);

              var heightScore = calculateScore(time, maxThrow, minThrow);
              displayValue('scoreField', "" + heightScore);
            }
        }

        // Update last accelerometer value
        prevAccel = total;
    }
}

function gyroscopeHandler(data) {
    if (!tossMode) {
        // Calculate the gyroscope values from raw sensor data.
        var values = sensortag.getGyroscopeValues(data);
        var x = values.x;
        var y = values.y;
        var z = values.z;

        if (pressed) {
            var spinScore = determineSpinScore(x, y, z);
            displayValue('scoreField', Math.abs(spinScore));
        } else {
          spinScore = 0;
        }
    }
}

// Ends tracking, displays values & resets data
function stopTracking() {
    if (tossMode) {
        var time = (caughtTime - peakTime);

        var heightScore = calculateScore(time, maxThrow, minThrow);
        displayValue('scoreField', "" + heightScore);

        caught = true;
        peaked = false;
        startTime = 0;
        peakTime = 0;
        caughtTime = 0;
    } else {
        // Calculate score of spin data
        spinAcc = {x: [0], y: [0], z: [0]} ;
        HighSpin = 0;
    }
}

function countHighAccelerations(arr){
    var count = 1;
    for (var i=0; i<arr.length; i++) {
        if (Math.abs(arr[i])>250) {
            count+=1;
        }
    }
    return count;
}

// Decides what the highest spin axis is and returns its score
function determineSpinScore(x, y, z) {
    // Start with the x axis
    spinAcc['x'].push(x);
    var spinScore = calculateScore(countHighAccelerations(spinAcc['x']), maxSpin, minSpin);
    var val = 'x';
    
    // Compare to x axis
    spinAcc['y'].push(y);
    var temp = calculateScore(countHighAccelerations(spinAcc['y']), maxSpin, minSpin);
    if(temp>spinScore) {
      spinScore = temp;
      val = 'y';
    }
    
    // Compare to z axis
    spinAcc['z'].push(z);
    temp = calculateScore(countHighAccelerations(spinAcc['z']), maxSpin, minSpin);
    if(temp>spinScore) {
      spinScore = temp;
      val = 'z';
    }

    if(spinAcc[val].length > 3 &&
        spinAcc[val][spinAcc[val].length-1] < 250 &&
        spinAcc[val][spinAcc[val].length-2] < 250 &&
        spinAcc[val][spinAcc[val].length-3] < 250 &&
        spinScore > 26) {
      stopButtonPress();
    }

    return spinScore;
}

// Takes a variable representing time of throw in ms, returns a score from 0-10 which ranks the throw relative to the maximum and minimum throws possible
function calculateScore(time, max, min) {
    var score = Math.round(((time-min)/(max-min))*maxScore);

    // Don't return negative scores (use zero instead) or scores greater than the maximum score
    return (score > maxScore) ? maxScore : (score < 0) ? 0 : score;
}

function median(values) {
    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half-1] + values[half]) / 2.0;
    }
}

document.addEventListener(
    'deviceready',
    function() {
        evothings.scriptsLoaded(initializeSensorTag);
    },
    false
);

setInterval(
    function() {
        checkConnection(document.getElementById('connectCheckbox').checked);
    },
    500
);
