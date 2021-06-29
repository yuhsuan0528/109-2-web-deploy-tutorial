const Subscription = {
  
  room: {
    subscribe( parent, { playerName }, { db, pubsub }, info ) {
      let player = db.PlayerModel.findOne({name: playerName});
      if (!player) {
        throw new Error('Player not found!');
      }
      return pubsub.asyncIterator(`rooms ${playerName}`);
    },
  },
  
  message: {
    subscribe( parent, { roomName }, { db, pubsub }, info ) {
      let room = db.RoomModel.findOne({name: roomName});
      if (!room) {
        throw new Error('Room not found!');
      }
      return pubsub.asyncIterator(`message ${roomName}`);
    },
  },

  roomInfo: {
    subscribe( parent, { roomName }, { db, pubsub }, info ) {
      let room = db.RoomModel.findOne({name: roomName});
      if (!room) {
        throw new Error('Room not found!');
      }
      return pubsub.asyncIterator(`roomInfo ${roomName}`);
    },
  },

}

export default Subscription;