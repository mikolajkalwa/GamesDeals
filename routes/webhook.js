const { Router } = require('express');
const Webhook = require('../models/Webhook.js');

const router = new Router();

router.get('/webhooks', async (req, res) => {
  try {
    const webhooks = await Webhook.find({});
    res.status(200).send(webhooks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/webhooks/:id', async (req, res) => {
  const webhookID = req.params.id;
  try {
    const webhook = await Webhook.findOne({ webhook_id: webhookID });
    if (!webhook) {
      res.status(404).send();
    } else {
      res.status(200).send(webhook);
    }
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/webhooks', async (req, res) => {
  const webhook = new Webhook(req.body);
  try {
    await webhook.save();
    res.status(201).send(webhook);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/webhooks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['role_to_mention'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  const webhookID = req.params.id;

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid updates!' });
  } else {
    try {
      const webhook = await Webhook.findOneAndUpdate({
        webhook_id: webhookID,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      });

      if (!webhook) {
        res.status(404).send();
      } else {
        res.status(200).send(webhook);
      }
    } catch (e) {
      res.status(400).send(e);
    }
  }
});

router.delete('/webhooks/:id', async (req, res) => {
  try {
    const webhookID = req.params.id;
    const webhook = await Webhook.findOneAndDelete({ webhook_id: webhookID });
    if (!webhook) {
      res.status(404).send();
    } else {
      res.status(200).send(webhook);
    }
  } catch (e) {
    res.status(500).send();
  }
});


module.exports = router;
