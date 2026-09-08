import userModel from "../model/registration.js";

const getTotalData = async (req, res) => {
    try {
        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        // Optional search
        const search = req.query.search || "";

        // Optional filters
        const name = req.query.name || "";
        const email = req.query.email || "";

        // MongoDB query
        const query = {};

        // Search name OR email
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Name filter
        if (name) {
            query.name = {
                $regex: name,
                $options: "i"
            };
        }

        // Email filter
        if (email) {
            query.email = {
                $regex: email,
                $options: "i"
            };
        }

        // Get data
        const userData = await userModel.find(query).skip(skip).limit(limit);

        // Count filtered data
        const totalData = await userModel.countDocuments(query);

        // Total pages
        const totalPages = Math.ceil(totalData / limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            skip,
            search,
            filters: {
                name,
                email
            },
            userData,
            totalData,
            totalPages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default getTotalData;
