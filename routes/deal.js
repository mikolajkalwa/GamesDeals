const { Router } = require('express');
const Deal = require('../models/Deal.js');

const router = new Router();

router.get('/deals', async (req, res) => {
  try {
    const deals = await Deal.find({});
    res.status(200).send(deals);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/deals/:id', async (req, res) => {
  const threadID = req.params.id;
  try {
    const thread = await Deal.findOne({ thread_id: threadID });
    if (!thread) {
      res.status(404).send();
    } else {
      res.status(200).send(thread);
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/deals', async (req, res) => {
  const deal = new Deal(req.body);
  try {
    await deal.save();
    res.status(201).send(deal);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/deals:id', async (req, res) => {
  const threadID = req.params.id;

  try {
    const thread = await Deal.findOneAndDelete({ thread_id: threadID });
    if (!thread) {
      res.status(404).send();
    } else {
      res.status(200).send(thread);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
