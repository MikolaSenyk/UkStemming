// Constants
var TRIM_END_TYPE = "TrimEnd";

UkStemmer = function() {
	var rules = new Array();
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
		if ( a.type == TRIM_END_TYPE && b.type == TRIM_END_TYPE ) {
			if ( a.value.length < b.value.length ) return 1;
			else if ( a.value.length > b.value.length ) return -1;
		}
		return 0;
	});

	rules.forEach(function(e, i) {
		//console.log(i + ". " + e.value);
	});
};

UkStemmer.prototype.stemm = function(word) {
	// TODO normalize word (to lower-case, change stressed vowels)

	this.rules.some(function(rule) {
		if ( rule.type == TRIM_END_TYPE ) {
			var re = new RegExp(rule.value + "$");
			if ( word.match(re) ) {
				console.log(word + " -> " + word.substring(0, word.length-rule.value.length));
				return true;
			}
		} else {
			throw new Exception("Unsupported type of rule: " + rule.type);
		}
	});
};