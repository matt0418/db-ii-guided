const router = require('express').Router();
const knex = require('knex')

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/rolex.db3'
  }
}

const db = knex(knexConfig)

router.get('/', (req, res) => {
  db('roles')
    .then(roles => {
      res.status(200).json(roles)
    })
    .catch(error => {
      res.status(500).json(error)
    })
});

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const role = await db('roles')
    .where({id})
    console.log(role)
    if (role.length > 0) {
      return res.status(200).json(role)
    } else {
      return res.status(404).json({error: "No role with this id exists"})
    }
  } catch(error) {
    console.log(error)
    res.status(500).json(error)
  }
  // db('roles')
  //   .where({id})
  //   .then(role => {
  //     res.status(200).json(role)
  //   })
  //   .catch(error => {
  //     res.status(500).json(error)
  //   })
});

// router.get('/:id', (req, res) => {
//   const id = req.params.id
//   db('roles')
//     .where({id})
//     .then(role => {
//       res.status(200).json(role)
//     })
//     .catch(error => {
//       res.status(500).json(error)
//     })
// });

router.post('/', (req, res) => {
  // add a role to the database
  db('roles')
  .insert(req.body)
  .then(ids => {
    const [id] = ids

    db('roles')
    .where({ id })
    .first()
    .then(role => {
      res.status(200).json(role)
    })
    .catch(error => {
      res.status(500).json(error)
    })
  })
});


router.put('/:id', (req, res) => {
  // update roles
  const id = req.params.id
  db('roles')
  .where({id})
  .update(req.body)
  .then(count => {
    if (count > 0) { // count is a foobar
      db('roles')
      .where({ id })
      .first()
      .then(role => {
        res.status(200).json(role)
      })
      .catch(error => {
        res.status(500).json(error)
      })
    } else {
      res.status(404).json({error: "There was no id"})
    }
  })
  .catch(error => {
    res.status(500).json(error)
  })
});

router.delete('/:id', (req, res) => {
  const id = req.params.id
  db('roles')
  .where({ id })
  .del()
  .then(deleted => {
    if (deleted > 0) {
      res.status(204).json(deleted)
    } else {
      res.status(404).json({ error: "There is no id" })
    }
  })
  .catch(error => {
    res.status(500).json(error)
  })
});

module.exports = router;
