
const validatePlayer = async (db, name) => {
  const existing = await db.PlayerModel.findOne({ name: name });
  if (existing) return existing;
  else return new db.PlayerModel({ name: name }).save();
};
const validateRoom = async (db, roomName, hostName, num) => {
  const existing = await db.RoomModel.findOne({ name: roomName });
  if (existing) return existing;
  else return new db.RoomModel({ name: roomName, host: hostName, num_of_players: num, status: "pre-game" }).save();
};

const shuffle = (array)  => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const character = ['GM', 'BM', 'P', 'A', 'GN', 'GN', 'O', 'GN', 'GN', 'MO'];


const Mutation = {
  
  async logIn( parent, { name }, { db }, info ) {
    if (!name) {
      throw new Error("Missing player name for logIn.");
    }
    const player = await validatePlayer(db, name);
    return player.name;
  },

  async createRoom( parent, { roomName, hostName, num }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!hostName) {
      throw new Error("Missing host name.");
    }
    const host = await validatePlayer(db, hostName);
    const room_existing = await db.RoomModel.findOne({ name: roomName });
    const room = await validateRoom(db, roomName, hostName, num);
    
    host.room = room._id;
    host.is_leader = true;
    const existing = room.players.find(p => String(p) === String(host._id))
    if (!existing) {
      await room.players.push(host._id);
    }
    await host.save();
    await room.save();

    if (!room_existing) {
      const all_rooms = await db.RoomModel.find({});
      pubsub.publish(`all_rooms`, {
        room: {
          data: all_rooms,
        }
      });
      pubsub.publish(`roomInfo ${roomName}`, {
        roomInfo: {
          data: room,
        }
      });
    }

    return roomName;
  },

  async joinRoom( parent, { roomName, playerName }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!playerName) {
      throw new Error("Missing player name.");
    }
    const player = await validatePlayer(db, playerName);
    const room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");

    // check if this player has already joined the room
    const existing = room.players.find(p => String(p) === String(player._id))

    if (!existing) {
      // check if the number of players exceeds the room limit
      if (room.players.length >= room.num_of_players) {
        throw new Error("Sorry, this room is full.");
      }
      player.room = room._id;
      player.is_leader = false;
      await room.players.push(player._id);
    }
    await player.save();
    await room.save();
    
    const all_rooms = await db.RoomModel.find({});
    pubsub.publish(`all_rooms`, {
      room: {
        data: all_rooms,
      }
    });
    pubsub.publish(`roomInfo ${roomName}`, {
      roomInfo: {
        data: room,
      }
    });

    return roomName;
  },

  async createMessage( parent, { roomName, playerName, body }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!playerName) {
      throw new Error("Missing player name.");
    }
    const player = await validatePlayer(db, playerName);
    const room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");

    const newMessage = new db.MessageModel({ sender: player, body: body });
    await newMessage.save();
    await room.messages.push(newMessage);
    await room.save();

    pubsub.publish(`message ${roomName}`, {
      message: {
        data: newMessage,
      }
    });
    return newMessage;
  },

  async startGame( parent, { roomName, playerName }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!playerName) {
      throw new Error("Missing player name.");
    }
    const player = await validatePlayer(db, playerName);
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");

    // check if the room is full
    if (room.players.length < room.num_of_players) {
      throw new Error("Sorry, this room is not full yet.");
    }
    // check if the player is the host
    if (String(room.host) !== String(player.name)) {
      throw new Error("Sorry, only the host can start the game.");
    }
    room = await room
      .populate([{path: 'players', select: 'name -_id'}])
      .execPopulate();
    const original_player_list = room.players.map(p => p.name);
    const shuffle_player_list = shuffle(room.players.map(p => p.name));

    // initialize every player's player_list
    for (var i = 0; i < original_player_list.length; i++) {
      const my_name = original_player_list[i];
      const my_character = character[shuffle_player_list.findIndex(py => py === my_name)];
      const myself = await validatePlayer(db, my_name);

      // delete previous PlayerInfo documents in my players_list
      if (myself.players_list) {
        for (var k = 0; k < myself.players_list.length; k++) {
          await db.PlayerInfoModel.deleteMany({ _id: myself.players_list[k] }, function (err, _) {
            if (err) throw err;
          });
        }
      }
      myself.is_assigned = false;
      myself.vote = 'null';
      myself.players_list = [];
      await myself.save();

      for (var j = 0; j < original_player_list.length; j++) {
        const your_name = original_player_list[j];
        const your_character = character[shuffle_player_list.findIndex(item => item === your_name)];

        let is_me = false;
        if (i === j) is_me = true;

        let show_character = 'null';
        if (i === j) show_character = your_character;
        if (my_character === 'GM') {
          if (your_character === 'BM') show_character = 'B';
          else if (your_character === 'A') show_character = 'B';
          else if (your_character === 'O') show_character = 'B';
        }
        else if (my_character === 'P') {
          if (your_character === 'GM') show_character = 'M';
          else if (your_character === 'BM') show_character = 'M';
        }
        else if (my_character === 'BM') {
          if (your_character === 'A') show_character = 'B';
          if (your_character === 'MO') show_character = 'B';
        }
        else if (my_character === 'A') {
          if (your_character === 'BM') show_character = 'B';
          if (your_character === 'MO') show_character = 'B';
        }
        else if (my_character === 'MO') {
          if (your_character === 'BM') show_character = 'B';
          if (your_character === 'A') show_character = 'B';
        }

        const pInfo = new db.PlayerInfoModel({
                        name: your_name,
                        me: is_me,
                        character: show_character});
        await pInfo.save();

        await myself.players_list.push(pInfo);
        await myself.save();

      }
    }

    // publish the new room info
    const room_finished = await db.RoomModel.findOne({ name: roomName });
    room_finished.status = 'assign-1-1';
    room_finished.vote_results = [];
    room_finished.cup_results = [];
    await room_finished.save();
    
    pubsub.publish(`roomInfo ${roomName}`, {
      roomInfo: {
        data: room_finished,
      }
    });
    return room.name;
  },

  async assign( parent, { roomName, leaderName, assignedNames }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");
    room = await room
      .populate([{path: 'players', select: 'name is_leader is_assigned -_id'}])
      .execPopulate();
    
    // check if the room is in the right status
    const status_type = room.status.split('-')[0];
    if (String(status_type) !== 'assign') {
      throw new Error("You cannot assign in this status.");
    }
    
    // check if the leaderName is the true leader
    const leader = room.players.find(p => p.is_leader === true);
    if (String(leader.name) !== String(leaderName)) {
      throw new Error("Only the leader can assign.");
    }

    // start searching for assignedNames and set is_assigned to true/false
    const player_list = room.players.map(p => p.name);
    for (var i = 0; i < player_list.length; i++) {
      const target_name = player_list[i];
      const target = await validatePlayer(db, target_name);
      const name_existed = assignedNames.find(item => String(item) === String(target_name));
      if (name_existed) target.is_assigned = true;
      else target.is_assigned = false;
      await target.save();
    }

    // publish the new room info
    const room_finished = await db.RoomModel.findOne({ name: roomName });
    const round =  Number(room_finished.status.split('-')[1]);
    const vote_round =  Number(room_finished.status.split('-')[2]);
    room_finished.status = `vote-${round}-${vote_round}`
    await room_finished.save();
    
    pubsub.publish(`roomInfo ${roomName}`, {
      roomInfo: {
        data: room_finished,
      }
    });
    return room.name;
  },

  async vote( parent, { roomName, playerName, agree }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!playerName) {
      throw new Error("Missing player name.");
    }
    
    // set the vote of this player
    const player = await validatePlayer(db, playerName);
    player.vote = String(agree);
    await player.save();

    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");
    room = await room
      .populate([{path: 'players', select: 'name vote is_leader -_id'}, {path: 'vote_results', select: 'vote'}])
      .execPopulate();
    
    // check if the room is in the right status
    const status_type = room.status.split('-')[0];
    if (String(status_type) !== 'vote') {
      const invalid_player = await validatePlayer(db, playerName);
      invalid_player.vote = 'null';
      await invalid_player.save();
      throw new Error("You cannot vote in this status.");
    }
    const round =  Number(room.status.split('-')[1]);
    const vote_round = Number(room.status.split('-')[2]);

    // check if everyone has voted
    const not_yet = room.players.find(py => String(py.vote) === 'null');
    if (!not_yet) {
      const results = room.players.map(py => {
        if (String(py.vote) === 'true') return 'T';
        else return 'F';
      }).join('');
      
      // save the vote results to the room info
      if (round > room.vote_results.length) {
        const VR = await new db.VoteResultModel({ vote: [results] });
        await VR.save();
        room.vote_results.push(VR);
      }
      else {
        const prev_VR = await db.VoteResultModel.findOne({ _id: room.vote_results[round - 1]._id });
        await prev_VR.vote.push(results);
        await prev_VR.save();
      }

      const true_vote = room.players.filter(py => String(py.vote) === 'true');
      const false_vote = room.players.filter(py => String(py.vote) === 'false');

      // refresh each player's is_leader / is_assigned /  vote
      const leader_idx = Number(room.players.findIndex(py => py.is_leader === true));
      const player_list = room.players.map(p => p.name);
      for (var i = 0; i < player_list.length; i++) {
        const target_name = player_list[i];
        const target = await validatePlayer(db, target_name);
        if (true_vote.length <= false_vote.length) {
          target.is_assigned = false;
          target.is_leader = false;
          if (i === ((leader_idx + 1) % Number(room.num_of_players))) {
            target.is_leader = true;
          }
        }
        target.vote = 'null';
        
        await target.save();
      }

      // switching status according to the vote results
      if (true_vote.length > false_vote.length) room.status = `cup-${round}`;
      else {
        if (vote_round >= 5) room.status = 'bad-win';
        else room.status = `assign-${round}-${vote_round+1}`;
      }
      await room.save();

      // publish the new room info
      const room_finished = await db.RoomModel.findOne({ name: roomName });
      pubsub.publish(`roomInfo ${roomName}`, {
        roomInfo: {
          data: room_finished,
        }
      });
    }
    
    return room.name;
  },

  async cup( parent, { roomName, playerName, agree }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!playerName) {
      throw new Error("Missing player name.");
    }
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");
    room = await room
      .populate([{path: 'players', select: 'name is_assigned -_id'}, {path: 'cup_results', select: 'good bad player'}])
      .execPopulate();
    
    // check if the room is in the right status
    const status_type = room.status.split('-')[0];
    if (String(status_type) !== 'cup') {
      throw new Error("You cannot decide the cup in this status.");
    }
    const round =  Number(room.status.split('-')[1]);
    const cup_count = room.players.filter(py => py.is_assigned === true).length;
    
    // check if the player is assigned
    const player_idx = Number(room.players.findIndex(py => String(py.name) === String(playerName)));
    if (!room.players[player_idx].is_assigned) {
      throw new Error("This player is not assigned.");
    }

    // collect cup results
    if (round > room.cup_results.length) {
      // create a new cup_result document
      let good_count = 0;
      let bad_count = 0;
      if (agree) good_count = 1;
      else bad_count = 1;
      const CR = await new db.CupResultModel({ good: good_count, bad: bad_count, player: [player_idx] });
      await CR.save();
      room.cup_results.push(CR);
    }
    else {
      const prev_CR = await db.CupResultModel.findOne({ _id: room.cup_results[round - 1]._id });
      //check if there are repeated cups from one player
      const player_existed = prev_CR.player.find(p => p === player_idx);
      if (player_existed) {
        throw new Error("You can only decide the cup once.");
      }
      if (agree) prev_CR.good += 1;
      else prev_CR.bad += 1;
      await prev_CR.player.push(player_idx);
      await prev_CR.save();
    }
    await room.save();
    
    // check if all assigned players have decided their cups
    let room_finished = await db.RoomModel.findOne({ name: roomName });
    room_finished = await room_finished
      .populate([{path: 'players', select: 'name is_leader is_assigned -_id'}, {path: 'cup_results', select: 'good bad player'}])
      .execPopulate();
    
    if (round <= room_finished.cup_results.length) {
      const current_cup = room_finished.cup_results[round - 1].player.length;
      if (current_cup >= cup_count) {
        // refresh each player's is_leader / is_assigned 
        const leader_idx = Number(room_finished.players.findIndex(py => py.is_leader === true));
        const player_list = room_finished.players.map(p => p.name);
        for (var i = 0; i < player_list.length; i++) {
          const target_name = player_list[i];
          const target = await validatePlayer(db, target_name);
          target.is_assigned = false;
          target.is_leader = false;
          if (i === ((leader_idx + 1) % Number(room_finished.num_of_players))) {
            target.is_leader = true;
          }
          await target.save();
        }
        // switching status - check if the game is ended
        const total_bad_count = room_finished.cup_results.filter(cr => cr.bad > 0).length;
        const total_good_count = room_finished.cup_results.length - total_bad_count;
        if (total_good_count >= 3) room_finished.status = 'assassin';
        else if (total_bad_count >= 3) room_finished.status = 'bad-win';
        else room_finished.status = `assign-${round+1}-1`;
        await room_finished.save();

        // publish the new room info
        const room_final = await db.RoomModel.findOne({ name: roomName });
        pubsub.publish(`roomInfo ${roomName}`, {
          roomInfo: {
            data: room_final,
          }
        });
      }
    }
    return room.name;
  },

  async assassin( parent, { roomName, playerName, targetName }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");
    room = await room
      .populate([{path: 'players', select: 'name -_id'}])
      .execPopulate();
    
    // check if the room is in the right status
    const status_type = room.status.split('-')[0];
    if (String(status_type) !== 'assassin') {
      throw new Error("You cannot assassinate somebody in this status.");
    }
    
    // check if the playerName is the true assassin
    let player = await validatePlayer(db, playerName);
    player = await player
      .populate([{path: 'players_list', select: 'name me character -_id'}])
      .execPopulate();
    const check_identity = player.players_list.filter(pl => (pl.me && String(pl.character) === 'A'));
    if (check_identity.length === 0) {
      throw new Error("This player is not the assassin.");
    }
    
    // check if the targetName is Good Merlin
    let target_player = await validatePlayer(db, targetName);
    target_player = await target_player
      .populate([{path: 'players_list', select: 'name me character -_id'}])
      .execPopulate();
    const check_target = target_player.players_list.filter(pl => (pl.me && String(pl.character) === 'GM'));
    if (check_target.length === 0) {
      // assassin failed
      room.status = 'good-win';
    }
    else {
      // assassin succeeded
      room.status = 'bad-win';
    }
    await room.save();

    // publish the new room info
    const room_finished = await db.RoomModel.findOne({ name: roomName });
    pubsub.publish(`roomInfo ${roomName}`, {
      roomInfo: {
        data: room_finished,
      }
    });
    return room.name;
  },

  async leaveRoom( parent, { roomName, playerName }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!playerName) {
      throw new Error("Missing player name.");
    }
    const player = await validatePlayer(db, playerName);
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");
    room = await room
      .populate([{path: 'players', select: 'name -_id'}])
      .execPopulate();
    
    const player_existed = room.players.find(py => String(py.name) === String(playerName));
    if (!player_existed) {
      throw new Error("This player is not in this room.");
    }

    if (String(playerName) === String(room.host)) {
      throw new Error("The host cannot leave the room. You can close the room.");
    }

    // delete players_list PlayerInfo documents
    for (var k = 0; k < player.players_list.length; k++) {
      await db.PlayerInfoModel.deleteMany({ _id: player.players_list[k] }, function (err, _) {
        if (err) {
            throw err;
        }
      });
    }
    
    player.room = null;
    player.is_leader = null;
    player.is_assigned = null;
    player.vote = 'null';
    player.players_list = [];
    await player.save();

    // publish the new room info
    const room_finished = await db.RoomModel.findOne({ name: roomName });
    for (var i = 0; i < room_finished.players.length; i++) { 
      if (String(room_finished.players[i]) === String(player._id)) { 
        room_finished.players.splice(i, 1);
      }
    }
    await room_finished.save();
    pubsub.publish(`roomInfo ${roomName}`, {
      roomInfo: {
        data: room_finished,
      }
    });
    const all_rooms = await db.RoomModel.find({});
    pubsub.publish(`all_rooms`, {
      room: {
        data: all_rooms,
      }
    });
    return roomName;
  },

  async closeRoom( parent, { roomName, playerName }, { db, pubsub }, info ) {
    if (!roomName) {
      throw new Error("Missing room name.");
    }
    if (!playerName) {
      throw new Error("Missing player name.");
    }
    const player = await validatePlayer(db, playerName);
    let room = await db.RoomModel.findOne({ name: roomName });
    if (!room) throw new Error("This room has not been created.");
    room = await room
      .populate([{path: 'players', select: 'name -_id'}])
      .execPopulate();
    
    const player_existed = room.players.find(py => String(py.name) === String(playerName));
    if (!player_existed) {
      throw new Error("This player is not in this room.");
    }

    if (String(playerName) !== String(room.host)) {
      throw new Error("Only the host can close the room.");
    }

    // recursively delete the related documents of all players in this room
    const player_list = room.players.map(p => p.name);
    for (var i = 0; i < player_list.length; i++) {
      const my_name = player_list[i];
      const myself = await validatePlayer(db, my_name);

      // delete previous PlayerInfo documents in my players_list
      if (myself.players_list) {
        for (var k = 0; k < myself.players_list.length; k++) {
          await db.PlayerInfoModel.deleteMany({ _id: myself.players_list[k] }, function (err, _) {
            if (err) throw err;
          });
        }
      }
      // reset this player's Player document
      myself.room = null;
      myself.is_leader = null;
      myself.is_assigned = null;
      myself.vote = 'null';
      myself.players_list = [];
      await myself.save();
    }
    // delete messages
    if (room.messages) {
      for (var j = 0; j < room.messages.length; j++) {
        await db.MessageModel.deleteMany({ _id: room.messages[j] }, function (err, _) {
          if (err) throw err;
        });
      }
    }
    // delete vote_results and cup_results documents
    if (room.vote_results) {
      for (var v = 0; v < room.vote_results.length; v++) {
        await db.VoteResultModel.deleteMany({ _id: room.vote_results[v] }, function (err, _) {
          if (err) throw err;
        });
      }
    }
    if (room.cup_results) {
      for (var c = 0; c < room.cup_results.length; c++) {
        await db.CupResultModel.deleteMany({ _id: room.cup_results[c] }, function (err, _) {
          if (err) throw err;
        });
      }
    }
    // delete the Room document itself
    await db.RoomModel.deleteMany({ name: roomName }, function (err, _) {
      if (err) throw err;
    });

    // publish the new room info
    const all_rooms = await db.RoomModel.find({});
    pubsub.publish(`all_rooms`, {
      room: {
        data: all_rooms,
      }
    });
    return roomName;
  },

};

export default Mutation;
