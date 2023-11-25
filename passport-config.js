const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")


function initialize(passport,getUserByEmail,getUserById){
    // function to authanticate users
    const authanticateUsers = async(email,password, done)=>{
        //get users by email
        const user = getUserByEmail(email)
        if(user == null){
            return done(null,false,{message:"No user found with that email"})
        } try {
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null,false,{message:"Password Incorrect"})
            }
        }catch(e){
            console.log(e);
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authanticateUsers))
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser((id,done)=>{
        return done(null,getUserById(id))
    })
}

module.exports = initialize