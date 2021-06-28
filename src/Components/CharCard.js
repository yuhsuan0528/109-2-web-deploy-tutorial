import React from 'react'
import {message} from 'antd'
import {useState, useEffect, useRef} from 'react'

function CharCard({cardStatus, twoRow, setMembersToChoose, setMembersChosen, membersChosen, membersToChoose}) {
    const {name, isMe, character, isLeader, isAssigned, vote} = cardStatus
    const [selected, setSelected] = useState(false)
    const notInitialRender = useRef(false)
    let teamDir = ''
    const charDict = {
        'GM': 'images/good_people_merlin.jpg',
        'P': 'images/good_people_percival.jpg',
        'GN': 'images/good_people_normal_1.jpg',
        'BM': 'images/bad_people_morgana.jpg',
        'A': 'images/bad_people_assassin.jpg',
        'G': 'images/good_people_normal_1.jpg',
        'B': 'images/bad_people_normal_1.jpg',
        'M': 'images/merlin_morgana.jpg',
        'null': 'images/character_unknown.png',
    }

    const voteDict = {
        'true': 'images/symbol_vote_yay.jpg',
        'false': 'images/symbol_vote_nay.jpg',
        'null': ''
    }

    const charDir = charDict[character]
    const voteDir = voteDict[vote]

    if (isLeader) {
        teamDir = 'images/marker_leader.jpg'
    }
    else if (isAssigned) {
        teamDir = 'images/marker_team.jpg'
    }

    let cardClass = "left-side-character-card-big"
    let markerClass = "marker-big"
    if (twoRow){
        cardClass="left-side-character-card-small"
        markerClass = "marker-small"
    }
    const clickHandler = () => {
        if (membersToChoose === 0 && !selected) {
            message.info('Team is full!')
        } else {
            setSelected(!selected)
        }
    }
    useEffect(() => {
        if (notInitialRender.current){
            if(selected){
                message.info(`selected ${name}`)
                setMembersToChoose(prev => prev - 1)
                setMembersChosen([...membersChosen, name])
            } else {
                message.info(`unselected ${name}`)
                setMembersToChoose(prev => prev + 1)
                setMembersChosen(membersChosen.filter(person => person !== name))
            }
        } else {
            notInitialRender.current = true
        }
        
    },[selected])
    return (
        <>
            <img className={cardClass} src={charDir} onClick={clickHandler}/>
            <img className={markerClass} src={voteDir}/>
            <img className={markerClass} src={teamDir}/>
        </>
    )
}

export default CharCard
