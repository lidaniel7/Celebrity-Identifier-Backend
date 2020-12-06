const updateLeaderboard = (req, res, db) => {
    const {name} = req.body
    if (!name) {
        return res.status(400).json('name is empty')
    }
    db('celebrities').select('name').where('name', '=', name)
        .then(celebName => {
            if (celebName.length > 0) {
                return db('celebrities').where('name', '=', name)
                    .increment('frequency', 1)
                    .returning('frequency')
                    .then(frequency => {
                        res.json(frequency[0])
                    })
                    .catch(err => res.status(400).json('unable to gt frequency of appearances'))
            } else {
                return db('celebrities').insert({
                    name: name,
                    frequency: 1
                }).then(user => {
                    console.log(user)
                    res.json(name)
                })
            }
        })
}


module.exports = {
    updateLeaderboard: updateLeaderboard
};