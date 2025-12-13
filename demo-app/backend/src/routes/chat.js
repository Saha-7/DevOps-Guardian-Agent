const express=require("express")

const chatRouter = express.Router()

chatRouter.post("/chat", async(req,res)=>{
    const{userId, targetUserId} = req.body

    // Basic validation (optional but helpful)
    if (!userId || !targetUserId) {
        return res.status(400).json({ error: "userId and targetUserId are required" });
    }

    try {
        
        const chat = {
            id: "dummy-chat-id-123",
            participants: [userId, targetUserId],
            lastMessage: "This is a dummy chat message.",
            createdAt: new Date()
        };

        
        return res.status(200).json({
            message: "Chat endpoint working",
            chat
        });

    } catch (error) {
        console.error("Error in /chat endpoint:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})


module.exports = chatRouter