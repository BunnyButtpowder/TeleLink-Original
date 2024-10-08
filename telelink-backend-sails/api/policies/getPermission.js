

module.exports = async function (req, res, next) {
    let action, module, user
    if( req.param("action") && req.param("module")){
        action = req.param("action")
        module = req.param("module")
        user = req.user
        

        const existingUser = await Auth.findOne({id: user.id})
        if(!existingUser){
            return res.unauthorized("Người dùng đăng nhập không tồn tại")
        }

        const action_id = await Action.findOne({action})
        const module_id = await Module.findOne({module})
        if(!action_id || !module_id){
            return res.unauthorized({message: "Không có quyền truy cập"})
        }


        const permission = await Permission.findOne({role_id: existingUser.role, action: action_id.id, module: module_id.id})
        
        if(!permission){
            return res.unauthorized({message: "Không có quyền truy cập"})
        }
        next()
    }
    else return res.unauthorized({ message: "Không có quyền truy cập" })
  };
  