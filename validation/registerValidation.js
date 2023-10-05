const Validator = require('validator');
const isEmpty = require("./isEmpty");
const { default: isFQDN } = require('validator/lib/isFQDN');

const validateRegisterInput = (data) => {
    let errors = {};
    let isFieldUndefined = false;

    if(data.email == undefined){
        errors.email= "provide email";
        isFieldUndefined = true;
    }
    if(data.password == undefined){
        errors.password= "provide password";
        isFieldUndefined = true;
    }
    if(data.confirmPassword == undefined){
        errors.confirmPassword= "provide confirmed password";
        isFieldUndefined = true;
    }
    if(data.name == undefined){
        errors.name= "provide name";
        isFieldUndefined = true;
    }

    if(isFieldUndefined){
        return {
            errors,
            isValid: isEmpty(errors),
        }
    }


    // check email 
    if(isEmpty(data.email)){
        errors.email =  "Email cannot be empty";
    }
    else if (!Validator.isEmail(data.email)){
        errors.email = "Email is not valid";
    }

    //check password
    if(isEmpty(data.password)){
        errors.password = "password cannot be empty";
    }
    else if(!Validator.isLength(data.password, {min: 6, max: 150})){
        errors.password = "password must be between 6-150 chars";
    }

    //check confirm password
    if(isEmpty(data.confirmPassword)){
        errors.confirmPassword = "confirm password cannot be empty";
    }
    else if(!Validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = "passwords does not match";
    }

    //check name
    if(isEmpty(data.name)){
        errors.name = "name cannot be empty";
    }
    else if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = "name must be between 2-30 chars";
    }

    const isValid = isEmpty(errors);
    
    return {
        errors,
        isValid
    };
}

module.exports = validateRegisterInput;