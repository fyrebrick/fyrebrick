﻿const { jsPDF } = require("jspdf");
var callAddFont = function () {
this.addFileToVFS('FreeSerif-normal.ttf', font);
this.addFont('FreeSerif-normal.ttf', 'FreeSerif', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])