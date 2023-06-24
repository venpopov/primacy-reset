//this is a collection to provide basic calculations with numeric arrays in javascript.
//It is exported as an object which includes all functions on this topic as it's methods.
//If you want to use it a function of it you just need to write 'arrayMath.functionname'.
window.arrayMath = {

	//get the min out of a numeric array;
	minArray: function(array){
		//check if all elements of the array are numeric
		if(array.some(element => typeof element !== 'number')){
			return console.error('Not all elements of the array are numeric')
		}
		else {
			//specify the reduce function:
			function getMin(accumulator, currentValue){
				return Math.min(accumulator, currentValue);
			}
			//compute the reduced value
			return array.reduce(getMin);
		}
	},


	//get the max out of a numeric array
	maxArray: function(array){
		//check if all elements of the array are numeric
		if(array.some(element => typeof element !== 'number')){
			return console.error('Not all elements of the array are numeric')
		}
		else {
			//specify the reduce function:
			function getMax(accumulator, currentValue){
				return Math.max(accumulator, currentValue);
			}
			//compute the reduced value
			return array.reduce(getMax);
		}
	},


	//compute the sum of a numeric array
	sumArray: function(array){
		//check if all elements of the array are numeric
		if(array.some(element => typeof element !== 'number')){
			return console.error('Not all elements of the array are numeric')
		}
		else {
			//specify the reduce function:
			function getSum(accumulator, currentValue){
				return accumulator + currentValue;
			}
			//compute the reduced value
			return array.reduce(getSum);
		}
	},


	//compute the diff of a numeric array
	diffArray: function(array){
		//check if all elements of the array are numeric
		if(array.some(element => typeof element !== 'number')){
			return console.error('Not all elements of the array are numeric')
		}
		else {
			//specify the reduce function:
			function getDiff(accumulator, currentValue){
				return accumulator - currentValue;
			}
			//compute the reduced value
			return array.reduce(getDiff);
		}
	},


	//get the mean of a numeric Array
	meanArray: function(array){
		//check if all elements of the array are numeric
		if(array.some(element => typeof element !== 'number')){
			return console.error('Not all elements of the array are numeric')
		}
		else {
			return this.sumArray(array)/array.length;
		}
	},


	//get the variance of a numeric Array
	varArray: function (array, populationLevel = true){
		//check if all elements of the array are numeric
		if(array.some(element => typeof element !== 'number')){
			return console.error('Not all elements of the array are numeric')
		}
		else {
			const mean = this.meanArray(array);
			const SumSquares = this.sumArray(array.map(element => (element-mean)**2));
		
			if(populationLevel){
				return SumSquares/(array.length);
			} 
			else {
				return SumSquares/(array.length-1);
			}
		}
	},


	//get the standard deviation of a numeric Array
	sdArray: function (array, populationLevel = true){
		//check if all elements of the array are numeric
		if(array.some(element => typeof element !== 'number')){
			return console.error('Not all elements of the array are numeric')
		}
		else {
			if(populationLevel){
				return Math.sqrt(this.varArray(array, populationLevel = true));
			}
			else {
				return Math.sqrt(this.varArray(array, populationLevel = false));
			}
		}
	},


	//subtract two arrays valuevise
	subArrays: function(array1, array2){
		if(array1.some(element => typeof element !== 'number') ||
		array2.some(element => typeof element !== 'number')){
			return console.error('At least one array contains non numeric values')
		}
		else{
			let subArray = [];
			for(let i = 0; i < array1.length; i++){
				subArray[i] = array1[i] - array2[i];
			}
			return subArray;
		}
	},


	//add two array valuevise
	addArrays: function(array1, array2){
		if(array1.some(element => typeof element !== 'number') ||
		array2.some(element => typeof element !== 'number')){
			return console.error('At least one array contains non numeric values')
		}
		else{
			let addedArray = [];
			for(let i = 0; i < array1.length; i++){
				addedArray[i] = array1[i] + array2[i];
			}
			return addedArray;
		}
	},


	//devide array into chunks of a given size
	chunkArray: function(array, chunk_size) {
		if(array.length % chunk_size !== 0){
			return console.error('cannot chunk this array by the given chunk-size. Please make sure that the array-length is a multiple of the chunk-size.')
		}
		else{
			let chunked_array = []; 
			let counter = 0;
			while (counter < array.length) {
		  		chunked_array.push(array.slice(counter, counter += chunk_size));
			}
				return chunked_array;
		}
	},
};