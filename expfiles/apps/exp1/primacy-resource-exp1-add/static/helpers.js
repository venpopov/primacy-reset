//this is a collection of little helper functions which may be usefull or just ease up the code for often used procedures.
//it is exported as a combined object, so you need to call it by 'helpers.functionname' or by whatever name you import it
window.helpers = {

	//create a random integer in a  specified area
	randomNumber: function(start = 0, end = 1){
		return Math.floor(Math.random()*(end-start+1)) + start;
	},

	//create an array of numbers with specified steps in a specific range
	sequence: function(from, to, by = 1){
		let array = [];
		for(let i = from; i <= to; i = i+by){
			array.push(i);
		}
		return array;
	},

	//create array by repeating the same element n times
	rep: function(element, n, flat = true){

		if(flat){
			new_array = new Array(n).fill(element).flat();
			return new_array;
		}

		if(!flat){
			new_array = new Array(n).fill(element);
			return new_array;
		}
	},

	remove: function(array, elements_to_remove){
		filtered_array = array.filter( (element) => !elements_to_remove.includes(element));
		return filtered_array;
	}
};