import Admin from '../models/admin.model.js';

const isAdmin = async (req, res, next) => {
    try {
        // Assuming req.userId is set by isAuth middleware
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" });
        }

        const admin = await Admin.findById(req.userId);
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ success: false, message: "Forbidden: Not an admin" });
        }

        next();
    } catch (error) {
        console.error("isAdmin middleware error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default isAdmin;