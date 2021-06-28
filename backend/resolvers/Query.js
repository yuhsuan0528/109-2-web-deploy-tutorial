const Query = {
  
  async rooms ( parent, args, { db }, info ) {
    const rooms = await db.RoomModel.find();
    return rooms;
  },
  
  async roomPlayers( parent, { roomName }, { db }, info ) {
    if (!roomName) {
      throw new Error("Missing RoomName for Querying.");
    }
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) {
      throw new Error('Room not found!');
    }
    room = await room
      .populate([{path: 'players', select: 'name -_id'}])
      .execPopulate();
    return room.players;
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

  async playerList( parent, { playerName }, { db }, info ) {
    if (!playerName) {
      throw new Error("Missing PlayerName for Querying.");
    }
    let player = await db.PlayerModel.findOne({ name: playerName });
    if (!player) {
      throw new Error('Player not found!');
    }
    player = await player
      .populate([{path: 'players_list', select: 'name me character is_leader vote is_assigned -_id'}])
      .execPopulate();
    return player.players_list;
  },
  
};

export { Query as default };
