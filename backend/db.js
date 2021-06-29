import mongoose from 'mongoose';

const { Schema } = mongoose;

const playerSchema = new Schema({
  name: { type: String, required: true },
  keyword: { type: String, required: false },
  room: { type: mongoose.Types.ObjectId, ref: 'Room' },
  is_leader: { type: Boolean, required: false },
  is_assigned: { type: Boolean, required: false },
  vote: { type: String, required: false },
  players_list: [{ type: mongoose.Types.ObjectId, ref: 'PlayerInfo' }],
});

const playerInfoSchema = new Schema({
  name: { type: String, required: true },
  me: { type: Boolean, required: true },
  character: { type: String, required: true },
});

const roomSchema = new Schema({
  name: { type: String, required: true },
  host: { type: String, required: true },
  passwd: { type: String, required: true },
  num_of_players: { type: Number, required: true },
  status: { type: String, required: true },
  players: [{ type: mongoose.Types.ObjectId, ref: 'Player' }],
  messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
  cup_results: [{ type: mongoose.Types.ObjectId, ref: 'CupResult' }],
  vote_results: [{ type: mongoose.Types.ObjectId, ref: 'VoteResult' }],
});

const cupResultSchema = new Schema({
  good: { type: Number, required: true },
  bad: { type: Number, required: true },
  player: [{ type: Number, required: true }],
});

const voteResultSchema = new Schema({
  vote: [{ type: String, required: true }],
});

const messageSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, ref: 'Player' },
  body: { type: String, required: true },
});


const PlayerModel = mongoose.model('Player', playerSchema);
const PlayerInfoModel = mongoose.model('PlayerInfo', playerInfoSchema);
const RoomModel = mongoose.model('Room', roomSchema);
const CupResultModel = mongoose.model('CupResult', cupResultSchema);
const VoteResultModel = mongoose.model('VoteResult', voteResultSchema);
const MessageModel = mongoose.model('Message', messageSchema);


export default { PlayerModel, PlayerInfoModel, RoomModel, CupResultModel, VoteResultModel, MessageModel }
