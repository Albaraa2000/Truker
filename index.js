const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(allowed).forEach((el) => {
    if (allowed.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
const req = {
  body: {
    name: "ahmed",
    email: "ahmed@gmail.com",
  },
};

filterObj(req.body, "name", "email");
