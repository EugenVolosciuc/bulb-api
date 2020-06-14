function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page || 1)
        const limit = parseInt(req.query.limit || 10)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = { page: page + 1, limit }
        }

        if (startIndex > 0) {
            results.prev = { page: page - 1, limit }
        }

        try {
            results.results = await model.find(req.query.filterBy ? JSON.parse(req.query.filterBy) : {}).limit(limit).skip(startIndex).exec()
            console.log("req.query.filterBy", req.query.filterBy)
            console.log(results.results)

            if (!results.results.length) return res.status(404).send({ message: 'No results found' })
            res.paginatedResults = results
            next()
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }

        res.paginatedResults = results
        next()
    }
}

module.exports = paginatedResults