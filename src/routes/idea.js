const express = require('express')
const router = express.Router()

const { IDEA_STATUSES } = require('../constants')

const Idea = require('../models/idea')
const paginatedResults = require('../middleware/paginatedResults')

router.get('/random', async (req, res) => {
    try {
        const idea = await Idea.random()
        res.send(idea)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get('/', paginatedResults(Idea), (req, res) => {
    try {
        res.send(res.paginatedResults)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'examples']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ message: 'Invalid operation' })
    }

    try {
        const idea = new Idea({ ...req.body, status: IDEA_STATUSES.ACCEPTED })
        await idea.save()
        res.status(201).send(idea)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/proposals', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'examples']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ message: 'Invalid operation' })
    }

    try {
        const idea = new Idea({ ...req.body, status: IDEA_STATUSES.PENDING })
        await idea.save()
        res.status(201).send(idea)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const idea = await Idea.findByIdAndDelete(req.params.id)

        if (!idea) {
            return res.status(404).send({ message: 'No idea found' })
        }

        res.send(idea)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router