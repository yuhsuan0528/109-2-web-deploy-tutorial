import React from 'react'
import CharCard from './CharCard.js'
import {message} from 'antd'
import {useEffect, useRef} from 'react'

function Players({playersParams}) {
    const {me, status, setMembersToChoose, setMembersChosen , membersChosen, membersToChoose, roomInfo, assassinate} = playersParams
    let twoRow = false
    const notInitialRender = useRef(false)
    useEffect(() => {
        const statusMe = status.find(player => player.name === me)
        if (statusMe){
            if (notInitialRender.current && statusMe.isLeader) message.info(`目前隊員: ${membersChosen}`)
        }
        else notInitialRender.current = true
        
    },[membersChosen])

    const cardParams = {
        me:me,
        twoRow: twoRow,
        membersToChoose: membersToChoose,
        setMembersToChoose: setMembersToChoose,
        membersChosen: membersChosen,
        setMembersChosen: setMembersChosen,
        roomInfo: roomInfo,
        assassinate:assassinate
    }

    if (status.length<=6){
        return (
            <table className="player-section" style={{border: "1 #264653"}}>
                <tbody>
                    <tr>
                        {status.map((data, index) => (<td><CharCard key={index} cardStatus={data} cardParams={cardParams}/></td>))}
                    </tr>
                </tbody>
            </table>
        )
    }
    else{
        twoRow = true
        const top = status.slice(0,5)
        const bottom = status.slice(5)
        return(
        <table className="player-section" border="0">
            <tbody>
                <tr>
                    {top.map((data, index) => (<td><CharCard key={index} cardStatus={data} cardParams={cardParams}/></td>))}
                </tr>
                <tr>
                    {bottom.map((data, index) => (<td><CharCard key={index} cardStatus={data} cardParams={cardParams}/></td>))}
                </tr>
            </tbody>
        </table>
        )
    }
}

export default Players
