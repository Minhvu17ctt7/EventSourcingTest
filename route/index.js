const UserModel = require("../models/UserModel");
const UserAggregate = require('../UserAggregate');

function router(app, es) {
  app.get("/:id", async(req, res, next) => {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User was not found!',
      });
    }
    es.getFromSnapshot({
      aggregateId: user.username,
      aggregate: 'userAggregate',
    }, function (error, snapshot, stream) {
      const history = stream.events;
  
      const userAggregate = new UserAggregate(user.username, user.username);
  
      userAggregate.loadSnapshot(snapshot);
      userAggregate.loadFromHistory(history);
  
      const data = userAggregate.getSnap().data;
      const payload = {
        userId: user._id,
        data,
      }
      return res.json(payload);
    })
  });
  app.post("/", async (req, res, next) => {
    const { username, password, name } = req.body;

    es.getFromSnapshot({
      aggregateId: username,
      aggregate: 'userAggregate'
    }, async function (error, snapshot, stream) {
      stream.addEvent({
        name: "UserRegister",
        user: { username, password, name, active:true }
      });
      stream.commit();
      await UserModel.create({ username, password, name });
      res.status(201).json({ message: 'User is created' });
    });
  });

  app.put("/", async (req, res, next) => {
    const { username, password, name } = req.body;

    es.getFromSnapshot({
      aggregateId: username,
      aggregate: 'userAggregate'
    }, async function (error, snapshot, stream) {
      const history = stream.events;
      const userAggregate = new UserAggregate(username, username);
      userAggregate.loadSnapshot(snapshot);
      userAggregate.loadFromHistory(history);

      stream.addEvent({
        name: "UserUpdate",
        user: { username, password, name }
      });
      stream.commit();

      const HISTORY_LIMIT =  2;
      if (history.length > HISTORY_LIMIT) {
        es.createSnapshot({
          aggregateId: username,
          aggregate: 'userAggregate',          // optional
          data: userAggregate.getSnap(),
          revision: stream.lastRevision,//al
          version: 1 // optional
        }, function(err) {
          console.log(err.message)
        });
      }

      await UserModel.create({ username, password, name });
      res.status(201).json({ message: 'User is updated' });
    });
  });
  app.delete("/", async (req, res, next) => {
    const user = await UserModel.findById(req.body.id);
    if (!user) {
      return res.status(404).json({
        message: 'User was not found!',
      });
    }
    es.getFromSnapshot({
      aggregateId: user.username,
      aggregate: 'userAggregate'
    }, async function (error, snapshot, stream) {
      const history = stream.events;
      const userAggregate = new UserAggregate(user.username, user.username);
      userAggregate.loadSnapshot(snapshot);
      userAggregate.loadFromHistory(history);

      user.active = false;
      stream.addEvent({
        name: "UserDelete",
        user: user
      });
      stream.commit();

      const HISTORY_LIMIT =  2;
      if (history.length > HISTORY_LIMIT) {
        es.createSnapshot({
          aggregateId: user.username,
          aggregate: 'userAggregate',          // optional
          data: userAggregate.getSnap(),
          revision: stream.lastRevision,//al
          version: 1 // optional
        }, function(err) {
          console.log(err.message)
        });
      }
      res.status(201).json({ message: 'User is delete' });
    });
  });
}

module.exports = router;