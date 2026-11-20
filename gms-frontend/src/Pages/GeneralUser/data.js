import axios from "axios";

const API_BASE = "http://localhost:4000/members";

const getMonthlyJoined = async () => {
    try {
        const response = await axios.get(`${API_BASE}/monthly-member`, { withCredentials: true });
        return response.data;
    } catch (err) {
        console.error("Error fetching monthly joined:", err);
        return { members: [], totalMembers: 0 };
    }
};

const threeDayExpire = async () => {
    try {
        const response = await axios.get(`${API_BASE}/expiring-within-3-days`, { withCredentials: true });
        return response.data;
    } catch (err) {
        console.error("Error fetching expiring in 3 days:", err);
        return { members: [], totalMembers: 0 };
    }
};

const fourToSevenDaysExpire = async () => {
    try {
        const response = await axios.get(`${API_BASE}/expiring-within-4-7-days`, { withCredentials: true });
        return response.data;
    } catch (err) {
        console.error("Error fetching expiring in 4-7 days:", err);
        return { members: [], totalMembers: 0 };
    }
};

const expired = async () => {
    try {
        const response = await axios.get(`${API_BASE}/expired-member`, { withCredentials: true });
        return response.data;
    } catch (err) {
        console.error("Error fetching expired members:", err);
        return { members: [], totalMembers: 0 };
    }
};

const inActiveMembers = async () => {
    try {
        const response = await axios.get(`${API_BASE}/inactive-member`, { withCredentials: true });
        return response.data;
    } catch (err) {
        console.error("Error fetching inactive members:", err);
        return { members: [], totalMembers: 0 };
    }
};

export { getMonthlyJoined, threeDayExpire, fourToSevenDaysExpire, expired, inActiveMembers };
