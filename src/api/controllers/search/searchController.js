const Note = require('../../models/Note');

const search_notes = async (req, res) => {
    const { userId } = req.user;
    const { q: query } = req.query;

    try {
        const notes = await Note.find({
            $and: [
                { userId }, 
                { $text: { $search: query } }
            ]
        });
        return res.status(200).json({
            success: true,
            data: notes
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An internal server error occurred"
        });
    }
}

module.exports = {
    search_notes
};