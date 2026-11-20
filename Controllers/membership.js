const Membership = require('../Modals/membership');

exports.addMembership = async (req, res) => {
    try {
        const { months, price } = req.body;
        if (!months || !price) {
            return res.status(400).json({ error: "Months and Price are required" });
        }

        const numMonths = Number(months);
        const numPrice = Number(price);

        const existingPlan = await Membership.findOne({ gym: req.gym._id, months: numMonths });
        if (existingPlan) {
            existingPlan.price = numPrice;
            await existingPlan.save();
            return res.status(200).json({
                message: "Membership plan updated successfully",
                membership: existingPlan
            });
        }

        const newMembership = new Membership({
            price: numPrice,
            months: numMonths,
            gym: req.gym._id
        });

        await newMembership.save();

        res.status(201).json({
            message: "Membership plan added successfully",
            membership: newMembership
        });

    } catch (err) {
        console.error("Add Membership Error:", err);
        res.status(500).json({ error: "Server Error adding membership plan" });
    }
};

exports.getmembership = async (req, res) => {
    try {
        const memberships = await Membership.find({ gym: req.gym._id }).sort({ months: 1 });
        res.status(200).json({
            message: "Fetched memberships successfully",
            memberships
        });
    } catch (err) {
        console.error("Get Membership Error:", err);
        res.status(500).json({ error: "Server Error fetching memberships" });
    }
};
