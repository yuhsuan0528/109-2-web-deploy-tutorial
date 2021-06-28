const Query = {
  
  async rooms ( parent, args, { db }, info ) {
    const rooms = await db.RoomModel.find();
    return rooms;
  },
  
  async roomChat( parent, { roomName }, { db }, info ) {
    if (!roomName) {
      throw new Error("Missing RoomName for Querying.");
    }
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) {
      throw new Error('Room not found!');
    }
    room = await room
      .populate([{path: 'messages', select: 'sender body -_id'}])
      .execPopulate();
    return room.messages;
  },

  async roomInfo( parent, { roomName }, { db }, info ) {
    if (!roomName) {
      throw new Error("Missing RoomName for Querying.");
    }
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) {
      throw new Error('Room not found!');
    }
    return room;
  },

};

export { Query as default };
