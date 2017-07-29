"use strict";
/* JUST ES6!!!! */
const css = require('./style.css');


/*************************/
/* Constants, functions  */
/*      and globals      */
/*************************/

const _ = (selector) => {
  /*
  Description: Function that returns all elements that match with a CSS selector

  Parameters:
    selector: A css selector in a string.

  Return:
    A NodeList containing all matched elements matched elements, if any.
  */
  return document.querySelectorAll(selector);
};

const _id = (id) => {
  /*
  Description: Function that returns a single element by it's id

  Parameters:
    id: id of the element, as a string.

  Return:
    A sinble DOM element.
  */
  return document.getElementById(id);
}

const linearSearch = (item, arr) => {
  /*
  Description:
    Function that determinates if an item exists in an array

  Parameters:
    item: item to search
    arr: Array to search in
  
  Return:
    true if the element exists in the array. false otherwise.*/
  for (let i = 0; i < arr.length; i++ ) {
    if (arr[i] === item) return true;
  }
  return false;
}

// Operators of the calculator
const operators = ['plus', 'diff', 'mult', 'div'];
const symbols = {
  plus: '+',
  diff: '-',
  mult: 'x', // This will be mapped with a regex
  div: '/'
}
// Get all buttons of the calculator
const btns = _('.btn');

// Final operation
let currNumber = "0";
let prevNumber = "";
let inOperation = false;

/************************/
/*      Main Script     */
/************************/

// Let's listen for click events
btns.forEach(button => button.addEventListener('click', (e) => {
  
  const key = button.dataset.key;
  
  // Check if it's a number.
  if (parseInt(key) || key == 0) {
    console.log(key, currNumber);
    // Max number size
    if (currNumber.length === 8) {
      return;
    }
    
    // Check if it's empty and the user puts a 0. This is for avoid typing 0000...
    if (!currNumber.length && key == 0) return;

    currNumber = currNumber === '0' 
               || ( (currNumber.length === 1) && linearSearch(currNumber, operators)) 
               ? key : currNumber + key;
    _id('number-typed').innerText = currNumber;

  } else { // It's a symbol
    const lastLetter = currNumber[currNumber.length - 1];
    console.log(key, lastLetter);
    switch(key) {
      case "plus":
      case "div":
      case "diff":
      case "mult":
        if (lastLetter === key) {
          return;
        } else if (!linearSearch(lastLetter, operators)) {
          currNumber += key;
          _id('prev-calc').innerText = currNumber;
          _id('number-typed').innerText = key;
          inOperation = true;
        }
        console.log('holi');
      case "equal":
        if (linearSearch(lastLetter, operators)) {
          console.log('idc');
        } else {
          _id('prev-calc').innerText = currNumber;
          _id('number-typed').innerText = "0";
          currNumber = "0";
        }
      default:
        break
    }
  }
}));

// // Let's listen for keydown events but just when they are numbers.
// document.addEventListener('keydown', (e) => {
//   if ((48 <= e.keyCode && e.keyCode <= 57) || (96 <= e.keyCode && e.keyCode <= 105)) {
//     console.log(e.keyCode);
//     // Max number size
//     if (currNumber.length === 9) {
//       return;
//     }
//     // Check if it's empty and the user puts a 0. This is for avoid typing 0000...
//     if (!currNumber.length && e.key == 0) return;
//     currNumber += e.key;
//     _id('number-typed').innerText = currNumber;
//   }
// }); 
