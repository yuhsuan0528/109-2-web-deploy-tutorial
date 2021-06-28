const Room = {
  players( parent, args, { db }, info ) {
    return Promise.all(
      parent.players.map((pId) =>
        db.PlayerModel.findById(pId)), 
    );
  },

  messages( parent, args, { db }, info ) {
    return Promise.all(
      parent.messages.map((mId) =>
        db.MessageModel.findById(mId)), 
    );
  },

  cup_results( parent, args, { db }, info ) {
    return Promise.all(
      parent.cup_results.map((cId) =>
        db.CupResultModel.findById(cId)), 
    );
  },

  vote_results( parent, args, { db }, info ) {
    return Promise.all(
      parent.vote_results.map((vId) =>
        db.VoteResultModel.findById(vId)), 
    );
  },
  
}

export default Room;