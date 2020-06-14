const mongoose = require('mongoose')

const { IDEA_STATUSES } = require('../constants')

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, 'The description is required'],
        minlength: [10, 'A minimum of 10 characters is required'],
        maxlength: [250, 'A maximum of 250 characters is allowed']
    },
    examples: [{
        title: String,
        url: String
    }],
    status: {
        type: String,
        required: [true, 'The idea status is required'],
        validate: {
            validator: value => Object.values(IDEA_STATUSES).includes(value),
            message: props => `${props.value} is not a valid idea status`
        }
    }
}, {
    timestamps: true
})

ideaSchema.statics.random = async function () {
    try {
        const count = await Idea.countDocuments().exec()
        const random = Math.floor(Math.random() * count)
        const idea = await Idea.findOne({ status: IDEA_STATUSES.ACCEPTED }).skip(random).exec()

        return idea
    } catch (error) {
        throw new Error('Error occured while getting random idea from db')
    }
}

const Idea = mongoose.model('Idea', ideaSchema, 'ideas')

module.exports = Idea