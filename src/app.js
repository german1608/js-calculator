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

const fixNumber = (number, n) => {
  /*
    Description:
      Function that fix the number of decimals in a number

    Parameters:
      number: number to chop
      n: decimals quantity

    Return:
      The same number, but rounded up to n decimals
  */
  const m = Math.pow(10, n);
  return Math.round(m * number) / m;
}

// Operators of the calculator
const operators = ['+', '-', '×', '/'];
// Get all buttons of the calculator
const btns = _('.btn');
const prevCalc = _id('prev-calc');
const numberTyped = _id('number-typed');
// Final operation
let currNumber = "0";
let prevNumber = "0";
let lastOperation = "ac";

/************************/
/*      Main Script     */
/************************/

// Let's listen for click events
btns.forEach(button => button.addEventListener('click', (e) => {
  
  const key = button.dataset.key;
  button.classList.add('active');
  // Check if it's a number.
  if (parseInt(key) || key == 0 || key === '.') {
    // Max number size
    if (currNumber.length === 10) {
      return;
    }
    
    // This is for avoid typing 0000...
    if (currNumber === '0' && key == 0) return;

    // To avoid 1.111.11.
    if (/\./.test(currNumber) && key === '.') return;

    // If the key pressed was a . and the current number is a 0, just add it.
    if (currNumber === '0' && key === '.') currNumber += '.';
    else {
      currNumber = currNumber === '0' 
               || ( (currNumber.length === 1) && linearSearch(currNumber, operators)) 
               ? key : currNumber + key;
    }
    if (numberTyped.className === "small" && currNumber.length < 9) {
      numberTyped.classList.remove('small');
    } else if (!numberTyped.className && currNumber.length >= 8) {
      numberTyped.classList.add('small');
    }
    numberTyped.innerText = currNumber;

  } else { // It's a symbol

    const lastLetter = prevNumber[prevNumber.length - 1];
    switch(key) {
      // These cases are straightforward
      case "c": 
        currNumber = "0";
        numberTyped.innerText = currNumber;
        if (numberTyped.className === "small") {
          numberTyped.classList.remove("small");
        }
        break;
      case "ac":
        if (numberTyped.className === "small") {
          numberTyped.classList.remove("small");
        }

        currNumber = "0";
        prevNumber = "0";
        numberTyped.innerText = currNumber;
        prevCalc.innerText = prevNumber;
        break;

      // Check for operation, all of them are the same case.
      case "+":
      case "/":
      case "-":
      case "×":
        if (lastOperation === "=") {
          prevNumber += key;
          prevCalc.innerText = prevNumber;
        }
        // If the user already typed an operator.
        else if (linearSearch(lastLetter, operators)) {
          if (currNumber === "0") return;
          prevNumber = JSON.stringify(fixNumber(eval((prevNumber + currNumber).replace(/×/, "*")), 3));
          prevCalc.innerText = prevNumber + key;
          currNumber = "0";
          numberTyped.innerText = prevNumber;
          prevNumber += key;
        }

        else if (currNumber === "0" || currNumber === "0.") {
        } else {
        prevNumber = currNumber + key;
        currNumber = "0";
        prevCalc.innerText = prevNumber;
        numberTyped.innerText = currNumber;
        }
        break;


      case "=":
        // This is to avoid errors later and to show it better to the user.
        if (lastLetter === '.') {
          currNumber += "0";
        }
        // There's an operation in process.
        else if (linearSearch(lastLetter, operators)) {

          /* The following line does this:
            * replaces × for a *
            * them eval() the expression
            * finally just takes the 3 last decimal digits.
          */
          prevNumber = JSON.stringify(fixNumber(eval((prevNumber + currNumber).replace(/×/, "*")), 3));
          prevCalc.innerText = prevNumber;
          currNumber = "0";
          numberTyped.innerText = prevNumber;

        } else { // If it's just pressing = without making a real operation.

          prevNumber = currNumber;
          prevCalc.innerText = currNumber;
          numberTyped.innerText = "0";
          currNumber = "0";
        }
        break;
      default:
        break
    }
    lastOperation = key;
  }
  console.log(`prevNumber: ${prevNumber}, currNumber: ${currNumber}, lastOperation: ${lastOperation}, key: ${key}`);
}));

btns.forEach(button => button.addEventListener('transitionend', (e) => {
  if (e.propertyName !== "background-color") return;
  button.classList.remove('active');
}));