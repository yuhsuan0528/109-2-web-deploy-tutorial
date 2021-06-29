import React from 'react'
import {message} from 'antd'
import {useState, useEffect} from 'react'

function CharCard({cardStatus, cardParams}) {
    const {me, twoRow, membersToChoose, setMembersToChoose, membersChosen, setMembersChosen, roomInfo, assassinate} = cardParams
    const {name, me:isMe, character, isLeader, isAssigned, vote} = cardStatus
    const [selected, setSelected] = useState(false)
    let teamDir = ''
    const charDict = {
        'GM': 'images/good_people_merlin.jpg',
        'P': 'images/good_people_percival.jpg',
        'GN': 'images/good_people_normal_1.jpg',
        'BM': 'images/bad_people_morgana.jpg',
        'A': 'images/bad_people_assassin.jpg',
        'G': 'images/good_people_normal_1.jpg',
        'B': 'images/bad_people_unknown.jpg',
        'M': 'images/merlin_morgana.jpg',
        'null': 'images/character_unknown.jpg',
        'O': 'images/bad_people_oberon.jpg',
        'MO': 'images/bad_people_mordred.jpg'
    }

    const voteDict = {
        'true': 'images/symbol_vote_yay.jpg',
        'false': 'images/symbol_vote_nay.jpg',
        'null': 'images/symbol_vote_unknown.jpg'
    }

    const charDir = charDict[character]
    const voteDir = voteDict[vote]

    if (isLeader) {
        if (isAssigned) teamDir = 'images/marker_leader_team.jpg'
        else teamDir = 'images/marker_leader.jpg'
    } else if (isAssigned) {
        teamDir = 'images/marker_team.jpg'
    }
    const clickHandler = () => {
        const self = roomInfo.players.find(player => player.name === me)
        if(roomInfo.status.includes('assign') && self.is_leader){
            if (membersToChoose === 0 && !selected) {
                message.info('隊伍人已經滿了!')
            } else {
                setSelected(!selected)
            }
        }
        const playerListSelf = self.players_list.find(player => player.name === me)
        if (roomInfo.status.includes('assassin') && playerListSelf.character === 'A'){
            message.info(`assassinate ${name}`)
            assassinate({
                variables:{
                  roomName: roomInfo.name,
                  playerName: me,
                  targetName: name,
                }
              })
        }
    }
    useEffect(() => {
        if(selected){
            setMembersToChoose(prev => prev - 1)
            setMembersChosen([...membersChosen, name])
        } else {
            setMembersToChoose(prev => prev + 1)
            setMembersChosen(membersChosen.filter(person => person !== name))
        }        
    },[selected])

    useEffect(() =>{
        setSelected(false)
    },[roomInfo.status])
    const me_name = isMe? `${name}⭐`:name
    if (!twoRow) {
        return (
            <>
                <p align='center' style={{lineHeight: '8px', paddingLeft: '5px'}}>{me_name}</p>
                <img className="left-side-character-card-big" src={charDir} onClick={clickHandler}/><br />
                <img className="marker-big" src={voteDir}/>
                <img className="marker-big" src={teamDir}/>
            </>
        )
    } else {
        return (
            <>
                <p align='center' style={{lineHeight: '8px', paddingRight: '40px'}}>{me_name}</p>
                <img className="left-side-character-card-small" src={charDir} onClick={clickHandler}/>
                <img className="marker-small" src={voteDir}/>
                <img className="marker-small" src={teamDir}/>
            </>
        )
    }
    
}

export default CharCard
