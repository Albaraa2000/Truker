const filterBody = req.body;
const allowedUpdates = ['email', 'password']; // list of fields that can be updated
const updates = {};

// check if each field in the allowedUpdates list is present in the filterBody object, and add it to the updates object if it is
allowedUpdates.forEach((update) => {
  if (filterBody[update]) {
    updates[update] = filterBody[update];
  }
});

const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
  new: true,
  runValidators: true,
});
