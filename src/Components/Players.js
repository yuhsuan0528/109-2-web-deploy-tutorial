import React from 'react'
import CharCard from './CharCard.js'
import {message} from 'antd'
import {useEffect, useState} from 'react'

function Players({playersParams}) {
    const {me, status, setMembersToChoose, setMembersChosen , membersChosen, membersToChoose, roomInfo, assassinate} = playersParams
    const [twoRow, setTwoRow] = useState(false)
    useEffect(() => {
        const statusMe = status.find(player => player.name === me)
        console.log(statusMe)
        if (statusMe && roomInfo){
            if (statusMe.isLeader && roomInfo.status.includes('assign')) message.info(`目前隊員: ${membersChosen}`)
        }
        
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

    useEffect(() => {
        if (status.length > 6) setTwoRow(true)
    },[status.length])

    if (!twoRow){
        return (
            <>
                <br />
                <table className="player-section" style={{border: "1 #264653"}}>
                    <tbody>
                        <tr>
                            {status.map((data, index) => (<td><CharCard key={index} cardStatus={data} cardParams={cardParams}/></td>))}
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }
    else{
        const top = status.slice(0,5)
        const bottom = status.slice(5)
        return(
            <>
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
            </>
        )
    }
}

export default Players
