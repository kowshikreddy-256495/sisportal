const Menu = require('../models/Menu');

exports.getMenu = async (req, res) => {
  try {
    const data = await Menu.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const item = await Menu.create(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
