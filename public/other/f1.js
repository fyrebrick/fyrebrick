﻿const { jsPDF } = require("jspdf");
var callAddFont = function () {
this.addFileToVFS('FreeSerif (copy 1)-normal.ttf', font);
this.addFont('FreeSerif (copy 1)-normal.ttf', 'FreeSerif (copy 1)', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])