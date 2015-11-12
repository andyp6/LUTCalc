/* lutgammabox.js
* Transfer curve and colour space conversion (Gamma and Gamut) options UI object for the LUTCalc Web App.
* 9th January 2015
*
* LUTCalc generates 1D and 3D Lookup Tables (LUTs) for video cameras that shoot log gammas, 
* principally the Sony CineAlta line.
*
* By Ben Turley, http://turley.tv
* First License: GPLv2
* Github: https://github.com/cameramanben/LUTCalc
*/
function LUTGammaBox(fieldset,inputs,messages) {
	this.box = document.createElement('fieldset');
	this.inputs = inputs;
	this.messages = messages;
	this.p = 2;
	this.messages.addUI(this.p,this);
	this.gamutPass = 0;
	this.gamutLA = 0;
	this.build();
	fieldset.appendChild(this.box);
	lutcalcReady(this.p);
}
LUTGammaBox.prototype.build = function() {
	this.io();
	this.ui();
};
LUTGammaBox.prototype.io = function() {
	this.inGammaSubs = document.createElement('select');
	this.inputs.addInput('inGammaSubs',this.inGammaSubs);
	this.inGammaSelect = document.createElement('select');
	this.inputs.addInput('inGamma',this.inGammaSelect);
	this.inLinSelect = document.createElement('select');
	this.inputs.addInput('inLinGamma',this.inLinSelect);
	this.inGamutSubs = document.createElement('select');
	this.inputs.addInput('inGamutSubs',this.inGamutSubs);
	this.inGamutSelect = document.createElement('select');
	this.inputs.addInput('inGamut',this.inGamutSelect);
	this.outGammaSubs = document.createElement('select');
	this.inputs.addInput('outGammaSubs',this.outGammaSubs);
	this.outGammaSelect = document.createElement('select');
	this.inputs.addInput('outGamma',this.outGammaSelect);
	this.outLinSelect = document.createElement('select');
	this.inputs.addInput('outLinGamma',this.outLinSelect);
	this.outGamutSubs = document.createElement('select');
	this.inputs.addInput('outGamutSubs',this.outGamutSubs);
	this.outGamutSelect = document.createElement('select');
	this.inputs.addInput('outGamut',this.outGamutSelect);
};
LUTGammaBox.prototype.ui = function() {
	this.box.appendChild(document.createElement('label').appendChild(document.createTextNode('Rec Gamma')));
	this.box.appendChild(this.inGammaSubs);
	this.box.appendChild(this.inGammaSelect);
	this.box.appendChild(document.createElement('br'));
	this.inLin = document.createElement('div');
	this.inLin.appendChild(document.createElement('label').appendChild(document.createTextNode('γ Correction')));
	this.inLin.appendChild(this.inLinSelect);
	this.box.appendChild(this.inLin);
	this.inGamutBox = document.createElement('div');
	this.inGamutBox.appendChild(document.createElement('label').appendChild(document.createTextNode('Rec Gamut')));
	this.inGamutBox.appendChild(this.inGamutSubs);
	this.inGamutBox.appendChild(this.inGamutSelect);
	this.box.appendChild(this.inGamutBox);
	this.box.appendChild(document.createElement('label').appendChild(document.createTextNode('Out Gamma')));
	this.box.appendChild(this.outGammaSubs);
	this.box.appendChild(this.outGammaSelect);
	this.box.appendChild(document.createElement('br'));
	this.outLin = document.createElement('div');
	this.outLin.appendChild(document.createElement('label').appendChild(document.createTextNode('γ Correction')));
	this.outLin.appendChild(this.outLinSelect);
	this.box.appendChild(this.outLin);
	this.outGamutBox = document.createElement('div');
	this.outGamutBox.appendChild(document.createElement('label').appendChild(document.createTextNode('Out Gamut')));
	this.outGamutBox.appendChild(this.outGamutSubs);
	this.outGamutBox.appendChild(this.outGamutSelect);
	this.box.appendChild(this.outGamutBox);
	this.inLin.style.display = 'none';
	this.inGamutBox.style.display = 'none';
	this.outLin.style.display = 'none';
	this.outGamutBox.style.display = 'none';
};
LUTGammaBox.prototype.events = function() {
	this.inGammaSubs.onchange = function(here){ return function(){
		here.updateGammaInList(true);
	};}(this);
	this.inGamutSubs.onchange = function(here){ return function(){
		here.updateGamutInList(true);
	};}(this);
	this.inGammaSelect.onchange = function(here){ return function(){
		here.changeGammaIn();
		here.messages.gaSetParams();
	};}(this);
	this.inLinSelect.onchange = function(here){ return function(){
		here.changeGammaIn();
		here.messages.gaSetParams();
	};}(this);
	this.outGammaSubs.onchange = function(here){ return function(){
		here.updateGammaOutList();
	};}(this);
	this.outGamutSubs.onchange = function(here){ return function(){
		here.updateGamutOutList();
	};}(this);
	this.outGammaSelect.onchange = function(here){ return function(){
		here.changeGammaOut();
		here.messages.gaSetParams();
	};}(this);
	this.outLinSelect.onchange = function(here){ return function(){
		here.changeGammaOut();
		here.messages.gaSetParams();
	};}(this);
	this.inGamutSelect.onchange = function(here){ return function(){
		here.changeInGamut();
		here.messages.gtSetParams();
	};}(this);
	this.outGamutSelect.onchange = function(here){ return function(){
		here.changeOutGamut();
		here.messages.gtSetParams();
	};}(this);
};
// Set Up Data
LUTGammaBox.prototype.gotGammaLists = function() {
	var inList = this.inputs.gammaInList;
	var outList = this.inputs.gammaOutList;
	var linList = this.inputs.gammaLinList;
	var subNames = this.inputs.gammaSubNames;
	this.inGammaSubs.length = 0;
	this.inGammaSelect.length = 0;
	this.outGammaSubs.length = 0;
	this.outGammaSelect.length = 0;
	this.inLinSelect.length = 0;
	this.outLinSelect.length = 0;
	var max = inList.length;
	for (var i=0; i < max; i++) {
		var option = document.createElement('option');
		option.value = inList[i].idx;
		option.appendChild(document.createTextNode(inList[i].name));
		this.inGammaSelect.appendChild(option);
	}
	max = outList.length;
	for (var i=0; i < max; i++) {
		var option = document.createElement('option');
		option.value = outList[i].idx;
		option.appendChild(document.createTextNode(outList[i].name));
		this.outGammaSelect.appendChild(option);
	}
	max = linList.length;
	for (var i=0; i < max; i++) {
		var option = document.createElement('option');
		var option2 = document.createElement('option');
		option.value = linList[i].idx;
		option2.value = linList[i].idx;
		option.appendChild(document.createTextNode(linList[i].name));
		option2.appendChild(document.createTextNode(linList[i].name));
		this.inLinSelect.appendChild(option);
		this.outLinSelect.appendChild(option2);
	}
	max = subNames.length;
	for (var i=0; i < max; i++) {
		var option = document.createElement('option');
		var option2 = document.createElement('option');
		option.value = i;
		option2.value = i;
		option.appendChild(document.createTextNode(subNames[i]));
		option2.appendChild(document.createTextNode(subNames[i]));
		if (subNames[i] === 'All') {
			option2.selected = true;
		}
		this.inGammaSubs.appendChild(option);
		this.outGammaSubs.appendChild(option2);
	}
	this.updateGammaInList();
	this.updateGammaOutList();
};
LUTGammaBox.prototype.gotGamutLists = function(pass,LA) {
	var inList = this.inputs.gamutInList;
	var outList = this.inputs.gamutOutList;
	var subNames = this.inputs.gamutSubNames
	var inSubs = this.inputs.gamutInSubLists;
	var outSubs = this.inputs.gamutOutSubLists;
	max = inList.length;
	for (var i=0; i < max; i++) {
		var option = document.createElement('option');
		option.value = inList[i].idx;
		if (inList[i].name === 'Custom In') {
			this.inputs.addInput('custGamInIdx',i);
			inList[i].name = 'Custom';
		}
		option.appendChild(document.createTextNode(inList[i].name));
		this.inGamutSelect.appendChild(option);
	}
	max = outList.length;
	for (var i=0; i < max; i++) {
		var option = document.createElement('option');
		option.value = outList[i].idx;
		if (outList[i].name === 'Custom Out') {
			this.inputs.addInput('custGamOutIdx',i);
			outList[i].name = 'Custom';
		}
		option.appendChild(document.createTextNode(outList[i].name));
		this.outGamutSelect.appendChild(option);
	}
	this.gamutPass = pass;
	this.gamutLA = LA;
	max = subNames.length;
	for (var i=0; i < max; i++) {
		var option = document.createElement('option');
		var option2 = document.createElement('option');
		option.value = i;
		option2.value = i;
		option.appendChild(document.createTextNode(subNames[i]));
		option2.appendChild(document.createTextNode(subNames[i]));
		if (subNames[i] === 'All') {
			option2.selected = true;
		}
		this.inGamutSubs.appendChild(option);
		this.outGamutSubs.appendChild(option2);
	}
	this.updateGamutInList();
	this.updateGamutOutList();
};
LUTGammaBox.prototype.defaultGam = function() {
	var max = this.inGammaSelect.options.length;
	var defGamma = this.inputs.defGammaIn;
	for (var i = 0; i < max; i++) {
		if (defGamma === this.inGammaSelect.options[i].lastChild.nodeValue) {
			this.inGammaSelect.options[i].selected = true;
			break;
		}
	}
	this.changeGammaIn();
	max = this.inGamutSelect.options.length;
	var defGamut = this.inputs.defGamutIn;
	for (var i = 0; i < max; i++) {
		if (defGamut === this.inGamutSelect.options[i].lastChild.nodeValue) {
			this.inGamutSelect.options[i].selected = true;
			break;
		}
	}
	this.updateGammaInList(false);
	this.updateGamutInList(false);
};
// Event Responses
LUTGammaBox.prototype.changeGammaIn = function() {
	if (this.inGammaSelect.options[this.inGammaSelect.options.selectedIndex].value === '9999') {
		this.inLin.style.display = 'block';
	} else {
		this.inLin.style.display = 'none';
	}
};
LUTGammaBox.prototype.changeGammaOut = function() {
	if (this.outGammaSelect.options[this.outGammaSelect.options.selectedIndex].value == '9999') {
		this.outLin.style.display = 'block';
	} else {
		this.outLin.style.display = 'none';
	}
	this.messages.checkFormat();
};
LUTGammaBox.prototype.updateGammaInList = function(setParams) {
	var sub = this.inGammaSubs.selectedIndex;
	var showList = this.inputs.gammaSubLists[sub];
	var m = this.inGammaSelect.options.length;
	var m2 = showList.length;
	var val;
	var cur = parseInt(this.inGammaSelect.options[this.inGammaSelect.selectedIndex].value);
	var curOK = false;
	var first = false;
	var firstVal;
	for (var j=0; j<m; j++) {
		this.inGammaSelect.options[j].disabled = true;
		this.inGammaSelect.options[j].style.display = 'none';
		for (var k=0; k<m2; k++) {
			val = parseInt(this.inGammaSelect.options[j].value);
			if (val === 9999 || val === showList[k]) {
				if (!first) {
					first = true;
					firstVal = j;
				}
				this.inGammaSelect.options[j].disabled = false;
				this.inGammaSelect.options[j].style.display = 'block';
				break;
			}
			if (showList[k] === cur) {
				curOK = true;
			}
		}
	}
	if (!curOK) {
		if (first) {
			this.inGammaSelect.options[firstVal].disabled = false;
			this.inGammaSelect.options[firstVal].selected = true;
			if (setParams) {
				this.messages.gaSetParams();
			}
		} else {
			console.log('Missing options');
		}
	}
	this.changeGammaIn();
};
LUTGammaBox.prototype.updateGammaOutList = function() {
	var sub = this.outGammaSubs.selectedIndex;
	var showList = this.inputs.gammaSubLists[sub];
	var m = this.outGammaSelect.options.length;
	var m2 = showList.length;
	var val;
	var cur = parseInt(this.outGammaSelect.options[this.outGammaSelect.selectedIndex].value);
	var curOK = false;
	var first = false;
	var firstVal;
	for (var j=0; j<m; j++) {
		this.outGammaSelect.options[j].disabled = true;
		this.outGammaSelect.options[j].style.display = 'none';
		for (var k=0; k<m2; k++) {
			val = parseInt(this.outGammaSelect.options[j].value);
			if (showList[k] === cur) {
				curOK = true;
			}
			if (val === 9999 || val === showList[k]) {
				if (!first) {
					first = true;
					firstVal = j;
				}
				this.outGammaSelect.options[j].disabled = false;
				this.outGammaSelect.options[j].style.display = 'block';
				break;
			}
		}
	}
	if (!curOK) {
		if (first) {
			this.outGammaSelect.options[firstVal].selected = true;
			this.changeGammaOut();
			this.messages.gaSetParams();
		} else {
			console.log('Missing options');
		}
	}
};
LUTGammaBox.prototype.updateGamutInList = function(setParams) {
	var sub = this.inGamutSubs.selectedIndex;
	var showList = this.inputs.gamutInSubLists[sub];
	var m = this.inGamutSelect.options.length;
	var m2 = showList.length;
	var val;
	var cur = parseInt(this.inGamutSelect.options[this.inGamutSelect.selectedIndex].value);
	var curOK = false;
	var first = false;
	var firstVal;
	for (var j=0; j<m; j++) {
		this.inGamutSelect.options[j].disabled = true;
		this.inGamutSelect.options[j].style.display = 'none';
		for (var k=0; k<m2; k++) {
			val = parseInt(this.inGamutSelect.options[j].value);
			if (val === 9999 || val === showList[k]) {
				if (!first) {
					first = true;
					firstVal = j;
				}
				this.inGamutSelect.options[j].disabled = false;
				this.inGamutSelect.options[j].style.display = 'block';
				break;
			}
			if (showList[k] === cur) {
				curOK = true;
			}
		}
	}
	if (!curOK) {
		if (first) {
			this.inGamutSelect.options[firstVal].selected = true;
			this.changeInGamut();
			if (setParams) {
				this.messages.gtSetParams();
			}
		} else {
			console.log('Missing options');
		}
	}
};
LUTGammaBox.prototype.updateGamutOutList = function() {
	var sub = this.outGamutSubs.selectedIndex;
	var showList = this.inputs.gamutOutSubLists[sub];
	var m = this.outGamutSelect.options.length;
	var m2 = showList.length;
	var val;
	var cur = parseInt(this.outGamutSelect.options[this.outGamutSelect.selectedIndex].value);
	var curOK = false;
	var first = false;
	var firstVal;
	for (var j=0; j<m; j++) {
		this.outGamutSelect.options[j].disabled = true;
		this.outGamutSelect.options[j].style.display = 'none';
		for (var k=0; k<m2; k++) {
			val = parseInt(this.outGamutSelect.options[j].value);
			if (val === 9999 || val === showList[k]) {
				if (!first) {
					first = true;
					firstVal = j;
				}
				this.outGamutSelect.options[j].disabled = false;
				this.outGamutSelect.options[j].style.display = 'block';
				break;
			}
			if (showList[k] === cur) {
				curOK = true;
			}
		}
	}
	if (!curOK) {
		if (first) {
			this.outGamutSelect.options[firstVal].selected = true;
			this.changeOutGamut();
			this.messages.gtSetParams();
		} else {
			console.log('Missing options');
		}
	}
};
LUTGammaBox.prototype.changeInGamut = function() {
	if (this.inGamutSelect.options[this.inGamutSelect.options.length - 1].selected) {
		var max = this.outGamutSelect.options.length;
		for (var i=0; i<max; i++) {
			if (parseInt(this.outGamutSelect.options[i].value) === this.gamutPass) {
				this.outGamutSelect.options[i].selected = true;
				break;
			}
		}
	} else if (parseInt(this.outGamutSelect.options[this.outGamutSelect.options.selectedIndex].value) === this.gamutPass) {
		this.outGamutSelect.options[0].selected = true;
	}
	this.messages.changeGamut();
};
LUTGammaBox.prototype.changeOutGamut = function() {
	if (parseInt(this.outGamutSelect.options[this.outGamutSelect.options.selectedIndex].value) === this.gamutPass) {
		this.inGamutSelect.options[this.inGamutSelect.options.length - 1].selected = true;
	} else if (this.inGamutSelect.options[this.inGamutSelect.options.length - 1].selected) {
		var max = this.inGamutSelect.options.length;
		var defGamut = this.inputs.defGamutIn;
		for (var i = 0; i < max; i++) {
			if (defGamut === this.inGamutSelect.options[i].lastChild.nodeValue) {
				this.inGamutSelect.options[i].selected = true;
				break;
			}
		}
	}
	this.messages.changeGamut();
};
LUTGammaBox.prototype.oneOrThree = function() {
	if (this.inputs.d[0].checked) {
		this.inGamutBox.style.display = 'none';
		this.outGamutBox.style.display = 'none';
	} else {
		this.inGamutBox.style.display = 'block';
		this.outGamutBox.style.display = 'block';
	}
	if (typeof this.inGammaSelect.options[this.inGammaSelect.options.selectedIndex] !== 'undefined') {
		this.changeGammaIn();
	}
};
LUTGammaBox.prototype.getInfo = function(info) {
	if (this.inGammaSelect.options[this.inGammaSelect.selectedIndex].value !== '9999') {
		info.inGammaName = this.inGammaSelect.options[this.inGammaSelect.selectedIndex].lastChild.nodeValue;
	} else {
		info.inGammaName = this.inLinSelect.options[this.inLinSelect.selectedIndex].lastChild.nodeValue;
	}
	if (this.outGammaSelect.options[this.outGammaSelect.selectedIndex].value !== '9999') {
		info.outGammaName = this.outGammaSelect.options[this.outGammaSelect.selectedIndex].lastChild.nodeValue;
	} else {
		info.outGammaName = this.outLinSelect.options[this.outLinSelect.selectedIndex].lastChild.nodeValue;
	}
	if (this.outGammaSelect.options[this.outGammaSelect.selectedIndex].lastChild.nodeValue === 'Null') {
		info.nul = true;
	} else {
		info.nul = false;
	}
	info.inGamutName = this.inGamutSelect.options[this.inGamutSelect.selectedIndex].lastChild.nodeValue;
	info.outGamutName = this.outGamutSelect.options[this.outGamutSelect.selectedIndex].lastChild.nodeValue;
};
LUTGammaBox.prototype.getSettings = function(data) {
	var inLin, outLin;
	var inLinHyphen = this.inLinSelect.options[this.inLinSelect.options.selectedIndex].lastChild.nodeValue.indexOf('-');
	if (inLinHyphen > 0) {
		inLin = this.inLinSelect.options[this.inLinSelect.options.selectedIndex].lastChild.nodeValue.substring(0, inLinHyphen - 1);
	} else {
		inLin = this.inLinSelect.options[this.inLinSelect.options.selectedIndex].lastChild.nodeValue;
	}
	var outLinHyphen = this.outLinSelect.options[this.outLinSelect.options.selectedIndex].lastChild.nodeValue.indexOf('-');
	if (outLinHyphen > 0) {
		outLin = this.outLinSelect.options[this.outLinSelect.options.selectedIndex].lastChild.nodeValue.substring(0, outLinHyphen - 1);
	} else {
		outLin = this.outLinSelect.options[this.outLinSelect.options.selectedIndex].lastChild.nodeValue;
	}
	data.gammaBox = {
		recGamma: this.inGammaSelect.options[this.inGammaSelect.options.selectedIndex].lastChild.nodeValue,
		recLinGamma: inLin,
		recGamut: this.inGamutSelect.options[this.inGamutSelect.options.selectedIndex].lastChild.nodeValue,
		outGamma: this.outGammaSelect.options[this.outGammaSelect.options.selectedIndex].lastChild.nodeValue,
		outLinGamma: outLin,
		outGamut: this.outGamutSelect.options[this.outGamutSelect.options.selectedIndex].lastChild.nodeValue
	};
};
LUTGammaBox.prototype.setSettings = function(settings) {
	if (typeof settings.gammaBox !== 'undefined') {
		var data = settings.gammaBox;
		if (typeof data.recGamma !== 'undefined') {
			var m = this.inGammaSelect.options.length;
			for (var j=0; j<m; j++) {
				if (this.inGammaSelect.options[j].lastChild.nodeValue === data.recGamma) {
					this.inGammaSelect.options[j].selected = true;
					break;
				}
			}
		}
		if (typeof data.recLinGamma !== 'undefined') {
			var m = this.inLinSelect.options.length;
			var inLinLen = data.recLinGamma.length;
			for (var j=0; j<m; j++) {
				if (this.inLinSelect.options[j].lastChild.nodeValue.substring(0, inLinLen) === data.recLinGamma) {
					this.inLinSelect.options[j].selected = true;
					break;
				}
			}
		}
		if (typeof data.recGamut !== 'undefined') {
			var m = this.inGamutSelect.options.length;
			for (var j=0; j<m; j++) {
				if (
					this.inGamutSelect.options[j].lastChild.nodeValue === data.recGamut ||
					(this.inGamutSelect.options[j].lastChild.nodeValue.substring(0,6) === 'Custom' && data.recGamut.substring(0,6) === 'Custom')
				) {
					this.inGamutSelect.options[j].selected = true;
					break;
				}
			}
			this.changeInGamut();
		}
		if (typeof data.outGamma !== 'undefined') {
			var m = this.outGammaSelect.options.length;
			for (var j=0; j<m; j++) {
				if (this.outGammaSelect.options[j].lastChild.nodeValue === data.outGamma) {
					this.outGammaSelect.options[j].selected = true;
					break;
				}
			}
		}
		if (typeof data.outLinGamma !== 'undefined') {
			var m = this.outLinSelect.options.length;
			var outLinLen = data.outLinGamma.length;
			for (var j=0; j<m; j++) {
				if (this.outLinSelect.options[j].lastChild.nodeValue.substring(0, outLinLen) === data.outLinGamma) {
					this.outLinSelect.options[j].selected = true;
					break;
				}
			}
		}
		if (typeof data.outGamut !== 'undefined') {
			var m = this.outGamutSelect.options.length;
			for (var j=0; j<m; j++) {
				if (
					this.outGamutSelect.options[j].lastChild.nodeValue === data.outGamut ||
					(this.outGamutSelect.options[j].lastChild.nodeValue.substring(0,6) === 'Custom' && data.outGamut.substring(0,6) === 'Custom')
				) {
					this.outGamutSelect.options[j].selected = true;
					break;
				}
			}
			this.changeOutGamut();
		}
		this.changeGammaIn();
		this.changeGammaOut();
	}
};
LUTGammaBox.prototype.getHeight = function() {
	return this.box.clientHeight;
};