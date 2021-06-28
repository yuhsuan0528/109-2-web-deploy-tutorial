const Subscription = {
  
  room: {
    subscribe( parent, args, { db, pubsub }, info ) {
      return pubsub.asyncIterator(`all_rooms`);
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