const { User, Thought } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Are you sure you have the right user id?' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createUser
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },


  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Well, this is awkward. There is no user with that id.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'You have chosen.. poorly. ::you turn to dust::' });
        }

        // bonus: return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } })
      })
      .then(() => {
        res.json({ message: 'BYE FELICIA!!!' });
      })
      .catch(err => res.status(400).json(err));
  },

  // add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.id }, { $addToSet: { friends: params.friendId } }, { runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Are you sure they are your friend, that id does not match.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // remove friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.id }, { $pull: { friends: params.friendId } }, { runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Soo, that person is not here with that id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

}

module.exports = userController;