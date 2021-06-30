const Query = {
  
  async rooms ( parent, { playerName }, { db }, info ) {
    if (!playerName) {
      throw new Error("Missing PlayerName.");
    }
    const player = await db.PlayerModel.findOne({ name: playerName });
    if (!player) {
      throw new Error("Player not found!");
    }
    let search_key = '';
    if (player.keyword) search_key = player.keyword;
    const room_list = await db.RoomModel.find({ name: {'$regex': String(search_key), '$options': 'i'} });
    
    return room_list;
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
