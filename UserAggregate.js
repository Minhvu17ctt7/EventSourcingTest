module.exports = class UserAggregate {
  constructor(aggregateId, username = null) {
    this.aggregateId = aggregateId;
    this.username = username;
    this.data = {};
  }
  loadSnapshot(snapshot) {
    if (!snapshot) {
      console.log('snapshot is null')
      return;
    }
    this.username = snapshot.data.username;
    this.data = snapshot.data.data;
  }

  loadFromHistory(history) {
    this.history = history;
  }

  getSnap() {
    return {
      username: this.username,
      data: this.getData(),
    }
  }

  // {}
  getData() {
    return this.history.reduce((acc, item) => {
      if (item.payload.name === 'UserRegister' || item.payload.name ==='UserDelete') {
        return item.payload.user; //{ username: ....}
      } else if (item.payload.name === 'UserUpdate') {
        return {...acc, ...item.payload.user} ;
      }
    }, this.data)
  }
}