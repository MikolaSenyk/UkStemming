// Change log
// 05.08.2014 - 2076/2116, accuracy 98.109%

// Constants
var MIN_WORD_LENGTH = 2;

// Rule type names
var TRIM_END_TYPE = "TrimEnd";
var PERM_END_TYPE = "PermEnd";
var VAR_END_TYPE = "VarEnd";
var INVAR_WORD_TYPE = "InvarWord";
var VAR_WORD_TYPE = "VarWord";

var TYPES_PRIORITY = {};
TYPES_PRIORITY[TRIM_END_TYPE] = 1;
TYPES_PRIORITY[PERM_END_TYPE] = 2;
TYPES_PRIORITY[VAR_END_TYPE] = 3;
TYPES_PRIORITY[INVAR_WORD_TYPE] = 4;
TYPES_PRIORITY[VAR_WORD_TYPE] = 4;


UkStemmer = function() {
	var rules = [
		// permanent endings
		{type: PERM_END_TYPE, value: "ер"},
		{type: PERM_END_TYPE, value: "ск"},
		// variable endings
		{type: VAR_END_TYPE, value: "аче", replace: "ак"},
		{type: VAR_END_TYPE, value: "іче", replace: "ік"},
		{type: VAR_END_TYPE, value: "йовував", replace: "йов"},
		{type: VAR_END_TYPE, value: "йовувала", replace: "йов"},
		{type: VAR_END_TYPE, value: "йовувати", replace: "йов"},
		{type: VAR_END_TYPE, value: "ьовував", replace: "ьов"},
		{type: VAR_END_TYPE, value: "ьовувала", replace: "ьов"},
		{type: VAR_END_TYPE, value: "ьовувати", replace: "ьов"},
		{type: VAR_END_TYPE, value: "цьовував", replace: "ц"},
		{type: VAR_END_TYPE, value: "цьовувала", replace: "ц"},
		{type: VAR_END_TYPE, value: "цьовувати", replace: "ц"},
		{type: VAR_END_TYPE, value: "ядер", replace: "ядр"},
		// invariable words
		{type: INVAR_WORD_TYPE, value: "баядер"},
		{type: INVAR_WORD_TYPE, value: "беатріче"},
		{type: INVAR_WORD_TYPE, value: "віче"},
		{type: INVAR_WORD_TYPE, value: "наче"},
		{type: INVAR_WORD_TYPE, value: "неначе"},
		{type: INVAR_WORD_TYPE, value: "одначе"},
		{type: INVAR_WORD_TYPE, value: "паче"},
		// variable words
		{type: VAR_WORD_TYPE, value: "відер", replace: "відр"},
		{type: VAR_WORD_TYPE, value: "був", replace: "бува"}
	];
	this.rules = rules;
	// append trim endings	
	var spaceSeparatedTrimEnds = ""
		+ "а ам ами ах та "
		+ "в вав вавсь вався вала валась валася вали вались валися вало валось валося вати ватись ватися всь вся "
		+ "е еві ем ею "
		+ "є ємо ємось ємося ється єте єтесь єтеся єш єшся єю "
		+ "и ив ий ила или ило илося им ими имо имось имося ите итесь итеся ити ить иться их иш ишся "
		+ "й ймо ймось ймося йсь йся йте йтесь йтеся "
		+ "і ів ій ім імо ість істю іть "
		+ "ї "
		+ "ла лась лася ло лось лося ли лись лися "
		+ "о ові овував овувала овувати ого ої ок ом ому осте ості очка очкам очками очках очки очків очкові очком очку очок ою "
		+ "ти тись тися "
		+ "у ував увала увати "
		+ "ь "
		+ "ці "
		+ "ю юст юсь юся ють ються "
		+ "я ям ями ях"
	;
	spaceSeparatedTrimEnds.split(/\s+/).forEach(function(e) {
		rules.push({type: TRIM_END_TYPE, value: e});
	});
	console.log(rules.length);

	// do correct rule order
	rules.sort(function(a, b) {
		if ( a.type != b.type ) {
			var aPrior = TYPES_PRIORITY[a.type];
			var bPrior = TYPES_PRIORITY[b.type];
			if ( aPrior < bPrior ) return 1;
			else if ( aPrior > bPrior ) return -1;
		}
		// equal types or same priority (default by length of value)
		if ( a.value.length < b.value.length ) return 1;
		else if ( a.value.length > b.value.length ) return -1;
		return 0;
	});

	rules.forEach(function(e, i) {
		//console.log(i + ". " + e.value);
	});
};

UkStemmer.prototype.stemm = function(word) {
	// TODO normalize word (to lower-case, change stressed vowels)

	var stemForm = word;
	this.rules.some(function(rule) {
		if ( rule.type == TRIM_END_TYPE ) {
			var re = new RegExp(rule.value + "$");
			if ( word.match(re) ) {
				stemForm = word.substring(0, word.length-rule.value.length);
				if ( stemForm.length > MIN_WORD_LENGTH ) return true;
			}
		} else if ( rule.type == PERM_END_TYPE ) {
			var re = new RegExp(rule.value + "$");
			if ( word.match(re) ) {
				stemForm = word;
				return true;
			}
		} else if ( rule.type == VAR_END_TYPE ) {
			var re = new RegExp(rule.value + "$");
			if ( word.match(re) ) {
				stemForm = word.substring(0, word.length-rule.value.length) + rule.replace;
				return true;
			}
		} else if ( rule.type == INVAR_WORD_TYPE ) {
			if ( rule.value == word ) {
				stemForm = word;
				return true;
			}
		} else if ( rule.type == VAR_WORD_TYPE ) {
			if ( rule.value == word ) {
				stemForm = rule.replace;
				return true;
			}
		} else {
			throw "Unsupported type of rule: " + rule.type;
		}
	});
	return stemForm;
};