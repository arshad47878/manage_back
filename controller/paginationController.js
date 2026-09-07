import userModel from "../model/registration.js";

const getTotalData = async (req, res)=>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;
        const userData = await userModel.find().skip(skip).limit(limit);

        const totalData = await userModel.countDocuments();
        const totalPages = Math.ceil(totalData/limit);
        res.status(200).json({
            success : true,
            page,
            limit,
            skip,
            userData,
            totalData,
            totalPages,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export default getTotalData;