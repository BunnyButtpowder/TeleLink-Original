

module.exports = async function (req, res, next) {
    let user
    if(req.user){
        user = req.user
        const existingUser = await Auth.findOne({id: user.id})
        if(!existingUser){
            return res.unauthorized("Người dùng đăng nhập không tồn tại")
        }
        req.role = existingUser.role
        let {
            query,
            params,
            options,
            method
        } = req;
        console.log(query, params, options, method);
        

        next();
        
    }
    else return res.unauthorized({ message: "Không có quyền truy cập" })
  };
  