import React from 'react'
import CharCard from './CharCard.js'
import {message} from 'antd'
import {useEffect} from 'react'

function Players({status, setMembersToChoose, setMembersChosen , membersChosen, membersToChoose}) {
    let twoRow = false
    useEffect(() => {
        message.info(`Current members: ${membersChosen}`)
    },[membersChosen])
    if (status.length<=6){
        return (
            <table className="player-section" border="0">
                <tbody>
                    <tr>
                        {status.map((data, index) => (<td><CharCard key={index} twoRow={twoRow} cardStatus={data} setMembersToChoose={setMembersToChoose} setMembersChosen={setMembersChosen} membersChosen={membersChosen} membersToChoose={membersToChoose}/></td>))}
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
                    {top.map((data, index) => (<td><CharCard key={index} twoRow={twoRow} cardStatus={data} setMembersToChoose={setMembersToChoose} setMembersChosen={setMembersChosen} membersChosen={membersChosen} membersToChoose={membersToChoose}/></td>))}
                </tr>
                <tr>
                    {bottom.map((data, index) => (<td><CharCard key={index} twoRow={twoRow} cardStatus={data} setMembersToChoose={setMembersToChoose} setMembersChosen={setMembersChosen} membersChosen={membersChosen} membersToChoose={membersToChoose}/></td>))}
                </tr>
            </tbody>
        </table>
        )
    }
}

export default Players
