const Subscription = {
  
  room: {
    subscribe( parent, args, { db, pubsub }, info ) {
      return pubsub.asyncIterator(`all_rooms`);
    },
  },
  
  roomPlayer: {
    subscribe( parent, { roomName }, { db, pubsub }, info ) {
      let room = db.RoomModel.findOne({name: roomName});
      if (!room) {
        throw new Error('Room not found!');
      }
      return pubsub.asyncIterator(`roomPlayer ${roomName}`);
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

  playerList: {
    subscribe( parent, { playerName }, { db, pubsub }, info ) {
      let player = db.PlayerModel.findOne({name: playerName});
      if (!player) {
        throw new Error('Player not found!');
      }
      return pubsub.asyncIterator(`playerList ${playerName}`);
    },
  },

}

export default Subscription;