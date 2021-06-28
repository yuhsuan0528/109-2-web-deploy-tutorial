const Player = {
  async room( parent, args, { db }, info ) {
  	const my_room = await db.PlayerModel.findById(parent.room);
  	return my_room;
  },

  players_list( parent, args, { db }, info ) {
    return Promise.all(
      parent.players_list.map((pId) =>
        db.PlayerInfoModel.findById(pId)), 
    );
  },

}

export default Player;