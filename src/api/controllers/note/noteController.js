const Joi = require('joi');
const Note = require('../../models/Note');

const isValidDocId = (docId) => {
    return (
    typeof docId === 'string' &&
    docId.length === 24 &&
    /^[0-9a-fA-F]+$/.test(docId)
)};

const noteSchema = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'title is required',
        'string.empty': 'title cannot be empty',
    }),
    content: Joi.string().required().messages({
        'any.required': 'content is required',
        'string.empty': 'content cannot be empty',
    }),
}).messages({
    'object.unknown': 'Invalid field: {{#label}}',
});

const add_note = async (req, res) => {

    const { userId } = req.user;

    const { error, value } = noteSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ success: false, errors: errorMessages });
    }

    const { title, content } = value;

    const newNote = new Note({
        title,
        content,
        userId
    });

    try {
        await newNote.save();
        return res.status(200).json({
            success: true,
            message: "Note added successfully."
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An internal server error occurred"
        })
    }
}

const get_notes = async (req, res) => {
    const { userId } = req.user;
    try {        
        const notes = await Note.find({ userId: userId });
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

const get_note = async (req, res) => {
    const { id: noteId } = req.params;
    const { userId } = req.user;

    try {

        if(!isValidDocId(noteId)) {
            return res.status(400).json({
                success: false,
                message: 'Bad request'
            });
        }

        const noteExists = await Note.findOne({ _id: noteId, userId });
        if (!noteExists) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            })
        }

        const note = await Note.findOne({ _id: noteId, userId });
        return res.status(200).json({
            success: true,
            data: note
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An internal server error occurred"
        });
    }
}

const update_note = async (req, res) => {

    const { id: noteId } = req.params;
    const { userId } = req.user;

    const { title, content } = req.body;

    try {

        if(!isValidDocId(noteId)) {
            return res.status(400).json({
                success: false,
                message: 'Bad request'
            });
        }

        const noteExists = await Note.findOne({ _id: noteId, userId });
        if (!noteExists) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        await Note.updateOne({ _id: noteExists._id }, {
            title: title ? title : noteExists.title,
            content: content ? content : noteExists.content
        });

        return res.status(200).json({
            success: true,
            message: "Note updated successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An internal server error occurred"
        })
    }
}

const delete_note = async (req, res) => {
    const { id: noteId } = req.params;
    const { userId } = req.user;

    try {

        if(!isValidDocId(noteId)) {
            return res.status(400).json({
                success: false,
                message: 'Bad request'
            });
        }

        const noteExists = await Note.findOne({ _id: noteId, userId });
        if (!noteExists) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            })
        }

        await Note.deleteOne({ _id: noteId, userId });
        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An internal server error occurred"
        });
    }
}

const share_note = async (req, res) => {
    const { id: noteId } = req.params;
    const { userId } = req.user;

    const { sharedUserId } = req.body;

    try {

        if(!isValidDocId(noteId) || !isValidDocId(sharedUserId)) {
            return res.status(400).json({
                success: false,
                message: 'Bad request'
            });
        }

        const noteExists = await Note.findOne({ _id: noteId, userId });
        if (!noteExists) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        await Note.updateOne({ _id: noteExists._id }, {
            $push: { sharedWith: sharedUserId }
        });

        return res.status(200).json({
            success: true,
            message: "Note shared successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: "An internal server error occurred"
        })
    }
}


module.exports = {
    add_note,
    get_notes,
    get_note,
    update_note,
    delete_note,
    share_note
};