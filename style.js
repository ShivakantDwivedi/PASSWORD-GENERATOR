const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'; 

let password ="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength circle to grey
setIndicator("#ccc");

// it only used to reflect the password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    // or kuch bhi krna chahiye?
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    // shadow
    indicator.style.boxShadow='0px 0px 12px  1px ${color}';
}

// for finding the random integer
function getRndInteger(max,min){
    return Math.floor(Math.random() * (max-min)) + min;
}
 
function generateRandomNumber(){
    return getRndInteger(0,9);
}


// find this by ASCII value and convert into string
function generteLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
 

function generteUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}


// find the symbol random in the symbol variable
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum ); 
}

// .checked property is used to verify is checked or not
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasNum  && passwordLength >= 6) {
      setIndicator("#FF0000"); // red weak password
    } else if ( 
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#0000FF"); // blue medium password
    } else {
      setIndicator("#FFFF00"); // yellow strong password
    }
} 
// make copyContent text  display
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    // to make copy wala span visible
    copyMsg.classList.add("active"); // generate active name class in css 

    // want to remove also 2sec time out 
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        // finding the j index
        const j = Math.floor(Math.random() * (i + 1));
        // swaping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });

    //special case
    if(passwordLength < checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// used to change the value of the slider
inputSlider.addEventListener('input' , (e) => {
    passwordLength=e.target.value; // whrn event occur show by e.target this is only indication
    handleSlider();
})

// if the password value is non empty then we call this function and copy this  
copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
    copyContent();
})


generateBtn.addEventListener('click', () =>{
    // none of the checkbox are selected

    if(checkCount == 0) return;

    if(passwordLength < checkCount) {
        passwordLength=checkCount;
        handleSlider();
    }

    //  start the code of generate password

    // remove old password
   // password="";

    // lets add the stuff mention by chheckboxes

    let funcArr=[];

    if(uppercaseCheck.checked)
    funcArr.push(generteUpperCase);

    if(lowercaseCheck.checked)
    funcArr.push(generteLowerCase);

    if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
    funcArr.push(generateSymbol); 

    // compalsary addition 
    for(let i=0; i<funcArr.length ; i++)
    {
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length;i++)
    {
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex](); 
    }


    console.log("Remaining adddition done");

    // shuffle the password so that it will mix.
    password = shufflePassword(Array.from(password));

    console.log("Remaining adddition done1");


    passwordDisplay.value=password;

    console.log("Remaining adddition done");
    
    //calculate strength
    calcStrength();

})










  
