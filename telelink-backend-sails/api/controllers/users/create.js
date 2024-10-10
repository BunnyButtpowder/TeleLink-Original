const bcrypt = require('bcrypt');
module.exports = {
    inputs: {
        fullName : {type:'string', required: true},
        phoneNumber : { type:'string' , required: true },
        dob : {type:'string'},
        address :{type: 'string', require : true},
        email : { type : 'string' , require: true},
        username: {type : 'string' , require : true},
        password : { type : "string", require : true},
        role : {type : 'number', require: true},
        gender : {type : 'string', require : true },
    },
  
   
  
    fn: async function (inputs) {
      let { req ,res } = this;
      try {
        const { fullName, phoneNumber, dob, address, email, username, password , role , gender } = inputs;
        const existingEmail =await Auth.findOne({ email });
        if (existingEmail) {
            return res.conflict({ message: "Email đã tồn tại" });
        }
        const exitstingUsername = await Auth.findOne({ username });
        if (exitstingUsername) {
            return res.conflict({ message: "Username đã tồn tại" });
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
          dob,
          address,
          gender,
          auth: newAuth.id
        }).fetch();
        return res.status(201).json({ message: "Đăng ký thành công" , newUser });
      } catch (err) {
        sails.log.error('Error fetching users or auth info:', err);
        return res.serverError({ error: 'Có lỗi xảy ra khi lấy danh sách người dùng hoặc thông tin xác thực.'  });
      }
    },
  };
  