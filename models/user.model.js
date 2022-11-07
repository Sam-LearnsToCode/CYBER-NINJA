const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const db = require('../data/database'); 

class User{
    constructor(email,password,fullname,city,address,pincode){
        this.email=email;
        this.password=password;
        this.name=fullname;
        this.location={
            city:city,
            address:address,
            pincode:pincode
        };
    }

    setEmailPass(email,password){
        this.email=email;
        this.password=password;
    }

    
async createHash(pass){
    return await bcrypt.hash(this.password , 10).then(function(hashedPassword){
        
        return hashedPassword;
    });

}

static  findById(userId){
    const uid = new mongodb.ObjectId(userId);

    return db.getDb().collection('users').findOne({_id: uid},{ projection: {passsword: 0}});
}

getUserWithSameEmail(){
   return  db.getDb().collection('users').findOne({email:this.email})
}

async existsAlready(){
  const existingUser = await  this.getUserWithSameEmail();
  if(existingUser){
    return true;
  }
  return false;
}

async signup(){
    const hashedPassword=await this.createHash(this.password);
    // console.log("Pass "+hashedPassword);
    await db.getDb().collection('users').insertOne({
        email:this.email,
        password:hashedPassword,
        // passwordOrig:this.password,
        //password:this.password,
        name:this.name,
        location:this.location
    });
}

comparePassword(hashedPassword){
    return bcrypt.compare(this.password,hashedPassword)
}
}

module.exports = User;