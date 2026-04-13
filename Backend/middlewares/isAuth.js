import jwt from 'jsonwebtoken'
const isAuth =async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).res.json({ success:false,messsage:"Token not found"})
        }
        const verifyToken= await jwt.verify(token,process.env.JWT_SECRET)
        req.userId=verifyToken.userId;
        next();
    }
    catch (err) {
        return res.status(500).res.json({ success:false,messsage:"Unauthorized"})

    }

}
export default isAuth