
const bcrypt = require('bcrypt');


module.exports = {
  create: async function (req, res) {
    const { fullName, phoneNumber, address, email, username, password , role } = req.body;

    try {
     
      const existingAuth = await Auth.findOne({ email });
      if (existingAuth) {
        return res.status(422).json({ message: "Email đã tồn tại rồi" });
      }

  
      const existingUsername = await Auth.findOne({ username });
      if (existingUsername) {
        return res.status(422).json({ message: "Username đã tồn tại" });
      }

      const hashedPassword = await bcrypt.hash(password, 10); 

  
      const newAuth = await Auth.create({
        email,
        username,
        password: hashedPassword, 
        role,
        isActive: true
      }).fetch();

    
      const newUser = await User.create({
        fullName,
        phoneNumber,
        address,
        auth: newAuth.id
      }).fetch();

      return res.json({ user: newUser, auth: newAuth });
      

    } catch (error) {
      console.error('Error in createUserWithAuth:', error);
      return res.serverError(error);
    }
  }  
};
