export function Name() { return "ZSA Moonlander Mark I"; }
export function VendorId() { return 0x3297; }
export function ProductId() { return 0x1969; }
export function Publisher() { return "Mirey Mackey"; }
export function Documentation(){ return "troubleshooting/ZSA"; }
export function Size() { return [16,5]; }
export function ControllableParameters() {
    return [
        {"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
        {"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
    ];
}
export function DeviceType(){return "keyboard"}

var vLedNames = [
    // left side
    "[0, 0]", "[0, 1]", "[0, 2]", "[0, 3]", "[0, 4]", // 5
    "[1, 0]", "[1, 1]", "[1, 2]", "[1, 3]", "[1, 4]", // 5
    "[2, 0]", "[2, 1]", "[2, 2]", "[2, 3]", "[2, 4]", // 5
    "[3, 0]", "[3, 1]", "[3, 2]", "[3, 3]", "[3, 4]", // 5
    "[4, 0]", "[4, 1]", "[4, 2]", "[4, 3]", "[4, 4]", // 5
    "[5, 0]", "[5, 1]", "[5, 2]", "[5, 3]",           // 4
    "[6, 0]", "[6, 1]", "[6, 2]",                     // 3
    "[7, 0]", "[7, 1]", "[7, 2]", "[7, 3]",           // 4

    // right side
    "[15, 0]", "[15, 1]", "[15, 2]", "[15, 3]", "[15, 4]", // 5
    "[14, 0]", "[14, 1]", "[14, 2]", "[14, 3]", "[14, 4]", // 5
    "[13, 0]", "[13, 1]", "[13, 2]", "[13, 3]", "[13, 4]", // 5
    "[12, 0]", "[12, 1]", "[12, 2]", "[12, 3]", "[12, 4]", // 5
    "[11, 0]", "[11, 1]", "[11, 2]", "[11, 3]", "[11, 4]", // 5
    "[10, 0]", "[10, 1]", "[10, 2]", "[10, 3]",            // 4
    "[9, 0]", "[9, 1]", "[9, 2]",                          // 3
    "[8, 0]", "[8, 1]", "[8, 2]", "[8, 3]"                 // 4
];
const vLedPositions = [
    // left side
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], // 5
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], // 5
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], // 5
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], // 5
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], // 5
    [5, 0], [5, 1], [5, 2], [5, 3],         // 4
    [6, 0], [6, 1], [6, 2],                 // 3
    [7, 0], [7, 1], [7, 2], [7, 3],

    // right side
    [15, 0], [15, 1], [15, 2], [15, 3], [15, 4], // 5
    [14, 0], [14, 1], [14, 2], [14, 3], [14, 4], // 5
    [13, 0], [13, 1], [13, 2], [13, 3], [13, 4], // 5
    [12, 0], [12, 1], [12, 2], [12, 3], [12, 4], // 5
    [11, 0], [11, 1], [11, 2], [11, 3], [11, 4], // 5
    [10, 0], [10, 1], [10, 2], [10, 3],          // 4
    [9, 0], [9, 1], [9, 2],                      // 3
    [8, 0], [8, 1], [8, 2], [8, 3]               // 4
];

export function LedNames() {
    return vLedNames;
}

export function LedPositions() {
    return vLedPositions;
}

export function ImageUrl() {
    return "https://www.zsa.io/cdn-cgi/image/width=1153,quality=80,format=auto/@moonlander/images/legacy/22-blink-beep-0.webp";
}

export function Initialize() {
    device.log("Initializing ZSA Moonlander");
    let packet = [];
    packet[0] = 0x00;
    packet[1] = 0x01;
    device.write(packet,33)
    device.log("ZSA Moonlander Initialized");
}

export function Render() {
    for(let i = 0; i < vLedPositions.length; i++)
    {
        sendZone(i);
    }
}

export function Shutdown() {
    let packet = [];
    packet[0] = 0x00;
    packet[1] = 0x09;
    device.write(packet,33)

    packet[0] = 0x00;
    packet[1] = 0x05;
    device.write(packet,33)
}

export function Validate(endpoint) {
    return endpoint.interface === 1 && endpoint.usage === 0x0061;
}

function sendZone(zone)
{
    let packet = [];
    packet[0] = 0x00;
    packet[1] = 0x06;
    packet[2] = zone;

    var iX = vLedPositions[zone][0];
    var iY = vLedPositions[zone][1];

    var color;
    if (LightingMode == "Forced")
    {
        color = hexToRgb(forcedColor);
    }
    else
    {
        color = device.color(iX, iY);
    }
    packet[3] = color[0];
    packet[4] = color[1];
    packet[5] = color[2];

    device.write(packet, 33);
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let colors = [];
    colors[0] = parseInt(result[1], 16);
    colors[1] = parseInt(result[2], 16);
    colors[2] = parseInt(result[3], 16);

    return colors;
}
