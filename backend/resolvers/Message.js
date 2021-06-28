const Message = {
  async sender( parent, args, { db }, info ) {
  	const player = await db.PlayerModel.findById(parent.sender);
  	return player;
  }
}

export default Message;