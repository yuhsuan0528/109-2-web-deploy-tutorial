import React from 'react'
import CharCard from './CharCard.js'
import {message} from 'antd'
import {useEffect, useRef} from 'react'

function Players({me, status, setMembersToChoose, setMembersChosen , membersChosen, membersToChoose, roomInfo}) {
    let twoRow = false
    const notInitialRender = useRef(false)
    useEffect(() => {
        if (notInitialRender.current) message.info(`Current members: ${membersChosen}`)
        else notInitialRender.current = true
    },[membersChosen])

    if (status.length<=6){
        return (
            <table className="player-section" border="0">
                <tbody>
                    <tr>
                        {status.map((data, index) => (<td><CharCard key={index} me={me} twoRow={twoRow} cardStatus={data} setMembersToChoose={setMembersToChoose} setMembersChosen={setMembersChosen} membersChosen={membersChosen} membersToChoose={membersToChoose} roomInfo={roomInfo}/></td>))}
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
                    {top.map((data, index) => (<td><CharCard key={index} me={me} twoRow={twoRow} cardStatus={data} setMembersToChoose={setMembersToChoose} setMembersChosen={setMembersChosen} membersChosen={membersChosen} membersToChoose={membersToChoose} roomInfo={roomInfo}/></td>))}
                </tr>
                <tr>
                    {bottom.map((data, index) => (<td><CharCard key={index} me={me} twoRow={twoRow} cardStatus={data} setMembersToChoose={setMembersToChoose} setMembersChosen={setMembersChosen} membersChosen={membersChosen} membersToChoose={membersToChoose} roomInfo={roomInfo}/></td>))}
                </tr>
            </tbody>
        </table>
        )
    }
}

export default Players
