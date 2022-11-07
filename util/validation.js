function isEmpty(value){
    return !value || value.trim()=='';
}

function userCredentialsAreValid(email,password){
    return email && email.includes('@') && password && password.trim().length >= 6;
}

function userDetailsAreValid(email,password,fullname,city,address,pincode){
    return(
        userCredentialsAreValid(email,password) && !isEmpty(fullname) && !isEmpty(city) && !isEmpty(address) && !isEmpty(pincode) 
    );
}

function emailIsConfirmed(email,confirmEmail){
    return email===confirmEmail;
}

module.exports ={ 
    userDetailsAreValid:userDetailsAreValid,
    emailIsConfirmed:emailIsConfirmed
}; 