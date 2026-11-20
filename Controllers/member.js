const Member = require('../Modals/member');
const Membership = require('../Modals/membership');

function addMonthsToDate(months, joiningDate) {
    const today = new Date(joiningDate);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const futureMonth = currentMonth + months;
    const futureYear = currentYear + Math.floor(futureMonth / 12);
    const adjustedMonth = futureMonth % 12;

    const lastDayOfFutureMonth = new Date(futureYear, adjustedMonth + 1, 0).getDate();
    const adjustedDay = Math.min(currentDay, lastDayOfFutureMonth);

    return new Date(futureYear, adjustedMonth, adjustedDay);
}

exports.getAllMember = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 9;

        const totalMember = await Member.countDocuments({ gym: req.gym._id });
        const members = await Member.find({ gym: req.gym._id })
            .populate('membership')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Members fetched successfully",
            members,
            totalMembers: totalMember,
            totalMember
        });
    } catch (err) {
        console.error("Get All Member Error:", err);
        res.status(500).json({ error: 'Server error while fetching members' });
    }
};

exports.registerMember = async (req, res) => {
    try {
        const { name, mobileNo, address, membership, profilePic, joiningDate } = req.body;

        if (!name || !mobileNo || !membership) {
            return res.status(400).json({ error: 'Name, mobile number, and membership plan are required' });
        }

        const existingMember = await Member.findOne({ gym: req.gym._id, mobileNo });
        if (existingMember) {
            return res.status(409).json({ error: 'A member is already registered with this mobile number' });
        }

        const memberShip = await Membership.findOne({ _id: membership, gym: req.gym._id });
        if (!memberShip) {
            return res.status(404).json({ error: 'Selected membership plan does not exist' });
        }

        const jDate = joiningDate ? new Date(joiningDate) : new Date();
        const nextBillDate = addMonthsToDate(memberShip.months, jDate);
        const defaultPic = profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop";

        const newMember = new Member({
            name,
            mobileNo,
            address: address || "",
            membership: memberShip._id,
            gym: req.gym._id,
            profilePic: defaultPic,
            status: "Active",
            lastPayment: jDate,
            nextBillDate
        });

        await newMember.save();

        res.status(201).json({
            message: "Member registered successfully",
            member: newMember
        });

    } catch (err) {
        console.error("Register Member Error:", err);
        res.status(500).json({ error: 'Server error while registering member' });
    }
};

exports.searchMember = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm || "";
        const regex = new RegExp(searchTerm.trim(), 'i');

        const members = await Member.find({
            gym: req.gym._id,
            $or: [
                { name: regex },
                { mobileNo: regex },
                { address: regex }
            ]
        }).populate('membership').sort({ createdAt: -1 });

        res.status(200).json({
            message: "Search completed",
            members,
            totalMembers: members.length
        });

    } catch (err) {
        console.error("Search Member Error:", err);
        res.status(500).json({ error: 'Server error while searching members' });
    }
};

exports.monthlyMember = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const members = await Member.find({
            gym: req.gym._id,
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).populate('membership').sort({ createdAt: -1 });

        res.status(200).json({
            message: members.length ? "Fetched monthly joined members" : "No members joined this month yet",
            members,
            totalMembers: members.length
        });

    } catch (err) {
        console.error("Monthly Member Error:", err);
        res.status(500).json({ error: 'Server error while fetching monthly members' });
    }
};

exports.expiringWithin3Days = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next3Days = new Date(today);
        next3Days.setDate(today.getDate() + 3);
        next3Days.setHours(23, 59, 59, 999);

        const members = await Member.find({
            gym: req.gym._id,
            status: "Active",
            nextBillDate: { $gte: today, $lte: next3Days }
        }).populate('membership').sort({ nextBillDate: 1 });

        res.status(200).json({
            message: "Fetched members expiring within 3 days",
            members,
            totalMembers: members.length
        });

    } catch (err) {
        console.error("Expiring Within 3 Days Error:", err);
        res.status(500).json({ error: 'Server error while fetching expiring members' });
    }
};

exports.expiringWithIn4To7Days = async (req, res) => {
    try {
        const today = new Date();
        const start4Days = new Date(today);
        start4Days.setDate(today.getDate() + 4);
        start4Days.setHours(0, 0, 0, 0);

        const end7Days = new Date(today);
        end7Days.setDate(today.getDate() + 7);
        end7Days.setHours(23, 59, 59, 999);

        const members = await Member.find({
            gym: req.gym._id,
            status: "Active",
            nextBillDate: { $gte: start4Days, $lte: end7Days }
        }).populate('membership').sort({ nextBillDate: 1 });

        res.status(200).json({
            message: "Fetched members expiring in 4-7 days",
            members,
            totalMembers: members.length
        });

    } catch (err) {
        console.error("Expiring 4-7 Days Error:", err);
        res.status(500).json({ error: 'Server error while fetching expiring members' });
    }
};

exports.expiredMember = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const members = await Member.find({
            gym: req.gym._id,
            $or: [
                { nextBillDate: { $lt: today } },
                { status: "Expired" }
            ]
        }).populate('membership').sort({ nextBillDate: -1 });

        res.status(200).json({
            message: "Fetched expired members",
            members,
            totalMembers: members.length
        });

    } catch (err) {
        console.error("Expired Member Error:", err);
        res.status(500).json({ error: 'Server error while fetching expired members' });
    }
};

exports.inActiveMember = async (req, res) => {
    try {
        const members = await Member.find({
            gym: req.gym._id,
            status: "Inactive"
        }).populate('membership').sort({ updatedAt: -1 });

        res.status(200).json({
            message: "Fetched inactive members",
            members,
            totalMembers: members.length
        });

    } catch (err) {
        console.error("Inactive Member Error:", err);
        res.status(500).json({ error: 'Server error while fetching inactive members' });
    }
};

exports.getMemberDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findOne({ _id: id, gym: req.gym._id }).populate('membership');

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        res.status(200).json({
            message: "Member details retrieved successfully",
            member
        });

    } catch (err) {
        console.error("Get Member Details Error:", err);
        res.status(500).json({ error: 'Server error while fetching member details' });
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const member = await Member.findOne({ _id: id, gym: req.gym._id });
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        member.status = status;
        await member.save();

        res.status(200).json({
            message: "Status updated successfully",
            member
        });

    } catch (err) {
        console.error("Change Status Error:", err);
        res.status(500).json({ error: 'Server error while updating member status' });
    }
};

exports.updateMemberPlan = async (req, res) => {
    try {
        const { membership } = req.body;
        const { id } = req.params;

        const memberShip = await Membership.findOne({ gym: req.gym._id, _id: membership });
        if (!memberShip) {
            return res.status(404).json({ error: "Membership plan not found" });
        }

        const member = await Member.findOne({ gym: req.gym._id, _id: id });
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        const today = new Date();
        const baseDate = member.nextBillDate && new Date(member.nextBillDate) > today
            ? new Date(member.nextBillDate)
            : today;

        const nextBillDate = addMonthsToDate(memberShip.months, baseDate);

        member.membership = memberShip._id;
        member.nextBillDate = nextBillDate;
        member.lastPayment = today;
        member.status = "Active";

        await member.save();

        res.status(200).json({
            message: "Member plan renewed successfully",
            member
        });

    } catch (err) {
        console.error("Update Member Plan Error:", err);
        res.status(500).json({ error: 'Server error while renewing member plan' });
    }
};
